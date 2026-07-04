"use client";

import { useEffect, useMemo, useState } from "react";

const initialLogs = [
  {
    role: "system",
    label: "System",
    text: "Ask a question, switch scenarios, or run the demo cycle. The dashboard will call the API routes and update the evidence trail."
  }
];

function formatPercent(value) {
  return `${Math.round(value * 100)}%`;
}

function renderChartPath(values, width = 840, height = 300) {
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
  return { line, area, points };
}

export default function DashboardClient({ scenarios, pipelineStages, stack }) {
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [autoCycle, setAutoCycle] = useState(true);
  const [guidedDemo, setGuidedDemo] = useState(true);
  const [demoStep, setDemoStep] = useState(0);
  const [ingest, setIngest] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [recommendation, setRecommendation] = useState(null);
  const [agentRun, setAgentRun] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [activeQuestion, setActiveQuestion] = useState("");
  const [chat, setChat] = useState(initialLogs);

  const scenario = scenarios[scenarioIndex];
  const serviceBadges = [
    "Vertex AI",
    "Gemini",
    "BigQuery",
    "Cloud Run",
    "ADK",
    "AlloyDB",
    "Cloud Functions",
    "Looker"
  ];

  const demoNarration = [
    {
      title: "Observe the city",
      body: "BigQuery and streaming feeds ingest telemetry, citizen feedback, and environmental signals."
    },
    {
      title: "Reason with AI",
      body: "Vertex AI scores risk and Gemini turns the output into a clear, human explanation."
    },
    {
      title: "Retrieve memory",
      body: "AlloyDB / pgvector fetches similar incidents and playbooks to ground the answer."
    },
    {
      title: "Act on the decision",
      body: "Cloud Run, Cloud Functions, and ADK trigger alerts, tickets, and the follow-up check."
    }
  ];

  const chart = useMemo(() => renderChartPath(scenario.chart), [scenario.chart]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      if (!autoCycle) return;
      setScenarioIndex((current) => (current + 1) % scenarios.length);
    }, 15000);

    return () => window.clearInterval(timer);
  }, [autoCycle, scenarios.length]);

  useEffect(() => {
    let cancelled = false;
    const prompt = activeQuestion || `Why is ${scenario.ward} flagged?`;

    async function loadScenarioData() {
      const ingestResponse = await fetch(`/api/ingest?scenarioId=${scenario.id}`);
      const ingestJson = await ingestResponse.json();

      const analysisResponse = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scenarioId: scenario.id,
          question: prompt
        })
      });
      const analysisJson = await analysisResponse.json();

      const recommendationResponse = await fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scenarioId: scenario.id,
          analysis: analysisJson.analysis
        })
      });
      const recommendationJson = await recommendationResponse.json();

      const agentResponse = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scenarioId: scenario.id,
          analysis: analysisJson.analysis
        })
      });
      const agentJson = await agentResponse.json();

      if (!cancelled) {
        setIngest(ingestJson.batch);
        setAnalysis(analysisJson.analysis);
        setRecommendation(recommendationJson.recommendation);
        setAgentRun(agentJson.agentRun);
      }
    }

    loadScenarioData();

    return () => {
      cancelled = true;
    };
  }, [scenario.id, scenario.ward, activeQuestion]);

  useEffect(() => {
    if (!guidedDemo) return undefined;
    const timer = window.setInterval(() => {
      setDemoStep((current) => (current + 1) % demoNarration.length);
    }, 4000);

    return () => window.clearInterval(timer);
  }, [guidedDemo, demoNarration.length]);

  function appendChat(role, text) {
    setChat((current) => [...current, { role, label: role === "user" ? "You" : "AetherPulse", text }]);
  }

  async function askQuestion(value) {
    const text = value.trim();
    if (!text) return;

    appendChat("user", text);
    setActiveQuestion(text);

    const response = await fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        scenarioId: scenario.id,
        question: text
      })
    });
    const payload = await response.json();
    setAnalysis(payload.analysis);
    appendChat("assistant", payload.analysis.answer);

    const recommendationResponse = await fetch("/api/recommend", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        scenarioId: scenario.id,
        analysis: payload.analysis
      })
    });
    const recommendationJson = await recommendationResponse.json();
    setRecommendation(recommendationJson.recommendation);

    const agentResponse = await fetch("/api/agent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        scenarioId: scenario.id,
        analysis: payload.analysis
      })
    });
    const agentJson = await agentResponse.json();
    setAgentRun(agentJson.agentRun);
  }

  const traceItems = analysis?.modelTrace ?? scenario.trace;
  const signals = ingest?.signalVector ?? scenario.signals;
  const streams = ingest?.streams ?? scenario.feeds;
  const { line, area, points } = chart;

  return (
    <main className="shell">
      <aside className="sidebar">
        <section className="brand-card card">
          <div className="brand">
            <div className="brand-mark">AP</div>
            <div>
              <p>AetherPulse</p>
              <span>Decision Intelligence Platform</span>
            </div>
          </div>
          <p className="brand-copy">
            A city copilot that ingests public data, scores neighborhood risk, explains why it matters, and recommends action with Google Cloud AI.
          </p>
          <div className="status-row">
            <span className="pill live">Live demo</span>
            <span className="pill">Vertex AI + Gemini</span>
          </div>
        </section>

        <section className="card">
          <div className="card-head">
            <div>
              <p className="eyebrow">City lens</p>
              <h2>{scenario.title}</h2>
            </div>
            <span className="pill">{scenario.tag}</span>
          </div>
          <p className="summary">{scenario.summary}</p>
          <div className="mini-metrics">
            <div>
              <span>Risk score</span>
              <strong>{scenario.riskScore}</strong>
            </div>
            <div>
              <span>Forecast</span>
              <strong>{scenario.forecastWindowHours}h</strong>
            </div>
            <div>
              <span>Confidence</span>
              <strong>{formatPercent(scenario.confidence)}</strong>
            </div>
          </div>
        </section>

        <section className="card">
          <div className="card-head">
            <div>
              <p className="eyebrow">Scenario</p>
              <h3>Choose a city problem</h3>
            </div>
            <span className="pill muted">Demo data</span>
          </div>
          <div className="scenario-list">
            {scenarios.map((item, index) => (
              <button
                key={item.id}
                className={`scenario-item${index === scenarioIndex ? " active" : ""}`}
                type="button"
                onClick={() => setScenarioIndex(index)}
              >
                <div>
                  <strong>{item.title}</strong>
                  <span>{item.summary}</span>
                </div>
                <span className="pill muted">0{index + 1}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="card">
          <div className="card-head">
            <div>
              <p className="eyebrow">Google stack</p>
              <h3>Services used in the loop</h3>
            </div>
          </div>
          <div className="badge-row">
            {serviceBadges.map((service) => (
              <span className="service-badge" key={service}>
                {service}
              </span>
            ))}
          </div>
        </section>

        <section className="card">
          <div className="card-head">
            <div>
              <p className="eyebrow">Input feeds</p>
              <h3>Structured + unstructured</h3>
            </div>
          </div>
          <div className="feed-list">
            {streams.map((feed) => (
              <div className="feed-item" key={`${scenario.id}-${feed.source}`}>
                <strong>{feed.source}</strong>
                <span>{feed.detail}</span>
              </div>
            ))}
          </div>
        </section>
      </aside>

      <section className="main">
        <header className="hero card">
          <div className="hero-copy">
            <p className="eyebrow">Hackathon build</p>
            <h1>Turn city telemetry into decisions, not dashboards.</h1>
            <p>
              AetherPulse combines streaming data, anomaly detection, retrieval, and generative reasoning to help city teams act before small issues become public failures.
            </p>
            <div className="cta-row">
              <button className="primary" type="button" onClick={() => setScenarioIndex((current) => (current + 1) % scenarios.length)}>
                Run demo cycle
              </button>
              <button className="ghost" type="button" onClick={() => setAutoCycle((current) => !current)}>
                Auto-cycle {autoCycle ? "on" : "off"}
              </button>
              <button className="ghost" type="button" onClick={() => setGuidedDemo((current) => !current)}>
                Guided demo {guidedDemo ? "on" : "off"}
              </button>
            </div>
          </div>
          <div className="hero-stats">
            <div className="glass">
              <span>Signals ingested</span>
              <strong>{ingest?.streams?.length ? 24000 + ingest.streams.length * 137 : 24816}</strong>
              <small>Public + sensor data points this hour</small>
            </div>
            <div className="glass">
              <span>Events correlated</span>
              <strong>{ingest?.streams?.length ?? 3}</strong>
              <small>Transit, complaints, weather, utility</small>
            </div>
            <div className="glass">
              <span>Actions generated</span>
              <strong>{recommendation?.actions?.length ?? 2}</strong>
              <small>Alerts, reroute, inspection, outreach</small>
            </div>
          </div>
        </header>

        <section className="card demo-guide">
          <div className="card-head">
            <div>
              <p className="eyebrow">Guided demo mode</p>
              <h3>Auto-walk judges through the ADK lifecycle</h3>
            </div>
            <span className="pill live">{demoNarration[demoStep].title}</span>
          </div>
          <div className="demo-grid">
            {demoNarration.map((item, index) => (
              <div className={`demo-step${index === demoStep ? " active" : ""}`} key={item.title}>
                <span className="step-index">0{index + 1}</span>
                <strong>{item.title}</strong>
                <p>{item.body}</p>
              </div>
            ))}
          </div>
          <div className="demo-banner">
            <strong>{demoNarration[demoStep].title}</strong>
            <span>{demoNarration[demoStep].body}</span>
          </div>
        </section>

        <section className="top-grid">
          <article className="card pipeline-card">
            <div className="card-head">
              <div>
                <p className="eyebrow">Google Cloud pipeline</p>
                <h3>Streaming ingest to decision output</h3>
              </div>
              <span className="pill live">{scenario.sourceTheme}</span>
            </div>

            <div className="pipeline">
              {pipelineStages.map((stage, index) => {
                const active = index <= scenarioIndex + 1;
                const done = index < scenarioIndex + 1;
                return (
                  <div key={stage.key} className={`stage${active ? " active" : ""}${done ? " done" : ""}`}>
                    <span className="stage-index">{index + 1}</span>
                    <div>
                      <strong>{stage.label}</strong>
                      <small>{stage.subtitle}</small>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="trace">
              <div className="trace-head">
                <span>Execution trace</span>
                <span>{analysis ? "Vertex AI reasoning active" : "Ingesting feeds"}</span>
              </div>
              <pre>{traceItems.join("\n")}</pre>
            </div>
          </article>

          <article className="card chart-card">
            <div className="card-head">
              <div>
                <p className="eyebrow">Neighborhood risk</p>
                <h3>Composite stress index</h3>
              </div>
              <span className="pill">{scenario.ward}</span>
            </div>
            <svg viewBox="0 0 840 300" className="chart" aria-label="Composite risk chart">
              <defs>
                <linearGradient id="stressGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#69f0ca" />
                  <stop offset="50%" stopColor="#f2c46e" />
                  <stop offset="100%" stopColor="#ff7e92" />
                </linearGradient>
              </defs>
              <g className="grid-lines">
                <path d="M44 40H798" />
                <path d="M44 100H798" />
                <path d="M44 160H798" />
                <path d="M44 220H798" />
              </g>
              <path className="area" d={area} />
              <path className="line" d={line} />
              <g>
                {points.map((point) => (
                  <circle key={`${point.x}-${point.y}`} className="plot-point" cx={point.x} cy={point.y} r="5.5" />
                ))}
              </g>
            </svg>

            <div className="signal-strip">
              {signals.map((signal) => {
                const value = typeof signal.value === "number" ? signal.value : signal.similarity;
                return (
                  <div className="signal-card" key={signal.name ?? signal.source}>
                    <div className="signal-top">
                      <strong>{signal.name ?? signal.source}</strong>
                      <span>{Math.round(value * 100)}%</span>
                    </div>
                    <div className="bar">
                      <span style={{ width: `${value * 100}%` }} />
                    </div>
                    <p>{signal.note ?? signal.detail}</p>
                  </div>
                );
              })}
            </div>
          </article>
        </section>

        <section className="mid-grid">
          <article className="card copilot-card">
            <div className="card-head">
              <div>
                <p className="eyebrow">Conversational analytics</p>
                <h3>Ask the system in natural language</h3>
              </div>
              <span className="pill muted">Gemini-ready UX</span>
            </div>

            <div className="chat-log">
              {chat.map((message, index) => (
                <div className={`bubble ${message.role}`} key={`${message.role}-${index}`}>
                  <span className="bubble-label">{message.label}</span>
                  <p>{message.text}</p>
                </div>
              ))}
            </div>

            <form
              className="chat-form"
              onSubmit={(event) => {
                event.preventDefault();
                askQuestion(inputValue || `Why is ${scenario.ward} flagged?`);
                setInputValue("");
              }}
            >
              <input
                value={inputValue}
                onChange={(event) => setInputValue(event.target.value)}
                type="text"
                autoComplete="off"
                placeholder="Ask why a ward is flagged, what will happen next, or what the city should do"
              />
              <button className="primary" type="submit">
                Analyze
              </button>
            </form>

            <div className="suggestions">
              <button className="chip" type="button" onClick={() => askQuestion(`Why is ${scenario.ward} flagged?`)}>
                Why is {scenario.ward} flagged?
              </button>
              <button className="chip" type="button" onClick={() => askQuestion("What should city staff do in the next 30 minutes?")}>
                Next 30 minutes?
              </button>
              <button className="chip" type="button" onClick={() => askQuestion("Which ward is most likely to worsen next?")}>
                Which ward worsens next?
              </button>
            </div>
          </article>

          <article className="card explain-card">
            <div className="card-head">
              <div>
                <p className="eyebrow">Explainability</p>
                <h3>Technical evidence + civic context</h3>
              </div>
              <span className="pill muted">Deterministic core</span>
            </div>

            <div className="split">
              <section className="log-box">
                <p className="log-label">Engineering log</p>
                <pre>{analysis?.baseline
                  ? `ward=${analysis.baseline.ward}\ndomain=${analysis.baseline.domain}\nrisk_band=${analysis.baseline.severityBand}\nprojected_risk=${analysis.forecast.projectedRisk}\nretrieval_hits=${analysis.similarIncidents.length}\nconfidence=${analysis.metrics.confidence}%`
                  : scenario.evidence.technical}</pre>
              </section>
              <section className="log-box civic">
                <p className="log-label">Civic context</p>
                <p>{analysis?.answer ?? scenario.evidence.civic}</p>
              </section>
            </div>

            <div className="action-package">
              <div>
                <p className="eyebrow">Next best action</p>
                <h3>{recommendation?.title ?? scenario.action}</h3>
              </div>
              <p>{recommendation?.summary ?? scenario.evidence.civic}</p>
              <div className="action-grid">
                <div className="info-chip">
                  <span>Risk if ignored</span>
                  <strong>{recommendation?.riskIfIgnored ?? scenario.riskIfIgnored}</strong>
                </div>
                <div className="info-chip">
                  <span>Response window</span>
                  <strong>{recommendation?.responseWindow ?? scenario.responseWindow}</strong>
                </div>
                <div className="info-chip">
                  <span>Primary signal</span>
                  <strong>{scenario.primarySignal}</strong>
                </div>
              </div>
            </div>
          </article>
        </section>

        <section className="bottom-grid">
          <article className="card stack-card">
            <div className="card-head">
              <div>
                <p className="eyebrow">Google stack</p>
                <h3>How the system hangs together</h3>
              </div>
            </div>
            <div className="stack-grid">
              {stack.map(([service, detail]) => (
                <div className="stack-item" key={service}>
                  <strong>{service}</strong>
                  <span>{detail}</span>
                </div>
              ))}
            </div>
          </article>

          <article className="card agent-card">
            <div className="card-head">
              <div>
                <p className="eyebrow">Google ADK agent</p>
                <h3>{agentRun?.agent ?? "AetherOps Agent"} loop</h3>
              </div>
              <span className="pill">{agentRun?.state ?? "observe"}</span>
            </div>
            <p className="summary">
              {agentRun
                ? `The agent is in ${agentRun.state} mode with ${agentRun.confidence}% confidence, running the city decision loop end to end.`
                : "The agent observes, reasons, retrieves, recommends, and acts on behalf of city teams."}
            </p>
            <div className="trace-badges">
              {(agentRun?.tools ?? [
                "BigQuery signal query",
                "Vertex AI reasoning",
                "Gemini response synthesis",
                "AlloyDB retrieval",
                "Looker context overlay",
                "Cloud Functions workflow"
              ]).map((tool) => (
                <span className="tool-badge" key={tool}>
                  {tool}
                </span>
              ))}
            </div>
            <div className="agent-columns">
              <section className="log-box">
                <p className="log-label">Plan</p>
                <div className="workflow-list">
                  {(agentRun?.plan ?? [
                    { step: "Observe", detail: "Ingest ward signals." },
                    { step: "Reason", detail: "Score the anomaly." },
                    { step: "Retrieve", detail: "Pull similar incidents." },
                    { step: "Recommend", detail: "Pick the best action." },
                    { step: "Act", detail: "Trigger workflow automation." }
                  ]).map((item) => (
                    <div className="workflow-item" key={item.step}>
                      <span className="workflow-index">•</span>
                      <div>
                        <strong>{item.step}</strong>
                        <span>{item.detail}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
              <section className="log-box civic">
                <p className="log-label">Guardrails</p>
                <div className="workflow-list">
                  {(agentRun?.guardrails ?? [
                    "No raw private data is shown to the client.",
                    "Every action is explainable in civic language.",
                    "Follow-up checks prevent one-shot decisions."
                  ]).map((item) => (
                    <div className="activity-item" key={item}>
                      <strong>{item}</strong>
                    </div>
                  ))}
                </div>
              </section>
            </div>
            <div className="action-grid agent-meta">
              <div className="info-chip">
                <span>Framework</span>
                <strong>{agentRun?.framework ?? "Google ADK"}</strong>
              </div>
              <div className="info-chip">
                <span>Tools used</span>
                <strong>{agentRun?.tools?.length ?? 5}</strong>
              </div>
              <div className="info-chip">
                <span>Memory items</span>
                <strong>{agentRun?.memory?.length ?? 3}</strong>
              </div>
            </div>
          </article>

          <article className="card workflow-card">
            <div className="card-head">
              <div>
                <p className="eyebrow">Workflow automation</p>
                <h3>Actions triggered by the model</h3>
              </div>
              <span className="pill live">ADK orchestration</span>
            </div>
            <div className="workflow-list">
              {(recommendation?.actions ?? scenario.workflow).map((step, index) => (
                <div className="workflow-item" key={`${step.step}-${index}`}>
                  <span className="workflow-index">0{index + 1}</span>
                  <div>
                    <strong>{step.step}</strong>
                    <span>{step.detail}</span>
                  </div>
                </div>
              ))}
            </div>
          </article>
        </section>

        <section className="card trace-card">
          <div className="card-head">
            <div>
              <p className="eyebrow">Agent trace timeline</p>
              <h3>Step-by-step lifecycle with tool calls</h3>
            </div>
            <span className="pill live">{agentRun?.objective ?? `Resolve ${scenario.ward} service risk`}</span>
          </div>
          <div className="timeline">
            {(agentRun?.lifecycle ?? []).map((item, index) => (
              <div className="timeline-item" key={`${item.stage}-${index}`}>
                <div className="timeline-marker">
                  <span>{index + 1}</span>
                </div>
                <div className="timeline-content">
                  <div className="timeline-top">
                    <strong>{item.stage}</strong>
                    <span className="tool-badge">{item.service}</span>
                  </div>
                  <p>{item.note}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="trace-badges">
            {(agentRun?.toolCalls ?? []).map((call) => (
              <div className="tool-call" key={`${call.service}-${call.action}`}>
                <span className="tool-badge">{call.service}</span>
                <strong>{call.action}</strong>
                <p>{call.detail}</p>
              </div>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
