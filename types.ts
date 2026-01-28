
export enum QuizCategory {
  HUMANAS = "Ciências Humanas",
  NATUREZA = "Ciências da Natureza",
  LINGUAGENS = "Linguagens e Códigos",
  MATEMATICA = "Matemática"
}

export interface Question {
  id: string;
  category: QuizCategory;
  text: string;
  image?: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface QuizResult {
  score: number;
  total: number;
  timeSpent: number;
  answers: { questionId: string; selected: number; correct: boolean }[];
  date: string;
}

export enum AppState {
  HOME = "home",
  QUIZ = "quiz",
  RESULTS = "results",
  AI_EDITOR = "ai_editor"
}
