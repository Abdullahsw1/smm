-- Create admin_roles table if it doesn't exist
CREATE TABLE IF NOT EXISTS admin_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  permissions JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create admin_users table if it doesn't exist
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role_id UUID NOT NULL REFERENCES admin_roles(id) ON DELETE CASCADE,
  two_factor_enabled BOOLEAN NOT NULL DEFAULT false,
  two_factor_secret TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Insert default admin role if it doesn't exist
INSERT INTO admin_roles (name, permissions)
SELECT 'Super Admin', '{"users":{"view":true,"create":true,"update":true,"delete":true},"orders":{"view":true,"create":true,"update":true,"delete":true},"services":{"view":true,"create":true,"update":true,"delete":true},"settings":{"view":true,"update":true}}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM admin_roles WHERE name = 'Super Admin');

-- Enable RLS on admin tables
ALTER TABLE admin_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Create policies for admin_roles
DROP POLICY IF EXISTS "Admin users can read roles" ON admin_roles;
CREATE POLICY "Admin users can read roles"
  ON admin_roles FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM admin_users
    WHERE admin_users.user_id = auth.uid()
  ));

-- Create policies for admin_users
DROP POLICY IF EXISTS "Admin users can read admin_users" ON admin_users;
CREATE POLICY "Admin users can read admin_users"
  ON admin_users FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM admin_users
    WHERE admin_users.user_id = auth.uid()
  ));

-- Enable realtime for admin tables
alter publication supabase_realtime add table admin_roles;
alter publication supabase_realtime add table admin_users;
