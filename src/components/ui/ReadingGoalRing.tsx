interface ReadingGoalRingProps {
  current: number;
  goal: number;
  onGoalChange?: (goal: number) => void;
}

export function ReadingGoalRing({ current, goal, onGoalChange }: ReadingGoalRingProps) {
  const pct = goal > 0 ? Math.min(100, (current / goal) * 100) : 0;
  const r = 54;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;

  return (
    <div className="bj-panel flex flex-col items-center p-6 sm:flex-row sm:gap-8">
      <div className="relative shrink-0">
        <svg width="140" height="140" className="-rotate-90">
          <circle cx="70" cy="70" r={r} fill="none" stroke="#f4f2ef" strokeWidth="10" />
          <circle
            cx="70"
            cy="70"
            r={r}
            fill="none"
            stroke="url(#goalGrad)"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={offset}
            className="transition-all duration-700"
          />
          <defs>
            <linearGradient id="goalGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#c17f59" />
              <stop offset="100%" stopColor="#1e3a5f" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-bj-navy">{current}</span>
          <span className="text-xs text-bj-muted">de {goal}</span>
        </div>
      </div>

      <div className="mt-4 text-center sm:mt-0 sm:text-left">
        <h3 className="font-serif text-xl font-bold text-bj-navy">Meta de lectura {new Date().getFullYear()}</h3>
        <p className="mt-1 text-sm text-bj-muted">
          {pct >= 100
            ? "¡Enhorabuena! Has alcanzado tu meta."
            : `Te faltan ${Math.max(0, goal - current)} libros para tu objetivo.`}
        </p>
        {onGoalChange && (
          <div className="mt-4 flex items-center gap-2">
            <label className="text-xs text-bj-muted">Meta anual:</label>
            <input
              type="number"
              min={1}
              max={999}
              value={goal}
              onChange={(e) => onGoalChange(Math.max(1, parseInt(e.target.value) || 1))}
              className="bj-input w-20 text-center text-sm"
            />
          </div>
        )}
      </div>
    </div>
  );
}
