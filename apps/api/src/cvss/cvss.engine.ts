/**
 * FIRST.org CVSS v3.1 Deterministic Calculation Engine
 * 
 * Implements the official FIRST.org Common Vulnerability Scoring System (CVSS) v3.1 specification.
 * Fully conformant with FIRST.org Appendix A Floating-Point Roundup Algorithm
 * and official 8.22 Exploitability coefficient.
 */

export type AttackVector = 'N' | 'A' | 'L' | 'P';
export type AttackComplexity = 'L' | 'H';
export type PrivilegesRequired = 'N' | 'L' | 'H';
export type UserInteraction = 'N' | 'R';
export type Scope = 'U' | 'C';
export type ImpactMetric = 'N' | 'L' | 'H';
export type SeverityRating = 'NONE' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface CvssMetrics {
  AV: AttackVector;
  AC: AttackComplexity;
  PR: PrivilegesRequired;
  UI: UserInteraction;
  S: Scope;
  C: ImpactMetric;
  I: ImpactMetric;
  A: ImpactMetric;
}

export interface CvssCalculationResult {
  vector: string;
  baseScore: number;
  severity: SeverityRating;
  impactSubScore: number;
  exploitabilitySubScore: number;
  scopeChanged: boolean;
  suggestedBountyRange: {
    min: number;
    max: number;
    currency: string;
  };
  slaResolutionHours: number;
}

// FIRST.org CVSS v3.1 Base Metric Weight Tables (Specification Section 7.1)
export const AV_WEIGHTS: Record<AttackVector, number> = {
  N: 0.85,
  A: 0.62,
  L: 0.55,
  P: 0.20,
};

export const AC_WEIGHTS: Record<AttackComplexity, number> = {
  L: 0.77,
  H: 0.44,
};

export const PR_WEIGHTS_UNCHANGED: Record<PrivilegesRequired, number> = {
  N: 0.85,
  L: 0.62,
  H: 0.27,
};

export const PR_WEIGHTS_CHANGED: Record<PrivilegesRequired, number> = {
  N: 0.85,
  L: 0.68,
  H: 0.50,
};

export const UI_WEIGHTS: Record<UserInteraction, number> = {
  N: 0.85,
  R: 0.62,
};

export const IMP_WEIGHTS: Record<ImpactMetric, number> = {
  N: 0.0,
  L: 0.22,
  H: 0.56,
};

export const MANDATORY_METRICS: (keyof CvssMetrics)[] = ['AV', 'AC', 'PR', 'UI', 'S', 'C', 'I', 'A'];

export const ALLOWED_VALUES: Record<keyof CvssMetrics, Set<string>> = {
  AV: new Set(['N', 'A', 'L', 'P']),
  AC: new Set(['L', 'H']),
  PR: new Set(['N', 'L', 'H']),
  UI: new Set(['N', 'R']),
  S: new Set(['U', 'C']),
  C: new Set(['N', 'L', 'H']),
  I: new Set(['N', 'L', 'H']),
  A: new Set(['N', 'L', 'H']),
};

/**
 * FIRST.org Appendix A Floating-Point Roundup Algorithm.
 * Returns the smallest number, specified to 1 decimal place, that is greater than or equal to input.
 */
export function roundup(val: number): number {
  const rounded9 = Math.round(val * 1000000000) / 1000000000;
  return Math.round(Math.ceil(rounded9 * 10) * 10) / 100;
}

/**
 * Strict CVSS 3.1 Vector String Parser.
 * Rejects malformed strings, duplicate metric keys, missing mandatory metrics, and unknown values.
 */
export function parseCvssVector(vec: string): CvssMetrics {
  if (typeof vec !== 'string') {
    throw new Error('Vector must be a valid string');
  }

  const prefix = 'CVSS:3.1/';
  if (!vec.startsWith(prefix)) {
    throw new Error(`Vector must start with '${prefix}', got: '${vec.substring(0, 15)}'`);
  }

  const metricPart = vec.substring(prefix.length);
  const segments = metricPart.split('/');
  if (segments.length === 0 || (segments.length === 1 && segments[0] === '')) {
    throw new Error('Vector contains no metric components');
  }

  const metrics: Partial<CvssMetrics> = {};
  const seenKeys = new Set<string>();

  for (const seg of segments) {
    if (!seg.includes(':')) {
      throw new Error(`Malformed metric segment (missing ':'): '${seg}'`);
    }

    const [rawK, rawV] = seg.split(':', 2);
    const k = rawK.trim() as keyof CvssMetrics;
    const v = rawV.trim();

    if (seenKeys.has(k)) {
      throw new Error(`Duplicate metric key detected: '${k}' in vector '${vec}'`);
    }
    seenKeys.add(k);

    if (!(k in ALLOWED_VALUES)) {
      throw new Error(`Unknown metric key: '${k}'`);
    }

    if (!ALLOWED_VALUES[k].has(v)) {
      throw new Error(`Invalid value '${v}' for metric '${k}'. Allowed: ${Array.from(ALLOWED_VALUES[k]).sort().join(', ')}`);
    }

    (metrics as any)[k] = v;
  }

  for (const m of MANDATORY_METRICS) {
    if (!(m in metrics)) {
      throw new Error(`Missing mandatory Base metric: '${m}'`);
    }
  }

  return metrics as CvssMetrics;
}

/**
 * Determines qualitative severity rating according to FIRST.org standard brackets.
 */
export function getSeverityRating(score: number): SeverityRating {
  if (score <= 0.0) return 'NONE';
  if (score <= 3.9) return 'LOW';
  if (score <= 6.9) return 'MEDIUM';
  if (score <= 8.9) return 'HIGH';
  return 'CRITICAL';
}

/**
 * Computes deterministic suggested bounty reward based on CVSS severity and score.
 */
export function estimateBountyReward(
  score: number,
  severity: SeverityRating,
  policy?: { min: number; max: number; currency?: string },
): { min: number; max: number; currency: string } {
  const currency = policy?.currency || 'USD';
  const baseMin = policy?.min ?? 100;
  const baseMax = policy?.max ?? 10000;

  switch (severity) {
    case 'NONE':
      return { min: 0, max: 0, currency };
    case 'LOW':
      return { min: baseMin, max: Math.round(baseMin + (baseMax - baseMin) * 0.1), currency };
    case 'MEDIUM':
      return {
        min: Math.round(baseMin + (baseMax - baseMin) * 0.1),
        max: Math.round(baseMin + (baseMax - baseMin) * 0.35),
        currency,
      };
    case 'HIGH':
      return {
        min: Math.round(baseMin + (baseMax - baseMin) * 0.35),
        max: Math.round(baseMin + (baseMax - baseMin) * 0.75),
        currency,
      };
    case 'CRITICAL':
      return {
        min: Math.round(baseMin + (baseMax - baseMin) * 0.75),
        max: baseMax,
        currency,
      };
  }
}

/**
 * Calculates operational SLA resolution hours based on CVSS severity tier.
 */
export function getSlaResolutionHours(severity: SeverityRating): number {
  switch (severity) {
    case 'CRITICAL':
      return 24; // 24 hours for Critical vulnerabilities
    case 'HIGH':
      return 72; // 72 hours (3 business days) for High vulnerabilities
    case 'MEDIUM':
      return 336; // 14 calendar days for Medium vulnerabilities
    case 'LOW':
    case 'NONE':
      return 720; // 30 calendar days for Low vulnerabilities
  }
}

/**
 * Calculates CVSS 3.1 Base Score and complete telemetry following official FIRST.org equations.
 */
export function calculateCvss31(
  input: string | CvssMetrics,
  policy?: { min: number; max: number; currency?: string },
): CvssCalculationResult {
  const m = typeof input === 'string' ? parseCvssVector(input) : input;
  const vectorString =
    typeof input === 'string'
      ? input
      : `CVSS:3.1/AV:${m.AV}/AC:${m.AC}/PR:${m.PR}/UI:${m.UI}/S:${m.S}/C:${m.C}/I:${m.I}/A:${m.A}`;

  const scopeChanged = m.S === 'C';
  const prWeights = scopeChanged ? PR_WEIGHTS_CHANGED : PR_WEIGHTS_UNCHANGED;

  // 1. Impact Sub-Score (ISS)
  const iss = 1.0 - (1.0 - IMP_WEIGHTS[m.C]) * (1.0 - IMP_WEIGHTS[m.I]) * (1.0 - IMP_WEIGHTS[m.A]);

  if (iss <= 0) {
    return {
      vector: vectorString,
      baseScore: 0.0,
      severity: 'NONE',
      impactSubScore: 0.0,
      exploitabilitySubScore: 0.0,
      scopeChanged,
      suggestedBountyRange: { min: 0, max: 0, currency: policy?.currency || 'USD' },
      slaResolutionHours: 720,
    };
  }

  // 2. Impact Equation
  let impact: number;
  if (!scopeChanged) {
    impact = 6.42 * iss;
  } else {
    impact = 7.52 * (iss - 0.029) - 3.25 * Math.pow(iss - 0.02, 15);
  }

  // 3. Exploitability Equation (FIRST.org official 8.22 coefficient)
  const exploitability =
    8.22 * AV_WEIGHTS[m.AV] * AC_WEIGHTS[m.AC] * prWeights[m.PR] * UI_WEIGHTS[m.UI];

  // 4. Base Score Calculation with Roundup
  let rawScore: number;
  if (scopeChanged) {
    rawScore = Math.min(1.08 * (impact + exploitability), 10.0);
  } else {
    rawScore = Math.min(impact + exploitability, 10.0);
  }

  const baseScore = roundup(rawScore);
  const severity = getSeverityRating(baseScore);
  const suggestedBountyRange = estimateBountyReward(baseScore, severity, policy);
  const slaResolutionHours = getSlaResolutionHours(severity);

  return {
    vector: vectorString,
    baseScore,
    severity,
    impactSubScore: Math.round(impact * 10) / 10,
    exploitabilitySubScore: Math.round(exploitability * 10) / 10,
    scopeChanged,
    suggestedBountyRange,
    slaResolutionHours,
  };
}
