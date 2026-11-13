-- Insert one user
INSERT INTO users (email, password) VALUES
    ('testuser@example.com', 'hello123'),
    ('someuser@test.com', 'test456');

-- Insert 3 exams
INSERT INTO exams (user_id, title, note, deadline, tag_color) VALUES
    ((SELECT id FROM users WHERE email = 'testuser@example.com'), 'WebDev Submission', '', '2025-07-20', 'red'),
    ((SELECT id FROM users WHERE email = 'testuser@example.com'), 'Law', 'Room M1.01, 8:30 a.m.', '2025-07-23', 'blue'),
    ((SELECT id FROM users WHERE email = 'testuser@example.com'), 'BWL', 'Room M1.01', '2025-07-11', 'green');

-- Insert tasks for each exam
INSERT INTO tasks (name, completed, date, exam_id) VALUES
    ('Miro Documentation', TRUE, '2025-07-18', (SELECT id FROM exams WHERE title = 'WebDev Submission')),
    ( 'Record video', FALSE, '2025-07-17', (SELECT id FROM exams WHERE title  = 'WebDev Submission')),
    ( 'Fix bug', FALSE, '2025-07-16', (SELECT id FROM exams WHERE title = 'WebDev Submission'));

INSERT INTO tasks (name, completed, date, exam_id) VALUES
    ('Go through slides', FALSE, '2025-07-18', (SELECT id FROM exams WHERE title = 'Law')),
    ('Finish all exercises', TRUE, '2025-07-16', (SELECT id FROM exams WHERE title = 'Law'));

INSERT INTO tasks (name, completed, date, exam_id) VALUES
    ('Complete notes', TRUE, '2025-07-08', (SELECT id FROM exams WHERE title = 'BWL')),
    ('Memorise all theories', TRUE, '2025-07-10', (SELECT id FROM exams WHERE title = 'BWL'));