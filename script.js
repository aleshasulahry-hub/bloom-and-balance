const quotes = [
  "You are growing beautifully, even on slow days.",
  "Small steps still count.",
  "Rest is productive too.",
  "You deserve softness and strength.",
  "Be kind to yourself today.",
  "Softness and consistency can exist together.",
  "Progress matters more than perfection."
];
const reminders = [
  "Take care of yourself with kindness today.",
  "Drink water before your next task.",
  "Take a deep breath and unclench your shoulders.",
  "You do not need to earn rest.",
  "Feed yourself kindly today.",
  "Pause and ask what your body needs right now."
];

let breathingInterval = null;

let appData = {
  username: "",
  theme: "pink",
  water: 0,
  goals: [],
  habits: [],
  selfCare: [
    { text: "Stretch for 5 minutes", done: false },
    { text: "Step outside for fresh air", done: false }
  ],
  journals: [],
  moods: [],
  grocery: ["Eggs", "Greek yogurt", "Berries"],
  routine: [
    { task: "School prep", time: "7:00 AM" },
    { task: "Homework check-in", time: "6:30 PM" }
  ],
  cycleStartDate: "",
  cycleLength: 28
};

function saveData() {
  localStorage.setItem("bloomBalanceData", JSON.stringify(appData));
}

function loadData() {
  const saved = localStorage.getItem("bloomBalanceData");
  if (saved) {
    appData = JSON.parse(saved);
  }
}

function showSection(sectionId) {
  const pages = document.querySelectorAll(".page");
  pages.forEach(page => page.classList.remove("active"));
  document.getElementById(sectionId).classList.add("active");
}

function newQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  document.getElementById("quoteText").textContent = quotes[randomIndex];
}

function newReminder() {
  const randomIndex = Math.floor(Math.random() * reminders.length);
  const text = reminders[randomIndex];
  document.getElementById("reminderText").textContent = text;
  document.getElementById("todayReminder").textContent = text;
}

function addWater() {
  if (appData.water < 8) {
    appData.water++;
    saveData();
    renderAll();
  }
}

function resetWater() {
  appData.water = 0;
  saveData();
  renderAll();
}

function updateWaterUI() {
  document.getElementById("waterCount").textContent = appData.water;
  document.getElementById("waterProgressText").textContent = appData.water;
  const percent = (appData.water / 8) * 100;
  document.getElementById("waterBar").style.width = percent + "%";
  document.getElementById("waterProgressBar").style.width = percent + "%";
}

function startBreathing() {
  const steps = [
    "Inhale for 4 seconds",
    "Hold for 4 seconds",
    "Exhale for 6 seconds",
    "Pause for 2 seconds"
  ];

  const circle1 = document.getElementById("breathingCircle");
  const circle2 = document.getElementById("breathingCircle2");
  let index = 0;

  clearInterval(breathingInterval);
  document.getElementById("breathingText").textContent = steps[index];
  document.getElementById("breathingText2").textContent = steps[index];

  if (circle1) circle1.classList.add("animate");
  if (circle2) circle2.classList.add("animate");

  breathingInterval = setInterval(() => {
    index = (index + 1) % steps.length;
    document.getElementById("breathingText").textContent = steps[index];
    document.getElementById("breathingText2").textContent = steps[index];
  }, 4000);
}

function stopBreathing() {
  clearInterval(breathingInterval);
  const circle1 = document.getElementById("breathingCircle");
  const circle2 = document.getElementById("breathingCircle2");
  if (circle1) circle1.classList.remove("animate");
  if (circle2) circle2.classList.remove("animate");
  document.getElementById("breathingText").textContent = "Breathing stopped.";
  document.getElementById("breathingText2").textContent = "Breathing stopped.";
}

function addGoal() {
  const input = document.getElementById("goalInput");
  const text = input.value.trim();

  if (text !== "") {
    appData.goals.push({ text: text, done: false });
    input.value = "";
    saveData();
    renderGoals();
    updateProgress();
  }
}

function addHabit() {
  const input = document.getElementById("habitInput");
  const text = input.value.trim();

  if (text !== "") {
    appData.habits.push({ text: text, done: false });
    input.value = "";
    saveData();
    renderHabits();
    updateProgress();
  }
}

function addSelfCare() {
  const input = document.getElementById("selfCareInput");
  const text = input.value.trim();

  if (text !== "") {
    appData.selfCare.push({ text: text, done: false });
    input.value = "";
    saveData();
    renderSelfCare();
    updateProgress();
  }
}

function createListItem(item, index, type) {
  const li = document.createElement("li");
  li.className = "list-row";

  const textSpan = document.createElement("span");
  textSpan.textContent = item.text;
  if (item.done) textSpan.classList.add("done");

  const actions = document.createElement("div");
  actions.className = "small-actions";

  const doneBtn = document.createElement("button");
  doneBtn.textContent = item.done ? "Undo" : "Done";
  doneBtn.className = "icon-btn";
  doneBtn.onclick = function () {
    appData[type][index].done = !appData[type][index].done;
    saveData();
    renderAll();
  };

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Delete";
  deleteBtn.className = "icon-btn";
  deleteBtn.onclick = function () {
    appData[type].splice(index, 1);
    saveData();
    renderAll();
  };

  actions.appendChild(doneBtn);
  actions.appendChild(deleteBtn);
  li.appendChild(textSpan);
  li.appendChild(actions);

  return li;
}

function renderGoals() {
  const list = document.getElementById("goalList");
  list.innerHTML = "";
  appData.goals.forEach((goal, index) => {
    list.appendChild(createListItem(goal, index, "goals"));
  });
}

function renderHabits() {
  const list = document.getElementById("habitList");
  list.innerHTML = "";
  appData.habits.forEach((habit, index) => {
    list.appendChild(createListItem(habit, index, "habits"));
  });
}

function renderSelfCare() {
  const list = document.getElementById("selfCareList");
  list.innerHTML = "";
  appData.selfCare.forEach((item, index) => {
    list.appendChild(createListItem(item, index, "selfCare"));
  });
}

function saveJournal() {
  const titleInput = document.getElementById("journalTitle");
  const entryInput = document.getElementById("journalEntry");

  const title = titleInput.value.trim() || "Untitled Reflection";
  const entry = entryInput.value.trim();

  if (entry !== "") {
    appData.journals.unshift({
      title: title,
      body: entry,
      date: new Date().toLocaleString()
    });

    titleInput.value = "";
    entryInput.value = "";
    saveData();
    renderJournal();
    updateProgress();
  }
}

function renderJournal() {
  const journalList = document.getElementById("journalList");
  journalList.innerHTML = "";

  if (appData.journals.length === 0) {
    journalList.innerHTML = "<p>No journal entries yet.</p>";
    return;
  }

  appData.journals.forEach((entry, index) => {
    const item = document.createElement("div");
    item.className = "journal-item";

    item.innerHTML = `
      <h3>${entry.title}</h3>
      <p><strong>${entry.date}</strong></p>
      <p>${entry.body}</p>
      <button onclick="deleteJournal(${index})">Delete</button>
    `;

    journalList.appendChild(item);
  });
}

function deleteJournal(index) {
  appData.journals.splice(index, 1);
  saveData();
  renderJournal();
  updateProgress();
}