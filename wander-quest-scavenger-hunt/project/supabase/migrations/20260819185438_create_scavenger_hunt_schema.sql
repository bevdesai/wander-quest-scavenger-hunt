/*
# Create scavenger hunt schema

## Overview
Sets up the data model for the Multilingual Local Scavenger Hunt Generator.
This app has no sign-in screen, so hunts are treated as shared/public data
scoped to whoever holds the link/device (single-tenant, no-auth app).

## New Tables

### `hunts`
Stores one row per generated scavenger hunt.
- `id` (uuid, primary key)
- `city` (text) - the location the user entered
- `language` (text) - target language for the hunt content
- `duration_minutes` (integer) - requested walk duration (30/60/90)
- `theme` (text) - tour theme (Historical, Foodie, Family-Friendly)
- `status` (text) - lifecycle: 'generating' | 'ready' | 'failed'
- `error_message` (text, nullable) - populated if generation failed
- `created_at` (timestamptz)

### `hunt_stops`
Stores the ordered stops belonging to a hunt.
- `id` (uuid, primary key)
- `hunt_id` (uuid, foreign key -> hunts.id, cascades on delete)
- `stop_number` (integer) - 1-based order within the hunt
- `landmark_name` (text) - the real-world landmark/place
- `riddle` (text) - cryptic clue directing the walker to the landmark
- `audio_script` (text) - narration script read aloud as the "Audio Story"
- `target_visual_description` (text) - description AI vision compares uploaded photos against
- `photo_url` (text, nullable) - public URL of the user's uploaded verification photo
- `is_verified` (boolean, default false) - whether the photo passed AI verification
- `verification_feedback` (text, nullable) - friendly feedback from the last verification attempt
- `created_at` (timestamptz)

A unique constraint on `(hunt_id, stop_number)` keeps stop ordering well-defined.

## Storage
Creates a public `hunt-photos` bucket (5MB limit, image types only) so verification
photos can be uploaded directly from the browser and displayed back in the UI.

## Security
Row level security is enabled on both tables. Since there is no login, every
policy is scoped `TO anon, authenticated` with a permissive predicate: this data
is intentionally shared/public for this no-auth app. Storage policies are scoped
the same way, restricted to the `hunt-photos` bucket only.
*/

CREATE TABLE IF NOT EXISTS hunts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  city text NOT NULL,
  language text NOT NULL,
  duration_minutes integer NOT NULL,
  theme text NOT NULL,
  status text NOT NULL DEFAULT 'generating',
  error_message text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS hunt_stops (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  hunt_id uuid NOT NULL REFERENCES hunts(id) ON DELETE CASCADE,
  stop_number integer NOT NULL,
  landmark_name text NOT NULL,
  riddle text NOT NULL,
  audio_script text NOT NULL,
  target_visual_description text NOT NULL,
  photo_url text,
  is_verified boolean NOT NULL DEFAULT false,
  verification_feedback text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (hunt_id, stop_number)
);

CREATE INDEX IF NOT EXISTS idx_hunt_stops_hunt_id ON hunt_stops (hunt_id);

ALTER TABLE hunts ENABLE ROW LEVEL SECURITY;
ALTER TABLE hunt_stops ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_hunts" ON hunts;
CREATE POLICY "anon_select_hunts" ON hunts FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_hunts" ON hunts;
CREATE POLICY "anon_insert_hunts" ON hunts FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_hunts" ON hunts;
CREATE POLICY "anon_update_hunts" ON hunts FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_hunts" ON hunts;
CREATE POLICY "anon_delete_hunts" ON hunts FOR DELETE
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_select_hunt_stops" ON hunt_stops;
CREATE POLICY "anon_select_hunt_stops" ON hunt_stops FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_hunt_stops" ON hunt_stops;
CREATE POLICY "anon_insert_hunt_stops" ON hunt_stops FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_hunt_stops" ON hunt_stops;
CREATE POLICY "anon_update_hunt_stops" ON hunt_stops FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_hunt_stops" ON hunt_stops;
CREATE POLICY "anon_delete_hunt_stops" ON hunt_stops FOR DELETE
  TO anon, authenticated USING (true);

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('hunt-photos', 'hunt-photos', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp'])
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "hunt_photos_insert" ON storage.objects;
CREATE POLICY "hunt_photos_insert" ON storage.objects FOR INSERT
  TO anon, authenticated WITH CHECK (bucket_id = 'hunt-photos');

DROP POLICY IF EXISTS "hunt_photos_select" ON storage.objects;
CREATE POLICY "hunt_photos_select" ON storage.objects FOR SELECT
  TO anon, authenticated USING (bucket_id = 'hunt-photos');
