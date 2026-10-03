/**
 * script.js
 * Moteur du jeu « Qui Veut Gagner des Millions ? »
 * Logique pure JavaScript, sans dépendance externe.
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

// =============================================================================
// 2. ÉTAT DU JEU (Game State)
// =============================================================================
let currentQuestionIndex = 0;
let selectedAnswerIndex = null;
let isValidated = false;
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

// =============================================================================
// 3. ÉLÉMENTS DU DOM
// =============================================================================
// Écrans
const screenStart = document.getElementById("start-screen");
const screenGame = document.getElementById("game-screen");
const screenEnd = document.getElementById("end-screen");

// Boutons de navigation
const btnStart = document.getElementById("btn-start");
const btnRestart = document.getElementById("btn-restart");

// Interface question
const questionProgress = document.getElementById("question-progress");
const questionText = document.getElementById("question-text");
const answersGrid = document.getElementById("answers-grid");
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

// Validation et progression
const btnValidate = document.getElementById("btn-validate");
const resultBox = document.getElementById("result-box");
const resultMessage = document.getElementById("result-message");
const btnNext = document.getElementById("btn-next");

// Échelle des gains
const ladderList = document.getElementById("ladder-list");

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

// =============================================================================
// 4. INITIALISATION DU JEU
// =============================================================================
function initApp() {
  buildPrizeLadder();
  attachEventListeners();
}

/**
 * Construit l'échelle des gains (15 niveaux de haut en bas).
 */
function buildPrizeLadder() {
  ladderList.innerHTML = "";
  // Affichage descendant (15 en haut, 1 en bas)
  for (let i = PRIZE_STEPS.length - 1; i >= 0; i--) {
    const step = PRIZE_STEPS[i];
    const li = document.createElement("li");
    li.className = "ladder-step";
    li.id = `ladder-step-${step.level}`;

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
  // Navigation générale
  btnStart.addEventListener("click", startGame);
  btnRestart.addEventListener("click", startGame);

  // Réponses
  answerButtons.forEach((btn, index) => {
    btn.addEventListener("click", () => handleSelectAnswer(index));
  });

  // Validation
  btnValidate.addEventListener("click", handleValidateAnswer);
  btnNext.addEventListener("click", handleNextAction);

  // Jokers
  lifeline5050.addEventListener("click", useFiftyFifty);
  lifelineAudience.addEventListener("click", useAudience);
  lifelineSwap.addEventListener("click", useQuestionSwap);

  // Modale Public
  btnCloseAudience.addEventListener("click", () => {
    audienceModal.classList.add("hidden");
  });

  // Fermer la modale en cliquant sur le fond
  audienceModal.addEventListener("click", (e) => {
    if (e.target === audienceModal) {
      audienceModal.classList.add("hidden");
    }
  });
}

// =============================================================================
// 5. GESTION DU CYCLE DE PARTIE
// =============================================================================

/**
 * Démarre ou réinitialise une partie complète.
 */
function startGame() {
  currentQuestionIndex = 0;
  correctCount = 0;
  isValidated = false;
  selectedAnswerIndex = null;
  eliminatedIndices = [];

  // Copie indépendante des questions pour permettre le joker Swap
  activeQuestions = JSON.parse(JSON.stringify(questions));

  // Réinitialiser les jokers
  usedLifelines = {
    fiftyFifty: false,
    audience: false,
    swap: false
  };
  usedSpareQuestions = { easy: 0, medium: 0, hard: 0 };

  resetLifelineButtons();

  // Afficher l'écran de jeu
  showScreen("game");

  // Charger la première question
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
// 6. CHARGEMENT ET AFFICHAGE D'UNE QUESTION
// =============================================================================

function loadQuestion() {
  const qData = activeQuestions[currentQuestionIndex];
  if (!qData) return;

  isValidated = false;
  selectedAnswerIndex = null;
  eliminatedIndices = [];

  // Mettre à jour le numéro de question
  questionProgress.textContent = `Question ${currentQuestionIndex + 1} / 15`;

  // Mettre à jour l'intitulé
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

  // Mettre à jour la surbrillance sur l'échelle des gains
  updatePrizeLadder();
}

/**
 * Met à jour la surbrillance de l'échelle des gains.
 */
function updatePrizeLadder() {
  const currentLevel = currentQuestionIndex + 1;

  for (let i = 1; i <= 15; i++) {
    const stepEl = document.getElementById(`ladder-step-${i}`);
    if (!stepEl) continue;

    stepEl.classList.remove("current", "passed");

    if (i === currentLevel) {
      stepEl.classList.add("current");
    } else if (i < currentLevel) {
      stepEl.classList.add("passed");
    }
  }
}

// =============================================================================
// 7. SÉLECTION ET VALIDATION DE RÉPONSE
// =============================================================================

/**
 * Sélectionne une réponse (une seule à la fois, sans révélation immédiate).
 */
function handleSelectAnswer(index) {
  if (isValidated) return;
  if (eliminatedIndices.includes(index)) return;

  selectedAnswerIndex = index;

  // Retirer l'état sélectionné sur tous les boutons
  answerButtons.forEach(btn => btn.classList.remove("selected"));

  // Appliquer la sélection sur le bouton cliqué (couleur orange/or)
  answerButtons[index].classList.add("selected");

  // Activer le bouton de validation
  btnValidate.disabled = false;
}

/**
 * Valide le choix du joueur et révèle la bonne/mauvaise réponse.
 */
function handleValidateAnswer() {
  if (selectedAnswerIndex === null || isValidated) return;

  isValidated = true;
  const currentQ = activeQuestions[currentQuestionIndex];
  const isCorrect = (selectedAnswerIndex === currentQ.correct);

  // Verrouiller les boutons
  answerButtons.forEach(btn => btn.disabled = true);
  btnValidate.style.display = "none";

  if (isCorrect) {
    // Bonne réponse !
    correctCount++;
    answerButtons[selectedAnswerIndex].classList.remove("selected");
    answerButtons[selectedAnswerIndex].classList.add("correct");

    resultMessage.textContent = "Bonne réponse !";
    resultMessage.className = "result-message success";

    if (currentQuestionIndex === 14) {
      // Victoire ultime (15/15)
      btnNext.textContent = "Voir mes gains →";
    } else {
      btnNext.textContent = "Question suivante →";
    }
  } else {
    // Mauvaise réponse !
    answerButtons[selectedAnswerIndex].classList.remove("selected");
    answerButtons[selectedAnswerIndex].classList.add("wrong");

    // Afficher également la bonne réponse en vert
    answerButtons[currentQ.correct].classList.add("correct");

    resultMessage.textContent = "Mauvaise réponse !";
    resultMessage.className = "result-message failure";

    btnNext.textContent = "Voir le résultat final →";
  }

  resultBox.classList.remove("hidden");
}

/**
 * Gère le clic sur le bouton suivant (passe à la question suivante ou à la fin).
 */
function handleNextAction() {
  const currentQ = activeQuestions[currentQuestionIndex];
  const isCorrect = (selectedAnswerIndex === currentQ.correct);

  if (isCorrect) {
    if (currentQuestionIndex < 14) {
      currentQuestionIndex++;
      loadQuestion();
    } else {
      // Gagné le million !
      endGame(true);
    }
  } else {
    // Perdu, fin du jeu
    endGame(false);
  }
}

// =============================================================================
// 8. JOKERS (LIFELINES)
// =============================================================================

/**
 * JOKER 1 : 50:50
 * Supprime deux mauvaises réponses de manière aléatoire.
 */
function useFiftyFifty() {
  if (usedLifelines.fiftyFifty || isValidated) return;

  const currentQ = activeQuestions[currentQuestionIndex];
  const wrongIndices = [0, 1, 2, 3].filter(idx => idx !== currentQ.correct);

  // Mélanger les mauvaises réponses pour en choisir 2
  const shuffledWrong = wrongIndices.sort(() => Math.random() - 0.5);
  eliminatedIndices = shuffledWrong.slice(0, 2);

  // Masquer les deux mauvaises réponses
  eliminatedIndices.forEach(idx => {
    answerButtons[idx].classList.add("eliminated");
  });

  // Si le joueur avait sélectionné une réponse éliminée, désélectionner
  if (eliminatedIndices.includes(selectedAnswerIndex)) {
    selectedAnswerIndex = null;
    answerButtons.forEach(btn => btn.classList.remove("selected"));
    btnValidate.disabled = true;
  }

  // Marquer le joker comme utilisé
  usedLifelines.fiftyFifty = true;
  lifeline5050.disabled = true;
  lifeline5050.classList.add("used");
}

/**
 * JOKER 2 : Question au public
 * Affiche des pourcentages simulés où la bonne réponse a le score le plus élevé.
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
    // 50:50 déjà utilisé : 2 options seulement en jeu
    // La bonne réponse doit avoir une nette majorité (> 50%)
    correctPct = Math.floor(Math.random() * 21) + 65; // 65% à 85%
  } else {
    // 4 options en jeu
    if (currentQuestionIndex < 5) {
      // Facile : 70% à 86%
      correctPct = Math.floor(Math.random() * 17) + 70;
    } else if (currentQuestionIndex < 10) {
      // Moyen : 56% à 70%
      correctPct = Math.floor(Math.random() * 15) + 56;
    } else {
      // Difficile : 46% à 58% (toujours le plus élevé)
      correctPct = Math.floor(Math.random() * 13) + 46;
    }
  }

  const remainingPct = 100 - correctPct;
  const percentages = [0, 0, 0, 0];
  percentages[correctIdx] = correctPct;

  if (activeWrongIndices.length === 1) {
    // La mauvaise réponse restante prend le reste
    percentages[activeWrongIndices[0]] = remainingPct;
  } else if (activeWrongIndices.length === 3) {
    // Répartir remainingPct entre les 3 mauvaises réponses
    // en garantissant que chacune reste strictement inférieure à correctPct
    const maxPart = Math.min(correctPct - 5, Math.floor(remainingPct * 0.45));
    const r1 = Math.floor(Math.random() * (maxPart - 6)) + 5;
    const r2 = Math.floor(Math.random() * (Math.min(maxPart, remainingPct - r1 - 5) - 6)) + 5;
    const r3 = remainingPct - r1 - r2;

    const parts = [r1, r2, r3];
    activeWrongIndices.forEach((idx, i) => {
      percentages[idx] = parts[i];
    });
  }

  // Générer le graphique dans la modale
  renderAudienceChart(percentages, correctIdx);

  // Afficher la modale
  audienceModal.classList.remove("hidden");

  // Marquer le joker comme utilisé
  usedLifelines.audience = true;
  lifelineAudience.disabled = true;
  lifelineAudience.classList.add("used");
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
        <div class="audience-bar-inner ${isLeader ? 'lead' : ''}" style="height: 0%;"></div>
      </div>
      <span class="audience-label">${ANSWER_LETTERS[index]}</span>
    `;

    audienceChart.appendChild(col);

    // Animation progressive de la hauteur
    setTimeout(() => {
      const innerBar = col.querySelector(".audience-bar-inner");
      if (innerBar) innerBar.style.height = `${pct}%`;
    }, 50);
  });
}

/**
 * JOKER 3 : Changer de question
 * Échange la question actuelle contre une question de réserve de même niveau.
 */
function useQuestionSwap() {
  if (usedLifelines.swap || isValidated) return;

  // Déterminer la difficulté actuelle
  let diff = "easy";
  if (currentQuestionIndex >= 10) {
    diff = "hard";
  } else if (currentQuestionIndex >= 5) {
    diff = "medium";
  }

  // Récupérer la réserve de questions
  const pool = spareQuestions[diff];
  if (!pool || pool.length === 0) return;

  const spareIndex = usedSpareQuestions[diff] % pool.length;
  usedSpareQuestions[diff]++;

  // Remplacer la question actuelle par la question de réserve
  activeQuestions[currentQuestionIndex] = JSON.parse(JSON.stringify(pool[spareIndex]));

  // Réinitialiser la sélection et le 50:50 pour cette nouvelle question
  selectedAnswerIndex = null;
  eliminatedIndices = [];

  // Recharger l'affichage de la question
  loadQuestion();

  // Marquer le joker comme utilisé
  usedLifelines.swap = true;
  lifelineSwap.disabled = true;
  lifelineSwap.classList.add("used");
}

// =============================================================================
// 9. FIN DE PARTIE & CALCUL DES GAINS
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
  const prize = calculateFinalPrize(isWin);

  if (isWin) {
    endTitle.textContent = "Félicitations !";
    endTitle.className = "end-title win";
    endStatus.textContent = "Vous avez franchi les 15 paliers et décroché le million !";
  } else {
    endTitle.textContent = "Dommage !";
    endTitle.className = "end-title lose";
    endStatus.textContent = "Votre aventure s'arrête ici.";
  }

  endPrize.textContent = prize;
  endScore.textContent = `${correctCount} / 15`;

  showScreen("end");
}

// =============================================================================
// 10. LANCEMENT DE L'APPLICATION
// =============================================================================
document.addEventListener("DOMContentLoaded", initApp);
