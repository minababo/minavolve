"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { BarChart3 } from "lucide-react";

import type { VelocityDataPoint } from "@/lib/charts";

type VelocityChartProps = {
  data: VelocityDataPoint[];
};

type TooltipPayloadItem = {
  payload: VelocityDataPoint;
};

function VelocityTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: TooltipPayloadItem[];
}) {
  if (!active || !payload?.length) return null;

  const point = payload[0]?.payload;

  if (!point) return null;

  return (
    <div className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 shadow-md">
      <p className="text-xs font-semibold text-slate-500">{point.sprintName}</p>
      <p className="mt-1 font-heading text-lg font-semibold text-slate-950">
        {point.completedPoints}{" "}
        <span className="text-sm font-normal text-slate-600">
          pts completed
        </span>
      </p>
    </div>
  );
}

export function VelocityChart({ data }: VelocityChartProps) {
  const hasData = data.some((d) => d.completedPoints > 0);

  if (!hasData) {
    return (
      <div className="flex flex-col items-center justify-center rounded-[1.75rem] border border-dashed border-slate-300 bg-slate-50/80 p-12 text-center">
        <div className="mx-auto inline-flex size-12 items-center justify-center rounded-2xl bg-brand-soft text-brand">
          <BarChart3 className="size-6" />
        </div>
        <h3 className="mt-4 font-heading text-xl font-semibold text-slate-950">
          No velocity data yet
        </h3>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-600">
          Move user stories to Done on the Kanban board to see sprint velocity
          here.
        </p>
      </div>
    );
  }

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 8, right: 16, left: 0, bottom: 8 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#e2e8f0"
            vertical={false}
          />
          <XAxis
            dataKey="sprintName"
            tick={{ fontSize: 12, fill: "#64748b" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 12, fill: "#64748b" }}
            axisLine={false}
            tickLine={false}
            width={40}
            allowDecimals={false}
          />
          <Tooltip
            cursor={{ fill: "rgba(14, 165, 233, 0.08)" }}
            content={<VelocityTooltip />}
          />
          <Bar
            dataKey="completedPoints"
            fill="#0ea5e9"
            radius={[6, 6, 0, 0]}
            maxBarSize={64}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
