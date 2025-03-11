
-- Create enum for plugin formats
CREATE TYPE plugin_format AS ENUM ('vst', 'au');

-- Create plugin scan info table
CREATE TABLE IF NOT EXISTS plugin_scan_info (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  path TEXT NOT NULL UNIQUE,
  format plugin_format NOT NULL,
  version TEXT,
  vendor TEXT,
  category TEXT,
  is_instrument BOOLEAN NOT NULL DEFAULT false,
  is_effect BOOLEAN NOT NULL DEFAULT false,
  supports_midi BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_used TIMESTAMP WITH TIME ZONE,
  last_scan TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on commonly queried fields
CREATE INDEX IF NOT EXISTS plugin_scan_info_name_idx ON plugin_scan_info(name);
CREATE INDEX IF NOT EXISTS plugin_scan_info_format_idx ON plugin_scan_info(format);
CREATE INDEX IF NOT EXISTS plugin_scan_info_last_used_idx ON plugin_scan_info(last_used);

-- Create plugin presets table
CREATE TABLE IF NOT EXISTS plugin_presets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  plugin_id UUID NOT NULL REFERENCES plugin_scan_info(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  settings JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster preset lookups
CREATE INDEX IF NOT EXISTS plugin_presets_plugin_id_idx ON plugin_presets(plugin_id);
