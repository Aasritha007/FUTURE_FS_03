document.addEventListener("DOMContentLoaded", function () {

    /* =========================
       MOBILE MENU
    ========================= */

    const menuBtn = document.getElementById("menuBtn");
    const navLinks = document.getElementById("navLinks");

    if (menuBtn) {
        menuBtn.addEventListener("click", function () {
            navLinks.classList.toggle("show");
        });
    }

    document.querySelectorAll(".nav-links a").forEach(function (link) {
        link.addEventListener("click", function () {
            navLinks.classList.remove("show");
        });
    });


    /* =========================
       SEARCH
    ========================= */

    const searchBtn = document.getElementById("searchBtn");
    const searchOverlay = document.getElementById("searchOverlay");
    const closeSearch = document.getElementById("closeSearch");
    const searchInput = document.getElementById("searchInput");
    const searchResult = document.getElementById("searchResult");

    if (searchBtn) {
        searchBtn.addEventListener("click", function () {
            searchOverlay.classList.add("show");
            document.body.classList.add("no-scroll");

            setTimeout(function () {
                searchInput.focus();
            }, 200);
        });
    }

    if (closeSearch) {
        closeSearch.addEventListener("click", closeSearchBox);
    }

    searchOverlay.addEventListener("click", function (event) {
        if (event.target === searchOverlay) {
            closeSearchBox();
        }
    });

    function closeSearchBox() {
        searchOverlay.classList.remove("show");
        document.body.classList.remove("no-scroll");
    }

    searchInput.addEventListener("input", function () {

        const value = searchInput.value.trim().toLowerCase();

        if (value === "") {
            searchResult.textContent = "Start typing to search products.";
            return;
        }

        const products = document.querySelectorAll(".product-card");
        let found = 0;

        products.forEach(function (product) {

            const text = product.innerText.toLowerCase();

            if (text.includes(value)) {
                product.style.display = "";
                found++;
            }
        });

        if (found > 0) {
            searchResult.textContent =
                found + " product(s) found. Check the Products section below.";
        } else {
            searchResult.textContent =
                "No products found for \"" + searchInput.value + "\".";
        }
    });


    /* =========================
       PRODUCT FILTER
    ========================= */

    const filters = document.querySelectorAll(".filter");
    const productCards = document.querySelectorAll(".product-card");

    filters.forEach(function (filter) {

        filter.addEventListener("click", function () {

            filters.forEach(function (item) {
                item.classList.remove("active");
            });

            filter.classList.add("active");

            const selected = filter.getAttribute("data-filter");

            productCards.forEach(function (card) {

                const category = card.getAttribute("data-category");

                if (selected === "all" || selected === category) {
                    card.style.display = "";
                } else {
                    card.style.display = "none";
                }
            });
        });
    });


    /* =========================
       CATEGORY BUTTONS
    ========================= */

    document.querySelectorAll(".category-card").forEach(function (categoryCard) {

        categoryCard.addEventListener("click", function () {

            const category = categoryCard.getAttribute("data-category");

            document.getElementById("products").scrollIntoView({
                behavior: "smooth"
            });

            filters.forEach(function (filter) {

                if (filter.getAttribute("data-filter") === category) {

                    filters.forEach(function (item) {
                        item.classList.remove("active");
                    });

                    filter.classList.add("active");
                }
            });

            productCards.forEach(function (card) {

                if (card.getAttribute("data-category") === category) {
                    card.style.display = "";
                } else {
                    card.style.display = "none";
                }

            });
        });
    });


    /* =========================
       CART
    ========================= */

    let cart = [];

    const cartBtn = document.getElementById("cartBtn");
    const cartDrawer = document.getElementById("cartDrawer");
    const cartOverlay = document.getElementById("cartOverlay");
    const closeCart = document.getElementById("closeCart");
    const cartItems = document.getElementById("cartItems");
    const cartCount = document.getElementById("cartCount");
    const cartTotal = document.getElementById("cartTotal");
    const checkoutBtn = document.getElementById("checkoutBtn");

    function openCart() {
        cartDrawer.classList.add("open");
        cartOverlay.classList.add("show");
        document.body.classList.add("no-scroll");
    }

    function closeCartDrawer() {
        cartDrawer.classList.remove("open");
        cartOverlay.classList.remove("show");
        document.body.classList.remove("no-scroll");
    }

    cartBtn.addEventListener("click", openCart);
    closeCart.addEventListener("click", closeCartDrawer);
    cartOverlay.addEventListener("click", closeCartDrawer);


    /* =========================
       ADD TO CART
    ========================= */

    document.querySelectorAll(".add-cart").forEach(function (button) {

        button.addEventListener("click", function () {

            const name = button.getAttribute("data-name");
            const price = Number(button.getAttribute("data-price"));

            const existing = cart.find(function (item) {
                return item.name === name;
            });

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

            showToast(
                "Added to cart",
                name + " was added successfully."
            );
        });
    });


    /* =========================
       UPDATE CART
    ========================= */

    function updateCart() {

        let totalItems = 0;
        let totalPrice = 0;

        cart.forEach(function (item) {
            totalItems += item.quantity;
            totalPrice += item.price * item.quantity;
        });

        cartCount.textContent = totalItems;
        cartTotal.textContent = "₹" + totalPrice;

        if (cart.length === 0) {

            cartItems.innerHTML = `
                <div class="empty-cart">
                    <div>🛒</div>
                    <h3>Your cart is empty</h3>
                    <p>Add some fresh products to get started.</p>
                </div>
            `;

            return;
        }

        cartItems.innerHTML = "";

        cart.forEach(function (item, index) {

            const cartItem = document.createElement("div");

            cartItem.className = "cart-item";

            cartItem.innerHTML = `
                <div>
                    <h4>${item.name}</h4>
                    <p>₹${item.price} × ${item.quantity}</p>
                </div>

                <button class="remove-item" data-index="${index}">
                    ×
                </button>
            `;

            cartItems.appendChild(cartItem);
        });


        document.querySelectorAll(".remove-item").forEach(function (button) {

            button.addEventListener("click", function () {

                const index = Number(
                    button.getAttribute("data-index")
                );

                cart.splice(index, 1);

                updateCart();
            });
        });
    }


    /* =========================
       QUICK VIEW
    ========================= */

    const modalOverlay = document.getElementById("modalOverlay");
    const modalClose = document.getElementById("modalClose");
    const modalName = document.getElementById("modalName");
    const modalPrice = document.getElementById("modalPrice");
    const modalAdd = document.getElementById("modalAdd");

    let selectedProduct = null;

    document.querySelectorAll(".quick-view").forEach(function (button) {

        button.addEventListener("click", function () {

            const name = button.getAttribute("data-name");
            const price = button.getAttribute("data-price");

            selectedProduct = {
                name: name,
                price: parseInt(price.replace(/\D/g, "")) || 0
            };

            modalName.textContent = name;
            modalPrice.textContent = price;

            modalOverlay.classList.add("show");
            document.body.classList.add("no-scroll");
        });
    });


    modalClose.addEventListener("click", closeModal);

    modalOverlay.addEventListener("click", function (event) {

        if (event.target === modalOverlay) {
            closeModal();
        }
    });

    function closeModal() {
        modalOverlay.classList.remove("show");
        document.body.classList.remove("no-scroll");
    }


    modalAdd.addEventListener("click", function () {

        if (!selectedProduct) {
            return;
        }

        const existing = cart.find(function (item) {
            return item.name === selectedProduct.name;
        });

        if (existing) {
            existing.quantity++;
        } else {
            cart.push({
                name: selectedProduct.name,
                price: selectedProduct.price,
                quantity: 1
            });
        }

        updateCart();

        showToast(
            "Added to cart",
            selectedProduct.name + " was added successfully."
        );

        closeModal();
    });


    /* =========================
       OFFER BUTTON
    ========================= */

    const offerBtn = document.getElementById("offerBtn");

    if (offerBtn) {

        offerBtn.addEventListener("click", function () {

            document.getElementById("products").scrollIntoView({
                behavior: "smooth"
            });

        });
    }


    /* =========================
       NEWSLETTER
    ========================= */

    const newsletterForm = document.getElementById("newsletterForm");

    newsletterForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const email = document.getElementById("emailInput").value;

        showToast(
            "Subscription successful",
            "Thank you for subscribing!"
        );

        newsletterForm.reset();
    });


    /* =========================
       CHECKOUT
    ========================= */

    checkoutBtn.addEventListener("click", function () {

        if (cart.length === 0) {

            showToast(
                "Cart is empty",
                "Add some products before checkout."
            );

            return;
        }

        showToast(
            "Order ready",
            "Checkout functionality can be connected next."
        );
    });


    /* =========================
       TOAST
    ========================= */

    const toast = document.getElementById("toast");
    const toastTitle = document.getElementById("toastTitle");
    const toastText = document.getElementById("toastText");

    let toastTimer;

    function showToast(title, text) {

        toastTitle.textContent = title;
        toastText.textContent = text;

        toast.classList.add("show");

        clearTimeout(toastTimer);

        toastTimer = setTimeout(function () {
            toast.classList.remove("show");
        }, 3000);
    }


    /* =========================
       NAV ACTIVE LINK
    ========================= */

    const sections = document.querySelectorAll("section[id]");
    const navItems = document.querySelectorAll(".nav-links a");

    window.addEventListener("scroll", function () {

        let current = "";

        sections.forEach(function (section) {

            const sectionTop = section.offsetTop - 120;

            if (window.scrollY >= sectionTop) {
                current = section.getAttribute("id");
            }
        });

        navItems.forEach(function (link) {

            link.classList.remove("active");

            if (
                link.getAttribute("href") === "#" + current
            ) {
                link.classList.add("active");
            }
        });
    });


    /* =========================
       ESCAPE KEY
    ========================= */

    document.addEventListener("keydown", function (event) {

        if (event.key === "Escape") {
            closeSearchBox();
            closeModal();
            closeCartDrawer();
        }

    });

});
