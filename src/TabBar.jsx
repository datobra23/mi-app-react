function TabBar({ vista, setVista }) {

  const item = (activo) => ({
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 11,
    cursor: "pointer",
    color: activo ? "#3b82f6" : "#64748b",
    transform: activo ? "scale(1.1)" : "scale(1)",
    transition: "all 0.2s ease"
  });

  return (
    <div style={{
  position: "fixed",
  bottom: 10,
  left: 10,
  right: 10,
  height: 65,
  display: "flex",
  borderRadius: 20,
  background: "rgba(255,255,255,0.9)",
  backdropFilter: "blur(10px)",
  boxShadow: "0 6px 20px rgba(0,0,0,0.08)"
}}>

      <div onClick={() => setVista("dashboard")} style={item(vista === "dashboard")}>
        <div style={{ fontSize: 18 }}>🏠</div>
        Inicio
      </div>

      <div onClick={() => setVista("calendar")} style={item(vista === "calendar")}>
        <div style={{ fontSize: 18 }}>📅</div>
        Calendario
      </div>

      <div onClick={() => setVista("empleados")} style={item(vista === "empleados")}>
        <div style={{ fontSize: 18 }}>👥</div>
        Empleados
      </div>

    </div>
  );
}

export default TabBar;