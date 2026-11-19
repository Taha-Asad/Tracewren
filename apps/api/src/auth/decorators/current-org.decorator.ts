import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const currentOrgFactory = (data: string | undefined, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  const org = request.organization || request.activeMembership?.organization;
  return data ? org?.[data] : org;
};

export const CurrentOrganization = createParamDecorator(currentOrgFactory);
