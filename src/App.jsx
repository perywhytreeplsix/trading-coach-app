import { useState, useEffect } from "react"
import Home from "./pages/Home"
import Learn from "./pages/Learn"
import Journal from "./pages/Journal"
import Market from "./pages/Market"
import Tools from "./pages/Tools"
import "./App.css"

const NAV = [
  { id: "home", icon: "⚡", label: "Главная" },
  { id: "learn", icon: "📚", label: "Учёба" },
  { id: "market", icon: "📊", label: "Рынок" },
  { id: "journal", icon: "📓", label: "Журнал" },
  { id: "tools", icon: "🧮", label: "Тулзы" },
]

export default function App() {
  const [page, setPage] = useState("home")
  const [tg, setTg] = useState(null)

  useEffect(() => {
    if (window.Telegram?.WebApp) {
      const webApp = window.Telegram.WebApp
      webApp.ready()
      webApp.expand()
      setTg(webApp)
    }
  }, [])

  const pages = { home: Home, learn: Learn, market: Market, journal: Journal, tools: Tools }
  const Page = pages[page] || Home

  return (
    <div className="app">
      <div className="page-content">
        <Page tg={tg} />
      </div>
      <nav className="bottom-nav">
        {NAV.map(item => (
          <button
            key={item.id}
            className={`nav-btn ${page === item.id ? "active" : ""}`}
            onClick={() => setPage(item.id)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  )
}