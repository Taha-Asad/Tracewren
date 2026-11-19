import { describe, it, expect } from 'vitest';
import { ValidationPipe, ArgumentMetadata } from '@nestjs/common';
import { CompleteOnboardingDto } from './complete-onboarding.dto.js';
import { VerifyDomainDto } from './verify-domain.dto.js';

describe('CompleteOnboardingDto & VerifyDomainDto ValidationPipe Integration', () => {
  const pipe = new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  });

  describe('CompleteOnboardingDto', () => {
    const metadata: ArgumentMetadata = {
      type: 'body',
      metatype: CompleteOnboardingDto,
    };

    it('should accept valid payload with UUIDv4 organizationId', async () => {
      const payload = {
        organizationId: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d',
        domain: 'northstar.example',
        domainVerified: true,
      };

      const transformed = await pipe.transform(payload, metadata);
      expect(transformed).toBeInstanceOf(CompleteOnboardingDto);
      expect(transformed.organizationId).toBe('9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d');
      expect(transformed.domain).toBe('northstar.example');
      expect(transformed.domainVerified).toBe(true);
    });

    it('should reject non-UUID organizationId', async () => {
      const payload = {
        organizationId: 'invalid-uuid',
      };

      await expect(pipe.transform(payload, metadata)).rejects.toThrow();
    });

    it('should reject non-whitelisted properties', async () => {
      const payload = {
        organizationId: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d',
        extraMalicious: 'evil',
      };

      await expect(pipe.transform(payload, metadata)).rejects.toThrow();
    });
  });

  describe('VerifyDomainDto', () => {
    const metadata: ArgumentMetadata = {
      type: 'body',
      metatype: VerifyDomainDto,
    };

    it('should accept valid payload with domain and organizationId', async () => {
      const payload = {
        organizationId: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d',
        domain: 'northstar.example',
      };

      const transformed = await pipe.transform(payload, metadata);
      expect(transformed).toBeInstanceOf(VerifyDomainDto);
      expect(transformed.domain).toBe('northstar.example');
    });

    it('should reject missing or empty domain', async () => {
      const payload = {
        organizationId: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d',
        domain: '',
      };

      await expect(pipe.transform(payload, metadata)).rejects.toThrow();
    });
  });
});
