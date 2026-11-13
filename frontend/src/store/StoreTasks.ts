import { defineStore } from 'pinia'
import { reactive, inject } from 'vue'
import { getJson, postJson, putJson, patchJson, deleteJson } from '@/service/restJson'
import { StoreSession } from '@/store/StoreSession'
import type { DailyTasks, Task } from '@/type/model/task'
import type { Deadline } from '@/type/model/deadline'

interface Config {
  restPaths: {
    tasks: string
    groupedTasks: string
    overview: string
  }
}

export const StoreTasks = defineStore('tasks', () => {
  const config = inject<Config>('config')
  if (!config) throw new Error('Config not provided')

  const restPaths = config.restPaths
  const storeSession = StoreSession()
  const session = storeSession.session

  const tasks = reactive<Task[]>([])
  const groupedTasks = reactive<DailyTasks[]>([])
  const overview = reactive<Deadline[]>([])

  /**
   * Resets the tasks state by clearing all existing tasks.
   *
   * @remarks
   * This function removes all elements from the `tasks` array, effectively
   * resetting its state to an empty array.
   */
  const resetTasks = () => {
    tasks.splice(0, tasks.length)
  }

  /**
   * Resets the grouped tasks state by clearing all existing tasks.
   *
   * @remarks
   * This function removes all elements from the `groupedTasks` array, effectively
   * resetting its state to an empty array.
   */
  const resetGroupedTasks = () => {
    groupedTasks.splice(0, groupedTasks.length)
  }

  /**
   * Resets the overview state by clearing all existing deadlines.
   *
   * @remarks
   * This function removes all elements from the `overview` array, effectively
   * resetting its state to an empty array.
   */
  const resetOverview = () => {
    overview.splice(0, overview.length)
  }

  /**
   * Fetches tasks from the server within an optional date range.
   *
   * @param start - The optional start date for filtering tasks.
   * @param end - The optional end date for filtering tasks.
   * @returns A promise that resolves to true if the tasks were successfully fetched and updated, otherwise false.
   *
   * @remarks
   * This function constructs a URL based on the provided date range and
   * makes a GET request to retrieve tasks. If the request is successful
   * and valid data is returned, the tasks state is reset and updated.
   */
  const fetchTasks = async (start?: string, end?: string): Promise<boolean> => {
    if (!session.id) return false

    let url = `${restPaths.tasks}`
    if (start && end) {
      url += `?start=${start}&end=${end}`
    }

    const res = await getJson(url, session)
    if (res.status < 300 && Array.isArray(res.data)) {
      resetTasks()
      tasks.push(...res.data)
      return true
    }

    resetTasks()
    return false
  }

  /**
   * Fetches the overview of tasks from the server.
   *
   * Resets the task store if the request was successful and valid data was returned.
   * The returned array of deadlines is sorted by due date.
   *
   * @returns a promise that resolves to true if the tasks were successfully fetched and updated, otherwise false.
   */
  const fetchOverview = async (): Promise<boolean> => {
    if (!session.id) return false

    let url = `${restPaths.overview}`
    const res = await getJson(url, session)
    if (res.status < 300 && Array.isArray(res.data)) {
      resetOverview()

      // Sort by date
      const deadlines = res.data.sort(
        (a: Deadline, b: Deadline) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime(),
      )

      overview.push(...deadlines)
      return true
    }

    resetOverview()
    return false
  }

  /**
   * Fetches grouped tasks from the server within an optional date range.
   *
   * @param start - The optional start date for filtering tasks.
   * @param end - The optional end date for filtering tasks.
   * @returns A promise that resolves to true if the tasks were successfully fetched and updated, otherwise false.
   *
   * @remarks
   * This function constructs a URL based on the provided date range and
   * makes a GET request to retrieve grouped tasks. If the request is
   * successful and valid data is returned, the grouped tasks state is
   * reset and updated.
   */
  const fetchGroupedTasks = async (start?: string, end?: string): Promise<boolean> => {
    if (!session.id) return false

    let url = `${restPaths.groupedTasks}`
    if (start && end) url += `?start=${start}&end=${end}`

    const res = await getJson(url, session)
    if (res.status < 300 && res.data && typeof res.data === 'object') {
      resetGroupedTasks()
      groupedTasks.push(...res.data)
      return true
    }

    resetGroupedTasks()
    return false
  }

  /**
   * Retrieves a task by id
   *
   * @param taskId The id of the task to be retrieved
   * @returns The task with the given id, or null if not found
   */
  const getTaskById = async (taskId: string): Promise<Task | null> => {
    const res = await getJson(`${restPaths.tasks}/${taskId}`, session)
    if (res.status < 300) {
      return res.data
    }
    return null
  }

  /**
   * Creates a new task
   *
   * @param task The task to be created
   * @returns true if the task was successfully created, false otherwise
   */
  const createTask = async (task: Task): Promise<boolean> => {
    const res = await postJson(`${restPaths.tasks}`, task, session)
    return res.status < 300
  }

  /**
   * Updates all fields of an existing task
   *
   * @param taskId The id of the task to be updated
   * @param task The new task
   * @returns true if the task was successfully updated, false otherwise
   */
  const updateTask = async (taskId: string, task: Task): Promise<boolean> => {
    const res = await putJson(`${restPaths.tasks}/${taskId}`, task, session)
    return res.status < 300
  }

  /**
   * Partially update a task by Id
   *
   * @param taskId The id of the task to be updated
   * @param partialTask The partial task object with the fields to be updated
   * @returns true if the update was successful, false otherwise
   */
  const patchTask = async (taskId: string, partialTask: Partial<Task>): Promise<boolean> => {
    const res = await patchJson(`${restPaths.tasks}/${taskId}`, partialTask, session)
    return res.status < 300
  }

  /**
   * Delete a task by Id
   *
   * @param taskId The id of the task to be deleted
   * @returns true if the task was successfully deleted, false otherwise
   */
  const deleteTask = async (taskId: string): Promise<boolean> => {
    const res = await deleteJson(`${restPaths.tasks}/${taskId}`, session)
    return res.status < 300
  }

  return {
    tasks,
    groupedTasks,
    overview,

    fetchTasks,
    fetchOverview,
    fetchGroupedTasks,
    createTask,
    updateTask,
    patchTask,
    deleteTask,
    getTaskById,

    resetTasks,
  }
})
