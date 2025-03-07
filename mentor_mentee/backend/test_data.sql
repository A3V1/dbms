-- Create test users with Django's auth_user fields
INSERT INTO auth_user (id, username, email, password, first_name, last_name, is_staff, is_active, is_superuser, date_joined, last_login)
VALUES
(1, 'johndoe', 'johndoe@college.edu', 'pbkdf2_sha256$600000$hashed_password_1', 'John', 'Doe', false, true, false, NOW(), NOW()),
(2, 'alicesmith', 'alicesmith@college.edu', 'pbkdf2_sha256$600000$hashed_password_2', 'Alice', 'Smith', false, true, false, NOW(), NOW()),
(3, 'bobjohnson', 'bobjohnson@college.edu', 'pbkdf2_sha256$600000$hashed_password_3', 'Bob', 'Johnson', true, true, true, NOW(), NOW());

-- Update User model with additional fields
UPDATE auth_user SET 
official_mail_id = 'johndoe@college.edu',
phone_number = '9876543210',
prn_id_no = 'PRN1001',
role = 'mentor',
profile_picture = NULL,
calendar_id = 'CAL1001'
WHERE username = 'johndoe';

UPDATE auth_user SET 
official_mail_id = 'alicesmith@college.edu',
phone_number = '9123456789',
prn_id_no = 'PRN1002',
role = 'mentee',
profile_picture = NULL,
calendar_id = 'CAL1002'
WHERE username = 'alicesmith';

UPDATE auth_user SET 
official_mail_id = 'bobjohnson@college.edu',
phone_number = '9988776655',
prn_id_no = 'PRN1003',
role = 'admin',
profile_picture = NULL,
calendar_id = 'CAL1003'
WHERE username = 'bobjohnson';

-- Insert Admin
INSERT INTO mentor_mentee_system_admin (id, user_id, privileges)
VALUES
(1, 3, 'Full Control');

-- Insert Mentors
INSERT INTO mentor_mentee_system_mentor (id, user_id, room_no, timetable, department, academic_background, post_in_hand)
VALUES
(1, 1, 'Room 205', 'Monday-Friday: 10 AM - 4 PM', 'Computer Science', 'PhD in AI', 'Professor');

-- Insert Mentees
INSERT INTO mentor_mentee_system_mentee (id, user_id, mentor_id, course, year, attendance, academic, upcoming_event, alternate_contact)
VALUES
(1, 2, 1, 'B.Tech CSE', 2, 89.5, 'Good', 'AI Workshop', '9123456780');

-- Insert Achievements
INSERT INTO mentor_mentee_system_achievement (id, mentor_id, mentee_id, name, description, created_at, badge_icon)
VALUES
(1, 1, 1, 'Top Performer', 'Excelled in AI Research', NOW(), 'badge1.png');

-- Insert Messages
INSERT INTO mentor_mentee_system_message (id, sender_id, receiver_id, content, is_read, created_at)
VALUES
(1, 1, 2, 'Keep up the great work!', false, NOW()),
(2, 2, 1, 'Thank you for your guidance!', false, NOW());

-- Insert Meetings
INSERT INTO mentor_mentee_system_meeting (id, mentor_id, mentee_id, title, description, scheduled_at, duration, status, created_at, updated_at)
VALUES
(1, 1, 2, 'Discuss AI Project', 'Bring project documents', NOW() + INTERVAL '3 days', 30, 'pending', NOW(), NOW());

-- Insert Activity Logs
INSERT INTO mentor_mentee_system_activitylog (id, user_id, in_time, out_time, activity_done, key)
VALUES
(1, 1, NOW() - INTERVAL '2 days', NOW() - INTERVAL '1 day', 'Checked mentee reports', NULL);
