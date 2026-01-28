
import { Question, QuizCategory } from './types';

export const INITIAL_QUESTIONS: Question[] = [
  {
    id: "q1",
    category: QuizCategory.HUMANAS,
    text: "O processo de colonização portuguesa no Brasil teve como um de seus marcos a introdução das Capitanias Hereditárias. Esse sistema visava:",
    options: [
      "Promover a industrialização imediata da colônia.",
      "Delegar a particulares a tarefa de colonizar e administrar as terras.",
      "Expandir a religião protestante no território.",
      "Substituir o trabalho escravo por trabalho assalariado.",
      "Criar uma democracia parlamentar na colônia."
    ],
    correctAnswer: 1,
    explanation: "As Capitanias Hereditárias foram um sistema de administração colonial criado por D. João III em 1534, dividindo o território em lotes doados a nobres (donatários) para que eles mesmos arcassem com os custos de colonização."
  },
  {
    id: "q2",
    category: QuizCategory.MATEMATICA,
    text: "Um capital de R$ 2.000,00 é aplicado a uma taxa de juros simples de 10% ao ano. Qual será o montante final após 3 anos?",
    options: [
      "R$ 2.200,00",
      "R$ 2.400,00",
      "R$ 2.600,00",
      "R$ 2.800,00",
      "R$ 3.000,00"
    ],
    correctAnswer: 2,
    explanation: "Juros Simples = Capital * Taxa * Tempo. J = 2000 * 0.10 * 3 = 600. Montante = Capital + Juros = 2000 + 600 = 2600."
  },
  {
    id: "q3",
    category: QuizCategory.NATUREZA,
    text: "Qual organela celular é responsável pela respiração aeróbica e produção de ATP nas células animais?",
    options: [
      "Cloroplasto",
      "Ribossomo",
      "Mitocôndria",
      "Complexo de Golgi",
      "Lisossomo"
    ],
    correctAnswer: 2,
    explanation: "A mitocôndria é conhecida como a 'usina de força' da célula, sendo o local onde ocorre o ciclo de Krebs e a cadeia respiratória."
  },
  {
    id: "q4",
    category: QuizCategory.LINGUAGENS,
    text: "No Realismo brasileiro, a obra 'Memórias Póstumas de Brás Cubas' de Machado de Assis é inovadora principalmente por:",
    options: [
      "Utilizar uma linguagem excessivamente rebuscada e barroca.",
      "Ter um narrador defunto que analisa a sociedade de forma irônica.",
      "Focar no herói romântico idealizado e perfeito.",
      "Narrar a história de forma linear e cronológica estrita.",
      "Ignorar as críticas sociais e políticas da época."
    ],
    correctAnswer: 1,
    explanation: "A inovação de Machado de Assis nesta obra reside no uso do 'defunto autor' e no tom irônico e pessimista que rompeu com o Romantismo."
  },
  // Adicionando mais 46 questões simuladas para completar as 50...
  ...Array.from({ length: 46 }, (_, i) => ({
    id: `auto-q-${i}`,
    category: [QuizCategory.HUMANAS, QuizCategory.NATUREZA, QuizCategory.LINGUAGENS, QuizCategory.MATEMATICA][i % 4],
    text: `Questão Simulação ENEM #${i + 5}: Analise o impacto do fenômeno ${['El Niño', 'Capitalismo Periférico', 'Barroco Mineiro', 'Teorema de Pitágoras'][i % 4]} na sociedade contemporânea.`,
    options: [
      "Opção A com detalhamento técnico.",
      "Opção B com viés sociológico.",
      "Opção C que representa a resposta correta.",
      "Opção D como distrator comum.",
      "Opção E com análise interdisciplinar."
    ],
    correctAnswer: 2,
    explanation: "Explicação gerada automaticamente para fins de simulação de banco de dados."
  }))
];
