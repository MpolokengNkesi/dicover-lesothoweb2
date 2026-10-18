// DISCOVER LESOTHO JAVASCRIPT

document.addEventListener("DOMContentLoaded", function () {

    //  DARK AND LIGHT MODE

    const themeButton = document.getElementById("themeToggle");

    if (localStorage.getItem("discoverTheme") === "dark") {
        document.body.classList.add("dark-mode");
    }

    function updateThemeButton() {
        if (themeButton) {
            themeButton.textContent =
                document.body.classList.contains("dark-mode")
                ? "Light Mode"
                : "Dark Mode";
        }
    }

    updateThemeButton();

    if (themeButton) {
        themeButton.addEventListener("click", function () {
            document.body.classList.toggle("dark-mode");

            const currentTheme =
                document.body.classList.contains("dark-mode")
                ? "dark"
                : "light";

            localStorage.setItem("discoverTheme", currentTheme);
            updateThemeButton();
        });
    }


    //  SEARCH AND FILTER DESTINATIONS

    const destinationSearch =
        document.getElementById("destinationSearch");

    const destinationFilter =
        document.getElementById("destinationFilter");

    const destinationCards =
        document.querySelectorAll(".destination-item");

    const noDestinations =
        document.getElementById("noDestinations");

    function filterDestinations() {
        if (!destinationCards.length) {
            return;
        }

        const searchText = destinationSearch.value
            .toLowerCase()
            .trim();

        const selectedCategory = destinationFilter.value;

        let visibleCount = 0;

        destinationCards.forEach(function (card) {
            const name = card.dataset.name.toLowerCase();
            const category = card.dataset.category;

            const matchesName = name.includes(searchText);

            const matchesCategory =
                selectedCategory === "all" ||
                category === selectedCategory;

            if (matchesName && matchesCategory) {
                card.classList.remove("d-none");
                visibleCount++;
            } else {
                card.classList.add("d-none");
            }
        });

        if (noDestinations) {
            noDestinations.classList.toggle(
                "d-none",
                visibleCount > 0
            );
        }
    }

    if (destinationSearch && destinationFilter) {
        destinationSearch.addEventListener(
            "input",
            filterDestinations
        );

        destinationFilter.addEventListener(
            "change",
            filterDestinations
        );
    }


    //  FILTER SOUVENIRS BY CATEGORY

    const shopFilters =
        document.querySelectorAll("[data-shop-filter]");

    const shopItems =
        document.querySelectorAll(".shop-item");

    shopFilters.forEach(function (button) {

        button.addEventListener("click", function () {

            const category = button.dataset.shopFilter;

            shopFilters.forEach(function (filterButton) {
                filterButton.classList.remove("active");
            });

            button.classList.add("active");

            shopItems.forEach(function (item) {

                const itemCategory = item.dataset.category;

                if (
                    category === "all" ||
                    itemCategory === category
                ) {
                    item.classList.remove("d-none");
                } else {
                    item.classList.add("d-none");
                }

            });
        });

    });


    //  GALLERY IMAGE PREVIEW

    const galleryModalElement =
        document.getElementById("galleryModal");

    const galleryButtons =
        document.querySelectorAll(".gallery-image");

    if (galleryModalElement && window.bootstrap) {

        const galleryModal =
            new bootstrap.Modal(galleryModalElement);

        galleryButtons.forEach(function (button) {

            button.addEventListener("click", function () {

                const image =
                    document.getElementById("modalImage");

                const caption =
                    document.getElementById("modalCaption");

                const title =
                    document.getElementById("galleryModalLabel");

                image.src = button.dataset.image;
                image.alt = button.dataset.caption;

                caption.textContent = button.dataset.caption;
                title.textContent = button.dataset.caption;

                galleryModal.show();

            });

        });
    }


    //  SOUVENIR SHOPPING cart

    const cartStorageKey = "discoverLesothoCart";

    let cart = [];

    try {
        cart = JSON.parse(
            localStorage.getItem(cartStorageKey) || "[]"
        );

        if (!Array.isArray(cart)) {
            cart = [];
        }

    } catch (error) {
        cart = [];
    }

    // Format prices in Lesotho maloti.
    function formatMoney(amount) {
        return "M " + Number(amount).toLocaleString("en-US");
    }

    // Save cart in the browser.
    function saveCart() {
        localStorage.setItem(
            cartStorageKey,
            JSON.stringify(cart)
        );

        displayCart();
    }

    // Display cart items, quantities and total.
    function displayCart() {

        const cartItems = document.getElementById("cartItems");
        const cartCount = document.getElementById("cartCount");
        const cartTotal = document.getElementById("cartTotal");

        
        if (!cartItems || !cartCount || !cartTotal) {
            return;
        }

        const numberOfItems = cart.reduce(
            function (total, item) {
                return total + item.quantity;
            },
            0
        );

        const totalPrice = cart.reduce(
            function (total, item) {
                return total + item.price * item.quantity;
            },
            0
        );

        cartCount.textContent =
            numberOfItems +
            (numberOfItems === 1 ? " item" : " items");

        cartTotal.textContent = formatMoney(totalPrice);

        if (cart.length === 0) {
            cartItems.innerHTML = "<p>Your cart is empty.</p>";
            return;
        }

        cartItems.innerHTML = "";

        cart.forEach(function (item) {

            const row = document.createElement("div");
            row.className = "cart-item";

            const information = document.createElement("div");

            const name = document.createElement("strong");
            name.textContent = item.name;

            const details = document.createElement("p");
            details.textContent =
                formatMoney(item.price) +
                " x " + item.quantity;

            const subtotal = document.createElement("p");
            subtotal.textContent =
                "Subtotal: " +
                formatMoney(item.price * item.quantity);

            information.appendChild(name);
            information.appendChild(details);
            information.appendChild(subtotal);

            const removeButton = document.createElement("button");
            removeButton.type = "button";
            removeButton.textContent = "Remove one";

            removeButton.addEventListener("click", function () {

                const foundItem = cart.find(function (cartItem) {
                    return cartItem.id === item.id;
                });

                if (foundItem) {
                    foundItem.quantity--;
                }

                cart = cart.filter(function (cartItem) {
                    return cartItem.quantity > 0;
                });

                saveCart();

            });

            row.appendChild(information);
            row.appendChild(removeButton);

            cartItems.appendChild(row);

        });
    }


    // Add a product to the cart.
    const addButtons = document.querySelectorAll(".add-cart");

    addButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            const productId = button.dataset.id;

            const productName = button.dataset.name;

            const productPrice = Number(button.dataset.price);

            const existingProduct = cart.find(function (item) {
                return item.id === productId;
            });

            if (existingProduct) {
                existingProduct.quantity++;
            } else {
                cart.push({
                    id: productId,
                    name: productName,
                    price: productPrice,
                    quantity: 1
                });
            }

            saveCart();

            const originalText = button.textContent;

            button.textContent = "Added to cart";

            setTimeout(function () {
                button.textContent = originalText;
            }, 1000);

        });

    });


    // Clear the entire cart.
    const clearCartButton =
        document.getElementById("clearCart");

    if (clearCartButton) {

        clearCartButton.addEventListener("click", function () {

            cart = [];
            saveCart();

        });

    }

    // Show cart contents immediately when the shop opens
    displayCart();


    //  SOUVENIR CHECKOUT FORM

    const checkoutForm =
        document.getElementById("checkoutForm");

    if (checkoutForm) {

        checkoutForm.addEventListener("submit", function (event) {

            event.preventDefault();

            const message =
                document.getElementById("checkoutMessage");

            if (!checkoutForm.checkValidity()) {
                checkoutForm.reportValidity();
                return;
            }

            if (cart.length === 0) {
                message.className = "form-message error";

                message.textContent =
                    "Please add a souvenir to your cart first.";

                return;
            }

            const total = cart.reduce(
                function (sum, item) {
                    return sum + item.price * item.quantity;
                },
                0
            );

            const paymentMethod =
                document.getElementById("paymentMethod").value;

            message.className = "form-message success";

            message.textContent =
                " order successful. Total: " +
                formatMoney(total) +
                ". Payment choice: " +
                paymentMethod +
                ". Your payment has been processed successfully.";

            // Empty the cart after the  order.
            cart = [];
            saveCart();

            checkoutForm.reset();

        });

    }


    //  ACTIVITY COST CALCULATOR

    const activityType =
        document.getElementById("activityType");

    const peopleCount =
        document.getElementById("peopleCount");

    const activityTotal =
        document.getElementById("activityTotal");

    function calculateActivityCost() {

        if (!activityType || !peopleCount || !activityTotal) {
            return;
        }

        let people = Number(peopleCount.value);

        if (!Number.isFinite(people) || people < 1) {
            people = 1;
        }

        if (people > 30) {
            people = 30;
        }

        peopleCount.value = people;

        const pricePerPerson = Number(activityType.value);

        const totalCost = pricePerPerson * people;

        activityTotal.textContent = formatMoney(totalCost);

    }

    if (activityType && peopleCount) {

        activityType.addEventListener(
            "change",
            calculateActivityCost
        );

        peopleCount.addEventListener(
            "input",
            calculateActivityCost
        );

        calculateActivityCost();

    }


    // 8. ACTIVITY BUTTONS CONNECT TO CONTACT PAGE

    const activityButtons =
        document.querySelectorAll(".activity-book");

    activityButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            localStorage.setItem(
                "discoverRequestedActivity",
                button.dataset.activity
            );

            window.location.href = "contact.html";

        });

    });


    //  BOOKING FORM VALIDATION

    const bookingForm =
        document.getElementById("bookingForm");

    if (bookingForm) {

        const dateInput =
            document.getElementById("tripDate");

        const today = new Date();

        const localToday = new Date(
            today.getTime() -
            today.getTimezoneOffset() * 60000
        ).toISOString().split("T")[0];

        dateInput.min = localToday;

        // If a visitor came from the Activities page,
        // pre-fill the enquiry with the chosen activity.
        const requestedActivity =
            localStorage.getItem("discoverRequestedActivity");

        const destinationSelect =
            document.getElementById("destination");

        const messageField =
            document.getElementById("message");

        if (requestedActivity) {

            if (destinationSelect) {
                const optionExists = Array.from(
                    destinationSelect.options
                ).some(function (option) {
                    return option.value === requestedActivity ||
                        option.textContent === requestedActivity;
                });

                if (optionExists) {
                    destinationSelect.value = requestedActivity;
                } else if (messageField) {
                    messageField.value =
                        "I am interested in " + requestedActivity + ".";
                }
            }

            localStorage.removeItem("discoverRequestedActivity");

        }

        bookingForm.addEventListener("submit", function (event) {

            event.preventDefault();

            const message =
                document.getElementById("bookingMessage");

            if (!bookingForm.checkValidity()) {
                bookingForm.reportValidity();
                return;
            }

            if (messageField.value.trim().length < 10) {

                message.className = "form-message error";

                message.textContent =
                    "Please write at least 10 characters about your trip.";

                return;
            }

            message.className = "form-message success";

            message.textContent =
                "Thank you, " +
                document.getElementById("fullName").value.trim() +
                ". for your interest in exploring Lesotho! " +
                "We've received your enquiry and look forward to helping you create an unforgettable travel experience.";

                

            bookingForm.reset();

        });

    }

});

