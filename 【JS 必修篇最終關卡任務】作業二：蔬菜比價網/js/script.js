/******************\
| Part I - Search  
\******************/
const buttonGroup = document.querySelector(".button-group");
const btnArray = document.querySelectorAll(".btn-type");
const allBtn = document.querySelector(".allBtn");
const cropInput = document.querySelector("#crop");
const search = document.querySelector(".search");
const showList = document.querySelector(".showList");

var value = "";

var filteredArr = [];
var veggieArr = [];
var fruitArr = [];
var flowerArr = [];
var showArr = [];

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
    callAPI();
  } 
  else {
    alert("請輸入作物名稱");
  }
}

//Function - Show messages other than data list
function showCenterMessage(message) {
  const dataRow = document.createElement("tr");
  dataRow.innerHTML = `
      <td colspan="7" class="text-center p-3">
        ${message}
      </td>  
  `;
  showList.append(dataRow);
}

//Function - Call API
function callAPI() {
  axios
    .get("https://hexschool.github.io/js-filter-data/data.json")
    .then((response) => {
      const allArr = response.data;
      filterArr(allArr);
      decideArr();
    });
}

//Function - Filter list by keyword
function filterArr(allArr) {
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
}

//Click - Select tab and set active
buttonGroup.addEventListener("click", (e) => {
  btnArray.forEach((i) => {
    i.classList.remove("btn--active");
  });
  if (e.target.classList.contains("btn-type")) {
    e.target.focus();
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

  allBtn.focus();
  allBtn.classList.add("btn--active");
}

//Function - Decide showArr based on active tab
function decideArr() {
  btnArray.forEach((i) => {
    if (i.classList.contains("btn--active")) {
      switch(i.dataset.type) {
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
  renderList();
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
const order = document.querySelector("#js-select");
const orderMobile = document.querySelector("#js-moblie-select");
const tHead = document.querySelector("thead");

//Click(select tab) - Use the dropdown menu to sort
order.addEventListener("change", (e) => {
  dropdownOrder(e);
});

//Click(select tab) - Use the dropdown menu to sort (mobile)
orderMobile.addEventListener("change", (e) => {
  dropdownOrder(e);
});

//Function - Sort the datalist based on dropdown
function dropdownOrder(e) {
  showArr.sort((a, b) => {
    return a[e.target.value] - b[e.target.value];
  });
  
  renderList();
}

//Click - Sort the datalist when the carets are clicked
tHead.addEventListener("click", (e) => {
  if (e.target.dataset.sort === "up") {
    showArr.sort((a, b) => {
      return a[e.target.dataset.price] - b[e.target.dataset.price];
    });
  } 
  else if (e.target.dataset.sort === "down") {
    showArr.sort((a, b) => {
      return b[e.target.dataset.price] - a[e.target.dataset.price];
    });
  }

  renderList();
});