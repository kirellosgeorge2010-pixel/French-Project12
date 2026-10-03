/**
 * questions.js
 * Base de données des questions du jeu « Qui veut gagner des millions ? »
 * Thèmes : saisons, jours de la semaine, mois de l'année et nombres.
 * 15 questions principales : 1 à 5 faciles, 6 à 10 moyennes, 11 à 15 difficiles.
 * Questions de réserve (spareQuestions) pour le joker « Changer de question ».
 */

const questions = [
  // ===================================================
  // NIVEAU FACILE (Questions 1 à 5)
  // ===================================================
  {
    question: "Quelle saison vient après l’hiver ?",
    answers: ["Le printemps", "L’été", "L’automne", "L’hiver"],
    correct: 0
  },
  {
    question: "Quel jour vient après lundi ?",
    answers: ["Dimanche", "Mardi", "Jeudi", "Samedi"],
    correct: 1
  },
  {
    question: "En quelle saison fait-il très chaud ?",
    answers: ["En hiver", "Au printemps", "En été", "En automne"],
    correct: 2
  },
  {
    question: "Combien y a-t-il de mois dans une année ?",
    answers: ["10", "11", "12", "13"],
    correct: 2
  },
  {
    question: "Quel est le premier mois de l’année ?",
    answers: ["Décembre", "Janvier", "Mars", "Février"],
    correct: 1
  },

  // ===================================================
  // NIVEAU MOYEN (Questions 6 à 10)
  // ===================================================
  {
    question: "Quelle saison vient après le printemps ?",
    answers: ["L’automne", "L’hiver", "Le printemps", "L’été"],
    correct: 3
  },
  {
    question: "En quelle saison les feuilles tombent-elles ?",
    answers: ["En automne", "Au printemps", "En été", "En hiver"],
    correct: 0
  },
  {
    question: "Quels jours composent le week-end en France ?",
    answers: ["Lundi et mardi", "Jeudi et vendredi", "Samedi et dimanche", "Mercredi et jeudi"],
    correct: 2
  },
  {
    question: "Complétez la suite : Mercredi, jeudi, ________, samedi.",
    answers: ["Lundi", "Vendredi", "Mardi", "Dimanche"],
    correct: 1
  },
  {
    question: "Comment écrit-on le nombre 8 en français ?",
    answers: ["Sept", "Six", "Neuf", "Huit"],
    correct: 3
  },

  // ===================================================
  // NIVEAU DIFFICILE (Questions 11 à 15)
  // ===================================================
  {
    question: "Quel est le premier jour de la semaine en France ?",
    answers: ["Samedi", "Dimanche", "Lundi", "Mardi"],
    correct: 2
  },
  {
    question: "Si aujourd'hui c'est dimanche, quel jour était hier ?",
    answers: ["Lundi", "Samedi", "Vendredi", "Jeudi"],
    correct: 1
  },
  {
    question: "Complétez la suite : Janvier, février, ________, avril.",
    answers: ["Mai", "Juin", "Mars", "Juillet"],
    correct: 2
  },
  {
    question: "Quel nombre vient après dix-neuf ?",
    answers: ["Vingt", "Dix-huit", "Trente", "Dix-sept"],
    correct: 0
  },
  {
    question: "Quels sont les mois de l’été en France ?",
    answers: ["Décembre, janvier, février", "Mars, avril, mai", "Septembre, octobre, novembre", "Juin, juillet, août"],
    correct: 3
  }
];

// Questions de rechange pour le joker « Changer de question »
const spareQuestions = {
  easy: [
    {
      question: "Quelles sont les quatre saisons de l’année ?",
      answers: [
        "Le printemps, l’été, l’automne et l’hiver",
        "Janvier, février, mars et avril",
        "Lundi, mardi, mercredi et jeudi",
        "Le matin, le midi, le soir et la nuit"
      ],
      correct: 0
    },
    {
      question: "Si aujourd'hui c'est mardi, quel jour sera demain ?",
      answers: ["Lundi", "Jeudi", "Mercredi", "Dimanche"],
      correct: 2
    }
  ],
  medium: [
    {
      question: "Quel jour vient avant vendredi ?",
      answers: ["Mardi", "Jeudi", "Dimanche", "Samedi"],
      correct: 1
    },
    {
      question: "Quel est le dernier mois de l’année ?",
      answers: ["Novembre", "Octobre", "Décembre", "Janvier"],
      correct: 2
    }
  ],
  hard: [
    {
      question: "Quelle saison vient après l’automne ?",
      answers: ["L’été", "Le printemps", "L’automne", "L’hiver"],
      correct: 3
    },
    {
      question: "Quel mois vient après août ?",
      answers: ["Septembre", "Juillet", "Octobre", "Juin"],
      correct: 0
    }
  ]
};

// Export pour compatibilité globale navigateur et tests
if (typeof window !== "undefined") {
  window.questions = questions;
  window.spareQuestions = spareQuestions;
}
if (typeof module !== "undefined" && module.exports) {
  module.exports = { questions, spareQuestions };
}
