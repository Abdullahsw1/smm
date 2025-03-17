-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  balance DECIMAL(10, 2) DEFAULT 0.00
);

-- Create providers table
CREATE TABLE IF NOT EXISTS providers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  api_url TEXT NOT NULL,
  api_key TEXT NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create services table
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  min_quantity INTEGER NOT NULL,
  max_quantity INTEGER NOT NULL,
  provider_id UUID REFERENCES providers(id),
  provider_service_id TEXT NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  service_id UUID REFERENCES services(id),
  quantity INTEGER NOT NULL,
  link TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'canceled', 'failed')),
  start_count INTEGER,
  current_count INTEGER,
  remains INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  provider_order_id TEXT
);

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  type TEXT NOT NULL CHECK (type IN ('deposit', 'order', 'refund')),
  amount DECIMAL(10, 2) NOT NULL,
  details TEXT,
  status TEXT DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  order_id UUID REFERENCES orders(id)
);

-- Create admin_roles table
CREATE TABLE IF NOT EXISTS admin_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  permissions JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) UNIQUE,
  role_id UUID REFERENCES admin_roles(id),
  two_factor_enabled BOOLEAN DEFAULT false,
  two_factor_secret TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable realtime for all tables
DO $$
BEGIN
  -- Check if publication exists
  IF EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
    -- Check if tables are already in the publication before adding them
    IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'users') THEN
      EXECUTE 'ALTER PUBLICATION supabase_realtime ADD TABLE users';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'providers') THEN
      EXECUTE 'ALTER PUBLICATION supabase_realtime ADD TABLE providers';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'services') THEN
      EXECUTE 'ALTER PUBLICATION supabase_realtime ADD TABLE services';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'orders') THEN
      EXECUTE 'ALTER PUBLICATION supabase_realtime ADD TABLE orders';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'transactions') THEN
      EXECUTE 'ALTER PUBLICATION supabase_realtime ADD TABLE transactions';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'admin_roles') THEN
      EXECUTE 'ALTER PUBLICATION supabase_realtime ADD TABLE admin_roles';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'admin_users') THEN
      EXECUTE 'ALTER PUBLICATION supabase_realtime ADD TABLE admin_users';
    END IF;
  END IF;
END
$$;

-- Create default admin roles
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM admin_roles WHERE name = 'Super Admin') THEN
    INSERT INTO admin_roles (name, permissions) VALUES
    ('Super Admin', '{"users": {"read": true, "create": true, "update": true, "delete": true}, "orders": {"read": true, "create": true, "update": true, "delete": true}, "services": {"read": true, "create": true, "update": true, "delete": true}, "providers": {"read": true, "create": true, "update": true, "delete": true}, "transactions": {"read": true, "create": true, "update": true, "delete": true}, "admin_roles": {"read": true, "create": true, "update": true, "delete": true}, "admin_users": {"read": true, "create": true, "update": true, "delete": true}}');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM admin_roles WHERE name = 'Service Manager') THEN
    INSERT INTO admin_roles (name, permissions) VALUES
    ('Service Manager', '{"users": {"read": true, "create": false, "update": false, "delete": false}, "orders": {"read": true, "create": true, "update": true, "delete": false}, "services": {"read": true, "create": true, "update": true, "delete": true}, "providers": {"read": true, "create": true, "update": true, "delete": false}, "transactions": {"read": true, "create": false, "update": false, "delete": false}, "admin_roles": {"read": false, "create": false, "update": false, "delete": false}, "admin_users": {"read": false, "create": false, "update": false, "delete": false}}');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM admin_roles WHERE name = 'User Manager') THEN
    INSERT INTO admin_roles (name, permissions) VALUES
    ('User Manager', '{"users": {"read": true, "create": true, "update": true, "delete": false}, "orders": {"read": true, "create": false, "update": false, "delete": false}, "services": {"read": true, "create": false, "update": false, "delete": false}, "providers": {"read": false, "create": false, "update": false, "delete": false}, "transactions": {"read": true, "create": true, "update": false, "delete": false}, "admin_roles": {"read": false, "create": false, "update": false, "delete": false}, "admin_users": {"read": false, "create": false, "update": false, "delete": false}}');
  END IF;
END
$$;