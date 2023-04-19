let cartItems = [];
let totalPrice = 0;

class Item {
  constructor(name, price) {
    this.name = name,
    this.price = price
  }
}

function addToCart(price, itemName) {
  let newItem = new Item(itemName, price)
  cartItems.push(newItem);
  totalPrice += newItem.price;
  alert(newItem.name + " added to cart!");
  updateCart();
}

function updateCart() {
  let msg = "Cart resume\n"
  for (let i = 0; i < cartItems.length; i++) {
    const item = cartItems[i];
    msg += item.name + ": $" + item.price + "\n"
  }
  if (cartItems.length === 0) {
    alert("Your cart is empty.");
  } else {
    alert(msg += "\nSubtotal is $" + totalPrice)
  }
}

function checkout() {
  if (cartItems.length === 0) {
    alert("Your cart is empty");
  } else {
    alert("Your total is: $" + totalPrice.toFixed(2));
    cartItems = [];
    totalPrice = 0;
    updateCart();
  }
}

function partialPayment() {
  if (cartItems.length === 0) {
    alert("Your cart is empty");
  } else {
    const partialAmount = prompt("Enter partial amount:");
    if (partialAmount !== null && partialAmount !== "") {
      const parsedAmount = parseFloat(partialAmount);
      if (!isNaN(parsedAmount)) {
        if (parsedAmount > totalPrice) {
          alert("Partial amount cannot exceed total price.");
        } else {
          alert("Partial payment of $" + parsedAmount + " processed.");
          totalPrice -= parsedAmount;
          updateCart();
        }
      } else {
        alert("Invalid partial amount.");
      }
    }
  }
}

function removeItemFromCart() {
  if (cartItems.length === 0) {
    alert("Your cart is empty.");
  } else {
    let promptMsg = "Enter the index of the product you want to remove:\n";
    for (let i = 0; i < cartItems.length; i++) {
      let item = cartItems[i]
      console.log(item)
      promptMsg += `${i+1}. ${item.name}\n`
    }
    let productIndex = prompt(promptMsg);
    if (productIndex !== null && productIndex !== "") {
      let parsedIndex = parseInt(productIndex);
      if (!isNaN(parsedIndex) && parsedIndex >= 0 && parsedIndex <= cartItems.length) {
        let removedItem = cartItems.splice(parsedIndex-1, 1)[0];
        totalPrice -= removedItem.price;
        alert(removedItem.name + " removed from cart.");
        updateCart();
      } else {
        alert("Invalid index.");
      }
    }
  }
}

$(document).ready(function() {
  $('.add-to-cart-btn').on('click', function() {
    var productName = $(this).attr('data-product-name');
    let message = this.nextElementSibling
    message.innerText = `${productName} was added to the cart.`;
    setTimeout(() => { message.innerText = ''}, 2000)
  });
});