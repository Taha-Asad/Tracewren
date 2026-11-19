import { Test, TestingModule } from '@nestjs/testing';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PrismaService } from './database/prisma.service.js';

describe('AppController', () => {
  let appController: AppController;

  const mockPrismaService = {
    program: {
      findMany: vi.fn().mockResolvedValue([]),
      create: vi.fn().mockImplementation((args) => Promise.resolve(args.data)),
    },
    organization: {
      findFirst: vi.fn().mockResolvedValue({ id: 'org-test-uuid' }),
    },
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });

    it('should return well-known security.txt with specified or default contact email', () => {
      const defaultTxt = appController.getWellKnownSecurityTxt();
      expect(defaultTxt).toContain('Contact: mailto:tahaasad709@gmail.com');

      const customTxt = appController.getWellKnownSecurityTxt('user@org.example');
      expect(customTxt).toContain('Contact: mailto:user@org.example');
    });

    it('should return program-scoped security.txt with specified or default contact email', () => {
      const defaultProg = appController.getProgramSecurityTxt('acme-cyber');
      expect(defaultProg).toContain('Contact: mailto:tahaasad709@gmail.com');
      expect(defaultProg).toContain('# RFC 9116 Security Policy for acme-cyber');

      const customProg = appController.getProgramSecurityTxt('my-org', 'lead@my-org.com');
      expect(customProg).toContain('Contact: mailto:lead@my-org.com');
    });
  });
});
