CREATE POLICY "Admins can view all subscribers"
ON public.ticketing_notifications
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));