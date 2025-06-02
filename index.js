window.onload = function() {};
const taskList = document.getElementById("task-list");
const taskInput = document.getElementById("task-input");
const taskForm = document.getElementById("task-form");
taskForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addTask();
})
function addTask() {
    const taskText = taskInput.value.trim();

    if (!taskText) {
        alert("Please enter a task.");
        return;
    }

    const listItem = document.createElement("li");

    const completeButton = completeTask();
    const deleteButton = createDeleteButton();

    const textNode = document.createTextNode(taskText);
    listItem.appendChild(textNode);
    listItem.appendChild(completeButton);
    listItem.appendChild(deleteButton);


    taskList.appendChild(listItem);
    taskInput.value = "";
}

function createDeleteButton() {
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.className = "delete-button";
    deleteButton.addEventListener("click", (e) => {
        e.target.parentElement.remove();
    });
    return deleteButton;
}
function completeTask () {
    const completeButton = document.createElement("button");
    completeButton.textContent = "Complete";
    completeButton.className = "complete-button";
    completeButton.type = "button";
    completeButton.addEventListener("click", (e) => {
        const listItem = e.target.parentElement;
        listItem.classList.toggle("completed")
    });
    return completeButton;
}
localStorage.setItem('tasks',taskInput.value);