
-- Seed some common plugin paths for testing
INSERT INTO plugin_scan_info (name, path, format, is_instrument, is_effect, supports_midi)
VALUES 
  ('Serum', '/Library/Audio/Plug-Ins/VST3/Serum.vst3', 'vst', true, true, true),
  ('FabFilter Pro-Q 3', '/Library/Audio/Plug-Ins/Components/Pro-Q3.component', 'au', false, true, false),
  ('Kontakt 7', '/Library/Audio/Plug-Ins/VST/Kontakt7.vst', 'vst', true, false, true)
ON CONFLICT (path) DO NOTHING;
