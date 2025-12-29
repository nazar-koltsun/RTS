# Supabase Storage Bucket Setup for Invoice Documents

## ⚠️ IMPORTANT: You MUST configure these policies to fix the upload error!

## Issue
If you're getting a "new row violates row-level security policy" error when uploading PDFs, you need to configure the storage bucket policies in Supabase.

**Error message:** `StorageApiError: new row violates row-level security policy`

This happens because Supabase Storage uses Row Level Security (RLS) and you need to explicitly allow authenticated users to upload files.

## Step-by-Step: Configure Storage Bucket

### Step 1: Create the Storage Bucket
1. Go to your Supabase project dashboard
2. Click on **Storage** in the left sidebar
3. Click **New bucket**
4. Name it: `invoice-documents`
5. Make it **Public** (or configure policies if you want it private)
6. Click **Create bucket**

### Step 2: Configure Storage Policies ⚠️ REQUIRED

**You MUST create at least the INSERT policy for uploads to work!**

1. Go to your Supabase dashboard
2. Navigate to **Storage** in the left sidebar
3. Click on **Policies** tab (or find your `invoice-documents` bucket and click on it)
4. Click **New Policy** button
5. Choose **For full customization** → **Create a policy from scratch**

#### REQUIRED: Policy for Uploads (INSERT)

**Policy 1: Allow authenticated users to upload files** ⚠️ REQUIRED
- Policy name: `Allow authenticated uploads`
- Allowed operation: **INSERT** (this is the most important one!)
- Policy definition (copy and paste this exactly):
```sql
bucket_id = 'invoice-documents' AND auth.role() = 'authenticated'
```
- Click **Review** → **Save policy**

#### Recommended: Policy for Reads (SELECT)

**Policy 2: Allow authenticated users to read files**
- Policy name: `Allow authenticated reads`
- Allowed operation: **SELECT**
- Policy definition:
```sql
bucket_id = 'invoice-documents' AND auth.role() = 'authenticated'
```

#### Optional: Policy for Deletes

**Policy 3: Allow authenticated users to delete files** (optional)
- Policy name: `Allow authenticated deletes`
- Allowed operation: **DELETE**
- Policy definition:
```sql
bucket_id = 'invoice-documents' AND auth.role() = 'authenticated'
```

#### Option B: Public Read, Authenticated Write
If you want files to be publicly readable but only authenticated users can upload:

**Policy 1: Allow public reads**
- Policy name: `Allow public reads`
- Allowed operation: `SELECT`
- Policy definition:
```sql
bucket_id = 'invoice-documents'
```

**Policy 2: Allow authenticated uploads**
- Policy name: `Allow authenticated uploads`
- Allowed operation: `INSERT`
- Policy definition:
```sql
bucket_id = 'invoice-documents' AND auth.role() = 'authenticated'
```

### Step 3: Verify the Setup
1. Make sure you're logged in to your application
2. Try uploading an invoice document
3. Check the Storage bucket in Supabase dashboard to see if files appear

## Alternative: Disable RLS (Not Recommended for Production)
If you want to disable RLS entirely for testing (NOT recommended for production):

1. Go to **Storage** → Select `invoice-documents` bucket
2. Click **Settings**
3. Toggle off **Public bucket** if you want it private
4. Go to **Policies**
5. You can temporarily disable RLS, but this is not secure

## Troubleshooting

### Still getting RLS errors?
1. Make sure you're logged in (check browser console for session)
2. Verify the bucket name matches exactly: `invoice-documents`
3. Check that policies are saved and active
4. Try refreshing the page and logging in again

### Files not appearing?
1. Check the Storage bucket in Supabase dashboard
2. Verify the upload function is being called (check browser console)
3. Check network tab for any errors

