import { supabase } from '@/lib/supabase/client';

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  isRead: boolean;
  relatedToType?: string;
  relatedToId?: string;
  createdAt: string;
}

export const getConversation = async (userId1: string, userId2: string) => {
  try {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .or(`and(sender_id.eq.${userId1},receiver_id.eq.${userId2}),and(sender_id.eq.${userId2},receiver_id.eq.${userId1})`)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Get conversation error:', error);
      return { messages: [], error: error.message };
    }

    const messages = data.map(mapDatabaseMessageToModel);
    return { messages, error: null };
  } catch (error) {
    console.error('Get conversation error:', error);
    return { messages: [], error: 'Failed to get conversation' };
  }
};

export const getUserMessages = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Get user messages error:', error);
      return { messages: [], error: error.message };
    }

    const messages = data.map(mapDatabaseMessageToModel);
    return { messages, error: null };
  } catch (error) {
    console.error('Get user messages error:', error);
    return { messages: [], error: 'Failed to get user messages' };
  }
};

export const sendMessage = async (messageData: Omit<Message, 'id' | 'createdAt'>) => {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    const user = userData?.user;
    
    if (userError || !user) {
      return { message: null, error: userError?.message || 'User not authenticated' };
    }

    const dbMessageData = {
      sender_id: user.id,
      receiver_id: messageData.receiverId,
      content: messageData.content,
      is_read: false,
      related_to_type: messageData.relatedToType,
      related_to_id: messageData.relatedToId
    };

    const { data, error } = await supabase
      .from('messages')
      .insert(dbMessageData)
      .select()
      .single();

    if (error) {
      console.error('Send message error:', error);
      return { message: null, error: error.message };
    }

    const message = mapDatabaseMessageToModel(data);
    return { message, error: null };
  } catch (error) {
    console.error('Send message error:', error);
    return { message: null, error: 'Failed to send message' };
  }
};

export const markMessageAsRead = async (id: string) => {
  try {
    const { error } = await supabase
      .from('messages')
      .update({ is_read: true })
      .eq('id', id);

    if (error) {
      console.error('Mark message as read error:', error);
      return { success: false, error: error.message };
    }

    return { success: true, error: null };
  } catch (error) {
    console.error('Mark message as read error:', error);
    return { success: false, error: 'Failed to mark message as read' };
  }
};

export const markConversationAsRead = async (userId: string, otherUserId: string) => {
  try {
    const { error } = await supabase
      .from('messages')
      .update({ is_read: true })
      .eq('sender_id', otherUserId)
      .eq('receiver_id', userId)
      .eq('is_read', false);

    if (error) {
      console.error('Mark conversation as read error:', error);
      return { success: false, error: error.message };
    }

    return { success: true, error: null };
  } catch (error) {
    console.error('Mark conversation as read error:', error);
    return { success: false, error: 'Failed to mark conversation as read' };
  }
};

export const getUnreadCount = async (userId: string) => {
  try {
    const { count, error } = await supabase
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .eq('receiver_id', userId)
      .eq('is_read', false);

    if (error) {
      console.error('Get unread count error:', error);
      return { count: 0, error: error.message };
    }

    return { count: count || 0, error: null };
  } catch (error) {
    console.error('Get unread count error:', error);
    return { count: 0, error: 'Failed to get unread count' };
  }
};

export const subscribeToMessages = (userId: string, callback: (message: Message) => void) => {
  const subscription = supabase
    .channel('messages-channel')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `receiver_id=eq.${userId}`
      },
      (payload) => {
        const newMessage = mapDatabaseMessageToModel(payload.new);
        callback(newMessage);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(subscription);
  };
};

const mapDatabaseMessageToModel = (dbMessage: any): Message => {
  return {
    id: dbMessage.id,
    senderId: dbMessage.sender_id,
    receiverId: dbMessage.receiver_id,
    content: dbMessage.content,
    isRead: dbMessage.is_read,
    relatedToType: dbMessage.related_to_type,
    relatedToId: dbMessage.related_to_id,
    createdAt: dbMessage.created_at
  };
};
