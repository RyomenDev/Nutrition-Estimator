## 🗞️ NewsMate — Client (Frontend)
![Image](https://github.com/user-attachments/assets/379ef838-ab02-40c4-a15f-97a7425f2bcd)

NewsMate is a responsive, modern web client built using React, Vite, and Tailwind CSS. It provides a conversational interface for querying the latest news, backed by a powerful Retrieval-Augmented Generation (RAG) system running on the server.

This frontend communicates with the backend via REST APIs and WebSockets, maintains per-session histories, and renders chatbot responses in markdown.

## 🚀 Features

- 💬 Real-time chatbot UI with session-based history.
- 🔁 Automatic reconnection and error feedback using sonner.
- 📦 API communication via axios.
- 🧩 Dynamic layouts with react-resizable-panels.
- 🧭 Client-side routing with react-router-dom.
- 🎨 Styled using Tailwind CSS and tailwindcss-animate.
- 🖋️ Markdown-based response rendering via react-markdown.

## 📁 Project Structure

```pgsql
client/
├── components/       # Reusable UI components
├── pages/            # Route-specific views
├── services/         # API utilities (axios)
├── App.jsx           # Main app wrapper with routing
└── main.jsx          # Entry point
```

## 🛠️ Setup & Development

**Prerequisites**

- Node.js ≥ 18
- pnpm / yarn / npm

**Install dependencies**

```bash
npm install
```

**Run in development mode**

```bash
npm run dev
```
**Build for production**

```bash
npm run build
```

````
Preview production build
```bash
npm run preview
````

## 🔗 Client-Server Communication
The frontend interacts with the backend via the following endpoints:    
| Route          | Method | Description                       |
| -------------- | ------ | --------------------------------- |
| `/chat`        | `POST` | Send user message to Gemini + RAG |
| `/history/:id` | `GET`  | Retrieve session chat history     |
| `/reset`       | `POST` | Clear a session’s Redis cache     |

<!-- | `/session`     | `GET`  | Create a new session ID           | -->

## 🧠 Noteworthy Design Decisions

- **Session-based architecture:** All conversations are scoped by session ID, enabling persistent and personalized history.
- **Markdown rendering:** Gemini’s markdown responses are rendered using react-markdown for rich formatting.
- **Component separation:** Layout and chat logic are modular to allow scalability and reuse.
- **Resilient UX:** Errors, reconnect attempts, and loading states are handled gracefully.

## 🚧 Potential Improvements
- Add authentication support for persistent user identities.
- Implement advanced message formatting (code blocks, citations).
- Introduce message streaming (Gemini-compatible) for real-time replies.
- Add dark mode toggle and user preferences.

