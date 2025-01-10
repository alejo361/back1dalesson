const socket = io()

const contenedorProductosRTP = document.querySelector('.products-container-rtp')

/*socket.on('realtime', (data)=>{
    contenedorProductosRTP.innerHTML = ''
    data.forEach(product => {
        const div = document.createElement('div')
        div.classList.add(`${product.id}`,'cart')

        const id = document.createElement('p')
        id.innerText = id.title
        const title = document.createElement('p')
        title.innerText = product.title
        const description = document.createElement('p')
        description.innerText = product.description
        const price = document.createElement('p')
        price.innerText = '$ ' + product.price
        const code = document.createElement('p')
        code.innerText = product.code
        const stock = document.createElement('p')
        stock.innerText = product.stock
        const category = document.createElement('p')
        category.innerText = product.category

        div.appendChild(id)
        div.appendChild(title)
        div.appendChild(description)
        div.appendChild(price)
        div.appendChild(code)
        div.appendChild(stock)
        div.appendChild(category)
        contenedorProductosRTP.appendChild(div)
    });
    
})*/

socket.on('realtime', (data) => {
    contenedorProductosRTP.innerHTML = '';  // Limpiar el contenedor antes de agregar nuevos productos
    
    // Crear una fila para los productos
    const row = document.createElement('div');
    row.classList.add('row', 'g-3');  // Añadimos la clase 'row' y un espacio entre los elementos con 'g-3'
    
    data.forEach(product => {
        // Crear una columna para cada producto
        const col = document.createElement('div');
        col.classList.add('col-12', 'col-md-4', 'col-lg-3');  // Responsivo, se adapta a diferentes tamaños de pantalla
        
        // Crear el div del producto y agregarle las clases de Bootstrap para los estilos
        const div = document.createElement('div');
        div.classList.add('card', 'h-100', 'p-2');  // Usamos 'card' para el estilo y 'h-100' para hacer las tarjetas de igual altura
        

        // Crear el contenido de la tarjeta
        const id = document.createElement('p');
        id.classList.add('card-text');  // Añadimos una clase para el estilo
        id.innerText = `ID: ${product.id}`;

        const title = document.createElement('h5');
        title.classList.add('card-title');  // Añadimos una clase para el estilo
        title.innerText = product.title;

        const description = document.createElement('p');
        description.classList.add('card-text');
        description.innerText = product.description;

        const price = document.createElement('p');
        price.classList.add('card-text');
        price.innerText = '$ ' + product.price;

        const code = document.createElement('p');
        code.classList.add('card-text');
        code.innerText = `Código: ${product.code}`;

        const stock = document.createElement('p');
        stock.classList.add('card-text');
        stock.innerText = `Stock: ${product.stock}`;

        const category = document.createElement('p');
        category.classList.add('card-text');
        category.innerText = `Categoría: ${product.category}`;

        // Agregar los elementos a la tarjeta
        div.appendChild(id);
        div.appendChild(title);
        div.appendChild(description);
        div.appendChild(price);
        div.appendChild(code);
        div.appendChild(stock);
        div.appendChild(category);

        // Agregar la tarjeta a la columna
        col.appendChild(div);

        // Agregar la columna a la fila
        row.appendChild(col);
    });

    // Añadir la fila de productos al contenedor principal
    contenedorProductosRTP.appendChild(row);
});

const addProduct = ()=>{
    
    const title = document.querySelector('#add-title').value
    const description = document.querySelector('#add-description').value
    const price = document.querySelector('#add-price').value
    const code = document.querySelector('#add-code').value
    const stock = document.querySelector('#add-stock').value
    const category = document.querySelector('#add-category').value

    const info = {title,description,price,code,stock,category}
    socket.emit("nuevo-producto", info)

    document.querySelector('#add-title').value = ""
    document.querySelector('#add-description').value = ""
    document.querySelector('#add-price').value = ""
    document.querySelector('#add-code').value = ""
    document.querySelector('#add-stock').value = ""
    document.querySelector('#add-category').value = ""
    
    
}

document.querySelector('#button-add').addEventListener('click', ()=> {
    addProduct()
})

const updateProduct = ()=>{
    console.log("Modificar Producto")
}

document.querySelector('#button-delete').addEventListener('click', () => {
    const id = document.querySelector('#delete-id').value
    deleteProduct(id)
})

const deleteProduct = (id)=>{
    socket.emit('delete-product', id)
}

socket.on('error', (errorMessage) => {
    // Aquí puedes manejar el error recibido
    alert(`${errorMessage}`);  // Muestra una alerta con el mensaje de error
    // O, si prefieres mostrarlo en un elemento HTML:
    document.querySelector('#error-message').textContent = errorMessage;
});