interface Props {
  label: string
  value: number
  min: number
  max: number
  step?: number
  onChange: (v: number) => void
  formatValue?: (v: number) => string
  symbol?: string
}

export default function Slider({
  label,
  value,
  min,
  max,
  step = 0.01,
  onChange,
  formatValue,
  symbol,
}: Props) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <label className="text-sm">
          {symbol && (
            <span className="mr-1.5 font-mono text-xs text-muted">{symbol}</span>
          )}
          {label}
        </label>
        <span className="font-mono text-xs tabular-nums text-ink">
          {formatValue ? formatValue(value) : value.toFixed(2)}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={e => onChange(parseFloat(e.target.value))}
        className="mt-2 w-full accent-ink"
        aria-label={label}
      />
    </div>
  )
}
