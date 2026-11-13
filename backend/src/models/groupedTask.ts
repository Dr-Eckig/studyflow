interface Category {
  examId: string;
  title: string;
  color: string;
}

interface ExamTask {
  title: string;
  completed: boolean;
  taskId: string;
  category: Category;
}

export interface GroupedTask {
  date: string;
  tasks: ExamTask[];
}
