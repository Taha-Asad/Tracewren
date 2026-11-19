import type { PrismaService } from './database/prisma.service.js';

function mapPublicProgram(p: any) {
  return {
    id: p.id,
    organizationId: p.organizationId,
    name: p.name,
    slug: p.slug,
    visibility: p.visibility,
    policyMarkdown: p.policyMarkdown,
    createdAt: p.createdAt,
    organization: p.organization,
    activeReportsCount: p._count?.reports ?? 0,
    defendersCount: p._count?.defenders ?? 1,
  };
}

export async function fetchPublicPrograms(prisma: PrismaService): Promise<any[]> {
  try {
    const publicProgs = await prisma.program.findMany({
      where: { visibility: 'PUBLIC' },
      include: {
        organization: { select: { id: true, name: true, slug: true, domain: true, domainVerified: true } },
        _count: { select: { reports: true, defenders: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    return publicProgs.map(mapPublicProgram);
  } catch {
    return [];
  }
}

export async function fetchPublicProgramBySlug(prisma: PrismaService, slug: string): Promise<any | null> {
  try {
    const p = await prisma.program.findFirst({
      where: { slug: slug.toLowerCase().trim(), visibility: 'PUBLIC' },
      include: {
        organization: { select: { id: true, name: true, slug: true, domain: true, domainVerified: true } },
        _count: { select: { reports: true, defenders: true } },
      },
    });
    return p ? mapPublicProgram(p) : null;
  } catch {
    return null;
  }
}
