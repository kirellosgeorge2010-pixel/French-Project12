/**
 * questions.js
 * Base de données des questions du jeu « Qui veut gagner des millions ? »
 * 15 questions principales : 1 à 5 faciles, 6 à 10 moyennes, 11 à 15 difficiles.
 * Questions de réserve (spareQuestions) pour le joker « Changer de question ».
 */

const questions = [
  // ===================================================
  // NIVEAU FACILE (Questions 1 à 5)
  // ===================================================
  {
    question: "Quelle planète de notre système solaire est surnommée la « planète rouge » ?",
    answers: ["Vénus", "Mars", "Jupiter", "Mercure"],
    correct: 1
  },
  {
    question: "Quelle est la capitale officielle de l'Italie ?",
    answers: ["Milan", "Venise", "Rome", "Florence"],
    correct: 2
  },
  {
    question: "Qui a écrit le célèbre roman « Les Misérables », mettant en scène Jean Valjean ?",
    answers: ["Victor Hugo", "Émile Zola", "Gustave Flaubert", "Alexandre Dumas"],
    correct: 0
  },
  {
    question: "Combien de côtés possède un hexagone régulier ?",
    answers: ["5 côtés", "8 côtés", "6 côtés", "7 côtés"],
    correct: 2
  },
  {
    question: "Quel organe vital assure la circulation continue du sang dans le corps humain ?",
    answers: ["Les poumons", "Le cœur", "Le foie", "L'estomac"],
    correct: 1
  },

  // ===================================================
  // NIVEAU MOYEN (Questions 6 à 10)
  // ===================================================
  {
    question: "En quelle année s'est déroulée la prise de la Bastille lors de la Révolution française ?",
    answers: ["1776", "1789", "1799", "1804"],
    correct: 1
  },
  {
    question: "Quel savant français a mis au point le premier vaccin efficace contre la rage en 1885 ?",
    answers: ["Louis Pasteur", "René Laennec", "Antoine Lavoisier", "Claude Bernard"],
    correct: 0
  },
  {
    question: "Quel peintre néerlandais a peint le vertigineux chef-d'œuvre « La Nuit étoilée » en 1889 ?",
    answers: ["Rembrandt", "Johannes Vermeer", "Vincent van Gogh", "Piet Mondrian"],
    correct: 2
  },
  {
    question: "Quel est le plus long fleuve dont le cours s'écoule intégralement en France métropolitaine ?",
    answers: ["La Seine", "Le Rhône", "La Garonne", "La Loire"],
    correct: 3
  },
  {
    question: "Quel sprinteur jamaïcain détient le record du monde du 100 mètres en 9 secondes et 58 centièmes ?",
    answers: ["Carl Lewis", "Usain Bolt", "Tyson Gay", "Yohan Blake"],
    correct: 1
  },

  // ===================================================
  // NIVEAU DIFFICILE (Questions 11 à 15)
  // ===================================================
  {
    question: "En quelle année les frères Wright ont-ils réussi le premier vol motorisé contrôlé de l'Histoire ?",
    answers: ["1898", "1901", "1903", "1909"],
    correct: 2
  },
  {
    question: "Hormis le Soleil, quelle est l'étoile la plus proche de notre système planétaire ?",
    answers: ["Proxima du Centaure", "Sirius A", "Bételgeuse", "Véga"],
    correct: 0
  },
  {
    question: "Quel chef gaulois a infligé une défaite à Jules César lors du siège de Gergovie en 52 avant J.-C. ?",
    answers: ["Ambiorix", "Dumnorix", "Brennus", "Vercingétorix"],
    correct: 3
  },
  {
    question: "Dans quel opéra magistral de Georges Bizet entend-on l'air « L'amour est un oiseau rebelle » ?",
    answers: ["La Traviata", "Les Pêcheurs de perles", "Carmen", "Faust"],
    correct: 2
  },
  {
    question: "Quelle particule élémentaire observée au CERN en 2012 confère leur masse aux autres particules ?",
    answers: ["Le neutrino", "Le boson de Higgs", "Le gluon", "Le positron"],
    correct: 1
  }
];

// Questions de rechange pour le joker « Changer de question »
const spareQuestions = {
  easy: [
    {
      question: "Dans quelle ville européenne peut-on admirer la tour Eiffel et le musée du Louvre ?",
      answers: ["Bruxelles", "Genève", "Madrid", "Paris"],
      correct: 3
    },
    {
      question: "Quelle sélection nationale a remporté la Coupe du Monde masculine de football en 1998 et 2018 ?",
      answers: ["Le Brésil", "L'Allemagne", "La France", "L'Argentine"],
      correct: 2
    }
  ],
  medium: [
    {
      question: "Quel cosmonaute est entré dans l'Histoire le 12 avril 1961 comme le premier être humain dans l'espace ?",
      answers: ["Neil Armstrong", "Youri Gagarine", "Buzz Aldrin", "Alexeï Leonov"],
      correct: 1
    },
    {
      question: "Quel élément métallique a la particularité d'être à l'état liquide sous conditions normales de température ?",
      answers: ["Le plomb", "Le mercure", "L'argent", "L'étain"],
      correct: 1
    }
  ],
  hard: [
    {
      question: "Quel architecte sino-américain de renommée mondiale est l'auteur de la Pyramide de verre du Louvre ?",
      answers: ["Jean Nouvel", "Renzo Piano", "Frank Gehry", "Ieoh Ming Pei"],
      correct: 3
    },
    {
      question: "Quel traité historique signé en 1992 aux Pays-Bas a créé officiellement l'Union européenne ?",
      answers: ["Le traité de Rome", "Le traité de Maastricht", "Le traité de Lisbonne", "Le traité d'Amsterdam"],
      correct: 1
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
