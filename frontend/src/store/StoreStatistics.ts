import { defineStore } from 'pinia'
import { reactive, inject } from 'vue'

import { StoreSession } from '@/store/StoreSession'
import { getJson } from '@/service/restJson'
import type { ExamStatistics, StreakStatistics, WeeklyStatistics } from '@/type/model/statistics'

interface Config {
  restPaths: {
    statistics: string
  }
  default: {
    weeklyStatistic: {
      userId: ''
      weeklyTasksCompleted: 0
      weeklyTasks: 0
    }
    examStatistic: {
      userId: ''
      examTitle: ''
      daysRemaining: 0
      examDate: null
    }
    streakStatistic: {
      userId: ''
      currentStreak: 0
    }
  }
}

export const StoreStatistics = defineStore('statistics', () => {
  const config = inject<Config>('config')
  if (!config) throw new Error('Config not provided')

  const restPaths = config.restPaths

  const storeSession = StoreSession()
  const session = storeSession.session

  // Reactive states for statistics
  const weeklyStats = reactive<WeeklyStatistics>({ ...config.default.weeklyStatistic })

  const examStats = reactive<ExamStatistics>({ ...config.default.examStatistic })

  const streakStats = reactive<StreakStatistics>({ ...config.default.streakStatistic })

  /**
   * Resets the weekly statistics state to its default state.
   * This function is used when the user logs out or when an error occurs while fetching the statistics.
   */
  const resetWeeklyStats = () => {
    Object.assign(weeklyStats, {
      userId: null,
      weeklyTasksCompleted: null,
      weeklyTasks: null,
    })
  }

  /**
   * Resets the exam statistics state to its default state.
   * This function is used when the user logs out or when an error occurs while fetching the statistics.
   */
  const resetExamStats = () => {
    Object.assign(examStats, {
      userId: null,
      examName: null,
      daysLeft: null,
      remainingTasks: null,
      openTasks: null,
      percentage: null,
    })
  }

  /**
   * Resets the streak statistics state to its default state.
   * This function is used when the user logs out or when an error occurs while fetching the statistics.
   */
  const resetStreakStats = () => {
    Object.assign(streakStats, {
      userId: null,
      days: null,
    })
  }

  /**
   * Fetches the weekly statistics for the current user.
   * If the fetch is successful, it updates the weekly statistics state.
   * If the fetch fails, it resets the weekly statistics state to its default state.
   * @returns true if the fetch was successful, false otherwise.
   */
  const fetchWeeklyStatistics = async (): Promise<boolean> => {
    if (!session.id) return false
    let url = `${restPaths.statistics}/weekly`

    const res = await getJson(url, session)
    if (res.status < 300 && res.data) {
      Object.assign(weeklyStats, res.data)
      return true
    }
    resetWeeklyStats()
    return false
  }

  /**
   * Fetches the exam statistics for the current user.
   * If the fetch is successful, it updates the exam statistics state.
   * If the fetch fails, it resets the exam statistics state to its default state.
   * @returns true if the fetch was successful, false otherwise.
   */
  const fetchExamStatistics = async (): Promise<boolean> => {
    if (!session.id) return false
    let url = `${restPaths.statistics}/exam-overview`

    const res = await getJson(url, session)
    if (res.status < 300 && res.data) {
      Object.assign(examStats, res.data)
      return true
    }
    resetExamStats()
    return false
  }

  /**
   * Fetches the streak statistics for the current user.
   * If the fetch is successful, it updates the streak statistics state.
   * If the fetch fails, it resets the streak statistics state to its default state.
   * @returns true if the fetch was successful, false otherwise.
   */
  const fetchStreakStatistics = async (): Promise<boolean> => {
    if (!session.id) return false
    let url = `${restPaths.statistics}/streak`

    const res = await getJson(url, session)
    if (res.status < 300 && res.data) {
      Object.assign(streakStats, res.data)
      return true
    }
    resetStreakStats()
    return false
  }

  return {
    weeklyStats,
    examStats,
    streakStats,

    fetchWeeklyStatistics,
    fetchExamStatistics,
    fetchStreakStatistics,

    resetWeeklyStats,
    resetExamStats,
    resetStreakStats,
  }
})
