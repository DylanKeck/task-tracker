window.onload = function() {
    loadTasks()
};

// DOM references
const taskList = document.getElementById("task-list");
const taskInput = document.getElementById("task-input");
const taskForm = document.getElementById("task-form");
const taskDate = document.getElementById("task-date");
const taskPriority = document.getElementById("task-priority");

taskForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addTask();
})

// Creates and appends a new task to the task list
function addTask() {
    const taskText = taskInput.value.trim();
    if (!taskText) {
        alert("Please enter a task.");
        return;
    }
    if (taskPriority.value === "Choose priority") {
        alert("Please select a valid priority.");
        return;
    }
    const listItem = document.createElement("li");
    const taskContent = document.createElement('div');
    taskContent.classList.add('task-content');
    const textSpan = document.createElement("span");
    textSpan.textContent = taskText;
    const dateSpan = document.createElement("span");
    dateSpan.classList.add('task-date');

    taskContent.appendChild(textSpan);
    taskContent.appendChild(dateSpan);

    const buttonContainer = document.createElement('div');
    const completeButton = completeTask();
    const deleteButton = createDeleteButton();
    buttonContainer.appendChild(completeButton);
    buttonContainer.appendChild(deleteButton);


    listItem.appendChild(taskContent);
    listItem.appendChild(buttonContainer);

    listItem.setAttribute("data-task-date", taskDate.value);
    textSpan.classList.add(taskPriority.value);
    listItem.setAttribute("data-priority", taskPriority.value);

    taskList.appendChild(listItem);

    taskInput.value = "";
    taskDate.value = "";

    saveTasks();
    pastDue(listItem);
}

// Loads tasks from localStorage and displays them
function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.forEach(task => {
        const listItem = document.createElement("li");

        const taskContent = document.createElement('div');
        taskContent.classList.add('task-content');

        const textSpan = document.createElement("span");
        textSpan.textContent = task.text;

        const dateSpan = document.createElement("span");
        dateSpan.textContent = ` Due: ${task.dueDate || "None"}`;
        dateSpan.classList.add('task-date');

        taskContent.appendChild(textSpan);
        taskContent.appendChild(dateSpan);

        const buttonContainer = document.createElement('div');
        const completeButton = completeTask();
        const deleteButton = createDeleteButton();
        buttonContainer.appendChild(completeButton);
        buttonContainer.appendChild(deleteButton);

        listItem.appendChild(taskContent);
        listItem.appendChild(buttonContainer);

        listItem.setAttribute("data-task-date", task.dueDate || '');

        if (task.completed) {
            listItem.classList.add("completed");
        }

        textSpan.classList.add(task.priority);
        listItem.setAttribute("data-priority", task.priority);

        taskList.appendChild(listItem);
        pastDue(listItem);
    });
}

// Saves current tasks to localStorage
function saveTasks() {
    const tasks = [];
    document.querySelectorAll("#task-list li").forEach((li) => {
        const textSpan = li.querySelector(".task-content span:first-child");
        if (textSpan) {
            tasks.push({
                text: textSpan.textContent,
                completed: li.classList.contains("completed"),
                dueDate: li.getAttribute("data-task-date"),
                priority: li.getAttribute("data-priority"),
            });
        }
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Creates the Delete button for a task
function createDeleteButton() {
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.className = "px-5 py-1 ml-2 mb-2 text-sm font-medium text-center text-white border-white border-1 bg-red-950 rounded-lg hover:bg-blue-800";
    deleteButton.addEventListener("click", (e) => {
        e.target.closest('li').remove();
        saveTasks();
    });
    return deleteButton;
}

// Creates the Complete button for a task
function completeTask () {
    const completeButton = document.createElement("button");
    completeButton.textContent = "Complete";
    completeButton.className = "ml-4 px-3 py-1 text-sm font-medium text-center text-white border-white border-1 bg-red-950 rounded-lg hover:bg-blue-800";
    completeButton.type = "button";
    completeButton.addEventListener("click", (e) => {
        const listItem = e.target.closest('li');
        listItem.classList.toggle("completed")
        saveTasks()
    });
    return completeButton;
}

// Checks if the task's due date is before today and marks it visually
function pastDue (listItem) {
    const today = new Date().toISOString().split('T')[0]
    const dates = {
        today: today,
        due: listItem.getAttribute("data-task-date"),
    }
    if (dates.today > dates.due && dates.due) {
        listItem.classList.add("text-red-500")
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
        // task.classList.toggle("hidden", !shouldShow);
        if (filter === "high" && priority !== "high") shouldShow = false;
        if (filter === "medium" && priority !== "medium") shouldShow = false;
        if (filter === "low" && priority !== "low") shouldShow = false;
        if (filter === "overdue" && today <= dueDate) shouldShow = false;
        task.style.display = shouldShow ? "flex" : "none";
    })
}
const toggleButton = document.getElementById('toggle-nav');
const filterNav = document.getElementById('filter-list');

toggleButton.addEventListener('click', () => {
    filterNav.classList.toggle('md:hidden');
    filterNav.classList.toggle('hidden');

    filterNav.classList.toggle("flex");
});
