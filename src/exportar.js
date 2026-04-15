export function exportarExcel(fichajes) {
  let csv = "Nombre,Fecha,Tipo\n";

  fichajes.forEach(f => {
    const fecha = new Date(f.fecha.seconds * 1000)
      .toLocaleString();

    csv += `${f.nombre},${fecha},${f.tipo}\n`;
  });

  const blob = new Blob([csv], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "fichajes.csv";
  a.click();
}