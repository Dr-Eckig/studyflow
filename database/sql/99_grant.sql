/**************************************************************************************
 * Erweitertes Beispiel aus der Vorlesung "Web-Programmierung" von Wolfgang Kowarschick
 **************************************************************************************/

BEGIN;

GRANT ALL ON studyflow.public.users                 TO web;
GRANT ALL ON studyflow.public.exams                 TO web;
GRANT ALL ON studyflow.public.tasks                 TO web;
GRANT ALL ON studyflow.public.task_completion_log   TO web;
GRANT SELECT ON studyflow.public.i18n_languages             TO web;
GRANT SELECT ON studyflow.public.i18n_translations          TO web;

GRANT SELECT ON studyflow.public.user_streak_view           TO web;
GRANT SELECT ON studyflow.public.weekly_task_progress_view  TO web;
GRANT SELECT ON studyflow.public.next_exam_view             TO web;
GRANT ALL ON studyflow.public.exam_with_tasks_list          TO web;
GRANT SELECT ON studyflow.public.grouped_tasks              TO web;

GRANT EXECUTE ON FUNCTION studyflow.public.check_password(TEXT, TEXT)   TO web;
GRANT EXECUTE ON FUNCTION studyflow.public.uuid_or_null(TEXT)           TO web;

COMMIT;
