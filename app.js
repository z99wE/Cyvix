const scenarios = [
  {
    id: "transit",
    title: "Transit disruption in Ward 12",
    tag: "Urban mobility",
    summary:
      "Bus delay, rider complaints, and weather are combining into an avoidable service failure.",
    riskScore: 84,
    confidence: 91,
    forecastWindow: "6h",
    signalCount: "24,816",
    eventCount: "3",
    actionCount: "2",
    wardFocus: "Ward 12",
    stageLabel: "Ingesting feeds",
    pipelineState: "Cloud Storage -> Dataflow -> BigQuery",
    primarySignal: "Transit telemetry",
    riskIfIgnored: "High",
    responseWindow: "6h",
    actionTitle: "Reroute two buses and notify riders",
    actionBody:
      "A transit delay cluster is spreading across the corridor. Reassign vehicles, publish rider alerts, and flag the maintenance team to inspect the bottleneck before the delay becomes a system-wide service complaint.",
    engineeringLog:
      "ingest_sources=[gtfs-realtime, 311, weather_api, resident_text]\nfeature_store=BigQuery\nanomaly_model=robust_zscore_v2\nforecast=6h_horizon\ncorrelation=transit_delay x complaint_spike x rain",
    civicLog:
      "Ward 12 is seeing slower buses, more rider complaints, and a higher chance of missed transfers. The platform recommends moving service capacity now so the neighborhood does not feel the failure at rush hour.",
    stack: [
      ["Cloud Storage", "raw city feeds land here before processing."],
      ["Dataflow", "stream joins and normalizes transit, weather, and complaint events."],
      ["BigQuery", "stores history for trend analysis and neighborhood baselines."],
      ["Vertex AI", "runs anomaly scoring, summaries, and recommendations."],
      ["AlloyDB / pgvector", "retrieves similar past incidents and playbooks."],
      ["Cloud Run + Functions", "dispatches alerts, automations, and API endpoints."],
      ["Looker", "shares exec-ready city dashboards and ward drill-downs."],
      ["ADK Agent", "orchestrates the decision loop and follow-up actions."],
    ],
    feeds: [
      ["Transit", "GTFS realtime arrival variance is increasing on two routes."],
      ["Citizen feedback", "complaints mention crowding, lateness, and uncertainty."],
      ["Weather", "short rain burst amplifies delay propagation."],
      ["Utility", "no critical issue, but corridor stress is rising."],
    ],
    signals: [
      { name: "Transit variance", value: 0.86, note: "+19% arrival slippage on Route 7 and Route 11" },
      { name: "Complaint velocity", value: 0.77, note: "double the normal message rate in 90 minutes" },
      { name: "Weather coupling", value: 0.61, note: "rain is creating stop-to-stop amplification" },
      { name: "Action urgency", value: 0.88, note: "response window is shrinking" },
    ],
    activity: [
      { title: "Delay cluster detected", detail: "two routes now overlap in the same corridor." },
      { title: "Complaint language shifted", detail: "residents are asking for ETAs and service clarity." },
      { title: "Risk expanded eastward", detail: "adjacent blocks are beginning to inherit the delay." },
    ],
    workflow: [
      { step: "Generate alert", detail: "Cloud Run pushes a rider update and city ops notification." },
      { step: "Open ticket", detail: "Cloud Function creates a maintenance task with ward context." },
      { step: "Escalate if no change", detail: "ADK agent rechecks the ward in 15 minutes." },
    ],
    questions: {
      why:
        "Ward 12 is flagged because transit delay, complaint velocity, and weather are reinforcing each other. The model is not guessing from text alone; it is combining structured telemetry with public feedback and comparing it to the neighborhood baseline.",
      next:
        "The safest next step is to reroute capacity, notify riders, and assign an ops review. That reduces both service pain and the chance of a larger complaint wave.",
      risk:
        "If the city waits, the system predicts missed transfers, higher complaint volume, and a broader corridor slowdown within the next few hours.",
    },
    trace: [
      "BigQuery baseline: Ward 12 service variance above seasonal norm.",
      "Vertex anomaly score: 0.84 after multi-signal correlation.",
      "RAG lookup: matched 3 similar disruptions from the incident store.",
      "Action policy: reroute + notify + inspect.",
    ],
    chart: [0.28, 0.31, 0.26, 0.34, 0.42, 0.45, 0.39, 0.53, 0.61, 0.76, 0.84, 0.91, 0.88, 0.79, 0.72, 0.69],
  },
  {
    id: "water",
    title: "Water pressure drift in Ward 4",
    tag: "Smart utilities",
    summary:
      "Pressure fluctuation and resident language point to a localized distribution issue that needs inspection.",
    riskScore: 77,
    confidence: 88,
    forecastWindow: "12h",
    signalCount: "18,204",
    eventCount: "3",
    actionCount: "2",
    wardFocus: "Ward 4",
    stageLabel: "Forecasting impact",
    pipelineState: "BigQuery -> Vertex AI -> AlloyDB",
    primarySignal: "Utility telemetry",
    riskIfIgnored: "Medium-high",
    responseWindow: "12h",
    actionTitle: "Send inspection crew and publish a notice",
    actionBody:
      "Pressure drift and complaint clustering indicate a likely distribution problem. Inspect the line, run a pressure test, and publish a clear resident notice so the city stays ahead of the issue.",
    engineeringLog:
      "ingest_sources=[pressure_sensors, 311, resident_text]\nfeature_store=BigQuery\nanomaly_model=kalman_residual_v1\nforecast=12h_horizon\ncorrelation=pressure_drop x localized_complaints",
    civicLog:
      "Ward 4 may notice low pressure or inconsistent service soon. A transparent notice and fast inspection will reduce uncertainty and protect trust while the city checks the line.",
    stack: [
      ["Cloud Storage", "stores raw telemetry and resident reports."],
      ["Dataflow", "cleans time-series pressure readings and complaint text."],
      ["BigQuery", "keeps utility history for localized drift detection."],
      ["Vertex AI", "generates forecasts and resident-facing summaries."],
      ["AlloyDB / pgvector", "retrieves similar utility incidents and fixes."],
      ["Cloud Run + Functions", "publishes notices and creates inspection work orders."],
      ["Looker", "shows utility health by ward and street segment."],
      ["ADK Agent", "monitors whether the issue expands after intervention."],
    ],
    feeds: [
      ["Utility", "one pressure node fell below its normal operating band."],
      ["Citizen feedback", "messages mention cloudy water and lower pressure."],
      ["Transit", "no service linkage; useful as a negative control."],
      ["Weather", "not driving the incident, which helps isolate the root cause."],
    ],
    signals: [
      { name: "Pressure drift", value: 0.79, note: "one subzone is outside the expected band" },
      { name: "Complaint clustering", value: 0.66, note: "localized messages are increasing" },
      { name: "Containment confidence", value: 0.71, note: "issue appears local, not citywide" },
      { name: "Action urgency", value: 0.73, note: "inspection should start today" },
    ],
    activity: [
      { title: "Pressure loss detected", detail: "downstream nodes diverged from the baseline." },
      { title: "Complaint cluster localized", detail: "reports center on Ward 4 and two adjacent blocks." },
      { title: "Containment still likely", detail: "quick inspection should stop the spread." },
    ],
    workflow: [
      { step: "Create inspection ticket", detail: "assigns utility crew with ward-level context." },
      { step: "Publish resident notice", detail: "Cloud Run serves a plain-language update." },
      { step: "Track recovery", detail: "agent rechecks pressure after the crew arrives." },
    ],
    questions: {
      why:
        "Ward 4 is flagged because pressure telemetry and complaint language agree on a localized distribution issue. This is a classic pattern where structured and unstructured data reinforce each other.",
      next:
        "The best next step is to inspect the line, test pressure across nearby blocks, and notify residents with a short safety update.",
      risk:
        "If ignored, the issue could turn into a wider trust problem and require more expensive corrective work.",
    },
    trace: [
      "Pressure residual exceeded the neighborhood threshold.",
      "Complaint embeddings matched prior utility-drift incidents.",
      "Vertex forecast predicts short-term impact in adjacent blocks.",
      "Action policy: inspect + notify + monitor.",
    ],
    chart: [0.24, 0.29, 0.36, 0.41, 0.39, 0.34, 0.31, 0.28, 0.32, 0.43, 0.52, 0.71, 0.76, 0.65, 0.54, 0.44],
  },
  {
    id: "heat",
    title: "Heat resilience risk in Ward 9",
    tag: "Community wellness",
    summary:
      "Heat stress, accessibility gaps, and vulnerable residents are aligning into a public health risk.",
    riskScore: 81,
    confidence: 90,
    forecastWindow: "8h",
    signalCount: "21,409",
    eventCount: "4",
    actionCount: "3",
    wardFocus: "Ward 9",
    stageLabel: "Generating response plan",
    pipelineState: "BigQuery -> Vertex AI -> Cloud Run",
    primarySignal: "Weather + wellness",
    riskIfIgnored: "High",
    responseWindow: "8h",
    actionTitle: "Open cooling support and call high-risk residents",
    actionBody:
      "Heat stress is rising in vulnerable blocks. Open cooling centers, prioritize outreach, and coordinate transport for residents who need help reaching relief points.",
    engineeringLog:
      "ingest_sources=[weather, wellness_refs, 311, accessibility_layers]\nfeature_store=BigQuery\nanomaly_model=forecast_delta_v3\nforecast=8h_horizon\ncorrelation=heat_index x access_gap x vulnerability",
    civicLog:
      "Ward 9 is becoming harder to navigate and more dangerous for residents who are older or medically vulnerable. The city should act now with cooling support and outreach before the heat peak arrives.",
    stack: [
      ["Cloud Storage", "captures weather and wellness reference data."],
      ["Dataflow", "joins heat forecasts with accessibility layers."],
      ["BigQuery", "tracks vulnerability and neighborhood baselines."],
      ["Vertex AI", "predicts exposure and generates intervention language."],
      ["AlloyDB / pgvector", "finds similar heat incidents and playbooks."],
      ["Cloud Run + Functions", "broadcasts public updates and transport help."],
      ["Looker", "shows heat risk by block and relief coverage."],
      ["ADK Agent", "checks if outreach reduced the forecast risk."],
    ],
    feeds: [
      ["Weather", "heat index forecast exceeds comfort thresholds."],
      ["Wellness", "vulnerable residents are concentrated in a hot corridor."],
      ["Accessibility", "some blocks are too far from relief points."],
      ["Citizen feedback", "resident messages ask about cooling support."],
    ],
    signals: [
      { name: "Heat index", value: 0.88, note: "forecast is above the safe threshold" },
      { name: "Accessibility gap", value: 0.63, note: "relief points are unevenly distributed" },
      { name: "Wellness exposure", value: 0.74, note: "vulnerable residents face the highest risk" },
      { name: "Action urgency", value: 0.87, note: "response needs to happen before peak heat" },
    ],
    activity: [
      { title: "Heat threshold crossed", detail: "weather forecast moved beyond the comfort band." },
      { title: "Cooling coverage uneven", detail: "blocks near the river are farther from relief." },
      { title: "Outreach urgency increased", detail: "resident calls should begin before noon." },
    ],
    workflow: [
      { step: "Open cooling centers", detail: "Cloud Run updates a public support page." },
      { step: "Target outreach", detail: "Cloud Function sends calls and SMS to high-risk residents." },
      { step: "Monitor recovery", detail: "agent rechecks the risk score after intervention." },
    ],
    questions: {
      why:
        "Ward 9 is flagged because heat, access gaps, and vulnerability are overlapping. The platform is combining weather forecasts with community data to estimate who is most exposed.",
      next:
        "Open cooling support, send outreach, and coordinate transport for residents who need help getting to relief points.",
      risk:
        "Without action, the next failure could be a wellness incident among residents least able to travel during peak heat.",
    },
    trace: [
      "Heat forecast exceeded ward-specific safety thresholds.",
      "Accessibility map shows limited relief coverage in one corridor.",
      "Vertex forecast predicts higher exposure among vulnerable residents.",
      "Action policy: cooling centers + outreach + transport support.",
    ],
    chart: [0.26, 0.28, 0.27, 0.31, 0.36, 0.42, 0.45, 0.48, 0.56, 0.66, 0.78, 0.81, 0.79, 0.73, 0.68, 0.64],
  },
];

const state = {
  scenarioIndex: 0,
  autoCycle: true,
  cycleTimer: null,
};

const el = {
  scenarioTitle: document.getElementById("scenarioTitle"),
  scenarioTag: document.getElementById("scenarioTag"),
  scenarioSummary: document.getElementById("scenarioSummary"),
  riskScore: document.getElementById("riskScore"),
  forecastWindow: document.getElementById("forecastWindow"),
  confidence: document.getElementById("confidence"),
  signalCount: document.getElementById("signalCount"),
  eventCount: document.getElementById("eventCount"),
  actionCount: document.getElementById("actionCount"),
  wardFocus: document.getElementById("wardFocus"),
  stageLabel: document.getElementById("stageLabel"),
  traceLog: document.getElementById("traceLog"),
  engineeringLog: document.getElementById("engineeringLog"),
  civicLog: document.getElementById("civicLog"),
  actionTitle: document.getElementById("actionTitle"),
  actionBody: document.getElementById("actionBody"),
  riskIfIgnored: document.getElementById("riskIfIgnored"),
  responseWindow: document.getElementById("responseWindow"),
  primarySignal: document.getElementById("primarySignal"),
  scenarioList: document.getElementById("scenarioList"),
  feedList: document.getElementById("feedList"),
  stackGrid: document.getElementById("stackGrid"),
  workflowList: document.getElementById("workflowList"),
  signalStrip: document.getElementById("signalStrip"),
  pipeline: document.getElementById("pipeline"),
  points: document.getElementById("points"),
  linePath: document.getElementById("linePath"),
  areaPath: document.getElementById("areaPath"),
  chatLog: document.getElementById("chatLog"),
  chatForm: document.getElementById("chatForm"),
  chatInput: document.getElementById("chatInput"),
  cycleButton: document.getElementById("cycleButton"),
  toggleAuto: document.getElementById("toggleAuto"),
};

const pipelineStages = [
  { key: "ingest", label: "Ingest", subtitle: "Cloud Storage / Pub/Sub" },
  { key: "process", label: "Process", subtitle: "Dataflow / SQL" },
  { key: "detect", label: "Detect", subtitle: "BigQuery ML / Vertex" },
  { key: "retrieve", label: "Retrieve", subtitle: "AlloyDB / pgvector" },
  { key: "generate", label: "Generate", subtitle: "Gemini + ADK" },
  { key: "act", label: "Act", subtitle: "Cloud Run / Functions" },
];

function init() {
  renderScenarioList();
  renderPipeline();
  bindEvents();
  applyScenario(0, true);
  seedChat();
  startAutoCycle();
}

function bindEvents() {
  el.cycleButton.addEventListener("click", cycleScenario);
  el.toggleAuto.addEventListener("click", () => {
    state.autoCycle = !state.autoCycle;
    el.toggleAuto.textContent = `Auto-cycle ${state.autoCycle ? "on" : "off"}`;
    if (state.autoCycle) startAutoCycle();
    else stopAutoCycle();
  });

  el.chatForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const question = el.chatInput.value.trim();
    if (!question) return;
    handleQuestion(question);
    el.chatInput.value = "";
  });

  document.querySelectorAll("[data-question]").forEach((button) => {
    button.addEventListener("click", () => handleQuestion(button.dataset.question));
  });
}

function renderScenarioList() {
  el.scenarioList.innerHTML = "";
  scenarios.forEach((scenario, index) => {
    const button = document.createElement("button");
    button.className = "scenario-item";
    button.type = "button";
    button.innerHTML = `
      <div>
        <strong>${scenario.title}</strong>
        <span>${scenario.summary}</span>
      </div>
      <span class="pill muted">0${index + 1}</span>
    `;
    button.addEventListener("click", () => applyScenario(index));
    el.scenarioList.appendChild(button);
  });
}

function renderPipeline() {
  el.pipeline.innerHTML = "";
  pipelineStages.forEach((stage, index) => {
    const node = document.createElement("div");
    node.className = "stage";
    node.dataset.stage = stage.key;
    node.innerHTML = `
      <span class="stage-index">${index + 1}</span>
      <div>
        <strong>${stage.label}</strong>
        <small>${stage.subtitle}</small>
      </div>
    `;
    el.pipeline.appendChild(node);
  });
}

function applyScenario(index, quiet = false) {
  state.scenarioIndex = index;
  const scenario = scenarios[index];

  el.scenarioTitle.textContent = scenario.title;
  el.scenarioTag.textContent = scenario.tag;
  el.scenarioSummary.textContent = scenario.summary;
  el.riskScore.textContent = scenario.riskScore;
  el.forecastWindow.textContent = scenario.forecastWindow;
  el.confidence.textContent = `${scenario.confidence}%`;
  el.signalCount.textContent = scenario.signalCount;
  el.eventCount.textContent = scenario.eventCount;
  el.actionCount.textContent = scenario.actionCount;
  el.wardFocus.textContent = scenario.wardFocus;
  el.stageLabel.textContent = scenario.stageLabel;
  el.traceLog.textContent = scenario.trace.join("\n");
  el.engineeringLog.textContent = scenario.engineeringLog;
  el.civicLog.textContent = scenario.civicLog;
  el.actionTitle.textContent = scenario.actionTitle;
  el.actionBody.textContent = scenario.actionBody;
  el.riskIfIgnored.textContent = scenario.riskIfIgnored;
  el.responseWindow.textContent = scenario.responseWindow;
  el.primarySignal.textContent = scenario.primarySignal;

  renderFeedList(scenario.feeds);
  renderStackGrid(scenario.stack);
  renderWorkflowList(scenario.workflow);
  renderSignals(scenario.signals);
  renderChatSeed(scenario);
  renderChart(scenario.chart);
  renderActivities(scenario.activity);
  highlightScenario(index);
  updatePipeline(index);

  if (!quiet) {
    pushSystemMessage(`Scenario switched to ${scenario.title}.`);
  }
}

function highlightScenario(index) {
  [...el.scenarioList.children].forEach((item, itemIndex) => {
    item.classList.toggle("active", itemIndex === index);
  });
}

function updatePipeline(index) {
  const stageOrder = [
    "ingest",
    "process",
    "detect",
    "retrieve",
    "generate",
    "act",
  ];

  [...el.pipeline.children].forEach((node, nodeIndex) => {
    node.classList.remove("active", "done");
    if (nodeIndex < 2 + index) node.classList.add("done");
    if (nodeIndex === (index + 1) % stageOrder.length) node.classList.add("active");
  });
}

function renderFeedList(feeds) {
  el.feedList.innerHTML = "";
  feeds.forEach(([source, detail]) => {
    const item = document.createElement("div");
    item.className = "feed-item";
    item.innerHTML = `<strong>${source}</strong><span>${detail}</span>`;
    el.feedList.appendChild(item);
  });
}

function renderStackGrid(stack) {
  el.stackGrid.innerHTML = "";
  stack.forEach(([service, detail]) => {
    const item = document.createElement("div");
    item.className = "stack-item";
    item.innerHTML = `
      <strong>${service}</strong>
      <span>${detail}</span>
    `;
    el.stackGrid.appendChild(item);
  });
}

function renderWorkflowList(workflow) {
  el.workflowList.innerHTML = "";
  workflow.forEach((step, index) => {
    const item = document.createElement("div");
    item.className = "workflow-item";
    item.innerHTML = `
      <span class="workflow-index">0${index + 1}</span>
      <div>
        <strong>${step.step}</strong>
        <span>${step.detail}</span>
      </div>
    `;
    el.workflowList.appendChild(item);
  });
}

function renderSignals(signals) {
  el.signalStrip.innerHTML = "";
  signals.forEach((signal) => {
    const card = document.createElement("div");
    card.className = "signal-card";
    card.innerHTML = `
      <div class="signal-top">
        <strong>${signal.name}</strong>
        <span>${Math.round(signal.value * 100)}%</span>
      </div>
      <div class="bar"><span style="width:${signal.value * 100}%"></span></div>
      <p>${signal.note}</p>
    `;
    el.signalStrip.appendChild(card);
  });
}

function renderActivities(items) {
  const existing = document.querySelector(".activity-strip");
  if (existing) existing.remove();
  const strip = document.createElement("div");
  strip.className = "activity-strip";
  items.forEach((item) => {
    const card = document.createElement("div");
    card.className = "activity-item";
    card.innerHTML = `<strong>${item.title}</strong><span>${item.detail}</span>`;
    strip.appendChild(card);
  });
  el.signalStrip.parentElement.appendChild(strip);
}

function renderChart(values) {
  const width = 840;
  const height = 300;
  const left = 44;
  const top = 34;
  const innerWidth = width - left * 2;
  const innerHeight = height - top * 2;
  const points = values.map((value, index) => {
    const x = left + (innerWidth / (values.length - 1)) * index;
    const y = top + innerHeight - value * innerHeight;
    return { x, y };
  });

  const line = points.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`).join(" ");
  const area = `${line} L ${points[points.length - 1].x} ${height - top} L ${points[0].x} ${height - top} Z`;

  el.linePath.setAttribute("d", line);
  el.areaPath.setAttribute("d", area);
  el.points.innerHTML = points
    .map((point) => `<circle class="plot-point" cx="${point.x}" cy="${point.y}" r="5.5"></circle>`)
    .join("");
}

function renderChatSeed(scenario) {
  if (el.chatLog.children.length > 0) return;
  pushSystemMessage(
    `Ask about why the ward is flagged, the likely next failure, or the recommended action.`
  );
  pushAiMessage(
    `For ${scenario.title}, I can explain the evidence trail, show the model trace, and simulate the action that the Google Cloud pipeline would trigger.`
  );
}

function seedChat() {
  if (el.chatLog.children.length === 0) {
    renderChatSeed(scenarios[0]);
  }
}

function handleQuestion(question) {
  const scenario = scenarios[state.scenarioIndex];
  const normalized = question.toLowerCase();
  let answer = scenario.questions.why;

  if (normalized.includes("next") || normalized.includes("do ") || normalized.includes("action")) {
    answer = scenario.questions.next;
  } else if (normalized.includes("risk") || normalized.includes("worsen") || normalized.includes("fail")) {
    answer = scenario.questions.risk;
  }

  pushUserMessage(question);
  pushAiMessage(answer);
}

function pushUserMessage(text) {
  appendBubble("user", "You", text);
}

function pushAiMessage(text) {
  appendBubble("ai", "AetherPulse", text);
}

function pushSystemMessage(text) {
  appendBubble("system", "System", text);
}

function appendBubble(kind, label, text) {
  const bubble = document.createElement("div");
  bubble.className = `bubble ${kind}`;
  bubble.innerHTML = `<span class="bubble-label">${label}</span><p>${text}</p>`;
  el.chatLog.appendChild(bubble);
  el.chatLog.scrollTop = el.chatLog.scrollHeight;
}

function cycleScenario() {
  const next = (state.scenarioIndex + 1) % scenarios.length;
  applyScenario(next);
}

function startAutoCycle() {
  stopAutoCycle();
  state.cycleTimer = window.setInterval(() => {
    if (!state.autoCycle) return;
    cycleScenario();
  }, 15000);
}

function stopAutoCycle() {
  if (state.cycleTimer) {
    window.clearInterval(state.cycleTimer);
    state.cycleTimer = null;
  }
}

init();
