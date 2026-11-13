BEGIN;

INSERT INTO i18n_languages (code, name)
VALUES ('en', 'English')
ON CONFLICT (code)
DO UPDATE SET name = EXCLUDED.name;

INSERT INTO i18n_translations (lang_code, key, value)
VALUES
--authentification
('en', 'login', 'Login'),
('en', 'register', 'Register'),
('en', 'no_account_yet', 'Don''t have an account yet?'),
('en', 'already_have_account', 'Already have an account?'),
('en', 'email', 'Email'),
('en', 'password', 'Password'),
('en', 'repeat_password', 'Repeat Password'),

--calendar days
('en', 'calendar_day_mo', 'Mo'),
('en', 'calendar_day_tu', 'Tu'),
('en', 'calendar_day_we', 'We'),
('en', 'calendar_day_th', 'Th'),
('en', 'calendar_day_fr', 'Fr'),
('en', 'calendar_day_sa', 'Sa'),
('en', 'calendar_day_su', 'Su'),

--calendar months
('en', 'calendar_month_ja', 'January'),
('en', 'calendar_month_fe', 'February'),
('en', 'calendar_month_ma', 'March'),
('en', 'calendar_month_ap', 'April'),
('en', 'calendar_month_may', 'May'),
('en', 'calendar_month_jun', 'June'),
('en', 'calendar_month_jul', 'July'),
('en', 'calendar_month_au', 'August'),
('en', 'calendar_month_se', 'September'),
('en', 'calendar_month_oc', 'October'),
('en', 'calendar_month_no', 'November'),
('en', 'calendar_month_de', 'December'),

--calendar
('en', 'deadlines', 'Deadlines'),
('en', 'calendar_add_deadline', 'Click on a day calendar to add a deadline'),
('en', 'calendar_add_deadline_button', 'Add deadline'),
('en', 'calendar_no_deadline', 'No deadlines for this day'),
('en', 'calendar_details', 'Details for'),
('en', 'title_input', 'Title'),
('en', 'color_input', 'Color'),
('en', 'description_input', 'Description'),
('en', 'previous_month', 'Previous Month'),
('en', 'next_month', 'Next Month'),

--colors
('en', 'color_red', 'Red'),
('en', 'color_blue', 'Blue'),
('en', 'color_green', 'Green'),
('en', 'color_yellow', 'Yellow'),
('en', 'color_violet', 'Violet'),
('en', 'color_orange', 'Orange'),
('en', 'color_brown', 'Brown'),
('en', 'color_white', 'White'),
('en', 'color_black', 'Black'),

--tasks
('en', 'tasks_today', 'Today`s Tasks'),
('en', 'tasks_today_none', 'No tasks for today'),
('en', 'tasks_today_progress', 'done'),
('en', 'task_edit', 'Edit Task'),
('en', 'task_new', 'Add a new Task'),
('en', 'task_delete', 'Delete Task'),
('en', 'task_choose_category', 'Select a Category'),
('en', 'previous_week', 'Previous Week'),
('en', 'next_week', 'Next Week'),

--statistics
('en', 'statistics_weekly', 'Weekly progress'),
('en', 'statistics_streak', 'Days without procrastination'),
('en', 'statistics_no_exam', 'No Exam'),

--schedule
('en', 'schedule_today', 'Today'),
('en', 'schedule_add', 'Click `+` to add a task'),
('en', 'schedule_new_task', 'New task'),
('en', 'schedule_type', 'Type'),

--calendar days long
('en', 'calendar_day_mo_long', 'Monday'),
('en', 'calendar_day_tu_long', 'Tuesday'),
('en', 'calendar_day_we_long', 'Wednesday'),
('en', 'calendar_day_th_long', 'Thursday'),
('en', 'calendar_day_fr_long', 'Friday'),
('en', 'calendar_day_sa_long', 'Saturday'),
('en', 'calendar_day_su_long', 'Sunday'),

--overview
('en', 'overview_overdue', 'overdue'),
('en', 'overview_task_open', 'Open tasks'),
('en', 'overview_task_done', 'Done tasks'),
('en', 'overview_task_none', 'No tasks'),
('en', 'overview_exams_none', 'No exams yet. Add some to get started!'),

--common
('en', 'progress_done', 'done'),
('en', 'save', 'Save'),
('en', 'cancel', 'Cancel'),
('en', 'close', 'Close'),
('en', 'logout', 'Logout'),
('en', 'dashboard', 'Dashboard'),
('en', 'learning_plan', 'Learning Plan'),
('en', 'overview', 'Overview'),
('en', 'theme', 'Theme'),
('en', 'language', 'Language'),
('en', 'today', 'Today'),
('en', 'task', 'Task'),
('en', 'days', 'Days'),
('en', 'day', 'Day'),

--motivation message
('en', 'motivation_1', 'Don’t waste time waiting for motivation. Just start.'),
('en', 'motivation_2', 'Focus – your goal won’t wait forever.'),
('en', 'motivation_3', 'Prepared people don’t need luck.'),
('en', 'motivation_4', 'One day off = a full reset. You sure about that?'),
('en', 'motivation_5', 'No motivation? Fine. Just don’t lose your streak.'),
('en', 'motivation_6', 'You’ve made it this far – don’t stop now.'),
('en', 'motivation_7', 'Lose the streak, lose the progress. Simple as that.'),
('en', 'motivation_8', 'Do it later. Like everyone else who never made it.'),
('en', 'motivation_9', 'Still scrolling? Your task is getting impatient.'),
('en', 'motivation_10', 'You can study now. Or panic later. Your call.'),
('en', 'motivation_11', 'If you have to do it anyway – why not now?'),
('en', 'motivation_12', 'You opened the tab. That’s something.'),

--404 error page
('en', 'error-message', 'Page Not Found'),
('en', 'error-description', 'Oops! The page you are looking for does not exist.'),

-- TOAST FEEDBACK

-- authentification
('en', 'invalid_email', 'Invalid email address'),
('en', 'required_password', 'Password cannot be empty'),
('en', 'password_mismatch', 'Passwords do not match'),
('en', 'registration_failed', 'Registration failed – email may already be taken'),
('en', 'login_failed', 'Login failed – email or password incorrect'),
('en', 'registration_succeed', 'Registration successful!'),
('en', 'login_succeeed', 'Login successful!'),

-- calendar
('en', 'missing_title', 'Please enter a title'),
('en', 'missing_color', 'Please select a color'),
('en', 'missing_date', 'Please select a date'),
('en', 'error_exam_update', 'Error updating the exam'),
('en', 'error_exam_create', 'Error creating the exam'),
('en', 'exam_saved', 'Exam saved successfully!'),
('en', 'exam_deleted', 'Exam deleted successfully!'),
('en', 'error_past_date', 'Exam is in the past'),

-- tasks
('en', 'error_toggle_status', 'Error toggling task status'),
('en', 'error_update_task', 'Error updating task'),
('en', 'error_delete_task', 'Task could not be deleted'),
('en', 'error_drag_drop_task', 'Task could not be moved'),
('en', 'category_not_found', 'Category not found: '),
('en', 'category_empty', 'Please select a category'),
('en', 'exam_not_found', 'Exam not found: '),
('en', 'task_saved', 'Task saved successfully!'),
('en', 'task_deleted', 'Task deleted successfully!'),
('en', 'task_not_found', 'Task does not exist.')

ON CONFLICT (lang_code, key)
DO UPDATE SET value = EXCLUDED.value;

COMMIT;
