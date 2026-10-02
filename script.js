/* ==================================================
   FRESH MART JAVASCRIPT
================================================== */


/* ==================================================
   MOBILE MENU
================================================== */

function toggleMenu() {

    document
        .getElementById("mainNav")
        .classList.toggle("show");

}


/* Close menu after clicking */

document.querySelectorAll("#mainNav a").forEach(link => {

    link.addEventListener("click", () => {

        document
            .getElementById("mainNav")
            .classList.remove("show");

    });

});


/* ==================================================
   CART
================================================== */

let cart = [];


function addToCart(name, price) {

    const existing = cart.find(
        item => item.name === name
    );


    if (existing) {

        existing.quantity += 1;

    } else {

        cart.push({

            name: name,

            price: price,

            quantity: 1

        });

    }


    updateCart();

    showToast(`${name} added to cart`);

}


function updateCart() {

    const count =
        document.getElementById("cartCount");

    const products =
        document.getElementById("cartProducts");

    const total =
        document.getElementById("cartTotal");


    let itemCount = 0;

    let totalPrice = 0;


    cart.forEach(item => {

        itemCount += item.quantity;

        totalPrice +=
            item.price * item.quantity;

    });


    count.textContent = itemCount;

    total.textContent = `₹${totalPrice}`;


    if (cart.length === 0) {

        products.innerHTML = `

            <div class="empty-cart">

                <div>🛒</div>

                <h3>Your cart is empty</h3>

                <p>
                    Add something fresh to get started.
                </p>

            </div>

        `;

        return;

    }


    products.innerHTML = cart.map(
        (item, index) => `

        <div class="cart-item">

            <div>

                <h4>${item.name}</h4>

                <p>
                    ₹${item.price}
                    ×
                    ${item.quantity}
                </p>

            </div>

            <button
                class="remove-cart"
                onclick="removeFromCart(${index})"
            >
                ×
            </button>

        </div>

    `
    ).join("");

}


function removeFromCart(index) {

    cart.splice(index, 1);

    updateCart();

    showToast("Item removed from cart");

}


/* ==================================================
   OPEN CART
================================================== */

function openCart() {

    document
        .getElementById("cartDrawer")
        .classList.add("show");

    document
        .getElementById("cartBackdrop")
        .classList.add("show");

}


function closeCart() {

    document
        .getElementById("cartDrawer")
        .classList.remove("show");

    document
        .getElementById("cartBackdrop")
        .classList.remove("show");

}


/* ==================================================
   PRODUCT FILTER
================================================== */

function filterProducts(category) {

    const products =
        document.querySelectorAll(".product");

    const filters =
        document.querySelectorAll(".filter");


    filters.forEach(button => {

        button.classList.remove("active");

    });


    filters.forEach(button => {

        const value =
            button.textContent
                .trim()
                .toLowerCase();


        if (
            (category === "all" && value === "all") ||
            value === category
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

        } else {

            product.style.display = "none";

        }

    });


    document
        .getElementById("products")
        .scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

}


/* ==================================================
   QUICK VIEW
================================================== */

let selectedProduct = null;


function quickView(name, price) {

    selectedProduct = {

        name: name,

        price: price

    };


    document
        .getElementById("modalName")
        .textContent = name;


    document
        .getElementById("modalPrice")
        .textContent = `₹${price}`;


    document
        .getElementById("quickModal")
        .classList.add("show");

}


function closeQuickView() {

    document
        .getElementById("quickModal")
        .classList.remove("show");

}


function addModalProduct() {

    if (!selectedProduct) {
        return;
    }


    addToCart(
        selectedProduct.name,
        selectedProduct.price
    );


    closeQuickView();

}


/* ==================================================
   SEARCH
================================================== */

function openSearch() {

    document
        .getElementById("searchOverlay")
        .classList.add("show");


    setTimeout(() => {

        document
            .getElementById("searchInput")
            .focus();

    }, 100);

}


function closeSearch() {

    document
        .getElementById("searchOverlay")
        .classList.remove("show");


    document
        .getElementById("searchInput")
        .value = "";


    document
        .getElementById("searchResults")
        .innerHTML = "";

}


const searchableProducts = [

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
        name: "Daily Grocery Pack",
        category: "Groceries",
        price: 499
    },

    {
        name: "Refreshing Drinks Pack",
        category: "Drinks",
        price: 149
    }

];


function searchProducts() {

    const input =
        document
            .getElementById("searchInput")
            .value
            .toLowerCase()
            .trim();


    const results =
        document.getElementById("searchResults");


    if (!input) {

        results.innerHTML = "";

        return;

    }


    const matches =
        searchableProducts.filter(product =>

            product.name
                .toLowerCase()
                .includes(input)

            ||

            product.category
                .toLowerCase()
                .includes(input)

        );


    if (matches.length === 0) {

        results.innerHTML = `

            <p style="
                text-align:center;
                color:#69736d;
                padding:25px;
                font-size:12px;
            ">
                No fresh products found.
            </p>

        `;

        return;

    }


    results.innerHTML = matches.map(product => `

        <div class="search-result">

            <div>

                <strong>
                    ${product.name}
                </strong>

                <small>
                    ${product.category}
                </small>

            </div>

            <button
                onclick="
                    addToCart(
                        '${product.name}',
                        ${product.price}
                    )
                "
            >
                Add ₹${product.price}
            </button>

        </div>

    `).join("");

}


/* ==================================================
   NEWSLETTER
================================================== */

function subscribe(event) {

    event.preventDefault();


    const email =
        document
            .getElementById("email")
            .value;


    if (!email) {
        return;
    }


    showToast("You're subscribed to Fresh Mart! 🌿");


    document
        .getElementById("email")
        .value = "";

}


/* ==================================================
   CHECKOUT
================================================== */

function checkout() {

    if (cart.length === 0) {

        showToast("Your cart is empty");

        return;

    }


    showToast(
        "Checkout will be available soon!"
    );

}


/* ==================================================
   TOAST
================================================== */

let toastTimeout;


function showToast(message) {

    const toast =
        document.getElementById("toast");

    const text =
        document.getElementById("toastText");


    text.textContent = message;

    toast.classList.add("show");


    clearTimeout(toastTimeout);


    toastTimeout = setTimeout(() => {

        toast.classList.remove("show");

    }, 2800);

}


/* ==================================================
   CLOSE MODALS WITH ESC
================================================== */

document.addEventListener("keydown", event => {

    if (event.key === "Escape") {

        closeSearch();

        closeCart();

        closeQuickView();

    }

});


/* ==================================================
   CLOSE QUICK VIEW OUTSIDE
================================================== */

document
    .getElementById("quickModal")
    .addEventListener("click", event => {

        if (
            event.target.id === "quickModal"
        ) {

            closeQuickView();

        }

    });


/* ==================================================
   CLOSE SEARCH OUTSIDE
================================================== */

document
    .getElementById("searchOverlay")
    .addEventListener("click", event => {

        if (
            event.target.id === "searchOverlay"
        ) {

            closeSearch();

        }

    });


/* ==================================================
   NAVBAR ACTIVE STATE
================================================== */

const pageSections =
    document.querySelectorAll("section[id]");

const navigationLinks =
    document.querySelectorAll("#mainNav a");


window.addEventListener("scroll", () => {

    let currentSection = "";


    pageSections.forEach(section => {

        const top =
            section.offsetTop - 180;


        if (
            window.scrollY >= top
        ) {

            currentSection =
                section.getAttribute("id");

        }

    });


    navigationLinks.forEach(link => {

        link.classList.remove("active");


        if (
            link.getAttribute("href") ===
            `#${currentSection}`
        ) {

            link.classList.add("active");

        }

    });

});


/* ==================================================
   INITIALIZE
================================================== */

updateCart();
