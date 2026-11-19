import { describe, it, expect } from 'vitest';
import {
  calculateCvss31,
  parseCvssVector,
  roundup,
  getSeverityRating,
  estimateBountyReward,
  getSlaResolutionHours,
} from './cvss.engine.js';

describe('FIRST.org CVSS v3.1 Calculation Engine', () => {
  describe('roundup algorithm (Appendix A)', () => {
    it('correctly rounds up values according to specification', () => {
      expect(roundup(4.0)).toBe(4.0);
      expect(roundup(4.01)).toBe(4.1);
      expect(roundup(4.00000001)).toBe(4.1);
      expect(roundup(9.8)).toBe(9.8);
      expect(roundup(9.81)).toBe(9.9);
      expect(roundup(10.0)).toBe(10.0);
    });
  });

  describe('NIST NVD & FIRST.org Verified CVE Benchmarks', () => {
    const benchmarks = [
      {
        name: 'CVE-2021-44228 (Log4Shell RCE)',
        vector: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:C/C:H/I:H/A:H',
        expectedScore: 10.0,
        expectedSeverity: 'CRITICAL',
      },
      {
        name: 'CVE-2019-11510 (Pulse Secure File Read)',
        vector: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H',
        expectedScore: 9.8,
        expectedSeverity: 'CRITICAL',
      },
      {
        name: 'CVE-2021-41773 (Apache 2.4.49 Path Traversal)',
        vector: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:N/A:N',
        expectedScore: 7.5,
        expectedSeverity: 'HIGH',
      },
      {
        name: 'CVE-2021-40444 (MSHTML ActiveX Click RCE)',
        vector: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:C/C:H/I:H/A:H',
        expectedScore: 9.6,
        expectedSeverity: 'CRITICAL',
      },
      {
        name: 'CVE-2022-22965 (Spring4Shell DataBinder RCE)',
        vector: 'CVSS:3.1/AV:N/AC:H/PR:N/UI:N/S:C/C:H/I:H/A:H',
        expectedScore: 9.0,
        expectedSeverity: 'CRITICAL',
      },
      {
        name: 'CVE-2021-3156 (Sudo Baron Samedit Local Root)',
        vector: 'CVSS:3.1/AV:L/AC:L/PR:L/UI:N/S:U/C:H/I:H/A:H',
        expectedScore: 7.8,
        expectedSeverity: 'HIGH',
      },
      {
        name: 'FIRST-EX-15 (Stored XSS Session Hijack)',
        vector: 'CVSS:3.1/AV:N/AC:L/PR:L/UI:R/S:C/C:H/I:H/A:N',
        expectedScore: 8.7,
        expectedSeverity: 'HIGH',
      },
      {
        name: 'FIRST-EX-16 (SSRF IMDSv1 Credential Theft)',
        vector: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:C/C:H/I:N/A:N',
        expectedScore: 8.6,
        expectedSeverity: 'HIGH',
      },
      {
        name: 'Zero Impact Vector',
        vector: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:N/I:N/A:N',
        expectedScore: 0.0,
        expectedSeverity: 'NONE',
      },
    ];

    benchmarks.forEach(({ name, vector, expectedScore, expectedSeverity }) => {
      it(`evaluates ${name} with exact mathematical precision`, () => {
        const result = calculateCvss31(vector);
        expect(result.baseScore).toBe(expectedScore);
        expect(result.severity).toBe(expectedSeverity);
      });
    });
  });

  describe('Strict Vector Parsing & Rejection Gates', () => {
    it('rejects duplicate metric keys', () => {
      expect(() =>
        parseCvssVector('CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:L/I:N/A:N/AV:L'),
      ).toThrowError(/duplicate metric key/i);
    });

    it('rejects missing mandatory metrics', () => {
      expect(() =>
        parseCvssVector('CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:L/I:N'),
      ).toThrowError(/missing mandatory/i);
    });

    it('rejects invalid prefix', () => {
      expect(() =>
        parseCvssVector('CVSS:3.0/AV:N/AC:L/PR:N/UI:N/S:U/C:L/I:N/A:N'),
      ).toThrowError(/must start with 'CVSS:3.1\/'/i);
    });

    it('rejects unknown metric keys', () => {
      expect(() =>
        parseCvssVector('CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:L/I:N/A:N/ZZ:X'),
      ).toThrowError(/unknown metric key/i);
    });

    it('rejects invalid metric values', () => {
      expect(() =>
        parseCvssVector('CVSS:3.1/AV:INVALID/AC:L/PR:N/UI:N/S:U/C:L/I:N/A:N'),
      ).toThrowError(/invalid value/i);
    });

    it('rejects non-string input', () => {
      expect(() => parseCvssVector(12345 as any)).toThrowError(/valid string/i);
    });
  });

  describe('Severity & SLA Mapping', () => {
    it('classifies qualitative severity ratings accurately', () => {
      expect(getSeverityRating(0.0)).toBe('NONE');
      expect(getSeverityRating(3.5)).toBe('LOW');
      expect(getSeverityRating(6.5)).toBe('MEDIUM');
      expect(getSeverityRating(8.5)).toBe('HIGH');
      expect(getSeverityRating(9.8)).toBe('CRITICAL');
    });

    it('maps SLA resolution hours to severity tiers', () => {
      expect(getSlaResolutionHours('CRITICAL')).toBe(24);
      expect(getSlaResolutionHours('HIGH')).toBe(72);
      expect(getSlaResolutionHours('MEDIUM')).toBe(336);
      expect(getSlaResolutionHours('LOW')).toBe(720);
      expect(getSlaResolutionHours('NONE')).toBe(720);
    });
  });

  describe('Deterministic Bounty Reward Estimation', () => {
    it('calculates suggested bounty awards within program policy brackets', () => {
      const policy = { min: 200, max: 8000, currency: 'USD' };
      const lowResult = estimateBountyReward(3.5, 'LOW', policy);
      expect(lowResult.min).toBe(200);
      expect(lowResult.currency).toBe('USD');

      const critResult = estimateBountyReward(9.8, 'CRITICAL', policy);
      expect(critResult.max).toBe(8000);
      expect(critResult.min).toBeGreaterThan(lowResult.max);
    });
  });
});
