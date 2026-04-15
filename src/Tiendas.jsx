import { useEffect, useState } from "react";
import { db } from "./firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc
} from "firebase/firestore";

function Tiendas() {
  const [tiendas, setTiendas] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [form, setForm] = useState({ nombre: "" });
  const [seleccionada, setSeleccionada] = useState(null);

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

  const guardar = async () => {
    if (!form.nombre) return;

    await addDoc(collection(db, "tiendas"), form);
    setForm({ nombre: "" });
  };

  const eliminar = async (id) => {
    if (!confirm("Eliminar tienda")) return;
    await deleteDoc(doc(db, "tiendas", id));
  };

  const asignarEmpleado = async (emp, tiendaId) => {
    await updateDoc(doc(db, "empleados", emp.id), {
      tiendaId
    });
  };

  const card = {
    background: "white",
    borderRadius: 16,
    padding: 16,
    marginBottom: 15,
    boxShadow: "0 4px 10px rgba(0,0,0,0.05)"
  };

  const btn = (color) => ({
    padding: "6px 10px",
    borderRadius: 8,
    border: "none",
    cursor: "pointer",
    background: color,
    color: "white"
  });

  return (
    <div style={{
      background: "#f1f5f9",
      minHeight: "100vh",
      padding: 20
    }}>
      <div style={{ maxWidth: 500, margin: "0 auto" }}>

        <h2>🏪 Tiendas</h2>

        {/* CREAR TIENDA */}
        <div style={card}>
          <input
            placeholder="Nombre tienda"
            value={form.nombre}
            onChange={e => setForm({ nombre: e.target.value })}
          />

          <button style={btn("#3b82f6")} onClick={guardar}>
            ➕ Crear
          </button>
        </div>

        {/* LISTA */}
        {tiendas.map(t => (
          <div key={t.id} style={card}>

            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}>
              <b>{t.nombre}</b>

              <div>
                <button
                  style={btn("#ef4444")}
                  onClick={() => eliminar(t.id)}
                >
                  ❌
                </button>
              </div>
            </div>

            {/* EMPLEADOS */}
            <div style={{ marginTop: 10 }}>

              <b style={{ fontSize: 12 }}>Asignar empleados:</b>

              {empleados
  .filter(emp => emp.tiendaId === t.id)
  .map(emp => (
                <div
                  key={emp.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: 5
                  }}
                >
                  <span>{emp.nombre}</span>

                  <button
                    style={btn("#10b981")}
                    onClick={() => asignarEmpleado(emp, t.id)}
                  >
                    Añadir
                  </button>
                </div>
              ))}

            </div>

          </div>
        ))}

      </div>
    </div>
  );
}

export default Tiendas;