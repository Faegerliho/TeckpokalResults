const state = { events: [], year: "" };
const yearFilter = document.querySelector("#year-filter");
const resultsBody = document.querySelector("#results-body");
const emptyState = document.querySelector("#empty-state");
const eventTitle = document.querySelector("#event-title");
const eventMeta = document.querySelector("#event-meta");
const sourceLink = document.querySelector("#source-link");

function currentEvent() {
  return state.events.find((event) => String(event.year) === state.year);
}

function render() {
  const event = currentEvent();
  const results = event?.results || [];

  eventTitle.textContent = event?.title || "Teckpokalfliegen";
  eventMeta.textContent = event ? `${results.length} Pilotinnen und Piloten · Gesamtwertung` : "Noch keine Ergebnisse hinterlegt";
  sourceLink.hidden = !event?.source;
  if (event?.source) sourceLink.href = event.source;

  resultsBody.innerHTML = results.map((result) => `
    <tr>
      <td class="place">${result.place}</td>
      <td class="pilot"><strong>${escapeHtml(result.pilot)}</strong><span>Startnr. ${result.startNumber}</span></td>
      <td>${escapeHtml(result.class)}</td>
      <td class="points">${formatNumber(result.points)}</td>
      <td class="percent">${formatNumber(result.percent)} %</td>
    </tr>
  `).join("");
  emptyState.hidden = results.length > 0;
}

function formatNumber(value) {
  return new Intl.NumberFormat("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
}

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[character]));
}

async function loadResults() {
  try {
    const response = await fetch("./data/results.json");
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    state.events = data.events || [];
    const years = state.events.map((event) => String(event.year)).sort((a, b) => b - a);
    yearFilter.innerHTML = years.map((year) => `<option value="${year}">${year}</option>`).join("");
    state.year = years[0] || "";
    yearFilter.value = state.year;
    yearFilter.addEventListener("change", (event) => { state.year = event.target.value; render(); });
    render();
  } catch (error) {
    eventMeta.textContent = "Ergebnisdaten konnten nicht geladen werden.";
    console.error("Ergebnisdaten konnten nicht geladen werden", error);
  }
}

loadResults();
