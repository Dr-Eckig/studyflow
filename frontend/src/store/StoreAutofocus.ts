/**
 * @author    Wolfgang Kowarschick <kowa@hs-augsburg.de>
 * @copyright 2016-2025
 * @license   MIT
 */

import { defineStore } from 'pinia'
import { ref } from 'vue'

export const StoreAutofocus = defineStore(
  'autofocus',

  () => {
    /**
     * Sets focus on the HTML element with the ID stored in `c_autofocus_id`.
     * If the element is found, it will receive focus.
     */
    const c_autofocus_id = ref(),
      setFocus = () => document.getElementById(c_autofocus_id.value)?.focus(),
      setAutofocusId = (p_autofocus_id: string) => {
        c_autofocus_id.value = p_autofocus_id
        setFocus()
      }
    window.addEventListener('visibilitychange', setFocus)

    return { setAutofocusId, setFocus }
  },
)
