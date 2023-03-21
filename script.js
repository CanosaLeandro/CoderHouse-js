let cartItems = [];
let totalPrice = 0;

function addToCart(price, itemName) {
  cartItems.push({name: itemName, price: price});
  totalPrice += price;
  alert(itemName + " added to cart!");
  updateCart();
}

function updateCart() {
  let msg = "Cart resume\n"
  for (let i = 0; i < cartItems.length; i++) {
    const element = cartItems[i];
    msg += element.name + ": $" + element.price + "\n"
  }
  alert(msg += "\nSubtotal is $" + totalPrice)
}

function checkout() {
  if (cartItems.length === 0) {
    alert("Your cart is empty!");
  } else {
    alert("Your total is: $" + totalPrice.toFixed(2));
    cartItems = [];
    totalPrice = 0;
    updateCart();
  }
}

function partialPayment() {
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
