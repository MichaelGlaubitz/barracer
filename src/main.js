const canvas = document.querySelector("#chart");
const context = canvas.getContext("2d");
const yearElement = document.querySelector("#year");
const leaderElement = document.querySelector("#leader");
const sourceElement = document.querySelector("#source");
const statusElement = document.querySelector("#status");
const datasetDialog = document.querySelector("#datasetDialog");
const datasetForm = document.querySelector("#datasetForm");
const datasetSelect = document.querySelector("#datasetSelect");
const datasetDescription = document.querySelector("#datasetDescription");
const dataPrompt = document.querySelector("#dataPrompt");
const startYearInput = document.querySelector("#startYear");
const endYearInput = document.querySelector("#endYear");
const topCountInput = document.querySelector("#topCount");
const cancelDialogButton = document.querySelector("#cancelDialog");
const openDialogButton = document.querySelector("#openDialog");
const playToggle = document.querySelector("#playToggle");
const resetButton = document.querySelector("#resetButton");

const countries = [
  { code: "USA", name: "United States" },
  { code: "CHN", name: "China" },
  { code: "JPN", name: "Japan" },
  { code: "DEU", name: "Germany" },
  { code: "IND", name: "India" },
  { code: "GBR", name: "United Kingdom" },
  { code: "FRA", name: "France" },
  { code: "ITA", name: "Italy" },
  { code: "BRA", name: "Brazil" },
  { code: "CAN", name: "Canada" },
  { code: "KOR", name: "South Korea" },
  { code: "AUS", name: "Australia" },
  { code: "ESP", name: "Spain" },
  { code: "MEX", name: "Mexico" },
  { code: "IDN", name: "Indonesia" },
];

const datasetCatalog = [
  {
    label: "GDP",
    provider: "worldBank",
    indicator: "NY.GDP.MKTP.CD",
    description: "Bruttoinlandsprodukt nach Laendern in aktuellen US-Dollar.",
    unit: "USD",
    scale: 1_000_000_000_000,
    suffix: "T",
    keywords: ["gdp", "bip", "wirtschaft", "gross domestic", "bruttoinlandsprodukt"],
  },
  {
    label: "Population",
    provider: "worldBank",
    indicator: "SP.POP.TOTL",
    description: "Gesamtbevoelkerung nach Laendern.",
    unit: "people",
    scale: 1_000_000,
    suffix: "M",
    keywords: ["population", "bevoelkerung", "einwohner", "menschen"],
  },
  {
    label: "CO2 emissions",
    provider: "worldBank",
    indicator: "EN.ATM.CO2E.KT",
    description: "CO2-Emissionen nach Laendern in Kilotonnen.",
    unit: "kt",
    scale: 1_000,
    suffix: "M kt",
    keywords: ["co2", "emission", "klima", "carbon"],
  },
  {
    label: "Internet users",
    provider: "worldBank",
    indicator: "IT.NET.USER.ZS",
    description: "Anteil der Internetnutzer an der Bevoelkerung.",
    unit: "%",
    scale: 1,
    suffix: "%",
    keywords: ["internet", "online", "web", "nutzer"],
  },
  {
    label: "Electric power use",
    provider: "worldBank",
    indicator: "EG.USE.ELEC.KH.PC",
    description: "Stromverbrauch pro Kopf in Kilowattstunden.",
    unit: "kWh/person",
    scale: 1,
    suffix: "kWh/person",
    keywords: ["strom", "electric", "power", "energie"],
  },
  {
    label: "Most expensive football transfers",
    provider: "staticTransfers",
    indicator: "FOOTBALL.TRANSFERS.EUR",
    description: "Teuerste Fussballtransfers aller Zeiten, als Ranking bis zum jeweiligen Jahr.",
    unit: "EUR million",
    scale: 1,
    suffix: "M EUR",
    defaultStart: 2000,
    defaultEnd: 2025,
    keywords: ["fussball", "football", "transfer", "spieler", "teuerste"],
  },
];

const footballTransferData = [
  { player: "Neymar", from: "Barcelona", to: "Paris Saint-Germain", year: 2017, fee: 222 },
  { player: "Kylian Mbappe", from: "Monaco", to: "Paris Saint-Germain", year: 2018, fee: 180 },
  { player: "Philippe Coutinho", from: "Liverpool", to: "Barcelona", year: 2018, fee: 145 },
  { player: "Ousmane Dembele", from: "Borussia Dortmund", to: "Barcelona", year: 2017, fee: 135 },
  { player: "Enzo Fernandez", from: "Benfica", to: "Chelsea", year: 2023, fee: 121 },
  { player: "Joao Felix", from: "Benfica", to: "Atletico Madrid", year: 2019, fee: 120 },
  { player: "Antoine Griezmann", from: "Atletico Madrid", to: "Barcelona", year: 2019, fee: 120 },
  { player: "Philippe Coutinho", from: "Liverpool", to: "Barcelona", year: 2018, fee: 118.4 },
  { player: "Jack Grealish", from: "Aston Villa", to: "Manchester City", year: 2021, fee: 117.7 },
  { player: "Florian Wirtz", from: "Bayer Leverkusen", to: "Liverpool", year: 2025, fee: 117.5 },
  { player: "Declan Rice", from: "West Ham United", to: "Arsenal", year: 2023, fee: 116.5 },
  { player: "Moises Caicedo", from: "Brighton & Hove Albion", to: "Chelsea", year: 2023, fee: 116.3 },
  { player: "Romelu Lukaku", from: "Inter Milan", to: "Chelsea", year: 2021, fee: 115 },
  { player: "Paul Pogba", from: "Juventus", to: "Manchester United", year: 2016, fee: 105 },
  { player: "Jude Bellingham", from: "Borussia Dortmund", to: "Real Madrid", year: 2023, fee: 103 },
  { player: "Eden Hazard", from: "Chelsea", to: "Real Madrid", year: 2019, fee: 100 },
  { player: "Cristiano Ronaldo", from: "Real Madrid", to: "Juventus", year: 2018, fee: 100 },
  { player: "Harry Kane", from: "Tottenham Hotspur", to: "Bayern Munich", year: 2023, fee: 100 },
  { player: "Gareth Bale", from: "Tottenham Hotspur", to: "Real Madrid", year: 2013, fee: 100 },
  { player: "Antony", from: "Ajax", to: "Manchester United", year: 2022, fee: 95 },
  { player: "Cristiano Ronaldo", from: "Manchester United", to: "Real Madrid", year: 2009, fee: 94 },
  { player: "Randal Kolo Muani", from: "Eintracht Frankfurt", to: "Paris Saint-Germain", year: 2023, fee: 90 },
  { player: "Gonzalo Higuain", from: "Napoli", to: "Juventus", year: 2016, fee: 90 },
  { player: "Harry Maguire", from: "Leicester City", to: "Manchester United", year: 2019, fee: 86.6 },
];

async function fetchFootballTransferData() {
  const url = new URL("https://en.wikipedia.org/w/api.php");
  url.searchParams.set("action", "parse");
  url.searchParams.set("page", "List_of_most_expensive_association_football_transfers");
  url.searchParams.set("prop", "text");
  url.searchParams.set("format", "json");
  url.searchParams.set("origin", "*");

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Wikipedia request failed with ${response.status}`);
    }

    const payload = await response.json();
    const html = payload.parse?.text?.["*"];
    if (!html) {
      throw new Error("Wikipedia response did not include page HTML.");
    }

    const documentFragment = new DOMParser().parseFromString(html, "text/html");
    const table = documentFragment.querySelector("table.wikitable");
    const rows = [...table.querySelectorAll("tr")].slice(1);
    const transfers = rows
      .map((row) => {
        const cells = [...row.querySelectorAll("th, td")].map((cell) =>
          cell.textContent.replace(/\[[^\]]+\]/g, "").replace(/\s+/g, " ").trim(),
        );

        if (cells.length < 8) return null;

        const fee = Number(cells[5].match(/[\d.]+/)?.[0]);
        const year = Number(cells[7].match(/\d{4}/)?.[0]);
        const player = cells[1].replace(/\s*\(\d+\)\s*$/, "");

        if (!player || !Number.isFinite(fee) || !Number.isFinite(year)) return null;

        return {
          player,
          from: cells[2],
          to: cells[3],
          year,
          fee,
        };
      })
      .filter(Boolean);

    if (transfers.length < 8) {
      throw new Error("Wikipedia table parser returned too few rows.");
    }

    return transfers;
  } catch (error) {
    console.warn("Using bundled football transfer fallback data.", error);
    return footballTransferData;
  }
}

const palette = [
  "#e84c3d",
  "#3a7bd5",
  "#57a0d3",
  "#f2c94c",
  "#9b59b6",
  "#2ecc71",
  "#f2994a",
  "#b8c1cc",
  "#ff7aa2",
  "#50c8c8",
];

function getColorForLabel(label) {
  let hash = 0;

  for (let index = 0; index < label.length; index += 1) {
    hash = (hash * 31 + label.charCodeAt(index)) % 997;
  }

  return palette[hash % palette.length];
}

let frames = [];
let activeDataset = datasetCatalog[0];
let sourceLabel = "World Bank Open Data";
let topCount = 8;
let playing = true;
let timeline = 0;
let lastTime = performance.now();
let secondsPerFrame = 1.45;
const barLayout = new Map();

function getSelectedDataset() {
  return (
    datasetCatalog.find((dataset) => dataset.indicator === datasetSelect.value) ||
    datasetCatalog[0]
  );
}

function syncDatasetDescription() {
  const dataset = getSelectedDataset();
  const source =
    dataset.provider === "worldBank"
      ? `World Bank (${dataset.indicator})`
      : "Wikipedia list of most expensive association football transfers";

  datasetDescription.textContent = `${dataset.description} Quelle: ${source}.`;
}

function populateDatasetSelect() {
  datasetSelect.replaceChildren(
    ...datasetCatalog.map((dataset) => {
      const option = document.createElement("option");
      option.value = dataset.indicator;
      option.textContent = dataset.label;
      return option;
    }),
  );
  datasetSelect.value = datasetCatalog[0].indicator;
  syncDatasetDescription();
}

function applyDatasetDefaults() {
  const dataset = getSelectedDataset();
  if (dataset.defaultStart) {
    startYearInput.value = dataset.defaultStart;
  }
  if (dataset.defaultEnd) {
    endYearInput.value = dataset.defaultEnd;
  }
}

function setStatus(message, isError = false) {
  statusElement.textContent = message;
  statusElement.dataset.state = isError ? "error" : "ready";
}

function formatValue(value, dataset = activeDataset) {
  if (!Number.isFinite(value)) return "n/a";
  const scaled = value / dataset.scale;

  if (dataset.suffix === "%") {
    return `${scaled.toFixed(1)}%`;
  }

  if (Math.abs(scaled) >= 100) {
    return `${scaled.toFixed(0)} ${dataset.suffix}`;
  }

  if (Math.abs(scaled) >= 10) {
    return `${scaled.toFixed(1)} ${dataset.suffix}`;
  }

  return `${scaled.toFixed(2)} ${dataset.suffix}`;
}

function normalizeYear(value, fallback) {
  const year = Number(value);
  return Number.isFinite(year) ? year : fallback;
}

function clampPeriod(requestedStart, requestedEnd, availableYears) {
  const minYear = Math.min(...availableYears);
  const maxYear = Math.max(...availableYears);
  const start = Math.max(Math.min(requestedStart, requestedEnd), minYear);
  const end = Math.min(Math.max(requestedStart, requestedEnd), maxYear);

  if (end - start < 2) {
    return {
      start: Math.max(minYear, maxYear - 5),
      end: maxYear,
      adjusted: true,
    };
  }

  return {
    start,
    end,
    adjusted: start !== requestedStart || end !== requestedEnd,
  };
}

async function fetchWorldBankSeries(dataset, requestedStart, requestedEnd) {
  const countryCodes = countries.map((country) => country.code).join(";");
  const url = new URL(
    `https://api.worldbank.org/v2/country/${countryCodes}/indicator/${dataset.indicator}`,
  );
  url.searchParams.set("format", "json");
  url.searchParams.set("per_page", "20000");
  url.searchParams.set("date", `${requestedStart - 6}:${requestedEnd + 1}`);

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`World Bank request failed with ${response.status}`);
  }

  const [, rows] = await response.json();
  const valuesByYear = new Map();
  const countryNames = new Map(countries.map((country) => [country.code, country.name]));

  rows
    .filter((row) => row.value !== null && countryNames.has(row.countryiso3code))
    .forEach((row) => {
      const year = Number(row.date);
      if (!valuesByYear.has(year)) {
        valuesByYear.set(year, {});
      }

      valuesByYear.get(year)[countryNames.get(row.countryiso3code)] = row.value;
    });

  const availableYears = [...valuesByYear.keys()].filter(
    (year) => Object.keys(valuesByYear.get(year)).length >= 4,
  );

  if (availableYears.length < 2) {
    throw new Error("Not enough data points returned for this request.");
  }

  const period = clampPeriod(requestedStart, requestedEnd, availableYears);
  const preparedFrames = [];

  for (let year = period.start; year <= period.end; year += 1) {
    const values = valuesByYear.get(year);
    if (values && Object.keys(values).length >= 4) {
      preparedFrames.push({ year, values });
    }
  }

  if (preparedFrames.length < 2) {
    throw new Error("The adjusted period still has too little comparable data.");
  }

  return {
    frames: preparedFrames.sort((a, b) => a.year - b.year),
    adjusted: period.adjusted,
    period,
  };
}

async function buildTransferFrames(dataset, requestedStart, requestedEnd) {
  const transfers = await fetchFootballTransferData();
  const availableYears = transfers.map((transfer) => transfer.year);
  const period = clampPeriod(requestedStart, requestedEnd, availableYears);
  const preparedFrames = [];

  for (let year = period.start; year <= period.end; year += 1) {
    const values = {};

    transfers
      .filter((transfer) => transfer.year <= year)
      .forEach((transfer) => {
        values[transfer.player] = Math.max(values[transfer.player] || 0, transfer.fee);
      });

    if (Object.keys(values).length >= 2) {
      preparedFrames.push({ year, values });
    }
  }

  if (preparedFrames.length < 2) {
    throw new Error("Not enough transfer records in the selected period.");
  }

  return {
    frames: preparedFrames,
    adjusted: period.adjusted,
    period,
  };
}

async function fetchDatasetSeries(dataset, requestedStart, requestedEnd) {
  if (dataset.provider === "staticTransfers") {
    return buildTransferFrames(dataset, requestedStart, requestedEnd);
  }

  return fetchWorldBankSeries(dataset, requestedStart, requestedEnd);
}

function getCurrentFrame() {
  if (frames.length === 1) {
    return {
      year: frames[0].year,
      rows: Object.entries(frames[0].values)
        .map(([label, value]) => ({ label, value }))
        .sort((a, b) => b.value - a.value),
    };
  }

  const segment = Math.min(Math.floor(timeline), frames.length - 2);
  const progress = timeline - segment;
  const current = frames[segment];
  const next = frames[segment + 1];
  const labels = new Set([...Object.keys(current.values), ...Object.keys(next.values)]);

  return {
    year: Math.round(current.year + (next.year - current.year) * progress),
    rows: [...labels]
      .map((label) => ({
        label,
        value:
          (current.values[label] ?? next.values[label] ?? 0) +
          ((next.values[label] ?? current.values[label] ?? 0) -
            (current.values[label] ?? next.values[label] ?? 0)) *
            progress,
      }))
      .sort((a, b) => b.value - a.value),
  };
}

function drawRoundedRect(x, y, width, height, radius) {
  const right = x + width;
  const bottom = y + height;

  context.beginPath();
  context.moveTo(x + radius, y);
  context.lineTo(right - radius, y);
  context.quadraticCurveTo(right, y, right, y + radius);
  context.lineTo(right, bottom - radius);
  context.quadraticCurveTo(right, bottom, right - radius, bottom);
  context.lineTo(x + radius, bottom);
  context.quadraticCurveTo(x, bottom, x, bottom - radius);
  context.lineTo(x, y + radius);
  context.quadraticCurveTo(x, y, x + radius, y);
  context.closePath();
  context.fill();
}

function renderEmptyState() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "#0e1117";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "#f5f7fa";
  context.font = "700 34px system-ui";
  context.textAlign = "center";
  context.fillText("Waehle ein Thema aus", canvas.width / 2, canvas.height / 2 - 12);
  context.fillStyle = "#a8b0bc";
  context.font = "18px system-ui";
  context.fillText("Die App laedt danach passende Open-Data-Zeitreihen.", canvas.width / 2, canvas.height / 2 + 28);
}

function render() {
  if (!frames.length) {
    renderEmptyState();
    return;
  }

  const { year, rows } = getCurrentFrame();
  const topRows = rows.slice(0, topCount);
  const maxValue = Math.max(...topRows.map((row) => row.value), 1);
  const margin = { top: 54, right: 132, bottom: 48, left: 178 };
  const rowGap = 12;
  const rowHeight =
    (canvas.height - margin.top - margin.bottom - rowGap * (topRows.length - 1)) /
    topRows.length;
  const chartWidth = canvas.width - margin.left - margin.right;
  const visibleLabels = new Set(topRows.map((row) => row.label));

  yearElement.textContent = year;
  leaderElement.textContent = `${topRows[0].label} ${formatValue(topRows[0].value)}`;
  sourceElement.textContent = sourceLabel;

  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "#0e1117";
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.fillStyle = "rgba(245, 247, 250, 0.07)";
  context.font = "700 144px system-ui";
  context.textAlign = "right";
  context.fillText(String(year), canvas.width - 48, canvas.height - 44);

  context.font = "600 17px system-ui";
  context.textAlign = "right";

  topRows.forEach((row, rank) => {
    const targetY = margin.top + rank * (rowHeight + rowGap);
    const currentY = barLayout.has(row.label) ? barLayout.get(row.label) : targetY;
    const y = currentY + (targetY - currentY) * 0.18;
    const barWidth = Math.max((row.value / maxValue) * chartWidth, 2);

    barLayout.set(row.label, y);

    context.fillStyle = "#dce3ea";
    context.fillText(row.label, margin.left - 18, y + rowHeight * 0.64);

    context.fillStyle = getColorForLabel(row.label);
    drawRoundedRect(margin.left, y, barWidth, rowHeight, 8);

    context.fillStyle = "#f5f7fa";
    context.textAlign = "left";
    context.fillText(formatValue(row.value), margin.left + barWidth + 14, y + rowHeight * 0.64);
    context.textAlign = "right";
  });

  [...barLayout.keys()].forEach((label) => {
    if (!visibleLabels.has(label)) {
      barLayout.delete(label);
    }
  });
}

function resetTimeline() {
  timeline = 0;
  lastTime = performance.now();
  barLayout.clear();
}

function applyPromptHints(prompt, start, end) {
  const normalized = prompt.toLowerCase();
  const latestCompleteYear = new Date().getFullYear() - 1;

  if (normalized.includes("lang") || normalized.includes("max")) {
    return { start: Math.min(start, 1990), end: Math.max(end, latestCompleteYear) };
  }

  if (normalized.includes("all") || normalized.includes("aller zeiten")) {
    return { start: 2000, end: Math.max(end, latestCompleteYear) };
  }

  if (normalized.includes("kurz") || normalized.includes("aktuell")) {
    return { start: Math.max(start, latestCompleteYear - 6), end: Math.max(end, latestCompleteYear) };
  }

  return { start, end };
}

async function loadDatasetFromForm() {
  const prompt = dataPrompt.value.trim();
  const dataset = getSelectedDataset();
  const requestedPeriod = applyPromptHints(
    prompt,
    normalizeYear(startYearInput.value, 2014),
    normalizeYear(endYearInput.value, new Date().getFullYear() - 1),
  );
  const requestedTopCount = Number(topCountInput.value);

  topCount = Number.isFinite(requestedTopCount)
    ? Math.max(4, Math.min(10, requestedTopCount))
    : 8;
  activeDataset = dataset;
  sourceLabel =
    dataset.provider === "worldBank"
      ? `World Bank Open Data: ${dataset.label}`
      : "Wikipedia: most expensive transfers";
  setStatus(`Lade ${dataset.label} ...`);

  const result = await fetchDatasetSeries(dataset, requestedPeriod.start, requestedPeriod.end);
  frames = result.frames;
  secondsPerFrame = frames.length > 12 ? 0.92 : 1.35;
  resetTimeline();
  playing = true;
  playToggle.textContent = "Pause";

  const periodText = `${frames[0].year}-${frames[frames.length - 1].year}`;
  const adjustment = result.adjusted ? " Zeitraum automatisch angepasst." : "";
  setStatus(`${dataset.label} geladen (${periodText}).${adjustment}`);
  datasetDialog.close();
}

function update(delta) {
  if (!playing || frames.length < 2) return;

  timeline += delta / secondsPerFrame;
  if (timeline >= frames.length - 1) {
    timeline = 0;
  }
}

function loop(now) {
  const delta = Math.min((now - lastTime) / 1000, 0.05);
  lastTime = now;

  update(delta);
  render();
  requestAnimationFrame(loop);
}

openDialogButton.addEventListener("click", () => {
  datasetDialog.showModal();
});

datasetSelect.addEventListener("change", () => {
  syncDatasetDescription();
  applyDatasetDefaults();
});

cancelDialogButton.addEventListener("click", () => {
  datasetDialog.close();
});

datasetForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  try {
    await loadDatasetFromForm();
  } catch (error) {
    setStatus(
      "Die Daten konnten nicht geladen werden. Waehle einen Datensatz aus dem Dropdown und pruefe den Zeitraum.",
      true,
    );
    console.error(error);
  }
});

playToggle.addEventListener("click", () => {
  playing = !playing;
  playToggle.textContent = playing ? "Pause" : "Play";
});

resetButton.addEventListener("click", () => {
  resetTimeline();
  playing = true;
  playToggle.textContent = "Pause";
});

datasetDialog.addEventListener("click", (event) => {
  if (event.target === datasetDialog) {
    datasetDialog.close();
  }
});

populateDatasetSelect();
datasetDialog.showModal();
render();
requestAnimationFrame(loop);
