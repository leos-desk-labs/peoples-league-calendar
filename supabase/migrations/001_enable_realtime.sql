-- Enable realtime on content_items table
-- Run this in the Supabase SQL Editor if realtime isn't working

-- Add content_items to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE content_items;

-- Add updated_by and created_by columns if they don't exist
ALTER TABLE content_items ADD COLUMN IF NOT EXISTS updated_by text;
ALTER TABLE content_items ADD COLUMN IF NOT EXISTS created_by text;

-- Disable RLS (internal tool, protected by access code)
ALTER TABLE content_items DISABLE ROW LEVEL SECURITY;
