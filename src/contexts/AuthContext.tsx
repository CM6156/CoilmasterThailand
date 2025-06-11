'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'

// 사용자 타입 정의
type User = {
  id: string
  username: string
  email: string
  role: string
  name?: string
  avatar?: string
}

// 인증 컨텍스트 타입 정의
type AuthContextType = {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
  updateUser: (userData: Partial<User>) => void
}

// 기본 컨텍스트 생성
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// 인증 제공자 프롭스 타입 정의
type AuthProviderProps = {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // 페이지 로드 시 저장된 인증 정보 확인
  useEffect(() => {
    const loadUserFromStorage = () => {
      try {
        const storedUser = localStorage.getItem('user')
        if (storedUser) {
          setUser(JSON.parse(storedUser))
        }
      } catch (error) {
        console.error('Failed to parse stored user:', error)
        localStorage.removeItem('user')
      } finally {
        setIsLoading(false)
      }
    }
    
    // 클라이언트 사이드에서만 실행
    if (typeof window !== 'undefined') {
      loadUserFromStorage()
    } else {
      setIsLoading(false)
    }
  }, [])

  // 로그인 함수
  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    
    try {
      // 실제 API 호출 대신 더미 데이터 사용 (백엔드 연동 시 수정 필요)
      if (username === 'admin' && password === '123456') {
        const userData: User = {
          id: '1',
          username: 'admin',
          email: 'admin@system.com',
          role: 'admin',
          name: '관리자'
        }
        
        setUser(userData)
        if (typeof window !== 'undefined') {
          localStorage.setItem('user', JSON.stringify(userData))
        }
        setIsLoading(false)
        return true
      } else if (username === 'user' && password === '123456') {
        const userData: User = {
          id: '2',
          username: 'user',
          email: 'user@system.com',
          role: 'user',
          name: '일반 사용자'
        }
        
        setUser(userData)
        if (typeof window !== 'undefined') {
          localStorage.setItem('user', JSON.stringify(userData))
        }
        setIsLoading(false)
        return true
      }
      
      setIsLoading(false)
      return false
    } catch (error) {
      console.error('Login error:', error)
      setIsLoading(false)
      return false
    }
  }

  // 로그아웃 함수
  const logout = () => {
    setUser(null)
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user')
    }
    router.push('/login')
  }

  // 사용자 정보 업데이트 함수
  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData }
      setUser(updatedUser)
      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(updatedUser))
      }
    }
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: !!user, 
      isLoading, 
      login, 
      logout, 
      updateUser 
    }}>
      {children}
    </AuthContext.Provider>
  )
}

// 인증 컨텍스트 사용을 위한 훅
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 