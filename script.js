
const row = document.getElementById("catalogueRow")

const currentCart = document.getElementById("cartList")
const clearCart = document.getElementById("clearCartButton")


// INITIALIZE CART
let cart = JSON.parse(localStorage.getItem("cart")) || []



// INITIALIZE BOOK CLASS

class Book {
    constructor(_id, _title, _img, _price, _category) {
        this.id = _id;
        this.title = _title;
        this.img = _img;
        this.price = _price;
        this.category = _category
    }


    // add book to cart method
    addBookToCart(book) {
    if (!cart.find(b => b.id === book.id)) {
        cart.push(book);
        localStorage.setItem("cart", JSON.stringify(cart));
        }
    }

    // remove book from cart method
    removeBookFromCart(book) {
        cart = cart.filter(b => b.id !== book.id);
        localStorage.setItem("cart", JSON.stringify(cart));
    }

}


// MAIN FETCH AND DISPLAY FUNCTION

const getBooks = function() {

    fetch("https://striveschool-api.herokuapp.com/books")

    .then((response) => {
        if (response.ok) {
            return response.json()
        } else {
            throw new Error("Data not available: " + response.status)
        }
     })
    
    .then((data) => {

        console.log(data)

        // assemble card from data fetched

        data.forEach(element => {

            //create new Book object
            const newBook = new Book(element["asin"], element["title"], element["img"], element["price"], element["category"])
            
            
            // create card elements and card

            const card = document.createElement("div")
            card.classList.add("card", "col-6", "col-sm-4", "col-md-3", "col-lg-2", "p-0", "d-flex", "flex-column", "justify-content-between")
            card.style.minWidth = "200px"

            const cardImg = document.createElement("img")
            cardImg.classList.add("card-img-top", "img-fluid")
            cardImg.src = newBook.img
            cardImg.style.height = "250px";
            cardImg.style.objectFit = "cover";

            const cardBody = document.createElement("div")
            cardBody.classList.add("card-body", "p-3")

            const cardTitle = document.createElement("h6")
            cardTitle.innerText = newBook.title
            cardTitle.style.height = "58px";
            cardTitle.style.overflow = "hidden";

            const cardCategory = document.createElement("p")
            cardCategory.classList.add("mb-1")
            cardCategory.style.height = "30px";
            cardCategory.style.overflow = "hidden";
            cardCategory.innerText = "Category: " + newBook.category

            const cardPrice = document.createElement("h6")
            cardPrice.classList.add("mb-1")
            cardPrice.innerText = newBook.price + "$"
            cardPrice.style.height = "30px";
            cardPrice.style.overflow = "hidden";


            // create buttons

            const buttonContainer = document.createElement("div");
            buttonContainer.classList.add("mt-auto", "d-flex", "justify-content-between");

            const buyButton = document.createElement("a")
            buyButton.href = "#"
            buyButton.classList.add("btn", "btn-sm", "btn-primary", "mx-1", "add-to-cart-button")
            buyButton.innerText = "Add To Cart"

            const deleteButton = document.createElement("a")
            deleteButton.href = "#"
            deleteButton.classList.add("btn", "btn-sm", "btn-danger", "mx-1")
            deleteButton.innerText = "Delete"


            // ADD EVENT LISTENERS TO CARD BUTTONS

            // add book
            buyButton.addEventListener("click", function (e) {

                e.preventDefault();

                if (!cart.find(b => b.id === newBook.id)) {

                    buyButton.innerText = "Remove from cart";
                    buyButton.classList.remove("btn-primary");
                    buyButton.classList.add("btn-warning");

                    newBook.addBookToCart(newBook);

                } else {

                    buyButton.innerText = "Add To Cart";
                    buyButton.classList.remove("btn-warning");
                    buyButton.classList.add("btn-primary");

                    newBook.removeBookFromCart(newBook);

                }

                displayCart(); 
            });

            // delete book
            deleteButton.addEventListener("click", function(e) {
                e.preventDefault();

                const card = e.target.closest(".card");

                // remove from DOM
                card.remove();

                // remove from cart if exists
                newBook.removeBookFromCart(newBook.id);

                // reset button state (optional safety)
                console.log("Removed:", newBook.id);
            });

            // append card to catalogue section

            buttonContainer.append(buyButton, deleteButton);
            cardBody.append(cardTitle, cardCategory, cardPrice, buttonContainer)
            card.append(cardImg,cardBody)

            row.appendChild(card)

        });

     })

    // catch fetching error
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error)
    })
}


// DISPLAY CART IN OFFCANVAS FUNCTION

const displayCart = function() {

    currentCart.innerHTML = ""; 

    let total = 0;

    cart.forEach((element) => {

        const cartItem = document.createElement("div");
        cartItem.classList.add("card", "p-2", "mb-2");

        const cartItemTitle = document.createElement("h5");
        cartItemTitle.innerText = element.title;

        const cartItemPrice = document.createElement("h6");
        cartItemPrice.innerText = element.price + "$";

        total += Number(element.price);

        cartItem.append(cartItemTitle, cartItemPrice);
        currentCart.appendChild(cartItem);
    });

    const totalPrice = document.createElement("h5");
    totalPrice.classList.add("mt-3");
    totalPrice.innerText = "Total: " + total + "$";

    currentCart.appendChild(totalPrice);
}

// ATTACH EVENT LISTENERS TO OFFCANVAS CART

clearCart.addEventListener("click", function(e) {

    e.preventDefault()

    // clearing and displaying empty cart
    cart = []
    localStorage.setItem("cart", JSON.stringify(cart))
    displayCart()
    currentCart.innerHTML = "<h6>No Items</h6>"

    // restoring buttons
    const buttons = document.querySelectorAll(".add-to-cart-button")
    buttons.forEach((button) => {
        button.classList.remove("btn-warning")
        button.classList.add("btn-primary")
        button.innerText = "AddT To Cart"
    })

})



getBooks()
displayCart()