import { useEffect, useState } from "react";
import { db } from "./firebase";
import { collection, onSnapshot, addDoc } from "firebase/firestore";

function Fichar() {
  const [tiendas, setTiendas] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [fichajes, setFichajes] = useState([]);
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "tiendas"), snap => {
      setTiendas(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

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

  const getUltimo = (id) =>
    fichajes.filter(f => f.empleadoId === id)
      .sort((a,b)=>b.fecha.seconds - a.fecha.seconds)[0];

  const getTipo = (id) => {
    const u = getUltimo(id);
    if (!u) return "entrada";
    return u.tipo === "entrada" ? "salida" : "entrada";
  };

  const fichar = async (emp) => {
    const tipo = getTipo(emp.id);

    await addDoc(collection(db, "fichajes"), {
      nombre: emp.nombre,
      empleadoId: emp.id,
      tiendaId: emp.tiendaId || "",
      tipo,
      fecha: new Date()
    });

    setMensaje(`${emp.nombre} → ${tipo}`);
    setTimeout(()=>setMensaje(""),2000);
  };

  const card = {
    background: "white",
    borderRadius: 16,
    padding: 16,
    marginBottom: 15,
    boxShadow: "0 4px 10px rgba(0,0,0,0.05)"
  };

  return (
    <div style={{
      padding: 20,
      background: "#f1f5f9",
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center"
    }}>
      <div style={{ width: "100%", maxWidth: 500 }}>

        <h2 style={{ textAlign: "center" }}>⏱️ Fichar</h2>

        {mensaje && (
          <div style={{
            background: "#3b82f6",
            color: "white",
            padding: 10,
            borderRadius: 10,
            marginBottom: 10,
            textAlign: "center"
          }}>
            {mensaje}
          </div>
        )}

        {tiendas.map(t => {
          const lista = empleados.filter(e => e.tiendaId === t.id);

          if (lista.length === 0) return null;

          return (
            <div key={t.id} style={card}>
              <h3>{t.nombre}</h3>

              {lista.map(emp => {
                const tipo = getTipo(emp.id);

                return (
                  <div key={emp.id} style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 10
                  }}>

                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <img
                        src={emp.foto || "https://via.placeholder.com/50"}
                        style={{
                          width: 50,
                          height: 50,
                          borderRadius: "50%",
                          objectFit: "cover"
                        }}
                      />

                      <div>
                        <b>{emp.nombre}</b>
                        <div style={{ fontSize: 12 }}>
                          {emp.apellidos}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => fichar(emp)}
                      style={{
                        background: tipo === "entrada" ? "#22c55e" : "#ef4444",
                        color: "white",
                        border: "none",
                        borderRadius: 10,
                        padding: "8px 12px",
                        cursor: "pointer"
                      }}
                    >
                      {tipo === "entrada" ? "ENTRAR" : "SALIR"}
                    </button>

                  </div>
                );
              })}
            </div>
          );
        })}

      </div>
    </div>
  );
}

export default Fichar;