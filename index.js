window.onload = function() {
    loadTasks()
};
const taskList = document.getElementById("task-list");
const taskInput = document.getElementById("task-input");
const taskForm = document.getElementById("task-form");
const taskDate = document.getElementById("task-date");
const taskPriority = document.getElementById("task-priority");

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

    const textSpan = document.createElement("span");
    const dateSpan = document.createElement("span");

    textSpan.textContent = taskText;
    dateSpan.textContent = ` Due: ${taskDate.value}`;

    listItem.appendChild(textSpan);
    listItem.appendChild(dateSpan);

    listItem.appendChild(completeButton);
    listItem.appendChild(deleteButton);

    listItem.setAttribute("data-task-date", taskDate.value);

    taskList.appendChild(listItem);
    taskInput.value = "";
    taskDate.value = "";
    textSpan.classList.add(taskPriority.value)
    listItem.setAttribute("data-priority", taskPriority.value);

    saveTasks()
    pastDue(listItem)

}
function saveTasks() {
    const tasks = []
    document.querySelectorAll("#task-list li").forEach((li) => {
        tasks.push({
            text: li.querySelector("span").textContent,
            completed: li.classList.contains("completed"),
            dueDate: li.getAttribute("data-task-date"),
            priority: li.getAttribute("data-priority"),
        })
    })
    localStorage.setItem("tasks", JSON.stringify(tasks));
}
function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || []
    tasks.forEach(task => {
        const listItem = document.createElement("li");
        const textSpan = document.createElement("span");
        textSpan.textContent = task.text;
        listItem.appendChild(textSpan);
        const dateSpan = document.createElement("span");
        dateSpan.textContent = ` Due: ${task.dueDate || "None"}`;
        const completeButton = completeTask();
        const deleteButton = createDeleteButton();

        listItem.setAttribute("data-task-date", task.dueDate || '');
        pastDue(listItem)
        if (task.completed) {
            listItem.classList.add("completed");
        }
        listItem.appendChild(dateSpan)
        listItem.appendChild(completeButton)
        listItem.appendChild(deleteButton)
        taskList.appendChild(listItem)
        textSpan.classList.add(task.priority)
        listItem.setAttribute("data-priority", task.priority);
    })


}

function createDeleteButton() {
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.className = "delete-button";
    deleteButton.addEventListener("click", (e) => {
        e.target.parentElement.remove();
        saveTasks();
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
        saveTasks()
    });
    return completeButton;
}
function pastDue (listItem) {
    const today = new Date().toISOString().split('T')[0]
    const dates = {
        today: today,
        due: listItem.getAttribute("data-task-date"),
    }
    if (dates.today > dates.due) {
        listItem.classList.add("past")
    }
}

document.querySelectorAll(".filter").forEach(button => {
    button.addEventListener("click", (e) => {
        const filter = button.dataset.filter
        filterTasks(filter)
    })
})
function filterTasks(filter) {
    const tasks = document.querySelectorAll("#task-list li")

    tasks.forEach(task => {
        const priority = task.getAttribute("data-priority");
        const dueDate = task.getAttribute("data-task-date");
        const today =  new Date().toISOString().split("T")[0];

        let shouldShow = true


        if (filter === "high" && priority !== "high") shouldShow = false;
        if (filter === "medium" && priority !== "medium") shouldShow = false;
        if (filter === "low" && priority !== "low") shouldShow = false;
        if (filter === "overdue" && today <= dueDate) shouldShow = false;

        task.style.display = shouldShow ? "list-item" : "none";
    })
}
