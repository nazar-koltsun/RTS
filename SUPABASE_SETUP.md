# Supabase Setup Guide

## Step-by-Step Instructions

### Step 1: Install Supabase Package
Run this command in your terminal:
```bash
npm install @supabase/supabase-js
```

### Step 2: Create Supabase Project
1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Sign up or log in
3. Create a new project
4. Wait for the project to be set up (takes a few minutes)

### Step 3: Get Your Supabase Credentials
1. In your Supabase project dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (under "Project URL")
   - **anon/public key** (under "Project API keys")

### Step 4: Create Environment Variables File
Create a file named `.env.local` in the root of your project with:
```
NEXT_PUBLIC_SUPABASE_URL=your-project-url-here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

Replace `your-project-url-here` and `your-anon-key-here` with the values you copied from Step 3.

### Step 5: Restart Your Development Server
After creating `.env.local`, restart your Next.js dev server:
```bash
npm run dev
```

## Usage

Import the Supabase client in your components:
```javascript
import { supabase } from '@/lib/supabase';
```

Example usage:
```javascript
// Fetch data
const { data, error } = await supabase
  .from('your_table')
  .select('*');

// Insert data
const { data, error } = await supabase
  .from('your_table')
  .insert([{ column: 'value' }]);

// Update data
const { data, error } = await supabase
  .from('your_table')
  .update({ column: 'new_value' })
  .eq('id', 1);
```

## Files Created
- `lib/supabase.js` - Main Supabase client configuration
- `lib/test-supabase.js` - Test utility for connection verification

