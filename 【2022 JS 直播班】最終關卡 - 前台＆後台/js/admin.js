const chartPlaceholder = document.querySelector("#chart");
const discardAllBtn = document.querySelector(".discardAllBtn");
const orderPageTable = document.querySelector(".orderPage-table");
const orderTableBody = document.querySelector("#orderTableBody");

let orderData;

// Load data from axios when a page is open/refreshed
init();

// Click - Change order status
orderPageTable.addEventListener("click", (e) => {
    e.preventDefault();
    if (e.target.parentElement.classList.contains("orderStatus")) {
        changeOrderStatus(e.target.dataset.orderid, e.target.dataset.paid);
    }
});

// Click - Delete single item
orderPageTable.addEventListener("click", (e) => {
    if (e.target.classList.contains("delSingleOrder-Btn")) {
        deleteSingleOrder(e.target.dataset.orderid);
    }
});

// Click - Discard all
discardAllBtn.addEventListener("click", (e) => {
    e.preventDefault();
    deleteAllOrder();
});


// Function - Load data from axios when a page is open/refreshed
function init() {
    axiosGetOrder();
}

// Function - Use axios to get order list
function axiosGetOrder() {
    axios.get("https://livejs-api.hexschool.io/api/livejs/v1/admin/hexschooljs/orders",
        {
            headers: {
                Authorization: "VnLImhMBmsRFbZhohZPTTmrKFm72"
            }
        })
    .then(response => {
        orderData = response.data;
        renderOrderTable();
        createChart();
    })
    .catch((error) => {
        console.log(error);
    });
}

// Function - Render order table
function renderOrderTable() {
    if (orderData.orders.length) {
        orderTableBody.innerHTML = orderData.orders.map(i => {
            return `
                <tr>
                    <td>
                        ${i.id}
                    </td>
                    <td>
                        <p>
                            ${i.user.name}
                        </p>
                        <p>
                            ${i.user.tel}
                        </p>
                    </td>
                    <td>
                        ${i.user.address}
                    </td>
                    <td>
                        ${i.user.email}
                    </td>
                    <td>
                        <p>
                            ${i.products.map(i =>
                                `
                                    ${i.title} x ${i.quantity}
                                `
                            )
                            .join("<br>")}      
                        </p>
                    </td>
                    <td>
                        ${formatDate(i.createdAt * 1000)}
                    </td>
                    <td class="orderStatus">
                        <a href="#" data-orderid="${i.id}" data-paid="${i.paid}">
                            ${i.paid ? "已處理" : "未處理"}
                        </a>
                    </td>
                    <td>
                        <input type="button" class="delSingleOrder-Btn" data-orderid="${i.id}" value="刪除">
                    </td>
                </tr>
            `;
        })
        .join("");
    } 
    else {
        orderTableBody.innerHTML = `
            <tr>
                <td class="text-center" colspan="8">
                    目前尚無訂單
                </td>
            </tr>
        `;
    }
}

// Function - Format date
function formatDate(fullTime) {
    let baseDate = new Date(fullTime);
    console.log(baseDate);

    let year = baseDate.getFullYear();
    let month = baseDate.getMonth() + 1;
    let date = baseDate.getDate();

    console.log(baseDate, `${year}/${month}/${date}`);
    return `${year}/${month}/${date}`;
}

// Function - Change order status
function changeOrderStatus(orderId, isPaid) {
    let translatedPaid = isPaid === "true" ? true : false;

    axios.put("https://livejs-api.hexschool.io/api/livejs/v1/admin/hexschooljs/orders",
        {
            data: {
                id: orderId,
                paid: !translatedPaid
            }
        },
        {
            headers: {
                Authorization: "VnLImhMBmsRFbZhohZPTTmrKFm72"
            }
        })
        .then(response => {
            orderData = response.data;
            renderOrderTable();
        })
        .catch(error => {
            console.log(error);
        });
}

// Function - Delete all orders
function deleteAllOrder() {
    axios.delete("https://livejs-api.hexschool.io/api/livejs/v1/admin/hexschooljs/orders",
        {
            headers: {
                Authorization: "VnLImhMBmsRFbZhohZPTTmrKFm72"
            }
        })
        .then(response => {
            orderData = response.data;
            renderOrderTable();
        })
        .catch(error => {
            console.log(error);
        });
}

// Function - Delete single order
function deleteSingleOrder(orderId) {
    axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/admin/hexschooljs/orders/${orderId}`,
        {
            headers: {
                Authorization: "VnLImhMBmsRFbZhohZPTTmrKFm72"
            }
        })
        .then(response => {
            orderData = response.data;
            renderOrderTable();
        })
        .catch(error => {
            console.log(error);
        });
}

// Function - Create chart
function createChart() {
    if (orderData.orders.length) {
        let productNumObj = {};

        orderData.orders.forEach(i => {
            i.products.forEach(j => {
                productNumObj[j.title]
                    ? productNumObj[j.title]++
                    : productNumObj[j.title] = 1;
            });
        });

        productNumObj = Object.entries(productNumObj).sort((a, b) => b[1] - a[1]);

        let arr = [productNumObj[0]];
        let counter = 1;
        let others = ["其他", 0];

        for (let i = 1; i < productNumObj.length; i++) {
            if (productNumObj[i][1] !== productNumObj[i - 1][1]) {
                counter++;
            }

            counter <= 3 ? arr.push(productNumObj[i]) : others[1] += productNumObj[i][1];
        }

        arr.push(others);

        // C3.js
        let chart = c3.generate({
            bindto: "#chart", // HTML 元素綁定
            data: {
                type: "pie",
                columns: arr
            }
        });
    }
    else {
        chart.innerHTML = `
            <p class="text-center">
                目前尚無訂單
            </p>
        `
    }
}
