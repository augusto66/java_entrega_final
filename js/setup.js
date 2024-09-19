document.addEventListener('DOMContentLoaded', () => {
    configurarFechaMinima();
    establecerFechaActual();
    establecerFechaFiltroActual();
    mostrarReservasPorFecha(new Date().toISOString().split('T')[0]);
    console.log('Configuración inicial completada.');
});

function configurarFechaMinima() {
    const hoy = new Date().toISOString().split('T')[0];
    document.getElementById('dia').setAttribute('min', hoy);
}

function establecerFechaActual() {
    const hoy = new Date().toISOString().split('T')[0];
    document.getElementById('dia').value = hoy;
}

function establecerFechaFiltroActual() {
    const hoy = new Date().toISOString().split('T')[0];
    document.getElementById('fechaFiltro').value = hoy;
}