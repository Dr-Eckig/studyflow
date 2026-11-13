import type { Category } from './exam'

export interface Task {
  id?: string
  examId: string
  name: string
  completed?: boolean
  date: string
  color: string
  examTitle: string
  icon?: string
}

export interface ExamTask {
  taskId: string
  title: string
  completed: boolean
  category: Category
}

export interface DailyTasks {
  date: string
  tasks: ExamTask[]
}
