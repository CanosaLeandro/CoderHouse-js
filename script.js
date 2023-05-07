if(localStorage.getItem('cart') !== '') {
  localStorage.setItem('cart', [])
}

if(localStorage.getItem('products') !== '') {
  localStorage.setItem('products', [])
}
class Item {
  constructor(name, price) {
    this.name = name,
    this.price = price
  }
}

function fireToast(title, msg = '') {
  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  })

  Toast.fire({
    icon: 'success',
    title: title,
    text: msg,
  })
}

function fireError(title, msg = '') {
  Swal.fire(title, msg, 'error')
}

function alertModal(name, price, imgUrl) {
  Swal.fire({
    title: name,
    text: price,
    imageUrl: imgUrl,
    imageWidth: "100% - 10px",
    imageHeight: 600,
    imageAlt: name,
    confirmButtonColor: '#15e3e3'
  })
}

async function addProduct() {
  const { value: newItem } = await Swal.fire({
    title: 'New product',
    html:
      '<input id="swal-input-name" class="swal2-input">' +
      '<input id="swal-input-price" class="swal2-input" type="number" step="0.01">',
    focusConfirm: false,
    showCancelButton: true,
    preConfirm: () => {
      return {
        name: document.getElementById('swal-input-name').value,
        price: document.getElementById('swal-input-price').value
      }
    }
  })

  if(newItem) {
    addItem(newItem)
  }
}

function cart() {
  let localCart = localStorage.getItem('cart')
  if(localCart === '') {
    return []
  } else {
    console.log(JSON.parse(localCart.split(',')))
    return JSON.parse(localCart.split(','))
  }
}

function addItem(item) {
  addProductHTML(item.name, item.price, './assets/product-icon.png')

  fetch('products.json')
    .then((response) => response.json())
    .then((json) => getRand(json.imageURLs))
    .then((imgURL) => {
      editProductImg(item.name, imgURL)
      addItemToProducts(item)
    })
}

function products() {
  let localProducts = localStorage.getItem('products')
  if(localCart === '') {
    return []
  } else {
    console.log(JSON.parse(localCart.split(',')))
    return JSON.parse(localCart.split(','))
  }
}

function addItemToProducts(item) {
  let products = localStorage.getItem('products')
  if(products === '') {
    products = [item]
  } else {
    products
  }
}

function editProductImg(name, imgURL) {
  console.log($(`.${name.replace(/\s+/g, '-')}-img`)[0])
  $(`.${name.replace(/\s+/g, '-')}-img`).attr("src", './assets/'+imgURL)
}

function getRand(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function totalAmount() {
  let total = cart().reduce(
    (sum, actual) => {sum + actual.price}
  )

  return total
}

function addToCart(price, itemName) {
  let newItem = new Item(itemName, price)
  localStorage.setItem('cart', JSON.stringify(cart().concat(newItem)))
  fireToast(`${itemName} added to cart!`)
}

function checkout() {
  if (cart().length === 0) {
    fireError('Empty cart', 'Your cart have 0 items')
  } else {
    console.log(totalAmount())
    Swal.fire("Your total is: $" + totalAmount())
    localStorage.setItem('cart', []);
  }
}

function removeItemFromCart() {
  if (cart().length === 0) {
    fireError('Empty cart', 'Your cart have 0 items')
  } else {
    let promptMsg = "Enter the index of the product you want to remove:\n";
    for (let i = 0; i < cart().length; i++) {
      let item = cart()[i]
      console.log(item)
      promptMsg += `${i+1}. ${item.name}\n`
    }
    let productIndex = fireSelect(promptMsg);
    if (productIndex !== null && productIndex !== "") {
      let parsedIndex = parseInt(productIndex);
      if (!isNaN(parsedIndex) && parsedIndex >= 0 && parsedIndex <= cart().length) {
        let removedItem = cart().splice(parsedIndex-1, 1)[0];
        totalAmount -= removedItem.price;
        fireToast(removedItem.name + " removed from cart.");
      } else {
        fireError("Invalid index");
      }
    }
  }
}

async function fireSelect(title, msg = '') {
  let options = {}
  for(let i = 0; i < cart().length; i++ ){
    options[i] = `${i+1}. ${cart()[i].name}`
  }
  const { value: fruit } = await Swal.fire({
    title: 'Select field validation',
    input: 'select',
    inputOptions: options,
    inputPlaceholder: 'Select a product',
    showCancelButton: true,
    inputValidator: (value) => {
      return new Promise((resolve) => {
        if (typeof value === 'number') {
          resolve()
        } else {
          resolve('Invalid input.')
        }
      })
    }
  })
}

function productHtml(name, price, imgURL) {
  let priceValue = parseFloat(price).toFixed(2)
  return  `<div class="product">
    <img class="${name.replace(/\s+/g, '-')}-img" src="${imgURL}" alt="${name}" onclick="alertModal('${name}', '$${priceValue}', '${imgURL}')">
    <h3>${name}</h3>
    <p class="price" data-price="${priceValue}">$${priceValue}</p>
    <button class="add-to-cart-btn" onclick="addToCart(${priceValue}, '${name}')" data-product-name="${name}">
      <span>Add to cart</span>
    </button>
    <div class="cart-message"></div>
  </div>`
}

function addProductHTML(name, price, imgURL) {
  $('section.products')[0].innerHTML += productHtml(name, price, imgURL)
}

function loadDefaultProducts(items) {
  let defaultImagesUrls = [
    '/plant.jpeg',
    '/bracelet.jpeg',
    '/casco.jpeg'
  ]

  for (let i = 0; i < items.length; i++) {
    addProductHTML(items[i].name, items[i].price, './assets'+defaultImagesUrls[i])
  }
}

function loadProducts() {

}

fetch('products.json')
  .then((response) => response.json())
  .then((json) => {
    loadDefaultProducts(json.items)
    loadProducts()
  })
