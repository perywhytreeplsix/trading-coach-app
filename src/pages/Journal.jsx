import { useState } from "react"

export default function Journal() {
  const [trades] = useState(() => {
    try { return JSON.parse(localStorage.getItem("trades") || "[]") }
    catch { return [] }
  })

  const closed = trades.filter(t => t.status === "closed")
  const open = trades.filter(t => t.status === "open")
  const wins = closed.filter(t => t.pnl > 0).length
  const winrate = closed.length > 0 ? Math.round((wins / closed.length) * 100) : 0
  const totalPnl = closed.reduce((s, t) => s + (t.pnl_usd || 0), 0)

  return (
    <div className="page">
      <div className="page-header">
        <div className="page-title">📓 Журнал</div>
        <div className="page-subtitle">Используй бота для добавления сделок</div>
      </div>

      {/* СТАТИСТИКА */}
      <div className="stat-grid" style={{ marginBottom: 12 }}>
        <div className="stat-card">
          <div className="stat-value mono">{closed.length}</div>
          <div className="stat-label">Сделок закрыто</div>
        </div>
        <div className="stat-card">
          <div className="stat-value mono" style={{ color: winrate >= 50 ? "var(--green)" : "var(--red)" }}>
            {winrate}%
          </div>
          <div className="stat-label">Винрейт</div>
        </div>
        <div className="stat-card">
          <div className="stat-value mono" style={{ color: totalPnl >= 0 ? "var(--green)" : "var(--red)" }}>
            {totalPnl >= 0 ? "+" : ""}{totalPnl.toFixed(0)}$
          </div>
          <div className="stat-label">Итого P&L</div>
        </div>
        <div className="stat-card">
          <div className="stat-value mono">{open.length}</div>
          <div className="stat-label">Открытых</div>
        </div>
      </div>

      {/* ОТКРЫТЫЕ СДЕЛКИ */}
      {open.length > 0 && (
        <div className="card">
          <div className="card-title">🟡 Открытые сделки</div>
          {open.map((t, i) => (
            <div key={i} className="list-item">
              <div className="list-item-icon">
                {t.direction === "long" ? "📈" : "📉"}
              </div>
              <div className="list-item-body">
                <div className="list-item-title">{t.pair}</div>
                <div className="list-item-sub">Вход: {t.entry_price} · {t.setup}</div>
              </div>
              <span className="tag tag-yellow">Открыта</span>
            </div>
          ))}
        </div>
      )}

      {/* ИСТОРИЯ */}
      <div className="card">
        <div className="card-title">История сделок</div>
        {closed.length === 0 ? (
          <div style={{ textAlign: "center", padding: "20px 0", color: "var(--text2)" }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>📭</div>
            <div style={{ fontSize: 14 }}>Сделок пока нет</div>
            <div style={{ fontSize: 12, marginTop: 4 }}>Добавляй через бота → Журнал</div>
          </div>
        ) : closed.map((t, i) => {
          const isWin = t.pnl_usd > 0
          return (
            <div key={i} className="list-item">
              <div className="list-item-icon">
                {t.direction === "long" ? "📈" : "📉"}
              </div>
              <div className="list-item-body">
                <div className="list-item-title">{t.pair}</div>
                <div className="list-item-sub">{t.setup} · {t.timeframe}</div>
              </div>
              <div className="list-item-right">
                <div style={{
                  fontFamily: "var(--mono)",
                  fontSize: 14,
                  fontWeight: 700,
                  color: isWin ? "var(--green)" : "var(--red)"
                }}>
                  {isWin ? "+" : ""}{t.pnl_usd?.toFixed(1)}$
                </div>
                <div style={{ fontSize: 11, color: "var(--text2)" }}>
                  {t.pnl?.toFixed(1)}%
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="card" style={{ textAlign: "center", padding: 20 }}>
        <div style={{ fontSize: 14, color: "var(--text2)" }}>
          💡 Добавляй и закрывай сделки через Telegram бота
        </div>
        <div style={{ fontSize: 12, color: "var(--text2)", marginTop: 4 }}>
          @Mycouchcrypto_bot → Журнал
        </div>
      </div>
    </div>
  )
}
