INSERT INTO i18n_translations (lang_code, key, value)
VALUES
  ('de', 'calendar_title_input', 'Titel'),
  ('de', 'calendar_color_input', 'Farbe'),
  ('de', 'calendar_description_input', 'Beschreibung'),
  ('de', 'error_exam_delete', 'Fehler beim Löschen des Termins'),
  ('en', 'calendar_title_input', 'Title'),
  ('en', 'calendar_color_input', 'Color'),
  ('en', 'calendar_description_input', 'Description'),
  ('en', 'error_exam_delete', 'Error deleting the deadline')
ON CONFLICT (lang_code, key)
DO UPDATE SET value = EXCLUDED.value;
