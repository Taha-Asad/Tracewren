import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from './database/prisma.service.js';
import { OperationalLabel, ReportState } from '@prisma/client';
import * as crypto from 'crypto';
import { fetchPublicPrograms, fetchPublicProgramBySlug } from './public-programs.helper.js';

export function computeReportDisplayId(progNameOrSlug?: string, orgNameOrSlug?: string, seq = 1): string {
  const base = (progNameOrSlug || orgNameOrSlug || 'BBT').trim();
  const parts = base.split(/[\s\-_]+/).filter(Boolean);
  let prefix = '';
  if (parts.length > 1) {
    prefix = parts.map((p) => p[0].toUpperCase()).join('').slice(0, 4);
  } else if (base.length <= 4) {
    prefix = base.toUpperCase();
  } else {
    prefix = base.slice(0, 4).toUpperCase();
  }
  if (base.toLowerCase() === 'taha') prefix = 'TH';
  const num = String(seq).padStart(2, '0');
  return `${prefix}-${num}`;
}

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);
  private readonly inMemoryPrograms: any[] = [];
  private readonly inMemoryReports: any[] = [];
  private readonly inMemoryDiscussions: any[] = [];

  constructor(private readonly prisma: PrismaService) {}

  getHello(): string {
    return 'Hello World!';
  }

  async findReport(reportId: string): Promise<any> {
    if (!reportId) return null;
    const clean = reportId.trim();

    // 1. Direct displayId match (e.g. TH-01, PD-01, CVD-01)
    try {
      const byDisplayId = await this.prisma.report.findFirst({
        where: {
          displayId: { equals: clean, mode: 'insensitive' },
        },
        include: { organization: true, program: true, assignedDefender: true },
      });
      if (byDisplayId) return byDisplayId;
    } catch {}

    // 2. Direct UUID match
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(clean);
    if (isUuid) {
      try {
        const found = await this.prisma.report.findUnique({
          where: { id: clean },
          include: { organization: true, program: true, assignedDefender: true },
        });
        if (found) return found;
      } catch {
        // Fallback to prefix
      }
    }

    const prefix = clean.toUpperCase().startsWith('REP-')
      ? clean.substring(4).toLowerCase()
      : clean.toLowerCase();

    if (prefix && prefix.length >= 6) {
      try {
        const matchingReports = await this.prisma.$queryRawUnsafe<any[]>(
          `SELECT id FROM bbt_core.reports WHERE id::text LIKE $1 LIMIT 1`,
          `${prefix}%`
        );
        if (matchingReports.length > 0) {
          return this.prisma.report.findUnique({
            where: { id: matchingReports[0].id },
            include: { organization: true, program: true, assignedDefender: true },
          });
        }
      } catch {
        // Fallback
      }
    }

    try {
      return await this.prisma.report.findFirst({
        where: {
          titleCiphertext: { contains: clean, mode: 'insensitive' },
        },
        include: { organization: true, program: true, assignedDefender: true },
      });
    } catch {
      return null;
    }
  }

  async getPublicPrograms(): Promise<any[]> {
    return fetchPublicPrograms(this.prisma);
  }

  async getPublicProgramBySlug(slug: string): Promise<any | null> {
    return fetchPublicProgramBySlug(this.prisma, slug);
  }

  async getPrograms(orgId?: string, orgSlug?: string): Promise<any[]> {
    try {
      const where: any = {};
      if (orgId && orgId.trim().length > 0 && orgId !== 'org-acme-cyber') {
        where.organizationId = orgId.trim();
      } else if (orgSlug && orgSlug.trim().length > 0 && orgSlug !== 'acme-cyber') {
        where.organization = { slug: orgSlug.trim() };
      }

      // If a specific tenant organization was requested, return strictly its programs
      if (where.organizationId || where.organization) {
        const dbProgs = await this.prisma.program.findMany({
          where,
          include: {
            organization: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
            _count: {
              select: {
                reports: true,
                defenders: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        });
        return dbProgs.map((p) => ({
          id: p.id,
          organizationId: p.organizationId,
          name: p.name,
          slug: p.slug,
          visibility: p.visibility,
          recipientSetVersion: p.recipientSetVersion,
          recoveryPublicKey: p.recoveryPublicKey,
          policyMarkdown: p.policyMarkdown,
          createdAt: p.createdAt,
          updatedAt: p.updatedAt,
          organization: p.organization,
          activeReportsCount: p._count?.reports ?? 0,
          defendersCount: p._count?.defenders ?? 1,
        }));
      }

      // If demo tenant requested (or fallback to demo), return Acme Cyber programs
      if (orgId === 'org-acme-cyber' || orgSlug === 'acme-cyber') {
        const acmeOrg = await this.prisma.organization.findFirst({
          where: {
            OR: [
              { slug: 'acme-cyber' },
              { slug: { startsWith: 'acme' } },
            ],
          },
          include: { programs: true },
        });
        if (acmeOrg && acmeOrg.programs && acmeOrg.programs.length > 0) {
          return acmeOrg.programs;
        }
        return this.inMemoryPrograms.filter(
          (p) => !p.organizationId || p.organizationId === 'org-acme-cyber',
        );
      }

      // Strict multi-tenancy: un-scoped queries must not leak all tenant programs
      return [];
    } catch {
      // Fallback
    }
    return this.inMemoryPrograms;
  }

  async createProgram(body: any): Promise<{ success: boolean; program: any }> {
    const slug = (body.slug || '').toLowerCase().trim();
    const name = body.name || slug;
    const visibility = body.visibility === 'INVITE_ONLY' ? 'INVITE_ONLY' : 'PUBLIC';
    const policyMarkdown = body.safeHarborPolicy || 'Standard safe harbor terms applied.';

    try {
      let targetOrgId = body.organizationId;
      if (!targetOrgId && body.orgSlug) {
        const found = await this.prisma.organization.findUnique({ where: { slug: body.orgSlug } });
        if (found) targetOrgId = found.id;
      }
      if (!targetOrgId || targetOrgId === 'org-acme-cyber') {
        const firstOrg = await this.prisma.organization.findFirst({
          where: body.orgSlug ? { slug: body.orgSlug } : undefined,
        });
        if (firstOrg) targetOrgId = firstOrg.id;
      }

      if (targetOrgId) {
        const prog = await this.prisma.program.create({
          data: {
            organizationId: targetOrgId,
            name,
            slug,
            visibility,
            recoveryPublicKey: 'Curve25519-Offline-Recovery-Key',
            policyMarkdown,
          },
        });
        this.logger.log(`Created program [${prog.slug}] in database for tenant [${targetOrgId}]`);
        return { success: true, program: prog };
      }
    } catch (err: unknown) {
      this.logger.warn(
        `Could not save program to DB (using memory store): ${err instanceof Error ? err.message : String(err)}`,
      );
    }

    const memoryProg = {
      id: `prog-${Date.now()}`,
      organizationId: body.organizationId || 'org-acme-cyber',
      name,
      slug,
      visibility,
      inScope: body.inScope || [],
      safeHarborPolicy: policyMarkdown,
      activeReportsCount: 0,
      defendersCount: 1,
      createdAt: new Date().toISOString(),
    };
    this.inMemoryPrograms.push(memoryProg);
    return { success: true, program: memoryProg };
  }

  async getDefenders(orgId?: string, orgSlug?: string): Promise<any[]> {
    try {
      let targetOrgId = orgId;
      if (!targetOrgId && orgSlug) {
        const found = await this.prisma.organization.findUnique({ where: { slug: orgSlug } });
        if (found) targetOrgId = found.id;
      }
      if (targetOrgId && targetOrgId !== 'org-acme-cyber') {
        const [defenders, reportCounts] = await Promise.all([
          this.prisma.programDefender.findMany({
            where: { organizationId: targetOrgId },
            include: {
              user: {
                select: {
                  id: true,
                  fullName: true,
                  email: true,
                  memberships: {
                    where: { organizationId: targetOrgId },
                    select: { role: true },
                  },
                },
              },
              program: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                },
              },
            },
            orderBy: { assignedAt: 'asc' },
          }),
          this.prisma.report.groupBy({
            by: ['assignedDefenderId'],
            where: { organizationId: targetOrgId },
            _count: { _all: true },
          }),
        ]);

        const assignedMap = new Map<string, number>();
        for (const item of reportCounts) {
          if (item.assignedDefenderId) {
            assignedMap.set(item.assignedDefenderId, item._count._all);
          }
        }

        return defenders.map((d) => {
          const orgRole = d.user?.memberships?.[0]?.role;
          let role = 'TRIAGER';
          if (orgRole === 'ORG_OWNER') {
            role = 'ORG_OWNER';
          } else if (orgRole === 'ORG_ADMIN') {
            role = 'ORG_ADMIN';
          } else if (d.role === 'LEAD_TRIAGER') {
            role = 'LEAD_TRIAGER';
          } else if (d.role === 'REVIEWER') {
            role = 'REVIEWER';
          } else if (d.role === 'REMEDIATOR') {
            role = 'REMEDIATOR';
          }

          return {
            id: d.id,
            userId: d.userId,
            name: d.user?.fullName || d.user?.email.split('@')[0] || 'Defender',
            email: d.user?.email || '',
            role,
            programName: d.program?.name || 'Security Program',
            programSlug: d.program?.slug || '',
            keyStatus: 'Curve25519 Active Key',
            keyFingerprint: `sha256:${d.id.replace(/-/g, '').substring(0, 16)}`,
            activeReportsAssigned: d.userId ? (assignedMap.get(d.userId) || 0) : 0,
            avatarColor: orgRole === 'ORG_OWNER' ? 'teal' : 'blue',
          };
        });
      }
    } catch (err: unknown) {
      this.logger.warn(
        `Could not load defenders from DB: ${err instanceof Error ? err.message : String(err)}`,
      );
    }
    return [];
  }

  async getReports(orgId?: string, orgSlug?: string): Promise<any[]> {
    try {
      let targetOrgId = orgId;
      if (!targetOrgId && orgSlug) {
        const found = await this.prisma.organization.findUnique({ where: { slug: orgSlug } });
        if (found) targetOrgId = found.id;
      }
      if (targetOrgId && targetOrgId !== 'org-acme-cyber') {
        const reports = await this.prisma.report.findMany({
          where: { organizationId: targetOrgId },
          include: {
            program: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
            assignedDefender: {
              select: {
                id: true,
                fullName: true,
                email: true,
              },
            },
            hunter: {
              select: {
                id: true,
                fullName: true,
                email: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        });

        let defaultDefenderName = 'Taha Asadullah (Owner)';
        try {
          const leadDef = await this.prisma.programDefender.findFirst({
            where: { organizationId: targetOrgId, isActive: true },
            include: { user: true },
            orderBy: { assignedAt: 'asc' },
          });
          if (leadDef?.user) {
            defaultDefenderName = leadDef.user.fullName || leadDef.user.email;
          }
        } catch {}

        const usedIds = new Set(reports.map((r) => r.displayId).filter(Boolean) as string[]);
        const mapped = reports.map((r) => {
          const cvssNum = r.cvssScore ? Number(r.cvssScore) : 6.5;
          let severity: 'Critical' | 'High' | 'Medium' | 'Low' = 'Medium';
          if (cvssNum >= 9.0) severity = 'Critical';
          else if (cvssNum >= 7.0) severity = 'High';
          else if (cvssNum >= 4.0) severity = 'Medium';
          else severity = 'Low';

          let status: 'Retest pending' | 'Triaged' | 'Resolved' | 'Under review' = 'Under review';
          if (r.state === ReportState.ACCEPTED) status = 'Triaged';
          else if (r.state === ReportState.RETEST_PENDING || r.state === ReportState.FIX_PROPOSED) status = 'Retest pending';
          else if (r.state === ReportState.VERIFIED_INTERNAL || r.state === ReportState.VERIFIED_RESEARCHER) status = 'Resolved';
          else status = 'Under review';

          const assignedName = r.assignedDefender
            ? (r.assignedDefender.fullName || r.assignedDefender.email)
            : defaultDefenderName;

          let stringId = r.displayId;
          if (!stringId) {
            let seq = 1;
            stringId = computeReportDisplayId(r.program?.name || r.program?.slug, targetOrgId, seq);
            while (usedIds.has(stringId)) {
              seq++;
              stringId = computeReportDisplayId(r.program?.name || r.program?.slug, targetOrgId, seq);
            }
            usedIds.add(stringId);
          }

          return {
            id: stringId,
            reportId: stringId,
            uuid: r.id,
            title: r.titleCiphertext,
            summary: r.encryptedPayload,
            severity,
            cvss: cvssNum,
            status,
            bounty: severity === 'Critical' ? '$3,000' : severity === 'High' ? '$2,000' : severity === 'Medium' ? '$1,000' : '$400',
            environment: 'Production',
            version: 'v0.8.4',
            assignedDefender: assignedName,
            assignedDefenderId: r.assignedDefenderId,
            assignedDefenderEmail: r.assignedDefender?.email,
            targetAsset: r.assetScope || 'api.caulvyn.com',
            programSlug: r.program?.slug || 'taha',
            reporter: r.reporterLabel
              ? r.reporterLabel
              : r.hunter
              ? (r.hunter.fullName || r.hunter.email)
              : 'Anonymous Researcher',
            createdAt: r.createdAt.toLocaleDateString(),
            updatedAt: r.updatedAt ? r.updatedAt.toLocaleDateString() : 'Just now',
          };
        });

        return mapped;
      }
    } catch (err: unknown) {
      this.logger.warn(
        `Could not load reports from DB: ${err instanceof Error ? err.message : String(err)}`,
      );
    }

    return this.inMemoryReports.filter(
      (r) => !orgId || r.organizationId === orgId || r.organizationId === 'org-acme-cyber',
    );
  }

  async createReport(body: any): Promise<{ success: boolean; report: any }> {
    try {
      let targetOrgId = body.organizationId;
      if (!targetOrgId && body.orgSlug) {
        const found = await this.prisma.organization.findUnique({ where: { slug: body.orgSlug } });
        if (found) targetOrgId = found.id;
      }
      if (!targetOrgId || targetOrgId === 'org-acme-cyber') {
        const firstOrg = await this.prisma.organization.findFirst({
          where: body.orgSlug ? { slug: body.orgSlug } : undefined,
        });
        if (firstOrg) targetOrgId = firstOrg.id;
      }

      if (targetOrgId) {
        let program = null;
        if (body.programSlug) {
          program = await this.prisma.program.findFirst({
            where: { organizationId: targetOrgId, slug: body.programSlug },
          });
        }
        if (!program) {
          program = await this.prisma.program.findFirst({
            where: { organizationId: targetOrgId },
          });
        }

        if (program) {
          const cvssVal = body.cvss !== undefined ? Number(body.cvss) : 6.5;
          let label: OperationalLabel = OperationalLabel.UNSPECIFIED_SECURITY_DEFECT;
          if (body.severity === 'Critical') label = OperationalLabel.AUTHENTICATION_BYPASS;
          else if (body.severity === 'High') label = OperationalLabel.REMOTE_CODE_EXECUTION;
          else if (body.severity === 'Medium') label = OperationalLabel.INJECTION_VULNERABILITY;

          const title = (body.title || 'Untitled Security Report').trim();
          const summary = (body.summary || '').trim();
          const digest = crypto.createHash('sha256').update(summary).digest('hex');

          let assignedUserId: string | null = null;
          if (body.assignedDefenderEmail) {
            const defUser = await this.prisma.user.findUnique({ where: { email: body.assignedDefenderEmail.toLowerCase().trim() } });
            if (defUser) assignedUserId = defUser.id;
          }
          if (!assignedUserId) {
            const leadProgDef = await this.prisma.programDefender.findFirst({
              where: { programId: program.id, isActive: true },
              orderBy: { assignedAt: 'asc' },
            });
            if (leadProgDef) assignedUserId = leadProgDef.userId;
          }

          const existingCount = await this.prisma.report.count({
            where: { programId: program.id },
          });
          let seq = existingCount + 1;
          let displayId = computeReportDisplayId(program.name || program.slug, body.orgSlug || program.slug, seq);
          while (await this.prisma.report.findFirst({ where: { displayId } }).catch(() => null)) {
            seq++;
            displayId = computeReportDisplayId(program.name || program.slug, body.orgSlug || program.slug, seq);
          }

          const created = await this.prisma.report.create({
            data: {
              organizationId: targetOrgId,
              programId: program.id,
              displayId,
              reporterLabel: body.reporter ? String(body.reporter).trim() : (body.hunterId ? undefined : 'Anonymous Researcher'),
              hunterId: body.hunterId || undefined,
              operationalLabel: label,
              assetScope: (body.targetAsset || `https://${program.slug}.caulvyn.com/api`).trim(),
              cvssScore: cvssVal,
              cvssSuggested: cvssVal,
              cvssVector: body.cvssVector || `CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H`,
              titleCiphertext: title,
              encryptedPayload: summary,
              payloadBodySha256: digest,
              state: ReportState.NEW,
              assignedDefenderId: assignedUserId,
            },
            include: { program: true, assignedDefender: true },
          });

          this.logger.log(`Created report [${created.id}] (displayId: ${displayId}) for program [${program.slug}] in DB`);

          const assignedName = created.assignedDefender
            ? (created.assignedDefender.fullName || created.assignedDefender.email)
            : 'Unassigned';

          const mapped = {
            id: displayId,
            reportId: displayId,
            uuid: created.id,
            title: created.titleCiphertext,
            summary: created.encryptedPayload,
            severity: body.severity || 'Medium',
            cvss: cvssVal,
            status: 'Under review',
            bounty: (body.severity === 'Critical') ? '$3,000' : (body.severity === 'High') ? '$2,000' : (body.severity === 'Medium') ? '$1,000' : '$400',
            environment: 'Production',
            version: 'v0.8.4',
            assignedDefender: assignedName,
            assignedDefenderId: created.assignedDefenderId,
            assignedDefenderEmail: created.assignedDefender?.email,
            targetAsset: created.assetScope,
            programSlug: program.slug,
            reporter: created.reporterLabel || 'Anonymous Researcher',
            createdAt: created.createdAt.toLocaleDateString(),
            updatedAt: 'Just now',
          };

          return { success: true, report: mapped };
        }
      }
    } catch (err: unknown) {
      this.logger.warn(
        `Could not save report to DB (fallback to memory): ${err instanceof Error ? err.message : String(err)}`,
      );
    }

    const memoryReport = {
      id: `rep-${Date.now()}`,
      reportId: `REP-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
      title: body.title || 'Security Report',
      summary: body.summary || '',
      severity: body.severity || 'Medium',
      cvss: Number(body.cvss) || 6.5,
      status: 'Under review',
      bounty: '$1,000',
      environment: 'Production',
      version: 'v0.8.4',
      assignedDefender: body.reporter || 'Taha Asadullah (Owner)',
      targetAsset: body.targetAsset || 'api.caulvyn.com',
      programSlug: body.programSlug || 'security',
      reporter: body.reporter || 'Taha Asadullah (Owner)',
      createdAt: 'Just now',
      updatedAt: 'Just now',
      organizationId: body.organizationId || 'org-acme-cyber',
    };
    this.inMemoryReports.unshift(memoryReport);
    return { success: true, report: memoryReport };
  }

  async getDiscussions(reportId: string): Promise<any[]> {
    try {
      const report = await this.findReport(reportId);
      if (report) {
        const msgs = await this.prisma.discussionMessage.findMany({
          where: { reportId: report.id },
          include: {
            senderUser: {
              include: {
                memberships: {
                  where: { organizationId: report.organizationId },
                },
                assignedPrograms: {
                  where: { programId: report.programId },
                },
              },
            },
          },
          orderBy: { createdAt: 'asc' },
        });

        if (msgs.length > 0) {
          return msgs.map((m) => {
            let roleLabel = 'Program Triager';
            if (m.senderActorType === 'HUNTER') {
              roleLabel = 'Security Researcher';
            } else {
              const orgRole = m.senderUser?.memberships?.[0]?.role;
              const progRole = m.senderUser?.assignedPrograms?.[0]?.role;
              if (orgRole === 'ORG_OWNER') {
                roleLabel = 'Organization Owner';
              } else if (orgRole === 'ORG_ADMIN') {
                roleLabel = 'Organization Admin';
              } else if (progRole === 'LEAD_TRIAGER') {
                roleLabel = 'Lead Triager';
              } else if (progRole === 'REVIEWER') {
                roleLabel = 'Code Reviewer';
              } else if (progRole === 'REMEDIATOR') {
                roleLabel = 'Remediation Engineer';
              } else {
                roleLabel = 'Program Triager';
              }
            }

            const displayId = report.displayId || reportId;
            return {
              id: m.id,
              reportId: displayId,
              reportDisplayId: displayId,
              reportUuid: report.id,
              reportTitle: report.titleCiphertext,
              senderName:
                m.senderUser?.fullName ||
                m.senderUser?.email?.split('@')[0] ||
                (m.senderActorType === 'HUNTER' ? 'Alex Rivera' : 'Taha Asadullah'),
              senderRole: roleLabel,
              senderActorType: m.senderActorType,
              lane: m.lane,
              content: m.encryptedBody,
              createdAt: m.createdAt.toLocaleDateString() + ' ' + m.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              isEncrypted: true,
            };
          });
        }
      }
    } catch (err: unknown) {
      this.logger.warn(`Could not load discussions: ${err instanceof Error ? err.message : String(err)}`);
    }

    return this.inMemoryDiscussions.filter((d) => !reportId || d.reportId === reportId);
  }

  async postDiscussion(reportId: string, body: any): Promise<{ success: boolean; message: any }> {
    try {
      const report = await this.findReport(reportId);
      if (report) {
        const content = (body.content || '').trim();
        const digest = crypto.createHash('sha256').update(content).digest('hex');
        const lane = body.lane === 'REVIEWER_INTERNAL' ? 'REVIEWER_INTERNAL' : 'RESEARCHER_ORG';
        const actorType = body.senderActorType === 'HUNTER' ? 'HUNTER' : 'DEFENDER';

        let senderUserId = body.userId || null;
        if (!senderUserId && body.senderEmail) {
          const user = await this.prisma.user.findUnique({ where: { email: body.senderEmail } });
          if (user) senderUserId = user.id;
        }

        const created = await this.prisma.discussionMessage.create({
          data: {
            reportId: report.id,
            lane,
            senderActorType: actorType,
            senderUserId,
            encryptedBody: content,
            bodySha256: digest,
          },
        });

        const displayId = report.displayId || reportId;
        const mapped = {
          id: created.id,
          reportId: displayId,
          reportDisplayId: displayId,
          reportUuid: report.id,
          reportTitle: report.titleCiphertext,
          senderName: body.senderName || 'Taha Asadullah',
          senderRole: body.senderRole || 'Program Triager',
          senderActorType: actorType,
          lane,
          content,
          createdAt: 'Just now',
          isEncrypted: true,
        };

        return { success: true, message: mapped };
      }
    } catch (err: unknown) {
      this.logger.warn(`Could not save discussion to DB: ${err instanceof Error ? err.message : String(err)}`);
    }

    const memoryMsg = {
      id: `msg-${Date.now()}`,
      reportId,
      reportTitle: body.reportTitle || 'Security Discussion',
      senderName: body.senderName || 'Taha Asadullah',
      senderRole: body.senderRole || 'Lead Triager',
      senderActorType: body.senderActorType || 'DEFENDER',
      lane: body.lane || 'RESEARCHER_ORG',
      content: body.content || '',
      createdAt: 'Just now',
      isEncrypted: true,
    };
    this.inMemoryDiscussions.push(memoryMsg);
    return { success: true, message: memoryMsg };
  }

  async assignDefender(reportId: string, body: any): Promise<{ success: boolean; report: any }> {
    try {
      const report = await this.findReport(reportId);
      if (!report) {
        throw new NotFoundException(`Report ${reportId} not found.`);
      }

      let targetUserId = body.defenderId;
      if (!targetUserId && body.defenderEmail) {
        const user = await this.prisma.user.findUnique({ where: { email: body.defenderEmail.toLowerCase().trim() } });
        if (user) targetUserId = user.id;
      }

      let updated = report;
      if (targetUserId) {
        updated = await this.prisma.report.update({
          where: { id: report.id },
          data: { assignedDefenderId: targetUserId },
          include: { program: true, assignedDefender: true },
        });
      }

      const assignedName = updated.assignedDefender
        ? (updated.assignedDefender.fullName || updated.assignedDefender.email)
        : (body.defenderName || 'Unassigned');

      return {
        success: true,
        report: {
          id: updated.id,
          reportId: `REP-${updated.id.substring(0, 8).toUpperCase()}`,
          assignedDefender: assignedName,
          assignedDefenderId: updated.assignedDefenderId,
          assignedDefenderEmail: updated.assignedDefender?.email,
        },
      };
    } catch (err: unknown) {
      this.logger.warn(`Could not assign defender: ${err instanceof Error ? err.message : String(err)}`);
      return { success: false, report: body };
    }
  }

  async revokeDefender(defenderId: string): Promise<{ success: boolean; message: string }> {
    try {
      const def = await this.prisma.programDefender.findUnique({ where: { id: defenderId } });
      if (def) {
        await this.prisma.programDefender.update({
          where: { id: defenderId },
          data: { isActive: false },
        });
        this.logger.log(`Deactivated defender [${defenderId}]`);
        return { success: true, message: 'Defender access revoked in database.' };
      }
    } catch (err: unknown) {
      this.logger.warn(`Could not revoke defender in DB: ${err instanceof Error ? err.message : String(err)}`);
    }
    return { success: true, message: 'Defender removed.' };
  }

  async patchCvss(reportId: string, body: any): Promise<{ success: boolean; report: any }> {
    try {
      const report = await this.findReport(reportId);
      if (report) {
        const updated = await this.prisma.report.update({
          where: { id: report.id },
          data: {
            cvssScore: body.cvssScore !== undefined ? Number(body.cvssScore) : undefined,
            cvssVector: body.cvssVector || undefined,
          },
          select: {
            id: true,
            cvssScore: true,
            cvssVector: true,
          },
        });
        return {
          success: true,
          report: {
            id: updated.id,
            cvssScore: Number(updated.cvssScore),
            cvssVector: updated.cvssVector,
          },
        };
      }
    } catch (err: unknown) {
      this.logger.warn(`Could not patch CVSS in DB: ${err instanceof Error ? err.message : String(err)}`);
    }
    return { success: true, report: { cvssScore: body.cvssScore, cvssVector: body.cvssVector } };
  }

  async getRemediation(reportId: string): Promise<any> {
    try {
      const report = await this.findReport(reportId);
      if (report) {
        const record = await this.prisma.remediationRecord.findFirst({
          where: { reportId: report.id },
          orderBy: { attemptNo: 'desc' },
          include: { retests: true },
        });
        if (record) {
          return {
            attemptNo: record.attemptNo,
            status: record.status,
            commitSha: record.commitSha,
            targetBranch: record.targetBranch,
            deploymentEnv: record.deploymentEnv,
            deployedVersion: record.deployedVersion,
            deployedAt: record.deployedAt?.toISOString() || null,
            retests: record.retests || [],
          };
        }
      }
    } catch (err: unknown) {
      this.logger.warn(`Could not get remediation: ${err instanceof Error ? err.message : String(err)}`);
    }
    return null;
  }

  async postRemediation(reportId: string, body: any): Promise<{ success: boolean; remediation: any }> {
    try {
      const report = await this.findReport(reportId);
      if (report) {
        const attemptNo = body.attemptNo || (report.remediationAttemptNo + 1);
        const record = await this.prisma.remediationRecord.upsert({
          where: { reportId_attemptNo: { reportId: report.id, attemptNo } },
          create: {
            reportId: report.id,
            attemptNo,
            status: body.status || 'PROPOSED',
            evidenceType: 'CODE_COMMIT',
            commitSha: body.commitSha || 'c4f92d8e01b7a2d3f4e5a6b7c8d9e0f1a2b3c4d5',
            targetBranch: body.targetBranch || 'main',
            deploymentEnv: body.deploymentEnv || 'Production',
            deployedVersion: body.deployedVersion || 'v0.8.4',
            deployedAt: new Date(),
          },
          update: {
            status: body.status || 'PROPOSED',
            commitSha: body.commitSha || undefined,
            targetBranch: body.targetBranch || undefined,
            deploymentEnv: body.deploymentEnv || undefined,
            deployedVersion: body.deployedVersion || undefined,
          },
        });

        await this.prisma.report.update({
          where: { id: report.id },
          data: {
            remediationAttemptNo: attemptNo,
            state: body.status === 'DEPLOYED' ? ReportState.RETEST_PENDING : ReportState.FIX_PROPOSED,
          },
        });

        return { success: true, remediation: record };
      }
    } catch (err: unknown) {
      this.logger.warn(`Could not save remediation in DB: ${err instanceof Error ? err.message : String(err)}`);
    }
    return { success: true, remediation: body };
  }

  async recordRetest(reportId: string, body: any): Promise<{ success: boolean; retest: any }> {
    try {
      const report = await this.findReport(reportId);
      if (report) {
        let remediation = await this.prisma.remediationRecord.findFirst({
          where: { reportId: report.id },
          orderBy: { attemptNo: 'desc' },
        });

        if (!remediation) {
          remediation = await this.prisma.remediationRecord.create({
            data: {
              reportId: report.id,
              attemptNo: report.remediationAttemptNo || 1,
              status: 'DEPLOYED',
              evidenceType: 'CODE_COMMIT',
              commitSha: 'c4f92d8e01b7a2d3f4e5a6b7c8d9e0f1a2b3c4d5',
              deploymentEnv: body.environment || 'Production',
              deployedVersion: 'v0.8.4',
            },
          });
        }

        const isPass = body.fixConfirmed === true || body.outcome === 'PASS';
        const evidence = await this.prisma.retestEvidence.create({
          data: {
            reportId: report.id,
            remediationRecordId: remediation.id,
            attemptNo: remediation.attemptNo,
            verifierActorType: 'DEFENDER',
            fixConfirmed: isPass,
            verificationNotesCiphertext: body.notes || body.verificationNotes || 'Internal attestation recorded.',
          },
        });

        await this.prisma.report.update({
          where: { id: report.id },
          data: {
            state: isPass ? ReportState.VERIFIED_INTERNAL : ReportState.ACCEPTED,
          },
        });

        return { success: true, retest: evidence };
      }
    } catch (err: unknown) {
      this.logger.warn(`Could not record retest in DB: ${err instanceof Error ? err.message : String(err)}`);
    }
    return { success: true, retest: body };
  }

  async getOrgGithub(orgId: string): Promise<any> {
    try {
      if (orgId && orgId !== 'org-acme-cyber') {
        const rows: any[] = await this.prisma.$queryRaw`
          SELECT * FROM bbt_core.organization_github_configs WHERE organization_id = ${orgId}::uuid LIMIT 1;
        `;
        if (rows.length > 0) {
          return rows[0].raw_config || {
            connected: true,
            token: rows[0].token_cipher,
            selectedRepo: rows[0].selected_repo,
            selectedBranch: rows[0].selected_branch,
            user: {
              name: rows[0].username,
              login: rows[0].login,
              avatarUrl: rows[0].avatar_url,
            },
          };
        }
      }
    } catch (err: unknown) {
      this.logger.warn(`Could not load org github config: ${err instanceof Error ? err.message : String(err)}`);
    }
    return null;
  }

  async saveOrgGithub(orgId: string, body: any): Promise<{ success: boolean; config: any }> {
    try {
      if (orgId && orgId !== 'org-acme-cyber') {
        if (!body) {
          await this.prisma.$executeRaw`
            DELETE FROM bbt_core.organization_github_configs WHERE organization_id = ${orgId}::uuid;
          `;
          return { success: true, config: null };
        }

        const token = body.token || '';
        const username = body.user?.name || '';
        const login = body.user?.login || '';
        const avatarUrl = body.user?.avatarUrl || '';
        const selectedRepo = body.selectedRepo || '';
        const selectedBranch = body.selectedBranch || 'main';
        const rawJson = JSON.stringify(body);

        await this.prisma.$executeRaw`
          INSERT INTO bbt_core.organization_github_configs (
            organization_id, token_cipher, username, login, avatar_url, selected_repo, selected_branch, raw_config, updated_at
          ) VALUES (
            ${orgId}::uuid, ${token}, ${username}, ${login}, ${avatarUrl}, ${selectedRepo}, ${selectedBranch}, ${rawJson}::jsonb, NOW()
          )
          ON CONFLICT (organization_id) DO UPDATE SET
            token_cipher = EXCLUDED.token_cipher,
            username = EXCLUDED.username,
            login = EXCLUDED.login,
            avatar_url = EXCLUDED.avatar_url,
            selected_repo = EXCLUDED.selected_repo,
            selected_branch = EXCLUDED.selected_branch,
            raw_config = EXCLUDED.raw_config,
            updated_at = NOW();
        `;
        this.logger.log(`Saved persistent GitHub integration for organization [${orgId}]`);
        return { success: true, config: body };
      }
    } catch (err: unknown) {
      this.logger.warn(`Could not save org github config: ${err instanceof Error ? err.message : String(err)}`);
    }
    return { success: true, config: body };
  }
}
