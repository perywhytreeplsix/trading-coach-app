import { useState } from "react"

const MODULES = [
  { id: 1, icon: "📖", title: "Основы рынка", lessons: 3, color: "#7c6af7" },
  { id: 2, icon: "📊", title: "Технический анализ", lessons: 3, color: "#5de3a0" },
  { id: 3, icon: "🏦", title: "Фундаментальный анализ", lessons: 2, color: "#f5a623" },
  { id: 4, icon: "🕯", title: "Price Action", lessons: 1, color: "#f05252" },
  { id: 5, icon: "🧠", title: "Smart Money / ICT", lessons: 3, color: "#7c6af7" },
  { id: 6, icon: "📉", title: "Wyckoff & Volume", lessons: 2, color: "#5de3a0" },
  { id: 7, icon: "🌍", title: "Макро и межрыночный", lessons: 1, color: "#f5a623" },
  { id: 8, icon: "₿", title: "Крипто-специфика", lessons: 2, color: "#f5a623" },
  { id: 9, icon: "📈", title: "Деривативы", lessons: 2, color: "#f05252" },
  { id: 10, icon: "🤖", title: "Quant & AI", lessons: 1, color: "#7c6af7" },
  { id: 11, icon: "🛡", title: "Риск-менеджмент", lessons: 2, color: "#5de3a0" },
  { id: 12, icon: "🧘", title: "Психология", lessons: 1, color: "#f5a623" },
  { id: 13, icon: "⚙️", title: "Практика", lessons: 2, color: "#7c6af7" },
]

export default function Learn() {
  const [progress] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("learn_progress") || "{}")
    } catch { return {} }
  })

  const totalLessons = MODULES.reduce((s, m) => s + m.lessons, 0)
  const completedLessons = Object.values(progress).filter(Boolean).length
  const percent = Math.round((completedLessons / totalLessons) * 100)

  return (
    <div className="page">
      <div className="page-header">
        <div className="page-title">📚 Обучение</div>
        <div className="page-subtitle">13 модулей · {totalLessons} уроков</div>
      </div>

      {/* ПРОГРЕСС */}
      <div className="card">
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
          <span style={{ fontSize: 14, fontWeight: 600 }}>Общий прогресс</span>
          <span style={{ fontSize: 14, fontWeight: 700, color: "var(--accent)" }}>{percent}%</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${percent}%` }} />
        </div>
        <div style={{ fontSize: 12, color: "var(--text2)", marginTop: 8 }}>
          {completedLessons} из {totalLessons} уроков пройдено
        </div>
      </div>

      {/* МОДУЛИ */}
      <div className="card">
        <div className="card-title">Модули</div>
        {MODULES.map((m, i) => {
          const done = 0 // TODO: connect to real progress
          const isComplete = done >= m.lessons
          return (
            <div key={m.id} className="list-item">
              <div className="list-item-icon" style={{ background: `${m.color}20`, fontSize: 20 }}>
                {m.icon}
              </div>
              <div className="list-item-body">
                <div className="list-item-title">{m.title}</div>
                <div className="list-item-sub">{m.lessons} уроков</div>
              </div>
              <div className="list-item-right">
                {isComplete
                  ? <span className="tag tag-green">✓ Готово</span>
                  : <span style={{ fontSize: 12, color: "var(--text2)" }}>→</span>
                }
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
