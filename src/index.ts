import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import fs from 'fs';
import path from 'path';

const app = express();
const PORT = 7000;
const DB_FILE = path.join(__dirname, 'db.json');

app.use(bodyParser.json());

interface Submission {
  name: string;
  email: string;
  phone: string;
  github_link: string;
  stopwatch_time: string;
}
app.get('/ping', (req: Request, res: Response) => {
  res.send(true);
});

app.post('/submit', (req: Request, res: Response) => {
  const { name, email, phone, github_link, stopwatch_time }: Submission = req.body;

  if (!name || !email || !phone || !github_link || !stopwatch_time) {
    return res.status(400).send({ error: 'All fields are required' });
  }

  const newSubmission: Submission = { name, email, phone, github_link, stopwatch_time };
  const submissions: Submission[] = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));

  submissions.push(newSubmission);
  fs.writeFileSync(DB_FILE, JSON.stringify(submissions, null, 2));

  res.status(201).send({ message: 'Submission saved successfully' });
});

app.get('/read', (req: Request, res: Response) => {
  const index = parseInt(req.query.index as string, 10);
  if (isNaN(index)) {
    return res.status(400).send({ error: 'Index must be a number' });
  }

  const submissions: Submission[] = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));

  if (index < 0 || index >= submissions.length) {
    return res.status(404).send({ error: 'Submission not found' });
  }

  res.send(submissions[index]);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
