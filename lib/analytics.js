import { getScenario, listScenarioSummaries } from "./mock-data.js";

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function tokenize(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

export function buildBaseline(scenario) {
  const risk = scenario.riskScore;
  const confidence = Math.round(scenario.confidence * 100);

  return {
    ward: scenario.ward,
    domain: scenario.domain,
    risk,
    confidence,
    severityBand:
      risk >= 80 ? "critical" : risk >= 70 ? "elevated" : "watch",
    timeHorizonHours: scenario.forecastWindowHours
  };
}

export function retrieveSimilarIncidents(scenario, question = "") {
  const queryTokens = new Set(
    tokenize([scenario.title, scenario.summary, question].join(" "))
  );

  return [...scenario.similarIncidents]
    .map((incident) => {
      const incidentTokens = tokenize([incident.title, incident.summary].join(" "));
      const overlap = incidentTokens.filter((token) => queryTokens.has(token)).length;
      const score = clamp(incident.similarity + overlap * 0.03, 0, 0.99);
      return { ...incident, score: Number(score.toFixed(2)) };
    })
    .sort((a, b) => b.score - a.score);
}

export function scoreQuestion(question, scenario) {
  const normalized = question.toLowerCase();
  if (normalized.includes("next") || normalized.includes("do ") || normalized.includes("action")) {
    return scenario.questions.next;
  }
  if (normalized.includes("risk") || normalized.includes("fail") || normalized.includes("worsen")) {
    return scenario.questions.risk;
  }
  if (normalized.includes("why") || normalized.includes("flag")) {
    return scenario.questions.why;
  }
  return scenario.questions.why;
}

export function buildForecast(scenario) {
  const risk = scenario.riskScore;
  const uplift = risk >= 80 ? 12 : risk >= 75 ? 8 : 6;
  return {
    horizonHours: scenario.forecastWindowHours,
    projectedRisk: clamp(risk + uplift, 0, 99),
    nextFailure: scenario.domain === "transportation"
      ? "Corridor slowdown and missed transfers"
      : scenario.domain === "utilities"
        ? "Localized service interruption and complaint spread"
        : "Exposure event among vulnerable residents"
  };
}

export function analyzeScenario({ scenarioId, question }) {
  const scenario = getScenario(scenarioId);
  const baseline = buildBaseline(scenario);
  const similarIncidents = retrieveSimilarIncidents(scenario, question);
  const forecast = buildForecast(scenario);
  const answer = scoreQuestion(question, scenario);
  const confidence = Math.round(scenario.confidence * 100);
  const tokens = tokenize(question);

  return {
    scenario: {
      id: scenario.id,
      title: scenario.title,
      ward: scenario.ward,
      domain: scenario.domain
    },
    question,
    answer,
    baseline,
    forecast,
    similarIncidents,
    metrics: {
      riskScore: scenario.riskScore,
      confidence,
      responseWindow: scenario.responseWindow,
      primarySignal: scenario.primarySignal
    },
    modelTrace: [
      `question_tokens=${tokens.length}`,
      `ward=${scenario.ward}`,
      `baseline_band=${baseline.severityBand}`,
      `forecast_risk=${forecast.projectedRisk}`,
      `retrieval_hits=${similarIncidents.length}`,
      `confidence=${confidence}%`
    ]
  };
}

export function buildScenarioCatalog() {
  return listScenarioSummaries();
}

