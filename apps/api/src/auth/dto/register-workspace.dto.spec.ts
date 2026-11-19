import { describe, it, expect } from 'vitest';
import { ValidationPipe, ArgumentMetadata } from '@nestjs/common';
import { RegisterWorkspaceDto } from './register-workspace.dto.js';

describe('RegisterWorkspaceDto ValidationPipe Integration', () => {
  const pipe = new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  });

  const metadata: ArgumentMetadata = {
    type: 'body',
    metatype: RegisterWorkspaceDto,
  };

  it('should accept valid payload using canonical orgName and slug', async () => {
    const payload = {
      orgName: 'Acme Cyber',
      slug: 'acme-cyber',
      email: 'owner@acme.com',
      password: 'SuperSecurePassphrase123!',
      agreedToTerms: true,
    };

    const transformed = await pipe.transform(payload, metadata);
    expect(transformed).toBeInstanceOf(RegisterWorkspaceDto);
    expect(transformed.orgName).toBe('Acme Cyber');
    expect(transformed.slug).toBe('acme-cyber');
    expect(transformed.email).toBe('owner@acme.com');
  });

  it('should accept valid payload using alias organizationName and organizationSlug without non-whitelisted errors', async () => {
    const payload = {
      organizationName: 'Acme Cyber',
      organizationSlug: 'acme-cyber',
      email: 'owner@acme.com',
      password: 'SuperSecurePassphrase123!',
      agreedToTerms: true,
    };

    const transformed = await pipe.transform(payload, metadata);
    expect(transformed).toBeInstanceOf(RegisterWorkspaceDto);
    expect(transformed.organizationName).toBe('Acme Cyber');
    expect(transformed.organizationSlug).toBe('acme-cyber');
  });

  it('should accept payload containing both canonical and alias names simultaneously', async () => {
    const payload = {
      orgName: 'Acme Cyber',
      slug: 'acme-cyber',
      organizationName: 'Acme Cyber',
      organizationSlug: 'acme-cyber',
      domain: 'acme.com',
      fullName: 'Sarah Chen',
      email: 'owner@acme.com',
      password: 'SuperSecurePassphrase123!',
      agreedToTerms: true,
    };

    const transformed = await pipe.transform(payload, metadata);
    expect(transformed).toBeInstanceOf(RegisterWorkspaceDto);
    expect(transformed.orgName).toBe('Acme Cyber');
    expect(transformed.organizationName).toBe('Acme Cyber');
    expect(transformed.slug).toBe('acme-cyber');
    expect(transformed.organizationSlug).toBe('acme-cyber');
  });

  it('should reject non-whitelisted properties with forbidNonWhitelisted: true', async () => {
    const payload = {
      orgName: 'Acme Cyber',
      slug: 'acme-cyber',
      email: 'owner@acme.com',
      password: 'SuperSecurePassphrase123!',
      unknownField: 'malicious-data',
    };

    await expect(pipe.transform(payload, metadata)).rejects.toThrow();
  });

  it('should automatically lowercase uppercase letters in slug', async () => {
    const payload = {
      orgName: 'Acme Cyber',
      slug: 'Acme-Cyber',
      email: 'owner@acme.com',
      password: 'SuperSecurePassphrase123!',
    };

    const transformed = await pipe.transform(payload, metadata);
    expect(transformed.slug).toBe('acme-cyber');
  });

  it('should reject invalid slug formats with spaces, consecutive hyphens, or leading/trailing hyphens', async () => {
    const invalidSlugs = ['acme cyber', 'acme--cyber', '-acme', 'acme-', 'acme_cyber', 'acme@cyber'];

    for (const invalidSlug of invalidSlugs) {
      const payload = {
        orgName: 'Acme Cyber',
        slug: invalidSlug,
        email: 'owner@acme.com',
        password: 'SuperSecurePassphrase123!',
      };

      await expect(pipe.transform(payload, metadata)).rejects.toThrow();
    }
  });

  it('should reject passwords shorter than 8 characters', async () => {
    const payload = {
      orgName: 'Acme Cyber',
      slug: 'acme-cyber',
      email: 'owner@acme.com',
      password: 'short',
    };

    await expect(pipe.transform(payload, metadata)).rejects.toThrow();
  });

  it('should reject invalid email formats', async () => {
    const payload = {
      orgName: 'Acme Cyber',
      slug: 'acme-cyber',
      email: 'not-an-email',
      password: 'SuperSecurePassphrase123!',
    };

    await expect(pipe.transform(payload, metadata)).rejects.toThrow();
  });
});
