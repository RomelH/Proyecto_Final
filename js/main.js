//Defino mi array de productos donde importaremos desde JSON
let productos = [];
fetch("./js/productos.json")
    .then(response => response.json())
    .then(data => {
        productos = data;
        renderProductos(productos)
    })
    .catch(err => {
        console.log(err);
    })
// Local storage
const guardarProductosLS = (productos)=>{
    localStorage.setItem("productos", JSON.stringify(productos));
}

const obtenerProductosLS =()=>{
    return JSON.parse(localStorage.getItem("productos"))|| [];
}

const guardarCarritoLS = (productos)=>{
    localStorage.setItem("productos-en-carrito", JSON.stringify(productos));
}

const obtenerCarritoLS =()=>{
    return JSON.parse(localStorage.getItem("productos-en-carrito"))|| [];
}

const contenedorProductos = document.querySelector("#container-items");
const botonCarrito = document.querySelector(".container-cart-icon");
const containerCartProduct = document.querySelector(".container-cart-products");
let botonesAgregar =document.querySelectorAll(".item-agregar");
const cantidadProductoCarrito = document.querySelector("#contador-productos");

function renderProductos(productos){
    
    productos.forEach(producto => {
        console.log(contenedorProductos)
        const div = document.createElement("div");
        div.classList.add("item");
        div.innerHTML = `
            <figure>
            <img
                src="${producto.imagen}"
                alt="producto"
            />
            </figure>
            <div class="info-product">
            <h2>${producto.id}:${producto.nombre}</h2>
            <p class="price">$${producto.precio}</p>
            <button class="item-agregar" id="${producto.id}">Añadir</button>
            </div>
        `;
        contenedorProductos.append(div);
    })
    actualizarBotonesAgregar(); 
    
}
guardarProductosLS(productos);
if(contenedorProductos){
    renderProductos(productos);
}

// Funcionalidad carrito: visualiza productos agregados al carrito
function actualizarBotonesAgregar(){
    botonesAgregar = document.querySelectorAll(".item-agregar");
    botonesAgregar.forEach(boton => {
        boton.addEventListener("click", agregarAlCarrito);
    });
}

let productosEnCarrito;

let productosEnCarritoLS = localStorage.getItem("productos-en-carrito");

if (productosEnCarritoLS) {
    productosEnCarrito = JSON.parse(productosEnCarritoLS);
    actualizarCantidadProductoCarrito();
} else {
    productosEnCarrito = [];
}

function agregarAlCarrito(e){
    Toastify({
        text: "Producto Agregado",
        duration: 1500,
        close: true,
        gravity: "", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
          background: "linear-gradient(to right, #be8f21, #785ce9)",
          borderRadius: "2rem",
          textTransform: "uppercase",
          fontSize: ".75rem"
        },
        offset: {
            x: '1.5rem', // horizontal axis - can be a number or a string indicating unity. eg: '2em'
            y: '1.5rem' // vertical axis - can be a number or a string indicating unity. eg: '2em'
          },
        onClick: function(){} // Callback after click
      }).showToast(); 
    const idBoton = parseInt(e.currentTarget.id);
    const productoAgregado = productos.find(item => item.id === idBoton);
    
    if(productosEnCarrito.some(producto => producto.id === idBoton)) {
        const index = productosEnCarrito.findIndex(producto => producto.id === idBoton);
        productosEnCarrito[index].cantidad++;
    } else {
        productoAgregado.cantidad = 1;
        productosEnCarrito.push(productoAgregado);
    }

    actualizarCantidadProductoCarrito();

    localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
    
}

function actualizarCantidadProductoCarrito(){
    let nuevoNumerito = productosEnCarrito.reduce((acc, producto) => acc + producto.cantidad, 0);
    cantidadProductoCarrito.innerText = nuevoNumerito;
}
botonCarrito.addEventListener("click",() => {
    actualizarCantidadProductoCarrito();
});

