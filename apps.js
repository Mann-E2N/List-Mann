const input = document.getElementById("taskInput");
const list = document.getElementById("task-list");
const searchInput = document.getElementById("searchInput");
const addBtn = document.getElementById("addBtn");

let editMode = null;

function formatDate(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  list.innerHTML = "";
  tasks.forEach(task => addTaskToList(task));
}

function addTaskToList(task) {
  const li = document.createElement("li");

  const span = document.createElement("span");
  span.textContent = task.text;

  const info = document.createElement("div");
  info.classList.add("task-info");
  info.textContent = task.updatedAt
    ? `Diedit: ${formatDate(task.updatedAt)}`
    : `Ditambahkan: ${formatDate(task.createdAt)}`;

  const editBtn = document.createElement("button");
  editBtn.textContent = "Edit";
  editBtn.classList.add("edit-btn");

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Hapus";
  deleteBtn.classList.add("delete-btn");

  const taskButtons = document.createElement("div");
  taskButtons.classList.add("task-buttons");
  taskButtons.appendChild(editBtn);
  taskButtons.appendChild(deleteBtn);

  
// Tombol hapus
deleteBtn.addEventListener("click", function () {
  const yakin = confirm("Apakah Anda yakin ingin menghapus tugas ini?");

  if (!yakin) return; // batal hapus

  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks = tasks.filter(t => t.createdAt !== task.createdAt);
  localStorage.setItem("tasks", JSON.stringify(tasks));

  li.style.animation = "fadeOut 0.3s forwards";
  setTimeout(() => li.remove(), 300);
});

  // Tombol edit
  editBtn.addEventListener("click", function () {
    input.value = task.text;
    input.focus();
    editMode = task;
  });

  li.appendChild(span);
  li.appendChild(info);
  li.appendChild(taskButtons);
  list.appendChild(li);
}

// Tombol tambah ditekan
addBtn.addEventListener("click", function () {
  const text = input.value.trim();
  if (text === "") return;

  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  if (editMode) {
    const index = tasks.findIndex(t => t.createdAt === editMode.createdAt);
    if (index !== -1) {
      tasks[index].text = text;
      tasks[index].updatedAt = Date.now();
    }
    editMode = null;
  } else {
    const task = {
      text,
      createdAt: Date.now(),
      updatedAt: null
    };
    tasks.push(task);
  }

  localStorage.setItem("tasks", JSON.stringify(tasks));
  input.value = "";
  loadTasks();
});

// Pencarian tugas
searchInput.addEventListener("input", function () {
  const filter = searchInput.value.toLowerCase();
  const items = list.getElementsByTagName("li");
  Array.from(items).forEach(li => {
    const text = li.querySelector("span").textContent.toLowerCase();
    li.style.display = text.includes(filter) ? "flex" : "none";
  });
});

// Jalankan awal
loadTasks();
