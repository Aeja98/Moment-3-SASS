import Chart from "chart.js/auto";

//Single row from dataset
/**
 * @typedef {Object} AdmissionItem
 * @property {"Kurs"|"Program"} type
 * @property {string} name
 * @property {string} applicantsFirstHand
 * @property {string} applicantsTotal
 */

//Convert a number-like string to real number - trim spaces, return 0 if value isnt a num
/**
 * @param {string} value
 * @returns {number}
 */
function toNumber(value) {
  const n = Number(String(value).trim());
  return Number.isFinite(n) ? n : 0;
}

//Fetch statistics from JSON file - used as data source for both charts
/**
 * @returns {Promise<AdmissionItem[]>}
 */
async function fetchAdmissionData() {
  const res = await fetch("/data/ht2025.json");
  if (!res.ok) throw new Error(`Failed to fetch ht2025.json: ${res.status}`);
  return res.json();
}

//Filter dataset by type, sort by applicantsTotal - return top N rows
/**
 * @param {AdmissionItem[]} data
 * @param {"Kurs"|"Program"} type
 * @param {number} count
 * @returns {Array<{name: string, total: number}>}
 */
function topByTotal(data, type, count) {
  return data
    .filter((x) => x.type === type)
    .map((x) => ({ name: x.name, total: toNumber(x.applicantsTotal) }))
    .sort((a, b) => b.total - a.total)
    .slice(0, count);
}
//Gets text color from theme
function getChartTextColor() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "#edfffa" // dark theme text
    : "#0a4a3f"; // light theme text
};

//Initialize diagram page - render both charts
/**
 * @returns {Promise<void>}
 */

export async function initChartsPage() {
  //Get canvases from page - if on a different page do nothing
  const coursesCanvas = document.getElementById("coursesChart");
  const programsCanvas = document.getElementById("programsChart");
  if (!coursesCanvas || !programsCanvas) return;

  //Decides text color
  const textColor = getChartTextColor();

  // ---- GLOBAL DEFAULTS ----
  Chart.defaults.color = textColor;
  Chart.defaults.font.family = getComputedStyle(document.body).fontFamily;

  Chart.defaults.plugins.legend.labels.color = textColor;

  Chart.defaults.plugins.tooltip.titleColor = textColor;
  Chart.defaults.plugins.tooltip.bodyColor = textColor;

  //Fetch full dataset
  const data = await fetchAdmissionData();

  //Grab specific subsets
  const topCourses = topByTotal(data, "Kurs", 6);
  const topPrograms = topByTotal(data, "Program", 5);

//Bar chart 
  new Chart(coursesCanvas, {
    type: "bar",
    data: {
      labels: topCourses.map((x) => x.name),
      datasets: [
        {
          label: "Totalt antal sökande",
          data: topCourses.map((x) => x.total),
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: true,
          labels: {color: textColor},
        },
        tooltip: {enabled: true},
      },
      scales: {
        x: {
          ticks: {
            color: textColor,
            maxRotation: 60,
            minRotation: 20,
          },
        },
        y: {
          beginAtZero: true,
          ticks: {
            color: textColor,
          },
        },
      },
    },
  });

  //Pie chart
  new Chart(programsCanvas, {
    type: "pie",
    data: {
      labels: topPrograms.map((x) => x.name),
      datasets: [
        {
          label: "Totalt antal sökande",
          data: topPrograms.map((x) => x.total),
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "bottom",
          labels: {color: textColor},
        },
      },
    },
  });
}