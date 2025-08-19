import axios from 'axios'

interface LoginCredentials {
  email: string
  password: string
}

interface LoginResponse {
  accessToken: string
  pkUser: number
  roles: string[]
}

interface User {
  pkUser: number
  email: string
  username: string
  phone: string
  roles: string[]
  person?: {
    firstName: string
    lastName: string
    emails?: any[]
    phones?: any[]
    addresses?: any[]
  }
  profile?: {
    id: number
    name: string
  }
}

class AuthService {
  private baseUrl: string
  private apiUrl: string

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost'
    const port = process.env.NEXT_PUBLIC_PORT || '3000'
    this.apiUrl = `${this.baseUrl}:${port}`

    this.setupAxiosInterceptors()
  }

  async login(
    credentials: LoginCredentials
  ): Promise<{ user: User; token: string; roles: string[] }> {
    try {
      const response = await axios.post<LoginResponse>(
        `${this.apiUrl}/user/loginWithEmail`,
        credentials
      )
      const { accessToken, pkUser, roles } = response.data

      // Log roles to console
      console.log('User roles:', roles)

      // Obtener datos completos del usuario
      const userResponse = await axios.get(
        `${this.apiUrl}/user/findOne/${pkUser}`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      )

      localStorage.setItem('access_token', accessToken)
      localStorage.setItem('user', JSON.stringify(userResponse.data))
      localStorage.setItem('pkUser', pkUser.toString())
      localStorage.setItem('user_roles', JSON.stringify(roles))

      axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`

      return {
        user: userResponse.data,
        token: accessToken,
        roles,
      }
    } catch (error: any) {
      throw error
    }
  }

  logout(): void {
    localStorage.removeItem('access_token')
    localStorage.removeItem('user')
    localStorage.removeItem('pkUser')
    localStorage.removeItem('user_roles')
    sessionStorage.removeItem('access_token')
    sessionStorage.removeItem('user')
    sessionStorage.removeItem('pkUser')
    sessionStorage.removeItem('user_roles')
    delete axios.defaults.headers.common['Authorization']
  }

  getToken(): string | null {
    return (
      localStorage.getItem('access_token') ||
      sessionStorage.getItem('access_token')
    )
  }

  getUser(): User | null {
    const userStr =
      localStorage.getItem('user') || sessionStorage.getItem('user')
    return userStr ? JSON.parse(userStr) : null
  }

  getRoles(): string[] {
    const rolesStr =
      localStorage.getItem('user_roles') || sessionStorage.getItem('user_roles')
    return rolesStr ? JSON.parse(rolesStr) : []
  }

  isAuthenticated(): boolean {
    return !!this.getToken()
  }

  setupAxiosInterceptors(): void {
    // Request interceptor para añadir token
    axios.interceptors.request.use(
      (config) => {
        const token = this.getToken()
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => Promise.reject(error)
    )

    // Response interceptor para manejar errores de autenticación
    axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          this.logout()
          window.location.href = '/'
        }
        return Promise.reject(error)
      }
    )
  }

  hasRole(role: string): boolean {
    const roles = this.getRoles()
    return roles.includes(role)
  }

  hasAnyRole(roles: string[]): boolean {
    const userRoles = this.getRoles()
    return roles.some((role) => userRoles.includes(role))
  }
}

export const authService = new AuthService()
export default authService
