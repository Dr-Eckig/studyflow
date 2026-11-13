BEGIN;

INSERT INTO i18n_translations (lang_code, key, value)
VALUES
('de', 'first_deadline_title', 'Zuerst einen Termin anlegen'),
('de', 'first_deadline_description', 'Lege zuerst einen Termin im Kalender an, zum Beispiel eine Prüfung oder eine Abgabe. Danach kannst du dafür Aufgaben im Lernplan erstellen.'),
('de', 'go_to_calendar', 'Zum Kalender'),
('de', 'overview_exams_none', 'Noch keine Termine vorhanden'),
('en', 'first_deadline_title', 'Start by adding a deadline'),
('en', 'first_deadline_description', 'First, add a deadline to your calendar, such as an exam or an assignment. Then you can create tasks for it in your learning plan.'),
('en', 'go_to_calendar', 'Go to calendar'),
('en', 'overview_exams_none', 'No deadlines yet')
ON CONFLICT (lang_code, key)
DO UPDATE SET value = EXCLUDED.value;

COMMIT;
