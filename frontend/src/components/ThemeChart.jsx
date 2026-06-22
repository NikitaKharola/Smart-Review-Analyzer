import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { theme: "Cleanliness", count: 18 },
  { theme: "Food", count: 12 },
  { theme: "Host", count: 10 },
  { theme: "Location", count: 8 },
  { theme: "Value", count: 6 },
  { theme: "Experience", count: 6 },
];

function ThemeChart() {
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
        <BarChart data={data}>
          <XAxis dataKey="theme" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" fill="#2563eb" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default ThemeChart;