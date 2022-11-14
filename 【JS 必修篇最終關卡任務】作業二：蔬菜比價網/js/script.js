/******************\
| Part I - Search  
\******************/
const buttonGroup = document.querySelector(".button-group");
const btnArray = document.querySelectorAll(".btn-type");
const allBtn = document.querySelector(".allBtn");
const cropInput = document.querySelector("#crop");
const search = document.querySelector(".search");
const showList = document.querySelector(".showList");
const order = document.querySelector("#js-select");
const orderMobile = document.querySelector("#js-moblie-select");
const tHead = document.querySelector("thead");

let value = "";

let allArr = [];
let filteredArr = [];
let veggieArr = [];
let fruitArr = [];
let flowerArr = [];
let showArr = [];


//Call API
axios
    .get("https://hexschool.github.io/js-filter-data/data.json")
    .then((response) => {
        allArr = response.data.filter(i => {
            return i["作物名稱"];
        });
    })
    .catch(error => {
        console.log(error);
    });


//Click - To search (Search button)
search.addEventListener("click", (e) => {
    startSearching();
});

//Click(Keypress) - To search (Enter key)
cropInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        startSearching();
    }
});

//Function - Start searching
function startSearching() {
    if (cropInput.value.trim() !== "") {
        value = cropInput.value;
        showCenterMessage("資料載入中...");
        resetTab();
        filterArr();
        decideArr();
    }
    else {
        alert("請輸入作物名稱");
    }

    order.value = "排序";
    orderMobile.value = "排序";
}

//Function - Show messages other than data list
function showCenterMessage(message) {
    showList.innerHTML = "";

    const dataRow = document.createElement("tr");
    dataRow.innerHTML = `
      <td colspan="7" class="text-center p-3">
        ${message}
      </td>  
    `;

    showList.append(dataRow);
}

//Function - Filter list by keyword
function filterArr() {
    let regex = new RegExp(value);

    filteredArr = allArr.filter((i) => {
        return regex.test(i["作物名稱"]);
    });

    veggieArr = filteredArr.filter((i) => {
        return i["種類代碼"] === "N04";
    });

    fruitArr = filteredArr.filter((i) => {
        return i["種類代碼"] === "N05";
    });

    flowerArr = filteredArr.filter((i) => {
        return i["種類代碼"] === "N06";
    });

    order.value = "排序";
    orderMobile.value = "排序";
}

//Click - Select tab and set active
buttonGroup.addEventListener("click", (e) => {
    btnArray.forEach((i) => {
        i.classList.remove("btn--active");
    });
    if (e.target.classList.contains("btn-type")) {
        e.target.classList.add("btn--active");
    }

    if (value !== "") {
        decideArr();
        order.selectedIndex = 0;
        orderMobile.selectedIndex = 0;
    }
});

//Function - Return to the "All" tab
function resetTab() {
    btnArray.forEach((i) => {
        i.classList.remove("btn--active");
    });

    allBtn.classList.add("btn--active");
}

//Function - Decide showArr based on active tab
function decideArr() {
    btnArray.forEach((i) => {
        if (i.classList.contains("btn--active")) {
            switch (i.dataset.type) {
                case "all":
                    showArr = filteredArr;
                    break;
                case "N04":
                    showArr = veggieArr;
                    break;
                case "N05":
                    showArr = fruitArr;
                    break;
                case "N06":
                    showArr = flowerArr;
                    break;
            }
        }
    });

    dropdownOrderDesc(document.querySelector("option[value='交易量']").value);
}

//Function - Render list
function renderList() {
    showList.innerHTML = "";

    if (showArr.length > 0) {
        showArr.forEach((i) => {
            const dataRow = document.createElement("tr");
            dataRow.innerHTML = `
                <td>${i["作物名稱"]}</td>
                <td>${i["市場名稱"]}</td>
                <td data-value="上價">${i["上價"]}</td>
                <td data-value="中價">${i["中價"]}</td>
                <td data-value="下價">${i["下價"]}</td>
                <td data-value="平均價">${i["平均價"]}</td>
                <td data-value="交易量">${i["交易量"]}</td>
            `;
            showList.append(dataRow);
        });
    }
    else {
        showCenterMessage("查詢不到當日的交易資訊QQ");
    }
}

/******************\
| Part II - Sort  
\******************/
//Click(select tab) - Use the dropdown menu to sort
order.addEventListener("change", (e) => {
    dropdownOrderAsc(e.target.value);
});

//Click(select tab) - Use the dropdown menu to sort (mobile)
orderMobile.addEventListener("change", (e) => {
    dropdownOrderAsc(e.target.value);
});

//Function - Sort the datalist based on dropdown
function dropdownOrderAsc(target) {
    showArr.sort((a, b) => {
        return a[target] - b[target];
    });

    renderList();
}

function dropdownOrderDesc(target) {
    showArr.sort((a, b) => {
        return b[target] - a[target];
    });

    renderList();
}

//Click - Sort the datalist when the carets are clicked
tHead.addEventListener("click", (e) => {
    order.value = e.target.dataset.price;
    orderMobile.value = e.target.dataset.price;

    if (e.target.dataset.sort === "up") {
        dropdownOrderAsc(e.target.dataset.price);
    }
    else if (e.target.dataset.sort === "down") {
        dropdownOrderDesc(e.target.dataset.price);
    }
});