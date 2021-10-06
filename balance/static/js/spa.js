// xhr es un objeto capaz de hacer peticiones
// es buena costumbre crear un new XMLH para cada petición.
const listaMovientosRequest = new XMLHttpRequest()
const cambiaMovimientosRequest = new XMLHttpRequest()
// url que va a ser una constante para todo, es la raíz de la petición siempre
const root_host = "http://127.0.0.1:5000/api/v1.0/"

function respuestaAltaMovimiento() {
    if (this.readyState === 4 && this.status ===200) {

        const form = document.querySelector("#formulario-movimiento")
        form.classList.add("inactivo")

        const url = `${root_host}movimientos`
        listaMovientosRequest.open("GET", url, true)
        listaMovientosRequest.onload = muestraMovimientos
        listaMovientosRequest.send()

    } else {
        alert ("Se ha producido un error en el alta")
    }
}

function muestraMovimientos() {
    if (this.readyState === 4 && this.status ===200) {
        // responseText es el body de la respuesta
        // .parse conviernte el json en un objeto de javascript
        const respuesta = JSON.parse(this.responseText)
        const movimientos = respuesta.movimientos
        // document es una api de JS, que permite consultar y modificar el DOM
        const tabla = document.querySelector("#tabla-datos")

        let innerHTML = ""

        for (let i=0; i < movimientos.length; i++) {
            innerHTML = innerHTML +
            `<tr>
                <td>${movimientos[i].fecha}</td>
                <td>${movimientos[i].concepto}</td>
                <td>${movimientos[i].ingreso_gasto}</td>
                <td>${movimientos[i].cantidad}</td>
            </tr>`
        }
        // inyectmos los elementos en el html / texto
        tabla.innerHTML = innerHTML
    } else {
        alert("Se ha producido un error")
    }
}

function hazVisibleForm(ev) {
    ev.preventDefault()

    // recuperarmos el formulario de nuevo movimiento 
    // modificamos el DOM, removemos de estados class "inactivo"
    const form = document.querySelector("#formulario-movimiento")
    form.classList.remove("inactivo")
}

function altaMovimiento(ev) {
    ev.preventDefault()

    // debemos coger del formulario todos los value y montar un json para marsela a la base de datos 

    const fecha = document.querySelector("#fecha").value
    const concepto = document.querySelector("#concepto").value
    const ingreso_gasto = document.querySelector('input[name="ingreso_gasto"]:checked').value
    const cantidad = document.querySelector("#cantidad").value

    // creamos el json que vamos a mandar en la petición POST
    json = {"fecha": fecha, "concepto": concepto, "ingreso_gasto": ingreso_gasto, "cantidad": cantidad}

    const url = `${root_host}movimiento`
    cambiaMovimientosRequest.open("POST", url, true)
    // le decimos que el contenido, en puro HTMLOutputElement, es de tipo json
    cambiaMovimientosRequest.setRequestHeader("Content-Type", "application/json")
    cambiaMovimientosRequest.onload = respuestaAltaMovimiento
    // cuando queremos trasformar un objet en json en un petición usamos stringify 
    cambiaMovimientosRequest.send(JSON.stringify(json))
}

window.onload = function() {
    const url = `${root_host}movimientos`
    listaMovientosRequest.open("GET", url, true)
    // una vez hecha la petición indicamos qué funcion se debe ejecutar
    // la función en sí en hace falta crearse dentro del onload, se puede crear fuera, porque no se ejecuta hasta que la ventana no esté cargada
    listaMovientosRequest.onload = muestraMovimientos
    listaMovientosRequest.send()

    // recuperamos el botón el boton
    // hacemos la escucha del evento   
    const btnNuevo = document.querySelector("#btn-alta")
    btnNuevo.addEventListener("click",hazVisibleForm)

    const btnEnviar = document.querySelector("#btn-enviar")
    btnEnviar.addEventListener("click", altaMovimiento)


}