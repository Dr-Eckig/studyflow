import { defineStore } from 'pinia'
import { reactive, inject, computed } from 'vue'
import { getJson, postJson, putJson, patchJson, deleteJson } from '@/service/restJson'
import { StoreSession } from '@/store/StoreSession'
import type { Category, Exam, LegendItem, TagColor } from '@/type/model/exam'
import { getIcon } from '@/util/calendar/calendar'
import { isPast } from '@/util/date'

interface Config {
  restPaths: {
    exams: string
  }
  default: {
    exam: {
      id: null
      userId: null
      title: ''
      date: null
      color: ''
    }
  }
}

export const StoreExams = defineStore('exams', () => {
  const config = inject<Config>('config')
  if (!config) throw new Error('Config not provided')

  const restPaths = config.restPaths
  const storeSession = StoreSession()
  const session = storeSession.session

  const exams = reactive<Exam[]>([])

  // dynamically loaded categories depending on exams
  const categories = computed<Category[]>(() => {
    const map = new Map<string, Category>()

    exams.forEach((exam) => {
      const examDate = new Date(exam.deadline!)
      if (!isPast(examDate)) {
        const key = `${exam.title}-${exam.tagColor}`
        if (!map.has(key)) {
          map.set(key, {
            examId: exam.id!,
            title: exam.title,
            color: exam.tagColor,
            icon: getIcon(exam.tagColor),
            date: new Date(exam.deadline ?? ''),
          })
        }
      }
    })

    return Array.from(map.values())
  })

  /**
   * Clears all exams from the store.
   */
  const resetExams = () => {
    exams.splice(0, exams.length)
  }

  /**
   * Fetches exams from the server within an optional date range.
   *
   * @param start - The optional start date for filtering exams.
   * @param end - The optional end date for filtering exams.
   * @returns A promise that resolves to true if the exams were successfully fetched and updated, otherwise false.
   *
   * @remarks
   * This function constructs a URL based on the provided date range and
   * makes a GET request to retrieve exams. If the request is successful
   * and valid data is returned, the exams state is reset and updated.
   */
  const fetchExams = async (start?: string, end?: string): Promise<boolean> => {
    if (!session.id) return false

    let url = `${restPaths.exams}`
    if (start && end) {
      url += `?start=${start}&end=${end}`
    }

    const res = await getJson(url, session)
    if (res.status < 300 && Array.isArray(res.data)) {
      resetExams()
      exams.push(...res.data)
      return true
    }

    resetExams()
    return false
  }

  /**
   * Creates a new exam with the given attributes.
   * @param exam the attributes of the exam to be created
   * @returns true if the exam was created successfully, false otherwise
   */
  const createExam = async (exam: Exam): Promise<boolean> => {
    const res = await postJson(`${restPaths.exams}`, exam, session)
    return res.status < 300
  }

  /**
   * Updates an existing exam with the given attributes.
   * @param examId The id of the exam to be updated
   * @param exam The attributes of the exam to be updated
   * @returns true if the exam was updated successfully, false otherwise
   */
  const updateExam = async (examId: string, exam: Exam): Promise<boolean> => {
    const res = await putJson(`${restPaths.exams}/${examId}`, exam, session)
    return res.status < 300
  }

  /**
   * Updates an existing exam with the given attributes. Only attributes
   * provided in partialExam are updated.
   * @param examId The id of the exam to be updated
   * @param partialExam The attributes of the exam to be updated
   * @returns true if the exam was updated successfully, false otherwise
   */
  const patchExam = async (examId: string, partialExam: Partial<Exam>): Promise<boolean> => {
    const res = await patchJson(`${restPaths.exams}/${examId}`, partialExam, session)
    return res.status < 300
  }

  /**
   * Deletes an existing exam with the given id.
   * @param examId The id of the exam to be deleted
   * @returns true if the exam was deleted successfully, false otherwise
   */
  const deleteExam = async (examId: string): Promise<boolean> => {
    const res = await deleteJson(`${restPaths.exams}/${examId}`, session)
    return res.status < 300
  }

  /**
   * Creates a legend with all colors and corresponding titles.
   * Each entry in the returned array has a color and a list of titles.
   * The returned array is sorted by color.
   * @returns A legend with all colors and corresponding titles
   */
  const fetchLegendItems = (): LegendItem[] => {
    const map = new Map<TagColor, string[]>()

    for (const exam of exams) {
      if (!map.has(exam.tagColor)) {
        map.set(exam.tagColor, [])
      }
      map.get(exam.tagColor)!.push(exam.title)
    }

    return Array.from(map.entries()).map(([color, titles]) => ({
      color,
      titles,
    }))
  }

  return {
    exams,
    categories,

    fetchExams,
    createExam,
    updateExam,
    patchExam,
    deleteExam,

    resetExams,
    fetchLegendItems,
  }
})
