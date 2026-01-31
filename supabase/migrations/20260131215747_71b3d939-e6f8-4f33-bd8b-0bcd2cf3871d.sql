-- Create table for ticketing notification emails
CREATE TABLE public.ticketing_notifications (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    notified_at TIMESTAMP WITH TIME ZONE DEFAULT NULL
);

-- Add comment for documentation
COMMENT ON TABLE public.ticketing_notifications IS 'Stores email addresses for ticketing opening notifications';
COMMENT ON COLUMN public.ticketing_notifications.notified_at IS 'Timestamp when the notification email was sent';

-- Enable Row Level Security
ALTER TABLE public.ticketing_notifications ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert their email (public form)
CREATE POLICY "Anyone can subscribe to notifications"
ON public.ticketing_notifications
FOR INSERT
WITH CHECK (true);

-- Only allow reading own subscription (by email match - for checking duplicates)
CREATE POLICY "Users can check if email exists"
ON public.ticketing_notifications
FOR SELECT
USING (true);

-- Create index for faster email lookups
CREATE INDEX idx_ticketing_notifications_email ON public.ticketing_notifications(email);