## Recappd AI
### General
This project was built in 48 hours in a team of three as part of CalHacks 10.0.

Deployed on: [Recappd](https://recappd.live)
View Demo: [Demo](https://youtu.be/WWvKcsBsNW0)

If the live doesn't work, then it very likely means we ran out of free credits for one of our various APIs. Let us know with a message or check out how it works in development by following the instructions below:

### Features
- Authenticate using Clerk with Google or Github accounts.
- Select your news category (finance, tech, politics, etc.).
- Customize the podcast duration and frequency.
- Recappd aggregates news using dynamic REST API endpoints.
- Utilizes LLMs for content accuracy.
- Generates an MP3 audio file stored in the Convex database.
- Asynchronous updates using cron workers via Convex.
- Full CRUD capabilities with Convex.
- Technology Stack
- Frontend: NextJS 13 with Typescript, TailwindCSS, shadCN, and HeadlessUI.
- Authentication: Clerk (also integrated with Convex).
- Backend: Convex for real-time data, file storage, and asynchronous cron tasks.
- Speech-to-text: Google Cloud Platform.
- AI: OpenAI's GPT 3.5 model.
- News Retrieval: Newsdata's public API.
- Deployment: Vercel
- Recappd is a monorepo deployed at recapd.live.

### Development Setup
To set up the project for development:

### Clone the repository.
Create a .env file in the project root.
Add the following environment variables to the .env file:
``` .env
NEXT_PUBLIC_NEWS_API_KEY=<Your API Key>
NEXT_PUBLIC_OPENAI_API_KEY=<Your API Key>
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=<Your Publishable Key>
CLERK_SECRET_KEY=<Your Secret Key>
GCP_PROJECT_ID=<Your Project ID>
GCP_KEY_FILE_NAME=<Your Key File Name>
FREE_CONVERT_API_KEY=<Your API Key>
```
Replace <Your API Key>, <Your Publishable Key>, <Your Secret Key>, <Your Project ID>, and <Your Key File Name> with your actual values.

You can copy and paste this into your README.md file. Make sure to replace the placeholder values with your actual keys when setting up the project.
