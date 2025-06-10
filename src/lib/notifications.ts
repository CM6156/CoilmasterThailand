export async function sendLineNotify(message: string): Promise<boolean> {
  const token = process.env.LINE_NOTIFY_TOKEN
  
  if (!token || token === 'your_line_notify_token_here') {
    console.log('LINE 알림 (개발모드):', message)
    return true
  }

  try {
    const response = await fetch('https://notify-api.line.me/api/notify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Bearer ${token}`,
      },
      body: `message=${encodeURIComponent(message)}`,
    })

    return response.ok
  } catch (error) {
    console.error('LINE 알림 전송 실패:', error)
    return false
  }
}

export async function notifyNewRegistration(type: string, name: string, username?: string): Promise<void> {
  const message = username 
    ? `🆕 ${username}님이 새로운 ${type}를 등록했습니다: ${name}`
    : `🆕 새로운 ${type}가 등록되었습니다: ${name}`
  
  await sendLineNotify(message)
}

export async function notifyStatusChange(productName: string, status: string): Promise<void> {
  const message = `📦 제품 상태 변경: ${productName} → ${status}`
  await sendLineNotify(message)
} 