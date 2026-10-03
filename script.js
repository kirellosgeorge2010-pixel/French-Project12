/**
 * script.js
 * Moteur du jeu « Qui Veut Gagner des Millions ? »
 * JavaScript pur, sans dépendance externe.
 * Nouveautés : chronomètre 20 s, traduction FR/EN/AR, écran des gains après
 * chaque réponse, effets sonores (Web Audio API) et animations.
 */

// =============================================================================
// 1. CONFIGURATION & DONNÉES DE JEU
// =============================================================================

// Échelle des gains (15 niveaux)
const PRIZE_STEPS = [
  { level: 1, amount: "100 €", milestone: false },
  { level: 2, amount: "200 €", milestone: false },
  { level: 3, amount: "500 €", milestone: false },
  { level: 4, amount: "1 000 €", milestone: false },
  { level: 5, amount: "2 000 €", milestone: true }, // 1er Palier garanti
  { level: 6, amount: "5 000 €", milestone: false },
  { level: 7, amount: "10 000 €", milestone: false },
  { level: 8, amount: "20 000 €", milestone: false },
  { level: 9, amount: "50 000 €", milestone: false },
  { level: 10, amount: "100 000 €", milestone: true }, // 2e Palier garanti
  { level: 11, amount: "200 000 €", milestone: false },
  { level: 12, amount: "300 000 €", milestone: false },
  { level: 13, amount: "500 000 €", milestone: false },
  { level: 14, amount: "750 000 €", milestone: false },
  { level: 15, amount: "1 000 000 €", milestone: true } // Palier ultime
];

// Lettres associées aux 4 choix
const ANSWER_LETTERS = ["A", "B", "C", "D"];

// Chronomètre : 20 secondes par question
const TIME_LIMIT_MS = 20000;
const TIMER_CIRCUMFERENCE = 2 * Math.PI * 44; // rayon du cercle SVG
// Suspense entre « Valider » et la révélation de la réponse
const REVEAL_DELAY_MS = 1800;

// =============================================================================
// 2. TRADUCTIONS (interface uniquement : les questions restent en français)
// =============================================================================
const I18N = {
  fr: {
    langLabel: "Langue",
    soundTitle: "Son",
    mainTitle: "QUI VEUT GAGNER DES MILLIONS ?",
    startSubtitle: "15 questions vers le million d'euros. Êtes-vous prêt ?",
    btnStart: "COMMENCER",
    question: "Question",
    forPrize: "Pour",
    lifeline5050Title: "50:50 (Supprime deux mauvaises réponses)",
    lifelineAudienceTitle: "Question au public",
    lifelineSwapTitle: "Changer de question",
    label5050: "50:50",
    labelAudience: "Public",
    labelSwap: "Changer",
    validate: "Valider",
    correct: "Bonne réponse !",
    wrong: "Mauvaise réponse !",
    timeUp: "Temps écoulé !",
    seeWins: "Voir mes gains →",
    seeFinal: "Voir le résultat final →",
    youWon: "Vous avez gagné",
    milestone: "Palier garanti !",
    ladderTitle: "ÉCHELLE DES GAINS",
    nextQuestion: "Question suivante →",
    finalTotal: "Voir mon gain final →",
    audienceTitle: "Vote du Public",
    audienceDesc: "Voici la répartition des votes des spectateurs en plateau :",
    close: "Fermer",
    endWinTitle: "Félicitations !",
    endWinStatus: "Vous avez franchi les 15 paliers et décroché le million !",
    endLoseTitle: "Dommage !",
    endLoseStatus: "Votre aventure s'arrête ici.",
    finalPrize: "Gain final remporté",
    correctAnswers: "Bonnes réponses",
    replay: "Rejouer"
  },
  en: {
    langLabel: "Language",
    soundTitle: "Sound",
    mainTitle: "WHO WANTS TO WIN MILLIONS?",
    startSubtitle: "15 questions to the million euros. Are you ready?",
    btnStart: "START",
    question: "Question",
    forPrize: "For",
    lifeline5050Title: "50:50 (Removes two wrong answers)",
    lifelineAudienceTitle: "Ask the audience",
    lifelineSwapTitle: "Swap the question",
    label5050: "50:50",
    labelAudience: "Audience",
    labelSwap: "Swap",
    validate: "Confirm",
    correct: "Correct answer!",
    wrong: "Wrong answer!",
    timeUp: "Time's up!",
    seeWins: "See my winnings →",
    seeFinal: "See final result →",
    youWon: "You have won",
    milestone: "Safe milestone secured!",
    ladderTitle: "PRIZE LADDER",
    nextQuestion: "Next question →",
    finalTotal: "See my final prize →",
    audienceTitle: "Audience Vote",
    audienceDesc: "Here is how the studio audience voted:",
    close: "Close",
    endWinTitle: "Congratulations!",
    endWinStatus: "You cleared all 15 levels and won the million!",
    endLoseTitle: "Too bad!",
    endLoseStatus: "Your adventure ends here.",
    finalPrize: "Final prize won",
    correctAnswers: "Correct answers",
    replay: "Play again"
  },
  ar: {
    langLabel: "اللغة",
    soundTitle: "الصوت",
    mainTitle: "من سيربح الملايين؟",
    startSubtitle: "15 سؤالاً نحو مليون يورو. هل أنت مستعد؟",
    btnStart: "ابدأ",
    question: "السؤال",
    forPrize: "من أجل",
    lifeline5050Title: "50:50 (يحذف إجابتين خاطئتين)",
    lifelineAudienceTitle: "اسأل الجمهور",
    lifelineSwapTitle: "تغيير السؤال",
    label5050: "50:50",
    labelAudience: "الجمهور",
    labelSwap: "تغيير",
    validate: "تأكيد",
    correct: "إجابة صحيحة!",
    wrong: "إجابة خاطئة!",
    timeUp: "انتهى الوقت!",
    seeWins: "شاهد أرباحي ←",
    seeFinal: "شاهد النتيجة النهائية ←",
    youWon: "لقد ربحت",
    milestone: "مرحلة مضمونة!",
    ladderTitle: "سلّم الجوائز",
    nextQuestion: "السؤال التالي ←",
    finalTotal: "شاهد جائزتي النهائية ←",
    audienceTitle: "تصويت الجمهور",
    audienceDesc: "هذا هو توزيع أصوات الجمهور في الاستوديو:",
    close: "إغلاق",
    endWinTitle: "مبروك!",
    endWinStatus: "لقد اجتزت المستويات الـ15 وربحت المليون!",
    endLoseTitle: "للأسف!",
    endLoseStatus: "تنتهي مغامرتك هنا.",
    finalPrize: "الجائزة النهائية",
    correctAnswers: "الإجابات الصحيحة",
    replay: "العب مرة أخرى"
  }
};

let currentLang = "fr";

function t(key) {
  const dict = I18N[currentLang] || I18N.fr;
  return dict[key] || I18N.fr[key] || key;
}

/**
 * Applique la langue choisie à toute l'interface (textes, titres, sens RTL).
 */
function applyLanguage(lang) {
  if (!I18N[lang]) lang = "fr";
  currentLang = lang;

  document.documentElement.lang = lang;
  document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";

  document.querySelectorAll("[data-i18n]").forEach(el => {
    el.textContent = t(el.dataset.i18n);
  });
  document.querySelectorAll("[data-i18n-title]").forEach(el => {
    el.title = t(el.dataset.i18nTitle);
  });
  document.querySelectorAll(".lang-btn").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.lang === lang);
  });

  updateProgressText();

  try { localStorage.setItem("quizLang", lang); } catch (e) { /* ignoré */ }
}

// =============================================================================
// 3. EFFETS SONORES (Web Audio API, aucun fichier externe)
// =============================================================================
const Sound = (() => {
  let ctx = null;
  let master = null;
  let muted = false;
  let tensionId = null;
  let tensionStep = 0;

  /** À appeler lors d'un clic utilisateur (exigé par les navigateurs). */
  function unlock() {
    if (!ctx) {
      try {
        const AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return;
        ctx = new AC();
        master = ctx.createGain();
        master.gain.value = muted ? 0 : 0.7;
        master.connect(ctx.destination);
      } catch (e) {
        ctx = null;
        return;
      }
    }
    if (ctx.state === "suspended") ctx.resume();
  }

  function tone(freq, start, dur, opts = {}) {
    if (!ctx) return;
    const { type = "sine", vol = 0.25, attack = 0.01, release = 0.12, slideTo = null } = opts;
    const t0 = ctx.currentTime + start;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t0);
    if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, t0 + dur);
    gain.gain.setValueAtTime(0.0001, t0);
    gain.gain.exponentialRampToValueAtTime(vol, t0 + attack);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur + release);
    osc.connect(gain);
    gain.connect(master);
    osc.start(t0);
    osc.stop(t0 + dur + release + 0.05);
  }

  function noise(start, dur, opts = {}) {
    if (!ctx) return;
    const { vol = 0.15, from = 400, to = 4000 } = opts;
    const t0 = ctx.currentTime + start;
    const length = Math.floor(ctx.sampleRate * dur);
    const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < length; i++) data[i] = Math.random() * 2 - 1;

    const src = ctx.createBufferSource();
    src.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.Q.value = 1.2;
    filter.frequency.setValueAtTime(from, t0);
    filter.frequency.exponentialRampToValueAtTime(to, t0 + dur);
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, t0);
    gain.gain.exponentialRampToValueAtTime(vol, t0 + dur * 0.4);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);

    src.connect(filter);
    filter.connect(gain);
    gain.connect(master);
    src.start(t0);
  }

  // --- Musique de tension (boucle sourde pendant la réflexion) ---
  function startTension() {
    stopTension();
    if (!ctx) return;
    tensionStep = 0;
    const bass = [55, 55, 65.41, 58.27];
    const beat = () => {
      const f = bass[tensionStep % bass.length];
      tone(f, 0, 0.38, { type: "sawtooth", vol: 0.08, attack: 0.02, release: 0.15 });
      tone(f * 4, 0, 0.14, { type: "triangle", vol: 0.03 });
      if (tensionStep % 4 === 3) tone(f * 8, 0.26, 0.1, { type: "sine", vol: 0.025 });
      tensionStep++;
    };
    beat();
    tensionId = setInterval(beat, 520);
  }

  function stopTension() {
    if (tensionId) {
      clearInterval(tensionId);
      tensionId = null;
    }
  }

  // --- Effets ---
  function intro() {
    if (!ctx) return;
    [261.63, 329.63, 392, 523.25].forEach((f, i) => {
      tone(f, i * 0.14, 0.3, { type: "triangle", vol: 0.22 });
      tone(f / 2, i * 0.14, 0.3, { type: "sawtooth", vol: 0.06 });
    });
    [523.25, 659.25, 783.99].forEach(f => tone(f, 0.6, 0.9, { type: "triangle", vol: 0.16, release: 0.4 }));
  }

  function questionIn() {
    if (!ctx) return;
    noise(0, 0.6, { vol: 0.12, from: 300, to: 3200 });
    tone(110, 0.5, 0.4, { type: "sine", vol: 0.3, slideTo: 55 });
  }

  function select() {
    tone(660, 0, 0.06, { type: "square", vol: 0.07 });
    tone(990, 0.04, 0.06, { type: "square", vol: 0.05 });
  }

  function lock() {
    if (!ctx) return;
    tone(98, 0, 0.5, { type: "sawtooth", vol: 0.22, slideTo: 49 });
    tone(55, 0, 0.8, { type: "sine", vol: 0.4 });
    noise(0, 0.45, { vol: 0.08, from: 200, to: 1400 });
  }

  function correct() {
    if (!ctx) return;
    [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => tone(f, i * 0.09, 0.25, { type: "triangle", vol: 0.24 }));
    [523.25, 659.25, 783.99, 1046.5].forEach(f => tone(f, 0.38, 0.8, { type: "sine", vol: 0.12, release: 0.4 }));
  }

  function wrong() {
    if (!ctx) return;
    tone(220, 0, 0.6, { type: "sawtooth", vol: 0.28, slideTo: 70 });
    tone(110, 0, 0.7, { type: "square", vol: 0.14, slideTo: 45 });
    noise(0, 0.5, { vol: 0.1, from: 1500, to: 200 });
  }

  function tick() {
    tone(1200, 0, 0.04, { type: "sine", vol: 0.1, attack: 0.002, release: 0.03 });
  }

  function lifeline() {
    if (!ctx) return;
    [880, 1108.7, 1318.5, 1760].forEach((f, i) => tone(f, i * 0.07, 0.2, { type: "sine", vol: 0.16 }));
  }

  function prize() {
    if (!ctx) return;
    [392, 523.25, 659.25, 783.99].forEach((f, i) => tone(f, i * 0.1, 0.3, { type: "triangle", vol: 0.2 }));
    [392, 523.25, 659.25].forEach(f => tone(f, 0.45, 0.7, { type: "sine", vol: 0.12, release: 0.4 }));
  }

  function win() {
    if (!ctx) return;
    const melody = [
      [523.25, 0], [523.25, 0.18], [523.25, 0.36], [659.25, 0.54],
      [783.99, 0.8], [659.25, 1.06], [783.99, 1.3], [1046.5, 1.6]
    ];
    melody.forEach(([f, s]) => {
      tone(f, s, 0.28, { type: "triangle", vol: 0.22 });
      tone(f / 2, s, 0.28, { type: "sawtooth", vol: 0.06 });
    });
    [523.25, 659.25, 783.99, 1046.5].forEach(f => tone(f, 1.9, 1.4, { type: "triangle", vol: 0.14, release: 0.6 }));
  }

  function lose() {
    if (!ctx) return;
    [[293.66, 0, 0.4], [277.18, 0.45, 0.4], [261.63, 0.9, 0.4]].forEach(([f, s, d]) => {
      tone(f, s, d, { type: "sawtooth", vol: 0.16 });
    });
    tone(246.94, 1.35, 0.9, { type: "sawtooth", vol: 0.18, slideTo: 207.65, release: 0.3 });
  }

  function setMuted(value) {
    muted = value;
    if (master) master.gain.value = muted ? 0 : 0.7;
  }

  function toggleMute() {
    setMuted(!muted);
    return muted;
  }

  function isMuted() {
    return muted;
  }

  return {
    unlock, startTension, stopTension, intro, questionIn, select, lock,
    correct, wrong, tick, lifeline, prize, win, lose, toggleMute, isMuted
  };
})();

// =============================================================================
// 4. ÉTAT DU JEU (Game State)
// =============================================================================
let currentQuestionIndex = 0;
let selectedAnswerIndex = null;
let isValidated = false;
let lastResultCorrect = false;
let correctCount = 0;
let activeQuestions = [];
let usedLifelines = {
  fiftyFifty: false,
  audience: false,
  swap: false
};
let eliminatedIndices = [];
let usedSpareQuestions = {
  easy: 0,
  medium: 0,
  hard: 0
};

// Chronomètre
let remainingMs = TIME_LIMIT_MS;
let timerId = null;
let lastShownSecond = null;
let revealTimeoutId = null;

// =============================================================================
// 5. ÉLÉMENTS DU DOM
// =============================================================================
// Écrans
const screenStart = document.getElementById("start-screen");
const screenGame = document.getElementById("game-screen");
const screenEnd = document.getElementById("end-screen");

// Boutons de navigation
const btnStart = document.getElementById("btn-start");
const btnRestart = document.getElementById("btn-restart");

// Interface question
const quizArena = document.getElementById("quiz-arena");
const questionProgress = document.getElementById("question-progress");
const questionPrize = document.getElementById("question-prize");
const questionText = document.getElementById("question-text");
const answerButtons = [
  document.getElementById("answer-0"),
  document.getElementById("answer-1"),
  document.getElementById("answer-2"),
  document.getElementById("answer-3")
];
const answerTexts = [
  document.getElementById("answer-text-0"),
  document.getElementById("answer-text-1"),
  document.getElementById("answer-text-2"),
  document.getElementById("answer-text-3")
];

// Chronomètre
const timerEl = document.getElementById("timer");
const timerFg = document.getElementById("timer-fg");
const timerText = document.getElementById("timer-text");

// Validation et progression
const btnValidate = document.getElementById("btn-validate");
const resultBox = document.getElementById("result-box");
const resultMessage = document.getElementById("result-message");
const btnNext = document.getElementById("btn-next");

// Écran des gains
const scoreModal = document.getElementById("score-modal");
const wonAmount = document.getElementById("won-amount");
const milestoneNote = document.getElementById("milestone-note");
const ladderList = document.getElementById("ladder-list");
const btnContinue = document.getElementById("btn-continue");

// Jokers
const lifeline5050 = document.getElementById("lifeline-5050");
const lifelineAudience = document.getElementById("lifeline-audience");
const lifelineSwap = document.getElementById("lifeline-swap");

// Modale Audience
const audienceModal = document.getElementById("audience-modal");
const audienceChart = document.getElementById("audience-chart");
const btnCloseAudience = document.getElementById("btn-close-audience");

// Écran de fin
const endTitle = document.getElementById("end-title");
const endStatus = document.getElementById("end-status");
const endPrize = document.getElementById("end-prize");
const endScore = document.getElementById("end-score");

// Divers
const confettiLayer = document.getElementById("confetti");
const stageBackground = document.getElementById("stage-background");

// =============================================================================
// 6. INITIALISATION
// =============================================================================
function initApp() {
  buildPrizeLadder();
  buildSparkles();
  attachEventListeners();

  let savedLang = "fr";
  try { savedLang = localStorage.getItem("quizLang") || "fr"; } catch (e) { /* ignoré */ }
  applyLanguage(savedLang);
}

/**
 * Étoiles scintillantes en arrière-plan.
 */
function buildSparkles() {
  for (let i = 0; i < 26; i++) {
    const s = document.createElement("span");
    s.className = "sparkle";
    const size = 2 + Math.random() * 3;
    s.style.width = `${size}px`;
    s.style.height = `${size}px`;
    s.style.left = `${Math.random() * 100}%`;
    s.style.top = `${Math.random() * 100}%`;
    s.style.setProperty("--dur", `${3 + Math.random() * 4}s`);
    s.style.setProperty("--delay", `${Math.random() * 5}s`);
    stageBackground.appendChild(s);
  }
}

/**
 * Construit l'échelle des gains (15 niveaux de haut en bas).
 * Elle est affichée sur l'écran des gains, après chaque réponse.
 */
function buildPrizeLadder() {
  ladderList.innerHTML = "";
  for (let i = PRIZE_STEPS.length - 1; i >= 0; i--) {
    const step = PRIZE_STEPS[i];
    const li = document.createElement("li");
    li.className = "ladder-step";
    li.id = `ladder-step-${step.level}`;
    li.style.setProperty("--i", step.level);

    if (step.milestone) {
      li.classList.add("milestone");
    }

    li.innerHTML = `
      <span class="step-num">${step.level}</span>
      <span class="step-amount">${step.amount}</span>
    `;
    ladderList.appendChild(li);
  }
}

/**
 * Attache les écouteurs d'événements principaux.
 */
function attachEventListeners() {
  // Navigation générale (le clic débloque aussi le son du navigateur)
  btnStart.addEventListener("click", () => {
    Sound.unlock();
    Sound.intro();
    startGame();
  });
  btnRestart.addEventListener("click", () => {
    Sound.unlock();
    startGame();
  });

  // Traduction
  document.querySelectorAll(".lang-btn").forEach(btn => {
    btn.addEventListener("click", () => applyLanguage(btn.dataset.lang));
  });

  // Son
  document.querySelectorAll(".sound-toggle").forEach(btn => {
    btn.addEventListener("click", () => {
      Sound.unlock();
      const muted = Sound.toggleMute();
      document.querySelectorAll(".sound-toggle").forEach(b => {
        b.textContent = muted ? "🔇" : "🔊";
      });
    });
  });

  // Réponses
  answerButtons.forEach((btn, index) => {
    btn.addEventListener("click", () => handleSelectAnswer(index));
  });

  // Validation et suite
  btnValidate.addEventListener("click", handleValidateAnswer);
  btnNext.addEventListener("click", handleNextAction);
  btnContinue.addEventListener("click", handleContinueAfterPrize);

  // Jokers
  lifeline5050.addEventListener("click", useFiftyFifty);
  lifelineAudience.addEventListener("click", useAudience);
  lifelineSwap.addEventListener("click", useQuestionSwap);

  // Modale Public
  btnCloseAudience.addEventListener("click", closeAudience);
  audienceModal.addEventListener("click", (e) => {
    if (e.target === audienceModal) closeAudience();
  });
}

// =============================================================================
// 7. GESTION DU CYCLE DE PARTIE
// =============================================================================

/**
 * Démarre ou réinitialise une partie complète.
 */
function startGame() {
  clearTimeout(revealTimeoutId);
  stopTimer();

  currentQuestionIndex = 0;
  correctCount = 0;
  isValidated = false;
  lastResultCorrect = false;
  selectedAnswerIndex = null;
  eliminatedIndices = [];

  // Copie indépendante des questions pour permettre le joker Swap
  activeQuestions = JSON.parse(JSON.stringify(questions));

  usedLifelines = {
    fiftyFifty: false,
    audience: false,
    swap: false
  };
  usedSpareQuestions = { easy: 0, medium: 0, hard: 0 };

  resetLifelineButtons();
  scoreModal.classList.add("hidden");
  audienceModal.classList.add("hidden");

  showScreen("game");
  loadQuestion();
}

/**
 * Bascule l'écran actif (start / game / end).
 */
function showScreen(name) {
  screenStart.classList.remove("active");
  screenGame.classList.remove("active");
  screenEnd.classList.remove("active");

  if (name === "start") screenStart.classList.add("active");
  if (name === "game") screenGame.classList.add("active");
  if (name === "end") screenEnd.classList.add("active");

  // Mode plein écran pendant la partie
  document.body.classList.toggle("in-game", name === "game");
}

/**
 * Réinitialise l'aspect visuel des 3 jokers.
 */
function resetLifelineButtons() {
  [lifeline5050, lifelineAudience, lifelineSwap].forEach(btn => {
    btn.disabled = false;
    btn.classList.remove("used");
  });
}

// =============================================================================
// 8. CHRONOMÈTRE (20 secondes par question)
// =============================================================================

function startTimer() {
  stopTimer();
  remainingMs = TIME_LIMIT_MS;
  lastShownSecond = null;
  updateTimerUI();
  resumeTimer();
}

function resumeTimer() {
  if (timerId) return;
  let last = Date.now();
  timerId = setInterval(() => {
    const now = Date.now();
    remainingMs -= now - last;
    last = now;

    if (remainingMs <= 0) {
      remainingMs = 0;
      updateTimerUI();
      stopTimer();
      handleTimeout();
      return;
    }
    updateTimerUI();
  }, 100);
}

function stopTimer() {
  if (timerId) {
    clearInterval(timerId);
    timerId = null;
  }
}

function updateTimerUI() {
  const seconds = Math.max(0, Math.ceil(remainingMs / 1000));
  timerText.textContent = seconds;

  const ratio = Math.max(0, remainingMs) / TIME_LIMIT_MS;
  timerFg.style.strokeDashoffset = TIMER_CIRCUMFERENCE * (1 - ratio);

  const warning = seconds <= 5;
  timerEl.classList.toggle("warning", warning);

  if (seconds !== lastShownSecond) {
    lastShownSecond = seconds;
    if (warning && seconds > 0 && !isValidated) Sound.tick();
  }
}

/**
 * Temps écoulé : si une réponse est sélectionnée, elle est validée
 * automatiquement ; sinon la question est perdue.
 */
function handleTimeout() {
  if (isValidated) return;

  if (selectedAnswerIndex !== null) {
    handleValidateAnswer();
    return;
  }

  isValidated = true;
  Sound.stopTension();
  answerButtons.forEach(btn => btn.disabled = true);
  btnValidate.style.display = "none";
  revealResult(null, true);
}

// =============================================================================
// 9. CHARGEMENT ET AFFICHAGE D'UNE QUESTION
// =============================================================================

function updateProgressText() {
  questionProgress.textContent = `${t("question")} ${currentQuestionIndex + 1} / 15`;
  const step = PRIZE_STEPS[currentQuestionIndex];
  questionPrize.textContent = step ? `${t("forPrize")} ${step.amount}` : "";
}

function loadQuestion() {
  const qData = activeQuestions[currentQuestionIndex];
  if (!qData) return;

  clearTimeout(revealTimeoutId);
  isValidated = false;
  selectedAnswerIndex = null;
  eliminatedIndices = [];

  updateProgressText();
  questionText.textContent = qData.question;

  // Réinitialiser les boutons de réponse
  answerButtons.forEach((btn, index) => {
    btn.className = "hexagon-outer answer-btn";
    btn.disabled = false;
    answerTexts[index].textContent = qData.answers[index];
  });

  // Réinitialiser la barre de validation
  btnValidate.style.display = "block";
  btnValidate.disabled = true;
  resultBox.classList.add("hidden");

  // Relancer les animations d'entrée
  quizArena.classList.remove("enter", "shake");
  void quizArena.offsetWidth; // force le recalcul pour rejouer l'animation
  quizArena.classList.add("enter");

  Sound.questionIn();
  Sound.startTension();
  startTimer();
}

// =============================================================================
// 10. SÉLECTION ET VALIDATION DE RÉPONSE
// =============================================================================

/**
 * Sélectionne une réponse (une seule à la fois, sans révélation immédiate).
 */
function handleSelectAnswer(index) {
  if (isValidated) return;
  if (eliminatedIndices.includes(index)) return;

  selectedAnswerIndex = index;
  Sound.select();

  answerButtons.forEach(btn => btn.classList.remove("selected"));
  answerButtons[index].classList.add("selected");

  btnValidate.disabled = false;
}

/**
 * Valide le choix : la réponse est verrouillée, puis révélée après un suspense.
 */
function handleValidateAnswer() {
  if (selectedAnswerIndex === null || isValidated) return;

  isValidated = true;
  stopTimer();
  Sound.stopTension();
  Sound.lock();

  answerButtons.forEach(btn => btn.disabled = true);
  btnValidate.style.display = "none";

  answerButtons[selectedAnswerIndex].classList.remove("selected");
  answerButtons[selectedAnswerIndex].classList.add("locked");

  const chosen = selectedAnswerIndex;
  revealTimeoutId = setTimeout(() => revealResult(chosen, false), REVEAL_DELAY_MS);
}

/**
 * Révèle le résultat (bonne / mauvaise réponse / temps écoulé).
 */
function revealResult(index, timedOut) {
  const currentQ = activeQuestions[currentQuestionIndex];
  lastResultCorrect = (index !== null && index === currentQ.correct);

  answerButtons.forEach(btn => btn.classList.remove("locked", "selected"));

  if (lastResultCorrect) {
    correctCount++;
    answerButtons[index].classList.add("correct");

    resultMessage.textContent = t("correct");
    resultMessage.className = "result-message success";
    btnNext.textContent = t("seeWins");

    Sound.correct();
    launchConfetti(40);
  } else {
    if (index !== null) {
      answerButtons[index].classList.add("wrong");
    }
    // Afficher également la bonne réponse en vert
    answerButtons[currentQ.correct].classList.add("correct");

    resultMessage.textContent = timedOut ? t("timeUp") : t("wrong");
    resultMessage.className = "result-message failure";
    btnNext.textContent = t("seeFinal");

    Sound.wrong();
    quizArena.classList.remove("shake");
    void quizArena.offsetWidth;
    quizArena.classList.add("shake");
  }

  resultBox.classList.remove("hidden");
}

/**
 * Bouton après le résultat :
 * - bonne réponse -> écran des gains (échelle) ;
 * - mauvaise réponse -> écran final.
 */
function handleNextAction() {
  if (!lastResultCorrect) {
    endGame(false);
    return;
  }
  showPrizeScreen();
}

// =============================================================================
// 11. ÉCRAN DES GAINS (APRÈS la réponse, plus à côté de la question)
// =============================================================================

function showPrizeScreen() {
  const level = currentQuestionIndex + 1;
  const step = PRIZE_STEPS[currentQuestionIndex];

  updatePrizeLadder(level);
  wonAmount.textContent = step.amount;
  milestoneNote.classList.toggle("hidden", !step.milestone);
  btnContinue.textContent = (level === 15) ? t("finalTotal") : t("nextQuestion");

  scoreModal.classList.remove("hidden");

  Sound.prize();
  if (step.milestone) launchConfetti(70);
}

/**
 * Met à jour la surbrillance de l'échelle des gains.
 */
function updatePrizeLadder(levelWon) {
  for (let i = 1; i <= 15; i++) {
    const stepEl = document.getElementById(`ladder-step-${i}`);
    if (!stepEl) continue;

    stepEl.classList.remove("current", "passed");

    if (i === levelWon) {
      stepEl.classList.add("current");
    } else if (i < levelWon) {
      stepEl.classList.add("passed");
    }
  }
}

function handleContinueAfterPrize() {
  scoreModal.classList.add("hidden");

  if (currentQuestionIndex < 14) {
    currentQuestionIndex++;
    loadQuestion();
  } else {
    endGame(true);
  }
}

// =============================================================================
// 12. JOKERS (LIFELINES)
// =============================================================================

/**
 * JOKER 1 : 50:50
 * Supprime deux mauvaises réponses de manière aléatoire.
 */
function useFiftyFifty() {
  if (usedLifelines.fiftyFifty || isValidated) return;

  const currentQ = activeQuestions[currentQuestionIndex];
  const wrongIndices = [0, 1, 2, 3].filter(idx => idx !== currentQ.correct);

  const shuffledWrong = wrongIndices.sort(() => Math.random() - 0.5);
  eliminatedIndices = shuffledWrong.slice(0, 2);

  eliminatedIndices.forEach(idx => {
    answerButtons[idx].classList.add("eliminated");
  });

  // Si le joueur avait sélectionné une réponse éliminée, désélectionner
  if (eliminatedIndices.includes(selectedAnswerIndex)) {
    selectedAnswerIndex = null;
    answerButtons.forEach(btn => btn.classList.remove("selected"));
    btnValidate.disabled = true;
  }

  Sound.lifeline();
  usedLifelines.fiftyFifty = true;
  lifeline5050.disabled = true;
  lifeline5050.classList.add("used");
}

/**
 * JOKER 2 : Question au public
 * Affiche des pourcentages simulés où la bonne réponse a le score le plus élevé.
 * Le chronomètre est mis en pause pendant que la modale est ouverte.
 */
function useAudience() {
  if (usedLifelines.audience || isValidated) return;

  const currentQ = activeQuestions[currentQuestionIndex];
  const correctIdx = currentQ.correct;

  // Réponses incorrectes actives (prenant en compte 50:50)
  const activeWrongIndices = [0, 1, 2, 3].filter(
    i => i !== correctIdx && !eliminatedIndices.includes(i)
  );

  let correctPct;
  if (activeWrongIndices.length === 1) {
    // 50:50 déjà utilisé : 65% à 85%
    correctPct = Math.floor(Math.random() * 21) + 65;
  } else if (currentQuestionIndex < 5) {
    // Facile : 70% à 86%
    correctPct = Math.floor(Math.random() * 17) + 70;
  } else if (currentQuestionIndex < 10) {
    // Moyen : 56% à 70%
    correctPct = Math.floor(Math.random() * 15) + 56;
  } else {
    // Difficile : 46% à 58%
    correctPct = Math.floor(Math.random() * 13) + 46;
  }

  const remainingPct = 100 - correctPct;
  const percentages = [0, 0, 0, 0];
  percentages[correctIdx] = correctPct;

  if (activeWrongIndices.length === 1) {
    percentages[activeWrongIndices[0]] = remainingPct;
  } else {
    // Répartition aléatoire du reste entre les mauvaises réponses
    const weights = activeWrongIndices.map(() => Math.random() + 0.3);
    const weightSum = weights.reduce((a, b) => a + b, 0);
    const parts = weights.map(w => Math.floor((w / weightSum) * remainingPct));
    parts[0] += remainingPct - parts.reduce((a, b) => a + b, 0);
    activeWrongIndices.forEach((idx, i) => {
      percentages[idx] = parts[i];
    });
  }

  stopTimer(); // pause du chronomètre
  Sound.lifeline();
  renderAudienceChart(percentages, correctIdx);
  audienceModal.classList.remove("hidden");

  usedLifelines.audience = true;
  lifelineAudience.disabled = true;
  lifelineAudience.classList.add("used");
}

function closeAudience() {
  audienceModal.classList.add("hidden");
  if (screenGame.classList.contains("active") && !isValidated) {
    resumeTimer();
  }
}

/**
 * Construit les colonnes du graphique d'audience.
 */
function renderAudienceChart(percentages, correctIdx) {
  audienceChart.innerHTML = "";

  percentages.forEach((pct, index) => {
    const col = document.createElement("div");
    col.className = "audience-bar-col";

    const isLeader = (index === correctIdx);

    col.innerHTML = `
      <span class="audience-pct">${pct}%</span>
      <div class="audience-bar-outer">
        <div class="audience-bar-inner ${isLeader ? "lead" : ""}" style="height: 0%;"></div>
      </div>
      <span class="audience-label">${ANSWER_LETTERS[index]}</span>
    `;

    audienceChart.appendChild(col);

    // Animation progressive de la hauteur
    setTimeout(() => {
      const innerBar = col.querySelector(".audience-bar-inner");
      if (innerBar) innerBar.style.height = `${pct}%`;
    }, 80 + index * 120);
  });
}

/**
 * JOKER 3 : Changer de question
 * Échange la question actuelle contre une question de réserve de même niveau
 * (le chronomètre repart à 20 secondes).
 */
function useQuestionSwap() {
  if (usedLifelines.swap || isValidated) return;

  let diff = "easy";
  if (currentQuestionIndex >= 10) {
    diff = "hard";
  } else if (currentQuestionIndex >= 5) {
    diff = "medium";
  }

  const pool = spareQuestions[diff];
  if (!pool || pool.length === 0) return;

  const spareIndex = usedSpareQuestions[diff] % pool.length;
  usedSpareQuestions[diff]++;

  activeQuestions[currentQuestionIndex] = JSON.parse(JSON.stringify(pool[spareIndex]));

  usedLifelines.swap = true;
  lifelineSwap.disabled = true;
  lifelineSwap.classList.add("used");

  Sound.lifeline();
  loadQuestion();
}

// =============================================================================
// 13. FIN DE PARTIE & CALCUL DES GAINS
// =============================================================================

/**
 * Calcule le gain garanti en cas d'échec :
 * - Question 1 à 5 ratée : 0 €
 * - Question 6 à 10 ratée : 2 000 € (Palier 1 atteint à la question 5)
 * - Question 11 à 15 ratée : 100 000 € (Palier 2 atteint à la question 10)
 */
function calculateFinalPrize(isWin) {
  if (isWin) {
    return "1 000 000 €";
  }

  if (currentQuestionIndex >= 10) {
    return "100 000 €";
  }
  if (currentQuestionIndex >= 5) {
    return "2 000 €";
  }
  return "0 €";
}

/**
 * Affiche l'écran final avec les résultats.
 */
function endGame(isWin) {
  stopTimer();
  Sound.stopTension();
  scoreModal.classList.add("hidden");

  const prize = calculateFinalPrize(isWin);

  if (isWin) {
    endTitle.textContent = t("endWinTitle");
    endTitle.className = "end-title win";
    endStatus.textContent = t("endWinStatus");
    Sound.win();
    launchConfetti(160);
    setTimeout(() => launchConfetti(120), 900);
  } else {
    endTitle.textContent = t("endLoseTitle");
    endTitle.className = "end-title lose";
    endStatus.textContent = t("endLoseStatus");
    Sound.lose();
  }

  endPrize.textContent = prize;
  endScore.textContent = `${correctCount} / 15`;

  showScreen("end");
}

// =============================================================================
// 14. CONFETTIS
// =============================================================================
function launchConfetti(count) {
  const colors = ["#f4c542", "#fff2a8", "#3498db", "#2ecc71", "#e74c3c", "#ffffff", "#f39c12"];

  for (let i = 0; i < count; i++) {
    const piece = document.createElement("i");
    piece.className = "confetti-piece";
    piece.style.left = `${Math.random() * 100}vw`;
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    piece.style.width = `${6 + Math.random() * 7}px`;
    piece.style.height = `${8 + Math.random() * 10}px`;
    piece.style.animationDuration = `${2 + Math.random() * 2.2}s`;
    piece.style.animationDelay = `${Math.random() * 0.5}s`;
    piece.style.setProperty("--drift", `${Math.random() * 240 - 120}px`);
    confettiLayer.appendChild(piece);
    setTimeout(() => piece.remove(), 5200);
  }
}

// =============================================================================
// 15. LANCEMENT DE L'APPLICATION
// =============================================================================
document.addEventListener("DOMContentLoaded", initApp);
