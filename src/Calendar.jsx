import { useEffect, useState } from "react";
import { db } from "./firebase";
import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc
} from "firebase/firestore";

function Calendar() {
  const [fichajes, setFichajes] = useState([]);
  const [fechaActual, setFechaActual] = useState(new Date());
  const [diaSeleccionado, setDiaSeleccionado] = useState(null);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "fichajes"), snap => {
      setFichajes(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

  const diasSemana = ["L","M","X","J","V","S","D"];

  const esHoy = (dia) => {
    const hoy = new Date();
    return dia && dia.toDateString() === hoy.toDateString();
  };

  const getDiasMes = () => {
    const year = fechaActual.getFullYear();
    const month = fechaActual.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const dias = [];
    let start = firstDay.getDay();
    start = start === 0 ? 6 : start - 1;

    for (let i = 0; i < start; i++) dias.push(null);
    for (let d = 1; d <= lastDay.getDate(); d++) {
      dias.push(new Date(year, month, d));
    }

    return dias;
  };

  const fichajesPorDia = (fecha) => {
    if (!fecha) return [];
    return fichajes.filter(f => {
      if (!f.fecha) return false;
      const fDate = new Date(f.fecha.seconds * 1000);
      return fDate.toDateString() === fecha.toDateString();
    });
  };

  const colorDia = (fecha) => {
    const fich = fichajesPorDia(fecha);
    if (fich.length === 0) return "#fee2e2";
    if (fich.length >= 2) return "#dcfce7";
    return "#fef9c3";
  };

  const cambiarMes = (dir) => {
    const nueva = new Date(fechaActual);
    nueva.setMonth(nueva.getMonth() + dir);
    setFechaActual(nueva);
  };

  const calcularHorasDia = (fecha) => {
    const fich = fichajesPorDia(fecha)
      .map(f => new Date(f.fecha.seconds * 1000))
      .sort((a,b)=>a-b);

    let total = 0;
    for (let i = 0; i < fich.length; i += 2) {
      if (fich[i+1]) total += (fich[i+1] - fich[i]);
    }

    return total / (1000 * 60 * 60);
  };

  const calcularHorasSemana = (fecha) => {
    const inicio = new Date(fecha);
    const dia = inicio.getDay();
    const diff = (dia === 0 ? -6 : 1 - dia);
    inicio.setDate(inicio.getDate() + diff);

    let total = 0;
    for (let i = 0; i < 7; i++) {
      const d = new Date(inicio);
      d.setDate(inicio.getDate() + i);
      total += calcularHorasDia(d);
    }

    return total.toFixed(2);
  };

  const getAlertas = (fecha) => {
    const fich = fichajesPorDia(fecha);
    const horas = calcularHorasDia(fecha);
    const alertas = [];

    if (fich.length === 0) alertas.push("⚠️ Sin fichajes");
    if (fich.length % 2 !== 0) alertas.push("❗ Fichaje incompleto");
    if (horas > 0 && horas < 6) alertas.push("⏱️ Pocas horas");
    if (horas > 8) alertas.push("🔥 Horas extra");

    return alertas;
  };

  const editarHora = async (fichaje) => {
    const nuevaHora = prompt("Nueva hora (HH:MM)");
    if (!nuevaHora) return;

    const [h, m] = nuevaHora.split(":");
    const fecha = new Date(fichaje.fecha.seconds * 1000);
    fecha.setHours(h);
    fecha.setMinutes(m);

    await updateDoc(doc(db, "fichajes", fichaje.id), { fecha });
  };

  const eliminarFichaje = async (id) => {
    if (!confirm("¿Eliminar fichaje?")) return;
    await deleteDoc(doc(db, "fichajes", id));
  };

  const dias = getDiasMes();

  return (
    <div style={{ padding: 20 }}>

      {/* HEADER iOS */}
      <div style={{
        display:"flex",
        justifyContent:"space-between",
        alignItems:"center",
        marginBottom:10
      }}>
        <button
          onClick={() => cambiarMes(-1)}
          style={{
            width:32,
            height:32,
            borderRadius:8,
            border:"none",
            background:"#e2e8f0",
            cursor:"pointer"
          }}
        >
          ◀
        </button>

        <h2 style={{ margin:0 }}>
          {fechaActual.toLocaleString("es-ES",{month:"long",year:"numeric"})}
        </h2>

        <button
          onClick={() => cambiarMes(1)}
          style={{
            width:32,
            height:32,
            borderRadius:8,
            border:"none",
            background:"#e2e8f0",
            cursor:"pointer"
          }}
        >
          ▶
        </button>
      </div>

      {/* resto igual */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:6 }}>
        {diasSemana.map(d=>(
          <div key={d} style={{
            textAlign:"center",
            background:"#e2e8f0",
            borderRadius:8,
            padding:6,
            fontSize:12
          }}>{d}</div>
        ))}
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:6, marginTop:10 }}>
        {dias.map((dia,i)=>(
          <div key={i}
            onClick={()=>dia && setDiaSeleccionado(dia)}
            style={{
              minHeight:90,
              padding:6,
              borderRadius:12,
              background: dia ? colorDia(dia) : "transparent",
              border: esHoy(dia) ? "2px solid #3b82f6" : "none",
              cursor:"pointer"
            }}
          >
            {dia && <b>{dia.getDate()}</b>}
          </div>
        ))}
      </div>

      {diaSeleccionado && (
        <div style={{
          position:"fixed",top:0,left:0,right:0,bottom:0,
          background:"rgba(0,0,0,0.4)",
          display:"flex",justifyContent:"center",alignItems:"center"
        }}>
          <div style={{ background:"white", padding:20, borderRadius:16, width:300 }}>
            <h3>{diaSeleccionado.toLocaleDateString()}</h3>

            <div><b>Horas día:</b> {calcularHorasDia(diaSeleccionado).toFixed(2)} h</div>
            <div><b>Semana:</b> {calcularHorasSemana(diaSeleccionado)} h</div>

            {getAlertas(diaSeleccionado).map((a,i)=>(
              <div key={i} style={{ color:"red", fontSize:12 }}>{a}</div>
            ))}

            {fichajesPorDia(diaSeleccionado).map((f,i)=>{
              const hora = new Date(f.fecha.seconds * 1000)
                .toLocaleTimeString([], {hour:"2-digit",minute:"2-digit"});
              return (
                <div key={i}>
                  {f.nombre} - {hora}
                  <button onClick={()=>editarHora(f)}>✏️</button>
                  <button onClick={()=>eliminarFichaje(f.id)}>❌</button>
                </div>
              );
            })}

            <button onClick={()=>setDiaSeleccionado(null)}>Cerrar</button>
          </div>
        </div>
      )}

    </div>
  );
}

export default Calendar;