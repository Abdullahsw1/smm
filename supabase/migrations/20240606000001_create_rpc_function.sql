-- Create the get_users_with_stats RPC function
CREATE OR REPLACE FUNCTION get_users_with_stats()
RETURNS TABLE (
  id UUID,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  balance DECIMAL,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,
  order_count BIGINT,
  total_spent DECIMAL
) 
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    u.id,
    u.email,
    u.full_name,
    u.avatar_url,
    u.balance,
    u.created_at,
    u.updated_at,
    COUNT(o.id)::BIGINT AS order_count,
    COALESCE(SUM(o.price), 0)::DECIMAL AS total_spent
  FROM 
    users u
  LEFT JOIN 
    orders o ON u.id = o.user_id
  GROUP BY 
    u.id
  ORDER BY 
    u.created_at DESC;
END;
$$;