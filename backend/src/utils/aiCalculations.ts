// AI calculation utilities for village indicators

interface VillageData {
  total_area?: number;
  net_area_sown?: number;
  unirrigated_area?: number;
  distance_to_town_km?: number;
}

interface Indicators {
  agri_dependency: number;
  irrigation_stress: number;
  connectivity_risk: number;
}

// Calculate AI indicators for a village
export function calculateIndicators(data: VillageData): Indicators {
  const totalArea = data.total_area || 0;
  const netAreaSown = data.net_area_sown || 0;
  const unirrigatedArea = data.unirrigated_area || 0;
  const distanceToTown = data.distance_to_town_km || 0;

  // Agriculture dependency index (how much land is used for farming)
  const agriDependency = totalArea > 0 ? netAreaSown / totalArea : 0;

  // Irrigation stress index (how much land lacks irrigation)
  const irrigationStress = netAreaSown > 0 ? unirrigatedArea / netAreaSown : 0;

  // Connectivity risk (normalized distance, max 100km)
  const maxDist = 100.0;
  const connectivityRisk = maxDist > 0 ? Math.min(distanceToTown / maxDist, 1.0) : 0;

  // Clamp values between 0 and 1
  return {
    agri_dependency: Math.max(0, Math.min(1, agriDependency)),
    irrigation_stress: Math.max(0, Math.min(1, irrigationStress)),
    connectivity_risk: Math.max(0, Math.min(1, connectivityRisk))
  };
}

// Calculate priority score based on indicators
export function calculatePriorityScore(indicators: Indicators): { score: number; level: string } {
  // Weighted combination: agri dependency (50%), irrigation stress (30%), connectivity (20%)
  const score = (
    0.5 * indicators.agri_dependency +
    0.3 * indicators.irrigation_stress +
    0.2 * indicators.connectivity_risk
  );

  const clampedScore = Math.max(0, Math.min(1, score));

  // Determine priority level
  let level = 'Low';
  if (clampedScore > 0.66) {
    level = 'High';
  } else if (clampedScore > 0.33) {
    level = 'Medium';
  }

  return {
    score: Math.round(clampedScore * 1000) / 1000, // Round to 3 decimals
    level
  };
}

// Calculate confidence score based on data completeness
export function calculateConfidenceScore(indicators: Indicators): number {
  const fields = ['agri_dependency', 'irrigation_stress', 'connectivity_risk'];
  const nonNullCount = fields.filter(field => indicators[field as keyof Indicators] !== null && indicators[field as keyof Indicators] !== undefined).length;
  return Math.round((nonNullCount / fields.length) * 100) / 100;
}

// Detect anomalies using z-score
export async function detectAnomaly(
  villageId: number,
  priorityScore: number,
  pool: any
): Promise<{ flag: boolean; reason: string }> {
  // Get all priority scores for comparison
  const result = await pool.query(
    'SELECT priority_score FROM villages WHERE priority_score IS NOT NULL'
  );

  if (result.rows.length < 3) {
    return { flag: false, reason: 'Normal' };
  }

  const scores = result.rows.map((r: any) => r.priority_score);
  const mean = scores.reduce((a: number, b: number) => a + b, 0) / scores.length;
  const variance = scores.reduce((sum: number, score: number) => sum + Math.pow(score - mean, 2), 0) / scores.length;
  const stdDev = Math.sqrt(variance);

  if (stdDev === 0) {
    return { flag: false, reason: 'Normal' };
  }

  // Calculate z-score for this village
  const zScore = (priorityScore - mean) / stdDev;

  if (Math.abs(zScore) > 2) {
    if (zScore > 2) {
      return { flag: true, reason: 'Unusually high priority – verify survey data' };
    } else {
      return { flag: true, reason: 'Unusually low priority – possible data inconsistency' };
    }
  }

  return { flag: false, reason: 'Normal' };
}
