const socket = io()

const contenedorProductosRTP = document.querySelector('.products-container-rtp')

socket.on('realtime', (data) => {
    contenedorProductosRTP.innerHTML = '';
    
    const row = document.createElement('div');
    row.classList.add('row', 'g-3');  

    data.forEach(product => {

        const col = document.createElement('div');
        col.classList.add('col-12', 'col-md-4', 'col-lg-3');

        const div = document.createElement('div');
        div.classList.add('card', 'h-100', 'p-2');  

        const id = document.createElement('p');
        id.classList.add('card-text');  
        id.innerText = `ID: ${product.id}`;

        const title = document.createElement('h5');
        title.classList.add('card-title');  
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

        div.appendChild(id);
        div.appendChild(title);
        div.appendChild(description);
        div.appendChild(price);
        div.appendChild(code);
        div.appendChild(stock);
        div.appendChild(category);

        col.appendChild(div);
        row.appendChild(col);
    });

    contenedorProductosRTP.appendChild(row);
});

const addProduct = () => {

    const title = document.querySelector('#add-title').value
    const description = document.querySelector('#add-description').value
    const price = document.querySelector('#add-price').value
    const code = document.querySelector('#add-code').value
    const stock = document.querySelector('#add-stock').value
    const category = document.querySelector('#add-category').value

    const info = { title, description, price, code, stock, category }
    socket.emit("nuevo-producto", info)

    document.querySelector('#add-title').value = ""
    document.querySelector('#add-description').value = ""
    document.querySelector('#add-price').value = ""
    document.querySelector('#add-code').value = ""
    document.querySelector('#add-stock').value = ""
    document.querySelector('#add-category').value = ""
}

document.querySelector('#button-add').addEventListener('click', () => {
    addProduct()
})

const updateProduct = () => {
    const id = document.querySelector('#update-id').value
    const title = document.querySelector('#update-title').value
    const description = document.querySelector('#update-description').value
    const price = document.querySelector('#update-price').value
    const code = document.querySelector('#update-code').value
    const stock = document.querySelector('#update-stock').value
    const category = document.querySelector('#update-category').value

    const info = { id, title, description, price, code, stock, category }
    socket.emit("update-producto", info)

    document.querySelector('#update-id').value = ""
    document.querySelector('#update-title').value = ""
    document.querySelector('#update-description').value = ""
    document.querySelector('#update-price').value = ""
    document.querySelector('#update-code').value = ""
    document.querySelector('#update-stock').value = ""
    document.querySelector('#update-category').value = ""
}
document.querySelector('#button-update').addEventListener('click', () => {
    updateProduct()
})

const deleteProduct = (id) => {
    socket.emit('delete-producto', id)
}
document.querySelector('#button-delete').addEventListener('click', () => {
    const id = document.querySelector('#delete-id').value
    deleteProduct(id)
})



socket.on('error', (errorMessage) => {
    Toastify({
        text: errorMessage,
        duration: 3000,
        gravity: "top", 
        position: "center",
        stopOnFocus: true,
        style: {
            background: "#d71226",
        },
        onClick: function () { }
    }).showToast();
});
