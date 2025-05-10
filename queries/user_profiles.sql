DROP FUNCTION IF EXISTS public.check_user_exists_by_id(text);

CREATE OR REPLACE FUNCTION public.check_user_exists_by_id(user_email text)
RETURNS boolean
SECURITY DEFINER
AS $$
DECLARE
  user_id uuid;
BEGIN
  SELECT id 
  INTO user_id
  FROM auth.users 
  WHERE LOWER(email) = LOWER(user_email);

  IF user_id IS NOT NULL THEN
    RETURN true;
  ELSE
    RETURN false;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Revoke and grant permissions as before
DO $$
DECLARE
    pg_role record;
BEGIN
  FOR pg_role IN SELECT rolname FROM pg_roles
  LOOP 
    EXECUTE 'REVOKE ALL ON FUNCTION public.check_user_exists_by_id(text) FROM ' || quote_ident(pg_role.rolname);
  END LOOP;
END;
$$;

GRANT EXECUTE ON FUNCTION public.check_user_exists_by_id(text) TO service_role;