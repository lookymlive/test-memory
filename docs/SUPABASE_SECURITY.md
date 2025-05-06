# Supabase Security Best Practices

## Security Warnings Fixed

The following security warnings were addressed in our Supabase project:

### 1. Function Search Path Mutable

**Issue:** Functions `handle_new_user`, `update_user_record`, and `update_competition_ranks` had role mutable search paths, which could lead to potential SQL injection vulnerabilities through search path manipulation.

**Fix:** Added `SET search_path = 'public'` to all three functions to prevent search path manipulation attacks. This ensures the functions only use objects from the public schema.

```sql
CREATE OR REPLACE FUNCTION public.function_name()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
-- Function body
$$;
```

### 2. Leaked Password Protection

**Issue:** Leaked password protection was disabled, which could allow users to use passwords that have been exposed in data breaches.

**Fix:** Enabled leaked password protection in the Supabase Dashboard:

1. Navigate to Project Settings > Auth > Security
2. Enable "Leaked Password Protection"

This uses the HaveIBeenPwned.org API to check if passwords have been exposed in known data breaches.

### 3. Insufficient MFA Options

**Issue:** Too few multi-factor authentication (MFA) options were enabled, weakening account security.

**Fix:** Enabled MFA in the Supabase Dashboard:

1. Navigate to Project Settings > Auth > Security
2. Enable TOTP/authenticator app as an MFA option

## Additional Security Recommendations

1. **Always Use Environment Variables for Credentials**
   - Never expose API keys, connection strings, or other secrets in your code or documentation
   - Store secrets in `.env.local` files which are gitignored

2. **Enable Row Level Security (RLS)**
   - Ensure all tables in the public schema have RLS enabled
   - Create appropriate policies to restrict access to data

3. **Set Strong Password Requirements**
   - Minimum 8 characters
   - Require a mix of uppercase, lowercase, numbers, and symbols

4. **Implement Rate Limiting**
   - Consider implementing rate limiting to prevent brute force attacks

5. **Regular Security Audits**
   - Periodically review Supabase security settings
   - Check for new security features in Supabase update
