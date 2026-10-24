/* ==========================================
   cart.js
   Handles the shopping cart using Local Storage
   Cart is saved as an array of objects:
   [{ id: 1, name: "Wireless Mouse", price: 499, quantity: 2 }, ...]
   ========================================== */

// get the cart array from local storage (or empty array if nothing saved yet)
function getCart() {
    var cartData = localStorage.getItem("cart");
    if (cartData === null) {
        return [];
    }
    return JSON.parse(cartData);
}

// save the cart array back to local storage
function saveCart(cartArray) {
    localStorage.setItem("cart", JSON.stringify(cartArray));
}

// add a product to the cart (or increase quantity if it's already there)
function addToCart(productId, quantity) {
    if (!quantity) {
        quantity = 1; // default quantity if not given
    }

    var product = getProductById(productId);
    if (!product) return;

    var cart = getCart();
    var alreadyInCart = false;

    // check if this product is already in the cart
    for (var i = 0; i < cart.length; i++) {
        if (cart[i].id == productId) {
            cart[i].quantity = cart[i].quantity + quantity;
            alreadyInCart = true;
            break;
        }
    }

    // if not already in cart, add it as a new item
    if (!alreadyInCart) {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: quantity
        });
    }

    saveCart(cart);
    updateCartCountDisplay();
}

// remove an item completely from the cart
function removeFromCart(productId) {
    var cart = getCart();
    var newCart = cart.filter(function (item) {
        return item.id != productId;
    });
    saveCart(newCart);
    renderCartPage(); // refresh the cart table on screen
    updateCartCountDisplay();
}

// increase or decrease quantity of an item already in the cart
function updateCartQuantity(productId, amount) {
    var cart = getCart();

    for (var i = 0; i < cart.length; i++) {
        if (cart[i].id == productId) {
            cart[i].quantity = cart[i].quantity + amount;

            // if quantity drops to 0 or below, remove the item
            if (cart[i].quantity <= 0) {
                cart.splice(i, 1);
            }
            break;
        }
    }

    saveCart(cart);
    renderCartPage();
    updateCartCountDisplay();
}

// adds up total number of items so we can show it on the navbar
function getCartItemCount() {
    var cart = getCart();
    var total = 0;
    for (var i = 0; i < cart.length; i++) {
        total = total + cart[i].quantity;
    }
    return total;
}

// adds up total price of everything in the cart
function getCartTotal() {
    var cart = getCart();
    var total = 0;
    for (var i = 0; i < cart.length; i++) {
        total = total + (cart[i].price * cart[i].quantity);
    }
    return total;
}

// updates the little number badge next to "Cart" in the navbar
function updateCartCountDisplay() {
    var countBox = document.getElementById("cartCount");
    if (countBox) {
        countBox.innerText = getCartItemCount();
    }
}

/* -------------------------------------------
   CART PAGE - build the cart table
   ------------------------------------------- */
function renderCartPage() {
    var tableBody = document.getElementById("cartTableBody");
    if (!tableBody) return; // only run this on cart.html

    var cart = getCart();
    var emptyMsg = document.getElementById("emptyCartMsg");
    var cartTable = document.getElementById("cartTable");
    var summaryBox = document.getElementById("cartSummary");

    if (cart.length === 0) {
        cartTable.style.display = "none";
        summaryBox.style.display = "none";
        emptyMsg.style.display = "block";
        return;
    }

    cartTable.style.display = "table";
    summaryBox.style.display = "block";
    emptyMsg.style.display = "none";

    var html = "";
    for (var i = 0; i < cart.length; i++) {
        var item = cart[i];
        var subtotal = item.price * item.quantity;

        html += "<tr>";
        html += "<td>" + item.name + "</td>";
        html += "<td>Rs. " + item.price + "</td>";
        html += "<td>";
        html += "<button class='btn btn-small' onclick='updateCartQuantity(" + item.id + ", -1)'>-</button> ";
        html += " " + item.quantity + " ";
        html += "<button class='btn btn-small' onclick='updateCartQuantity(" + item.id + ", 1)'>+</button>";
        html += "</td>";
        html += "<td>Rs. " + subtotal + "</td>";
        html += "<td><button class='btn btn-small' style='background-color:#c0392b;' onclick='removeFromCart(" + item.id + ")'>Remove</button></td>";
        html += "</tr>";
    }

    tableBody.innerHTML = html;
    document.getElementById("cartTotalAmount").innerText = getCartTotal();
}

// clears the whole cart (used after checkout is completed)
function clearCart() {
    localStorage.removeItem("cart");
    updateCartCountDisplay();
}