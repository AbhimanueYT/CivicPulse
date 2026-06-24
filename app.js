// CivicPulse Application Logic - Challenge 2 (Hyperlocal Civic Solver)

// ==========================================================================
// 1. INITIAL STATE & MOCK DATABASE
// ==========================================================================
const DEFAULT_ISSUES = [
  {
    id: "issue-1",
    title: "Deep Pothole on 100 Feet Rd",
    category: "infrastructure",
    severity: 3, // High
    status: "reported",
    description: "A large, deep pothole has opened up near the busy junction. Vehicles are swerving to avoid it, creating a major collision hazard for two-wheelers.",
    photo: "pothole",
    coords: [12.9716, 77.6412],
    reportedBy: "Siddharth S.",
    reportedAt: "2026-06-22",
    verifications: 2,
    agentRun: null
  },
  {
    id: "issue-2",
    title: "Flickering Streetlight in Block 3",
    category: "utilities",
    severity: 2, // Medium
    status: "triaged",
    description: "Streetlight #K-42 has been flickering continuously for three days. The back alleyway is pitch dark at night, raising safety concerns.",
    photo: "streetlight",
    coords: [12.9352, 77.6244],
    reportedBy: "Meera Nair",
    reportedAt: "2026-06-21",
    verifications: 4,
    agentRun: {
      completed: true,
      visionTags: "Issue: Damaged/Flickering Street Lamp\nEquipment ID: K-42\nEst. Lumens: <100 (Flicker cycle 1.2s)\nHazard rating: Medium (Dark alley, pedestrian path)\nDuplicate Check: 0 similar issues nearby.",
      grievance: "To,\nThe Chief Engineer,\nElectricity Board (KPTCL/BESCOM)\n\nSubject: Urgent repair of damaged streetlight #K-42 in Koramangala Block 3\n\nDear Sir/Madam,\n\nWe hereby report a malfunctioning streetlight (ID: K-42) located at Coordinates [12.9352, 77.6244]. The light oscillates between completely off and high-frequency flickering, leaving the pedestrian alleyway in darkness during evening hours.\n\nPlease dispatch an emergency repair crew to replace the faulty bulb/ballast.\n\nSincerely,\nCivicPulse Local Triage Desk",
      matchedVolunteers: "1. Vikram M. (Electrical Specialist) - 1.2km away [Notified]\n2. Rohan K. (General Maintainer) - 2.1km away"
    }
  },
  {
    id: "issue-3",
    title: "Overflowing Garbage Bin near Metro",
    category: "sanitation",
    severity: 4, // Critical
    status: "assigned",
    description: "Municipal trash collection bin is overflowing onto the main sidewalk. Severe odor and stray animals scattering debris. Needs immediate clearance.",
    photo: "garbage",
    coords: [12.9815, 77.5985],
    reportedBy: "Ananya Rao",
    reportedAt: "2026-06-23",
    verifications: 5,
    assignedHero: "Rohan K.",
    agentRun: {
      completed: true,
      visionTags: "Issue: Solid Waste Accumulation\nOverflow Scale: High (~150kg excess)\nMaterial details: Mixed domestic waste, organic debris\nHazard rating: Critical (Sidewalk blockage, health hazard)\nDuplicate Check: No duplicates.",
      grievance: "To,\nThe Ward Sanitary Inspector,\nCity Waste Management Corporation\n\nSubject: Overflowing municipal dustbin at Metro Station Entrance\n\nRespected Sir,\n\nThis is to draw your attention to the critical sanitation issue at Metro Station Entrance (Coords: [12.9815, 77.5985]). The large green municipal bin is completely overflowing. Garbage has spread over 10 meters of the sidewalk, blocking pedestrian traffic and creating unhygienic conditions.\n\nWe request immediate clearance of the dump and placement of an additional bin to handle peak load.\n\nSincerely,\nCivicPulse Local Triage Desk",
      matchedVolunteers: "1. Rohan K. (Sanitation Expert) - 0.4km away [CLAIMED TASK]\n2. Priyal S. (Clean-up Lead) - 1.5km away"
    }
  },
  {
    id: "issue-4",
    title: "Water Mains Leakage on MG Road",
    category: "utilities",
    severity: 3, // High
    status: "resolved",
    description: "Clean drinking water is bursting out of the underground mains pipeline near Metro pillar 120. Thousands of liters have flooded the street.",
    photo: "leakage",
    coords: [12.9738, 77.6119],
    reportedBy: "You",
    reportedAt: "2026-06-20",
    verifications: 1,
    resolvedBy: "Vikram M.",
    agentRun: {
      completed: true,
      visionTags: "Issue: High-Pressure Water Pipe Burst\nWater Flow: Heavy (~50L/min)\nHazard rating: High (Street flooding, resource waste)\nDuplicate Check: 1 pending check.",
      grievance: "To,\nThe Assistant Executive Engineer,\nWater Supply and Sewerage Board (BWSSB)\n\nSubject: Urgent reporting of water mains leakage near MG Road Pillar 120\n\nDear Sir,\n\nWe are filing this emergency report regarding a significant pipeline leakage under the road near Metro Pillar 120 (Coords: [12.9738, 77.6119]). Drinking water is escaping under pressure and flooding the eastbound carriage lane.\n\nPlease shut off the local valve and repair the pipe grid immediately.\n\nSincerely,\nCivicPulse Local Triage Desk",
      matchedVolunteers: "1. Vikram M. (Plumbing Lead) - 0.9km away [RESOLVED]"
    }
  }
];

const DEFAULT_LEADERBOARD = [
  { name: "Rohan K.", points: 450, resolutions: 9, avatar: "https://api.dicebear.com/7.x/pixel-art/svg?seed=Rohan" },
  { name: "Priyal S.", points: 380, resolutions: 7, avatar: "https://api.dicebear.com/7.x/pixel-art/svg?seed=Priyal" },
  { name: "Vikram M.", points: 340, resolutions: 6, avatar: "https://api.dicebear.com/7.x/pixel-art/svg?seed=Vikram" },
  { name: "You (Alex)", points: 120, resolutions: 4, avatar: "https://api.dicebear.com/7.x/pixel-art/svg?seed=CivicHero" },
  { name: "Sarah L.", points: 90, resolutions: 2, avatar: "https://api.dicebear.com/7.x/pixel-art/svg?seed=Sarah" }
];

const DEFAULT_COMMENTS = {
  "issue-2": [
    { user: "Meera Nair", time: "2026-06-21 16:30", text: "Malfunctioning lamp is a hazard, reported to BESCOM helpline also." },
    { user: "System", time: "2026-06-21 18:45", text: "AI Agent generated and drafted electricity division complaint document." }
  ],
  "issue-3": [
    { user: "Ananya Rao", time: "2026-06-23 10:10", text: "Severe smell near the metro gate, hope the clean-up crew arrives soon." },
    { user: "Rohan K.", time: "2026-06-23 12:40", text: "Claimed task. Moving cleaning equipment to site." }
  ]
};

// App Variables
let issues = [];
let leaderboard = [];
let comments = {};
let activeFilter = "all";
let selectedIssueId = null;
let map = null;
let markers = {};
let heatmapCircles = [];
let heatmapActive = false;
let volunteerMode = false;
let categoryChart = null;
let statusChart = null;

// Gemini Settings & Media Storage
let geminiApiKey = localStorage.getItem("civicpulse_gemini_key") || "";
let liveGeminiEnabled = localStorage.getItem("civicpulse_live_gemini") === "true";
let selectedPhotoData = "pothole"; // preset code, or base64 data url
let currentPhotoMode = "presets"; // presets, upload, camera
let cameraStream = null;

// Geolocation GPS state
let lastDetectedGeolocation = null;

// Predictive Overlay state
let predictionsActive = false;
let predictionCircles = [];

// Gemini System Triage Prompt
const GEMINI_SYSTEM_PROMPT = `You are the CivicPulse Autonomous City-Desk Triage Agent.
Analyze the provided community/civic issue description and details. 
Provide a structured JSON output with the following exact fields:
1. "verified": boolean (is this a real civic issue or public hazard? If it is spam, jokes, or completely unrelated to road damage, trash, streetlights, leakages, safety, set verified to false)
2. "category": string (must be exactly one of: "infrastructure", "sanitation", "utilities", "safety")
3. "severity": number (1 to 4: 1=Low, 2=Medium, 3=High, 4=Critical)
4. "visionTags": string (a short, formatted multi-line summary of verified details, hazard estimations, and tags)
5. "grievance": string (a formal municipal grievance document addressed to the appropriate division containing dates, coordinates, and details)
6. "suggestedSkills": string (comma-separated list of skills, e.g. "Road Work, Sanitation, Plumbing")

Ensure the output is clean, valid JSON, and contains no surrounding markdown formatting or additional talk.`;

// ==========================================================================
// 2. INITIALIZATION
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
  // Load data from LocalStorage or fallbacks
  issues = JSON.parse(localStorage.getItem("civicpulse_issues")) || DEFAULT_ISSUES;
  leaderboard = JSON.parse(localStorage.getItem("civicpulse_leaderboard")) || DEFAULT_LEADERBOARD;
  comments = JSON.parse(localStorage.getItem("civicpulse_comments")) || DEFAULT_COMMENTS;
  
  // Backfill verification data if missing in legacy records
  issues.forEach(issue => {
    if (issue.verifications === undefined) {
      issue.verifications = Math.floor(Math.random() * 4);
    }
  });
  
  initMap();
  initCharts();
  renderIssuesList();
  renderLeaderboard();
  updateHeaderStats();
  setupEventListeners();
  updateUserProfileDisplay();
});

// Initialize Leaflet Map centered on Bangalore
function initMap() {
  map = L.map('map', {
    zoomControl: true,
    attributionControl: false
  }).setView([12.9716, 77.6200], 12);
  
  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    maxZoom: 20
  }).addTo(map);

  updateMapMarkers();
}

// Redraw pins on Leaflet Map
function updateMapMarkers() {
  // Clear existing markers
  for (let id in markers) {
    map.removeLayer(markers[id]);
  }
  markers = {};

  // Redraw unless heatmap is currently active
  if (heatmapActive) return;

  issues.forEach(issue => {
    const statusClass = `marker-${issue.status}`;
    
    // Custom DIV icon for glowing neon dots
    const customIcon = L.divIcon({
      className: `custom-marker ${statusClass}`,
      iconSize: [16, 16],
      iconAnchor: [8, 8]
    });
    
    // Construct popup photo representation
    let popupImgMarkup = "";
    if (issue.photo) {
      if (issue.photo.startsWith("data:image")) {
        popupImgMarkup = `<img src="${issue.photo}" style="width: 100%; height: 60px; object-fit: cover; border-radius: 4px; margin-top: 4px; display: block; border: 1px solid rgba(255,255,255,0.1);">`;
      } else {
        popupImgMarkup = `<div style="padding: 0.25rem; background: rgba(255,255,255,0.05); text-align: center; border-radius: 4px; font-size: 0.6rem; color: #a1a1aa; border: 1px solid rgba(255,255,255,0.08); margin-top: 4px;">Preset Icon: ${issue.photo.toUpperCase()}</div>`;
      }
    }
    
    const marker = L.marker(issue.coords, { icon: customIcon })
      .addTo(map)
      .bindPopup(`
        <strong style="color: #06b6d4; font-family: var(--font-headers); font-size: 0.8rem;">${issue.title}</strong><br>
        <span style="font-size: 0.65rem; text-transform: uppercase; color: #a1a1aa;">${issue.category}</span><br>
        <span style="font-size: 0.7rem; font-weight: bold; color: ${getStatusColor(issue.status)};">Status: ${issue.status.toUpperCase()}</span>
        ${popupImgMarkup}
      `);

    marker.on('click', () => {
      selectIssue(issue.id);
    });

    markers[issue.id] = marker;
  });
}

function getStatusColor(status) {
  switch(status) {
    case 'reported': return '#ef4444';
    case 'triaged': return '#f59e0b';
    case 'assigned': return '#8b5cf6';
    case 'resolved': return '#10b981';
    default: return '#71717a';
  }
}

// Toggle density heatmap
function toggleHeatmap() {
  heatmapActive = !heatmapActive;
  const btn = document.getElementById("btn-toggle-heatmap");
  
  if (heatmapActive) {
    btn.classList.add("active");
    btn.innerHTML = `<i class="fa-solid fa-circle-dot"></i> Pin View`;
    
    // Clear markers
    for (let id in markers) {
      map.removeLayer(markers[id]);
    }
    
    // Draw circles representing issue density
    issues.forEach(issue => {
      let color = '#ef4444';
      if (issue.severity === 4) color = '#ef4444';
      else if (issue.severity === 3) color = '#f59e0b';
      else color = '#3b82f6';
      
      const circle = L.circle(issue.coords, {
        color: color,
        fillColor: color,
        fillOpacity: 0.25,
        radius: 400 + (issue.severity * 150),
        weight: 1
      }).addTo(map);
      
      heatmapCircles.push(circle);
    });
    showToast("Map switched to Density Heatmap mode.", "info");
  } else {
    btn.classList.remove("active");
    btn.innerHTML = `<i class="fa-solid fa-fire"></i> Toggle Heatmap`;
    
    // Clear heatmap overlays
    heatmapCircles.forEach(c => map.removeLayer(c));
    heatmapCircles = [];
    
    // Redraw markers
    updateMapMarkers();
    showToast("Map pins restored.", "info");
  }
}

function recenterMap() {
  if (issues.length === 0) return;
  const activeMarkers = Object.values(markers);
  if (activeMarkers.length === 0) return;
  const group = L.featureGroup(activeMarkers);
  map.fitBounds(group.getBounds().pad(0.1));
}

// ==========================================================================
// 3. CHART.JS GRAPHICAL REPORTING
// ==========================================================================
function initCharts() {
  const categoryCtx = document.getElementById('categoryChart').getContext('2d');
  const statusCtx = document.getElementById('statusChart').getContext('2d');
  
  const textColor = "#a1a1aa";
  const gridColor = "rgba(255,255,255,0.05)";

  const categories = countBy(issues, 'category');
  categoryChart = new Chart(categoryCtx, {
    type: 'doughnut',
    data: {
      labels: ['Roads', 'Sanitation', 'Utilities', 'Safety'],
      datasets: [{
        data: [
          categories['infrastructure'] || 0,
          categories['sanitation'] || 0,
          categories['utilities'] || 0,
          categories['safety'] || 0
        ],
        backgroundColor: ['#8b5cf6', '#10b981', '#06b6d4', '#ef4444'],
        borderWidth: 1,
        borderColor: '#080b11'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'right',
          labels: { color: textColor, font: { family: 'Inter', size: 9 } }
        },
        title: {
          display: true,
          text: 'Issues by Category',
          color: textColor,
          font: { family: 'Outfit', size: 11, weight: 'bold' }
        }
      }
    }
  });

  const statuses = countBy(issues, 'status');
  statusChart = new Chart(statusCtx, {
    type: 'bar',
    data: {
      labels: ['Reported', 'Triaged', 'Assigned', 'Resolved'],
      datasets: [{
        label: 'Issues Count',
        data: [
          statuses['reported'] || 0,
          statuses['triaged'] || 0,
          statuses['assigned'] || 0,
          statuses['resolved'] || 0
        ],
        backgroundColor: ['#ef4444', '#f59e0b', '#8b5cf6', '#10b981'],
        borderRadius: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        title: {
          display: true,
          text: 'Issue Status Breakdown',
          color: textColor,
          font: { family: 'Outfit', size: 11, weight: 'bold' }
        }
      },
      scales: {
        x: { ticks: { color: textColor, font: { size: 8 } }, grid: { display: false } },
        y: { 
          ticks: { color: textColor, precision: 0, font: { size: 8 } }, 
          grid: { color: gridColor }
        }
      }
    }
  });
}

function updateCharts() {
  if (!categoryChart || !statusChart) return;
  
  const categories = countBy(issues, 'category');
  categoryChart.data.datasets[0].data = [
    categories['infrastructure'] || 0,
    categories['sanitation'] || 0,
    categories['utilities'] || 0,
    categories['safety'] || 0
  ];
  categoryChart.update();
  
  const statuses = countBy(issues, 'status');
  statusChart.data.datasets[0].data = [
    statuses['reported'] || 0,
    statuses['triaged'] || 0,
    statuses['assigned'] || 0,
    statuses['resolved'] || 0
  ];
  statusChart.update();
}

function countBy(arr, key) {
  return arr.reduce((acc, item) => {
    const val = item[key];
    acc[val] = (acc[val] || 0) + 1;
    return acc;
  }, {});
}

// ==========================================================================
// 4. RENDERING DOM COMPONENTS
// ==========================================================================
function renderIssuesList(filter = null) {
  if (filter !== null) {
    activeFilter = filter;
  }
  
  const container = document.getElementById("issues-list");
  container.innerHTML = "";
  
  const searchInput = document.getElementById("search-issues");
  const searchQuery = searchInput ? searchInput.value.toLowerCase().trim() : "";
  
  const filtered = issues.filter(issue => {
    const categoryMatch = activeFilter === "all" || issue.category === activeFilter;
    const searchMatch = !searchQuery || 
                        issue.title.toLowerCase().includes(searchQuery) || 
                        issue.description.toLowerCase().includes(searchQuery);
    return categoryMatch && searchMatch;
  });
  
  document.getElementById("issue-count").textContent = `Showing ${filtered.length} reports`;

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; color: var(--text-muted); padding: 2rem; font-size: 0.8rem;">
        <i class="fa-solid fa-face-empty" style="font-size: 2rem; margin-bottom: 0.5rem; display: block;"></i>
        No reports found in this category.
      </div>
    `;
    return;
  }

  filtered.forEach(issue => {
    const isSelected = issue.id === selectedIssueId ? "selected" : "";
    const severityLabel = getSeverityLabel(issue.severity);
    const badgeClass = `badge-${severityLabel.toLowerCase()}`;
    const cardStatusClass = `status-${issue.status}`;
    
    // Check if custom file image vs preset icon
    let photoThumb = "";
    if (issue.photo) {
      if (issue.photo.startsWith("data:image")) {
        photoThumb = `<img src="${issue.photo}" style="width: 35px; height: 35px; object-fit: cover; border-radius: 4px; border: 1px solid rgba(255,255,255,0.08);">`;
      } else {
        photoThumb = `<div style="width: 35px; height: 35px; border-radius: 4px; background: rgba(255,255,255,0.05); display: flex; align-items: center; justify-content: center; font-size: 0.8rem; color: var(--accent-primary); border: 1px solid rgba(255,255,255,0.08);"><i class="fa-solid ${getCategoryIcon(issue.category)}"></i></div>`;
      }
    }

    const card = document.createElement("div");
    card.className = `glass-card issue-card ${isSelected} ${cardStatusClass}`;
    card.setAttribute("data-id", issue.id);
    
    card.innerHTML = `
      <div style="display: flex; gap: 0.5rem; align-items: flex-start;">
        <div style="flex-shrink: 0;">${photoThumb}</div>
        <div style="flex: 1; min-width: 0;">
          <div class="issue-card-header">
            <span class="issue-tag tag-${issue.category}">${issue.category}</span>
            <span class="issue-badge ${badgeClass}">${severityLabel}</span>
          </div>
          <h3 class="issue-title" style="max-width: 100%;">${issue.title}</h3>
          <p class="issue-card-body">${issue.description}</p>
        </div>
      </div>
      <div class="issue-card-footer" style="margin-top: 0.4rem; padding-top: 0.4rem; border-top: 1px solid rgba(255,255,255,0.03);">
        <span>By ${issue.reportedBy}</span>
        <div class="issue-meta">
          <span><i class="fa-regular fa-clock"></i> ${issue.reportedAt}</span>
          <span style="text-transform: capitalize; font-weight: bold; color: ${getStatusColor(issue.status)};">
            ${issue.status === 'reported' ? 'New' : issue.status}
          </span>
        </div>
      </div>
    `;
    
    card.addEventListener("click", () => {
      selectIssue(issue.id);
    });
    
    container.appendChild(card);
  });
}

function getCategoryIcon(cat) {
  switch (cat) {
    case 'infrastructure': return 'fa-road';
    case 'sanitation': return 'fa-trash-can';
    case 'utilities': return 'fa-faucet-drip';
    case 'safety': return 'fa-shield-halved';
    default: return 'fa-triangle-exclamation';
  }
}

function getSeverityLabel(level) {
  switch (level) {
    case 1: return "Low";
    case 2: return "Medium";
    case 3: return "High";
    case 4: return "Critical";
    default: return "Medium";
  }
}

// Select an issue in details panel / map
function selectIssue(id) {
  selectedIssueId = id;
  
  // Highlight card in feed list
  document.querySelectorAll(".issue-card").forEach(card => {
    if (card.getAttribute("data-id") === id) {
      card.classList.add("selected");
    } else {
      card.classList.remove("selected");
    }
  });
  
  const issue = issues.find(i => i.id === id);
  if (!issue) return;
  
  // Pan map to issue coordinates
  map.setView(issue.coords, 14);
  if (markers[issue.id]) {
    markers[issue.id].openPopup();
  }
  
  // Render details banner at top of agent console
  const detailsBanner = document.getElementById("console-issue-details");
  const bannerTitle = document.getElementById("console-issue-title");
  const bannerMeta = document.getElementById("console-issue-meta");
  const verificationsLabel = document.getElementById("verification-count-label");
  const verifyBtn = document.getElementById("btn-verify-issue");
  
  if (detailsBanner) {
    detailsBanner.style.display = "flex";
    bannerTitle.textContent = issue.title;
    bannerMeta.textContent = `By ${issue.reportedBy} | Severity: ${getSeverityLabel(issue.severity)} | Category: ${issue.category}`;
    verificationsLabel.textContent = issue.verifications || 0;
    
    // Disable verify button if reported by "You" or already resolved
    if (issue.reportedBy === "You" || issue.status === "resolved") {
      verifyBtn.setAttribute("disabled", "true");
      verifyBtn.style.opacity = "0.5";
    } else {
      verifyBtn.removeAttribute("disabled");
      verifyBtn.style.opacity = "1";
    }
  }

  // Update Agent Console triggers
  const runBtn = document.getElementById("btn-run-agent");
  const resultsBtn = document.getElementById("btn-view-results");
  
  runBtn.removeAttribute("disabled");
  resetPipelineVisual();
  
  const terminal = document.getElementById("terminal-logs");
  
  if (issue.agentRun) {
    // If agent already ran on this issue, show results directly
    terminal.innerHTML = `
      <div class="terminal-line success"><i class="fa-solid fa-circle-check"></i> Autonomous Agent triaging completed for this issue.</div>
      <div class="terminal-line">Loaded saved triage logs. Verify official complaint draft below.</div>
    `;
    setPipelineCompleted();
    resultsBtn.style.display = "inline-flex";
    showAgentResults(issue.agentRun);
  } else {
    // Issue needs triaging
    terminal.innerHTML = `
      <div class="terminal-line system"><i class="fa-solid fa-robot"></i> AI Triage Desk ready for: "${issue.title}"</div>
      <div class="terminal-line input">Press 'Run Triage Agent' to analyze photos, estimate hazard scale, draft grievance file, and search volunteer matches.</div>
    `;
    resultsBtn.style.display = "none";
    document.getElementById("agent-results").style.display = "none";
  }
  
  // If in Hero Mode, highlight volunteer list matching this item
  if (volunteerMode) {
    const taskCard = document.getElementById(`hero-task-${id}`);
    if (taskCard) {
      taskCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      taskCard.style.borderColor = "var(--accent-primary)";
      setTimeout(() => {
        taskCard.style.borderColor = "var(--surface-border)";
      }, 2000);
    }
  }

  // Show comments section and render comments
  const commentsSection = document.getElementById("console-comments-section");
  if (commentsSection) {
    commentsSection.style.display = "flex";
  }
  renderComments(id);
}

// Update top statistics bar
function updateHeaderStats() {
  const activeCount = issues.filter(i => i.status !== "resolved").length;
  const resolvedCount = issues.filter(i => i.status === "resolved").length;
  const resolutionRate = issues.length > 0 ? Math.round((resolvedCount / issues.length) * 100) : 100;
  
  document.getElementById("stat-resolved-rate").textContent = `${resolutionRate}%`;
  document.getElementById("stat-active-issues").textContent = activeCount;
  document.getElementById("stat-volunteers").textContent = leaderboard.length;
}

function renderLeaderboard() {
  const container = document.getElementById("leaderboard-list");
  container.innerHTML = "";
  
  // Sort leaderboard by points
  const sorted = [...leaderboard].sort((a,b) => b.points - a.points);
  
  sorted.forEach((user, index) => {
    const item = document.createElement("div");
    const isMe = user.name.includes("You") || user.name.includes("Alex");
    item.className = `leaderboard-item ${isMe ? 'me' : ''}`;
    item.innerHTML = `
      <div class="leaderboard-user">
        <span class="leaderboard-rank-badge">#${index + 1}</span>
        <img src="${user.avatar}" alt="Avatar" class="leaderboard-avatar">
        <span class="leaderboard-username">${user.name}</span>
      </div>
      <span class="leaderboard-score">${user.points} pts</span>
    `;
    container.appendChild(item);
  });
}

function updateUserProfileDisplay() {
  const me = leaderboard.find(u => u.name.includes("You") || u.name.includes("Alex"));
  if (!me) return;
  
  document.getElementById("user-impact-points").textContent = me.points;
  document.getElementById("user-verifications").textContent = me.resolutions;
  
  // Badges unlocking checks
  const reporterBadge = document.getElementById("badge-reporter");
  const potholeBadge = document.getElementById("badge-pothole");
  const trashBadge = document.getElementById("badge-trash");
  const guardianBadge = document.getElementById("badge-guardian");
  
  // Report count check
  const reportsCount = issues.filter(i => i.reportedBy === "You").length;
  if (reportsCount >= 1) reporterBadge.classList.add("unlocked");
  
  // Category resolution checks
  const resolvedRoads = issues.filter(i => i.status === "resolved" && i.category === "infrastructure" && i.resolvedBy === "You").length;
  if (resolvedRoads >= 2) potholeBadge.classList.add("unlocked");
  
  const resolvedSanitation = issues.filter(i => i.status === "resolved" && i.category === "sanitation" && i.resolvedBy === "You").length;
  if (resolvedSanitation >= 2) trashBadge.classList.add("unlocked");
  
  // Total resolutions check
  const totalRes = me.resolutions;
  if (totalRes >= 5) guardianBadge.classList.add("unlocked");
}

// ==========================================================================
// 5. AUTONOMOUS CITY-DESK AGENT SIMULATION & REAL GEMINI
// ==========================================================================
function resetPipelineVisual() {
  document.querySelectorAll(".pipeline-step").forEach(step => {
    step.classList.remove("active", "completed");
  });
  document.getElementById("agent-status-label").textContent = "Idle";
  document.getElementById("agent-status-label").style.color = "var(--text-muted)";
}

function setPipelineCompleted() {
  document.querySelectorAll(".pipeline-step").forEach(step => {
    step.classList.remove("active");
    step.classList.add("completed");
  });
  document.getElementById("agent-status-label").textContent = "Complete";
  document.getElementById("agent-status-label").style.color = "var(--accent-secondary)";
}

// Main autonomous triage agent trigger
function runTriageAgent() {
  if (!selectedIssueId) return;
  const issue = issues.find(i => i.id === selectedIssueId);
  if (!issue || issue.agentRun) return;

  const terminal = document.getElementById("terminal-logs");
  const runBtn = document.getElementById("btn-run-agent");
  const resultsBtn = document.getElementById("btn-view-results");
  
  runBtn.setAttribute("disabled", "true");
  resetPipelineVisual();
  document.getElementById("agent-status-label").textContent = "Running";
  document.getElementById("agent-status-label").style.color = "var(--accent-primary)";
  terminal.innerHTML = "";

  if (liveGeminiEnabled && geminiApiKey) {
    // RUN ACTUAL LIVE GEMINI API TRIAGE
    runLiveGeminiAgent(issue, terminal, runBtn, resultsBtn);
  } else {
    // RUN SIMULATED TRIAGE MODE
    runSimulatedAgent(issue, terminal, runBtn, resultsBtn);
  }
}

// Live Triage execution querying Gemini API
async function runLiveGeminiAgent(issue, terminal, runBtn, resultsBtn) {
  try {
    // 1. Planning stage visual
    document.getElementById("step-planning").classList.add("active");
    terminal.innerHTML += `<div class="terminal-line system">[Planning] Contacting Google AI Studio services...</div>`;
    terminal.innerHTML += `<div class="terminal-line">Loaded target report: "${issue.title}" | Coordinates: [${issue.coords.join(", ")}]</div>`;
    
    // Simulate minor delay
    await new Promise(r => setTimeout(r, 600));
    
    // 2. Vision stage visual
    document.getElementById("step-planning").classList.remove("active");
    document.getElementById("step-planning").classList.add("completed");
    document.getElementById("step-vision").classList.add("active");
    terminal.innerHTML += `<div class="terminal-line system">[Gemini Vision] Transmitting image bytes & user details to Gemini 1.5 Flash...</div>`;
    terminal.scrollTop = terminal.scrollHeight;

    // Construct parts array
    const parts = [];
    parts.push({
      text: `${GEMINI_SYSTEM_PROMPT}\n\nUser Report Input:\nTitle: ${issue.title}\nDescription: ${issue.description}\nCategory Suggested: ${issue.category}\nSeverity Suggested: ${issue.severity}\nLocation: Coords [${issue.coords.join(", ")}]`
    });

    if (issue.photo && issue.photo.startsWith("data:image")) {
      const match = issue.photo.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);
      if (match) {
        parts.push({
          inlineData: {
            mimeType: match[1],
            data: match[2]
          }
        });
      }
    } else {
      parts.push({
        text: `preset-reference-type: ${issue.photo || "general"}`
      });
    }

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`;
    
    const response = await fetch(geminiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: parts }],
        generationConfig: { responseMimeType: "application/json" }
      })
    });

    if (!response.ok) {
      throw new Error(`Google API returned status ${response.status}`);
    }

    const data = await response.json();
    const rawText = data.candidates[0].content.parts[0].text;
    
    // Clean and parse JSON
    let cleaned = rawText.trim();
    if (cleaned.startsWith("```json")) cleaned = cleaned.substring(7);
    if (cleaned.endsWith("```")) cleaned = cleaned.substring(0, cleaned.length - 3);
    const result = JSON.parse(cleaned.trim());

    // 3. Triage phase visual
    document.getElementById("step-vision").classList.remove("active");
    document.getElementById("step-vision").classList.add("completed");
    document.getElementById("step-triage").classList.add("active");
    
    terminal.innerHTML += `<div class="terminal-line success"><i class="fa-solid fa-circle-check"></i> Gemini responded. Verified status: ${result.verified}. Category categorized: ${result.category.toUpperCase()}</div>`;
    
    if (result.verified === false) {
      terminal.innerHTML += `<div class="terminal-line error"><i class="fa-solid fa-circle-exclamation"></i> Warning: Report flagged as spam/unverifiable by Vision check. Triaging halted.</div>`;
      resetPipelineVisual();
      runBtn.removeAttribute("disabled");
      return;
    }
    
    terminal.innerHTML += `<div class="terminal-line">Assessed Severity: ${getSeverityLabel(result.severity)} (Level ${result.severity})</div>`;
    terminal.scrollTop = terminal.scrollHeight;
    await new Promise(r => setTimeout(r, 600));

    // 4. Complaint drafting visual
    document.getElementById("step-triage").classList.remove("active");
    document.getElementById("step-triage").classList.add("completed");
    document.getElementById("step-complaint").classList.add("active");
    terminal.innerHTML += `<div class="terminal-line system">[Complaint Bureau] Formatting municipal grievance document...</div>`;
    terminal.scrollTop = terminal.scrollHeight;
    await new Promise(r => setTimeout(r, 600));

    // 5. Matchmaking visual
    document.getElementById("step-complaint").classList.remove("active");
    document.getElementById("step-complaint").classList.add("completed");
    document.getElementById("step-match").classList.add("active");
    
    const skills = result.suggestedSkills || "General repair";
    terminal.innerHTML += `<div class="terminal-line system">[Matchmaking] Querying volunteers with skills: [${skills}]...</div>`;
    
    const matches = generateMatchedVolunteers(issue);
    
    terminal.innerHTML += `<div class="terminal-line success"><i class="fa-solid fa-bell"></i> Dispatched alerts to matched neighbourhood heroes.</div>`;
    terminal.scrollTop = terminal.scrollHeight;
    await new Promise(r => setTimeout(r, 500));

    // Finalize
    setPipelineCompleted();
    
    const generatedRun = {
      completed: true,
      visionTags: result.visionTags || `Issue: ${result.category}\nSeverity: Level ${result.severity}\nGeo: [${issue.coords.join(", ")}]`,
      grievance: result.grievance || `Grievance details for ${issue.title}`,
      matchedVolunteers: matches
    };

    issue.agentRun = generatedRun;
    issue.status = "triaged";
    issue.category = result.category;
    issue.severity = result.severity;

    // Persist
    localStorage.setItem("civicpulse_issues", JSON.stringify(issues));

    // Refresh UI
    renderIssuesList();
    updateCharts();
    updateHeaderStats();
    updateMapMarkers();
    
    resultsBtn.style.display = "inline-flex";
    runBtn.removeAttribute("disabled");
    showAgentResults(generatedRun);
    
    showToast(`Gemini Triage complete. "${issue.title}" is now Triaged!`, "success");

  } catch (err) {
    console.error("Gemini live call failed, falling back to simulated logs.", err);
    terminal.innerHTML += `<div class="terminal-line error"><i class="fa-solid fa-circle-exclamation"></i> Live Gemini call failed: ${err.message}. Falling back to sandbox simulation...</div>`;
    terminal.scrollTop = terminal.scrollHeight;
    await new Promise(r => setTimeout(r, 1200));
    runSimulatedAgent(issue, terminal, runBtn, resultsBtn);
  }
}

// Fallback high-fidelity simulation agent workflow
function runSimulatedAgent(issue, terminal, runBtn, resultsBtn) {
  const timeline = [
    {
      stepId: "step-planning",
      log: `<div class="terminal-line system">[Planning] Initializing CivicPulse sandbox agent v1.0.0...</div>
            <div class="terminal-line warning"><i class="fa-solid fa-triangle-exclamation"></i> Simulated Mode. Enter a Gemini API Key in Settings to run live model calls.</div>
            <div class="terminal-line">Loaded target: "${issue.title}" | Category: ${issue.category}</div>
            <div class="terminal-line success"><i class="fa-solid fa-check"></i> Strategy established: Vision Validation -> Geographic Triage -> Grievance Drafting -> Volunteer Dispatch.</div>`,
      delay: 1000
    },
    {
      stepId: "step-vision",
      log: `<div class="terminal-line system">[Gemini Vision] Loading attached image files...</div>
            <div class="terminal-line">Analyzing pixels for integrity, metadata, and hazard features...</div>
            <div class="terminal-line success"><i class="fa-solid fa-check"></i> Image match confirmed. (Simulated)</div>
            <div class="terminal-line">Vision AI Tag output:
------------------------------------------
Type detected: ${issue.category === 'infrastructure' ? 'Pothole/Road Cavity' : issue.category === 'utilities' ? 'Active Fluid Leak/Light Failure' : issue.category === 'sanitation' ? 'Uncollected Solid Waste' : 'Public Obstruction'}
Confidence: 96.4%
Est. Severity Dimensions: 3m radius impact zone
Duplicate risk check: Clean. No other active pins within 100m.
------------------------------------------</div>`,
      delay: 1800
    },
    {
      stepId: "step-triage",
      log: `<div class="terminal-line system">[Triage] Evaluating civic priority metrics...</div>
            <div class="terminal-line">Calculating: Severity Coefficient (${issue.severity}) × Traffic Volume Density...</div>
            <div class="terminal-line">Geofence intersection: Within residential sector. Near public transit.</div>
            <div class="terminal-line warning"><i class="fa-solid fa-circle-exclamation"></i> Hazard evaluation: Priority level evaluated to ${issue.severity >= 3 ? 'HIGH' : 'MEDIUM'}. Urgent attention required.</div>`,
      delay: 1200
    },
    {
      stepId: "step-complaint",
      log: `<div class="terminal-line system">[Complaint Bureau] Running official grievance template engine...</div>
            <div class="terminal-line">Resolving ward jurisdiction via coordinates [${issue.coords.join(", ")}]...</div>
            <div class="terminal-line">Drafting formal notification email to the Chief Municipal Director...</div>
            <div class="terminal-line success"><i class="fa-solid fa-envelope-circle-check"></i> Official Complaint document drafted and cached in context memory.</div>`,
      delay: 1200
    },
    {
      stepId: "step-match",
      log: `<div class="terminal-line system">[Matchmaking] Querying neighborhood volunteer registry...</div>
            <div class="terminal-line">Filtering registry by proximity and skillset: [${getSkillTag(issue.category)}]...</div>
            <div class="terminal-line">Found matches! Computing dispatch notification texts...</div>
            <div class="terminal-line success"><i class="fa-solid fa-bell"></i> Dispached alert alerts to 2 nearby heroes.</div>
            <div class="terminal-line success"><i class="fa-solid fa-circle-check"></i> Agent executed successfully. Triage workflow finalized.</div>`,
      delay: 1000
    }
  ];

  let currentStage = 0;

  function executeStep() {
    if (currentStage >= timeline.length) {
      setPipelineCompleted();
      
      const generatedRun = {
        completed: true,
        visionTags: `Issue Category: ${issue.category.toUpperCase()}\nConfidence: 96.4% (Simulated)\nIdentified Details: Dynamic incident matching ${issue.photo} patterns.\nLocation Geo: Lat/Lon [${issue.coords.join(", ")}]\nSpam Check Score: 100/100 (Authentic Report)`,
        grievance: generateGrievanceText(issue),
        matchedVolunteers: generateMatchedVolunteers(issue)
      };
      
      issue.agentRun = generatedRun;
      issue.status = "triaged";
      
      localStorage.setItem("civicpulse_issues", JSON.stringify(issues));
      
      renderIssuesList();
      updateCharts();
      updateHeaderStats();
      updateMapMarkers();
      
      resultsBtn.style.display = "inline-flex";
      runBtn.removeAttribute("disabled");
      
      showAgentResults(generatedRun);
      showToast(`Agent triage complete. "${issue.title}" is now Triaged!`, "success");
      return;
    }

    const stage = timeline[currentStage];
    
    document.getElementById(stage.stepId).classList.add("active");
    if (currentStage > 0) {
      document.getElementById(timeline[currentStage - 1].stepId).classList.remove("active");
      document.getElementById(timeline[currentStage - 1].stepId).classList.add("completed");
    }
    
    terminal.innerHTML += stage.log;
    terminal.scrollTop = terminal.scrollHeight;
    
    currentStage++;
    setTimeout(executeStep, stage.delay);
  }

  executeStep();
}

function getSkillTag(category) {
  switch(category) {
    case 'infrastructure': return 'Roads/Paving';
    case 'sanitation': return 'Clean-up/Sanitation';
    case 'utilities': return 'Water/Electrical';
    case 'safety': return 'Safety/Security';
    default: return 'General';
  }
}

function generateGrievanceText(issue) {
  const department = issue.category === 'infrastructure' ? 'Roads & Public Infrastructure Authority' : 
                     issue.category === 'sanitation' ? 'Solid Waste Management Division' :
                     issue.category === 'utilities' ? 'Water Supply & Grid Operations Bureau' : 'Public Safety & Transit Department';
  
  return `To,\nThe Assistant Commissioner,\n${department}\n\nSubject: Official grievance regarding "${issue.title}"\n\nDear Sir/Madam,\n\nWe are formally reporting a municipal issue located at coordinates [${issue.coords.join(", ")}].\n\nDetails of the issue:\n- Description: ${issue.description}\n- Category: ${issue.category.toUpperCase()}\n- Urgency Rating: ${getSeverityLabel(issue.severity)}\n- Reported On: ${issue.reportedAt}\n- Image Hash: Verified authentic civic photo upload.\n\nWe request your immediate intervention to resolve this public hazard to prevent any local damage/accidents.\n\nSincerely,\nCivicPulse Local Triage Agent`;
}

function generateMatchedVolunteers(issue) {
  if (issue.category === 'infrastructure') {
    return `1. Rohan K. (Paving volunteer) - 0.5km away [Notified]\n2. Priyal S. (Civic Lead) - 1.2km away\n3. You (Alex) - 2.8km away`;
  } else if (issue.category === 'sanitation') {
    return `1. Rohan K. (Clean-up Lead) - 0.4km away [Notified]\n2. Priyal S. (Volunteer) - 1.8km away`;
  } else if (issue.category === 'utilities') {
    return `1. Vikram M. (Utility Lead) - 0.9km away [Notified]\n2. Rohan K. (Helper) - 1.5km away`;
  } else {
    return `1. Priyal S. (Neighborhood Guardian) - 0.8km away [Notified]\n2. Vikram M. (Helper) - 1.7km away`;
  }
}

function showAgentResults(run) {
  const container = document.getElementById("agent-results");
  container.style.display = "block";
  
  const tabs = container.querySelectorAll(".results-tab");
  tabs.forEach(tab => {
    tab.onclick = (e) => {
      tabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      
      const tabName = tab.getAttribute("data-tab");
      const contentBox = document.getElementById("results-content-box");
      const actionsHub = document.getElementById("grievance-actions-hub");
      
      if (tabName === "tab-vision") {
        contentBox.textContent = run.visionTags;
        if (actionsHub) actionsHub.style.display = "none";
      } else if (tabName === "tab-grievance") {
        contentBox.textContent = run.grievance;
        if (actionsHub) {
          actionsHub.style.display = "flex";
          // Configure email link href
          const issue = issues.find(i => i.id === selectedIssueId);
          let email = "authority@municipal.gov";
          if (issue) {
            if (issue.category === "infrastructure") email = "roads@municipal.gov";
            else if (issue.category === "sanitation") email = "waste@municipal.gov";
            else if (issue.category === "utilities") email = "watergrid@municipal.gov";
            else if (issue.category === "safety") email = "safety@municipal.gov";
          }
          const subject = `Official Grievance: ${issue ? issue.title : "Community Hazard"}`;
          const emailLink = document.getElementById("link-email-grievance");
          if (emailLink) {
            emailLink.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(run.grievance)}`;
          }
        }
      } else if (tabName === "tab-volunteers") {
        contentBox.textContent = run.matchedVolunteers;
        if (actionsHub) actionsHub.style.display = "none";
      }
    };
  });
  
  tabs[0].click();
}

// ==========================================================================
// 6. HERO / VOLUNTEER MODE LOGIC
// ==========================================================================
function toggleHeroMode() {
  volunteerMode = !volunteerMode;
  const toggleCheckbox = document.getElementById("mode-toggle");
  toggleCheckbox.checked = volunteerMode;
  
  const portalTitle = document.getElementById("portal-title");
  const citizenContent = document.getElementById("portal-citizen-content");
  const heroContent = document.getElementById("portal-hero-content");
  const userRank = document.getElementById("user-rank");
  
  if (volunteerMode) {
    portalTitle.innerHTML = `<i class="fa-solid fa-list-check"></i> Available Hero Tasks`;
    citizenContent.style.display = "none";
    heroContent.style.display = "flex";
    userRank.textContent = "Civic Hero (Level 2)";
    userRank.style.color = "var(--accent-secondary)";
    
    renderHeroTasks();
    showToast("Hero Volunteer Mode activated! Claim tasks and earn points.", "success");
  } else {
    portalTitle.innerHTML = `<i class="fa-solid fa-chart-pie"></i> Local Impact Charts`;
    citizenContent.style.display = "flex";
    heroContent.style.display = "none";
    userRank.textContent = "Citizen Activist";
    userRank.style.color = "var(--accent-primary)";
    
    showToast("Returned to Citizen Mode.", "info");
  }
}

function renderHeroTasks() {
  const container = document.getElementById("hero-tasks-list");
  container.innerHTML = "";
  
  const taskIssues = issues.filter(issue => issue.status === "triaged" || (issue.status === "assigned" && issue.assignedHero === "You"));
  
  if (taskIssues.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; color: var(--text-muted); padding: 1.5rem; font-size: 0.75rem;">
        <i class="fa-solid fa-sparkles" style="font-size: 1.5rem; margin-bottom: 0.5rem; display: block; color: var(--accent-secondary);"></i>
        All neighborhood hazards resolved! Good job, Heroes.
      </div>
    `;
    return;
  }
  
  taskIssues.forEach(issue => {
    const isClaimedByMe = issue.status === "assigned" && issue.assignedHero === "You";
    const pointsAward = issue.severity * 25;
    
    const taskCard = document.createElement("div");
    taskCard.className = "hero-task-card";
    taskCard.id = `hero-task-${issue.id}`;
    
    taskCard.innerHTML = `
      <div class="hero-task-header">
        <h4 class="hero-task-title">${issue.title}</h4>
        <span class="hero-task-points">+${pointsAward} pts</span>
      </div>
      <p class="hero-task-desc">${issue.description}</p>
      <div class="hero-task-footer">
        <span class="hero-task-loc"><i class="fa-solid fa-location-dot"></i> Coords: [${issue.coords.map(c => c.toFixed(3)).join(", ")}]</span>
        <div>
          ${isClaimedByMe ? `
            <button class="btn btn-primary btn-xs" onclick="resolveTask('${issue.id}')">
              <i class="fa-solid fa-check"></i> Complete
            </button>
          ` : `
            <button class="btn btn-secondary btn-xs" onclick="claimTask('${issue.id}')" style="background: rgba(16, 185, 129, 0.15); border-color: rgba(16, 185, 129, 0.2); color: #34d399;">
              <i class="fa-solid fa-hand-holding-hand"></i> Claim
            </button>
          `}
        </div>
      </div>
    `;
    
    container.appendChild(taskCard);
  });
}

window.claimTask = function(id) {
  const issue = issues.find(i => i.id === id);
  if (!issue) return;
  
  issue.status = "assigned";
  issue.assignedHero = "You";
  
  localStorage.setItem("civicpulse_issues", JSON.stringify(issues));
  
  renderIssuesList();
  renderHeroTasks();
  updateCharts();
  updateHeaderStats();
  updateMapMarkers();
  
  showToast(`You claimed task: "${issue.title}". Clear the hazard!`, "success");
  selectIssue(id);
};

window.resolveTask = function(id) {
  const issue = issues.find(i => i.id === id);
  if (!issue) return;
  
  issue.status = "resolved";
  issue.resolvedBy = "You";
  
  const pointsAwarded = issue.severity * 25;
  const me = leaderboard.find(u => u.name.includes("You") || u.name.includes("Alex"));
  if (me) {
    me.points += pointsAwarded;
    me.resolutions += 1;
  }
  
  localStorage.setItem("civicpulse_issues", JSON.stringify(issues));
  localStorage.setItem("civicpulse_leaderboard", JSON.stringify(leaderboard));
  
  renderIssuesList();
  renderHeroTasks();
  renderLeaderboard();
  updateCharts();
  updateHeaderStats();
  updateUserProfileDisplay();
  updateMapMarkers();
  
  showToast(`Success! You resolved "${issue.title}" and earned ${pointsAwarded} points!`, "success");
  selectIssue(id);
};

// ==========================================================================
// 7. COMMUNITY VERIFICATION (UPVOTES)
// ==========================================================================
function verifySelectedIssue() {
  if (!selectedIssueId) return;
  const issue = issues.find(i => i.id === selectedIssueId);
  if (!issue) return;

  if (issue.reportedBy === "You") {
    showToast("You cannot verify your own reports.", "error");
    return;
  }
  if (issue.status === "resolved") {
    showToast("This issue is already resolved.", "error");
    return;
  }

  // Increment verification
  issue.verifications = (issue.verifications || 0) + 1;

  // Citizens get verification points (+5 points)
  const me = leaderboard.find(u => u.name.includes("You") || u.name.includes("Alex"));
  if (me) {
    me.points += 5;
  }

  // If verifications hit 5 and issue is still in "reported" status, auto-promote it to "triaged"
  if (issue.verifications >= 5 && issue.status === "reported") {
    issue.status = "triaged";
    showToast(`Community consensus met! "${issue.title}" auto-triaged.`, "success");
  } else {
    showToast(`You verified "${issue.title}". Impact points rewarded!`, "success");
  }

  // Persist
  localStorage.setItem("civicpulse_issues", JSON.stringify(issues));
  localStorage.setItem("civicpulse_leaderboard", JSON.stringify(leaderboard));

  // Refresh UI
  const verificationsLabel = document.getElementById("verification-count-label");
  if (verificationsLabel) verificationsLabel.textContent = issue.verifications;

  renderIssuesList();
  renderLeaderboard();
  updateUserProfileDisplay();
  updateHeaderStats();
  updateCharts();
  updateMapMarkers();
}

// ==========================================================================
// 8. PREDICTIVE INSIGHTS CLUSTERING LAYER
// ==========================================================================
function togglePredictiveInsights() {
  predictionsActive = !predictionsActive;
  const btn = document.getElementById("btn-toggle-predictions");

  if (predictionsActive) {
    btn.classList.add("active");
    btn.innerHTML = `<i class="fa-solid fa-eye-slash"></i> Hide Hotspots`;
    btn.style.background = "rgba(239, 68, 68, 0.15)";
    btn.style.color = "#f87171";
    btn.style.borderColor = "rgba(239, 68, 68, 0.2)";

    // Generate clusters based on coordinates of active issues
    issues.forEach(issue => {
      if (issue.status === "resolved") return;

      // Draw large transparent risk buffer ring
      const circle = L.circle(issue.coords, {
        color: '#c084fc', // purple
        fillColor: '#c084fc',
        fillOpacity: 0.1,
        radius: 750,
        weight: 1.5,
        className: 'predictive-ring-pulse'
      }).addTo(map);

      predictionCircles.push(circle);
    });

    showToast("Predictive risk indicator rings displayed on map.", "success");
  } else {
    btn.classList.remove("active");
    btn.innerHTML = `<i class="fa-solid fa-wand-magic-sparkles"></i> Toggle Predictive Hotspots`;
    btn.style.background = "rgba(139, 92, 246, 0.15)";
    btn.style.color = "#c084fc";
    btn.style.borderColor = "rgba(139, 92, 246, 0.2)";

    // Remove circles from map
    predictionCircles.forEach(c => map.removeLayer(c));
    predictionCircles = [];

    showToast("Predictive risk rings removed.", "info");
  }
}

// Helper to scale images via Canvas to avoid LocalStorage limits
function compressImage(base64Str) {
  return new Promise((resolve) => {
    if (!base64Str || !base64Str.startsWith("data:image")) {
      resolve(base64Str);
      return;
    }
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      let width = img.width;
      let height = img.height;
      const maxDim = 300;
      if (width > maxDim || height > maxDim) {
        if (width > height) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        } else {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }
      }
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL("image/jpeg", 0.7));
    };
    img.onerror = () => {
      resolve(base64Str);
    };
    img.src = base64Str;
  });
}

// Helper to render comments
function renderComments(issueId) {
  const timeline = document.getElementById("comments-timeline");
  if (!timeline) return;
  timeline.innerHTML = "";
  
  const issueComments = comments[issueId] || [];
  
  if (issueComments.length === 0) {
    timeline.innerHTML = `
      <div style="text-align: center; color: var(--text-muted); padding: 0.75rem; font-size: 0.7rem;">
        No community updates or comments yet.
      </div>
    `;
    return;
  }
  
  issueComments.forEach(c => {
    const item = document.createElement("div");
    item.className = "comment-item";
    item.innerHTML = `
      <div class="comment-item-header">
        <span class="comment-user">${c.user}</span>
        <span class="comment-time">${c.time}</span>
      </div>
      <div class="comment-text">${c.text}</div>
    `;
    timeline.appendChild(item);
  });
  
  timeline.scrollTop = timeline.scrollHeight;
}

// ==========================================================================
// 9. EVENT LISTENERS & WIZARD INTERACTIVITY
// ==========================================================================
function setupEventListeners() {
  const modal = document.getElementById("modal-report");
  const btnNewReport = document.getElementById("btn-new-report");
  const btnCloseReport = document.getElementById("btn-close-report");
  const btnCancelReport = document.getElementById("btn-cancel-report");
  const formNewReport = document.getElementById("form-new-report");
  const toggleCheckbox = document.getElementById("mode-toggle");
  
  // API Settings selectors
  const btnApiSettings = document.getElementById("btn-api-settings");
  const modalApiSettings = document.getElementById("modal-api-settings");
  const btnCloseApiSettings = document.getElementById("btn-close-api-settings");
  const btnCancelApiSettings = document.getElementById("btn-cancel-api-settings");
  const formApiSettings = document.getElementById("form-api-settings");
  const inputApiKey = document.getElementById("input-api-key");
  const checkEnableLive = document.getElementById("check-enable-live");

  // Portal tabs selectors
  const portalTabs = document.querySelectorAll(".portal-tab");
  portalTabs.forEach(tab => {
    tab.addEventListener("click", () => {
      portalTabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      
      const target = tab.getAttribute("data-portal-tab");
      document.getElementById("portal-panel-charts").style.display = target === "charts" ? "flex" : "none";
      document.getElementById("portal-panel-predictions").style.display = target === "predictions" ? "flex" : "none";
    });
  });

  // Photo Wizard selectors
  const photoTabs = document.querySelectorAll(".photo-tab");
  photoTabs.forEach(tab => {
    tab.addEventListener("click", () => {
      photoTabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      
      currentPhotoMode = tab.getAttribute("data-photo-mode");
      document.getElementById("photo-panel-presets").style.display = currentPhotoMode === "presets" ? "block" : "none";
      document.getElementById("photo-panel-upload").style.display = currentPhotoMode === "upload" ? "block" : "none";
      document.getElementById("photo-panel-camera").style.display = currentPhotoMode === "camera" ? "block" : "none";
      
      // Stop stream if moving away from camera
      if (currentPhotoMode !== "camera") {
        stopWebcamStream();
      }
    });
  });

  // Preset picker click handler
  const presetItems = document.querySelectorAll(".photo-picker-item");
  presetItems.forEach(item => {
    item.addEventListener("click", () => {
      presetItems.forEach(p => p.classList.remove("selected"));
      item.classList.add("selected");
      if (currentPhotoMode === "presets") {
        selectedPhotoData = item.getAttribute("data-photo");
      }
    });
  });

  // Drag and Drop files
  const dropzone = document.getElementById("upload-dropzone");
  const fileInput = document.getElementById("input-file-upload");
  const uploadPreviewContainer = document.getElementById("upload-preview-container");
  const uploadPreview = document.getElementById("upload-preview");
  const uploadFileName = document.getElementById("upload-file-name");
  const btnRemoveUpload = document.getElementById("btn-remove-upload");

  dropzone.addEventListener("click", () => fileInput.click());
  dropzone.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropzone.style.borderColor = "var(--accent-primary)";
  });
  dropzone.addEventListener("dragleave", () => {
    dropzone.style.borderColor = "var(--surface-border)";
  });
  dropzone.addEventListener("drop", (e) => {
    e.preventDefault();
    dropzone.style.borderColor = "var(--surface-border)";
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleUploadedFile(e.dataTransfer.files[0]);
    }
  });
  fileInput.addEventListener("change", (e) => {
    if (e.target.files && e.target.files[0]) {
      handleUploadedFile(e.target.files[0]);
    }
  });

  function handleUploadedFile(file) {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const originalBase64 = e.target.result;
      showToast("Compressing uploaded image...", "info");
      const compressedBase64 = await compressImage(originalBase64);
      selectedPhotoData = compressedBase64; // base64 URL
      uploadPreview.src = selectedPhotoData;
      uploadFileName.textContent = file.name + " (compressed)";
      uploadPreviewContainer.style.display = "flex";
      dropzone.style.display = "none";
    };
    reader.readAsDataURL(file);
  }

  btnRemoveUpload.addEventListener("click", () => {
    selectedPhotoData = "pothole";
    fileInput.value = "";
    uploadPreviewContainer.style.display = "none";
    dropzone.style.display = "block";
  });

  // Webcam controls
  const btnStartCamera = document.getElementById("btn-start-camera");
  const btnCapturePhoto = document.getElementById("btn-capture-photo");
  const cameraViewContainer = document.getElementById("camera-view-container");
  const videoStream = document.getElementById("video-stream");
  const canvasPhoto = document.getElementById("canvas-photo");
  const cameraPreviewContainer = document.getElementById("camera-preview-container");
  const cameraPreview = document.getElementById("camera-preview");
  const btnRemoveCamera = document.getElementById("btn-remove-camera");

  btnStartCamera.addEventListener("click", async () => {
    try {
      cameraStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" }
      });
      videoStream.srcObject = cameraStream;
      cameraViewContainer.style.display = "block";
      btnCapturePhoto.style.display = "inline-flex";
      btnStartCamera.style.display = "none";
    } catch (err) {
      console.error("Camera access failed:", err);
      showToast("Webcam access rejected or not available.", "error");
    }
  });

  btnCapturePhoto.addEventListener("click", async () => {
    if (!cameraStream) return;
    
    // Snap snapshot from video stream
    const width = videoStream.videoWidth || 640;
    const height = videoStream.videoHeight || 480;
    canvasPhoto.width = width;
    canvasPhoto.height = height;
    
    const ctx = canvasPhoto.getContext("2d");
    ctx.drawImage(videoStream, 0, 0, width, height);
    
    const rawPhoto = canvasPhoto.toDataURL("image/jpeg");
    showToast("Compressing captured photo...", "info");
    const compressedPhoto = await compressImage(rawPhoto);
    selectedPhotoData = compressedPhoto;
    cameraPreview.src = selectedPhotoData;
    
    cameraPreviewContainer.style.display = "flex";
    cameraViewContainer.style.display = "none";
    btnCapturePhoto.style.display = "none";
    
    stopWebcamStream();
  });

  btnRemoveCamera.addEventListener("click", () => {
    selectedPhotoData = "pothole";
    cameraPreviewContainer.style.display = "none";
    btnStartCamera.style.display = "inline-flex";
  });

  function stopWebcamStream() {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      cameraStream = null;
    }
    videoStream.srcObject = null;
    cameraViewContainer.style.display = "none";
    btnCapturePhoto.style.display = "none";
    btnStartCamera.style.display = "inline-flex";
  }

  // Helper to query location
  function detectUserLocation() {
    if (!navigator.geolocation) {
      showToast("Geolocation is not supported by your browser.", "warning");
      return;
    }
    
    showToast("Requesting GPS coordinates...", "info");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        lastDetectedGeolocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        showToast(`Location locked: [${lastDetectedGeolocation.lat.toFixed(4)}, ${lastDetectedGeolocation.lng.toFixed(4)}]`, "success");
      },
      (error) => {
        console.warn("Geolocation rejected/failed, using default center.", error);
        showToast("Could not fetch GPS location. Using default neighborhood center.", "info");
        lastDetectedGeolocation = null;
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );
  }

  // Modal open
  btnNewReport.addEventListener("click", () => {
    modal.classList.add("show");
    detectUserLocation();
  });
  
  const hideModal = () => {
    modal.classList.remove("show");
    formNewReport.reset();
    stopWebcamStream();
    
    // Reset wizard file captures
    selectedPhotoData = "pothole";
    cameraPreviewContainer.style.display = "none";
    uploadPreviewContainer.style.display = "none";
    dropzone.style.display = "block";
    
    // Reset tabs active class
    photoTabs.forEach(t => t.classList.remove("active"));
    photoTabs[0].classList.add("active");
    currentPhotoMode = "presets";
    document.getElementById("photo-panel-presets").style.display = "block";
    document.getElementById("photo-panel-upload").style.display = "none";
    document.getElementById("photo-panel-camera").style.display = "none";

    presetItems.forEach(p => p.classList.remove("selected"));
    document.querySelector(".photo-picker-item[data-photo='pothole']").classList.add("selected");
    
    const severityLabel = document.getElementById("severity-label");
    severityLabel.textContent = "Medium";
    severityLabel.className = "issue-badge badge-medium";
  };
  
  btnCloseReport.addEventListener("click", hideModal);
  btnCancelReport.addEventListener("click", hideModal);
  
  // API settings modal handlers
  btnApiSettings.addEventListener("click", () => {
    inputApiKey.value = geminiApiKey;
    checkEnableLive.checked = liveGeminiEnabled;
    modalApiSettings.classList.add("show");
  });
  
  const hideApiSettings = () => {
    modalApiSettings.classList.remove("show");
  };
  
  btnCloseApiSettings.addEventListener("click", hideApiSettings);
  btnCancelApiSettings.addEventListener("click", hideApiSettings);
  
  formApiSettings.addEventListener("submit", (e) => {
    e.preventDefault();
    geminiApiKey = inputApiKey.value.trim();
    liveGeminiEnabled = checkEnableLive.checked;
    
    localStorage.setItem("civicpulse_gemini_key", geminiApiKey);
    localStorage.setItem("civicpulse_live_gemini", liveGeminiEnabled ? "true" : "false");
    
    hideApiSettings();
    showToast("Gemini API configuration saved successfully.", "success");
  });

  // Severity Slider update
  const slider = document.getElementById("report-severity");
  const severityLabel = document.getElementById("severity-label");
  
  slider.addEventListener("input", (e) => {
    const val = parseInt(e.target.value);
    const labelText = getSeverityLabel(val);
    severityLabel.textContent = labelText;
    severityLabel.className = `issue-badge badge-${labelText.toLowerCase()}`;
  });
  
  // Form submission
  formNewReport.addEventListener("submit", (e) => {
    e.preventDefault();
    
    const title = document.getElementById("report-title").value.trim();
    const category = document.getElementById("report-category").value;
    const description = document.getElementById("report-description").value.trim();
    const severity = parseInt(slider.value);
    
    let lat = 12.9716 + (Math.random() - 0.5) * 0.08;
    let lng = 77.6200 + (Math.random() - 0.5) * 0.08;
    if (lastDetectedGeolocation) {
      lat = lastDetectedGeolocation.lat;
      lng = lastDetectedGeolocation.lng;
    }
    
    const newIssue = {
      id: `issue-${Date.now()}`,
      title: title,
      category: category,
      severity: severity,
      status: "reported",
      description: description,
      photo: selectedPhotoData, // base64 URL or preset name
      coords: [lat, lng],
      reportedBy: "You",
      reportedAt: new Date().toISOString().split('T')[0],
      verifications: 0,
      agentRun: null
    };
    
    issues.unshift(newIssue);
    
    localStorage.setItem("civicpulse_issues", JSON.stringify(issues));
    hideModal();
    
    renderIssuesList();
    updateMapMarkers();
    updateCharts();
    updateHeaderStats();
    updateUserProfileDisplay();
    
    showToast(`New report "${title}" filed successfully!`, "success");
    selectIssue(newIssue.id);
  });
  
  // Map overlays controls
  document.getElementById("btn-toggle-heatmap").addEventListener("click", toggleHeatmap);
  document.getElementById("btn-recenter-map").addEventListener("click", recenterMap);
  document.getElementById("btn-toggle-predictions").addEventListener("click", togglePredictiveInsights);
  
  // Run Triage Agent
  document.getElementById("btn-run-agent").addEventListener("click", runTriageAgent);
  
  // Verify button
  document.getElementById("btn-verify-issue").addEventListener("click", verifySelectedIssue);
  
  // View Agent Outputs toggle panel
  document.getElementById("btn-view-results").addEventListener("click", () => {
    const resultsPanel = document.getElementById("agent-results");
    resultsPanel.style.display = resultsPanel.style.display === "none" ? "block" : "none";
  });
  
  // Hero / Volunteer Mode toggle
  toggleCheckbox.addEventListener("change", toggleHeroMode);
  
  // Map click listener to update location
  map.on("click", (e) => {
    if (!selectedIssueId) return;
    const issue = issues.find(i => i.id === selectedIssueId);
    if (!issue) return;
    
    if (issue.status === "resolved") {
      showToast("Cannot change coordinates of resolved issues.", "error");
      return;
    }
    
    const { lat, lng } = e.latlng;
    issue.coords = [lat, lng];
    
    if (markers[issue.id]) {
      markers[issue.id].setLatLng([lat, lng]);
      markers[issue.id].openPopup();
    }
    
    if (heatmapActive) {
      toggleHeatmap(); // off
      toggleHeatmap(); // on
    }
    
    localStorage.setItem("civicpulse_issues", JSON.stringify(issues));
    showToast(`Coordinates updated for: "${issue.title}"`, "info");
    
    if (volunteerMode) renderHeroTasks();
  });

  // Search input change listener
  const searchInput = document.getElementById("search-issues");
  if (searchInput) {
    searchInput.addEventListener("input", () => {
      renderIssuesList();
    });
  }

  // Category filter buttons click listeners
  const filterBtns = document.querySelectorAll(".filter-btn");
  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      filterBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const category = btn.getAttribute("data-filter");
      renderIssuesList(category);
    });
  });

  // Grievance Actions
  const btnCopyGrievance = document.getElementById("btn-copy-grievance");
  if (btnCopyGrievance) {
    btnCopyGrievance.addEventListener("click", () => {
      const contentBox = document.getElementById("results-content-box");
      if (contentBox) {
        navigator.clipboard.writeText(contentBox.textContent).then(() => {
          showToast("Grievance text copied to clipboard!", "success");
        }).catch(err => {
          console.error("Copy failed", err);
          showToast("Failed to copy grievance text.", "error");
        });
      }
    });
  }

  const btnDownloadGrievance = document.getElementById("btn-download-grievance");
  if (btnDownloadGrievance) {
    btnDownloadGrievance.addEventListener("click", () => {
      const contentBox = document.getElementById("results-content-box");
      if (contentBox && selectedIssueId) {
        const content = contentBox.textContent;
        const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `grievance_${selectedIssueId}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showToast("Grievance downloaded as a text file.", "success");
      }
    });
  }

  // Comments form submit listener
  const commentForm = document.getElementById("form-add-comment");
  if (commentForm) {
    commentForm.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!selectedIssueId) return;
      
      const commentInput = document.getElementById("input-comment-text");
      const text = commentInput.value.trim();
      if (!text) return;
      
      const newComment = {
        user: volunteerMode ? "You (Civic Hero)" : "You (Alex)",
        time: new Date().toISOString().replace('T', ' ').substring(0, 16),
        text: text
      };
      
      if (!comments[selectedIssueId]) {
        comments[selectedIssueId] = [];
      }
      comments[selectedIssueId].push(newComment);
      
      localStorage.setItem("civicpulse_comments", JSON.stringify(comments));
      commentInput.value = "";
      renderComments(selectedIssueId);
      showToast("Comment posted to community timeline.", "success");
    });
  }
}

// ==========================================================================
// 10. TOAST NOTIFICATIONS & THEME HELPERS
// ==========================================================================
function showToast(message, type = "info") {
  const container = document.getElementById("toast-container");
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  
  let icon = "fa-info-circle";
  if (type === "success") icon = "fa-circle-check";
  else if (type === "error") icon = "fa-circle-xmark";
  
  toast.innerHTML = `<i class="fa-solid ${icon}"></i> <span>${message}</span>`;
  container.appendChild(toast);
  
  setTimeout(() => {
    toast.classList.add("toast-out");
    toast.addEventListener("animationend", () => {
      toast.remove();
    });
  }, 4000);
}
