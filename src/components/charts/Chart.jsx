import { lazy, Suspense } from "react";

// react-apexcharts (and the apexcharts core it pulls in) is a large
// dependency. Loading it via React.lazy splits it into its own chunk that
// the browser fetches once and caches — instead of it being duplicated
// inside every page chunk that happens to render a chart.
const ApexChart = lazy(() => import("react-apexcharts"));

function ChartFallback({ height }) {
  return (
    <div
      style={{
        height,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "var(--muted)",
        fontSize: "0.8rem",
      }}
    >
      Loading chart…
    </div>
  );
}

export default function ChartWrapper({ options, series, type, height = 300 }) {
  return (
    <Suspense fallback={<ChartFallback height={height} />}>
      <ApexChart options={options} series={series} type={type} height={height} />
    </Suspense>
  );
}