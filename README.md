# InterviewAI - Mock Interview Agent

An AI-powered mock interview platform that simulates real technical interviews using Groq's LLM API.

## Live Demo

**https://mock-ai-interviewers-agent.vercel.app/**

## Features

- 10-question mock interviews across 12 domains (Software Engineering, System Design, Frontend, Backend, Data Science, DevOps, Mobile, Database, Cybersecurity, Product, Behavioral, and more)
- Resume upload support (.pdf, .docx, .txt) to personalize questions
- Real-time hints, sample answers, and scoring (1–10)
- Multi-model fallback pool (Llama, Mixtral, Gemma) via Groq
- Hindi translation support
- Detailed final report with grade and hiring recommendation

## Tech Stack

- **Backend:** Node.js, Express
- **AI:** Groq SDK (Llama 3.3 70B, Llama 4, Mixtral, Gemma)
- **Deployment:** Vercel

## Getting Started

```bash
# Install dependencies
npm install

# Add your Groq API key
echo "GROQ_API_KEY=your_key_here" > .env

# Run locally
npm start
```

App runs at `http://localhost:3000`

## Environment Variables

| Variable | Description |
|---|---|
| `GROQ_API_KEY` | Your Groq API key from console.groq.com |
