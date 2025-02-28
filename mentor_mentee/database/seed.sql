-- Insert sample users
INSERT INTO users (email, password, first_name, last_name, role) VALUES
('mentor1@example.com', 'hashed_password', 'John', 'Doe', 'mentor'),
('mentee1@example.com', 'hashed_password', 'Jane', 'Smith', 'mentee');

-- Insert sample achievements
INSERT INTO achievements (name, description) VALUES
('First Meeting', 'Completed first mentorship meeting'),
('Quick Learner', 'Demonstrated exceptional learning ability'); 