-- =============================================================================
-- Dayflow HRMS Supabase Storage Buckets & Policies
-- =============================================================================

-- 1. Create Public/Private Storage Buckets
INSERT INTO storage.buckets (id, name, public)
VALUES 
    ('avatars', 'avatars', true),
    ('attachments', 'attachments', false)
ON CONFLICT (id) DO NOTHING;

-- 2. Avatars Bucket Policies
-- Allow anyone to read avatar images
CREATE POLICY "Public Read Avatars"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

-- Allow authenticated users to upload their own avatar
CREATE POLICY "Auth Users Upload Avatars"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'avatars');

-- 3. Attachments Bucket Policies (Medical leaves & docs)
CREATE POLICY "Auth Users Upload Attachments"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'attachments');

CREATE POLICY "Auth Users Read Attachments"
ON storage.objects FOR SELECT
USING (bucket_id = 'attachments');
