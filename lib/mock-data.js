export const scenarios = [
  {
    id: "transit",
    title: "Transit disruption in Ward 12",
    tag: "Urban mobility",
    summary:
      "Bus delay, rider complaints, and weather are combining into an avoidable service failure.",
    sourceTheme: "gtfs-realtime + 311 + weather + rider text",
    domain: "transportation",
    ward: "Ward 12",
    riskScore: 84,
    confidence: 0.91,
    forecastWindowHours: 6,
    primarySignal: "Transit telemetry",
    action: "Reroute two buses and notify riders",
    responseWindow: "6h",
    riskIfIgnored: "High",
    evidence: {
      technical:
        "ingest_sources=[gtfs-realtime, 311, weather_api, resident_text]\nfeature_store=BigQuery\nanomaly_model=robust_zscore_v2\nforecast=6h_horizon\ncorrelation=transit_delay x complaint_spike x rain",
      civic:
        "Ward 12 is seeing slower buses, more rider complaints, and a higher chance of missed transfers. The platform recommends moving service capacity now so the neighborhood does not feel the failure at rush hour."
    },
    trace: [
      "Cloud Storage received transit, weather, and complaint feeds.",
      "Dataflow normalized the event stream and joined time windows.",
      "BigQuery baseline showed service variance above seasonal norm.",
      "Vertex AI scored the pattern as a multi-signal anomaly.",
      "AlloyDB retrieved similar incident playbooks from prior disruptions.",
      "Cloud Run prepared reroute, rider alert, and maintenance workflows."
    ],
    feeds: [
      { source: "Transit", detail: "arrival variance increased on Route 7 and Route 11." },
      { source: "Citizen feedback", detail: "complaints mention crowding, lateness, and uncertainty." },
      { source: "Weather", detail: "short rain burst amplifies delay propagation." },
      { source: "Utility", detail: "no critical issue, useful as a negative control." }
    ],
    signals: [
      { name: "Transit variance", value: 0.86, note: "+19% arrival slippage on the central corridor" },
      { name: "Complaint velocity", value: 0.77, note: "double the normal message rate in 90 minutes" },
      { name: "Weather coupling", value: 0.61, note: "rain is creating stop-to-stop amplification" },
      { name: "Action urgency", value: 0.88, note: "response window is shrinking" }
    ],
    workflow: [
      { step: "Generate alert", detail: "Cloud Run pushes rider updates and city ops notification." },
      { step: "Open ticket", detail: "Cloud Function creates a maintenance task with ward context." },
      { step: "Escalate if no change", detail: "ADK agent rechecks the ward in 15 minutes." }
    ],
    similarIncidents: [
      {
        title: "Route 11 incident, May 2026",
        similarity: 0.89,
        summary: "Rain plus platform crowding led to delayed transfers and commuter frustration."
      },
      {
        title: "Central corridor slowdown, March 2026",
        similarity: 0.83,
        summary: "Transit variance and complaint spikes were stabilized after reroute and rider messaging."
      }
    ],
    questions: {
      why:
        "Ward 12 is flagged because transit delay, complaint velocity, and weather are reinforcing each other. The platform is combining structured telemetry with public feedback and comparing it to the neighborhood baseline.",
      next:
        "The safest next step is to reroute capacity, notify riders, and assign an ops review. That reduces both service pain and the chance of a larger complaint wave.",
      risk:
        "If the city waits, the system predicts missed transfers, higher complaint volume, and a broader corridor slowdown within the next few hours."
    },
    chart: [0.28, 0.31, 0.26, 0.34, 0.42, 0.45, 0.39, 0.53, 0.61, 0.76, 0.84, 0.91, 0.88, 0.79, 0.72, 0.69]
  },
  {
    id: "water",
    title: "Water pressure drift in Ward 4",
    tag: "Smart utilities",
    summary:
      "Pressure fluctuation and resident language point to a localized distribution issue that needs inspection.",
    sourceTheme: "pressure sensors + 311 + resident text",
    domain: "utilities",
    ward: "Ward 4",
    riskScore: 77,
    confidence: 0.88,
    forecastWindowHours: 12,
    primarySignal: "Utility telemetry",
    action: "Send inspection crew and publish a notice",
    responseWindow: "12h",
    riskIfIgnored: "Medium-high",
    evidence: {
      technical:
        "ingest_sources=[pressure_sensors, 311, resident_text]\nfeature_store=BigQuery\nanomaly_model=kalman_residual_v1\nforecast=12h_horizon\ncorrelation=pressure_drop x localized_complaints",
      civic:
        "Ward 4 may notice low pressure or inconsistent service soon. A transparent notice and fast inspection will reduce uncertainty and protect trust while the city checks the line."
    },
    trace: [
      "Cloud Storage received utility telemetry and resident reports.",
      "Dataflow flagged a localized pressure residual.",
      "BigQuery compared the ward against its normal operating band.",
      "Vertex AI estimated the impact would remain localized without intervention.",
      "AlloyDB matched the signal against prior utility drift incidents.",
      "Cloud Functions prepared an inspection ticket and resident notice."
    ],
    feeds: [
      { source: "Utility", detail: "one pressure node fell below its normal operating band." },
      { source: "Citizen feedback", detail: "messages mention cloudy water and lower pressure." },
      { source: "Transit", detail: "no linkage here, useful for isolation." },
      { source: "Weather", detail: "not the primary driver of this incident." }
    ],
    signals: [
      { name: "Pressure drift", value: 0.79, note: "one subzone is outside the expected band" },
      { name: "Complaint clustering", value: 0.66, note: "localized messages are increasing" },
      { name: "Containment confidence", value: 0.71, note: "issue appears local, not citywide" },
      { name: "Action urgency", value: 0.73, note: "inspection should start today" }
    ],
    workflow: [
      { step: "Create inspection ticket", detail: "assigns utility crew with ward-level context." },
      { step: "Publish resident notice", detail: "Cloud Run serves a plain-language update." },
      { step: "Track recovery", detail: "agent rechecks pressure after the crew arrives." }
    ],
    similarIncidents: [
      {
        title: "Valve drift, April 2026",
        similarity: 0.85,
        summary: "Localized pressure change was resolved after line inspection and notification."
      },
      {
        title: "Service trust incident, January 2026",
        similarity: 0.8,
        summary: "Complaint clustering was the earliest sign of a hidden utility fault."
      }
    ],
    questions: {
      why:
        "Ward 4 is flagged because pressure telemetry and complaint language agree on a localized distribution issue. This is a classic pattern where structured and unstructured data reinforce each other.",
      next:
        "The best next step is to inspect the line, test pressure across nearby blocks, and notify residents with a short safety update.",
      risk:
        "If ignored, the issue could turn into a wider trust problem and require more expensive corrective work."
    },
    chart: [0.24, 0.29, 0.36, 0.41, 0.39, 0.34, 0.31, 0.28, 0.32, 0.43, 0.52, 0.71, 0.76, 0.65, 0.54, 0.44]
  },
  {
    id: "heat",
    title: "Heat resilience risk in Ward 9",
    tag: "Community wellness",
    summary:
      "Heat stress, accessibility gaps, and vulnerable residents are aligning into a public health risk.",
    sourceTheme: "weather + accessibility + wellness references + 311",
    domain: "wellness",
    ward: "Ward 9",
    riskScore: 81,
    confidence: 0.9,
    forecastWindowHours: 8,
    primarySignal: "Weather + wellness",
    action: "Open cooling support and call high-risk residents",
    responseWindow: "8h",
    riskIfIgnored: "High",
    evidence: {
      technical:
        "ingest_sources=[weather, wellness_refs, 311, accessibility_layers]\nfeature_store=BigQuery\nanomaly_model=forecast_delta_v3\nforecast=8h_horizon\ncorrelation=heat_index x access_gap x vulnerability",
      civic:
        "Ward 9 is becoming harder to navigate and more dangerous for residents who are older or medically vulnerable. The city should act now with cooling support and outreach before the heat peak arrives."
    },
    trace: [
      "Weather forecast exceeded ward-specific safety thresholds.",
      "Accessibility map showed limited relief coverage in one corridor.",
      "BigQuery joined vulnerability and distance-to-service layers.",
      "Vertex AI predicted higher exposure among high-risk residents.",
      "AlloyDB retrieved similar heat incidents and response plans.",
      "Cloud Run prepared a cooling-center and outreach workflow."
    ],
    feeds: [
      { source: "Weather", detail: "heat index forecast exceeds comfort thresholds." },
      { source: "Wellness", detail: "vulnerable residents are concentrated in a hot corridor." },
      { source: "Accessibility", detail: "some blocks are too far from relief points." },
      { source: "Citizen feedback", detail: "resident messages ask about cooling support." }
    ],
    signals: [
      { name: "Heat index", value: 0.88, note: "forecast is above the safe threshold" },
      { name: "Accessibility gap", value: 0.63, note: "relief points are unevenly distributed" },
      { name: "Wellness exposure", value: 0.74, note: "vulnerable residents face the highest risk" },
      { name: "Action urgency", value: 0.87, note: "response needs to happen before peak heat" }
    ],
    workflow: [
      { step: "Open cooling centers", detail: "Cloud Run updates a public support page." },
      { step: "Target outreach", detail: "Cloud Function sends calls and SMS to high-risk residents." },
      { step: "Monitor recovery", detail: "agent rechecks the risk score after intervention." }
    ],
    similarIncidents: [
      {
        title: "Heat wave response, June 2025",
        similarity: 0.87,
        summary: "Cooling centers and transport support reduced exposure for vulnerable residents."
      },
      {
        title: "Ward 9 wellness alert, July 2025",
        similarity: 0.82,
        summary: "Accessibility gaps made relief points too far from the residents most at risk."
      }
    ],
    questions: {
      why:
        "Ward 9 is flagged because heat, access gaps, and vulnerability are overlapping. The platform is combining weather forecasts with community data to estimate who is most exposed.",
      next:
        "Open cooling support, send outreach, and coordinate transport for residents who need help getting to relief points.",
      risk:
        "Without action, the next failure could be a wellness incident among residents least able to travel during peak heat."
    },
    chart: [0.26, 0.28, 0.27, 0.31, 0.36, 0.42, 0.45, 0.48, 0.56, 0.66, 0.78, 0.81, 0.79, 0.73, 0.68, 0.64]
  }
];

export const pipelineStages = [
  { key: "ingest", label: "Ingest", subtitle: "Cloud Storage / Pub/Sub" },
  { key: "process", label: "Process", subtitle: "Dataflow / SQL" },
  { key: "detect", label: "Detect", subtitle: "BigQuery ML / Vertex AI" },
  { key: "retrieve", label: "Retrieve", subtitle: "AlloyDB / pgvector" },
  { key: "generate", label: "Generate", subtitle: "Gemini + ADK" },
  { key: "act", label: "Act", subtitle: "Cloud Run / Functions" }
];

export const googleStack = [
  ["Cloud Storage", "raw city feeds land here before processing."],
  ["Dataflow", "stream joins and normalizes transit, weather, and complaint events."],
  ["BigQuery", "stores history for trend analysis and neighborhood baselines."],
  ["Vertex AI", "runs anomaly scoring, summaries, and recommendations."],
  ["AlloyDB / pgvector", "retrieves similar past incidents and playbooks."],
  ["Cloud Run + Functions", "dispatches alerts, automations, and API endpoints."],
  ["Looker", "shares exec-ready city dashboards and ward drill-downs."],
  ["ADK Agent", "orchestrates the decision loop and follow-up actions."]
];

export function getScenario(id = "transit") {
  return scenarios.find((scenario) => scenario.id === id) ?? scenarios[0];
}

export function listScenarioSummaries() {
  return scenarios.map(({ id, title, tag, summary, domain, ward }) => ({
    id,
    title,
    tag,
    summary,
    domain,
    ward
  }));
}
