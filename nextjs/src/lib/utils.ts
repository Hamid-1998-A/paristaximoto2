export function isNightRate(date?: Date): boolean {
  const now = date ?? new Date()
  const hour = now.getHours()
  const day = now.getDay()
  return hour >= 20 || hour < 7 || day === 0 || day === 6
}

export function animateCounter(el: HTMLElement, target: number, suffix = '') {
  let current = 0
  const increment = target / 60
  const timer = setInterval(() => {
    current += increment
    if (current >= target) {
      current = target
      clearInterval(timer)
    }
    el.textContent = Math.floor(current) + suffix
  }, 25)
}
