const cards = document.getElementById('cards');
const templateCard = document.getElementById('template-card').content 
const items = document.getElementById('items')
const footer = document.getElementById('footer')
const templateFooter = document.getElementById('template-footer').content
const templateCarrito = document.getElementById('template-carrito').content
const fragment = document.createDocumentFragment()
let listProduct = {}

document.addEventListener('DOMContentLoaded', ()=>{
    fetchData();
})

cards.addEventListener('click', e =>{
    addCarrito(e);
})

const fetchData = async () =>{
    try {
        const res = await fetch('api.json');
        const data = await res.json();
        pintarCards(data);
    } catch (error) {
        
    }
}

const pintarCards =(data)=>{
    data.forEach(products =>{
            templateCard.querySelector('h5').textContent = products.name;
            templateCard.querySelector('p').textContent = products.unit_price;
            templateCard.querySelector('h4').textContent = products.stock;
            templateCard.querySelector('img').setAttribute("src", products.img);
            templateCard.querySelector('.btn-dark').dataset.id = products.id;
            const clone  = templateCard.cloneNode(true)
            fragment.appendChild(clone)
        })
        cards.appendChild(fragment);
}

const addCarrito = (e) =>{
    if(e.target.classList.contains('btn-dark')){
        setCarrito(e.target.parentElement)
        
    }
    e.stopPropagation();
}

const setCarrito = objeto =>{
    
    const product = {
        id : objeto.querySelector('.btn-dark').dataset.id,
        name : objeto.querySelector('h5').textContent,
        price : objeto.querySelector('p').textContent,
        stock : objeto.querySelector('h4').textContent,
        cantidad : 0

    }
    if(listProduct.hasOwnProperty(product.id)){
            var stocke = product.stock = listProduct[product.id].stock
            console.log("stocke",stocke)
            if(stocke >= 1){
                 product.cantidad = listProduct[product.id].cantidad + 1;
                 product.stock = listProduct[product.id].stock -  1;
                
            }else{
                alert("Este producto no tiene stock, por la tanto no se puede agregar");
                return true;
            }
            
       
    }
     
            listProduct[product.id] = {... product}
            pintarCarrito();
       
}

pintarCarrito = ()=>{
    items.innerHTML = ''
    Object.values(listProduct).forEach(product => {
        templateCarrito.querySelector('th').textContent = product.id
        templateCarrito.querySelectorAll('td')[0].textContent = product.name
        templateCarrito.querySelectorAll('td')[1].textContent = product.cantidad
        templateCarrito.querySelector('.btn-info').textContent = product.stock
        templateCarrito.querySelector('span').textContent = product.cantidad * product.price
        
        const clone = templateCarrito.cloneNode(true)
        fragment.appendChild(clone)
    })
        items.appendChild(fragment)
        pintarFooter()
}

const pintarFooter = () =>{
    footer.innerHTML =''
    if (Object.keys(listProduct).length === 0) {
        footer.innerHTML = `
        <th scope="row" colspan="5">Carrito vacío - comience a comprar!</th>
        `
    }
    const nCantidad = Object.values(listProduct).reduce((acc, {cantidad})=> acc+cantidad,0)
    const nPrecio = Object.values(listProduct).reduce((acc, {price, cantidad})=> acc+ cantidad *price,0)
    
    templateFooter.querySelectorAll('td')[0].textContent = nCantidad 
    templateFooter.querySelector('span').textContent = nPrecio

    const clone = templateFooter.cloneNode(true)
    fragment.appendChild(clone);
    footer.appendChild(fragment)
}