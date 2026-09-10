const AI_API_URL = "/api/summary";

const taskForm = document.getElementById("taskForm");
const titleInput = document.getElementById("title");
const descriptionInput = document.getElementById("description");
const searchInput = document.getElementById("searchInput");
const clearSearch = document.getElementById("clearSearch");
const taskList = document.getElementById("taskList");
const emptyState = document.getElementById("emptyState");
const message = document.getElementById("message");
const summaryBtn = document.getElementById("summaryBtn");
const summaryBox = document.getElementById("summaryBox");
const summaryText = document.getElementById("summaryText");

let tasks = [];
let searchTerm = "";

function loadTasks() {
  try {
    tasks = JSON.parse(localStorage.getItem("aiTaskManagerTasks")) || [];
  } catch (error) {
    tasks = [];
    showMessage("Could not load saved tasks.");
  }
}

function saveTasks() {
  try {
    localStorage.setItem("aiTaskManagerTasks", JSON.stringify(tasks));
  } catch (error) {
    showMessage("Could not save tasks in this browser.");
  }
}

function createId() {
  return Date.now().toString() + Math.random().toString(16).slice(2);
}

function addTask(title, description) {
  tasks.unshift({
    id: createId(),
    title,
    description,
    status: "pending",
    createdDate: new Date().toISOString()
  });
  saveTasks();
  renderTasks();
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? "Unknown date" : date.toLocaleString();
}

function escapeHTML(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function filteredTasks() {
  return tasks.filter(task =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
}

function renderTasks() {
  const visibleTasks = filteredTasks();
  taskList.innerHTML = "";

  emptyState.classList.toggle("hidden", visibleTasks.length !== 0);

  visibleTasks.forEach(task => {
    const item = document.createElement("article");
    item.className = `task ${task.status === "completed" ? "completed" : ""}`;

    item.innerHTML = `
      <div class="task-header">
        <div>
          <h3>${escapeHTML(task.title)}</h3>
          <p>${escapeHTML(task.description || "No description")}</p>
          <small>Created: ${escapeHTML(formatDate(task.createdDate))}</small>
        </div>
        <span class="badge ${task.status === "completed" ? "completed" : ""}">
          ${task.status}
        </span>
      </div>
      <div class="task-actions">
        <button type="button" data-action="toggle" data-id="${task.id}">
          ${task.status === "completed" ? "Mark Pending" : "Mark Complete"}
        </button>
        <button type="button" class="delete" data-action="delete" data-id="${task.id}">
          Delete
        </button>
      </div>
    `;

    taskList.appendChild(item);
  });

  updateStats();
}

function updateStats() {
  const completed = tasks.filter(t => t.status === "completed").length;
  document.getElementById("totalCount").textContent = tasks.length;
  document.getElementById("pendingCount").textContent = tasks.length - completed;
  document.getElementById("completedCount").textContent = completed;
}

function showMessage(text) {
  message.textContent = text;
  message.classList.remove("hidden");
}

function hideMessage() {
  message.classList.add("hidden");
}

taskForm.addEventListener("submit", event => {
  event.preventDefault();
  hideMessage();

  const title = titleInput.value.trim();
  const description = descriptionInput.value.trim();

  if (!title) {
    showMessage("Please enter a task title.");
    return;
  }

  addTask(title, description);
  taskForm.reset();
  titleInput.focus();
});

searchInput.addEventListener("input", event => {
  searchTerm = event.target.value.trim();
  renderTasks();
});

clearSearch.addEventListener("click", () => {
  searchInput.value = "";
  searchTerm = "";
  renderTasks();
});

taskList.addEventListener("click", event => {
  const button = event.target.closest("button");
  if (!button) return;

  const id = button.dataset.id;
  const action = button.dataset.action;
  const task = tasks.find(t => t.id === id);

  if (!task) return;

  if (action === "toggle") {
    task.status = task.status === "pending" ? "completed" : "pending";
  }

  if (action === "delete") {
    if (!confirm("Delete this task?")) return;
    tasks = tasks.filter(t => t.id !== id);
  }

  saveTasks();
  renderTasks();
});

summaryBtn.addEventListener("click", generateAISummary);

async function generateAISummary() {
  hideMessage();

  const pendingTasks = tasks.filter(task => task.status === "pending");

  if (pendingTasks.length === 0) {
    summaryBox.classList.remove("hidden");
    summaryText.textContent =
      "You have no pending tasks. Great job! 🎉";
    return;
  }

  summaryBox.classList.remove("hidden");
  summaryText.textContent = "Generating AI summary...";
  summaryBtn.disabled = true;

  try {
    const response = await fetch(AI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        tasks: pendingTasks.map(task => ({
          title: task.title,
          description: task.description
        }))
      })
    });

    let data = {};
    try {
      data = await response.json();
    } catch (_) {
      data = {};
    }

    if (!response.ok) {
      throw new Error(data.error || "AI service failed.");
    }

    if (!data.summary) {
      throw new Error("Invalid AI response.");
    }

    summaryText.textContent = data.summary;
  } catch (error) {
    console.error(error);
    summaryText.textContent =
      "Sorry, the AI service is currently unavailable. Please try again later.";
  } finally {
    summaryBtn.disabled = false;
  }
}

loadTasks();
renderTasks();
