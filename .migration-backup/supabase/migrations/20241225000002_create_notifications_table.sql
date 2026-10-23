CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  userId TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL,
  relatedId TEXT,
  isRead BOOLEAN NOT NULL DEFAULT FALSE,
  channel TEXT NOT NULL,
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  scheduledFor TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS notifications_user_id_idx ON notifications(userId);
CREATE INDEX IF NOT EXISTS notifications_is_read_idx ON notifications(isRead);

alter publication supabase_realtime add table notifications;