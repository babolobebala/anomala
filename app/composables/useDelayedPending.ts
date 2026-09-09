export function useDelayedPending(
  isPending: () => boolean,
  delay = 120
) {
  const isVisible = ref(false)
  let timer: ReturnType<typeof setTimeout> | undefined

  watch(
    isPending,
    (pending) => {
      if (timer) {
        clearTimeout(timer)
        timer = undefined
      }

      if (!pending) {
        isVisible.value = false
        return
      }

      timer = setTimeout(() => {
        isVisible.value = true
        timer = undefined
      }, delay)
    },
    { immediate: true }
  )

  onScopeDispose(() => {
    if (timer) {
      clearTimeout(timer)
    }
  })

  return isVisible
}
