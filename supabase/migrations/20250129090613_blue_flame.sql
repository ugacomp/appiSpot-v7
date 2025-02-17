-- Create spots bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('spots', 'spots', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies
DO $$ BEGIN
    -- Check and create "Images are publicly accessible" policy
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'objects' 
        AND policyname = 'Images are publicly accessible'
    ) THEN
        CREATE POLICY "Images are publicly accessible"
        ON storage.objects FOR SELECT
        USING (bucket_id = 'spots');
    END IF;

    -- Check and create "Authenticated users can upload images" policy
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'objects' 
        AND policyname = 'Authenticated users can upload images'
    ) THEN
        CREATE POLICY "Authenticated users can upload images"
        ON storage.objects FOR INSERT
        WITH CHECK (
            bucket_id = 'spots'
            AND auth.role() = 'authenticated'
        );
    END IF;

    -- Check and create "Users can update their own images" policy
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'objects' 
        AND policyname = 'Users can update their own images'
    ) THEN
        CREATE POLICY "Users can update their own images"
        ON storage.objects FOR UPDATE
        USING (bucket_id = 'spots' AND owner = auth.uid())
        WITH CHECK (bucket_id = 'spots' AND owner = auth.uid());
    END IF;

    -- Check and create "Users can delete their own images" policy
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'objects' 
        AND policyname = 'Users can delete their own images'
    ) THEN
        CREATE POLICY "Users can delete their own images"
        ON storage.objects FOR DELETE
        USING (bucket_id = 'spots' AND owner = auth.uid());
    END IF;
END $$;