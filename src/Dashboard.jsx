import { useEffect, useState } from "react";
import { db } from "./firebase";
import { collection, onSnapshot } from "firebase/firestore";
import jsPDF from "jspdf";

function Dashboard() {
  const [fichajes, setFichajes] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [filtro, setFiltro] = useState("semana");
  const [vista, setVista] = useState("resumen");

  // 🔥 cargar fichajes
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "fichajes"), snap => {
      setFichajes(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

  // 🔥 cargar empleados
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "empleados"), snap => {
      setEmpleados(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

  // 🔥 filtro fechas
  const filtrar = (lista) => {
    const ahora = new Date();

    return lista.filter(f => {
      const fecha = new Date(f.fecha.seconds * 1000);

      if (filtro === "hoy") {
        return fecha.toDateString() === ahora.toDateString();
      }

      if (filtro === "semana") {
        const inicio = new Date();
        inicio.setDate(ahora.getDate() - 7);
        return fecha >= inicio;
      }

      if (filtro === "mes") {
        return (
          fecha.getMonth() === ahora.getMonth() &&
          fecha.getFullYear() === ahora.getFullYear()
        );
      }

      return true;
    });
  };

  // 🔥 calcular horas
  const calcularHoras = (empId) => {
    const fich = filtrar(
      fichajes.filter(f => f.empleadoId === empId)
    ).sort((a, b) => a.fecha.seconds - b.fecha.seconds);

    let total = 0;

    for (let i = 0; i < fich.length; i += 2) {
      const entrada = fich[i];
      const salida = fich[i + 1];

      if (entrada && salida) {
        const inicio = new Date(entrada.fecha.seconds * 1000);
        const fin = new Date(salida.fecha.seconds * 1000);
        total += (fin - inicio);
      }
    }

    return total / (1000 * 60 * 60);
  };

  // 🔥 detalle por día
  const getDetalle = () => {
    let resultado = [];

    empleados.forEach(emp => {
      const fich = filtrar(
        fichajes.filter(f => f.empleadoId === emp.id)
      ).sort((a, b) => a.fecha.seconds - b.fecha.seconds);

      for (let i = 0; i < fich.length; i += 2) {
        const entrada = fich[i];
        const salida = fich[i + 1];

        if (entrada && salida) {
          const inicio = new Date(entrada.fecha.seconds * 1000);
          const fin = new Date(salida.fecha.seconds * 1000);

          resultado.push({
            empleado: `${emp.nombre} ${emp.apellidos}`,
            fecha: inicio.toLocaleDateString(),
            entrada: inicio.toLocaleTimeString([], {hour:"2-digit",minute:"2-digit"}),
            salida: fin.toLocaleTimeString([], {hour:"2-digit",minute:"2-digit"}),
            horas: ((fin - inicio) / (1000 * 60 * 60)).toFixed(2)
          });
        }
      }
    });

    return resultado;
  };

  const detalle = getDetalle();

  // 🔥 CSV
  const exportarCSV = () => {
    const filas = empleados.map(emp => [
      `${emp.nombre} ${emp.apellidos}`,
      calcularHoras(emp.id).toFixed(2),
      filtro
    ]);

    const csv = [
      ["Empleado", "Horas", "Periodo"],
      ...filas
    ]
      .map(e => e.join(";"))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `informe_${filtro}.csv`;
    a.click();
  };

  // 🔥 PDF
  const exportarPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("Informe de horas", 20, 20);

    doc.setFontSize(10);
    doc.text(`Periodo: ${filtro}`, 20, 30);

    let y = 40;

    empleados.forEach(emp => {
      const horas = calcularHoras(emp.id).toFixed(2);

      doc.text(`${emp.nombre} ${emp.apellidos}`, 20, y);
      doc.text(`${horas} h`, 150, y);

      y += 8;

      if (y > 270) {
        doc.addPage();
        y = 20;
      }
    });

    doc.save(`informe_${filtro}.pdf`);
  };

  // 🎨 estilos
  const card = {
    background: "white",
    padding: 15,
    borderRadius: 16,
    marginBottom: 10,
    boxShadow: "0 4px 10px rgba(0,0,0,0.05)"
  };

  const btn = (activo) => ({
    padding: "6px 10px",
    borderRadius: 8,
    border: "none",
    cursor: "pointer",
    background: activo ? "#3b82f6" : "#e2e8f0",
    color: activo ? "white" : "#0f172a"
  });

  return (
    <div style={{ background:"#f1f5f9", minHeight:"100vh", padding:20 }}>
      <div style={{ maxWidth:600, margin:"0 auto" }}>

        <h2>📊 Dashboard</h2>

        {/* VISTA */}
        <div style={{ display:"flex", gap:10, marginBottom:10 }}>
          <button onClick={()=>setVista("resumen")} style={btn(vista==="resumen")}>
            Resumen
          </button>
          <button onClick={()=>setVista("detalle")} style={btn(vista==="detalle")}>
            Detalle
          </button>
        </div>

        {/* FILTRO */}
        <div style={{ display:"flex", gap:10, marginBottom:15 }}>
          <button onClick={()=>setFiltro("hoy")} style={btn(filtro==="hoy")}>
            Hoy
          </button>
          <button onClick={()=>setFiltro("semana")} style={btn(filtro==="semana")}>
            Semana
          </button>
          <button onClick={()=>setFiltro("mes")} style={btn(filtro==="mes")}>
            Mes
          </button>
        </div>

        {/* 🔥 BOTONES EXPORT (ESTO ES LO QUE TE FALTABA) */}
        <div style={card}>
          <button onClick={exportarCSV}>📥 Exportar CSV</button>

          <button onClick={exportarPDF} style={{ marginLeft:10 }}>
            🧾 Exportar PDF
          </button>
        </div>

        {/* RESUMEN */}
        {vista === "resumen" && empleados.map(emp => (
          <div key={emp.id} style={card}>
            <b>{emp.nombre} {emp.apellidos}</b>

            <div style={{ marginTop:10, fontSize:18 }}>
              ⏱️ {calcularHoras(emp.id).toFixed(2)} horas
            </div>
          </div>
        ))}

        {/* DETALLE */}
        {vista === "detalle" && detalle.map((d, i) => (
          <div key={i} style={card}>
            <b>{d.empleado}</b>
            <div style={{ fontSize:12 }}>📅 {d.fecha}</div>
            <div>⏰ {d.entrada} → {d.salida}</div>
            <div>⏱️ {d.horas} h</div>
          </div>
        ))}

      </div>
    </div>
  );
}

export default Dashboard;