import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { Snapshot } from '@/db/schema'

interface MasteryTrendChartProps {
  snapshots: Snapshot[]
}

/** One series, so no legend — the section title above it already names it. */
export function MasteryTrendChart({ snapshots }: MasteryTrendChartProps) {
  const data = [...snapshots]
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((snapshot) => ({
      date: snapshot.date,
      mastered: snapshot.masteredCount,
    }))

  if (data.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center border-2 border-ink-35 border-dashed">
        <p className="font-mono text-ink-60 text-xs">Not enough history yet.</p>
      </div>
    )
  }

  return (
    <div className="h-48 w-full border-[3px] border-ink bg-surface p-4">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 8, right: 8, left: -16, bottom: 0 }}
        >
          <CartesianGrid stroke="var(--color-ink-12)" vertical={false} />
          <XAxis
            dataKey="date"
            tick={{
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              fill: 'var(--color-ink-60)',
            }}
            tickLine={false}
            axisLine={{ stroke: 'var(--color-ink-12)' }}
          />
          <YAxis
            allowDecimals={false}
            tick={{
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              fill: 'var(--color-ink-60)',
            }}
            tickLine={false}
            axisLine={false}
            width={32}
          />
          <Tooltip
            contentStyle={{
              border: '2px solid var(--color-ink)',
              borderRadius: 0,
              boxShadow: 'none',
              fontFamily: 'var(--font-mono)',
              fontSize: 12,
            }}
            labelStyle={{ color: 'var(--color-ink)' }}
            formatter={(value) => [value, 'Mastered']}
          />
          <Line
            type="monotone"
            dataKey="mastered"
            stroke="var(--color-cyan)"
            strokeWidth={2}
            dot={{ r: 3, fill: 'var(--color-cyan)', strokeWidth: 0 }}
            activeDot={{
              r: 5,
              fill: 'var(--color-cyan)',
              stroke: 'var(--color-ink)',
              strokeWidth: 2,
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
