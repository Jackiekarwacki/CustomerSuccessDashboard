# 📊 Field Population Guide: Manual vs Automated

## 🤖 What the JavaScript Calculates vs 📝 What You Enter Manually

This guide clarifies exactly which fields are populated automatically by the n8n JavaScript workflow versus which ones require manual data entry.

---

## 📝 **MANUAL DATA ENTRY FIELDS** (You Input These)

### Basic Client Information
```
✋ Client Name (Title) - You enter the company name
✋ Account Manager (Person) - You assign the CSM
✋ Renewal Date (Date) - You enter contract renewal date
✋ Last Contact Date (Date) - You update when you last spoke
```

### Feature Adoption Data (Raw Numbers)
```
✋ Features Used (Number) - Count from your product analytics
✋ Total Features Available (Number) - Your product's total feature count
✋ Advanced Features Used (Number) - Power user features count
```

### Relationship Data (Your Assessment)
```
✋ Meetings Last 3 Months (Number) - Count of recent meetings
✋ Positive Meetings (Number) - How many went well
✋ Recent Meeting Topics (Rich Text) - Key discussion points
✋ Meeting Highlights (Rich Text) - Important outcomes/notes
✋ Communication Rating (Select) - Your assessment: Excellent/Good/Average/Poor
✋ Relationship Strength (Select) - Your assessment: Champion/Strong/Neutral/Weak/Strained
```

### Engagement Data (From Your Systems)
```
✋ Onboarding Progress % (Number) - From LMS or manual tracking
✋ Learning Modules Completed (Number) - Training completions
✋ Certifications Earned (Number) - Certifications achieved
✋ Training Attendance Rate (Number) - % attendance at sessions
```

### Financial Data (From Billing/CRM)
```
✋ Current ARR (Number) - Annual recurring revenue
✋ ARR Trend (Select) - Increasing/Stable/Decreasing (your assessment)
✋ Payment Status (Select) - Current/Late/Overdue/Failed
✋ Contract Type (Select) - Enterprise/Standard/Startup/At Risk
```

### Support Data (From Support System)
```
✋ Support Tickets (30d) (Number) - Recent ticket count
✋ Critical Tickets (Number) - High priority tickets
✋ Support Satisfaction (Number) - 1-5 CSAT score
✋ Escalated Tickets (Number) - Tickets requiring escalation
```

---

## 🤖 **AUTOMATED JAVASCRIPT CALCULATIONS** (n8n Populates These)

### Overall Health Metrics
```
🤖 Overall Health Score (Number) - Weighted calculation of all scores
🤖 Health Status (Select) - Healthy/At Risk/Critical based on overall score
🤖 Relationship Color Score (Select) - Green/Yellow/Red based on relationship factors
```

### Component Scores (Calculated from Your Manual Data)
```
🤖 Feature Adoption Score (Number) - Calculated from features used/total
🤖 Relationship Score (Number) - JavaScript algorithm using meeting data, renewal proximity, communication rating
🤖 Engagement Score (Number) - Weighted calculation from onboarding + training data
🤖 ARR Health Score (Number) - Based on payment status, trend, contract type
🤖 Support Health Score (Number) - Calculated from ticket volume, satisfaction, escalations
```

### Smart Insights & Recommendations
```
🤖 Key Insights (Multi-select) - Auto-generated insight tags like:
   - "Low feature adoption"
   - "Relationship at risk"
   - "Poor onboarding progress"
   - "Payment/billing issues"
   - "High support burden"
   - "Renewal risk"

🤖 Expansion Opportunities (Multi-select) - Auto-generated opportunity tags like:
   - "High engagement - upsell ready"
   - "Strong relationship - expansion ready"
   - "Highly engaged - advocate potential"
   - "Growing usage - expansion timing"

🤖 Action Items (Multi-select) - Auto-generated action tags like:
   - "Schedule immediate check-in call"
   - "Initiate renewal conversation"
   - "Review support ticket trends"
   - "Re-engage with onboarding team"
   - "Reach out - overdue for contact"
```

### Smart Flags & Alerts
```
🤖 Needs Immediate Attention (Checkbox) - Auto-checked when:
   - Overall health score < 50 OR
   - Relationship color = Red OR
   - Action items > 2

🤖 Expansion Ready (Checkbox) - Auto-checked when:
   - Overall health score > 80 AND
   - Has expansion opportunities

🤖 Renewal Risk (Checkbox) - Auto-checked when:
   - Days to renewal < 90 AND
   - Overall health score < 70

🤖 Last Health Calculation (Date) - Timestamp of last n8n run
```

---

## 🧠 **JavaScript Relationship Scoring Logic**

The most complex calculation is the **Relationship Score** which uses this logic:

### Meeting Analysis
```javascript
// Meeting frequency scoring
if (totalMeetings < 3) relationshipScore -= 20;
else if (totalMeetings < 6) relationshipScore -= 10;

// Meeting sentiment scoring  
const positiveRatio = positiveMeetings / totalMeetings;
if (positiveRatio < 0.5) relationshipScore -= 30;
else if (positiveRatio < 0.7) relationshipScore -= 15;
```

### Renewal Risk Assessment
```javascript
// Renewal proximity penalties
if (daysToRenewal < 30) relationshipScore -= 25;
else if (daysToRenewal < 60) relationshipScore -= 15;
else if (daysToRenewal < 90) relationshipScore -= 5;
```

### Communication Quality
```javascript
// Communication responsiveness
if (lastContactDays > 14) relationshipScore -= 20;
else if (lastContactDays > 7) relationshipScore -= 10;

// Communication rating impact
if (communicationRating === 'Poor') relationshipScore -= 25;
else if (communicationRating === 'Excellent') relationshipScore += 10;

// Relationship strength impact
if (relationshipStrength === 'Champion') relationshipScore += 15;
else if (relationshipStrength === 'Strained') relationshipScore -= 30;
```

### Final Color Assignment
```javascript
// Convert score to color
if (relationshipScore >= 75) relationshipColor = 'Green';
else if (relationshipScore >= 50) relationshipColor = 'Yellow';
else relationshipColor = 'Red';
```

---

## 📋 **Sample Data Entry Workflow**

### Weekly Data Update Process (30-45 minutes)
```
For Each Client:
1. ✋ Check product analytics → Update "Features Used"
2. ✋ Review CRM → Count "Meetings Last 3 Months" & "Positive Meetings"
3. ✋ Check LMS → Update "Onboarding Progress %" and "Learning Modules"
4. ✋ Verify billing → Update "Current ARR" and "Payment Status"
5. ✋ Check support system → Update "Support Tickets (30d)" and satisfaction
6. ✋ Assess relationship → Update "Communication Rating" and "Relationship Strength"
7. 🤖 Run n8n workflow → All scores and insights auto-calculate
8. 🤖 Review automated alerts → Act on "Needs Immediate Attention" flags
```

---

## 🎯 **Key Benefits of This Approach**

### Manual Control Where It Matters
✅ **Relationship Assessment** - Your human judgment on communication quality
✅ **Meeting Outcomes** - Your evaluation of meeting success
✅ **Data Accuracy** - You control the input data quality
✅ **Business Context** - You add context the automation can't know

### Automation Where It Adds Value  
✅ **Complex Calculations** - JavaScript handles weighted scoring algorithms
✅ **Pattern Recognition** - Automated insights from data combinations
✅ **Alert Generation** - Smart flags based on multiple criteria
✅ **Consistency** - Same scoring logic applied to all clients

### Perfect Balance
✅ **Time Efficient** - 30-45 minutes weekly vs hours of manual analysis
✅ **Accurate Insights** - Human input + automated processing
✅ **Actionable Alerts** - Clear next steps generated automatically
✅ **Scalable Process** - Works for 10 clients or 100+ clients

---

## 🚀 **Getting Started**

### Phase 1: Set Up Sample Data
```
1. Create 3 test clients in Notion
2. Fill in all the ✋ manual fields with realistic data
3. Run the n8n workflow
4. Watch all the 🤖 automated fields populate
5. Verify the calculations make sense
```

### Phase 2: Production Deployment
```
1. Add your real clients (start with 5-10)
2. Enter current data for all manual fields
3. Set up weekly data entry routine
4. Configure Slack alerts for automated notifications
5. Train team on interpreting the automated insights
```

**The beauty of this system: You provide the human intelligence and business context, while JavaScript handles the complex calculations and pattern recognition! 🎯**

