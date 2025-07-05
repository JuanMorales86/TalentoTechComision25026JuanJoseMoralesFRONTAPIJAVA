//Url Para el EndPoint Producto
const API_URLP = 'http://localhost:8080/api/geniusbar/productos';

//mostrar listados de producto
document.addEventListener('DOMContentLoaded', listarProductos);

//Manejar el Form
document.getElementById('form-producto').addEventListener("submit", guardarProducto);

//Cancelar el Form
document.getElementById('cancelar').addEventListener('click', () => {
    //Limpiar el form
    document.getElementById('form-producto').reset();
    //borrar el id del producto oculto
    document.getElementById('idProducto').value = "";
});

//Listar Productos
function listarProductos() {
    axios.get(API_URLP)
    .then(response => {
        mostrarProductos(response.data);
    })//llenar la tabla
    .catch(error => console.log('Error al listar productos', error));
}

function mostrarProductos(producto) {
    const tbody = document.getElementById('tabla-productos')
        tbody.innerHTML = '';//limpiar la tabla
        producto.map(prod => {
            const fila = document.createElement('tr');
            fila.innerHTML = `
            <td>${prod.id}</td>
            <td>${prod.idInterno}</td>
            <td>${prod.nombreProducto}</td>
            <td>${prod.descripcionProducto}</td>
            <td>${prod.precioProducto}</td>
            <td>${prod.categoriaProducto}</td>
            <td>${prod.colorProducto}</td>
            <td>${prod.condicionProducto}</td>
            <td>${prod.observacionesProducto}</td>
            <td>
                <button class="btn btn-warning btn-sm" onclick="editarproducto(${prod.id})">Editar</button>
                <button class="btn btn-danger btn-sm" onclick="eliminarProducto(${prod.id})">Eliminar</button>
            </td>
            `;
            tbody.appendChild(fila);//Agregamos la fila al cuerpo de la tabla
        })
}

    //Guardar o Editar
    function guardarProducto(event){
        event.preventDefault();

        const id = document.getElementById('idProducto').value;
        const producto = {
            nombreProducto: document.getElementById('nombre').value,
            descripcionProducto: document.getElementById('descripcion').value,
            precioProducto: parseFloat(document.getElementById('precio').value),
            categoriaProducto: document.getElementById('categoria').value,
            colorProducto: document.getElementById('color').value,
            condicionProducto: document.getElementById('condicion').value,
            observacionesProducto: document.getElementById('observaciones').value
        };

        const metodo = id ? axios.put(`${API_URLP}/${id}`, producto) : axios.post(API_URLP, producto);

        metodo.then(() => {
            document.getElementById('form-producto').reset();
            document.getElementById('idProducto').value = "";
            listarProductos();
        }).catch(err => console.error('Error al guardar el producto', err));
    }

    //Cargar producto en el formulario para editarlo
    function editarproducto(id){
        axios.get(`${API_URLP}/${id}`)
        .then(res => {
            const p = res.data;
            document.getElementById('nombre').value = p.nombreProducto;
            document.getElementById('descripcion').value = p.descripcionProducto;
            document.getElementById('precio').value = p.precioProducto;
            document.getElementById('categoria').value = p.categoriaProducto;
            document.getElementById('color').value = p.colorProducto;
            document.getElementById('condicion').value = p.condicionProducto;
            document.getElementById('observaciones').value = p.observacionesProducto;
        }).catch(err => console.error('Error al cargar el producto', err));
    }

    //Eliminar producto
    function eliminarProducto(id){
        if(!confirm('¿Estás seguro de eliminar este producto?')) return;
        axios.delete(`${API_URLP}/${id}`).then(() => listarProductos()).catch(error => console.error('Error al eliminar el producto', error));
    }

    function buscarPorNombre(nombreProducto){
    const limpio = nombreProducto.trim();
    if(limpio === ''){
        listarProductos();
        return;
    }

    axios.get(`${API_URLP}/busqueda/nombre/${limpio}`).then(response => {
        mostrarProductos(response.data);
    })
    .catch(error => console.log('Error al buscar productos', error));
}

function buscarPorNombreLike(nombreLike){
    const limpio = nombreLike.trim();
    if(limpio === ''){
        listarProductos();
        return;
    }
    axios.get(`${API_URLP}/busqueda/nombre/like/${limpio}`).then(response => {
        mostrarProductos(response.data);
    })
    .catch(error => console.log('Error al buscar productos', error));
}

    // Debounce para evitar llamadas repetidas mientras se escribe
    let timer;
    document.getElementById("search").addEventListener("input", function () {
        const texto = this.value.trim();
        clearTimeout(timer);
        timer = setTimeout(() => {
            buscarPorNombre(texto);
        }, 400);
    });

       let timer2;
    document.getElementById("search-like").addEventListener("input", function () {
        const texto = this.value.trim();
        clearTimeout(timer);
        timer = setTimeout(() => {
            buscarPorNombreLike(texto);
        }, 400);
    });

