To run the backend server for SLIDELY AI FINAL TASK, follow these steps:

1. Navigate to the Backend Server Directory
Open your terminal and navigate to the backend-server directory and write this code.

```
cd backend-server
npm install
npm start
```
Use tools like Postman or Insomnia to test the following APIs:

Check Server Status:
Endpoint: GET /
Description: Returns a message indicating that the server is ready.

Ping Server:
Endpoint: GET /ping
Description: Returns true to confirm that the server is responsive.

Submit Data:
Endpoint: POST /submit
Description: Submits new data to the server.
Body Parameters: Name, Email, Phone, GitHubLink, StopwatchTime

Read Submissions:
Endpoint: GET /read?index=0
Description: Retrieves all submissions from the server.

Delete Submission:
Endpoint: DELETE /delete/:id
Description: Deletes a submission with the specified ID.
URL Parameter: id (the ID of the submission to delete)


Testing APIs
Open Postman or Insomnia.
Create a new request.
Select the appropriate HTTP method (GET, POST, DELETE).
Set up request headers and body as needed.
Send the request and review the response.
