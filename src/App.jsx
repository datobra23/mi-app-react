import { useState } from "react";
import Fichar from "./Fichar";
import Calendar from "./Calendar";
import Dashboard from "./Dashboard";
import Admin from "./Admin";
import Tiendas from "./Tiendas";
import Kiosco from "./Kiosco";

function App() {
  const [vista, setVista] = useState("fichar");

  const btn = (activo) => ({
    padding: "10px 16px",
    borderRadius: 12,
    border: "none",
    cursor: "pointer",
    background: activo ? "#3b82f6" : "#ffffff",
    color: activo ? "white" : "#0f172a",
    fontWeight: 500
  });

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#ffffff",
        display: "flex",
        justifyContent: "center"
      }}
    >
      <div style={{ width: "100%", maxWidth: 1000 }}>

        {/* MENU */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 10,
            padding: 20,
            flexWrap: "wrap"
          }}
        >
          <button
            onClick={() => setVista("fichar")}
            style={btn(vista === "fichar")}
          >
            ⏱️ Fichar
          </button>

          <button
            onClick={() => setVista("kiosco")}
            style={btn(vista === "kiosco")}
          >
            🖥️ Kiosco
          </button>

          <button
            onClick={() => setVista("dashboard")}
            style={btn(vista === "dashboard")}
          >
            📊 Dashboard
          </button>

          <button
            onClick={() => setVista("calendar")}
            style={btn(vista === "calendar")}
          >
            📅 Calendario
          </button>

          <button
            onClick={() => setVista("empleados")}
            style={btn(vista === "empleados")}
          >
            👥 Empleados
          </button>

          <button
            onClick={() => setVista("tiendas")}
            style={btn(vista === "tiendas")}
          >
            🏪 Tiendas
          </button>
        </div>

        {/* CONTENIDO */}
        <div style={{ padding: 20 }}>
          {vista === "fichar" && <Fichar />}
          {vista === "kiosco" && <Kiosco />}
          {vista === "dashboard" && <Dashboard />}
          {vista === "calendar" && <Calendar />}
          {vista === "empleados" && <Admin />}
          {vista === "tiendas" && <Tiendas />}
        </div>

      </div>
    </div>
  );
}

export default App;