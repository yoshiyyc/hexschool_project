const productSelect = document.querySelector(".productSelect");
const productWrap = document.querySelector(".productWrap");
const shoppingCartTable = document.querySelector(".shoppingCart-table");
const cartTableBody = document.querySelector("#cartTableBody");
const cartTableFooter = document.querySelector("#cartTableFooter");
const orderInfoForm = document.querySelector(".orderInfo-form");
const orderInfoInputFill = document.querySelectorAll(".orderInfo-input--fill");
const customerName = document.querySelector("#customerName");
const customerPhone = document.querySelector("#customerPhone");
const customerEmail = document.querySelector("#customerEmail");
const customerAddress = document.querySelector("#customerAddress");
const tradeWay = document.querySelector("#tradeWay");
const orderInfoMessage = document.querySelectorAll(".orderInfo-message");
const orderInfoBtn = document.querySelector(".orderInfo-btn");

let productData;
let cartData;

// Load data from axios when a page is open/refreshed
init();

// Click - Filter products
productSelect.addEventListener("change", (e) => {
    filterProduct(e.target.value);
});

// Click - Add item to cart
productWrap.addEventListener("click", (e) => {
    e.preventDefault();
    if (e.target.classList.contains("addCardBtn")) {
        addToCart(e.target.dataset.addcart);
    }
});

// Click - Delete single cart item
shoppingCartTable.addEventListener("click", (e) => {
    e.preventDefault();
    if (e.target.classList.contains("material-icons")) {
        deleteCartItem(e.target.dataset.deleteitem);
    }
});

// Click - Delete all cart items
shoppingCartTable.addEventListener("click", (e) => {
    e.preventDefault();
    if (e.target.classList.contains("discardAllBtn")) {
        deleteCartAll();
    }
});

// Click - Submit form
orderInfoBtn.addEventListener("click", (e) => {
    e.preventDefault();
    validateForm();
});


// Function - Load data from axios when a page is open/refreshed
function init() {
    axiosGetProduct();
    axiosGetCart();
}

// Function use axios to get product data
function axiosGetProduct() {
    axios.get("https://livejs-api.hexschool.io/api/livejs/v1/customer/hexschooljs/products")
        .then(response => {
            productData = response.data.products;
            renderProduct(productData);
        })
        .catch(error => {
            console.log(error);
        });
}

// Function - Use axios to get cart data
function axiosGetCart() {
    axios.get("https://livejs-api.hexschool.io/api/livejs/v1/customer/hexschooljs/carts")
        .then((response) => {
            cartData = response.data;
            renderCart();
        })
        .catch((error) => {
            console.log(error);
        });
}

// Function - Render product list
function renderProduct(showProduct) {
    productWrap.innerHTML = showProduct.map(i => {
        return `
            <li class="productCard">
                <h4 class="productType">
                    新品
                </h4>
                <img src="${i.images}" alt="${i.title}">
                <a href="#" class="addCardBtn" data-addcart=${i.id}>
                    加入購物車
                </a>
                <h3>
                    ${i.title}
                </h3>
                <del class="originPrice">
                    NT$${i.origin_price.toLocaleString()}
                </del>
                <p class="nowPrice">
                    NT$${i.price.toLocaleString()}
                </p>
            </li>
        `;
    })
    .join("");
}

// Function - Render items in shopping cart
function renderCart() {
    if (cartData.carts.length) {
        cartTableBody.innerHTML = cartData.carts.map(i => {
            return `
                <tr>
                    <td>
                        <div class="cardItem-title">
                            <img src="${i.product.images}" alt="${i.product.title}">
                            <p>
                                ${i.product.title}
                            </p>
                        </div>
                    </td>
                    <td>
                        NT$${i.product.price.toLocaleString()}
                    </td>
                    <td>
                        ${i.quantity}
                    </td>
                    <td>
                        NT$${(i.product.price * i.quantity).toLocaleString()}
                    </td>
                    <td class="discardBtn">
                        <a href="#" class="material-icons" data-deleteitem="${i.id}">
                            clear
                        </a>
                    </td>
                </tr>
            `;
        })
        .join("");
    }
    else {
        cartTableBody.innerHTML = ` 
            <tr>
                <td class="text-center" colspan="4">
                    目前購物車還是空的喔
                </td>
            <tr>
        `;
    }

    cartTableFooter.innerHTML = `
      <tr>
        <td>
          <a href="#" class="discardAllBtn">
            刪除所有品項
          </a>
        </td>
        <td></td>
        <td></td>
        <td>
          <p>
            總金額
          </p>
        </td>
        <td>
          NT$${cartData.finalTotal.toLocaleString()}
        </td>
      </tr>
  `;
}

// Function - Add item to cart
function addToCart(productId) {
    let quantity = 1;

    cartData.carts.forEach((i) => {
        if (i.product.id === productId) {
            quantity = i.quantity + 1;
        }
    });

    axios.post("https://livejs-api.hexschool.io/api/livejs/v1/customer/hexschooljs/carts",
        {
            data: {
                productId: productId,
                quantity: quantity
            }
        })
        .then(response => {
            cartData = response.data;
            renderCart();
        })
        .catch(error => {
            console.log(error);
        });
}

// Function - Delete a single item in the cart
function deleteCartItem(cartId) {
    axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/customer/hexschooljs/carts/${cartId}`)
        .then(response => {
            cartData = response.data;
            renderCart();
        })
        .catch(error => {
            console.log(error);
        });
}

// Function - Delete all items in the cart
function deleteCartAll() {
    axios.delete("https://livejs-api.hexschool.io/api/livejs/v1/customer/hexschooljs/carts")
        .then((response) => {
            cartData = response.data;
            renderCart();
        })
        .catch((error) => {
            console.log(error);
        });
}

// Function - Filter products based on categories
function filterProduct(category) {
    if (category === "全部") {
        renderProduct(productData);
    } 
    else {
        let showProduct = productData.filter((i) => {
            return i.category === category;
        });

        renderProduct(showProduct);
    }
}

// Function - Submit order form
function submitOrderForm() {
    axios.post("https://livejs-api.hexschool.io/api/livejs/v1/customer/hexschooljs/orders",
        {
            data: {
                user: {
                    name: customerName.value.trim(),
                    tel: customerPhone.value.trim(),
                    email: customerEmail.value.trim(),
                    address: customerAddress.value.trim(),
                    payment: tradeWay.value
                }
            }
        })
        .then((response) => {
            alert("訂單送出成功");
            axiosGetCart();
            orderInfoInputFill.forEach(i => {
                i.value = "";
            });
            tradeWay.value = "ATM";
        })
        .catch((error) => {
            console.log(error);
            alert(error.response.data.message);
        });
}

// Function - Use validate.js to validate the form inputs
function validateForm() {
    let constraints = {
        姓名: {
            presence: {
                message: "^必填"
            }
        },
        電話: {
            presence: {
                message: "^必填"
            },
            numericality: {
                message: "^請輸入數字"
            }
        },
        Email: {
            presence: {
                message: "^必填"
            },
            email: {
                message: "^請輸入正確的 email 格式"
            }
        },
        寄送地址: {
            presence: {
                message: "^必填"
            }
        }
    };

    let errorMessage = validate(orderInfoForm, constraints);

    if (errorMessage) {
        orderInfoMessage.forEach(i => {
            errorMessage[i.dataset.message] 
                ? i.innerHTML = errorMessage[i.dataset.message]
                : i.innerHTML = "";
        });
    }
    else {
        submitOrderForm();
        orderInfoMessage.forEach(i => {
            i.innerHTML = "";
        });
    }
}