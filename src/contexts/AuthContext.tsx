'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'

// 사용자 타입 정의
type User = {
  id: string
  username: string
  nickname?: string
  firstName?: string
  lastName?: string
  email: string
  role: string
  avatar?: string
  createdAt?: string
  lastLogin?: string
}

// 회원가입 데이터 타입
type RegisterData = {
  username: string
  nickname: string
  firstName?: string
  lastName?: string
  email: string
  password: string
}

// 인증 컨텍스트 타입 정의
type AuthContextType = {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
  register: (data: RegisterData) => Promise<boolean>
  updateUser: (userData: Partial<User>) => void
}

// 기본 컨텍스트 생성
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// 인증 제공자 프롭스 타입 정의
type AuthProviderProps = {
  children: ReactNode
}

// 더미 데이터베이스 - 실제 구현에서는 서버 API로 대체
const USERS_DB_KEY = 'thailand_transfer_users_db'

// 사용자 DB에서 사용자 목록 불러오기
const loadUsersFromDB = (): User[] => {
  if (typeof window === 'undefined') return []
  
  try {
    const usersJson = localStorage.getItem(USERS_DB_KEY)
    return usersJson ? JSON.parse(usersJson) : []
  } catch (error) {
    console.error('사용자 데이터 로드 오류:', error)
    return []
  }
}

// 사용자 DB에 사용자 목록 저장
const saveUsersToDB = (users: User[]): void => {
  if (typeof window === 'undefined') return
  localStorage.setItem(USERS_DB_KEY, JSON.stringify(users))
}

// 비밀번호 DB 키
const PASSWORDS_DB_KEY = 'thailand_transfer_passwords_db'

// 비밀번호 해시맵 불러오기
const loadPasswordsFromDB = (): Record<string, string> => {
  if (typeof window === 'undefined') return {}
  
  try {
    const passwordsJson = localStorage.getItem(PASSWORDS_DB_KEY)
    return passwordsJson ? JSON.parse(passwordsJson) : {}
  } catch (error) {
    console.error('비밀번호 데이터 로드 오류:', error)
    return {}
  }
}

// 비밀번호 해시맵 저장
const savePasswordsToDB = (passwords: Record<string, string>): void => {
  if (typeof window === 'undefined') return
  localStorage.setItem(PASSWORDS_DB_KEY, JSON.stringify(passwords))
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // 초기화: 기본 관리자 계정 생성
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const users = loadUsersFromDB()
      const passwords = loadPasswordsFromDB()
      
      // 관리자 계정이 없으면 생성
      if (!users.some(u => u.username === 'admin')) {
        const adminUser: User = {
          id: '1',
          username: 'admin',
          nickname: '관리자',
          email: 'admin@system.com',
          role: 'admin',
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString()
        }
        
        users.push(adminUser)
        saveUsersToDB(users)
        
        // 비밀번호 저장
        passwords['admin'] = '123456' // 실제 구현에서는 해싱 필요
        savePasswordsToDB(passwords)
      }
      
      // 일반 사용자 계정이 없으면 생성
      if (!users.some(u => u.username === 'user')) {
        const regularUser: User = {
          id: '2',
          username: 'user',
          nickname: '일반 사용자',
          email: 'user@system.com',
          role: 'user',
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString()
        }
        
        users.push(regularUser)
        saveUsersToDB(users)
        
        // 비밀번호 저장
        passwords['user'] = '123456' // 실제 구현에서는 해싱 필요
        savePasswordsToDB(passwords)
      }
    }
  }, [])

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
      // 사용자 DB에서 사용자 확인
      const users = loadUsersFromDB()
      const passwords = loadPasswordsFromDB()
      
      const userFound = users.find(u => u.username === username)
      
      if (userFound && passwords[username] === password) { // 실제 구현에서는 비밀번호 검증 로직 필요
        // 마지막 로그인 시간 업데이트
        const updatedUser = {
          ...userFound,
          lastLogin: new Date().toISOString()
        }
        
        // DB 업데이트
        const updatedUsers = users.map(u => u.username === username ? updatedUser : u)
        saveUsersToDB(updatedUsers)
        
        // 상태 업데이트
        setUser(updatedUser)
        if (typeof window !== 'undefined') {
          localStorage.setItem('user', JSON.stringify(updatedUser))
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

  // 회원가입 함수
  const register = async (data: RegisterData): Promise<boolean> => {
    setIsLoading(true)
    
    try {
      const users = loadUsersFromDB()
      const passwords = loadPasswordsFromDB()
      
      // 사용자 이름 중복 확인
      if (users.some(u => u.username === data.username)) {
        setIsLoading(false)
        return false
      }
      
      // 이메일 중복 확인
      if (users.some(u => u.email === data.email)) {
        setIsLoading(false)
        return false
      }
      
      // 새 사용자 생성
      const newUser: User = {
        id: (users.length + 1).toString(),
        username: data.username,
        nickname: data.nickname,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        role: 'user', // 기본 역할
        createdAt: new Date().toISOString()
      }
      
      // 사용자 추가
      users.push(newUser)
      saveUsersToDB(users)
      
      // 비밀번호 저장
      passwords[data.username] = data.password // 실제 구현에서는 해싱 필요
      savePasswordsToDB(passwords)
      
      setIsLoading(false)
      return true
    } catch (error) {
      console.error('Registration error:', error)
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
      // 업데이트된 사용자 정보 생성
      const updatedUser = { ...user, ...userData }
      
      // 로컬 상태 업데이트
      setUser(updatedUser)
      
      // 로컬 스토리지 업데이트
      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(updatedUser))
      }
      
      // DB 업데이트
      const users = loadUsersFromDB()
      const updatedUsers = users.map(u => u.id === user.id ? updatedUser : u)
      saveUsersToDB(updatedUsers)
    }
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: !!user, 
      isLoading, 
      login, 
      logout,
      register,
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