export const exportCSV = (data) => {
  const rows = [
    ["Nombre", "Tipo", "Fecha"],
    ...data.map(f => [
      f.nombre,
      f.tipo,
      new Date(f.fecha.seconds * 1000).toLocaleString()
    ])
  ];

  const csv = rows.map(r => r.join(",")).join("\n");

  const blob = new Blob([csv], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "fichajes.csv";
  a.click();
};