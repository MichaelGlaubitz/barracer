const canvas = document.querySelector("#chart");
const context = canvas.getContext("2d");
const yearElement = document.querySelector("#year");
const leaderElement = document.querySelector("#leader");
const playToggle = document.querySelector("#playToggle");
const resetButton = document.querySelector("#resetButton");

const frames = [
  {
    year: 2019,
    values: {
      Toyota: 10.2,
      Volkswagen: 9.4,
      Ford: 6.1,
      Honda: 5.8,
      Nissan: 5.1,
      Hyundai: 4.7,
      BMW: 3.0,
      Mercedes: 2.8,
    },
  },
  {
    year: 2020,
    values: {
      Toyota: 10.8,
      Volkswagen: 8.9,
      Ford: 5.6,
      Honda: 5.4,
      Nissan: 4.8,
      Hyundai: 5.0,
      BMW: 3.2,
      Mercedes: 2.9,
    },
  },
  {
    year: 2021,
    values: {
      Toyota: 11.4,
      Volkswagen: 8.6,
      Ford: 5.2,
      Honda: 5.0,
      Nissan: 4.6,
      Hyundai: 5.4,
      BMW: 3.4,
      Mercedes: 3.1,
    },
  },
  {
    year: 2022,
    values: {
      Toyota: 11.7,
      Volkswagen: 8.1,
      Ford: 5.0,
      Honda: 4.8,
      Nissan: 4.3,
      Hyundai: 5.8,
      BMW: 3.5,
      Mercedes: 3.2,
    },
  },
  {
    year: 2023,
    values: {
      Toyota: 12.0,
      Volkswagen: 7.9,
      Ford: 4.8,
      Honda: 4.7,
      Nissan: 4.1,
      Hyundai: 6.0,
      BMW: 3.7,
      Mercedes: 3.4,
    },
  },
  {
    year: 2024,
    values: {
      Toyota: 12.3,
      Volkswagen: 7.7,
      Ford: 4.6,
      Honda: 4.8,
      Nissan: 4.0,
      Hyundai: 6.3,
      BMW: 3.9,
      Mercedes: 3.5,
    },
  },
];

const colors = {
  Toyota: "#e84c3d",
  Volkswagen: "#3a7bd5",
  Ford: "#57a0d3",
  Honda: "#f2c94c",
  Nissan: "#9b59b6",
  Hyundai: "#2ecc71",
  BMW: "#f2994a",
  Mercedes: "#b8c1cc",
};

let playing = true;
let timeline = 0;
let lastTime = performance.now();
const secondsPerFrame = 1.6;

function interpolate(start, end, progress) {
  return start + (end - start) * progress;
}

function getCurrentFrame() {
  const segment = Math.min(Math.floor(timeline), frames.length - 2);
  const progress = timeline - segment;
  const current = frames[segment];
  const next = frames[segment + 1];
  const labels = Object.keys(current.values);

  return {
    year: Math.round(interpolate(current.year, next.year, progress)),
    rows: labels
      .map((label) => ({
        label,
        value: interpolate(current.values[label], next.values[label], progress),
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

function render() {
  const { year, rows } = getCurrentFrame();
  const topRows = rows.slice(0, 8);
  const maxValue = Math.max(...topRows.map((row) => row.value));
  const margin = { top: 54, right: 112, bottom: 48, left: 158 };
  const rowGap = 13;
  const rowHeight =
    (canvas.height - margin.top - margin.bottom - rowGap * (topRows.length - 1)) /
    topRows.length;
  const chartWidth = canvas.width - margin.left - margin.right;

  yearElement.textContent = year;
  leaderElement.textContent = `${topRows[0].label} ${topRows[0].value.toFixed(1)}%`;

  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "#0e1117";
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.fillStyle = "rgba(245, 247, 250, 0.07)";
  context.font = "700 144px system-ui";
  context.textAlign = "right";
  context.fillText(String(year), canvas.width - 48, canvas.height - 44);

  context.font = "600 18px system-ui";
  context.textAlign = "right";
  context.fillStyle = "#f5f7fa";

  topRows.forEach((row, index) => {
    const y = margin.top + index * (rowHeight + rowGap);
    const barWidth = (row.value / maxValue) * chartWidth;

    context.fillStyle = "#dce3ea";
    context.fillText(row.label, margin.left - 18, y + rowHeight * 0.64);

    context.fillStyle = colors[row.label] || "#42d392";
    drawRoundedRect(margin.left, y, barWidth, rowHeight, 8);

    context.fillStyle = "#f5f7fa";
    context.textAlign = "left";
    context.fillText(`${row.value.toFixed(1)}%`, margin.left + barWidth + 14, y + rowHeight * 0.64);
    context.textAlign = "right";
  });
}

function update(delta) {
  if (!playing) return;

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

playToggle.addEventListener("click", () => {
  playing = !playing;
  playToggle.textContent = playing ? "Pause" : "Play";
});

resetButton.addEventListener("click", () => {
  timeline = 0;
  playing = true;
  playToggle.textContent = "Pause";
});

render();
requestAnimationFrame(loop);
