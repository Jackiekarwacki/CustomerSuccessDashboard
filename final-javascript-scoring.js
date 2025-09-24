// Customer Health Score Calculator - Based on Actual Notion Columns
// Processes your specific data structure

const items = $input.all();
const results = [];

for (const item of items) {
  const client = item.json;
  
  // Extract client data from Notion properties
  const clientName = client.properties['Client Name']?.title?.[0]?.plain_text || 'Unknown Client';
  const clientId = client.id;
  
  // Skip if client doesn't have basic required data
  if (!clientName || clientName === 'Unknown Client') {
    continue;
  }
  
  // Extract your actual data fields from RAW Notion structure
  const engagementStatus = client.properties?.['Engagement Status']?.multi_select?.[0]?.name || 'Unknown';
  const featureAdoptionScore = client.properties?.['Feature Adoption Score']?.number || 0;
  const currentARR = client.properties?.['Current ARR']?.number || 0;
  const supportTickets4mo = client.properties?.['Support Tickets (past 4wks)']?.number || 0;
  
  // Date calculations
  const renewalDateStr = client.properties['Renewal Date']?.date?.start;
  const renewalDate = renewalDateStr ? new Date(renewalDateStr) : new Date(Date.now() + 365*24*60*60*1000);
  const daysToRenewal = Math.max(0, 
    Math.ceil((renewalDate - new Date()) / (1000 * 60 * 60 * 24))
  );
  
  const lastContactStr = client.properties['Last Contact Date']?.date?.start;
  const lastContactDays = lastContactStr ? 
    Math.ceil((new Date() - new Date(lastContactStr)) / (1000 * 60 * 60 * 24)) : 999;
  
  // 1. ENGAGEMENT STATUS SCORE (40% of Overall Health Score)
  let engagementScore = 0;
  switch (engagementStatus) {
    case 'Highly Engaged':
      engagementScore = 90;
      break;
    case 'Engaged':
      engagementScore = 70;
      break;
    case 'Passive':
      engagementScore = 40;
      break;
    case 'Disengaged':
      engagementScore = 20;
      break;
    default:
      engagementScore = 50; // Unknown/neutral
  }
  
  // 2. FEATURE ADOPTION SCORE (40% of Overall Health Score)
  // Use the score directly from your column (assuming it's already 0-100)
  const adoptionScore = Math.max(0, Math.min(100, featureAdoptionScore));
  
  // 3. SUPPORT HEALTH SCORE (20% of Overall Health Score)
  // Lower ticket volume = higher score
  let supportHealthScore = 100;
  if (supportTickets4mo > 10) supportHealthScore = 30;
  else if (supportTickets4mo > 5) supportHealthScore = 60;
  else if (supportTickets4mo > 2) supportHealthScore = 80;
  else if (supportTickets4mo <= 2) supportHealthScore = 100;
  
  // CALCULATE OVERALL HEALTH SCORE (0-100)
  const overallHealthScore = Math.round(
    (engagementScore * 0.40) +     // 40% weight
    (adoptionScore * 0.40) +       // 40% weight
    (supportHealthScore * 0.20)    // 20% weight
  );
  
  // DETERMINE HEALTH STATUS
  let healthStatus = 'Critical';
  if (overallHealthScore >= 75) healthStatus = 'Healthy';
  else if (overallHealthScore >= 50) healthStatus = 'At Risk';
  
  // EXPANSION READY LOGIC
  // Based on: feature adoption score, engagement status, support ticket volume
  const expansionReady = (
    featureAdoptionScore >= 70 &&
    (engagementStatus === 'Highly Engaged' || engagementStatus === 'Engaged') &&
    supportTickets4mo <= 3
  );
  
  // NEEDS ATTENTION LOGIC
  // Based on: overall health score, renewal proximity, last contact, feature adoption, engagement
  const needsImmediateAttention = (
    overallHealthScore < 60 ||
    (daysToRenewal <= 60 && overallHealthScore < 75) ||
    lastContactDays > 30 ||
    featureAdoptionScore < 40 ||
    engagementStatus === 'Passive' ||
    engagementStatus === 'Disengaged' ||
    supportTickets4mo > 5
  );
  
  // RENEWAL RISK LOGIC  
  // Based on: overall health score, renewal proximity, last contact, feature adoption, engagement
  const renewalRisk = (
    (daysToRenewal <= 90) && (
      overallHealthScore < 70 ||
      lastContactDays > 21 ||
      featureAdoptionScore < 50 ||
      engagementStatus === 'Passive' ||
      engagementStatus === 'Disengaged' ||
      supportTickets4mo > 3
    )
  );
  
  // Compile results for Notion update - using page_id for updates
  results.push({
    page_id: clientId,  // Use page_id for Notion updates
    clientName: clientName,
    
    // Calculated fields to populate blank columns
    overallHealthScore: overallHealthScore,
    healthStatus: healthStatus,
    expansionReady: expansionReady,
    needsImmediateAttention: needsImmediateAttention,
    renewalRisk: renewalRisk,
    
    // Additional useful metrics
    calculatedAt: new Date().toISOString(),
    lastContactDays: lastContactDays,
    
    // Component scores for debugging/transparency
    engagementScore: engagementScore,
    adoptionScore: adoptionScore,
    supportHealthScore: supportHealthScore
  });
}

return results.map(result => ({ json: result }));
