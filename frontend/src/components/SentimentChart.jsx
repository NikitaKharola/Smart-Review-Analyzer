import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const COLORS = { Positive: "#22c55e", Neutral: "#f59e0b", Negative: "#ef4444" };

function SentimentChart({ data }) {
  // Falls back to a small demo shape only if no data was passed in,
  // so the component never crashes while stats are still loading.
  const chartData = data || [
    { name: "Positive", value: 0 },
    { name: "Neutral", value: 0 },
    { name: "Negative", value: 0 },
  ];

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
        Guest Sentiment Overview
      </h2>

      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            outerRadius={100}
            dataKey="value"
            label
          >
            {chartData.map((entry, index) => (
              <Cell
                key={index}
                fill={COLORS[entry.name] || "#94a3b8"}
              />
            ))}
          </Pie>

          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default SentimentChart;