# 🧮 Customer Health Scoring Algorithm

**The Complete Guide to Automated Health Score Calculations**

This document explains the business logic and mathematical formulas behind the Customer Success Health Dashboard scoring system.

---

## 🎯 **Scoring Philosophy**

### **Why These Metrics Matter**
As a Customer Success Manager, I chose these three core metrics because they're:

1. **📊 Predictive** - Strong correlation with churn and expansion
2. **🎯 Actionable** - CSMs can directly influence these areas  
3. **📈 Measurable** - Available in most SaaS tech stacks
4. **⚖️ Balanced** - No single metric dominates the score

### **The 40-40-20 Weight Distribution**
- **40% Engagement Status** - Relationship quality and communication frequency
- **40% Feature Adoption** - Product usage depth and sophistication  
- **20% Support Health** - Problem resolution and customer effort

This weighting reflects that **relationship + product value** are the strongest churn predictors, while **support volume** is an important early warning signal.

---

## 🔢 **Core Calculation Formula**

### **Overall Health Score (0-100)**
```javascript
Overall Health Score = 
  (Engagement Score × 0.40) + 
  (Feature Adoption Score × 0.40) + 
  (Support Health Score × 0.20)
```

**Example Calculation:**
- Client has "Highly Engaged" status → 90 points
- Feature adoption score of 75 → 75 points  
- 3 support tickets in 4 weeks → 80 points
- **Result:** (90 × 0.4) + (75 × 0.4) + (80 × 0.2) = **82 points**

---

## 🤝 **Component 1: Engagement Status Score (40% weight)**

### **Scoring Matrix**

| **Engagement Level** | **Points** | **Typical Behaviors** | **CSM Action Required** |
|---------------------|------------|----------------------|------------------------|
| **Highly Engaged** | 90 | Regular calls, strategic discussions, feature requests | Nurture relationship, explore expansion |
| **Engaged** | 70 | Responsive to outreach, attends meetings, asks questions | Maintain cadence, provide value |
| **Passive** | 40 | Minimal responses, reactive only, basic usage | Re-engagement campaign, value demonstration |
| **Disengaged** | 20 | No response to outreach, declining usage, complaints | Urgent intervention, executive escalation |

### **Business Logic**
```javascript
switch (engagementStatus) {
  case 'Highly Engaged': return 90;
  case 'Engaged': return 70;
  case 'Passive': return 40;
  case 'Disengaged': return 20;
  default: return 50; // Unknown/neutral
}
```

### **Data Source Integration**
- **Manual Entry** - CSM assessment based on recent interactions
- **CRM Integration** - Meeting frequency, email responses, call participation
- **Product Analytics** - Login frequency, session duration, feature exploration

---

## 📊 **Component 2: Feature Adoption Score (40% weight)**

### **Scoring Approach**
This score is **passed through directly** (0-100) from your product analytics platform, representing the percentage of key features the client has adopted.

### **Typical Feature Adoption Metrics**
- **Core Features** - Essential functionality for basic value realization
- **Advanced Features** - Sophisticated capabilities indicating maturity
- **Integration Usage** - API calls, third-party connections, data exports
- **Admin Features** - User management, permissions, custom configurations

### **Business Logic**
```javascript
// Direct pass-through with bounds checking
const adoptionScore = Math.max(0, Math.min(100, featureAdoptionScore));
```

### **Industry Benchmarks**
- **🔴 <30%** - High churn risk, basic usage only
- **🟡 30-70%** - Moderate adoption, room for growth
- **🟢 70%+** - Power user, expansion candidate

### **Data Source Integration**
- **Product Analytics** - Mixpanel, Amplitude, Google Analytics
- **Usage Databases** - Direct database queries on feature usage
- **Customer Success Platforms** - Gainsight, ChurnZero, Totango

---

## 🎫 **Component 3: Support Health Score (20% weight)**

### **Scoring Matrix**

| **Tickets (4 weeks)** | **Points** | **Health Indicator** | **Typical Meaning** |
|----------------------|------------|---------------------|-------------------|
| **0-2 tickets** | 100 | Excellent | Self-sufficient, well-trained users |
| **3-5 tickets** | 80 | Good | Normal usage questions, minor issues |
| **6-10 tickets** | 60 | Concerning | Struggling with product, training gaps |
| **11+ tickets** | 30 | Critical | Major problems, potential churn risk |

### **Business Logic**
```javascript
let supportHealthScore = 100;
if (supportTickets4mo > 10) supportHealthScore = 30;
else if (supportTickets4mo > 5) supportHealthScore = 60;
else if (supportTickets4mo > 2) supportHealthScore = 80;
// else remains 100 for 0-2 tickets
```

### **Why 4 Weeks?**
- **Recent enough** to reflect current health
- **Long enough** to smooth out anomalies
- **Actionable timeframe** for CSM intervention

### **Data Source Integration**
- **Support Platforms** - Zendesk, Intercom, Freshdesk
- **Help Desk APIs** - Automated ticket volume queries
- **Manual Tracking** - Spreadsheet or CRM-based logging

---

## 🎯 **Health Status Categories**

### **Status Assignment Logic**
```javascript
let healthStatus = 'Critical';
if (overallHealthScore >= 75) healthStatus = 'Healthy';
else if (overallHealthScore >= 50) healthStatus = 'At Risk';
// else remains 'Critical' for <50
```

### **Status Definitions**

#### **🟢 Healthy (75-100 points)**
- **Characteristics:** Strong relationship, good adoption, minimal support needs
- **CSM Focus:** Expansion opportunities, strategic value delivery
- **Renewal Confidence:** High (>95% retention expected)
- **Action Items:** Quarterly business reviews, upsell conversations

#### **🟡 At Risk (50-74 points)**  
- **Characteristics:** Mixed signals, moderate engagement or adoption gaps
- **CSM Focus:** Improvement plans, training, relationship building
- **Renewal Confidence:** Moderate (70-90% retention expected)
- **Action Items:** Monthly check-ins, success plan development

#### **🔴 Critical (<50 points)**
- **Characteristics:** Poor engagement, low adoption, high support volume
- **CSM Focus:** Urgent intervention, executive escalation, recovery plan
- **Renewal Confidence:** Low (<70% retention expected)  
- **Action Items:** Weekly touchpoints, emergency success planning

---

## 🚨 **Automated Risk Flags**

### **Expansion Ready Logic**
```javascript
const expansionReady = (
  featureAdoptionScore >= 70 &&
  (engagementStatus === 'Highly Engaged' || engagementStatus === 'Engaged') &&
  supportTickets4mo <= 3
);
```

**Business Rationale:** High adoption + strong relationship + low friction = upsell opportunity

### **Needs Attention Logic**
```javascript
const needsImmediateAttention = (
  overallHealthScore < 60 ||
  (daysToRenewal <= 60 && overallHealthScore < 75) ||
  lastContactDays > 30 ||
  featureAdoptionScore < 40 ||
  engagementStatus === 'Passive' ||
  engagementStatus === 'Disengaged' ||
  supportTickets4mo > 5
);
```

**Business Rationale:** Multiple risk factors or approaching renewal with poor health

### **Renewal Risk Logic**
```javascript
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
```

**Business Rationale:** Renewal approaching with concerning health indicators

---

## 📊 **Score Distribution & Benchmarks**

### **Typical Score Distribution**
Based on healthy SaaS customer bases:

- **90-100 points:** Top 10% of accounts (expansion candidates)
- **75-89 points:** 60% of accounts (healthy, stable)  
- **50-74 points:** 25% of accounts (need attention)
- **Below 50:** 5% of accounts (critical intervention required)

### **Industry Benchmarks**

#### **B2B SaaS (Enterprise)**
- **Average Health Score:** 72
- **Healthy Threshold:** 75+
- **Churn Risk Threshold:** <60

#### **B2B SaaS (SMB)**  
- **Average Health Score:** 68
- **Healthy Threshold:** 70+
- **Churn Risk Threshold:** <55

#### **B2C SaaS**
- **Average Health Score:** 65
- **Healthy Threshold:** 65+  
- **Churn Risk Threshold:** <50

---

## ⚙️ **Customization Guidelines**

### **Adjusting Component Weights**

**For Product-Led Growth Companies:**
```javascript
// Emphasize adoption over relationship
(engagementScore * 0.25) + (adoptionScore * 0.60) + (supportHealthScore * 0.15)
```

**For High-Touch Enterprise:**
```javascript
// Emphasize relationship over product usage
(engagementScore * 0.60) + (adoptionScore * 0.25) + (supportHealthScore * 0.15)
```

**For Technical Products:**
```javascript
// Support volume is more critical indicator
(engagementScore * 0.35) + (adoptionScore * 0.35) + (supportHealthScore * 0.30)
```

### **Modifying Thresholds**

**Conservative Approach (Lower Risk Tolerance):**
```javascript
if (overallHealthScore >= 80) healthStatus = 'Healthy';        // Raised from 75
else if (overallHealthScore >= 60) healthStatus = 'At Risk';   // Raised from 50
```

**Aggressive Approach (Higher Risk Tolerance):**
```javascript
if (overallHealthScore >= 70) healthStatus = 'Healthy';        // Lowered from 75  
else if (overallHealthScore >= 40) healthStatus = 'At Risk';   // Lowered from 50
```

### **Industry-Specific Adjustments**

**Healthcare/Compliance-Heavy:**
- Increase support health weight (security/compliance questions normal)
- Lower support ticket thresholds (more questions expected)

**Developer Tools:**
- Emphasize feature adoption (technical users expect full utilization)
- Add API usage metrics to adoption score

**Marketing/Sales Tools:**
- Weight engagement status higher (relationship-driven sales)
- Include usage frequency in adoption calculations

---

## 📈 **Validation & Testing**

### **Score Accuracy Validation**
1. **Historical Analysis** - Compare scores to actual churn/expansion outcomes
2. **CSM Gut Check** - Do scores align with CSM intuition?
3. **Cohort Analysis** - Track score changes over customer lifecycle
4. **A/B Testing** - Test different weights with customer subsets

### **Continuous Improvement**
- **Monthly Score Reviews** - Analyze score distribution and outliers
- **Quarterly Weight Adjustments** - Based on churn/expansion correlation
- **Annual Algorithm Updates** - Incorporate new data sources and learnings

### **Success Metrics**
- **Predictive Accuracy** - % of churn correctly identified 60+ days early
- **False Positive Rate** - % of "at risk" accounts that actually renewed
- **Expansion Identification** - % of upsells correctly flagged as "expansion ready"
- **CSM Efficiency** - Time saved on manual health assessments

---

## 🔍 **Troubleshooting Score Issues**

### **Scores Too High Overall**
- **Cause:** Thresholds too lenient or weights favor strong areas
- **Fix:** Raise health status thresholds or increase support health weight

### **Scores Too Low Overall**  
- **Cause:** Thresholds too strict or data quality issues
- **Fix:** Lower thresholds or clean up source data

### **Scores Don't Match CSM Intuition**
- **Cause:** Missing context or different prioritization
- **Fix:** Add qualitative factors or adjust component weights

### **Too Many False Positives**
- **Cause:** Algorithm too sensitive to individual metrics
- **Fix:** Require multiple risk factors for flags

---

## 📚 **Additional Resources**

### **Academic Research**
- Customer Success metrics correlation studies
- Churn prediction model research
- SaaS health scoring best practices

### **Industry Reports**  
- Gainsight Customer Success benchmarks
- ChurnZero health scoring guides
- Totango customer health research

### **Implementation Examples**
- Case studies from successful CS teams
- Open source health scoring models
- Industry-specific customizations

---

*This scoring algorithm represents battle-tested Customer Success methodology, refined through real-world application with 50+ SaaS accounts. Customize it for your specific business model and customer base.*
