USE business_db;

INSERT INTO department (name)
VALUES ("Engineering"),("Front Desk"), ("Sales"), ("C-Suite");

INSERT INTO role (title, salary, department_id)
VALUES ("Junior Developer", 65000, 1),("Phone Person", 45000, 2),("Sales Exec", 85000, 3),("CTO", 125000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Levi", "Kane", 1, NULL),("Bob", "Smith", 2, NULL),("Tony", "Louis", 2, 2),("Billy", "Bob", 3, NULL),("Chris", "White", 4, NULL);