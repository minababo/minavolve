"use client";

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { TrendingDown } from "lucide-react";

import type { BurndownDataPoint } from "@/lib/charts";

type BurndownChartProps = {
  data: BurndownDataPoint[];
};

type TooltipPayloadItem = {
  name: string;
  value: number | null;
  color: string;
};

function BurndownTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;

  const items = payload.filter((item) => item.value != null);
  if (!items.length) return null;

  return (
    <div className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 shadow-md">
      <p className="text-xs font-semibold text-slate-500">{label}</p>
      {items.map((item) => (
        <p
          key={item.name}
          className="mt-1 text-sm font-medium"
          style={{ color: item.color }}
        >
          {item.name}:{" "}
          <span className="font-heading text-base font-semibold text-slate-950">
            {item.value} pts
          </span>
        </p>
      ))}
    </div>
  );
}

export function BurndownChart({ data }: BurndownChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-[1.75rem] border border-dashed border-slate-300 bg-slate-50/80 p-12 text-center">
        <div className="mx-auto inline-flex size-12 items-center justify-center rounded-2xl bg-brand-soft text-brand">
          <TrendingDown className="size-6" />
        </div>
        <h3 className="mt-4 font-heading text-xl font-semibold text-slate-950">
          No burndown data
        </h3>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-600">
          Assign story points to stories in this sprint, or pick a sprint with
          a start and end date.
        </p>
      </div>
    );
  }

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 8, right: 16, left: 0, bottom: 8 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#e2e8f0"
            vertical={false}
          />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12, fill: "#64748b" }}
            axisLine={false}
            tickLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            tick={{ fontSize: 12, fill: "#64748b" }}
            axisLine={false}
            tickLine={false}
            width={40}
            allowDecimals={false}
          />
          <Tooltip content={<BurndownTooltip />} />
          <Legend
            iconType="line"
            iconSize={16}
            wrapperStyle={{ fontSize: "13px", paddingTop: "16px" }}
          />
          <Line
            type="monotone"
            dataKey="ideal"
            name="Ideal"
            stroke="#94a3b8"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="actual"
            name="Actual"
            stroke="#0ea5e9"
            strokeWidth={2}
            dot={false}
            connectNulls
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
