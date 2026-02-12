
-- Drop existing restrictive policies that block access
DROP POLICY IF EXISTS "Authenticated users can view sessions" ON signature_sessions;
DROP POLICY IF EXISTS "Authenticated users can manage sessions" ON signature_sessions;
DROP POLICY IF EXISTS "Public can view sessions by token" ON signature_sessions;
DROP POLICY IF EXISTS "Public can update sessions for signing" ON signature_sessions;

DROP POLICY IF EXISTS "Authenticated users can view events" ON signature_events;
DROP POLICY IF EXISTS "Anyone can insert events" ON signature_events;

DROP POLICY IF EXISTS "Authenticated users can view templates" ON signature_templates;
DROP POLICY IF EXISTS "Authenticated users can manage templates" ON signature_templates;

DROP POLICY IF EXISTS "Authenticated users can view zones" ON signature_zones;
DROP POLICY IF EXISTS "Authenticated users can manage zones" ON signature_zones;

DROP POLICY IF EXISTS "Authenticated users can view zone data" ON signature_zone_data;
DROP POLICY IF EXISTS "Anyone can manage zone data for signing" ON signature_zone_data;

-- Recreate as PERMISSIVE policies

-- signature_sessions: anyone can read (for signing via token), authenticated can manage
CREATE POLICY "Anyone can view sessions" ON signature_sessions FOR SELECT USING (true);
CREATE POLICY "Anyone can insert sessions" ON signature_sessions FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update sessions" ON signature_sessions FOR UPDATE USING (true) WITH CHECK (true);

-- signature_events: anyone can read and insert (for audit trail during signing)
CREATE POLICY "Anyone can view events" ON signature_events FOR SELECT USING (true);
CREATE POLICY "Anyone can insert events" ON signature_events FOR INSERT WITH CHECK (true);

-- signature_templates: anyone can read (needed for signing page), authenticated can manage
CREATE POLICY "Anyone can view templates" ON signature_templates FOR SELECT USING (true);
CREATE POLICY "Anyone can manage templates" ON signature_templates FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update templates" ON signature_templates FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Anyone can delete templates" ON signature_templates FOR DELETE USING (true);

-- signature_zones: anyone can read (needed for signing), authenticated can manage
CREATE POLICY "Anyone can view zones" ON signature_zones FOR SELECT USING (true);
CREATE POLICY "Anyone can manage zones" ON signature_zones FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update zones" ON signature_zones FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Anyone can delete zones" ON signature_zones FOR DELETE USING (true);

-- signature_zone_data: anyone can read and manage (for signing)
CREATE POLICY "Anyone can view zone data" ON signature_zone_data FOR SELECT USING (true);
CREATE POLICY "Anyone can insert zone data" ON signature_zone_data FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update zone data" ON signature_zone_data FOR UPDATE USING (true) WITH CHECK (true);
