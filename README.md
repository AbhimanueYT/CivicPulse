# CivicPulse | Hyperlocal Civic Action Hub

**CivicPulse** is an autonomous city-desk triage assistant and hyperlocal community coordination tool. It empowers citizens to report local hazards (road damage, sanitation issues, utility failures, safety hazards), verify local reports, and automatically triage them using **Google Gemini 1.5 Flash**. 

This application is built with a lightweight, client-side-only stack (Vanilla HTML5, CSS3, JavaScript, Leaflet Maps, and Chart.js), making it incredibly fast and easy to deploy on any static web host.

---

## Key Features

1. **Autonomous Gemini Triage**: Uses Gemini 1.5 Flash directly in the frontend to classify image details, verify civic priority, estimate hazard ratings, draft formal grievance documents, and recommend local heroes.
2. **GPS Geolocation Lock**: Leverages the browser Geolocation API (`navigator.geolocation`) to auto-locate the reporter at the exact latitude/longitude.
3. **Canvas Image Compression**: Scales high-resolution photos and webcam snapshots down to 300px on the fly, preventing `localStorage` exhaustion.
4. **Keyword & Category Filters**: Responsive filter triggers and keyword search to navigate local issues quickly.
5. **Municipal Grievance Actions**: Copy, download (`.txt`), or launch a native mailto email with pre-filled department addresses and Gemini-drafted bodies.
6. **Community Comments Timeline**: A collaborative update feed allowing citizens and volunteers to leave timeline logs (e.g. "Officer visited site").
7. **Dual-Role Switch (Hero/Citizen)**: Toggles between analytics/forecasting panels and a volunteer claiming board.

---

## Getting Started Locally

Since the app uses client-side modules, browser geolocation, and webcam stream APIs, it must be run from a local server (not via double-clicking the `index.html` file).

### 1. Run a Local Server
You can run a local server using any lightweight package. For example, using Node.js:

```bash
# Serve current folder using local 'serve' package on port 3000
npx -y serve -l 3000
```

Alternatively, if you have Python installed:
```bash
python -m http.server 3000
```

Open your browser and navigate to: **`http://localhost:3000`**

### 2. Configure Gemini API Key
To run the autonomous triage agent with live Google AI Studio models:
1. Click the **Gear Icon** in the top header.
2. Input your **Google Gemini API Key** (starts with `AIzaSy...`).
3. Toggle **"Enable Live Gemini Mode"** on.
4. Click **Save Settings**.

> [!NOTE]
> If you do not enter a key, CivicPulse will seamlessly fallback to high-fidelity simulated sandbox triage cycles, allowing full user flow demonstrations.

---

## Deployment Instructions

### 1. Vercel (Recommended)
1. Install the Vercel CLI: `npm install -g vercel` (or run `npx vercel`).
2. Run the deployment command in the project directory:
   ```bash
   vercel
   ```
3. Follow the CLI prompts to deploy as a static project.

### 2. Netlify
1. Log into your Netlify dashboard and click **Add new site > Import an existing project**.
2. Select your GitHub repository or drag and drop the folder containing `index.html`, `style.css`, `app.js` directly into the Netlify upload zone.

### 3. GitHub Pages
1. Push this codebase to a public GitHub repository.
2. Go to repository **Settings > Pages**.
3. Under **Build and deployment**, select **Deploy from a branch**.
4. Choose `main` (or the corresponding branch) and target folder `/ (root)`.
5. Click **Save**. Your site will be live in a few minutes!

---

## Google AI Studio Prompt Synchronization
You can also run or tweak the prompt model structure inside **Google AI Studio**:
- **Model**: `gemini-1.5-flash`
- **System Instructions**:
  ```text
  You are the CivicPulse Autonomous City-Desk Triage Agent.
  Analyze the provided community/civic issue description and details. 
  Provide a structured JSON output with the following exact fields:
  1. "verified": boolean (is this a real civic issue or public hazard? If it is spam, jokes, or completely unrelated to road damage, trash, streetlights, leakages, safety, set verified to false)
  2. "category": string (must be exactly one of: "infrastructure", "sanitation", "utilities", "safety")
  3. "severity": number (1 to 4: 1=Low, 2=Medium, 3=High, 4=Critical)
  4. "visionTags": string (a short, formatted multi-line summary of verified details, hazard estimations, and tags)
  5. "grievance": string (a formal municipal grievance document addressed to the appropriate division containing dates, coordinates, and details)
  6. "suggestedSkills": string (comma-separated list of skills, e.g. "Road Work, Sanitation, Plumbing")
  ```
- **Temperature**: `0.2` (for deterministic, structured JSON outputs)
