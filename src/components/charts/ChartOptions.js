import Chart from "./Chart";

export const goldLineOptions = {
  chart: {
    type: "line",
    background: "transparent",
    foreColor: "#8a8a8a",
    toolbar: { show: false },
    animations: { enabled: true, speed: 800, dynamicAnimation: { enabled: true, speed: 600 } },
  },
  stroke: { curve: "smooth", width: 2, colors: ["#d4af37"] },
  grid: { borderColor: "rgba(255,255,255,0.05)", strokeDashArray: 4, xaxis: { lines: { show: false } } },
  xaxis: { labels: { style: { colors: "#5a5a5a", fontSize: "11px" } }, axisBorder: { show: false }, axisTicks: { show: false } },
  yaxis: { labels: { style: { colors: "#5a5a5a", fontSize: "11px" } } },
  tooltip: { theme: "dark", style: { fontFamily: "Inter" } },
  dataLabels: { enabled: false },
  fill: {
    type: "gradient",
    gradient: { shadeIntensity: 1, opacityFrom: 0.3, opacityTo: 0, stops: [0, 100] },
  },
};

export const emeraldAreaOptions = {
  ...goldLineOptions,
  stroke: { curve: "smooth", width: 2, colors: ["#2ecc71"] },
  fill: {
    type: "gradient",
    gradient: { shadeIntensity: 1, opacityFrom: 0.25, opacityTo: 0, stops: [0, 100] },
  },
};

export const donutOptions = {
  chart: { type: "donut", background: "transparent", foreColor: "#8a8a8a", animations: { enabled: true } },
  labels: [],
  stroke: { width: 0 },
  colors: ["#d4af37", "#2ecc71", "#f39c12", "#e74c3c", "#3498db", "#cfcfcf"],
  legend: { position: "bottom", labels: { colors: "#8a8a8a" }, fontSize: "12px" },
  plotOptions: {
    pie: { donut: { size: "72%", background: "transparent" } },
  },
  dataLabels: { enabled: false },
  tooltip: { theme: "dark" },
};

export default Chart;