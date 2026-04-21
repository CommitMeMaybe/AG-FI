class RateLimiter {
  constructor(maxRequests = 10, windowMs = 60000) {
    this.maxRequests = maxRequests
    this.windowMs = windowMs
    this.requests = []
  }

  isAllowed() {
    const now = Date.now()
    this.requests = this.requests.filter(t => now - t < this.windowMs)

    if (this.requests.length >= this.maxRequests) {
      return { allowed: false, remaining: 0, resetAt: this.requests[0] + this.windowMs }
    }

    this.requests.push(now)
    return {
      allowed: true,
      remaining: this.maxRequests - this.requests.length,
      resetAt: now + this.windowMs
    }
  }

  reset() {
    this.requests = []
  }

  getTimeUntilNextRequest() {
    if (this.requests.length === 0) return 0
    const oldest = Math.min(...this.requests)
    const waitTime = oldest + this.windowMs - Date.now()
    return Math.max(0, waitTime)
  }
}

export const apiRateLimiter = new RateLimiter(10, 60000)
