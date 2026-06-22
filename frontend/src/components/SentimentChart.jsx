import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Positive", value: 70 },
  { name: "Neutral", value: 20 },
  { name: "Negative", value: 10 },
];

const COLORS = ["#22c55e", "#f59e0b", "#ef4444"];

function SentimentChart() {
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
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={100}
            dataKey="value"
            label
          >
            {data.map((entry, index) => (
              <Cell
                key={index}
                fill={COLORS[index]}
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