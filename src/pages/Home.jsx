import { useState, useEffect } from "react"
import "../App.css"

const TIPS = [
  "Никогда не рискуй более 2% депозита в одной сделке",
  "Тренд — твой друг. Торгуй по тренду, не против него",
  "Журнал сделок важнее любой стратегии",
  "R:R минимум 1:2. Без этого математика не на твоей стороне",
  "Стоп-лосс — это не опция. Это обязательство",
  "Emotion before entry: если тревожен — не входи",
  "Бэктест стратегии на 100+ сделках перед реальными деньгами",
  "Price Action важнее индикаторов",
  "Лучшая сделка — та, которую ты не взял по плану",
  "Дисциплина приносит деньги. Азарт — сливает",
]

export default function Home({ tg }) {
  const [tip] = useState(() => TIPS[Math.floor(Math.random() * TIPS.length)])
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(interval)
  }, [])

  const userName = tg?.initDataUnsafe?.user?.first_name || "Трейдер"

  const hours = time.getHours()
  const greeting = hours < 12 ? "Доброе утро" : hours < 18 ? "Добрый день" : "Добрый вечер"

  // Торговые сессии
  const sessions = [
    { name: "Азия", start: 0, end: 9, tz: "UTC" },
    { name: "Лондон", start: 8, end: 17, tz: "UTC" },
    { name: "Нью-Йорк", start: 13, end: 22, tz: "UTC" },
  ]

  const utcHour = new Date().getUTCHours()
  const activeSessions = sessions.filter(s => utcHour >= s.start && utcHour < s.end)

  return (
    <div className="page">
      {/* HEADER */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 13, color: "var(--text2)", marginBottom: 4 }}>
          {greeting}, 👋
        </div>
        <div style={{ fontSize: 26, fontWeight: 700 }}>
          {userName}
        </div>
        <div style={{ fontSize: 13, color: "var(--text2)", marginTop: 4, fontFamily: "var(--mono)" }}>
          {time.toLocaleTimeString("ru-RU")} · {time.toLocaleDateString("ru-RU", { weekday: "long", day: "numeric", month: "long" })}
        </div>
      </div>

      {/* ТОРГОВЫЕ СЕССИИ */}
      <div className="card">
        <div className="card-title">Торговые сессии (UTC)</div>
        <div style={{ display: "flex", gap: 8 }}>
          {sessions.map(s => {
            const isActive = utcHour >= s.start && utcHour < s.end
            return (
              <div key={s.name} style={{
                flex: 1,
                background: isActive ? "rgba(124,106,247,0.15)" : "var(--bg3)",
                border: `1px solid ${isActive ? "var(--accent)" : "var(--border)"}`,
                borderRadius: "var(--radius-sm)",
                padding: "10px 8px",
                textAlign: "center",
              }}>
                <div style={{ fontSize: 18, marginBottom: 4 }}>
                  {s.name === "Азия" ? "🌏" : s.name === "Лондон" ? "🇬🇧" : "🇺🇸"}
                </div>
                <div style={{ fontSize: 12, fontWeight: 600, color: isActive ? "var(--accent)" : "var(--text2)" }}>
                  {s.name}
                </div>
                <div style={{ fontSize: 10, color: "var(--text2)", marginTop: 2 }}>
                  {s.start}:00–{s.end}:00
                </div>
                {isActive && (
                  <div style={{ fontSize: 10, color: "var(--green)", marginTop: 4, fontWeight: 600 }}>
                    ● АКТИВНА
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* СОВЕТ ДНЯ */}
      <div className="card" style={{ borderLeft: "3px solid var(--accent)" }}>
        <div className="card-title">💡 Совет дня</div>
        <div style={{ fontSize: 14, lineHeight: 1.6, color: "var(--text)" }}>
          "{tip}"
        </div>
      </div>

      {/* БЫСТРЫЕ ДЕЙСТВИЯ */}
      <div className="card">
        <div className="card-title">Быстрый доступ</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {[
            { icon: "📖", label: "Продолжить учёбу", color: "var(--accent)" },
            { icon: "➕", label: "Добавить сделку", color: "var(--green)" },
            { icon: "🧮", label: "Калькулятор риска", color: "var(--yellow)" },
            { icon: "📊", label: "Цены рынка", color: "#f05252" },
          ].map(item => (
            <div key={item.label} style={{
              background: "var(--bg3)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-sm)",
              padding: "14px 12px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}>
              <span style={{ fontSize: 20 }}>{item.icon}</span>
              <span style={{ fontSize: 12, fontWeight: 600, lineHeight: 1.3 }}>{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ПРАВИЛА ТРЕЙДЕРА */}
      <div className="card">
        <div className="card-title">⚡ Правила трейдера</div>
        {[
          "Риск не более 2% на сделку",
          "R:R минимум 1:2",
          "Стоп-лосс обязателен всегда",
          "Не торгую из эмоций",
          "Следую своей системе",
        ].map((rule, i) => (
          <div key={i} style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "8px 0",
            borderBottom: i < 4 ? "1px solid var(--border)" : "none",
          }}>
            <div style={{
              width: 22,
              height: 22,
              borderRadius: "50%",
              background: "rgba(124,106,247,0.2)",
              color: "var(--accent)",
              fontSize: 11,
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}>
              {i + 1}
            </div>
            <span style={{ fontSize: 13 }}>{rule}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
