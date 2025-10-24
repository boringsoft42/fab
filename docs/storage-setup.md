# Supabase Storage Setup Guide - Sistema FAB

This document explains how to set up Supabase Storage buckets and RLS policies for the FAB system.

## Required Buckets

The FAB system uses 3 storage buckets:

1. **`profile-photos`** - Profile photos for atletas, entrenadores, and jueces
2. **`documents`** - Identity documents (CI), medical certificates, professional certifications
3. **event-logos`** - Event logos and QR payment codes

## Setup Instructions

### Step 1: Create Buckets in Supabase Dashboard

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to **Storage** in the left sidebar
4. Click **"New bucket"** for each of the following:

#### Bucket 1: profile-photos
- **Name**: `profile-photos`
- **Public bucket**: ❌ No (private)
- **File size limit**: 5 MB
- **Allowed MIME types**: `image/jpeg`, `image/png`, `image/webp`

#### Bucket 2: documents
- **Name**: `documents`
- **Public bucket**: ❌ No (private)
- **File size limit**: 10 MB
- **Allowed MIME types**: `image/jpeg`, `image/png`, `application/pdf`

#### Bucket 3: event-logos
- **Name**: `event-logos`
- **Public bucket**: ✅ Yes (publicly readable)
- **File size limit**: 2 MB
- **Allowed MIME types**: `image/jpeg`, `image/png`, `image/webp`

### Step 2: Configure RLS Policies

After creating the buckets, you need to set up Row Level Security policies.

#### Option A: Using Supabase Dashboard

1. Go to **Storage** → **Policies**
2. For each bucket, click **"New Policy"**
3. Copy and paste the SQL policies below

#### Option B: Using SQL Editor

1. Go to **SQL Editor** → **"New query"**
2. Copy and paste ALL the SQL below
3. Click **"Run"**

```sql
-- =============================================================
-- STORAGE RLS POLICIES - FAB System
-- =============================================================

-- =====================================================
-- BUCKET: profile-photos
-- =====================================================

-- Policy: Users can upload their own profile photo
CREATE POLICY "Users can upload own profile photo"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'profile-photos' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy: Users can view their own profile photo
CREATE POLICY "Users can view own profile photo"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'profile-photos' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy: Users can update their own profile photo
CREATE POLICY "Users can update own profile photo"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'profile-photos' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy: Users can delete their own profile photo
CREATE POLICY "Users can delete own profile photo"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'profile-photos' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy: Admin FAB can view all profile photos
CREATE POLICY "Admin FAB can view all profile photos"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'profile-photos' AND
  EXISTS (
    SELECT 1 FROM public.users
    WHERE user_id = auth.uid() AND rol = 'admin_fab'
  )
);

-- =====================================================
-- BUCKET: documents
-- =====================================================

-- Policy: Users can upload their own documents
CREATE POLICY "Users can upload own documents"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'documents' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy: Users can view their own documents
CREATE POLICY "Users can view own documents"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'documents' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy: Users can update their own documents
CREATE POLICY "Users can update own documents"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'documents' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy: Users can delete their own documents
CREATE POLICY "Users can delete own documents"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'documents' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy: Admin FAB can view all documents
CREATE POLICY "Admin FAB can view all documents"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'documents' AND
  EXISTS (
    SELECT 1 FROM public.users
    WHERE user_id = auth.uid() AND rol = 'admin_fab'
  )
);

-- Policy: Admin Asociacion can view documents from their asociacion
CREATE POLICY "Admin Asociacion can view documents from their asociacion"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'documents' AND
  EXISTS (
    SELECT 1 FROM public.users u1
    JOIN public.users u2 ON u1.asociacion_id = u2.asociacion_id
    WHERE u1.user_id = auth.uid()
      AND u1.rol = 'admin_asociacion'
      AND u2.user_id::text = (storage.foldername(name))[1]
  )
);

-- =====================================================
-- BUCKET: event-logos
-- =====================================================

-- Policy: Public can view event logos (public bucket)
CREATE POLICY "Public can view event logos"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'event-logos');

-- Policy: Admins can upload event logos
CREATE POLICY "Admins can upload event logos"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'event-logos' AND
  EXISTS (
    SELECT 1 FROM public.users
    WHERE user_id = auth.uid() AND rol IN ('admin_fab', 'admin_asociacion')
  )
);

-- Policy: Admins can update event logos
CREATE POLICY "Admins can update event logos"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'event-logos' AND
  EXISTS (
    SELECT 1 FROM public.users
    WHERE user_id = auth.uid() AND rol IN ('admin_fab', 'admin_asociacion')
  )
);

-- Policy: Admins can delete event logos
CREATE POLICY "Admins can delete event logos"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'event-logos' AND
  EXISTS (
    SELECT 1 FROM public.users
    WHERE user_id = auth.uid() AND rol IN ('admin_fab', 'admin_asociacion')
  )
);
```

## File Path Structure

When uploading files, use the following path structure:

### Profile Photos
```
profile-photos/{user_id}/avatar.jpg
```
Example: `profile-photos/550e8400-e29b-41d4-a716-446655440000/avatar.jpg`

### Documents
```
documents/{user_id}/{document_type}.{ext}
```
Examples:
- `documents/550e8400-e29b-41d4-a716-446655440000/ci_frente.jpg`
- `documents/550e8400-e29b-41d4-a716-446655440000/ci_reverso.jpg`
- `documents/550e8400-e29b-41d4-a716-446655440000/certificado_medico.pdf`

### Event Logos
```
event-logos/{event_id}/logo.{ext}
```
Example: `event-logos/660e8400-e29b-41d4-a716-446655440000/logo.png`

## Verification

After setting up, verify the configuration:

### 1. Check Buckets Exist
```sql
SELECT * FROM storage.buckets;
```
Expected: 3 buckets (profile-photos, documents, event-logos)

### 2. Check Policies
```sql
SELECT schemaname, tablename, policyname
FROM pg_policies
WHERE tablename = 'objects'
ORDER BY policyname;
```
Expected: At least 15 policies

### 3. Test Upload (via Supabase Client)
```typescript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Test upload to profile-photos
const { data, error } = await supabase.storage
  .from('profile-photos')
  .upload(`${userId}/avatar.jpg`, file);

if (error) console.error('Upload failed:', error);
else console.log('Upload successful:', data);
```

## Troubleshooting

### Error: "new row violates row-level security policy"
- Make sure RLS policies are created correctly
- Verify the user has the correct `rol` in the `users` table
- Check that `auth.uid()` matches the folder name in the path

### Error: "Bucket not found"
- Make sure all 3 buckets are created in Storage
- Check bucket names match exactly (case-sensitive)

### Error: "File size too large"
- Profile photos: max 5 MB
- Documents: max 10 MB
- Event logos: max 2 MB

## Next Steps

After completing storage setup:

1. ✅ **Task 1.4 Complete** - Mark as done in task list
2. ➡️ **Task 1.5** - Create seed script for admin_fab user
3. ➡️ **Task 1.6** - Create seed script for test data

---

**Setup Version**: v2025-10-24
**Last Updated**: 2025-10-24
**Related**: `docs/database-setup.md`, `tasks/tasks-0001-prd-fab-management-system.md` (Task 1.4)
