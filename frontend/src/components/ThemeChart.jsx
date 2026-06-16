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
    <div className="bg-white p-6 rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold mb-4">
        Theme Distribution
      </h2>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis dataKey="theme" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default ThemeChart;