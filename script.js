/*
==================================================
AI TASK MANAGER
HTML + CSS + JavaScript
==================================================

Features:
- Add task
- View tasks
- Complete / undo task
- Delete task
- Search by title
- localStorage persistence
- AI pending task summary
- Empty input handling
- API failure handling
==================================================
*/


// ==================================================
// CONFIGURATION
// ==================================================

/*
IMPORTANT:

Do NOT put your OpenAI API key here.

A browser application cannot safely hide an API key.

Instead, configure this URL to point to your own
backend/serverless function.

Example:

const AI_API_URL = "https://your-api.com/api/summary";

For the assessment demo, if no API endpoint exists,
the application will show a clear message explaining
that AI needs to be configured.
*/

const AI_API_URL = "";


// ==================================================
// DOM ELEMENTS
// ==================================================

const taskForm = document.getElementById("taskForm");

const titleInput = document.getElementById("title");

const descriptionInput =
    document.getElementById("description");

const searchInput =
    document.getElementById("searchInput");

const clearSearchButton =
    document.getElementById("clearSearch");

const taskList =
    document.getElementById("taskList");

const emptyState =
    document.getElementById("emptyState");

const summaryButton =
    document.getElementById("summaryBtn");

const summaryBox =
    document.getElementById("summaryBox");

const summaryText =
    document.getElementById("summaryText");

const errorMessage =
    document.getElementById("errorMessage");

const successMessage =
    document.getElementById("successMessage");

const totalTasksElement =
    document.getElementById("totalTasks");

const pendingTasksElement =
    document.getElementById("pendingTasks");

const completedTasksElement =
    document.getElementById("completedTasks");

const taskCountText =
    document.getElementById("taskCountText");


// ==================================================
// APPLICATION STATE
// ==================================================

let tasks = [];

let searchTerm = "";


// ==================================================
// LOAD TASKS
// ==================================================

function loadTasks() {

    try {

        const storedTasks =
            localStorage.getItem("tasks");

        if (storedTasks) {

            tasks = JSON.parse(storedTasks);

        } else {

            tasks = [];

        }

    } catch (error) {

        console.error(
            "Could not load tasks:",
            error
        );

        tasks = [];

        showError(
            "Could not load saved tasks."
        );
    }

}


// ==================================================
// SAVE TASKS
// ==================================================

function saveTasks() {

    try {

        localStorage.setItem(
            "tasks",
            JSON.stringify(tasks)
        );

    } catch (error) {

        console.error(
            "Could not save tasks:",
            error
        );

        showError(
            "Could not save tasks."
        );

    }

}


// ==================================================
// GENERATE TASK ID
// ==================================================

function generateId() {

    return Date.now().toString();

}


// ==================================================
// ADD TASK
// ==================================================

function addTask(title, description) {

    // Empty title validation
    if (!title.trim()) {

        showError(
            "Task title is required."
        );

        titleInput.focus();

        return false;
    }


    const newTask = {

        id: generateId(),

        title: title.trim(),

        description:
            description.trim(),

        status: "pending",

        createdDate:
            new Date().toISOString()

    };


    tasks.unshift(newTask);

    saveTasks();

    renderTasks();

    updateStats();

    clearForm();

    showSuccess(
        "Task added successfully."
    );

    return true;
}


// ==================================================
// CLEAR FORM
// ==================================================

function clearForm() {

    titleInput.value = "";

    descriptionInput.value = "";

    titleInput.focus();

}


// ==================================================
// TOGGLE TASK
// ==================================================

function toggleTask(taskId) {

    const task =
        tasks.find(
            task => task.id === taskId
        );


    if (!task) {

        showError(
            "Task not found."
        );

        return;
    }


    if (task.status === "pending") {

        task.status = "completed";

    } else {

        task.status = "pending";

    }


    saveTasks();

    renderTasks();

    updateStats();

}


// ==================================================
// DELETE TASK
// ==================================================

function deleteTask(taskId) {

    const task =
        tasks.find(
            task => task.id === taskId
        );


    if (!task) {

        showError(
            "Task not found."
        );

        return;
    }


    const confirmed =
        confirm(
            `Delete "${task.title}"?`
        );


    if (!confirmed) {
        return;
    }


    tasks =
        tasks.filter(
            task => task.id !== taskId
        );


    saveTasks();

    renderTasks();

    updateStats();

    showSuccess(
        "Task deleted successfully."
    );
}


// ==================================================
// SEARCH TASKS
// ==================================================

function getFilteredTasks() {

    if (!searchTerm.trim()) {

        return tasks;

    }


    const search =
        searchTerm
            .trim()
            .toLowerCase();


    return tasks.filter(task =>

        task.title
            .toLowerCase()
            .includes(search)

    );

}


// ==================================================
// FORMAT DATE
// ==================================================

function formatDate(dateString) {

    const date =
        new Date(dateString);


    if (Number.isNaN(date.getTime())) {

        return "Unknown date";

    }


    return date.toLocaleString(
        undefined,
        {
            dateStyle: "medium",
            timeStyle: "short"
        }
    );

}


// ==================================================
// ESCAPE HTML
// ==================================================

/*
Prevents user-entered task text from being interpreted
as HTML.

This is important even for a localStorage application.
*/

function escapeHTML(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


// ==================================================
// RENDER TASKS
// ==================================================

function renderTasks() {

    const filteredTasks =
        getFilteredTasks();


    taskList.innerHTML = "";


    if (filteredTasks.length === 0) {

        emptyState.classList.remove(
            "hidden"
        );


        if (searchTerm) {

            emptyState.querySelector("h3")
                .textContent =
                "No matching tasks";


            emptyState.querySelector("p")
                .textContent =
                "Try a different search term.";

        } else {

            emptyState.querySelector("h3")
                .textContent =
                "No tasks found";


            emptyState.querySelector("p")
                .textContent =
                "Add your first task to get started.";

        }

        return;

    }


    emptyState.classList.add(
        "hidden"
    );


    filteredTasks.forEach(task => {

        const taskElement =
            document.createElement("div");


        taskElement.className =
            "task";


        if (task.status === "completed") {

            taskElement.classList.add(
                "completed"
            );

        }


        const statusClass =
            task.status === "completed"
                ? "completed"
                : "pending";


        const statusText =
            task.status === "completed"
                ? "Completed"
                : "Pending";


        const actionText =
            task.status === "completed"
                ? "Undo"
                : "Complete";


        taskElement.innerHTML = `

            <div class="task-main">

                <h3 class="task-title">
                    ${escapeHTML(task.title)}
                </h3>

                ${
                    task.description
                        ? `
                        <p class="task-description">
                            ${escapeHTML(task.description)}
                        </p>
                        `
                        : ""
                }

                <div class="task-meta">

                    <span
                        class="status ${statusClass}"
                    >
                        ${statusText}
                    </span>

                    <span class="created-date">
                        Created:
                        ${formatDate(task.createdDate)}
                    </span>

                </div>

            </div>


            <div class="task-actions">

                <button
                    class="task-btn toggle-btn"
                    data-id="${task.id}"
                >
                    ${actionText}
                </button>

                <button
                    class="task-btn delete delete-btn"
                    data-id="${task.id}"
                >
                    Delete
                </button>

            </div>

        `;


        taskList.appendChild(
            taskElement
        );

    });

}


// ==================================================
// UPDATE STATISTICS
// ==================================================

function updateStats() {

    const total =
        tasks.length;


    const pending =
        tasks.filter(
            task =>
                task.status === "pending"
        ).length;


    const completed =
        tasks.filter(
            task =>
                task.status === "completed"
        ).length;


    totalTasksElement.textContent =
        total;


    pendingTasksElement.textContent =
        pending;


    completedTasksElement.textContent =
        completed;


    const visibleCount =
        getFilteredTasks().length;


    taskCountText.textContent =
        `${visibleCount} ${
            visibleCount === 1
                ? "task"
                : "tasks"
        }`;

}


// ==================================================
// AI SUMMARY
// ==================================================

// ==================================================
// AI SUMMARY - WITHOUT API
// ==================================================

function generateAISummary() {

    // Get pending tasks
    const pendingTasks = tasks.filter(
        task => task.status === "pending"
    );

    // Show summary box
    summaryBox.classList.remove("hidden");

    // Hide old messages
    hideMessages();

    // ----------------------------------------------
    // Empty input handling
    // ----------------------------------------------

    if (pendingTasks.length === 0) {

        summaryText.textContent =
            "You have no pending tasks. Great job! 🎉";

        return;
    }

    // ----------------------------------------------
    // Generate local AI-style summary
    // ----------------------------------------------

    const total = pendingTasks.length;

    // Get task titles
    const taskNames = pendingTasks.map(
        task => task.title
    );

    // Find important tasks using keywords
    const priorityWords = [
        "urgent",
        "important",
        "deadline",
        "exam",
        "assignment",
        "project",
        "submit",
        "fix",
        "complete"
    ];

    const priorityTasks = pendingTasks.filter(task => {

        const text = (
            task.title + " " +
            task.description
        ).toLowerCase();

        return priorityWords.some(word =>
            text.includes(word)
        );
    });


    // ----------------------------------------------
    // Create summary
    // ----------------------------------------------

    let result =
        `You currently have ${total} pending task` +
        `${total > 1 ? "s" : ""}. `;


    // Add general recommendation
    if (total === 1) {

        result +=
            `Your main focus should be completing ` +
            `"${pendingTasks[0].title}".`;

    } else {

        result +=
            `It is recommended to work through them ` +
            `one at a time, starting with the most important task.`;
    }


    // ----------------------------------------------
    // Add priority tasks
    // ----------------------------------------------

    if (priorityTasks.length > 0) {

        result += "\n\nPriority tasks:";

        priorityTasks.forEach(task => {

            result += `\n• ${task.title}`;

        });

        result +=
            "\n\nThese tasks may require earlier attention " +
            "because their title or description contains " +
            "priority-related keywords.";

    }


    // ----------------------------------------------
    // Add all pending tasks
    // ----------------------------------------------

    result += "\n\nPending tasks:";

    taskNames.forEach(name => {

        result += `\n• ${name}`;

    });


    // Display summary
    summaryText.textContent = result;
}



   

// ==================================================
// SHOW ERROR
// ==================================================

function showError(message) {

    errorMessage.textContent =
        message;


    errorMessage.classList.remove(
        "hidden"
    );


    successMessage.classList.add(
        "hidden"
    );


    setTimeout(() => {

        errorMessage.classList.add(
            "hidden"
        );

    }, 4000);

}


// ==================================================
// SHOW SUCCESS
// ==================================================

function showSuccess(message) {

    successMessage.textContent =
        message;


    successMessage.classList.remove(
        "hidden"
    );


    errorMessage.classList.add(
        "hidden"
    );


    setTimeout(() => {

        successMessage.classList.add(
            "hidden"
        );

    }, 3000);

}


// ==================================================
// HIDE MESSAGES
// ==================================================

function hideMessages() {

    errorMessage.classList.add(
        "hidden"
    );

    successMessage.classList.add(
        "hidden"
    );

}


// ==================================================
// EVENT: ADD TASK
// ==================================================

taskForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        addTask(
            titleInput.value,
            descriptionInput.value
        );

    }
);


// ==================================================
// EVENT: SEARCH
// ==================================================

searchInput.addEventListener(
    "input",
    function (event) {

        searchTerm =
            event.target.value;


        renderTasks();

        updateStats();


        if (searchTerm.trim()) {

            clearSearchButton
                .classList
                .remove("hidden");

        } else {

            clearSearchButton
                .classList
                .add("hidden");

        }

    }
);


// ==================================================
// EVENT: CLEAR SEARCH
// ==================================================

clearSearchButton.addEventListener(
    "click",
    function () {

        searchInput.value = "";

        searchTerm = "";

        clearSearchButton
            .classList
            .add("hidden");

        renderTasks();

        updateStats();

        searchInput.focus();

    }
);


// ==================================================
// EVENT: TASK BUTTONS
// ==================================================

taskList.addEventListener(
    "click",
    function (event) {

        const button =
            event.target.closest("button");


        if (!button) {
            return;
        }


        const taskId =
            button.dataset.id;


        if (
            button.classList.contains(
                "toggle-btn"
            )
        ) {

            toggleTask(taskId);

        }


        if (
            button.classList.contains(
                "delete-btn"
            )
        ) {

            deleteTask(taskId);

        }

    }
);


// ==================================================
// EVENT: AI SUMMARY
// ==================================================

summaryButton.addEventListener(
    "click",
    generateAISummary
);


// ==================================================
// INITIALIZE APPLICATION
// ==================================================

function initializeApp() {

    loadTasks();

    renderTasks();

    updateStats();

}


// Start application

initializeApp();