const btnAdd = document.querySelector(".btn--add");
const inputBox = document.querySelector(".input-box");
const tab = document.querySelector(".tab");
const tabCollection = document.querySelectorAll(".tab__item");
const list = document.querySelector(".list");
const reminderPending = document.querySelector(".reminder--pending");
const deleteAll = document.querySelector(".delete-all");

let todoArr = [];
let tabStatus = "all";

//Click - Enter todo items (Add button)
btnAdd.addEventListener("click", (e) => {
    addToDo();
});

//Click(Keypress) - Enter todo items (Enter Key)
inputBox.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        addToDo();
    }
});

//Function - Create todo objects (set status)
function addToDo() {
    if (inputBox.value.trim() === "") {
        alert("請輸入代辦事項");
    }
    else {
        const todo = {
            text: inputBox.value,
            checked: false,
            id: Date.now()
        };

        todoArr.unshift(todo);
        updateTodoArr();
        inputBox.value = "";
    }
}

//Function - Update todoss shown
function updateTodoArr() {
    const completedTodoArr = [];
    const pendingTodoArr = [];

    //Create arrays for different todo status
    todoArr.forEach(i => {
        if (i.checked === true) {
            completedTodoArr.push(i);
        }
        else {
            pendingTodoArr.push(i);
        }
    });

    //Update tasks using categorized todos
    if (tabStatus === "pending") {
        renderData(pendingTodoArr);
    }
    else if (tabStatus === "completed") {
        renderData(completedTodoArr);
    }
    else {
        renderData(todoArr);
    }

    //Update number of pending todos
    reminderPending.innerHTML = `${pendingTodoArr.length} 個待完成項目`;
}

//Function - Render 
function renderData(todoArr) {    
    list.innerHTML = todoArr.map(todo => {        
        return `
        <li id=${todo.id} class="task">
            <label class="checkbox" for="${todo.id}content">
                <input id="${todo.id}content" class="task__input" type="checkbox" ${todo.checked ? "checked" : ""}>
                <span>${todo.text}</span>
            </label>
            <a class="delete" href="#"></a>
        </li>
    `;
    }).join("");
};


//Click - Check off and delete todos
list.addEventListener("click", (e) => {
    //Click - Check
    if (e.target.parentElement.classList.contains("checkbox")) {
        const key = e.target.parentElement.parentElement.getAttribute("id");
        toggleDone(key);
    }

    //Click - Delete
    if (e.target.classList.contains("delete")) {
        const key = e.target.parentElement.getAttribute("id");
        deleteToDo(key);
    }

    updateTodoArr();
});

//Function - Check off todo
function toggleDone(key) {
    todoArr.forEach(i => {
        if (i.id === Number(key)) {
            i.checked = !i.checked;
        }
    });
}

//Function - Delete todos
function deleteToDo(key) {
    todoArr = todoArr.filter(i => {
        return i.id !== Number(key);
    });
}

//Click - Delete all completed todos
deleteAll.addEventListener("click", (e) => {
    deleteAllComp();
    updateTodoArr();
});

//Function - Delete all completed todos
function deleteAllComp() {
    todoArr = todoArr.filter(i => {
        return i.checked === false;
    });
}


//Click - change tab
tab.addEventListener("click", (e) => {
    tabCollection.forEach(i => {
        i.classList.remove("tab__item--active");
    });

    e.target.focus();
    e.target.classList.add("tab__item--active");

    tabCollection.forEach(i => {
        if (i.classList.contains("tab__item--active")) {
            if (i.classList.contains("tab--all")) {
                tabStatus = "all";
            }
            else if (i.classList.contains("tab--pending")) {
                tabStatus = "pending";
            }
            else {
                tabStatus = "completed";
            }
        }
    });

    updateTodoArr();
});