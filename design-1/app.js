window.onload = function () {
  main();
};

// create main function where all function connected
function main() {
  const addTodo = document.querySelector(".add-todo form");
  const input = document.querySelector(".add-todo input[type='text']");
  addTodo.addEventListener("submit", function (event) {
    event.preventDefault();
    if (input.value === "") return alert("Please add your task...");
    const { day, month, months, weekday, year } = date();
    const publishDate = `${time()}, ${weekday}, ${day} ${
      months[month]
    } ${year}`;
    const todo = {
      id: Date.now().toString(),
      value: input.value,
      shortTime: `${day} ${months[month].slice(0, 3)}`,
      publishDate,
    };
    addNewTodo(todo);
    input.value = "";
  });
  timeAndDate();
}

// time
const time = () => {
  //  4:17 PM
  const d = new Date();
  let hours = d.getHours();
  hours = hours == 0 ? 12 : hours;
  let minutes = d.getMinutes();
  let second = d.getSeconds();
  const time = `${hours <= 12 ? hours : hours - 12}:${
    minutes < 10 ? 0 + "" + minutes : minutes
  } ${hours <= 12 ? "AM" : "PM"}`;
  return time;
};

// date
const date = () => {
  // Sunday, 4 September 2022
  const d = new Date();
  let day = d.getDate(); // 1-31
  let month = d.getMonth(); // 0-11
  let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  let year = d.getFullYear();
  let weekday = d.getDay(); // 0-6
  switch (weekday) {
    case 0:
      weekday = "Sunday";
      break;
    case 1:
      weekday = "Monday";
      break;
    case 2:
      weekday = "Tuesday";
      break;
    case 3:
      weekday = "Wednesday";
      break;
    case 4:
      weekday = "Thursday";
      break;
    case 5:
      weekday = "Friday";
      break;
    case 6:
      weekday = "Saturday";
  }
  return { day, month, months, weekday, year };
};

// time and date
function timeAndDate() {
  const timer = document.querySelector(".timer");
  const { day, month, months, weekday, year } = date();
  timer.innerHTML = `<h2>${time()}</h2>
  <p>${weekday}, ${day} ${months[month]} ${year}</p>`;
  setInterval(timeAndDate, 1000 * 60);
}

// get todos from localStorage
const getTodosFromLS = () => {
  return localStorage.getItem("todos")
    ? JSON.parse(localStorage.getItem("todos"))
    : [];
};

// add todo and save in localStorage
function addNewTodo(data) {
  createTodo(data);
  const todos = getTodosFromLS();
  todos.push(data);
  localStorage.setItem("todos", JSON.stringify(todos));
}

// createTodo item
const createTodo = (data) => {
  const { id, value, shortTime } = data;

  const todoList = document.querySelector(".todos");
  const li = document.createElement("li");
  li.id = id;
  li.innerHTML = `<p>${value.slice(0, 20)}${value.length > 20 ? "..." : ""}</p>
  <span>
    <span class="added-time">${shortTime}</span>
    <span class="view"><i class="fas fa-eye-slash"></i></span>
    <span class="delete"><i class="fa-solid fa-trash"></i></span>
  </span>`;
  todoList.appendChild(li);
  const edit = li.querySelector(".todos .edit");
  const view = li.querySelector(".todos .view");
  const deleteTodo = li.querySelector(".delete");
  view.addEventListener("click", handleView);
  deleteTodo.addEventListener("click", handleDelete);
};

// todo view
const handleView = (event) => {
  const selectedTodo = event.target.parentElement.parentElement.parentElement;
  let todos = getTodosFromLS();
  todos = todos.filter((todo) => todo.id == selectedTodo.id);

  const showTodo = document.getElementById("show-todo");
  showTodo.style.display = "flex";
  showTodo.innerHTML = `<div class="content">
  <div class="close"><i class="fa-solid fa-xmark" id="close"></i></div>
  <p>${todos[0].value}</p>
  <div class="time">
    <span>Added: ${todos[0].publishDate}</span>
  </div>
</div>`;
  const close = showTodo.querySelector("#close");
  close.addEventListener("click", function () {
    showTodo.style.display = "none";
    showTodo.innerHTML = "";
  });
};

// delete todo from localStorage
const handleDelete = (event) => {
  const todoList = document.querySelector(".todos");
  const selectedTodo = event.target.parentElement.parentElement.parentElement;
  todoList.removeChild(selectedTodo);
  let todos = getTodosFromLS();
  todos = todos.filter((todo) => todo.id !== selectedTodo.id);
  localStorage.setItem("todos", JSON.stringify(todos));
};

// save todo show
const loadingTodos = () => {
  const todos = getTodosFromLS();
  todos.map((todo) => createTodo(todo));
};
window.addEventListener("DOMContentLoaded", loadingTodos);
