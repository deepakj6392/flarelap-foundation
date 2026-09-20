export interface QuestionItem {
  id: number;
  question: string;
  options: string[];
  answer: number;
  hint?: string;
}

export function shuffleQuestionOptions<T extends { options: string[]; answer: number }>(question: T): T {
  if (!question || !Array.isArray(question.options) || question.options.length < 2) {
    return question;
  }
  
  const originalAnswerIndex = typeof question.answer === "number" ? question.answer : parseInt(String(question.answer), 10) || 0;
  
  const indexedOptions = question.options.map((opt, idx) => ({
    text: opt,
    isCorrect: idx === originalAnswerIndex
  }));
  
  for (let i = indexedOptions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indexedOptions[i], indexedOptions[j]] = [indexedOptions[j], indexedOptions[i]];
  }
  
  const newOptions = indexedOptions.map(item => item.text);
  const newAnswerIndex = indexedOptions.findIndex(item => item.isCorrect);
  
  return {
    ...question,
    options: newOptions,
    answer: newAnswerIndex >= 0 ? newAnswerIndex : 0
  };
}

/**
 * Filter and format real database questions for a test.
 * NO static / fallback dummy questions are generated.
 * Returns only database uploaded questions.
 */
export function generateUniqueQuestions(
  courseName: string = "General",
  testName: string = "Mock Test 1",
  requiredCount: number = 20,
  dbQuestions: (Omit<QuestionItem, "id"> & { id?: number })[] = []
): QuestionItem[] {
  // Strictly return uploaded Database MCQs only
  if (!dbQuestions || dbQuestions.length === 0) {
    return [];
  }

  const selected: QuestionItem[] = [];
  const limit = Math.min(requiredCount, dbQuestions.length);

  for (let i = 0; i < limit; i++) {
    const q = dbQuestions[i];
    selected.push(
      shuffleQuestionOptions({
        id: q.id ?? (i + 1),
        question: q.question,
        options: q.options,
        answer: q.answer,
        hint: q.hint || ""
      })
    );
  }

  return selected;
}
