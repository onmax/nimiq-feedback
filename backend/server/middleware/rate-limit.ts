import consola from 'consola'

const rateLimitPaths = [
  { method: 'POST', path: '/api/feedback' },
]

/**
 * Rate limiting middleware for Cloudflare deployment
 * Applies rate limiting only to POST requests to /api/feedback
 */
export default defineEventHandler(async (event) => {
  const path = event.path
  const method = event.method

  const rateLimitPath = rateLimitPaths.find(item => item.path === path && item.method === method)

  if (!rateLimitPath)
    return

  // Get client IP using Cloudflare headers with fallback
  const clientIP = getClientIP(event)

  if (!clientIP) {
    consola.warn('Unable to determine client IP for rate limiting')
    return // Skip rate limiting if we can't get IP
  }

  try {
    // Check rate limit
    const result = await checkRateLimit(clientIP, {
      windowSeconds: 300, // 5 minutes
      maxRequests: 5,
      keyPrefix: 'feedback_rate_limit',
    })

    // Set rate limit headers
    setHeader(event, 'X-RateLimit-Limit', '5')
    setHeader(event, 'X-RateLimit-Remaining', result.remaining.toString())
    setHeader(event, 'X-RateLimit-Reset', result.resetTime.toString())

    if (!result.allowed) {
      setHeader(event, 'Retry-After', result.retryAfter)
      throw createError({
        statusCode: 429,
        statusMessage: 'Too Many Requests',
        data: {
          success: false,
          message: `Rate limit exceeded. Please try again in ${result.retryAfter} seconds.`,
          retryAfter: result.resetTime,
        },
      })
    }
  }
  catch (error: any) {
    // If it's already a rate limit error, re-throw it
    if (error.statusCode === 429) {
      throw error
    }

    // Log other errors but don't block the request
    consola.error('Rate limiting error:', error)
    // Fail open - allow request if rate limiting fails
  }
})

/**
 * Get client IP address with Cloudflare support
 * Priority: CF-Connecting-IP > X-Real-IP > X-Forwarded-For > fallback
 */
function getClientIP(event: any): string | null {
  // Cloudflare CF-Connecting-IP header (most reliable for Cloudflare)
  const cfConnectingIP = getHeader(event, 'CF-Connecting-IP')
  if (cfConnectingIP) {
    return cfConnectingIP
  }

  // Use H3's built-in IP detection with X-Forwarded-For support
  const requestIP = getRequestIP(event, { xForwardedFor: true })
  if (requestIP) {
    return requestIP
  }

  // Fallback to other common headers
  const xRealIP = getHeader(event, 'X-Real-IP')
  if (xRealIP) {
    return xRealIP
  }

  // Last resort - try to get from event.node (Node.js specific)
  if (event.node?.req?.socket?.remoteAddress) {
    return event.node.req.socket.remoteAddress
  }

  return null
}
