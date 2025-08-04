const EXTERNAL_API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"

interface ProxyRequestOptions {
  method: string
  headers?: Record<string, string>
  body?: any
}

interface ProxyResponse {
  data: any
  status: number
}

export async function proxyRequest(endpoint: string, options: ProxyRequestOptions): Promise<ProxyResponse> {
  try {
    const url = `${EXTERNAL_API_URL}${endpoint}`

    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...options.headers,
    }

    const fetchOptions: RequestInit = {
      method: options.method,
      headers,
    }

    if (options.body && options.method !== "GET") {
      fetchOptions.body = JSON.stringify(options.body)
    }

    console.log(`🔄 Proxying ${options.method} ${url}`)

    const response = await fetch(url, fetchOptions)
    const data = await response.json().catch(() => ({}))

    return {
      data,
      status: response.status,
    }
  } catch (error) {
    console.error("🔥 Proxy request failed:", error)
    return {
      data: { error: "Proxy request failed" },
      status: 500,
    }
  }
}
