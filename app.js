const state = { events: [], year: "all", className: "all", search: "" };
const yearFilter = document.querySelector("#year-filter");
const searchInput = document.querySelector("#pilot-search");
const resultsBody = document.querySelector("#results-body");
const emptyState = document.querySelector("#empty-state");
const lastUpdated = document.querySelector("#last-updated");

const allResults = () => state.events.flatMap((event) => (event.results || []).map((result) => ({ ...result, year: event.year })));

function render() {
  const query = state.search.trim().toLocaleLowerCase("de-DE");
  const results = allResults().filter((result) => {
    const matchesYear = state.year === "all" || String(result.year) === state.year;
    const matchesClass = state.className === "all" || result.class === state.className;
    const haystack = `${result.pilot} ${result.club || ""} ${result.class}`.toLocaleLowerCase("de-DE");
    return matchesYear && matchesClass && (!query || haystack.includes(query));
  });

  resultsBody.innerHTML = results.map((result) => `
    <tr><td>${result.place ?? "–"}</td><td>${escapeHtml(result.pilot)}</td><td>${escapeHtml(result.class)}</td><td>${escapeHtml(result.club || "–")}</td><td>${result.points ?? "–"}</td></tr>
  `).join("");
  emptyState.hidden = results.length > 0;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[character]));
}

function bindFilters() {
  yearFilter.addEventListener("change", (event) => { state.year = event.target.value; render(); });
  searchInput.addEventListener("input", (event) => { state.search = event.target.value; render(); });
  document.querySelectorAll(".class-tab").forEach((tab) => tab.addEventListener("click", () => {
    state.className = tab.dataset.class;
    document.querySelectorAll(".class-tab").forEach((item) => { item.classList.toggle("is-active", item === tab); item.setAttribute("aria-selected", item === tab ? "true" : "false"); });
    render();
  }));
}

async function loadResults() {
  try {
    const response = await fetch("./data/results.json");
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    state.events = data.events || [];
    const years = [...new Set(state.events.map((event) => event.year))].sort((a, b) => b - a);
    yearFilter.insertAdjacentHTML("beforeend", years.map((year) => `<option value="${year}">${year}</option>`).join(""));
    lastUpdated.textContent = data.updatedAt ? `Stand: ${new Intl.DateTimeFormat("de-DE").format(new Date(data.updatedAt))}` : "Ergebnisarchiv";
  } catch (error) {
    lastUpdated.textContent = "Ergebnisarchiv";
    console.error("Ergebnisdaten konnten nicht geladen werden", error);
  }
  render();
}

bindFilters();
loadResults();
