const btnAdd = document.querySelector(".btn--add");
const inputBox = document.querySelector(".input-box");
const tab = document.querySelector(".tab");
const tabCollection = document.querySelectorAll(".tab__item");
const tabAll = document.querySelector(".tab--all");
const tabPending = document.querySelector(".tab--pending");
const tabCompleted = document.querySelector(".tab--completed");
const list = document.querySelector(".list");
const reminderPending = document.querySelector(".reminder--pending");
const deleteAll = document.querySelector(".delete-all");

var todoArr = [];

var taskAll = [];
var taskPending = [];
var taskCompleted = [];

//Click - Enter todo items (Add button)
btnAdd.addEventListener("click", (e) => {
  addToDo();
});

//Click(Keypress) - Enter todo items (Enter Key)
inputBox.addEventListener("keypress", (e) => {
  if(e.key === "Enter") {
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
    
    todoArr.push(todo);
    createTask(todo);
    updateTaskArr();
    inputBox.value = "";
  }
}

//Function - Create task content using todo status
function createTask(todo) {
  const task = document.createElement("li");
  
  task.setAttribute("class", `task`);
  task.setAttribute("data-key", todo.id);
  task.innerHTML = `
    <label class="checkbox" for="${todo.id}">
      <input id=${todo.id} class="task__input" type="checkbox">
      <span>${todo.text}</span>
    </label>
    <a class="delete" href="#"></a>
  `;
  
  taskAll.unshift(task);
};

//Function - Update tasks shown
function updateTaskArr() {
  const allID = [];
  const completedID = [];
  const pendingID = [];
  
  taskCompleted = [];
  taskPending = [];
  
  var tempArr = [];
  
  //Mark and categorize the ids of todos
  todoArr.forEach(i => {
    allID.push(i.id);
    
    if (i.checked === true) {
      completedID.push(i.id);
    }
    else {
      pendingID.push(i.id);
    } 
  });
  
  //Update tasks using categorized todo-ids
  taskAll.forEach(task => {
    allID.forEach(id => {
      if(Number(task.dataset.key) === id) {
        tempArr.push(task);
      }
    })
    
    completedID.forEach(id => {
      if(Number(task.dataset.key) === id) {
        taskCompleted.push(task);
      }
    });
    
    pendingID.forEach(id => {
      if(Number(task.dataset.key) === id) {
        taskPending.push(task);
      }
    });
    
  });
  
  taskAll = tempArr;
  
  decideArray();
  
  //Update number of pending tasks
  reminderPending.innerHTML = `${taskPending.length} 個待完成項目`;
}

//Function - Decide which task array to show 
function decideArray() {
  tabCollection.forEach(i => {
    if (i.classList.contains("tab__item--active")) {
      if (i.classList.contains("tab--all")) {
        renderData(taskAll);
      }
      else if (i.classList.contains("tab--pending")) {
        renderData(taskPending);
      }
      else {
        renderData(taskCompleted);
      }
    }
  });  
}

//Function - Render 
function renderData(taskArr) {
  list.innerHTML = "";
  taskArr.forEach(i => {
    list.append(i);
  });
};


//Click - Check off and delete tasks
list.addEventListener("click", (e) => {
  //Click - Check
  if (e.target.parentElement.classList.contains("checkbox")) {
    const key = e.target.parentElement.parentElement.dataset.key;
    toggleDone(key);
  }
  
  //Click - Delete
  if (e.target.classList.contains("delete")) {
    const key = e.target.parentElement.dataset.key;
    deleteToDo(key);
  }
  
  updateTaskArr();
});

//Function - Check off task
function toggleDone(key) {
  todoArr.forEach(i => {
    if(i.id === Number(key)) {
      i.checked = !i.checked;
    }
  });
  
  updateTaskArr();
}

//Function - Delete task
function deleteToDo(key) {
  const index = todoArr.findIndex(i => 
    i.id === Number(key)
  );
  todoArr = todoArr.filter(i => 
    i.id !== Number(key)
  );
  taskAll = taskAll.filter(i =>                       
    i.dataset.key !== key
  );
} 

//Click - Delete all completed tasks
deleteAll.addEventListener("click", (e) => {
  deleteAllComp();
  updateTaskArr();
});

//Function - Delete all completed tasks {
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
  
  decideArray();
});