import { useEffect, useState } from "react";
import { db } from "./firebase";
import { collection, onSnapshot, addDoc } from "firebase/firestore";

function Kiosco() {
  const [empleados, setEmpleados] = useState([]);
  const [fichajes, setFichajes] = useState([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "empleados"), snap => {
      setEmpleados(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "fichajes"), snap => {
      setFichajes(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

  const getTipo = (id) => {
    const f = fichajes.filter(x=>x.empleadoId===id)
      .sort((a,b)=>b.fecha.seconds-a.fecha.seconds)[0];

    if (!f) return "entrada";
    return f.tipo === "entrada" ? "salida" : "entrada";
  };

  const fichar = async (emp) => {
    await addDoc(collection(db, "fichajes"), {
      nombre: emp.nombre,
      empleadoId: emp.id,
      tiendaId: emp.tiendaId || "",
      tipo: getTipo(emp.id),
      fecha: new Date()
    });
  };

  return (
    <div style={{
      background:"#f1f5f9",
      minHeight:"100vh",
      padding:20
    }}>
      <h2 style={{ textAlign:"center" }}>🖥️ Kiosco</h2>

      <div style={{
        display:"grid",
        gridTemplateColumns:"repeat(auto-fit, minmax(200px,1fr))",
        gap:20,
        maxWidth:900,
        margin:"0 auto"
      }}>

        {empleados.map(emp => (
          <button key={emp.id} onClick={()=>fichar(emp)} style={{
            background:"white",
            padding:20,
            borderRadius:20,
            border:"none"
          }}>
            <img src={emp.foto || "https://via.placeholder.com/80"}
              style={{ width:80, height:80, borderRadius:"50%" }} />
            <div>{emp.nombre}</div>
          </button>
        ))}

      </div>
    </div>
  );
}

export default Kiosco;