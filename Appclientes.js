const API_URLC = "http://localhost:8080/api/geniusbar/clientes";

document.addEventListener("DOMContentLoaded", listarClientes);

document.getElementById("form-cliente").addEventListener("submit", guardarCliente);

document.getElementById("cancelar").addEventListener("click", () => {
    document.getElementById("form-cliente").reset();
    document.getElementById("idCliente").value = "";
});

function limpiarForm(){
    document.getElementById("form-cliente").reset();
    document.getElementById("idCliente").value = "";
}

function listarClientes(){
    axios.get(API_URLC)
    .then((res) => {
        mostrarClientes(res.data);
    }).catch((error) => console.log("Error al listar clientes", error));
}

function mostrarClientes(clientes){
    const tbody = document.getElementById("tabla-clientes");
    tbody.innerHTML = "";
    clientes.map((cli) => {
        const fila = document.createElement("tr");
        fila.innerHTML = `
        <td>${cli.id}</td>
        <td>${cli.dni}</td>
        <td>${cli.nombre}</td>
        <td>${cli.correo}</td>
        <td>${cli.telefono}</td>
        <td  class="text-center">
        <button class="btn btn-warning btn-sm" onclick="editarCliente(${cli.id})">Editar</button>
        <button class="btn btn-danger btn-sm" onclick="eliminarCliente(${cli.id})">Eliminar</button>
        </td>
        `;
        tbody.appendChild(fila);
    })
}

function guardarCliente(e){
    e.preventDefault();

    const id = document.getElementById("idCliente").value;
    const clientes = {
        dni: document.getElementById("dni").value,
        nombre: document.getElementById("nombre").value,
        correo: document.getElementById("correo").value,
        telefono: document.getElementById("telefono").value
    }

    const metodo = id ? axios.put(`${API_URLC}/${id}`, clientes) : axios.post(API_URLC, clientes);

    metodo.then(() => {
        limpiarForm();
        listarClientes();
    }).catch((err) => console.log("Error al guardar cliente", err));
}

function editarCliente(id){
    axios.get(`${API_URLC}/${id}`)
    .then((res) => {
        const e = res.data;
        document.getElementById("idCliente").value = e.id;
        document.getElementById("dni").value = e.dni;
        document.getElementById("nombre").value = e.nombre;
        document.getElementById("correo").value = e.correo;
        document.getElementById("telefono").value = e.telefono;
    }).catch((err) => console.log("Error al editar cliente", err));
}


function eliminarCliente(id){
    axios.delete(`${API_URLC}/${id}`)
    .then(() => listarClientes())
    .catch((err) => console.log("Error al eliminar cliente", err));
}

function buscarPorNombre(nombreCliente){
    const nombre = nombreCliente.trim();
    if(nombre == ""){
        listarClientes();
    }

    axios.get(`${API_URLC}/busqueda/nombre/${nombre}`)
    .then((locate) => {
        mostrarClientes(locate.data);
    }).catch((err) => console.log("Error al buscar por nombre", err));

}

function buscarPorCorreo(correo){
    const correolim = correo.trim();
    if(correolim == ""){
        listarClientes();
    }
    axios.get(`${API_URLC}/busqueda/correo/${correolim}`)
    .then((locate) => {
        mostrarClientes(locate.data);
    }).catch((err) => console.log("Error al buscar por correo", err));
}

function buscarPorDNI(dni){
    const dnilim = dni.trim();
    if(dni == ""){
        listarClientes();
    }
    axios.get(`${API_URLC}/busqueda/${dnilim}`)
    .then((locate) => {
        console.log(locate.data);
        mostrarClientes([locate.data]);
    }).catch((err) => console.log("Error al buscar por dni", err));
}

function buscarPorTelefono(telefono){
    const telefonolim = telefono.trim();
    if(telefonolim == ""){
        listarClientes();
    }
    axios.get(`${API_URLC}/busqueda/telefono/${telefonolim}`)
    .then((locate) => {
        mostrarClientes(locate.data);
    }).catch((err) => console.log("Error al buscar por telefono", err));
}

    let timer;
    document.getElementById("search").addEventListener("input", function () {
        const texto = this.value.trim();
        clearTimeout(timer);
        timer = "";
        timer = setTimeout(() => {
            buscarPorNombre(texto);
        }, 400);
    });
    document.getElementById("search-correo").addEventListener("input", function () {
        const texto = this.value.trim();
        clearTimeout(timer);
        timer = "";
        timer = setTimeout(() => {
            buscarPorCorreo(texto);
        }, 400);
    });
    document.getElementById("search-dni").addEventListener("input", function () {
        const dni = this.value.trim();
        clearTimeout(timer);
        timer = "";
        timer = setTimeout(() => {
            buscarPorDNI(dni);
        }, 400);
    });
    document.getElementById("search-telefono").addEventListener("input", function () {
        const telefono = this.value.trim();
        clearTimeout(timer);
        timer = "";
        timer = setTimeout(() => {
            buscarPorTelefono(telefono);
        }, 400);
    });