# React Midterm Project: Real-Time Document Editor with Collaboration

## Get Started

### How to start backend server

1. Execute the command to install all libraries 
   `npm install`
1. Get env file (`.env.development`) on Slack and copy and paste it right under backend folder
1. Execute the command to run backend server
   `npm run dev`

### How to start frontend

1. Execute the command to install all libraries 
   `npm install`
1. Execute the command to run backend server
   `npm run dev`

---

## Objective

Build a real-time document editor with collaboration features using Node.js, React, and Socket.io. The application will allow multiple users to edit a document simultaneously and see changes in real-time.

## Demo Video

Watch the demo video to understand the project requirements and see the final application in action:

[![Demo Video](https://img.youtube.com/vi/LWLf8WD3UVw/0.jpg)](https://youtu.be/LWLf8WD3UVw)

> **Note**: The UI does not have to match the demo exactly.

# Project Requirements

## Group Formation

- **Team Size**: Ideally 4 members per group.
- **Collaboration**: Use version control (e.g., GitHub) for managing the codebase.

## Project Structure

Your project should have a monorepo-like structure with the following components:

- **Backend**: A server to handle API requests and manage WebSocket connections using Socket.IO.
- **Frontend**: A React application (Vite) for the document editor interface.

## Tech Stack

### Client

1. **TypeScript**
2. **React with Vite** (Next.js is not recommended)
3. **Web Sockets** (Socket.io)
4. **CSS**
   - Tailwind CSS
   - Shadcn
   - Material UI
   - Other options
5. **Authentication and User Management**
   - Clerk
   - auth0
   - Other options
6. **React-Quill**

### Server

1. **TypeScript**
2. **Express**
3. **Web Sockets** (Socket.io)
4. **Database**
   - Postgres
   - MongoDB
5. **ORM / ODM**
   - Prisma
   - Mongoose

## Features

### Minimum Requirements

- **Document Management**: Create, read, edit, and delete documents.
- **Real-Time Collaboration**: Enable multiple users to edit documents simultaneously with instant updates using WebSockets (e.g., Socket.IO).
- **User Authentication**: Secure authentication system (e.g., Clerk, OAuth, JWT) for managing access and permissions.
- **Collaboration Presence**: Display real-time indicators (e.g., cursors, highlights) and user avatars to show who is currently editing the document.
- **Rich Text Editing**: Provide text formatting options (bold, italics, etc.) using tools like Draft.js or Quill.

### Bonus

- **Version Control**: Track document changes over time, allowing users to view or revert to previous versions.

# Planning Requirements

## MVP (Minimum Viable Product)

- Focus on core features necessary for initial user satisfaction.
- Decide which features will be part of the MVP.
- Keep the implementation as simple as possible.
- Gather feedback and continue development.

## Wireframes

- Create low-fidelity sketches of the user interface without graphics or colors.
- Plan the layout and prioritize content and functionalities.

## Mock Design

> While you're learning to be a developer rather than a designer, a good design is important. Use tools like Figma for your design.

- Create high-fidelity designs.
- Use websites for inspiration:
  - [Dribbble](https://dribbble.com/)
  - [Behance](https://www.behance.net/)
  - [Pinterest](https://www.pinterest.ca/)
  - [Awwwards](https://www.awwwards.com/)
  - [CSS Design Awards](https://www.cssdesignawards.com/)
  - [V0 by Vercel](https://v0.dev/) **⚠️ WARNING: May incur charges after certain usage.**

**Tip:** Seek advice from UI/UX students for your product design.

## Project Management

- Use a project management tool like GitHub Projects.
- Create a project board.
- Add tasks/issues based on user stories.
- Assign tasks to team members.
- Estimate tasks and set deadlines (adjust as needed).

## User Stories

- Define software features from the user's perspective, focusing on delivering value.

> **Example**

**As a** authenticated user,  
**I want to** reorder products based on my purchase history,  
**so that I** don’t have to search for products again.

## Entity-Relationship Diagram (ERD)

- Design an ERD to model relationships between users, documents, and collaboration sessions.

## API Endpoints

- Implement RESTful API endpoints for user authentication, document management, and collaboration features.
- Ensure endpoints are secure and validate input data.

## Communication

- Use a communication tool like Slack.
- Create a project chatroom.
- Add team members and your instructor.
- Use the channel for communication.
- Conduct daily standups:
  - What did you do yesterday?
  - What are you planning to do today?
  - Do you have any blockers?

## Presentation Instructions

1. **Format**:

   - Each group will present their project in a 15-minute presentation.
   - Use slides to support your presentation (e.g., Google Slides, PowerPoint).

2. **Content**:

   - **Introduction**: Introduce your team and give an overview of the project.
   - **Features**: Demonstrate key features of your application.
   - **Technical Details**: Explain the architecture, technologies used, and any challenges faced.
   - **Live Demo**: Show a live demo of your application, highlighting main functionalities.
   - **Conclusion**: Summarize the project and discuss future improvements or additional features.

3. **Q&A**:
   - Be prepared to answer questions from the audience and the instructor.

## Potential Guest

- Grayce, a Career Development Specialist, may attend your presentation. This opportunity could help her understand your skills for future job prospects.

## Deadline

- The project must be submitted by September 23rd.

## Final Notes

- Success or failure is a team effort; support each other.
- If you do not want to lead, support the lead.
- Make decisions as a team.
- Be responsive within half a day.
- Flag any issues promptly.
- Seek help if stuck on a problem for more than an hour.
- Focus on action rather than overthinking.

Good luck! If you have any questions, feel free to reach out to your instructor.
