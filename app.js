const express = require("express");
const app = express();
const PORT = 3000;

app.use(express.json());

let students = [];
let nextId = Date.now();

const validateCreate = (body) => {
  const { name, age, email, course } = body;
  if (!name || !age || !email || !course) {
    return "name, age, email, and course are all required";
  }
  return null;
};

const validateUpdate = (body) => {
  if (!body || Object.keys(body).length === 0) {
    return "request body cannot be empty";
  }
  return null;
};

const isStudentAvailable = (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    res.status(400).json({ error: "id must be a number" });
    return null;
  }
  const student = students.find((s) => s.id === id);
  if (!student) {
    res.status(404).json({ error: `Student with id ${id} not found` });
    return null;
  }
  return student;
};

//Add a new student
app.post("/students", (req, res) => {
  const error = validateCreate(req.body);
  if (error) {
    return res.status(400).json({ error });
  }

  const { name, age, email, course } = req.body;
  const newStudent = { id: nextId++, name, age, email, course };

  students.push(newStudent);
  res.status(201).json(newStudent);
});

//Get all students
app.get("/students", (req, res) => {
  res.json(students);
});

//Get a student by ID
app.get("/students/:id", (req, res) => {
  const student = isStudentAvailable(req, res);
  if (!student) return; // response already sent
  res.json(student);
});

//Update student information
app.patch("/students/:id", (req, res) => {
  const student = isStudentAvailable(req, res);
  if (!student) return;

  const error = validateUpdate(req.body);
  if (error) {
    return res.status(400).json({ error });
  }

  const { name, age, email, course } = req.body;
  if (name !== undefined) student.name = name;
  if (age !== undefined) student.age = age;
  if (email !== undefined) student.email = email;
  if (course !== undefined) student.course = course;

  res.json(student);
});

//Full replace of student information
app.put("/students/:id", (req, res) => {
  const student = isStudentAvailable(req, res);
  if (!student) return;

  const error = validateCreate(req.body);
  if (error) {
    return res.status(400).json({ error });
  }

  const { name, age, email, course } = req.body;
  student.name = name;
  student.age = age;
  student.email = email;
  student.course = course;

  res.json(student);
});

//Delete a student
app.delete("/students/:id", (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    return res.status(400).json({ error: "id must be a number" });
  }

  const index = students.findIndex((s) => s.id === id);
  if (index === -1) {
    return res.status(404).json({ error: `Student with id ${id} not found` });
  }

  const [deleted] = students.splice(index, 1);
  res.json({ message: "Student deleted", student: deleted });
});

app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
