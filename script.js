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