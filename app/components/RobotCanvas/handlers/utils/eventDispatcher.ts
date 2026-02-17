'use client'

export const dispatchActionComplete = (action: string) => {
  window.dispatchEvent(
    new CustomEvent('robot-action-complete', {
      detail: { action },
    })
  )
}
