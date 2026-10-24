/* ==========================================
   script.js
   Main JS file - product data + common functions
   used across index, products, and product pages
   ========================================== */

// Our "database" of products (normally this would come from a server,
// but for this project we just keep it in an array)
var productList = [
    {
        id: 1,
        name: "Wireless Mouse",
        price: 499,
        category: "Electronics",
        description: "A smooth wireless mouse with USB receiver. Good battery life and comfortable grip."
    },
    {
        id: 2,
        name: "Bluetooth Headphones",
        price: 1299,
        category: "Electronics",
        description: "Over-ear bluetooth headphones with decent bass and 10 hour battery backup."
    },
    {
        id: 3,
        name: "Cotton T-Shirt",
        price: 399,
        category: "Clothing",
        description: "100% cotton round neck t-shirt. Available in multiple colors, very comfortable for daily wear."
    },
    {
        id: 4,
        name: "Denim Jacket",
        price: 1499,
        category: "Clothing",
        description: "Classic blue denim jacket. Goes well with almost anything, good for winters."
    },
    {
        id: 5,
        name: "Leather Wallet",
        price: 699,
        category: "Accessories",
        description: "Genuine leather wallet with multiple card slots and a coin pocket."
    },
    {
        id: 6,
        name: "Sunglasses",
        price: 599,
        category: "Accessories",
        description: "UV protected sunglasses with a sturdy frame. Comes with a cover case."
    },
    {
        id: 7,
        name: "Notebook Set (Pack of 3)",
        price: 249,
        category: "Books & Stationery",
        description: "Set of 3 ruled notebooks, 100 pages each. Good quality paper, does not tear easily."
    },
    {
        id: 8,
        name: "Mystery Novel",
        price: 299,
        category: "Books & Stationery",
        description: "A gripping mystery novel that keeps you guessing till the last page."
    }
];

// Runs on every page load to show correct navbar (login/logout + cart count)
document.addEventListener("DOMContentLoaded", function () {
    updateCartCountDisplay();   // from cart.js
    updateNavAuthLinks();       // from auth.js

    // mobile menu toggle button (hamburger icon)
    var toggleBtn = document.getElementById("navToggle");
    var navLinks = document.getElementById("navLinks");
    if (toggleBtn) {
        toggleBtn.addEventListener("click", function () {
            navLinks.classList.toggle("active");
        });
    }
});

// Helper function to find a product using its id
function getProductById(id) {
    for (var i = 0; i < productList.length; i++) {
        if (productList[i].id == id) {
            return productList[i];
        }
    }
    return null; // not found
}

/* -------------------------------------------
   HOME PAGE - show a few featured products
   ------------------------------------------- */
function loadFeaturedProducts() {
    var container = document.getElementById("featuredProducts");
    if (!container) return; // this function only runs if the box exists on the page

    // just show the first 4 products as "featured"
    var featured = productList.slice(0, 4);

    var html = "";
    for (var i = 0; i < featured.length; i++) {
        html += buildProductCard(featured[i]);
    }
    container.innerHTML = html;
}

/* -------------------------------------------
   PRODUCTS PAGE - show all products, with
   search box and category filter
   ------------------------------------------- */
function loadAllProducts() {
    var container = document.getElementById("allProducts");
    if (!container) return;

    renderProducts(productList); // show everything at first

    // listen for typing in the search box
    var searchBox = document.getElementById("searchInput");
    if (searchBox) {
        searchBox.addEventListener("input", filterProducts);
    }

    // listen for category dropdown change
    var categoryDropdown = document.getElementById("categorySelect");
    if (categoryDropdown) {
        categoryDropdown.addEventListener("change", filterProducts);
    }
}

// combines search text + category filter together
function filterProducts() {
    var searchBox = document.getElementById("searchInput");
    var categoryDropdown = document.getElementById("categorySelect");

    var searchText = searchBox ? searchBox.value.toLowerCase() : "";
    var selectedCategory = categoryDropdown ? categoryDropdown.value : "All";

    var filtered = productList.filter(function (product) {
        var matchesSearch = product.name.toLowerCase().includes(searchText);
        var matchesCategory = (selectedCategory === "All") || (product.category === selectedCategory);
        return matchesSearch && matchesCategory;
    });

    renderProducts(filtered);
}

// draws the product cards onto the page
function renderProducts(list) {
    var container = document.getElementById("allProducts");
    if (!container) return;

    if (list.length === 0) {
        container.innerHTML = "<p style='text-align:center; width:100%;'>No products found.</p>";
        return;
    }

    var html = "";
    for (var i = 0; i < list.length; i++) {
        html += buildProductCard(list[i]);
    }
    container.innerHTML = html;
}

// returns the HTML for one product card (used by home + products page)
function buildProductCard(product) {
    return (
        "<div class='product-card'>" +
        "<div class='product-img-box'>" + product.name + "</div>" +
        "<h3>" + product.name + "</h3>" +
        "<p class='product-category'>" + product.category + "</p>" +
        "<p class='product-price'>Rs. " + product.price + "</p>" +
        "<a href='product.html?id=" + product.id + "'><button class='btn btn-small'>View Details</button></a>" +
        "</div>"
    );
}

/* -------------------------------------------
   PRODUCT DETAILS PAGE
   ------------------------------------------- */
function loadProductDetails() {
    var container = document.getElementById("productDetailsBox");
    if (!container) return;

    // get product id from the URL, e.g product.html?id=3
    var params = new URLSearchParams(window.location.search);
    var productId = params.get("id");
    var product = getProductById(productId);

    if (!product) {
        container.innerHTML = "<p>Product not found.</p>";
        return;
    }

    container.innerHTML =
        "<div class='product-img-box'>" + product.name + "</div>" +
        "<div class='details-info'>" +
        "<h2>" + product.name + "</h2>" +
        "<p class='product-category'>Category: " + product.category + "</p>" +
        "<p class='product-price'>Rs. " + product.price + "</p>" +
        "<p>" + product.description + "</p>" +
        "<div class='qty-box'>" +
        "<button onclick='changeDetailQty(-1)'>-</button>" +
        "<span id='detailQty'>1</span>" +
        "<button onclick='changeDetailQty(1)'>+</button>" +
        "</div>" +
        "<button class='btn' onclick='addProductFromDetails(" + product.id + ")'>Add to Cart</button>" +
        "</div>";
}

var detailQuantity = 1; // quantity chosen on the product details page

function changeDetailQty(amount) {
    detailQuantity = detailQuantity + amount;
    if (detailQuantity < 1) {
        detailQuantity = 1; // cannot go below 1
    }
    document.getElementById("detailQty").innerText = detailQuantity;
}

function addProductFromDetails(productId) {
    addToCart(productId, detailQuantity); // function from cart.js
    alert("Added " + detailQuantity + " item(s) to cart!");
    detailQuantity = 1;
    document.getElementById("detailQty").innerText = detailQuantity;
}

/* -------------------------------------------
   CONTACT PAGE - simple form handling
   ------------------------------------------- */
function handleContactForm(event) {
    event.preventDefault(); // stop the page from refreshing

    var name = document.getElementById("contactName").value.trim();
    var email = document.getElementById("contactEmail").value.trim();
    var message = document.getElementById("contactMessage").value.trim();

    var msgBox = document.getElementById("contactMsg");

    if (name === "" || email === "" || message === "") {
        msgBox.innerText = "Please fill in all fields.";
        msgBox.className = "form-msg error-msg";
        return;
    }

    // In a real project this would be sent to a server.
    // Here we just show a success message.
    msgBox.innerText = "Thank you " + name + "! Your message has been received.";
    msgBox.className = "form-msg success-msg";

    document.getElementById("contactForm").reset();
}
