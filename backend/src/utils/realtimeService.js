// Supabase realtime listeners
import { supabase } from '../db/supabaseClient.js'

export const listenToNotifications = (userId, callback) => {
  const subscription = supabase
    .from('notifications')
    .on('INSERT', (payload) => {
      if (payload.new.user_id === userId) {
        callback(payload.new)
      }
    })
    .subscribe()

  return () => subscription.unsubscribe()
}

export const listenToChatMessages = (roomId, callback) => {
  const subscription = supabase
    .from('chat_messages')
    .on('INSERT', (payload) => {
      if (payload.new.room_id === roomId) {
        callback(payload.new)
      }
    })
    .subscribe()

  return () => subscription.unsubscribe()
}

export const listenToAdoptionStatus = (adoptionId, callback) => {
  const subscription = supabase
    .from('adoptions')
    .on('UPDATE', (payload) => {
      if (payload.new.id === adoptionId) {
        callback(payload.new)
      }
    })
    .subscribe()

  return () => subscription.unsubscribe()
}

export const createNotification = async (userId, type, title, message, data = {}) => {
  const { error } = await supabase
    .from('notifications')
    .insert([
      {
        user_id: userId,
        type,
        title,
        message,
        data,
      },
    ])

  if (error) throw error
}
