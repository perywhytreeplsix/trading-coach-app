import { useState, useEffect } from "react"

export default function Market() {
  const [crypto, setCrypto] = useState([])
  const [fear, setFear] = useState(null)
  const [forex, setForex] = useState({})
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState("crypto")
  const [lastUpdate, setLastUpdate] = useState(null)

  const fetchData = async () => {
    setLoading(true)
    try {
      // Крипто
      const res = await fetch(
        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,solana,binancecoin,ripple,cardano&order=market_cap_desc&price_change_percentage=24h"
      )
      if (res.ok) setCrypto(await res.json())
    } catch {}

    try {
      // Индекс страха
      const res = await fetch("https://api.alternative.me/fng/?limit=1")
      if (res.ok) {
        const data = await res.json()
        setFear(data.data?.[0])
      }
    } catch {}

    try {
      // Форекс
      const res = await fetch("https://open.er-api.com/v6/latest/USD")
      if (res.ok) {
        const data = await res.json()
        setForex(data.rates || {})
      }
    } catch {}

    setLoading(false)
    setLastUpdate(new Date().toLocaleTimeString("ru-RU"))
  }

  useEffect(() => { fetchData() }, [])

  const fearValue = fear ? parseInt(fear.value) : null
  const fearColor = fearValue <= 25 ? "#5de3a0" : fearValue <= 45 ? "#7c6af7" : fearValue <= 55 ? "#f5a623" : fearValue <= 75 ? "#f5a623" : "#f05252"

  const FOREX_PAIRS = [
    { from: "EUR", label: "EUR/USD", inverse: true },
    { from: "GBP", label: "GBP/USD", inverse: true },
    { from: "JPY", label: "USD/JPY", inverse: false },
    { from: "CHF", label: "USD/CHF", inverse: false },
    { from: "KZT", label: "USD/KZT", inverse: false },
  ]

  return (
    <div className="page">
      <div className="page-header">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div className="page-title">📊 Рынок</div>
            {lastUpdate && <div className="page-subtitle">Обновлено: {lastUpdate}</div>}
          </div>
          <button
            className="btn btn-secondary"
            style={{ width: "auto", padding: "8px 14px", fontSize: 13 }}
            onClick={fetchData}
          >
            🔄 Обновить
          </button>
        </div>
      </div>

      {/* ИНДЕКС СТРАХА */}
      {fear && (
        <div className="card" style={{ borderLeft: `3px solid ${fearColor}` }}>
          <div className="card-title">😱 Индекс страха и жадности</div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              background: `${fearColor}20`,
              border: `2px solid ${fearColor}`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}>
              <div style={{ fontSize: 20, fontWeight: 800, fontFamily: "var(--mono)", color: fearColor }}>
                {fear.value}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: fearColor }}>
                {fear.value_classification}
              </div>
              <div style={{ fontSize: 12, color: "var(--text2)", marginTop: 4 }}>
                {fearValue <= 25
                  ? "Возможная зона покупки"
                  : fearValue <= 45
                  ? "Рынок осторожен"
                  : fearValue <= 55
                  ? "Нейтральный рынок"
                  : fearValue <= 75
                  ? "Рынок жаден — осторожно"
                  : "Экстремальная жадность!"}
              </div>
            </div>
          </div>
          <div style={{ marginTop: 12 }}>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${fear.value}%`, background: fearColor }} />
            </div>
          </div>
        </div>
      )}

      {/* ТАБЫ */}
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        {["crypto", "forex"].map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              flex: 1,
              padding: "10px",
              borderRadius: "var(--radius-sm)",
              border: `1px solid ${tab === t ? "var(--accent)" : "var(--border)"}`,
              background: tab === t ? "rgba(124,106,247,0.15)" : "var(--bg2)",
              color: tab === t ? "var(--accent)" : "var(--text2)",
              fontWeight: 600,
              fontSize: 13,
              cursor: "pointer",
            }}
          >
            {t === "crypto" ? "₿ Крипто" : "💱 Форекс"}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="loading"><div className="spinner" /> Загружаю данные...</div>
      ) : tab === "crypto" ? (
        <div className="card">
          {crypto.length === 0 ? (
            <div style={{ color: "var(--text2)", textAlign: "center", padding: 20 }}>
              Не удалось загрузить данные. Нажми Обновить.
            </div>
          ) : crypto.map(coin => {
            const change = coin.price_change_percentage_24h || 0
            const isPos = change >= 0
            return (
              <div key={coin.id} className="list-item">
                <img
                  src={coin.image}
                  alt={coin.symbol}
                  style={{ width: 36, height: 36, borderRadius: "50%", flexShrink: 0 }}
                />
                <div className="list-item-body">
                  <div className="list-item-title">{coin.name}</div>
                  <div className="list-item-sub">{coin.symbol.toUpperCase()}</div>
                </div>
                <div className="list-item-right">
                  <div style={{ fontFamily: "var(--mono)", fontSize: 14, fontWeight: 600 }}>
                    ${coin.current_price >= 1000
                      ? coin.current_price.toLocaleString()
                      : coin.current_price >= 1
                      ? coin.current_price.toFixed(2)
                      : coin.current_price.toFixed(4)}
                  </div>
                  <div style={{ fontSize: 12, color: isPos ? "var(--green)" : "var(--red)", fontWeight: 600 }}>
                    {isPos ? "+" : ""}{change.toFixed(2)}%
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="card">
          {FOREX_PAIRS.map(({ from, label, inverse }) => {
            const rate = forex[from]
            if (!rate) return null
            const display = inverse
              ? (1 / rate).toFixed(4)
              : rate > 100 ? rate.toFixed(0) : rate.toFixed(4)
            return (
              <div key={label} className="list-item">
                <div className="list-item-icon">💱</div>
                <div className="list-item-body">
                  <div className="list-item-title">{label}</div>
                </div>
                <div style={{ fontFamily: "var(--mono)", fontSize: 16, fontWeight: 700 }}>
                  {display}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
