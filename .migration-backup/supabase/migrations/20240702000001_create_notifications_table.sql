-- Create notifications table
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

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS notifications_user_id_idx ON notifications(userId);
CREATE INDEX IF NOT EXISTS notifications_is_read_idx ON notifications(isRead);

-- Enable row level security
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to see only their own notifications
DROP POLICY IF EXISTS "Users can view their own notifications";
CREATE POLICY "Users can view their own notifications"
  ON notifications FOR SELECT
  USING (auth.uid()::text = userId);

-- Create policy to allow users to update only their own notifications
DROP POLICY IF EXISTS "Users can update their own notifications";
CREATE POLICY "Users can update their own notifications"
  ON notifications FOR UPDATE
  USING (auth.uid()::text = userId);

-- Create policy to allow users to delete their own notifications
DROP POLICY IF EXISTS "Users can delete their own notifications";
CREATE POLICY "Users can delete their own notifications"
  ON notifications FOR DELETE
  USING (auth.uid()::text = userId);

-- Create policy to allow system to insert notifications
DROP POLICY IF EXISTS "System can insert notifications";
CREATE POLICY "System can insert notifications"
  ON notifications FOR INSERT
  WITH CHECK (true);

-- Enable realtime subscriptions
alter publication supabase_realtime add table notifications;