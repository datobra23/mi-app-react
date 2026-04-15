export const calcularHoras = (fichajes) => {
  let total = 0;

  for (let i = 0; i < fichajes.length; i += 2) {
    const entrada = fichajes[i];
    const salida = fichajes[i + 1];

    if (entrada && salida) {
      const inicio = new Date(entrada.fecha.seconds * 1000);
      const fin = new Date(salida.fecha.seconds * 1000);

      total += (fin - inicio);
    }
  }

  return (total / 1000 / 60 / 60).toFixed(2);
};