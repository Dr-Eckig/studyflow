export interface ExamWithTasks {
  title: string;
  description: string;
  dueDate: Date;
  completedTaskNames: string[];
  openTaskNames: string[];
  donePercent: number;
}

/**
 * Normalizes an ExamWithTasks object by ensuring that `completedTaskNames`
 * and `openTaskNames` are initialized as empty arrays if they are undefined or null.
 *
 * @param exam - The exam object that may have undefined or null task name arrays.
 * @returns A new ExamWithTasks object with guaranteed non-null `completedTaskNames`
 *          and `openTaskNames` arrays.
 */
export function normalizeExamWithTasks(exam: ExamWithTasks): ExamWithTasks {
  return {
    ...exam,
    completedTaskNames: exam.completedTaskNames ?? [],
    openTaskNames: exam.openTaskNames ?? [],
  };
}