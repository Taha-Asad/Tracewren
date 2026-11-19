import { Body, Controller, Delete, Get, Header, Param, Patch, Post, Query } from '@nestjs/common';
import { AppService } from './app.service.js';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('v1/public/programs')
  async getPublicPrograms() {
    return this.appService.getPublicPrograms();
  }

  @Get('v1/public/programs/:slug')
  async getPublicProgramBySlug(@Param('slug') slug: string) {
    return this.appService.getPublicProgramBySlug(slug);
  }

  @Get('v1/programs')
  async getPrograms(
    @Query('orgId') orgId?: string,
    @Query('orgSlug') orgSlug?: string,
  ) {
    return this.appService.getPrograms(orgId, orgSlug);
  }

  @Post('v1/programs')
  async createProgram(@Body() body: any) {
    return this.appService.createProgram(body);
  }

  @Get('v1/defenders')
  async getDefenders(
    @Query('orgId') orgId?: string,
    @Query('orgSlug') orgSlug?: string,
  ) {
    return this.appService.getDefenders(orgId, orgSlug);
  }

  @Delete('v1/defenders/:id')
  async revokeDefender(@Param('id') id: string) {
    return this.appService.revokeDefender(id);
  }

  @Get('v1/reports')
  async getReports(
    @Query('orgId') orgId?: string,
    @Query('orgSlug') orgSlug?: string,
  ) {
    return this.appService.getReports(orgId, orgSlug);
  }

  @Post('v1/reports')
  async createReport(@Body() body: any) {
    return this.appService.createReport(body);
  }

  @Patch('v1/reports/:id/cvss')
  async patchCvss(@Param('id') id: string, @Body() body: any) {
    return this.appService.patchCvss(id, body);
  }

  @Patch('v1/reports/:id/assign')
  async assignDefender(@Param('id') id: string, @Body() body: any) {
    return this.appService.assignDefender(id, body);
  }

  @Get('v1/reports/:id/discussions')
  async getDiscussions(@Param('id') id: string) {
    return this.appService.getDiscussions(id);
  }

  @Post('v1/reports/:id/discussions')
  async postDiscussion(@Param('id') id: string, @Body() body: any) {
    return this.appService.postDiscussion(id, body);
  }

  @Get('v1/reports/:id/remediation')
  async getRemediation(@Param('id') id: string) {
    return this.appService.getRemediation(id);
  }

  @Post('v1/reports/:id/remediation')
  async postRemediation(@Param('id') id: string, @Body() body: any) {
    return this.appService.postRemediation(id, body);
  }

  @Post('v1/reports/:id/retest')
  async recordRetest(@Param('id') id: string, @Body() body: any) {
    return this.appService.recordRetest(id, body);
  }

  @Get('v1/organizations/:id/github')
  async getOrgGithub(@Param('id') orgId: string) {
    return this.appService.getOrgGithub(orgId);
  }

  @Post('v1/organizations/:id/github')
  async saveOrgGithub(@Param('id') orgId: string, @Body() body: any) {
    return this.appService.saveOrgGithub(orgId, body);
  }

  @Get('.well-known/security.txt')
  @Header('Content-Type', 'text/plain; charset=utf-8')
  getWellKnownSecurityTxt(@Query('contact') contact?: string): string {
    const contactEmail = contact && contact.trim().length > 0 ? contact.trim() : 'tahaasad709@gmail.com';
    return `# RFC 9116 Security Policy for BugBountyTrack
Contact: mailto:${contactEmail}
Contact: https://caulvyn.com/workspace
Expires: 2027-12-31T23:59:59.000Z
Encryption: https://caulvyn.com/pgp-key.asc
Acknowledgments: https://caulvyn.com/hall-of-fame
Policy: https://caulvyn.com/disclosure-policy
Preferred-Languages: en
Canonical: https://caulvyn.com/.well-known/security.txt
Hiring: https://caulvyn.com/careers
`;
  }

  @Get('v1/programs/:slug/security.txt')
  @Header('Content-Type', 'text/plain; charset=utf-8')
  getProgramSecurityTxt(
    @Param('slug') slug: string,
    @Query('contact') contact?: string,
  ): string {
    const contactEmail = contact && contact.trim().length > 0 ? contact.trim() : 'tahaasad709@gmail.com';
    return `# RFC 9116 Security Policy for ${slug}
Contact: mailto:${contactEmail}
Contact: https://caulvyn.com/workspace
Expires: 2027-12-31T23:59:59.000Z
Encryption: https://caulvyn.com/api/v1/programs/${slug}/pgp-key.asc
Acknowledgments: https://caulvyn.com/programs/${slug}/hall-of-fame
Policy: https://caulvyn.com/programs/${slug}/policy
Preferred-Languages: en
Canonical: https://caulvyn.com/api/v1/programs/${slug}/security.txt
`;
  }
}
