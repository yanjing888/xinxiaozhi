export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  streaming?: boolean
}

export interface ChatSession {
  id: string
  title: string
  messages: ChatMessage[]
  conversationId?: string
  updatedAt: number
}

export interface DifyStreamEvent {
  event: string
  answer?: string
  conversation_id?: string
  message_id?: string
  task_id?: string
  status?: number
  code?: string
  message?: string
}
