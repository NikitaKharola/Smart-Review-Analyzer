import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function ThemeChart({ data }) {
  const chartData = data || [];

  return (
    <div
      className="
      bg-white
      dark:bg-slate-800
      p-6
      rounded-2xl
      shadow-lg
      border
      border-slate-100
      dark:border-slate-700
      transition-colors
      duration-300
      "
    >
      <h2 className="text-2xl font-bold mb-4 text-slate-800 dark:text-white">
        Theme Distribution
      </h2>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <XAxis dataKey="theme" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="count" fill="#2563eb" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default ThemeChart;