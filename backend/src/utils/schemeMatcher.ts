// Scheme matching logic for farmers and villages

interface FarmerProfile {
  land_size_hectares: number;
  crop_type: string;
  irrigation_access: boolean;
  income_category: string;
}

interface VillageIndicators {
  agri_dependency_index: number;
  irrigation_stress_index: number;
  connectivity_risk_score: number;
}

// Recommend schemes for a village based on indicators
export function recommendSchemesForVillage(indicators: VillageIndicators): string[] {
  const schemes: string[] = [];

  // MGNREGA - high agriculture dependency
  if (indicators.agri_dependency_index > 0.4) {
    schemes.push('MGNREGA');
  }

  // Irrigation schemes - high irrigation stress
  if (indicators.irrigation_stress_index > 0.5) {
    schemes.push('Irrigation & Water Schemes');
  }

  // Rural infrastructure - high connectivity risk
  if (indicators.connectivity_risk_score > 0.6) {
    schemes.push('Rural Infrastructure');
  }

  return schemes;
}

// Calculate eligibility score for a farmer-scheme match
export function calculateEligibilityScore(
  farmer: FarmerProfile,
  schemeCriteria: any,
  villageIndicators?: VillageIndicators
): { score: number; reasons: string[]; matchCriteria: any } {
  let score = 0.0;
  const reasons: string[] = [];
  const matchCriteria: any = {};

  // Check land size requirements
  if (schemeCriteria.land_size_min !== undefined) {
    if (farmer.land_size_hectares >= schemeCriteria.land_size_min) {
      score += 0.2;
      matchCriteria.land_size = true;
      reasons.push(`Land size (${farmer.land_size_hectares} ha) meets minimum requirement`);
    }
  }

  if (schemeCriteria.land_size_max !== undefined) {
    if (farmer.land_size_hectares <= schemeCriteria.land_size_max) {
      score += 0.2;
      matchCriteria.land_size = true;
      reasons.push(`Land size (${farmer.land_size_hectares} ha) within maximum limit`);
    }
  }

  // Check income category
  if (schemeCriteria.income_category) {
    if (schemeCriteria.income_category.includes(farmer.income_category)) {
      score += 0.3;
      matchCriteria.income = true;
      reasons.push(`Income category (${farmer.income_category}) matches`);
    }
  }

  // Check irrigation access
  if (schemeCriteria.irrigation_access !== undefined) {
    if (farmer.irrigation_access === schemeCriteria.irrigation_access) {
      score += 0.2;
      matchCriteria.irrigation = true;
      reasons.push('Irrigation access requirement matches');
    }
  }

  // Check village connectivity risk
  if (villageIndicators && schemeCriteria.connectivity_risk !== undefined) {
    if (villageIndicators.connectivity_risk_score >= schemeCriteria.connectivity_risk) {
      score += 0.2;
      matchCriteria.connectivity = true;
      reasons.push('Village connectivity risk matches requirement');
    }
  }

  // Check crop type
  if (schemeCriteria.crop_type) {
    if (schemeCriteria.crop_type.includes('any') || schemeCriteria.crop_type.includes(farmer.crop_type)) {
      score += 0.1;
      matchCriteria.crop = true;
    }
  }

  return {
    score: Math.round(score * 100) / 100,
    reasons,
    matchCriteria
  };
}
