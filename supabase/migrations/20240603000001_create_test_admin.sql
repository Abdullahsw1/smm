-- Create a test admin user if it doesn't exist
DO $$
DECLARE
  test_user_id UUID;
  admin_role_id UUID;
BEGIN
  -- Get or create admin role
  SELECT id INTO admin_role_id FROM admin_roles WHERE name = 'Super Admin' LIMIT 1;
  
  IF admin_role_id IS NULL THEN
    INSERT INTO admin_roles (name, permissions)
    VALUES ('Super Admin', '{"users":{"view":true,"create":true,"update":true,"delete":true},"orders":{"view":true,"create":true,"update":true,"delete":true},"services":{"view":true,"create":true,"update":true,"delete":true},"settings":{"view":true,"update":true}}'::jsonb)
    RETURNING id INTO admin_role_id;
  END IF;
  
  -- Check if test admin exists in auth.users
  SELECT id INTO test_user_id FROM auth.users WHERE email = 'admin@example.com' LIMIT 1;
  
  -- Create test admin if it doesn't exist
  IF test_user_id IS NULL THEN
    -- Create user in auth.users with service role client
    test_user_id := gen_random_uuid();
    
    -- Insert directly into auth.users
    INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, role, created_at, updated_at)
    VALUES (
      test_user_id,
      'admin@example.com',
      crypt('admin123', gen_salt('bf')),
      NOW(),
      'authenticated',
      NOW(),
      NOW()
    );
    
    -- Create user record in public.users
    INSERT INTO public.users (id, email, full_name, role)
    VALUES (test_user_id, 'admin@example.com', 'Admin User', 'admin');
    
    -- Create admin user record
    INSERT INTO admin_users (user_id, role_id, two_factor_enabled)
    VALUES (test_user_id, admin_role_id, false);
  ELSE
    -- Check if user exists in public.users
    IF NOT EXISTS (SELECT 1 FROM public.users WHERE id = test_user_id) THEN
      INSERT INTO public.users (id, email, full_name, role)
      VALUES (test_user_id, 'admin@example.com', 'Admin User', 'admin');
    END IF;
    
    -- Check if user exists in admin_users
    IF NOT EXISTS (SELECT 1 FROM admin_users WHERE user_id = test_user_id) THEN
      INSERT INTO admin_users (user_id, role_id, two_factor_enabled)
      VALUES (test_user_id, admin_role_id, false);
    END IF;
  END IF;
  
  -- Output message
  RAISE NOTICE 'Admin user created or verified: admin@example.com with password admin123';
END
$$;