import { useEffect, useState } from "react";
import { db } from "./firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  doc,
  updateDoc
} from "firebase/firestore";

function Admin() {
  const [empleados, setEmpleados] = useState([]);
  const [tiendas, setTiendas] = useState([]);

  const [form, setForm] = useState({
    nombre: "",
    apellidos: "",
    foto: "",
    tiendaId: ""
  });

  const [editando, setEditando] = useState(null);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "empleados"), snap => {
      setEmpleados(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "tiendas"), snap => {
      setTiendas(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

  const guardar = async () => {
    if (!form.nombre) return;

    if (editando) {
      await updateDoc(doc(db, "empleados", editando), form);
    } else {
      await addDoc(collection(db, "empleados"), form);
    }

    setForm({
      nombre: "",
      apellidos: "",
      foto: "",
      tiendaId: ""
    });

    setEditando(null);
  };

  const editar = (emp) => {
    setForm(emp);
    setEditando(emp.id);
  };

  const card = {
    background: "white",
    borderRadius: 16,
    padding: 16,
    marginBottom: 15,
    boxShadow: "0 4px 10px rgba(0,0,0,0.05)"
  };

  const input = {
    width: "100%",
    padding: 10,
    borderRadius: 10,
    border: "1px solid #e5e7eb",
    marginBottom: 10
  };

  const btn = (color) => ({
    padding: "8px 12px",
    borderRadius: 10,
    border: "none",
    cursor: "pointer",
    background: color,
    color: "white"
  });

  return (
    <div style={{
      background:"#f1f5f9",
      minHeight:"100vh",
      padding:20
    }}>
      <div style={{ maxWidth:500, margin:"0 auto" }}>

        <h2>👥 Empleados</h2>

        {/* FORM */}
        <div style={card}>

          <input
            style={input}
            placeholder="Nombre"
            value={form.nombre}
            onChange={e=>setForm({...form,nombre:e.target.value})}
          />

          <input
            style={input}
            placeholder="Apellidos"
            value={form.apellidos}
            onChange={e=>setForm({...form,apellidos:e.target.value})}
          />

          <input
            style={input}
            placeholder="Foto URL"
            value={form.foto}
            onChange={e=>setForm({...form,foto:e.target.value})}
          />

          <select
            style={input}
            value={form.tiendaId}
            onChange={e=>setForm({...form,tiendaId:e.target.value})}
          >
            <option value="">Seleccionar tienda</option>
            {tiendas.map(t => (
              <option key={t.id} value={t.id}>
                {t.nombre}
              </option>
            ))}
          </select>

          <button style={btn("#3b82f6")} onClick={guardar}>
            💾 Guardar
          </button>

        </div>

        {/* LISTA */}
        {empleados.map(emp => (
          <div key={emp.id} style={card}>

            <div style={{
              display:"flex",
              justifyContent:"space-between",
              alignItems:"center"
            }}>

              <div style={{ display:"flex", gap:10, alignItems:"center" }}>

                <img
                  src={emp.foto || "https://via.placeholder.com/50"}
                  style={{
                    width:50,
                    height:50,
                    borderRadius:"50%",
                    objectFit:"cover"
                  }}
                />

                <div>
                  <b>{emp.nombre} {emp.apellidos}</b>

                  <div style={{ fontSize:12 }}>
                    🏪 {
                      tiendas.find(t => t.id === emp.tiendaId)?.nombre || "Sin tienda"
                    }
                  </div>
                </div>

              </div>

              <button style={btn("#f59e0b")} onClick={()=>editar(emp)}>
                ✏️
              </button>

            </div>

          </div>
        ))}

      </div>
    </div>
  );
}

export default Admin;