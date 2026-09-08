const state = { events: [], year: "", rankingId: "" };
const yearFilter = document.querySelector("#year-filter");
const rankingFilter = document.querySelector("#ranking-filter");
const resultsHeadRow = document.querySelector("#results-head-row");
const resultsBody = document.querySelector("#results-body");
const emptyState = document.querySelector("#empty-state");
const eventMeta = document.querySelector("#event-meta");
const sourceLink = document.querySelector("#source-link");

function currentEvent() {
  return state.events.find((event) => String(event.year) === state.year);
}

function rankingsFor(event) {
  if (Array.isArray(event?.rankings) && event.rankings.length > 0) return event.rankings;
  return event?.results?.length
    ? [{ id: "overall", label: "Gesamtwertung", results: event.results }]
    : [];
}

function currentRanking() {
  return rankingsFor(currentEvent()).find((ranking) => ranking.id === state.rankingId) || rankingsFor(currentEvent())[0];
}

function isTeamRanking(ranking) {
  return ranking?.id === "teams";
}

function renderRankingOptions() {
  const rankings = rankingsFor(currentEvent());
  rankingFilter.innerHTML = rankings
    .map((ranking) => `<option value="${escapeHtml(ranking.id)}">${escapeHtml(ranking.label)}</option>`)
    .join("");
  rankingFilter.disabled = rankings.length === 0;
  state.rankingId = rankings[0]?.id || "";
  rankingFilter.value = state.rankingId;
}

function columnsFor(ranking) {
  const columns = [
    ["place", "Platz"],
    ["pilot", "Pilot"],
    ["startNumber", "Startnr."],
    ["class", "Klasse"],
    ["team", "Mannschaft"],
    ["special", "Sonderwertung"],
    ["points", "Punkte"],
    ["percent", "%"],
  ];
  if (isTeamRanking(ranking)) columns.push(["teamTotal", "Mannschaft ges."]);
  return columns;
}

function renderTable(ranking, results) {
  const columns = columnsFor(ranking);
  resultsHeadRow.innerHTML = columns
    .map(([key, label]) => `<th scope="col" class="${isNumericColumn(key) ? "numeric" : ""}">${label}</th>`)
    .join("");
  resultsBody.innerHTML = results.map((result) => `
    <tr>
      ${columns.map(([key]) => `<td class="${key}${isNumericColumn(key) ? " numeric" : ""}">${formatCell(key, result)}</td>`).join("")}
    </tr>
  `).join("");
}

function isNumericColumn(key) {
  return ["place", "startNumber", "points", "percent", "teamTotal"].includes(key);
}

function formatCell(key, result) {
  if (key === "pilot") return `<strong>${escapeHtml(result.pilot || "–")}</strong>`;
  if (key === "team") return escapeHtml(result.team || "–");
  if (key === "special") return escapeHtml(result.special || "–");
  if (key === "percent") return result.percent == null ? "–" : `${formatNumber(result.percent)} %`;
  if (key === "teamTotal") {
    if (result.teamPoints == null) return "–";
    return `${formatNumber(result.teamPoints)} <span class="team-percent">· ${formatNumber(result.teamPercent)} %</span>`;
  }
  if (key === "points") return result.points == null ? "–" : formatNumber(result.points);
  return escapeHtml(result[key] ?? "–");
}

function render() {
  const event = currentEvent();
  const ranking = currentRanking();
  const results = ranking?.results || [];
  eventMeta.textContent = event && ranking
    ? `${event.title} · ${ranking.label} · ${results.length} Einträge`
    : "Noch keine Ergebnisse hinterlegt";
  const source = event?.source;
  sourceLink.hidden = !source;
  if (source) sourceLink.href = source;
  renderTable(ranking, results);
  emptyState.hidden = results.length > 0;
}

function formatNumber(value) {
  return new Intl.NumberFormat("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
}

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;",
  }[character]));
}

function selectYear(year) {
  state.year = String(year);
  yearFilter.value = state.year;
  renderRankingOptions();
  render();
}

async function loadResults() {
  try {
    const response = await fetch("./data/results.json");
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    state.events = [...(data.events || [])].sort((a, b) => Number(b.year) - Number(a.year));
    yearFilter.innerHTML = state.events
      .map((event) => `<option value="${event.year}">${event.year}</option>`)
      .join("");
    const latestWithResults = state.events.find((event) => rankingsFor(event).some((ranking) => ranking.results?.length));
    selectYear((latestWithResults || state.events[0])?.year || "");
  } catch (error) {
    eventMeta.textContent = "Ergebnisdaten konnten nicht geladen werden.";
    console.error("Ergebnisdaten konnten nicht geladen werden", error);
  }
}

yearFilter.addEventListener("change", (event) => selectYear(event.target.value));
rankingFilter.addEventListener("change", (event) => {
  state.rankingId = event.target.value;
  render();
});

loadResults();
