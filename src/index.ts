import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const app = express();
const PORT = process.env.PORT || 7000;
const DB_FILE = path.join(__dirname, 'db.json');

app.use(bodyParser.json());

interface Submissions {
  id: string;
  Name: string;
  Email: string;
  Phone: string;
  GitHubLink: string;
  StopwatchTime: string;
}

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

app.get('/', (req: Request, res: Response) => {
  res.send("Server is ready!");
});

app.get('/ping', (req: Request, res: Response) => {
  res.send(true);
});

app.post('/submit', (req: Request, res: Response) => {
  console.log('Received request to /submit');
  console.log('Request body:', req.body); // Log the request body

  const { Name, Email, Phone, GitHubLink, StopwatchTime }: Submissions = req.body;

  // Validate required fields
  // if (!Name || !Email || !Phone || !GitHubLink || !StopwatchTime) {
  //   console.error('Validation error: Missing required fields');
  //   return res.status(400).send({ error: 'All fields are required' });
  // }

  const newSubmission: Submissions = {id: uuidv4(),Name, Email, Phone, GitHubLink, StopwatchTime };
  let submissions: Submissions[] = [];

  try {
    if (fs.existsSync(DB_FILE)) {
      submissions = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
    }
  } catch (error) {
    console.error('Error reading file:', error);
    return res.status(500).send({ error: 'Error reading submissions' });
  }

  submissions.push(newSubmission);

  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(submissions, null, 2));
    res.status(201).send({ message: 'Submission saved successfully' });
    console.log("Data saved successfully in db.json file")
  } catch (error) {
    console.error('Error writing file:', error);
    res.status(500).send({ error: 'Error saving submission' });
  }
});

app.get('/read', (req: Request, res: Response) => {
  try {
    const submissions: Submissions[] = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
    res.send(submissions);
  } catch (error) {
    console.error('Error reading file:', error);
    res.status(500).send({ error: 'Error reading submissions' });
  }
});

app.delete('/delete/:id', (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    let submissions: Submissions[] = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));

    // Filter submissions to exclude the one with the matching ID
    const newSubmissions = submissions.filter(submission => submission.id !== id);

    // If no submission was removed, return 404 Not Found
    if (newSubmissions.length === submissions.length) {
      return res.status(404).send({ error: 'Submission not found' });
    }

    // Write updated submissions array back to the file
    fs.writeFileSync(DB_FILE, JSON.stringify(newSubmissions, null, 2));

    // Return success response
    res.status(200).send({ message: 'Submission deleted successfully' });
    console.log("Current Form Sucessfully Deleted!")
  } catch (error) {
    console.error('Error deleting submission:', error);
    res.status(500).send({ error: 'Error deleting submission' });
  }
});

