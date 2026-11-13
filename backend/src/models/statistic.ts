export interface WeeklyStatistics {
  userId: string;
  weeklyTasksCompleted: number;
  weeklyTasks: number;
}

export interface ExamStatistics {
  userId: string;
  examTitle: string;
  daysRemaining: number;
  examDate: Date;
}

export interface StreakStatistics {
  userId: string;
  currentStreak: number;
}
