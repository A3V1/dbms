-- Update passwords for existing users
-- Note: These are not properly hashed passwords, but for testing purposes only

-- Update Admin password
UPDATE auth_user
SET password = 'admin123'
WHERE email = 'bobjohnson@college.edu';

-- Update Mentor password
UPDATE auth_user
SET password = 'mentor123'
WHERE email = 'johndoe@college.edu';

-- Update Mentee password
UPDATE auth_user
SET password = 'mentee123'
WHERE email = 'alicesmith@college.edu';

-- Create a new admin user if needed
INSERT INTO auth_user (username, email, password, first_name, last_name, is_staff, is_active, is_superuser, date_joined, last_login)
SELECT 'admin', 'admin@example.com', 'admin123', 'Admin', 'User', true, true, true, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM auth_user WHERE username = 'admin');

-- Update the new admin user with additional fields
UPDATE auth_user
SET official_mail_id = 'admin@example.com',
    phone_number = '9999999999',
    prn_id_no = 'ADMIN001',
    role = 'admin'
WHERE username = 'admin'; 