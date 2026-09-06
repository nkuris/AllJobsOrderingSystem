export interface LoginRequest { email: string; password: string }

export interface RegisterRequest { email: string; password: string; firstName: string; lastName: string; phone: string; address: string }

export interface AuthResponse { accessToken: string; userId: number; email: string; role: string; refreshToken: string }
