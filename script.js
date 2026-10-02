/* ============================================
   FRESH MART - JAVASCRIPT
============================================ */


/* ============================================
   MOBILE MENU
============================================ */

function toggleMenu() {

    const navbar = document.getElementById("navbar");

    navbar.classList.toggle("show");

}


/* Close mobile menu when clicking a link */

document.querySelectorAll(".nav-link").forEach(link => {

    link.addEventListener("click", () => {

        document.getElementById("navbar").classList.remove("show");

    });

});


/* ============================================
   SEARCH
============================================ */

function openSearch() {

    const overlay = document.getElementById("searchOverlay");

    overlay.classList.add("show");

    setTimeout(() => {

        document.getElementById("searchInput").focus();

    }, 100);

}


function closeSearch() {

    document.getElementById("searchOverlay")
        .classList.remove("show");

    document.getElementById("searchInput").value = "";

    document.getElementById("searchResults").innerHTML = "";

}


function searchProducts() {

    const search =
        document.getElementById("searchInput")
        .value
        .toLowerCase()
        .trim();

    const results =
        document.getElementById("searchResults");

    if (search === "") {

        results.innerHTML = "";

        return;
    }

    const products = [

        {
            name: "Fresh Fruit Basket",
            category: "Fruits",
            price: 299
        },

        {
            name: "Farm Fresh Vegetables",
            category: "Vegetables",
            price: 199
        },

        {
            name: "Daily Grocery Essentials",
            category: "Groceries",
            price: 499
        },

        {
            name: "Refreshing Beverages",
            category: "Drinks",
            price: 149
        }

    ];


    const matches = products.filter(product =>

        product.name.toLowerCase().includes(search) ||

        product.category.toLowerCase().includes(search)

    );


    if (matches.length === 0) {

        results.innerHTML = `
            <p style="
                color:#777;
                text-align:center;
                padding:20px;
            ">
                No products found.
            </p>
        `;

        return;
    }


    results.innerHTML = matches.map(product => `

        <div style="
            display:flex;
            justify-content:space-between;
            align-items:center;
            padding:14px 0;
            border-bottom:1px solid #eee;
        ">

            <div>

                <strong style="font-size:13px;">
                    ${product.name}
                </strong>

                <small style="
                    display:block;
                    color:#1f6b45;
                ">
                    ${product.category}
                </small>

            </div>

            <button
                onclick="addToCart('${product.name}', ${product.price})"
                style="
                    background:#1f6b45;
                    color:white;
                    border:0;
                    padding:7px 12px;
                    border-radius:6px;
                    cursor:pointer;
                "
            >
                Add ₹${product.price}
            </button>

        </div>

    `).join("");

}


/* ============================================
   PRODUCT FILTER
============================================ */

function filterProducts(category) {

    const products =
        document.querySelectorAll(".product-card");

    const buttons =
        document.querySelectorAll(".filter-btn");


    buttons.forEach(button => {

        button.classList.remove("active");

    });


    buttons.forEach(button => {

        const text = button.textContent
            .trim()
            .toLowerCase();

        if (
            (category === "all" && text === "all") ||
            text === category ||
            (category === "drinks" && text === "drinks")
        ) {

            button.classList.add("active");

        }

    });


    products.forEach(product => {

        const productCategory =
            product.dataset.category;


        if (
            category === "all" ||
            productCategory === category
        ) {

            product.style.display = "block";

            setTimeout(() => {

                product.style.opacity = "1";

            }, 10);

        } else {

            product.style.display = "none";

        }

    });


    /* Scroll to products when category card is clicked */

    const productSection =
        document.getElementById("products");

    if (
        category !== "all" &&
        event &&
        event.target &&
        event.target.closest(".category-card")
    ) {

        productSection.scrollIntoView({
            behavior: "smooth"
        });

    }

}


/* ============================================
   SHOPPING CART
============================================ */

let cart = [];


function addToCart(name, price) {

    const existing =
        cart.find(item => item.name === name);


    if (existing) {

        existing.quantity++;

    } else {

        cart.push({
            name: name,
            price: price,
            quantity: 1
        });

    }


    updateCart();

    showToast(`${name} added to your cart!`);

}


function updateCart() {

    const cartCount =
        document.getElementById("cartCount");

    const cartItems =
        document.getElementById("cartItems");

    const cartTotal =
        document.getElementById("cartTotal");


    let totalItems = 0;

    let totalPrice = 0;


    cart.forEach(item => {

        totalItems += item.quantity;

        totalPrice +=
            item.price * item.quantity;

    });


    cartCount.textContent = totalItems;

    cartTotal.textContent =
        `₹${totalPrice}`;


    if (cart.length === 0) {

        cartItems.innerHTML = `

            <div class="empty-cart">

                <span>🛒</span>

                <h3>Your cart is empty</h3>

                <p>Add some fresh products!</p>

            </div>

        `;

        return;

    }


    cartItems.innerHTML = cart.map((item, index) => `

        <div class="cart-item">

            <div>

                <h4>${item.name}</h4>

                <p>
                    ₹${item.price} × ${item.quantity}
                </p>

            </div>

            <button
                class="remove-item"
                onclick="removeFromCart(${index})"
            >
                ×
            </button>

        </div>

    `).join("");

}


function removeFromCart(index) {

    cart.splice(index, 1);

    updateCart();

    showToast("Product removed from cart.");

}


/* ============================================
   OPEN / CLOSE CART
============================================ */

function openCart() {

    document
        .getElementById("cartSidebar")
        .classList.add("show");

    document
        .getElementById("cartOverlay")
        .classList.add("show");

}


function closeCart() {

    document
        .getElementById("cartSidebar")
        .classList.remove("show");

    document
        .getElementById("cartOverlay")
        .classList.remove("show");

}


/* ============================================
   CHECKOUT
============================================ */

function checkout() {

    if (cart.length === 0) {

        showToast("Your cart is empty!");

        return;

    }


    showToast("Checkout feature coming soon!");

}


/* ============================================
   PRODUCT QUICK VIEW
============================================ */

let selectedProduct = null;


function showProduct(name, price) {

    selectedProduct = {
        name: name,
        price: price
    };


    document.getElementById("modalProductName")
        .textContent = name;


    document.getElementById("modalProductPrice")
        .textContent = `₹${price}`;


    document.getElementById("productModal")
        .classList.add("show");

}


function closeProductModal() {

    document
        .getElementById("productModal")
        .classList.remove("show");

}


function addModalProduct() {

    if (!selectedProduct) return;


    addToCart(
        selectedProduct.name,
        selectedProduct.price
    );


    closeProductModal();

}


/* ============================================
   TOAST MESSAGE
============================================ */

let toastTimer;


function showToast(message) {

    const toast =
        document.getElementById("toast");

    const toastMessage =
        document.getElementById("toastMessage");


    toastMessage.textContent = message;

    toast.classList.add("show");


    clearTimeout(toastTimer);


    toastTimer = setTimeout(() => {

        toast.classList.remove("show");

    }, 3000);

}


/* ============================================
   NEWSLETTER
============================================ */

function subscribe(event) {

    event.preventDefault();


    const email =
        document.getElementById("email").value;


    if (email.trim() === "") {

        return;

    }


    showToast("Thanks for subscribing! 🌿");


    document.getElementById("email").value = "";

}


/* ============================================
   CLOSE MODALS WITH ESCAPE
============================================ */

document.addEventListener("keydown", event => {

    if (event.key === "Escape") {

        closeSearch();

        closeProductModal();

        closeCart();

    }

});


/* ============================================
   CLOSE SEARCH WHEN CLICKING OUTSIDE
============================================ */

document.getElementById("searchOverlay")
    .addEventListener("click", event => {

        if (event.target.id === "searchOverlay") {

            closeSearch();

        }

    });


/* ============================================
   CLOSE PRODUCT MODAL WHEN CLICKING OUTSIDE
============================================ */

document.getElementById("productModal")
    .addEventListener("click", event => {

        if (event.target.id === "productModal") {

            closeProductModal();

        }

    });


/* ============================================
   NAVBAR ACTIVE LINK
============================================ */

const sections =
    document.querySelectorAll("section[id]");

const navLinks =
    document.querySelectorAll(".nav-link");


window.addEventListener("scroll", () => {

    let current = "";

    sections.forEach(section => {

        const sectionTop =
            section.offsetTop - 150;

        if (
            window.scrollY >= sectionTop
        ) {

            current = section.getAttribute("id");

        }

    });


    navLinks.forEach(link => {

        link.classList.remove("active");

        if (
            link.getAttribute("href") === `#${current}`
        ) {

            link.classList.add("active");

        }

    });

});


/* ============================================
   INITIALIZE
============================================ */

updateCart();
