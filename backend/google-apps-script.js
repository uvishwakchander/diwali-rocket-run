/**
 * ============================================================================
 * DIWALI ROCKET RUN - 100% FREE GLOBAL LEADERBOARD & TELEMETRY BACKEND
 * ============================================================================
 * 
 * This Google Apps Script turns your personal Google Sheet into a global,
 * real-time database for Diwali Rocket Run:
 * 
 * 1. Sheet Tab "Global_Champions": Stores and automatically ranks the Top 10
 *    players worldwide. Visible to all players globally in the game!
 * 
 * 2. Sheet Tab "Telemetry_Log": Captures every single game session played
 *    (Player, Score, Milestone City, Distance, Coins, Fuel %, Flight Time, Device).
 * 
 * ----------------------------------------------------------------------------
 * QUICK SETUP INSTRUCTIONS (Takes ~60 seconds):
 * ----------------------------------------------------------------------------
 * 1. Open Google Sheets (https://sheets.new) and create a new blank sheet.
 *    Name it: "Diwali Rocket Run - Champions & Telemetry"
 * 
 * 2. Click on "Extensions" in the top menu -> Click "Apps Script".
 * 
 * 3. Delete any default code in Code.gs, paste this ENTIRE file, and click Save (💾).
 * 
 * 4. Click the blue "Deploy" button (top right) -> "New deployment".
 *    - Select type: "Web app" (click the gear icon -> Web app).
 *    - Description: "Diwali Rocket Run Backend"
 *    - Execute as: "Me" (your email)
 *    - Who has access: "Anyone" (allows players worldwide to submit scores)
 *    - Click "Deploy".
 *    - (If prompted, authorize permissions for your own Google account).
 * 
 * 5. Copy the generated "Web app URL" (starts with https://script.google.com/macros/s/...)
 * 
 * 6. Paste that URL into `js/config.js` in the `API_URL` property:
 *    API_URL: "https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec"
 * 
 * That's it! Your game now has a live worldwide leaderboard and analytics!
 * ============================================================================
 */

function setupSheets() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  // 1. Leaderboard Sheet
  let champSheet = ss.getSheetByName("Global_Champions");
  if (!champSheet) {
    champSheet = ss.insertSheet("Global_Champions");
    champSheet.appendRow(["Rank", "Pilot Name", "Score", "Milestone Reached", "Date"]);
    champSheet.getRange(1, 1, 1, 5).setFontWeight("bold").setBackground("#ffd700").setFontColor("#0b062b");
    
    // Seed sample initial festive champions
    champSheet.appendRow([1, "Diwali Rider", 18500, "BDC14 Bangalore", new Date().toLocaleDateString()]);
    champSheet.appendRow([2, "Chennai Express", 14200, "Hosur", new Date().toLocaleDateString()]);
    champSheet.appendRow([3, "Rocket Raja", 11600, "Krishnagiri", new Date().toLocaleDateString()]);
    champSheet.appendRow([4, "Festive Flyer", 9800, "Vellore", new Date().toLocaleDateString()]);
    champSheet.appendRow([5, "Sparkler Ace", 7500, "CDC2 Chennai", new Date().toLocaleDateString()]);
    champSheet.setColumnWidth(1, 60);
    champSheet.setColumnWidth(2, 160);
    champSheet.setColumnWidth(3, 100);
    champSheet.setColumnWidth(4, 180);
    champSheet.setColumnWidth(5, 120);
  }

  // 2. Telemetry Log Sheet
  let telemSheet = ss.getSheetByName("Telemetry_Log");
  if (!telemSheet) {
    telemSheet = ss.insertSheet("Telemetry_Log");
    telemSheet.appendRow([
      "Timestamp",
      "Pilot Name",
      "Score",
      "Mission Status",
      "Milestone City",
      "Distance (km)",
      "Coins Collected",
      "Flight Time (s)",
      "Remaining Fuel (%)",
      "Device Platform"
    ]);
    telemSheet.getRange(1, 1, 1, 10).setFontWeight("bold").setBackground("#7209b7").setFontColor("#ffffff");
    telemSheet.setColumnWidth(1, 160);
    telemSheet.setColumnWidth(2, 150);
    telemSheet.setColumnWidth(3, 90);
    telemSheet.setColumnWidth(4, 110);
    telemSheet.setColumnWidth(5, 150);
  }

  // Remove default "Sheet1" if empty
  const defaultSheet = ss.getSheetByName("Sheet1");
  if (defaultSheet && defaultSheet.getLastRow() === 0) {
    try { ss.deleteSheet(defaultSheet); } catch(e) {}
  }
}

/**
 * Handle HTTP GET Requests
 * Usage:
 * - GET ?action=get_leaderboard -> returns top champions
 * - GET ?action=submit_score&... -> fallback submit via GET query parameters for zero CORS hurdles
 */
function doGet(e) {
  setupSheets();
  const params = e ? e.parameter : {};
  const action = params.action || "get_leaderboard";

  if (action === "submit_score" || action === "log_session") {
    return handleSessionSubmission(params);
  }

  const limit = parseInt(params.limit, 10) || 1000;
  return getLeaderboardResponse(limit);
}

/**
 * Handle HTTP POST Requests
 * Body can be JSON string or URL encoded form data
 */
function doPost(e) {
  setupSheets();
  let payload = {};

  try {
    if (e && e.postData && e.postData.contents) {
      payload = JSON.parse(e.postData.contents);
    } else if (e && e.parameter) {
      payload = e.parameter;
    }
  } catch (err) {
    payload = e && e.parameter ? e.parameter : {};
  }

  return handleSessionSubmission(payload);
}

/**
 * Record Telemetry & Update Champions Leaderboard
 */
function handleSessionSubmission(data) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const telemSheet = ss.getSheetByName("Telemetry_Log");
  const champSheet = ss.getSheetByName("Global_Champions");

  const now = new Date();
  const pilot = (data.pilot || data.name || "Festive Pilot").toString().trim().substring(0, 25);
  const score = parseInt(data.score, 10) || 0;
  const status = (data.status || "COMPLETED").toString();
  const milestone = (data.milestone || data.city || "CDC2 Chennai").toString();
  const distanceKm = data.distanceKm || data.distance || "0";
  const coins = parseInt(data.coins, 10) || 0;
  const flightTime = data.flightTime || data.time || "0";
  const fuel = data.fuelRemaining || data.fuel || "0";
  const device = (data.device || "Browser").toString();
  const maxLimit = parseInt(data.limit, 10) || 1000;

  // 1. Append session telemetry row
  if (telemSheet) {
    telemSheet.appendRow([
      now.toISOString().replace("T", " ").substring(0, 19),
      pilot,
      score,
      status,
      milestone,
      distanceKm,
      coins,
      flightTime,
      fuel,
      device
    ]);
  }

  // 2. Update Global Champions tab if valid score
  if (champSheet && score > 0) {
    const lastRow = champSheet.getLastRow();
    let rows = [];
    if (lastRow > 1) {
      const existingData = champSheet.getRange(2, 2, lastRow - 1, 4).getValues();
      rows = existingData.map(r => ({
        name: r[0],
        score: parseInt(r[1], 10) || 0,
        city: r[2],
        date: r[3]
      }));
    }

    // Add current entry
    rows.push({
      name: pilot,
      score: score,
      city: milestone,
      date: now.toLocaleDateString()
    });

    // Sort descending by score
    rows.sort((a, b) => b.score - a.score);

    // Keep top champions up to limit (1000)
    const topChampions = rows.slice(0, maxLimit);

    // Clear existing data rows (keep header row 1)
    if (lastRow > 1) {
      champSheet.getRange(2, 1, lastRow - 1, 5).clearContent();
    }

    // Write back updated sorted champions
    const outputRows = topChampions.map((entry, index) => [
      index + 1,
      entry.name,
      entry.score,
      entry.city,
      entry.date
    ]);

    if (outputRows.length > 0) {
      champSheet.getRange(2, 1, outputRows.length, 5).setValues(outputRows);
    }
  }

  return ContentService.createTextOutput(JSON.stringify({
    success: true,
    message: "Run recorded successfully! Global leaderboard updated.",
    pilot: pilot,
    score: score
  })).setMimeType(ContentService.MimeType.JSON);
}

/**
 * Return Top Global Champions as JSON
 */
function getLeaderboardResponse(limit = 1000) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const champSheet = ss.getSheetByName("Global_Champions");
  let champions = [];

  if (champSheet) {
    const lastRow = champSheet.getLastRow();
    if (lastRow > 1) {
      const rowCount = Math.min(lastRow - 1, limit);
      const data = champSheet.getRange(2, 1, rowCount, 5).getValues();
      champions = data.map(r => ({
        rank: r[0],
        name: r[1],
        score: parseInt(r[2], 10) || 0,
        city: r[3],
        date: r[4]
      }));
    }
  }

  return ContentService.createTextOutput(JSON.stringify({
    success: true,
    champions: champions
  })).setMimeType(ContentService.MimeType.JSON);
}
