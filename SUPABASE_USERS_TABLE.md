# Creating a Users Table in Supabase

## When Do You Need a Custom Users Table?

You **don't need** a custom `users` table for basic authentication. Supabase has a built-in `auth.users` table.

Create a custom `users` table only if you want to store **additional profile data** like:
- Full name
- Phone number
- Profile picture URL
- Company information
- Custom preferences
- etc.

## Step-by-Step: Create Users Table

### Step 1: Open Supabase SQL Editor
1. Go to your Supabase project dashboard
2. Click on **SQL Editor** in the left sidebar
3. Click **New Query**

### Step 2: Create the Table
Run this SQL to create a `users` table that links to Supabase auth:

```sql
-- Create users table
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create policy: Users can read their own data
CREATE POLICY "Users can view own data"
  ON public.users
  FOR SELECT
  USING (auth.uid() = id);

-- Create policy: Users can update their own data
CREATE POLICY "Users can update own data"
  ON public.users
  FOR UPDATE
  USING (auth.uid() = id);

-- Create a function to automatically create a user profile when someone signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a trigger to call the function when a new user signs up
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### Step 3: Verify the Table
1. Go to **Table Editor** in Supabase dashboard
2. You should see the `users` table
3. The table will automatically populate when new users sign up

## Using the Users Table in Your Code

After creating the table, you can query it in your login page:

```javascript
// Query user profile data
const { data, error } = await supabase
  .from('users')
  .select('*')
  .eq('email', email)
  .single();
```

## Current Status

✅ **Current setup**: Authentication works without a custom table
- User data is available in `authData.user` after login
- No additional table needed for basic auth

📝 **If you need a custom table**: Follow the steps above to create one


