import axios from 'axios';

interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginResponse {
  accessToken: string;
  pkUser: number;
}

interface User {
  pkUser: number;
  email: string;
  username: string;
  phone: string;
  roles: string[];
  person?: {
    firstName: string;
    lastName: string;
    emails?: any[];
    phones?: any[];
    addresses?: any[];
  };
  profile?: {
    id: number;
    name: string;
  };
}

class AuthService {
  private baseUrl: string;
  private apiUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost';
    const port = process.env.NEXT_PUBLIC_PORT || '3001';
    this.apiUrl = `${this.baseUrl}:${port}`;
  }

  async login(credentials: LoginCredentials): Promise<{ user: User; token: string }> {
    try {
      const response = await axios.post<LoginResponse>(`${this.apiUrl}/user/loginWithEmail`, credentials);
      const { accessToken, pkUser } = response.data;

      // Obtener datos completos del usuario
      const userResponse = await axios.get(`${this.apiUrl}/user/findOne/${pkUser}`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });

      return {
        user: userResponse.data,
        token: accessToken
      };
    } catch (error: any) {
      throw error;
    }
  }

  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    localStorage.removeItem('pkUser');
    sessionStorage.removeItem('access_token');
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('pkUser');
    delete axios.defaults.headers.common['Authorization'];
  }

  getToken(): string | null {
    return localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
  }

  getUser(): User | null {
    const userStr = localStorage.getItem('user') || sessionStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  setupAxiosInterceptors(): void {
    // Request interceptor para añadir token
    axios.interceptors.request.use(
      (config) => {
        const token = this.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor para manejar errores de autenticación
    axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          this.logout();
          window.location.href = '/';
        }
        return Promise.reject(error);
      }
    );
  }

  hasRole(role: string): boolean {
    const user = this.getUser();
    return user?.roles?.includes(role) || false;
  }

  hasAnyRole(roles: string[]): boolean {
    const user = this.getUser();
    return roles.some(role => user?.roles?.includes(role)) || false;
  }
}

export const authService = new AuthService();
export default authService;