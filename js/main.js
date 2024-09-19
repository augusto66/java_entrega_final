document.addEventListener('DOMContentLoaded', function () {
    configurarIntervaloHoras();
    configurarFechaMinima();
    document.getElementById('reservaForm').addEventListener('submit', manejarReserva);
    document.getElementById('filtrarBtn').addEventListener('click', filtrarReservasPorFecha);
    
    // Establece la fecha actual por defecto en el campo de filtro y muestra las reservas del día actual
    establecerFechaFiltroActual();
    mostrarReservasPorFecha(new Date().toISOString().split('T')[0]);
});

function configurarFechaMinima() {
    const hoy = new Date().toISOString().split('T')[0];
    document.getElementById('dia').setAttribute('min', hoy);
}

function configurarIntervaloHoras() {
    const horas = [];
    const minutos = ['00', '30'];

    for (let h = 10; h < 24; h++) {
        for (let m = 0; m < minutos.length; m++) {
            horas.push((h < 10 ? '0' : '') + h + ':' + minutos[m]);
        }
    }

    const timeInput = document.getElementById('hora');
    timeInput.setAttribute('list', 'time-options');

    const datalist = document.createElement('datalist');
    datalist.id = 'time-options';

    horas.forEach(function (time) {
        const option = document.createElement('option');
        option.value = time;
        datalist.appendChild(option);
    });

    document.body.appendChild(datalist);
}

function formatearFecha(fecha) {
    let [year, month, day] = fecha.split('-');
    return `${day}-${month}-${year}`;
}

function manejarReserva(event) {
    event.preventDefault();

    let nombre = document.getElementById('nombre').value;
    let dia = document.getElementById('dia').value;
    let hora = document.getElementById('hora').value;

    let reservas = JSON.parse(localStorage.getItem('reservas')) || [];
    let reservaExistente = reservas.some(reserva => reserva.dia === dia && reserva.hora === hora);

    if (reservaExistente) {
        Swal.fire({
            title: '¡Ups! Lo Siento!',
            text: `El turno para el ${formatearFecha(dia)} a las ${hora} ya está ocupado.`,
            icon: 'error',
            confirmButtonText: 'Aceptar'
        });
    } else {
        let nuevaReserva = { nombre, dia, hora };
        reservas.push(nuevaReserva);
        localStorage.setItem('reservas', JSON.stringify(reservas));

        Swal.fire({
            title: '¡Reserva confirmada!',
            text: `Reserva confirmada para ${nombre} el ${formatearFecha(dia)} a las ${hora}.`,
            icon: 'success',
            confirmButtonText: 'Aceptar'
        });

        // Resetea el formulario después de guardar la reserva
        document.getElementById('reservaForm').reset();

        // Actualiza la tabla de reservas
        mostrarReservasPorFecha(dia);
    }
}

function establecerFechaFiltroActual() {
    const hoy = new Date().toISOString().split('T')[0];
    document.getElementById('fechaFiltro').value = hoy;
}

function mostrarReservasPorFecha(fecha) {
    let reservas = JSON.parse(localStorage.getItem('reservas')) || [];
    let reservasList = document.getElementById('reservasList');
    reservasList.innerHTML = '';

    if (reservas.length === 0) {
        reservasList.innerHTML = '<tr><td colspan="4">No hay reservas.</td></tr>';
    } else {
        let reservasFiltradas = reservas.filter(reserva => reserva.dia === fecha);

        if (reservasFiltradas.length === 0) {
            reservasList.innerHTML = '<tr><td colspan="4">No hay reservas para esta fecha.</td></tr>';
        } else {
            reservasFiltradas.forEach((reserva, index) => {
                let [year, month, day] = reserva.dia.split('-');
                let fechaFormateada = `${day}-${month}-${year}`;

                let row = document.createElement('tr');
                row.innerHTML = `
                    <td>${reserva.nombre}</td>
                    <td>${fechaFormateada}</td>
                    <td>${reserva.hora}</td>
                    <td><button class="delete-button" data-index="${index}">Borrar</button></td>
                `;
                reservasList.appendChild(row);
            });

            // Agregar eventos a los botones de borrar
            document.querySelectorAll('.delete-button').forEach(button => {
                button.addEventListener('click', borrarReserva);
            });
        }
    }

    reservasList.style.display = 'table-row-group';
}

function borrarReserva(event) {
    const index = event.target.getAttribute('data-index');
    let reservas = JSON.parse(localStorage.getItem('reservas')) || [];

    reservas.splice(index, 1);
    localStorage.setItem('reservas', JSON.stringify(reservas));

    // Actualiza la tabla de reservas con la fecha actual del filtro
    mostrarReservasPorFecha(document.getElementById('fechaFiltro').value);
}

async function enviarDatosReserva(reserva) {
    try {
        let response = await fetch('https://jsonplaceholder.typicode.com/posts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(reserva)
        });

        if (!response.ok) {
            throw new Error('Error al enviar los datos al servidor');
        }

        let data = await response.json();
        console.log('Datos enviados con éxito:', data);
    } catch (error) {
        console.error('Hubo un problema con la solicitud Fetch:', error);
    }
}

function filtrarReservasPorFecha() {
    let fechaFiltro = document.getElementById('fechaFiltro').value;
    mostrarReservasPorFecha(fechaFiltro);
}