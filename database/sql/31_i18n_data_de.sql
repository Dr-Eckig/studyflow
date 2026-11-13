BEGIN;

INSERT INTO i18n_languages (code, name)
VALUES ('de', 'Deutsch')
ON CONFLICT (code)
DO UPDATE SET name = EXCLUDED.name;

INSERT INTO i18n_translations (lang_code, key, value)
VALUES
--authentification
('de', 'login', 'Einloggen'),
('de', 'register', 'Registrieren'),
('de', 'no_account_yet', 'Haben Sie noch keinen Account?'),
('de', 'already_have_account', 'Haben Sie bereits einen Account?'),
('de', 'email', 'E-Mail'),
('de', 'password', 'Passwort'),
('de', 'repeat_password', 'Passwort wiederholen'),

--calendar days
('de', 'calendar_day_mo', 'Mo'),
('de', 'calendar_day_tu', 'Di'),
('de', 'calendar_day_we', 'Mi'),
('de', 'calendar_day_th', 'Do'),
('de', 'calendar_day_fr', 'Fr'),
('de', 'calendar_day_sa', 'Sa'),
('de', 'calendar_day_su', 'So'),

--calendar months
('de', 'calendar_month_ja', 'Januar'),
('de', 'calendar_month_fe', 'Februar'),
('de', 'calendar_month_ma', 'März'),
('de', 'calendar_month_ap', 'April'),
('de', 'calendar_month_may', 'Mai'),
('de', 'calendar_month_jun', 'Juni'),
('de', 'calendar_month_jul', 'Juli'),
('de', 'calendar_month_au', 'August'),
('de', 'calendar_month_se', 'September'),
('de', 'calendar_month_oc', 'Oktober'),
('de', 'calendar_month_no', 'November'),
('de', 'calendar_month_de', 'Dezember'),

--calendar
('de', 'deadlines', 'Termine'),
('de', 'calendar_add_deadline', 'Klicke auf einen Tag, um einen neuen Termin hinzuzufügen'),
('de', 'calendar_add_deadline_button', 'Termin hinzufügen'),
('de', 'calendar_no_deadline', 'Noch keine Termine an diesem Tag'),
('de', 'calendar_details', 'Details für'),
('de', 'calendar_title_input', 'Titel'),
('de', 'calendar_color_input', 'Farbe'),
('de', 'calendar_description_input', 'Beschreibung'),
('de', 'previous_month', 'Vergangener Monat'),
('de', 'next_month', 'Nächster Monat'),

--colors
('de', 'color_red', 'Rot'),
('de', 'color_blue', 'Blau'),
('de', 'color_green', 'Grün'),
('de', 'color_yellow', 'Gelb'),
('de', 'color_violet', 'Violett'),
('de', 'color_orange', 'Orange'),
('de', 'color_brown', 'Braun'),
('de', 'color_white', 'Weiß'),
('de', 'color_black', 'Schwarz'),

--tasks
('de', 'tasks_today', 'Heutige Aufgaben'),
('de', 'tasks_today_none', 'Für heute stehen keine Aufgaben an'),
('de', 'tasks_today_progress', 'erledigt'),
('de', 'task_edit', 'Aufgabe bearbeiten'),
('de', 'task_new', 'Neue Aufgabe hinzufügen'),
('de', 'task_delete', 'Aufgabe löschen'),
('de', 'task_choose_category', 'Wählen Sie eine Kategorie'),
('de', 'previous_week', 'Vergangene Woche'),
('de', 'next_week', 'Nächste Woche'),

--statistics
('de', 'statistics_weekly', 'Wochenfortschritt'),
('de', 'statistics_streak', 'Tage ohne Prokrastination'),
('de', 'statistics_no_exam', 'Keine Prüfung'),

--schedule
('de', 'schedule_today', 'Heute'),
('de', 'schedule_add', 'Klicken Sie auf `+`, um eine Aufgabe hinzuzufügen'),
('de', 'schedule_new_task', 'Neue Aufgabe'),
('de', 'schedule_type', 'Kategorie'),

--calendar days long
('de', 'calendar_day_mo_long', 'Montag'),
('de', 'calendar_day_tu_long', 'Dienstag'),
('de', 'calendar_day_we_long', 'Mittwoch'),
('de', 'calendar_day_th_long', 'Donnerstag'),
('de', 'calendar_day_fr_long', 'Freitag'),
('de', 'calendar_day_sa_long', 'Samstag'),
('de', 'calendar_day_su_long', 'Sonntag'),

--overview
('de', 'overview_overdue', 'überfällig'),
('de', 'overview_task_open', 'Offene Aufgaben'),
('de', 'overview_task_done', 'Erledigte Aufgaben'),
('de', 'overview_task_none', 'Keine Aufgaben'),
('de', 'overview_exams_none', 'Noch keine Prüfungen eingetragen. Lege jetzt los und füge welche hinzu!'),

--common
('de', 'progress_done', 'erledigt'),
('de', 'save', 'Speichern'),
('de', 'cancel', 'Abbrechen'),
('de', 'close', 'Schließen'),
('de', 'logout', 'Abmelden'),
('de', 'dashboard', 'Dashboard'),
('de', 'learning_plan', 'Lernplan'),
('de', 'overview', 'Übersicht'), 
('de', 'theme', 'Theme'),
('de', 'language', 'Sprache'),
('de', 'today', 'Heute'),
('de', 'task', 'Aufgabe'),
('de', 'days', 'Tage'),
('de', 'day', 'Tag'),

--motivation message
('de', 'motivation_1', 'Verschwende keine Zeit auf Motivation. Fang einfach an.'),
('de', 'motivation_2', 'Fokus – dein Ziel wartet nicht ewig.'),
('de', 'motivation_3', 'Wer vorbereitet ist, braucht kein Glück.'),
('de', 'motivation_4', 'Ein Tag Pause = kompletter Reset. Sicher?'),
('de', 'motivation_5', 'Keine Motivation? Gut. Dann verlier wenigstens nicht deinen Fortschritt.'),
('de', 'motivation_6', 'Du bist schon so weit gekommen – nicht aufgeben!'),
('de', 'motivation_7', 'Fortschritt weg = alles weg. So einfach ist das.'),
('de', 'motivation_8', 'Später machen. Wie alle, die es nie geschafft haben.'),
('de', 'motivation_9', 'Du scrollst noch? Deine Aufgabe wird ungeduldig.'),
('de', 'motivation_10', 'Jetzt lernen oder später Panik – du entscheidest.'),
('de', 'motivation_11', 'Wenn du es sowieso machen musst – warum nicht jetzt?'),
('de', 'motivation_12', 'Du hast den Tab geöffnet. Ein Anfang.'),

--404 error page
('de', 'error-message', 'Seite nicht gefunden'),
('de', 'error-description', 'Ups! Die Seite, die du suchst, existiert nicht.'),

--TOAST FEEDBACK

--authentification
('de', 'invalid_email', 'Ungültige E-Mail-Adresse'),
('de', 'required_password', 'Passwort darf nicht leer sein'),
('de', 'password_mismatch', 'Passwörter stimmen nicht überein'),
('de', 'registration_failed', 'Registrierung fehlgeschlagen – E-Mail evtl. schon vergeben'),
('de', 'login_failed', 'Login fehlgeschlagen - E-Mail oder Passwort falsch'),
('de', 'registration_succeed', 'Registrierung erfolgreich!'),
('de', 'login_succeeed', 'Login erfolgreich!'),

--calendar
('de', 'missing_title', 'Bitte geben Sie einen Titel ein'),
('de', 'missing_color', 'Bitte wählen Sie eine Farbe'),
('de', 'missing_date', 'Bitte wählen Sie ein Datum'),
('de', 'error_exam_update', 'Fehler beim updaten der Exam'),
('de', 'error_exam_create', 'Fehler beim erstellen der Exam'),
('de', 'error_exam_delete', 'Fehler beim Löschen des Termins'),
('de', 'exam_saved', 'Exam gespeichert!'),
('de', 'exam_deleted', 'Exam gelöscht'),
('de', 'error_past_date', 'Datum liegt in der Vergangenheit'),

--tasks
('de', 'error_toggle_status', 'Fehler beim Umschalten des Aufgabenstatuses'),
('de', 'error_update_task', 'Fehler beim Ändern der Aufgabe'),
('de', 'error_delete_task', 'Task konnte nicht gelöscht werden'),
('de', 'error_drag_drop_task', 'Task konnte nicht verschoben werden'),
('de', 'category_not_found', 'Kategorie nicht gefunden: '),
('de', 'category_empty', 'Bitte wählen Sie eine Kategorie'),
('de', 'exam_not_found', 'Exam nicht gefunden: '),
('de', 'task_saved', 'Aufgabe gespeichert!'),
('de', 'task_deleted', 'Aufgabe gelöscht'),
('de', 'task_not_found', 'Aufgabe existiert nicht.')

ON CONFLICT (lang_code, key)
DO UPDATE SET value = EXCLUDED.value;

COMMIT;
