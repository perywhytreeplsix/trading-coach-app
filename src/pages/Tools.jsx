import { useState } from "react"

export default function Tools() {
  const [tool, setTool] = useState("risk")
  const [risk, setRisk] = useState({ deposit: "", riskPct: "1", entry: "", sl: "" })
  const [rr, setRr] = useState({ entry: "", sl: "", tp: "" })
  const [riskResult, setRiskResult] = useState(null)
  const [rrResult, setRrResult] = useState(null)
  const [checklist, setChecklist] = useState(Array(8).fill(false))

  const CHECKS = [
    "Проверил тренд на старшем таймфрейме",
    "Определил уровни поддержки/сопротивления",
    "Установил стоп-лосс",
    "Рассчитал размер позиции (риск ≤ 2%)",
    "Проверил экономический календарь",
    "Нет важных новостей в ближайший час",
    "R:R не менее 1:2",
    "Торгую по плану, не из эмоций",
  ]

  const calcRisk = () => {
    const d = parseFloat(risk.deposit)
    const p = parseFloat(risk.riskPct)
    const e = parseFloat(risk.entry)
    const s = parseFloat(risk.sl)
    if (!d || !p || !e || !s) return
    const riskUsd = d * p / 100
    const slDist = Math.abs(e - s) / e
    if (slDist === 0) return
    const posSize = riskUsd / slDist
    const qty = posSize / e
    const lev = posSize / d
    setRiskResult({ riskUsd: riskUsd.toFixed(2), posSize: posSize.toFixed(2), qty: qty.toFixed(6), lev: lev.toFixed(1), slPct: (slDist * 100).toFixed(2) })
  }

  const calcRR = () => {
    const e = parseFloat(rr.entry)
    const s = parseFloat(rr.sl)
    const t = parseFloat(rr.tp)
    if (!e || !s || !t) return
    const riskAmt = Math.abs(e - s)
    const reward = Math.abs(t - e)
    if (riskAmt === 0) return
    const ratio = reward / riskAmt
    const minWr = 1 / (1 + ratio) * 100
    const quality = ratio >= 3 ? { label: "Отличный сетап 🟢", color: "var(--green)" }
      : ratio >= 2 ? { label: "Хороший сетап 🟡", color: "var(--yellow)" }
      : ratio >= 1 ? { label: "Слабый сетап 🟠", color: "var(--yellow)" }
      : { label: "Не торгуй ❌", color: "var(--red)" }
    setRrResult({ ratio: ratio.toFixed(2), minWr: minWr.toFixed(1), quality, riskPct: (riskAmt / e * 100).toFixed(2), rewardPct: (reward / e * 100).toFixed(2) })
  }

  const toggleCheck = i => {
    const next = [...checklist]
    next[i] = !next[i]
    setChecklist(next)
  }

  const allDone = checklist.every(Boolean)
  const doneCount = checklist.filter(Boolean).length

  const TABS = [
    { id: "risk", label: "🧮 Риск" },
    { id: "rr", label: "⚖️ R:R" },
    { id: "check", label: "✅ Чеклист" },
  ]

  return (
    <div className="page">
      <div className="page-header">
        <div className="page-title">🧮 Инструменты</div>
      </div>

      {/* ТАБЫ */}
      <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTool(t.id)} style={{
            flex: 1,
            padding: "10px 4px",
            borderRadius: "var(--radius-sm)",
            border: `1px solid ${tool === t.id ? "var(--accent)" : "var(--border)"}`,
            background: tool === t.id ? "rgba(124,106,247,0.15)" : "var(--bg2)",
            color: tool === t.id ? "var(--accent)" : "var(--text2)",
            fontWeight: 600,
            fontSize: 12,
            cursor: "pointer",
          }}>{t.label}</button>
        ))}
      </div>

      {tool === "risk" && (
        <div>
          <div className="card">
            <div className="card-title">Калькулятор риска</div>
            <div className="input-group">
              <label className="input-label">Депозит ($)</label>
              <input className="input" type="number" placeholder="1000" value={risk.deposit} onChange={e => setRisk({ ...risk, deposit: e.target.value })} />
            </div>
            <div className="input-group">
              <label className="input-label">Риск (%)</label>
              <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
                {["0.5", "1", "2", "3"].map(v => (
                  <button key={v} onClick={() => setRisk({ ...risk, riskPct: v })} style={{
                    flex: 1, padding: "8px", borderRadius: "var(--radius-sm)",
                    border: `1px solid ${risk.riskPct === v ? "var(--accent)" : "var(--border)"}`,
                    background: risk.riskPct === v ? "rgba(124,106,247,0.2)" : "var(--bg3)",
                    color: risk.riskPct === v ? "var(--accent)" : "var(--text)",
                    fontSize: 13, fontWeight: 600, cursor: "pointer",
                  }}>{v}%</button>
                ))}
              </div>
            </div>
            <div className="input-group">
              <label className="input-label">Цена входа</label>
              <input className="input" type="number" placeholder="67500" value={risk.entry} onChange={e => setRisk({ ...risk, entry: e.target.value })} />
            </div>
            <div className="input-group">
              <label className="input-label">Стоп-лосс</label>
              <input className="input" type="number" placeholder="66000" value={risk.sl} onChange={e => setRisk({ ...risk, sl: e.target.value })} />
            </div>
            <button className="btn btn-primary" onClick={calcRisk}>Рассчитать</button>
          </div>

          {riskResult && (
            <div className="card" style={{ borderLeft: "3px solid var(--accent)" }}>
              <div className="card-title">Результат</div>
              <div className="stat-grid">
                <div className="stat-card">
                  <div className="stat-value mono text-red">${riskResult.riskUsd}</div>
                  <div className="stat-label">Риск в $</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value mono text-accent">${riskResult.posSize}</div>
                  <div className="stat-label">Размер позиции</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value mono">{riskResult.qty}</div>
                  <div className="stat-label">Количество</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value mono">{riskResult.lev}x</div>
                  <div className="stat-label">Плечо</div>
                </div>
              </div>
              <div style={{ marginTop: 12, fontSize: 13, color: "var(--text2)" }}>
                Стоп: {riskResult.slPct}% от цены входа
              </div>
            </div>
          )}
        </div>
      )}

      {tool === "rr" && (
        <div>
          <div className="card">
            <div className="card-title">Калькулятор R:R</div>
            <div className="input-group">
              <label className="input-label">Цена входа</label>
              <input className="input" type="number" placeholder="67500" value={rr.entry} onChange={e => setRr({ ...rr, entry: e.target.value })} />
            </div>
            <div className="input-group">
              <label className="input-label">Стоп-лосс</label>
              <input className="input" type="number" placeholder="66000" value={rr.sl} onChange={e => setRr({ ...rr, sl: e.target.value })} />
            </div>
            <div className="input-group">
              <label className="input-label">Тейк-профит</label>
              <input className="input" type="number" placeholder="70000" value={rr.tp} onChange={e => setRr({ ...rr, tp: e.target.value })} />
            </div>
            <button className="btn btn-primary" onClick={calcRR}>Рассчитать</button>
          </div>

          {rrResult && (
            <div className="card" style={{ borderLeft: `3px solid ${rrResult.quality.color}` }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: rrResult.quality.color, marginBottom: 12 }}>
                R:R = 1:{rrResult.ratio}
              </div>
              <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>{rrResult.quality.label}</div>
              <div className="divider" />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                <span style={{ color: "var(--text2)" }}>Риск</span>
                <span className="text-red mono">-{rrResult.riskPct}%</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginTop: 8 }}>
                <span style={{ color: "var(--text2)" }}>Прибыль</span>
                <span className="text-green mono">+{rrResult.rewardPct}%</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginTop: 8 }}>
                <span style={{ color: "var(--text2)" }}>Мин. винрейт</span>
                <span className="mono">{rrResult.minWr}%</span>
              </div>
            </div>
          )}
        </div>
      )}

      {tool === "check" && (
        <div className="card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div className="card-title" style={{ margin: 0 }}>Чеклист перед сделкой</div>
            <span className={`tag ${allDone ? "tag-green" : "tag-yellow"}`}>{doneCount}/{CHECKS.length}</span>
          </div>
          <div className="progress-bar" style={{ marginBottom: 16 }}>
            <div className="progress-fill" style={{ width: `${doneCount / CHECKS.length * 100}%` }} />
          </div>
          {CHECKS.map((item, i) => (
            <div key={i} onClick={() => toggleCheck(i)} style={{
              display: "flex", alignItems: "center", gap: 12,
              padding: "12px 0",
              borderBottom: i < CHECKS.length - 1 ? "1px solid var(--border)" : "none",
              cursor: "pointer",
            }}>
              <div style={{
                width: 24, height: 24, borderRadius: 6,
                background: checklist[i] ? "var(--green)" : "var(--bg3)",
                border: `2px solid ${checklist[i] ? "var(--green)" : "var(--border)"}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0, transition: "all 0.15s",
              }}>
                {checklist[i] && <span style={{ fontSize: 13, color: "#0a0a0f", fontWeight: 700 }}>✓</span>}
              </div>
              <span style={{ fontSize: 13, color: checklist[i] ? "var(--text2)" : "var(--text)", textDecoration: checklist[i] ? "line-through" : "none" }}>
                {item}
              </span>
            </div>
          ))}
          {allDone && (
            <div style={{
              marginTop: 16, padding: 14, borderRadius: "var(--radius-sm)",
              background: "rgba(93,227,160,0.1)", border: "1px solid var(--green)",
              textAlign: "center", fontSize: 14, fontWeight: 600, color: "var(--green)",
            }}>
              🚀 Все пункты выполнены — можно торговать!
            </div>
          )}
          <button className="btn btn-secondary" style={{ marginTop: 12 }} onClick={() => setChecklist(Array(8).fill(false))}>
            🔄 Сбросить
          </button>
        </div>
      )}
    </div>
  )
}
