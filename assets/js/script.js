let eventos = [];
let alm = [];
const nombre_evento = document.querySelector("#nombre_evento");
const fecha_evento = document.querySelector("#fecha_evento");
const btn_agregar = document.querySelector("#agregar");
const lista_eventos = document.querySelector("#lista_eventos");
const json = cargar();
try {
    alm = JSON.parse(json);
} catch (error) {
    alm = [];
}
eventos = alm ? [...alm] : [];
mostrar_evento();
document.querySelector("form").addEventListener("submit", e => {
    e.preventDefault();
    agregar_evento();
});
function agregar_evento() {
    if (nombre_evento.value === "" || fecha_evento.value === ""){
        return;
    } 
    if (diferencia_fecha(fecha_evento.value) < 0) /* Esto evalua la diferencia de días */ {
        return;
    }
    // Dentro de esta constante se va a construir el JSON
    const nuevo_evento = {
        // Este parte del codigo lo que hace es asignar un ID para cada uno
        id: (Math.random() * 100).toString(36).slice(3),
        nombre: nombre_evento.value,
        fecha: fecha_evento.value,
    };
    eventos.unshift(nuevo_evento);
    guardar(JSON.stringify(eventos));
    nombre_evento.value = "";
    mostrar_evento();
}
function diferencia_fecha(destino) {
    let fecha_destino = new Date(destino);
    let fecha_actual = new Date();
    let diferencia = fecha_destino.getTime() - fecha_actual.getTime();
    // Ceil aproxima al entero mas cercano
    let dias = Math.ceil(diferencia / (1000 * 3600 * 24)); // Formula para sacar la fecha exacta
    return dias;
}
function mostrar_evento() {
    const evento_HTML = eventos.map((evento) => {
        return `
            <style>
                .evento {
                    display: flex;
                    justify-content: space-between;
                    justify-content: center;
                    align-items: center;
                    gap: 5rem;
                    border: 2px solid black;
                    border-radius: 20px;
                    padding: 20px;
                    margin: 10px;
                    width: 600px;
                }
                .dias {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    margin-left: 10px;
                    border-radius: 10px;
                }
                .dias_faltantes {
                    color: white;
                    font-size: 1.5rem;
                }
                .texto {
                    display: flex;
                    flex-direction: column;
                }
                .nombre_evento {
                    width: 100px;
                }
                .eliminar {
                    border: none;
                    width: 100px;
                    height: 50px;
                    border-radius: 5px;
                    background: #39ff76;
                    cursor: pointer; 
                }
                .eliminar:hover {
                    background: red;
                }
            </style>
            <div class="caja_principal">
                <div class="evento">
                    <div class="dias">
                        <span class="dias_faltantes">${diferencia_fecha(evento.fecha)}</span>
                        <span class="texto">días<br>para</span> 
                    </div>
                    <div class="nombre_evento">${evento.nombre}</div>
                    <div class="fecha_evento">${evento.fecha}</div>
                    <div class="acciones">
                        <button data-id="${evento.id}" class="eliminar">Eliminar</button>
                    </div>
                </div>
            </div>
        `;
    });
    lista_eventos.innerHTML = evento_HTML.join("");
    document.querySelectorAll(".eliminar").forEach(button => {
        button.addEventListener("click", e => {
            const id = button.getAttribute("data-id");
            eventos = eventos.filter(evento => evento.id !== id);
            guardar(JSON.stringify(eventos));
            mostrar_evento();
        });
    });
}
function guardar(datos) {
    localStorage.setItem("lista", datos);
}
function cargar() {
    return localStorage.getItem("lista");
}