-- CREATE DATABASE ai_powered_interview_prep_db;
-- DROP DATABASE ai_based_interview_prep_db;

-- CREATE DATABASE ai_based_interview_prep_db;

USE ai_based_interview_prep_db;
SELECT * FROM users;

SELECT * FROM domains;

DESCRIBE domains;

INSERT INTO domains (name, description) VALUES
('Full Stack Development', 'Frontend and backend web application development'),
('Web Development', 'Modern web development technologies and frameworks'),
('Mobile App Development', 'Android and iOS mobile application development'),
('Artificial Intelligence', 'Core artificial intelligence concepts and applications'),
('Machine Learning', 'Machine learning algorithms, models, and applications'),
('AI/ML', 'Artificial intelligence and machine learning concepts'),
('Generative AI', 'LLMs, prompt engineering, RAG, and generative AI applications'),
('Agentic AI', 'AI agents, autonomous systems, tools, and agent workflows'),
('Data Science', 'Data analysis, statistics, visualization, and predictive modeling'),
('Data Engineering', 'Data pipelines, ETL, databases, and big data technologies'),
('Cloud Computing', 'Cloud platforms, deployment, and cloud architecture'),
('DevOps', 'CI/CD, containers, automation, and infrastructure'),
('Cybersecurity', 'Network security, application security, and ethical hacking'),
('Blockchain', 'Blockchain technology, smart contracts, and Web3'),
('Database Management', 'SQL, NoSQL, database design, and optimization'),
('Software Engineering', 'Software development principles, design, testing, and architecture'),
('Computer Networks', 'Networking concepts, protocols, and network security'),
('System Design', 'Scalable systems, architecture, APIs, and distributed systems'),
('Programming', 'Programming fundamentals, problem solving, and coding'),
('Data Structures & Algorithms', 'DSA, algorithms, complexity, and problem solving');


SELECT * FROM questions;
DESCRIBE questions;

INSERT INTO questions
(correct_option, difficulty, expected_answer, marks,
 optiona, optionb, optionc, optiond,
 question, type, domain_id)
SELECT
'B', 'Easy', NULL, 5,
'Java', 'JavaScript', 'Python', 'C++',
'Which language is primarily used for building interactive web pages?',
'MCQ',
id
FROM domains
WHERE name = 'Web Development';

INSERT INTO questions
(correct_option, difficulty, expected_answer, marks,
 optiona, optionb, optionc, optiond,
 question, type, domain_id)
SELECT 'B','Easy',NULL,5,
'Hyper Text Markup Language','High Text Machine Language','Hyperlink Text Markup Language','Home Tool Markup Language',
'What does HTML stand for?','MCQ',id FROM domains WHERE name='Web Development';

INSERT INTO questions
(correct_option, difficulty, expected_answer, marks,
 optiona, optionb, optionc, optiond,
 question, type, domain_id)
SELECT 'C','Easy',NULL,5,
'Java','CSS','JavaScript','Python',
'Which language is mainly used to add interactivity to web pages?','MCQ',id FROM domains WHERE name='Web Development';

INSERT INTO questions
(correct_option, difficulty, expected_answer, marks,
 optiona, optionb, optionc, optiond,
 question, type, domain_id)
SELECT 'A','Easy',NULL,5,
'Cascading Style Sheets','Computer Style Sheets','Creative Style System','Colorful Style Sheets',
'What does CSS stand for?','MCQ',id FROM domains WHERE name='Web Development';

INSERT INTO questions
(correct_option, difficulty, expected_answer, marks,
 optiona, optionb, optionc, optiond,
 question, type, domain_id)
SELECT 'D','Medium',NULL,5,
'GET','POST','PUT','DELETE',
'Which HTTP method is normally used to delete a resource?','MCQ',id FROM domains WHERE name='Web Development';

INSERT INTO questions
(correct_option, difficulty, expected_answer, marks,
 optiona, optionb, optionc, optiond,
 question, type, domain_id)
SELECT 'B','Medium',NULL,5,
'Frontend','Backend','Database','Operating System',
'Which part of a web application usually handles server-side logic?','MCQ',id FROM domains WHERE name='Web Development';

INSERT INTO questions
(correct_option, difficulty, expected_answer, marks,
 optiona, optionb, optionc, optiond,
 question, type, domain_id)
SELECT 'A','Easy',NULL,5,
'DOM','JVM','JDK','API',
'What does DOM stand for in web development?','MCQ',id FROM domains WHERE name='Web Development';

INSERT INTO questions
(correct_option, difficulty, expected_answer, marks,
 optiona, optionb, optionc, optiond,
 question, type, domain_id)
SELECT 'C','Medium',NULL,5,
'FTP','HTTP','HTTPS','SMTP',
'Which protocol provides encrypted communication between a browser and server?','MCQ',id FROM domains WHERE name='Web Development';

INSERT INTO questions
(correct_option, difficulty, expected_answer, marks,
 optiona, optionb, optionc, optiond,
 question, type, domain_id)
SELECT 'B','Easy',NULL,5,
'404','200','500','301',
'Which HTTP status code means a successful request?','MCQ',id FROM domains WHERE name='Web Development';

INSERT INTO questions
(correct_option, difficulty, expected_answer, marks,
 optiona, optionb, optionc, optiond,
 question, type, domain_id)
SELECT 'D','Medium',NULL,5,
'Local Storage','Cookies','Session Storage','All of the above',
'Which browser mechanisms can be used to store client-side data?','MCQ',id FROM domains WHERE name='Web Development';

INSERT INTO questions
(correct_option, difficulty, expected_answer, marks,
 optiona, optionb, optionc, optiond,
 question, type, domain_id)
SELECT 'A','Medium',NULL,5,
'Responsive Design','Waterfall Design','Static Design','Linear Design',
'What design approach allows websites to adapt to different screen sizes?','MCQ',id FROM domains WHERE name='Web Development';

INSERT INTO questions
(correct_option, difficulty, expected_answer, marks,
 optiona, optionb, optionc, optiond,
 question, type, domain_id)
SELECT 'C','Easy',NULL,5,
'JSON','HTML','XML','CSS',
'Which format is commonly used for exchanging data between frontend and backend?','MCQ',id FROM domains WHERE name='Web Development';

INSERT INTO questions
(correct_option, difficulty, expected_answer, marks,
 optiona, optionb, optionc, optiond,
 question, type, domain_id)
SELECT 'D','Medium',NULL,5,
'API','DOM','CSS','REST',
'Which architecture style is commonly used for web APIs?','MCQ',id FROM domains WHERE name='Web Development';

INSERT INTO questions
(correct_option, difficulty, expected_answer, marks,
 optiona, optionb, optionc, optiond,
 question, type, domain_id)
SELECT 'A','Easy',NULL,5,
'Browser','Compiler','Database','Server',
'Which software is used to display web pages to users?','MCQ',id FROM domains WHERE name='Web Development';

INSERT INTO questions
(correct_option, difficulty, expected_answer, marks,
 optiona, optionb, optionc, optiond,
 question, type, domain_id)
SELECT 'B','Medium',NULL,5,
'SQL','JavaScript','HTML','CSS',
'Which technology can be used to make asynchronous requests from a web page?','MCQ',id FROM domains WHERE name='Web Development';

INSERT INTO questions
(correct_option, difficulty, expected_answer, marks,
 optiona, optionb, optionc, optiond,
 question, type, domain_id)
SELECT 'C','Easy',NULL,5,
'Frontend','Database','Backend','Browser',
'Node.js is primarily used for which part of web development?','MCQ',id FROM domains WHERE name='Web Development';

INSERT INTO questions
(correct_option, difficulty, expected_answer, marks,
 optiona, optionb, optionc, optiond,
 question, type, domain_id)
SELECT 'A','Medium',NULL,5,
'Cross-Origin Resource Sharing','Cross-Origin Resource Security','Common Online Resource Sharing','Client-Origin Request Service',
'What does CORS stand for?','MCQ',id FROM domains WHERE name='Web Development';

INSERT INTO questions
(correct_option, difficulty, expected_answer, marks,
 optiona, optionb, optionc, optiond,
 question, type, domain_id)
SELECT 'D','Medium',NULL,5,
'Cache','Cookie','Token','Session',
'Which mechanism commonly maintains user state across HTTP requests?','MCQ',id FROM domains WHERE name='Web Development';

INSERT INTO questions
(correct_option, difficulty, expected_answer, marks,
 optiona, optionb, optionc, optiond,
 question, type, domain_id)
SELECT 'B','Easy',NULL,5,
'Frontend Framework','Database','Operating System','Compiler',
'React is primarily used for building what?','MCQ',id FROM domains WHERE name='Web Development';

INSERT INTO questions
(correct_option, difficulty, expected_answer, marks,
 optiona, optionb, optionc, optiond,
 question, type, domain_id)
SELECT 'C','Medium',NULL,5,
'SQL','GraphQL','REST API','FTP',
'Which is commonly used to design APIs using HTTP resources and methods?','MCQ',id FROM domains WHERE name='Web Development';

INSERT INTO questions
(correct_option, difficulty, expected_answer, marks,
 optiona, optionb, optionc, optiond,
 question, type, domain_id)
SELECT 'A','Medium',NULL,5,
'Authentication','Compilation','Rendering','Routing',
'Which process verifies the identity of a user?','MCQ',id FROM domains WHERE name='Web Development';

INSERT INTO questions
(correct_option, difficulty, expected_answer, marks,
 optiona, optionb, optionc, optiond,
 question, type, domain_id)
SELECT 'D','Medium',NULL,5,
'Authorization','Authentication','Encryption','Validation',
'Which process determines what an authenticated user is allowed to access?','MCQ',id FROM domains WHERE name='Web Development';

INSERT INTO questions
(correct_option, difficulty, expected_answer, marks,
 optiona, optionb, optionc, optiond,
 question, type, domain_id)
SELECT 'B','Easy',NULL,5,
'Frontend','Backend','Hardware','Firmware',
'Which layer is responsible for the user interface of a web application?','MCQ',id FROM domains WHERE name='Web Development';

INSERT INTO questions
(correct_option, difficulty, expected_answer, marks,
 optiona, optionb, optionc, optiond,
 question, type, domain_id)
SELECT 'C','Medium',NULL,5,
'Minification','Encryption','Bundling','Authentication',
'Which technique reduces JavaScript and CSS file size for production?','MCQ',id FROM domains WHERE name='Web Development';

INSERT INTO questions
(correct_option, difficulty, expected_answer, marks,
 optiona, optionb, optionc, optiond,
 question, type, domain_id)
SELECT 'A','Medium',NULL,5,
'API','IDE','DNS','URL',
'What is commonly used as an interface for communication between software components?','MCQ',id FROM domains WHERE name='Web Development';

SELECT * FROM questions;
SELECT * FROM answers;

DESCRIBE answers;
SELECT * FROM answers;

SELECT id, name
FROM domains
WHERE name = 'Web Development';

CREATE TABLE audio_questions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    question TEXT NOT NULL,

    difficulty VARCHAR(20) NOT NULL,

    domain_id BIGINT NOT NULL,

    marks INT DEFAULT 10,

    CONSTRAINT fk_audio_question_domain
        FOREIGN KEY (domain_id)
        REFERENCES domains(id)
);

ALTER TABLE answers
MODIFY question_id BIGINT NULL;

ALTER TABLE answers
ADD COLUMN audio_question_id BIGINT NULL;

ALTER TABLE answers
ADD CONSTRAINT fk_answer_audio_question
FOREIGN KEY (audio_question_id)
REFERENCES audio_questions(id);
