export interface WeeklyStatistics {
  userId: string | null
  weeklyTasksCompleted: number | null
  weeklyTasks: number | null
}

export interface ExamStatistics {
  userId: string | null
  examTitle: string | null
  daysRemaining: number | null
  examDate: string | null
}

export interface StreakStatistics {
  userId: string | null
  currentStreak: number | null
}
