import axios from 'axios'
// import { Authenticate } from './oauth2'

export const RELOGIN_MSG = 'RELOGIN_NEEDED'

// export const createMoodAPIAxios = (authenticator: Authenticate) => {
export const createMoodAPIAxios = () => {
  const moodAPIAxios = axios.create({
    baseURL: process.env.VITE_MOOD_API_URL ?? '/api',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      'Access-Control-Request-Method': 'GET, PUT, POST, DELETE, PATCH'
    }
  })

  moodAPIAxios.interceptors.response.use(
    (response) => response,
    async (error) => {
      // FIXME : Use it instead of all the try catch in DependencyInjection.
      // If error is 401, try to relogin & redo request
      // if (error.response?.status === 401 || error.code === "ERR_NETWORK") {
      //   try {
      //     await authenticator.login()
      //     return moodAPIAxios.request(error.config)
      //   } catch (loginError) {
      //     return Promise.reject(loginError)
      //   }
      // }

      let msg = error.response?.data.detail ?? error.message ?? 'APIError'

      // FIXME: To be corrected on API side, the case when a tenant is invalid in the header should not return a 401
      const detail = error.response?.data.detail
      const statusCode = error.response?.status
      if (statusCode === 401 && detail) {
        msg += `\nDetail : ${detail}`
        return Promise.reject(new Error(detail))
      }

      // If error is 401, throw error message with special code
      if (statusCode === 401 || !error.response) {
        return Promise.reject(new Error(RELOGIN_MSG))
      }

      const correlationId = error.response?.data.correlation_id
      if (correlationId) {
        msg += `\nError ID : ${correlationId}`
      }
      return Promise.reject(new Error(msg))
    }
  )

  return moodAPIAxios
}

export default { createMoodAPIAxios }
