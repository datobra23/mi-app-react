function Menu({ setVista, vista }) {
  const tabs = [
    { id: "dashboard", label: "📊 Dashboard" },
    { id: "calendar", label: "📅 Calendario" },
    { id: "empleados", label: "👥 Empleados" }, // 👈 CORRECTO
    { id: "fichajes", label: "⏱ Fichajes" }
  ];

  return (
    <div style={{
      display: "flex",
      gap: 8,
      padding: 10,
      background: "#f1f5f9",
      borderRadius: 12,
      margin: 10
    }}>
      {tabs.map(tab => {
        const activo = vista === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => setVista(tab.id)}
            style={{
              flex: 1,
              padding: "10px 12px",
              borderRadius: 10,
              border: "none",
              cursor: "pointer",
              background: activo ? "#3b82f6" : "transparent",
              color: activo ? "white" : "#334155",
              fontWeight: 500,
              transition: "all 0.2s ease"
            }}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

export default Menu;