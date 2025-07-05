//Url Para el EndPoint Producto
const API_URLP = "http://localhost:8080/api/geniusbar/pedidos";
const API_URLPROD = "http://localhost:8080/api/geniusbar/productos";

//mostrar listados de producto
document.addEventListener("DOMContentLoaded", () => {listarPedidos(), mostrarProductosEnTabla()});
document.getElementById("search-fecha").addEventListener("change", busquedaPorFecha)

//Manejar el Form
document
  .getElementById("form-pedidos")
  .addEventListener("submit", guardarProducto);

//Cancelar el Form
document.getElementById("cancelar").addEventListener("click", () => {
  limpiarForm();
});

//Mostrar Productos en la tabla
function toggleMuestrario() {
  const muestrario = document.getElementById("muestrario-productos");
  muestrario.classList.toggle("d-none");
}

function limpiarForm(){
  document.getElementById("form-pedidos").reset();
  document.getElementById("idPedido").value = "";
  document.getElementById("body-detalles").innerHTML = "";
  document.getElementById("detallePedido").classList.add("d-none");
  document.getElementById("detallePedido").innerHTML = "";
  document.getElementById("cliente_id").disabled = false;
  listarPedidos();
}

//Listar Productos
function listarPedidos() {
  axios
    .get(API_URLP)
    .then((response) => {
      console.log(response.data);
      mostrarPedidos(response.data);
    }) //llenar la tabla
    .catch((error) => console.log("Error al listar pedidos", error));
}

function mostrarPedidos(pedidos) {
  const tbody = document.getElementById("tabla-pedidos");
  tbody.innerHTML = ""; //limpiar la tabla
  pedidos.map((ped) => {
    const fila = document.createElement("tr");
    fila.innerHTML = `
            <td>${ped.id}</td>
            <td>${ped.idCliente}</td>
            <td>${ped.nombreCliente}</td>
            <td>${ped.direccionPedido}</td>
            <td>${ped.estadoPedido}</td>
            <td>${new Date(ped.fechaPedido).toLocaleString()}</td>
            <td>
            <button class="btn btn-info btn-sm" onclick="mostrarDetalles(${
              ped.id
            })">Ver detalles</button>
                <button class="btn btn-warning btn-sm" onclick="editarPedido(${
                  ped.id
                })">Editar</button>
                <button class="btn btn-danger btn-sm" onclick="eliminarPedido(${
                  ped.id
                })">Eliminar</button>
            </td>
            `;
    tbody.appendChild(fila); //Agregamos la fila al cuerpo de la tabla
  });
}

function mostrarProductosEnTabla() {
  axios.get('http://localhost:8080/api/geniusbar/productos')
    .then(res => {
      const productos = res.data;
      const tbody = document.getElementById("body-mostrardetalleproductos");
      tbody.innerHTML = "";

      productos.forEach(p => {
        const fila = document.createElement("tr");
        fila.innerHTML = `
          <td>${p.id}</td>
          <td>${p.nombreProducto}</td>
          <td>${p.colorProducto}</td>
          <td>${p.condicionProducto}</td>
        `;
        tbody.appendChild(fila);
      });
    })
    .catch(err => console.error("Error al mostrar productos en el muestrario", err));
}

let ultimoPedidoMostrado = null;

function mostrarDetalles(idPedido) {
    
    const contenedor = document.getElementById("detallePedido");

  // Si ya se está mostrando ese mismo pedido, ocultarlo
  if (ultimoPedidoMostrado === idPedido) {
    contenedor.classList.add("d-none");
    contenedor.innerHTML = "";
    ultimoPedidoMostrado = null;
    return;
  }
  axios
    .get(`http://localhost:8080/api/geniusbar/pedidos/${idPedido}`)
    .then((res) => {
      const pedido = res.data;
      const detalles = pedido.detalles;

      let html = `
      <div class="container-fluid bg-dark text-white w-100">
      <span class="">Detalles del Pedido #${pedido.id}</span>
      </div>`;
      html += `
        <table class="table table-sm table-bordered">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Cantidad</th>
              <th>Precio Unitario</th>
            </tr>
          </thead>
          <tbody>
      `;
      detalles.forEach((d) => {
        html += `
          <tr>
            <td>${d.producto.nombreProducto}</td>
            <td>${d.cantidad}</td>
            <td>$${d.precioUnitario}</td>
          </tr>
        `;
      });
      html += "</tbody></table>";

      
      contenedor.innerHTML = html;// Agregar el HTML al contenedor
      contenedor.classList.remove("d-none");// Mostrar el contenedor
      ultimoPedidoMostrado = idPedido;// Actualizar el último pedido mostrado

    })
    .catch((err) => console.error("Error al obtener detalles del pedido", err));
}

function agregarDetalle() {
  const tbody = document.getElementById("body-detalles");
  const fila = document.createElement("tr");

  fila.innerHTML = `
    <td><input type="number" class="form-control id-producto" required></td>
    <td><input type="text" class="form-control nombre-producto" disabled></td>
    <td><input type="number" class="form-control cantidad-producto" required></td>
    <td><input type="number" class="form-control precio-unitario" required></td>
    <td><button type="button" class="btn btn-danger btn-sm" onclick="this.closest('tr').remove()">X</button></td>
  `;

  tbody.appendChild(fila);

  // Obtener automáticamente el nombre y precio
  const idInput = fila.querySelector(".id-producto");
  const nombreInput = fila.querySelector(".nombre-producto");
  const precioInput = fila.querySelector(".precio-unitario");

  idInput.addEventListener("change", () => {
    const id = idInput.value;
    if (!id) return;

    axios.get(`${API_URLPROD}/${id}`)
      .then(res => {
        nombreInput.value = res.data.nombreProducto;
        precioInput.value = res.data.precioProducto;
      })
      .catch(() => {
        nombreInput.value = "";
        precioInput.value = "";
      });
  });
}



//Guardar o Editar
function guardarProducto(event) {
  event.preventDefault();

  const id = document.getElementById("idPedido").value;
  const clientID = document.getElementById("cliente_id").value;

  // Armamos correctamente el array de detalles
  const filas = document.querySelectorAll("#body-detalles tr");
  const detalles = [];

  filas.forEach((fila) => {
  const idProd = fila.querySelector(".id-producto").value;
  const cantidad = fila.querySelector(".cantidad-producto").value;
  const precio = fila.querySelector(".precio-unitario").value;

  if (idProd && cantidad && precio) {
    detalles.push({
      producto: { id: parseInt(idProd) },
      cantidad: parseInt(cantidad),
      precioUnitario: parseFloat(precio)
    });
  }
});

  // Armado del pedido completo
  const pedido = {
    direccionPedido: document.getElementById("direccion").value,
    estadoPedido: document.getElementById("estado").value,
    detalles: detalles,
  };

  // PUT lleva cliente dentro del body
  if (id) {
    pedido.cliente = { id: parseInt(clientID) };

    axios
      .put(`${API_URLP}/${id}`, pedido)
      .then(() => {
        limpiarForm();
      })
      .catch((err) => console.error("Error al actualizar pedido", err));
  } else {
    // POST lleva cliente en la URL
    axios
      .post(`${API_URLP}/${clientID}`, pedido)
      .then(() => {
        limpiarForm();
      })
      .catch((err) => console.error("Error al crear pedido", err));
  }
}

function agregarDetalleConDatos(detalle) {
  const tbody = document.getElementById("body-detalles");
  const fila = document.createElement("tr");

  fila.innerHTML = `
    <td><input type="number" class="form-control id-producto" value="${detalle.producto.id}" required></td>
    <td><input type="text" class="form-control nombre-producto" value="${detalle.producto.nombreProducto}" disabled></td>
    <td><input type="number" class="form-control cantidad-producto" value="${detalle.cantidad}" required></td>
    <td><input type="number" class="form-control precio-unitario" value="${detalle.precioUnitario}" required></td>
    <td><button type="button" class="btn btn-danger btn-sm" onclick="this.closest('tr').remove()">X</button></td>
  `;

  tbody.appendChild(fila);
}

//Cargar producto en el formulario para editarlo
function editarPedido(id) {
  limpiarForm();
  axios
    .get(`${API_URLP}/${id}`)
    .then((res) => {
      const p = res.data;
      const d = p.detalles;
      document.getElementById("idPedido").value = p.id;
      document.getElementById("cliente_id").value = p.idCliente;
      document.getElementById("direccion").value = p.direccionPedido;
      document.getElementById("estado").value = p.estadoPedido;
      document.getElementById("cliente_id").disabled = true;
      document.getElementById("body-detalles").innerHTML = "";
      d.forEach((detalle) => {
        agregarDetalleConDatos(detalle);
      });
    })
    .catch((err) => console.error("Error al cargar el pedido", err));
}

//Eliminar producto
function eliminarPedido(id) {
  if (!confirm("¿Estás seguro de eliminar este pedido?")) return;
  axios
    .delete(`${API_URLP}/${id}`)
    .then(() => listarPedidos())
    .catch((error) => console.error("Error al eliminar el pedido", error));
}



//!Busquedas
function buscarPorEstadoPedido(estadoPedido) {
  const limpio = estadoPedido.trim();
  if (limpio === "") {
    listarPedidos();
    return;
  }

  axios
    .get(`${API_URLP}/busqueda/estado/${limpio}`)
    .then((response) => {
      mostrarPedidos(response.data);
    })
    .catch((error) => console.log("Error al buscar pedidos por estado", error));
}

function buscarPorClienteID(clienteId) {
  const limpio = clienteId.trim();
  if (limpio === "") {
    listarPedidos();
    return;
  }
  axios
    .get(`${API_URLP}/busqueda/cliente/${limpio}`)
    .then((response) => {
      mostrarPedidos(response.data);
    })
    .catch((error) => console.log("Error al buscar clientes por id", error));
}

function busquedaPorFecha(){
  const fecha = document.getElementById("search-fecha").value;
  if(!fecha) return;
  console.log(fecha);

  axios.get(`${API_URLP}/busqueda/fecha?fecha=${fecha}`)
  .then((res) => {
    mostrarPedidos(res.data);
  }).catch((error) => console.log("Error al buscar pedidos por fecha", error));
}


// Debounce para evitar llamadas repetidas mientras se escribe
let timer;
document.getElementById("search-estado").addEventListener("input", function () {
  const texto = this.value.trim();
  clearTimeout(timer);
  timer = setTimeout(() => {
    buscarPorEstadoPedido(texto);
  }, 400);
});

let timer2;
document.getElementById("search-clienteid").addEventListener("input", function () {
  const numero = this.value.trim();
  clearTimeout(timer);
  timer = setTimeout(() => {
    buscarPorClienteID(numero);
  }, 400);
});
//!Fin Busquedas