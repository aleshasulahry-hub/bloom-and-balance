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
  cycleLength: 28,
  streak: 0,
  lastCompletionDate: ""
};

function saveData() {
  localStorage.setItem("bloomBalanceData", JSON.stringify(appData));
}

function loadData() {
  const saved = localStorage.getItem("bloomBalanceData");

  if (saved) {
    appData = JSON.parse(saved);
  }

  if (!appData.streak) appData.streak = 0;
  if (!appData.lastCompletionDate) appData.lastCompletionDate = "";
  if (!appData.moods) appData.moods = [];

  appData.moods = appData.moods.map(item => {
    if (typeof item === "number") {
      return {
        value: item,
        date: new Date().toLocaleDateString()
      };
    }

    return item;
  });
}

function todayString() {
  return new Date().toLocaleDateString();
}

function updateStreak() {
  const today = todayString();

  if (appData.lastCompletionDate !== today) {
    appData.streak++;
    appData.lastCompletionDate = today;
    saveData();
  }
}

function showSection(sectionId) {
  const pages = document.querySelectorAll(".page");
  pages.forEach(page => page.classList.remove("active"));

  const selectedPage = document.getElementById(sectionId);
  if (selectedPage) {
    selectedPage.classList.add("active");
  }

  const navButtons = document.querySelectorAll(".nav-btn");
  navButtons.forEach(button => button.classList.remove("active-tab"));

  const activeButton = document.querySelector(`.nav-btn[data-section="${sectionId}"]`);
  if (activeButton) {
    activeButton.classList.add("active-tab");
  }

  updateProgress();
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

  if (document.getElementById("breathingText")) {
    document.getElementById("breathingText").textContent = steps[index];
  }

  if (document.getElementById("breathingText2")) {
    document.getElementById("breathingText2").textContent = steps[index];
  }

  if (circle1) circle1.classList.add("animate");
  if (circle2) circle2.classList.add("animate");

  breathingInterval = setInterval(() => {
    index = (index + 1) % steps.length;

    if (document.getElementById("breathingText")) {
      document.getElementById("breathingText").textContent = steps[index];
    }

    if (document.getElementById("breathingText2")) {
      document.getElementById("breathingText2").textContent = steps[index];
    }
  }, 4000);
}

function stopBreathing() {
  clearInterval(breathingInterval);

  const circle1 = document.getElementById("breathingCircle");
  const circle2 = document.getElementById("breathingCircle2");

  if (circle1) circle1.classList.remove("animate");
  if (circle2) circle2.classList.remove("animate");

  if (document.getElementById("breathingText")) {
    document.getElementById("breathingText").textContent = "Breathing stopped.";
  }

  if (document.getElementById("breathingText2")) {
    document.getElementById("breathingText2").textContent = "Breathing stopped.";
  }
}

function addGoal() {
  const input = document.getElementById("goalInput");
  const text = input.value.trim();

  if (text !== "") {
    appData.goals.push({ text: text, done: false });
    input.value = "";
    saveData();
    renderAll();
  }
}

function addHabit() {
  const input = document.getElementById("habitInput");
  const text = input.value.trim();

  if (text !== "") {
    appData.habits.push({ text: text, done: false });
    input.value = "";
    saveData();
    renderAll();
  }
}

function addSelfCare() {
  const input = document.getElementById("selfCareInput");
  const text = input.value.trim();

  if (text !== "") {
    appData.selfCare.push({ text: text, done: false });
    input.value = "";
    saveData();
    renderAll();
  }
}

function createListItem(item, index, type) {
  const li = document.createElement("li");
  li.className = "list-row";

  const textSpan = document.createElement("span");
  textSpan.textContent = item.text;

  if (item.done) {
    textSpan.classList.add("done");
  }

  const actions = document.createElement("div");
  actions.className = "small-actions";

  const doneBtn = document.createElement("button");
  doneBtn.textContent = item.done ? "Undo" : "Done";
  doneBtn.className = "icon-btn";

  doneBtn.onclick = function () {
    appData[type][index].done = !appData[type][index].done;

    if (appData[type][index].done) {
      updateStreak();
    }

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
    renderAll();
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
  renderAll();
}

function saveMood() {
  const moodValue = Number(document.getElementById("moodSelect").value);

  appData.moods.push({
    value: moodValue,
    date: new Date().toLocaleString()
  });

  document.getElementById("savedMoodText").textContent =
    "Mood saved: " + moodValue + "/5. Your mood summary has been updated.";

  saveData();
  updateProgress();
}

function getMoodValues() {
  return appData.moods.map(item => {
    if (typeof item === "number") return item;
    return Number(item.value);
  });
}

function addGrocery() {
  const input = document.getElementById("groceryInput");
  const text = input.value.trim();

  if (text !== "") {
    appData.grocery.push(text);
    input.value = "";
    saveData();
    renderAll();
  }
}

function renderGrocery() {
  const list = document.getElementById("groceryList");
  list.innerHTML = "";

  appData.grocery.forEach((item, index) => {
    const li = document.createElement("li");
    li.className = "list-row";

    const span = document.createElement("span");
    span.textContent = item;

    const btn = document.createElement("button");
    btn.textContent = "Delete";
    btn.className = "icon-btn";

    btn.onclick = function () {
      appData.grocery.splice(index, 1);
      saveData();
      renderAll();
    };

    li.appendChild(span);
    li.appendChild(btn);
    list.appendChild(li);
  });
}

function addRoutine() {
  const taskInput = document.getElementById("routineTask");
  const timeInput = document.getElementById("routineTime");

  const task = taskInput.value.trim();
  const time = timeInput.value.trim();

  if (task !== "" && time !== "") {
    appData.routine.push({ task: task, time: time });
    taskInput.value = "";
    timeInput.value = "";
    saveData();
    renderAll();
  }
}

function renderRoutine() {
  const list = document.getElementById("routineList");
  list.innerHTML = "";

  appData.routine.forEach((item, index) => {
    const li = document.createElement("li");
    li.className = "list-row";

    const span = document.createElement("span");
    span.textContent = item.task + " - " + item.time;

    const btn = document.createElement("button");
    btn.textContent = "Delete";
    btn.className = "icon-btn";

    btn.onclick = function () {
      appData.routine.splice(index, 1);
      saveData();
      renderAll();
    };

    li.appendChild(span);
    li.appendChild(btn);
    list.appendChild(li);
  });
}

function saveCycleData() {
  const startDate = document.getElementById("cycleStartDate").value;
  const cycleLength = Number(document.getElementById("cycleLength").value) || 28;

  appData.cycleStartDate = startDate;
  appData.cycleLength = cycleLength;

  saveData();
  updateCycleInfo();
}

function updateCycleInfo() {
  const dayDisplay = document.getElementById("cycleDayDisplay");
  const phaseName = document.getElementById("phaseName");
  const phaseDescription = document.getElementById("phaseDescription");
  const dashboardPhase = document.getElementById("dashboardPhase");
  const dashboardPhaseTip = document.getElementById("dashboardPhaseTip");
  const dashboardCycleDay = document.getElementById("dashboardCycleDay");

  if (!appData.cycleStartDate) {
    dayDisplay.textContent = "Not set";
    phaseName.textContent = "Not set";
    phaseDescription.textContent = "Add your last period start date to see your phase.";
    dashboardPhase.textContent = "Not set";
    dashboardPhaseTip.textContent = "Add your cycle info for personalized support.";
    dashboardCycleDay.textContent = "Not set";
    return;
  }

  const start = new Date(appData.cycleStartDate);
  const today = new Date();
  const diffTime = today.getTime() - start.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const cycleDay = ((diffDays % appData.cycleLength) + appData.cycleLength) % appData.cycleLength + 1;

  let phase = "";
  let description = "";

  if (cycleDay >= 1 && cycleDay <= 5) {
    phase = "Menstrual";
    description = "Rest, hydrate, choose warm foods, and do gentle movement.";
  } else if (cycleDay >= 6 && cycleDay <= 13) {
    phase = "Follicular";
    description = "Energy may rise. Great time for fresh habits, planning, and workouts.";
  } else if (cycleDay >= 14 && cycleDay <= 17) {
    phase = "Ovulation";
    description = "You may feel more energetic and social. Good time for higher-energy movement.";
  } else {
    phase = "Luteal";
    description = "Slow down a little, support cravings with nourishing meals, and prioritize calm.";
  }

  dayDisplay.textContent = cycleDay;
  phaseName.textContent = phase;
  phaseDescription.textContent = description;
  dashboardPhase.textContent = phase;
  dashboardPhaseTip.textContent = description;
  dashboardCycleDay.textContent = cycleDay;
}

function renderMoodLists() {
  const recentMoodList = document.getElementById("recentMoodList");
  const progressMoodList = document.getElementById("progressMoodList");

  if (recentMoodList) recentMoodList.innerHTML = "";
  if (progressMoodList) progressMoodList.innerHTML = "";

  if (appData.moods.length === 0) {
    if (recentMoodList) recentMoodList.innerHTML = "<p>No mood entries yet.</p>";
    if (progressMoodList) progressMoodList.innerHTML = "<p>No mood entries yet.</p>";
    return;
  }

  appData.moods.slice(-5).reverse().forEach(item => {
    const moodValue = typeof item === "number" ? item : item.value;
    const moodDate = typeof item === "number" ? "Previous entry" : item.date;

    const div = document.createElement("div");
    div.className = "mood-item";
    div.innerHTML = `
      <strong>${moodDate}</strong>
      <p>Mood: ${moodValue}/5</p>
    `;

    if (recentMoodList) recentMoodList.appendChild(div.cloneNode(true));
    if (progressMoodList) progressMoodList.appendChild(div);
  });
}

function updateProgress() {
  const goalCount = appData.goals.length;
  const habitCount = appData.habits.length;
  const journalCount = appData.journals.length;
  const groceryCount = appData.grocery.length;
  const routineCount = appData.routine.length;
  const selfCareCount = appData.selfCare.length;

  const goalDone = appData.goals.filter(item => item.done).length;
  const habitDone = appData.habits.filter(item => item.done).length;

  const moodValues = getMoodValues();
  const moodAverage = moodValues.length
    ? (moodValues.reduce((a, b) => a + b, 0) / moodValues.length).toFixed(1)
    : 0;

  const highestMood = moodValues.length ? Math.max(...moodValues) : 0;
  const recentMood = moodValues.length ? moodValues[moodValues.length - 1] + "/5" : "No mood saved yet";

  document.getElementById("goalCount").textContent = goalCount;
  document.getElementById("habitCount").textContent = habitCount;
  document.getElementById("journalCount").textContent = journalCount;
  document.getElementById("groceryCount").textContent = groceryCount;
  document.getElementById("routineCount").textContent = routineCount;
  document.getElementById("selfCareCount").textContent = selfCareCount;

  document.getElementById("moodAverage").textContent = moodAverage;
  document.getElementById("dashboardMoodAverage").textContent = moodAverage;
  document.getElementById("journalMoodAverage").textContent = moodAverage;
  document.getElementById("highestMood").textContent = highestMood;
  document.getElementById("recentMood").textContent = recentMood;
  document.getElementById("dashboardMoodEntries").textContent = moodValues.length;
  document.getElementById("moodEntryCount").textContent = moodValues.length;

  document.getElementById("dashboardStreak").textContent = appData.streak;
  document.getElementById("progressStreak").textContent = appData.streak;

  const goalPercent = goalCount ? (goalDone / goalCount) * 100 : 0;
  const habitPercent = habitCount ? (habitDone / habitCount) * 100 : 0;
  const moodPercent = (Number(moodAverage) / 5) * 100;

  document.getElementById("goalChartBar").style.width = goalPercent + "%";
  document.getElementById("habitChartBar").style.width = habitPercent + "%";
  document.getElementById("moodChartBar").style.width = moodPercent + "%";

  let moodMessage = "Log your mood to start seeing patterns.";
  let trendMessage = "No mood trend yet.";

  if (moodValues.length >= 2) {
    const previous = moodValues[moodValues.length - 2];
    const current = moodValues[moodValues.length - 1];

    if (current > previous) {
      moodMessage = "Your most recent mood is higher than your last entry.";
      trendMessage = "Mood trend: improving compared to your last entry.";
    } else if (current < previous) {
      moodMessage = "Your most recent mood is lower than your last entry. A gentle reset may help.";
      trendMessage = "Mood trend: lower than your last entry.";
    } else {
      moodMessage = "Your most recent mood stayed the same as your last entry.";
      trendMessage = "Mood trend: steady.";
    }
  } else if (moodValues.length === 1) {
    moodMessage = "You have started tracking your mood. Add more entries to see a trend.";
    trendMessage = "One mood entry saved so far.";
  }

  document.getElementById("dashboardMoodMessage").textContent = moodMessage;
  document.getElementById("moodTrendText").textContent = trendMessage;

  renderMoodLists();
  updateWaterUI();
}

function loginUser() {
  const username = document.getElementById("usernameInput").value.trim();

  if (username !== "") {
    appData.username = username;
    saveData();
    document.getElementById("loginMessage").textContent = "Logged in as " + username;
  }
}

function logoutUser() {
  appData.username = "";
  saveData();
  document.getElementById("loginMessage").textContent = "Not logged in";
  document.getElementById("usernameInput").value = "";
}

function changeTheme() {
  const theme = document.getElementById("themeSelect").value;
  appData.theme = theme;
  applyTheme();
  saveData();
}

function applyTheme() {
  document.body.classList.remove("lavender", "sage");

  if (appData.theme === "lavender") {
    document.body.classList.add("lavender");
  } else if (appData.theme === "sage") {
    document.body.classList.add("sage");
  }

  document.getElementById("themeSelect").value = appData.theme;
}

function renderAll() {
  applyTheme();
  renderGoals();
  renderHabits();
  renderSelfCare();
  renderJournal();
  renderGrocery();
  renderRoutine();
  updateWaterUI();
  updateCycleInfo();
  updateProgress();

  if (appData.username) {
    document.getElementById("loginMessage").textContent = "Logged in as " + appData.username;
    document.getElementById("usernameInput").value = appData.username;
  }

  if (appData.cycleStartDate) {
    document.getElementById("cycleStartDate").value = appData.cycleStartDate;
  }

  document.getElementById("cycleLength").value = appData.cycleLength || 28;
}

window.onload = function () {
  loadData();
  renderAll();
  showSection("dashboard");
  newReminder();
  newQuote();
};