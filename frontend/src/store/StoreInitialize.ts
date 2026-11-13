import { defineStore } from 'pinia'
import { ref } from 'vue'

export const StoreInitialize = defineStore('initialize', () => {
  const initializers: (() => Promise<void>)[] = []

  const isInitialized = ref(false)

  /**
   * Add an initializer to be executed when calling initialize.
   *
   * An initializer is a function that takes a single argument, a function to be called when the
   * initializer is done. The initializer is expected to call that function when it is done.
   *
   * The initializer is expected to return no value.
   *
   * @param {Function} p_initializer The initializer to add.
   */
  const addInitializer = (p_initializer: () => Promise<void>): void => {
    initializers.push(p_initializer)
  }

  /**
   * Initializes all registered initializers.
   *
   * @returns A promise that is resolved when all initializers are done.
   */
  const initialize = (): Promise<void> =>
    Promise.all(initializers.map((initializer) => initializer())).then(() => {
      isInitialized.value = true
    })

  return { addInitializer, initialize, isInitialized }
})
