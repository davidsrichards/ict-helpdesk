-- NSUK ICT Helpdesk - minimal production seed.
-- Run in the Supabase SQL Editor AFTER 001_initial_schema.sql.
-- No demo users, tickets or passwords. Safe to run more than once.
-- Ticket types (Question, Issue, Suggestion) are already created by the migration.

-- ICT support categories students can pick when submitting a ticket
INSERT INTO categories (name) VALUES
  ('Student Portal'),
  ('Internet / Wi-Fi'),
  ('Email & Accounts'),
  ('Hardware & Computers'),
  ('Software & Licences'),
  ('CBT / Examination Systems'),
  ('Other')
ON CONFLICT DO NOTHING;

-- Help Center (knowledge base) categories
INSERT INTO kb_categories (name, display_order) VALUES
  ('Getting Started', 1),
  ('Wi-Fi & Internet', 2),
  ('Student Portal', 3),
  ('Email & Accounts', 4),
  ('Hardware & Devices', 5),
  ('Software & Licences', 6),
  ('CBT & Examinations', 7),
  ('Troubleshooting', 8)
ON CONFLICT (name) DO UPDATE SET display_order = EXCLUDED.display_order;

-- Turn the public Help Center on
UPDATE app_settings SET value = 'true' WHERE key = 'kb_visible';
