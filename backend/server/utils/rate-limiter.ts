import consola from 'consola'

interface RateLimitConfig {
  windowSeconds: number
  maxRequests: number
  keyPrefix?: string
}

interface RateLimitData {
  count: number
  resetTime: number
  windowStart: number
}

/**
 * Check rate limit for a given identifier using NuxtHub KV storage
 * @param identifier - Unique identifier (usually IP address)
 * @param config - Rate limit configuration
 * @returns Rate limit status and metadata
 */
export async function checkRateLimit(identifier: string, config: RateLimitConfig): Promise<{
  allowed: boolean
  remaining: number
  resetTime: number
  retryAfter: number
}> {
  const { windowSeconds, maxRequests, keyPrefix = 'rate_limit' } = config
  const now = Math.floor(Date.now() / 1000)
  const windowStart = Math.floor(now / windowSeconds) * windowSeconds

  const rateLimitKey = `${keyPrefix}:${identifier}:${windowStart}`

  try {
    const existing = await hubKV().get<RateLimitData>(rateLimitKey)

    if (!existing) {
      // First request in this window
      await hubKV().set(rateLimitKey, {
        count: 1,
        resetTime: windowStart + windowSeconds,
        windowStart,
      }, { ttl: windowSeconds + 60 }) // TTL slightly longer than window for cleanup

      return {
        allowed: true,
        remaining: maxRequests - 1,
        resetTime: windowStart + windowSeconds,
        retryAfter: 0,
      }
    }

    if (existing.count >= maxRequests) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: existing.resetTime,
        retryAfter: Math.max(existing.resetTime - now, 0),
      }
    }

    // Increment counter
    const newCount = existing.count + 1
    await hubKV().set(rateLimitKey, {
      ...existing,
      count: newCount,
    }, { ttl: windowSeconds + 60 })

    return {
      allowed: true,
      remaining: maxRequests - newCount,
      resetTime: existing.resetTime,
      retryAfter: 0,
    }
  }
  catch (error) {
    consola.error('Rate limit check failed:', error)
    // Fail open - allow request if KV is unavailable
    return {
      allowed: true,
      remaining: maxRequests - 1,
      resetTime: now + windowSeconds,
      retryAfter: 0,
    }
  }
}
