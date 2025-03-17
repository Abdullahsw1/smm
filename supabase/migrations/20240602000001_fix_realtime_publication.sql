-- Fix realtime publication for admin tables by adding conditional checks
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'admin_roles'
  ) THEN
    alter publication supabase_realtime add table admin_roles;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'admin_users'
  ) THEN
    alter publication supabase_realtime add table admin_users;
  END IF;
END
$$;