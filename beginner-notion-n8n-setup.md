# 🎯 Complete Beginner Guide: Connecting Notion to n8n

## 📋 Overview: What We're Doing

We need to create a "bridge" between Notion and n8n so they can talk to each other. This involves:
1. Creating an integration in Notion (like giving n8n a key)
2. Giving that key to n8n 
3. Telling Notion which database n8n can access

Let's do this step by step with screenshots and explanations.

---

## 🔐 **PART 1: Create Notion Integration (The Key)**

### **Step 1: Go to Notion Integrations Page**
1. **Open a new browser tab**
2. **Go to:** https://www.notion.so/my-integrations
3. **You should see a page titled "My integrations"**

**What's happening:** This is where Notion manages all the apps and services that can connect to your workspace.

### **Step 2: Create New Integration**
1. **Click the blue "New integration" button**
2. **You'll see a form with these fields:**

**Fill out the form:**
- **Name:** `Customer Success Dashboard` (or whatever you want to call it)
- **Associated workspace:** Select your workspace from the dropdown
- **Logo:** Leave blank (optional)

3. **Click "Submit"**

**What's happening:** You're creating a "service account" that n8n can use to access your Notion data.

### **Step 3: Copy Your Integration Token**
1. **After clicking Submit, you'll see a new page**
2. **Look for "Internal Integration Token"**
3. **It will look like:** `secret_ABC123DEF456...` (starts with "secret_")
4. **Click "Copy" next to the token**
5. **⚠️ IMPORTANT:** Keep this tab open - you'll need this token in the next part

**What's happening:** This token is like a password that proves n8n is allowed to access your Notion workspace.

---

## 🔗 **PART 2: Give the Key to n8n**

### **Step 4: Create Notion Credentials in n8n**
1. **Go to your n8n dashboard**
2. **Click "Credentials" in the left sidebar**
3. **Click "Add Credential" (or the + button)**
4. **Search for "Notion"**
5. **Select "Notion API"** (not "Notion Trigger")

### **Step 5: Enter Your Token**
1. **You'll see a form with "API Key" field**
2. **Paste your token** (the one that starts with "secret_")
3. **Name this credential:** `Notion Customer Success` (or whatever helps you remember)
4. **Click "Save"**

**What's happening:** You're giving n8n the key to access your Notion workspace.

### **Step 6: Test the Connection**
1. **Click "Test" button** (if available)
2. **You should see "Connection successful" or similar**
3. **If it fails:** Double-check you copied the full token correctly

---

## 🗄️ **PART 3: Give n8n Access to Your Specific Database**

### **Step 7: Find Your Database in Notion**
1. **Go back to Notion**
2. **Open your Customer Success database** (the one you created)
3. **Make sure you're viewing the database** (not just a page)

**How to tell it's a database:** You should see columns, rows, and filter/sort options at the top.

### **Step 8: Connect Your Integration to the Database**
1. **In your database, look for the "..." (three dots) button**
2. **It's usually in the top-right area of your database**
3. **Click the "..." button**
4. **Look for "Add connections" or "Connections"**

**⚠️ If you DON'T see "Add connections":**
- Your integration might not be created properly
- Go back to Part 1 and make sure you completed all steps
- Make sure the integration is in the same workspace as your database

### **Step 9: Connect Your Integration**
1. **Click "Add connections"**
2. **You should see a list of available integrations**
3. **Look for "Customer Success Dashboard"** (or whatever you named it)
4. **Click on it to connect**
5. **You should see a confirmation**

**What's happening:** You're telling Notion "this specific database can be accessed by this integration."

---

## 🔢 **PART 4: Get Your Database ID**

### **Step 10: Copy Database ID from URL**
1. **While viewing your database in Notion**
2. **Copy the URL from your browser's address bar**
3. **The URL will look like:**
   ```
   https://www.notion.so/DATABASE_ID_HERE?v=view_id&source=copy_link
   ```

4. **Find the 32-character string** (letters and numbers)
5. **Example:** In this URL:
   ```
   https://www.notion.so/277c41d9f612806e8edee083916d278b?v=277c41d9f612805f91a7000c46ac0a8f&source=copy_link
   ```
   **Database ID is:** `277c41d9f612806e8edee083916d278b`

6. **⚠️ CRITICAL:** Copy the ID **WITHOUT hyphens** when pasting into n8n
   - ✅ **Correct for n8n:** `277c41d9f612806e8edee083916d278b`
   - ❌ **Wrong:** `277c41d9-f612-806e-8ede-e083916d278b` (with hyphens)

**What's happening:** Every database in Notion has a unique ID. n8n needs this ID to know which specific database to connect to.

---

## ⚙️ **PART 5: Set Up Your n8n Workflow**

### **Step 11: Import the Workflow**
1. **In n8n, go to "Workflows"**
2. **Click "Add Workflow" → "Import from JSON"**
3. **Copy the contents** of `weekly-notion-scoring-workflow.json`
4. **Paste into the text box**
5. **Click "Import"**

### **Step 12: Configure the Notion Node**
1. **You'll see your workflow with several nodes**
2. **Click on the "Get All Client Data" node** (it's a Notion node)
3. **In the node settings:**
   - **Credentials:** Select "Notion Customer Success" (the one you created)
   - **Database ID:** Paste your database ID here
4. **Click "Save"**

### **Step 13: Configure the Update Node**
1. **Click on the "Update Client Health Scores" node**
2. **In the node settings:**
   - **Credentials:** Select "Notion Customer Success"
   - **Database ID:** Paste the same database ID
4. **Click "Save"**

---

## 🧪 **PART 6: Test Everything**

### **Step 14: Test the Connection**
1. **Click on the "Get All Client Data" node**
2. **Click "Execute Node"** (play button)
3. **You should see your database records** appear in the output

**If it works:** You'll see data from your Notion database
**If it fails:** You'll see an error message

### **Common Error Messages and Fixes:**

**Error: "Could not find database"**
- **Fix:** Double-check your database ID
- **Fix:** Make sure integration is connected to database (Step 8-9)

**Error: "Unauthorized"**
- **Fix:** Check your integration token in n8n credentials
- **Fix:** Make sure token starts with "secret_"

**Error: "Integration not found"**
- **Fix:** Go back to Part 1 and recreate the integration

---

## ✅ **Success Checklist**

Before moving forward, make sure:
- [ ] Integration created in Notion with token copied
- [ ] Token added to n8n credentials and tested
- [ ] Database connected to integration via "Add connections"
- [ ] Database ID copied from URL (32 characters)
- [ ] Database ID added to n8n workflow nodes
- [ ] "Get All Client Data" node executes successfully

---

## 🚨 **Advanced Troubleshooting (If Still Getting Errors)**

### **Problem: "Could not find database" Error Even With Correct Setup**

If you're still getting the error after following all steps:

#### **Solution 1: Re-sync Integration Permissions**
1. **Go to your Notion integration page** (https://www.notion.so/my-integrations)
2. **Click on your integration**
3. **Click "Edit access"**
4. **Remove your database** from the integration
5. **Wait 1-2 minutes** (Notion needs time to sync)
6. **Add your database back** to the integration
7. **Wait another 2-3 minutes**
8. **Test in n8n again**

#### **Solution 2: Database ID Format Check**
Double-check you're entering the ID correctly in n8n:
- **Your Database ID:** `277c41d9f612806e8edee083916d278b`
- **Length:** Exactly 32 characters
- **Format:** No hyphens, no spaces
- **Case:** Lowercase letters and numbers only

#### **Solution 3: Simple Test Node**
Create a minimal test:
1. **New workflow in n8n**
2. **Add single "Notion" node**
3. **Action:** "Get database items"
4. **Credentials:** Your integration
5. **Database ID:** `277c41d9f612806e8edee083916d278b`
6. **Execute node**

#### **Solution 4: Integration Workspace Check**
1. **In Notion integrations page**
2. **Verify "Associated workspace"** matches where your database lives
3. **If wrong workspace:** Create new integration in correct workspace

#### **Solution 5: Fresh Integration (Last Resort)**
1. **Delete current integration** in Notion
2. **Create brand new integration**
3. **Get new token**
4. **Add new credentials in n8n**
5. **Connect new integration to database**

### **Common Error Messages:**

**Error: "Could not find database with ID"**
- **Fix:** Check database ID format (no hyphens)
- **Fix:** Re-sync integration permissions (Solution 1)

**Error: "Unauthorized" or "403"**
- **Fix:** Check integration token in n8n credentials
- **Fix:** Verify integration has access to database

**Error: "Invalid database ID"**
- **Fix:** Make sure using database ID, not page ID
- **Fix:** Verify 32-character format

## 🆘 **Still Having Issues?**

If you're still getting errors after trying the advanced troubleshooting:

1. **Share your exact error message** - I can help diagnose
2. **Screenshot of n8n node settings** - Show database ID field
3. **Double-check workspace** - Make sure integration and database match
4. **Try the simple test node** - Isolate the problem

**Remember:** This is totally normal for first-time setup! These integrations can be tricky, but once they work, they work reliably.

---

## 🎯 **What Happens Next**

Once this connection works:
1. **Your workflow will read** all your client data from Notion
2. **Calculate health scores** using the JavaScript logic
3. **Update the blank fields** in your database
4. **Send Slack alerts** for critical clients

**You're doing great!** Take it one step at a time, and let me know exactly where you get stuck.

---

## 📋 **Where We Left Off (Resume Point)**

**Status:** Integration created ✅, Database connected ✅, Database ID identified ✅
**Next:** Troubleshoot the "Could not find database" error in n8n

**Your Database ID:** `277c41d9f612806e8edee083916d278b`
**Your Database URL:** https://www.notion.so/277c41d9f612806e8edee083916d278b?v=277c41d9f612805f91a7000c46ac0a8f&source=copy_link

**Tomorrow's Tasks:**
1. Try the "Re-sync Integration Permissions" solution first
2. Test with simple single Notion node 
3. If still failing, create fresh integration
4. Once working, import full workflow and test

**You're 90% there - just need to get past this connection hurdle!** 🚀
