# Real-Time Collaborative Canvas

A simple, real-time collaborative whiteboarding application that allows multiple users to draw together in the same "room." It showcases a server-authoritative architecture using WebSockets for low-latency communication.

![Screenshot of the canvas application](app-screenshot.png)
*(Note: Replace `app-screenshot.png` with an actual screenshot of the application.)*

## Features

-   **Real-Time Collaboration**: See cursors and drawings from other users in real-time.
-   **Core Drawing Tools**: A simple brush and eraser to get you started.
-   **Color Picker**: Choose your brush color from an integrated color picker in the toolbar.
-   **Global Undo/Redo**: Undo or redo drawing actions for everyone in the room.
-   **Smooth Lines**: Brush strokes are smoothed using Quadratic Bézier curves for a more natural, fluid look.
-   **Room-Based Sessions**: State is isolated by rooms, allowing for separate, private drawing sessions (though room selection is not yet in the UI).

## Tech Stack

-   **Frontend**: TypeScript, HTML5 Canvas, Vite
-   **Backend**: Node.js, TypeScript, `ws` library for WebSockets

## Architecture

This project uses a server-authoritative model with an event-sourcing approach. The server is the single source of truth, ensuring all clients stay in sync. For a detailed breakdown of the data flow, conflict resolution strategy, and performance decisions, please see the **[Architecture.md](Architecture.md)** document.

## Setup and Running

To get the project up and running locally, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd realtimecanvas
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Start the application:**
    Run the `start` script to launch both the server and the client concurrently from a single terminal:
    ```bash
    npm start
    ```
    This will handle starting both processes for you. The client will typically be available at `http://localhost:5173`.

## How to Test Collaboration

To see the real-time features in action:

1.  **Open multiple browser tabs**: After starting the application, open the client URL in several different browser tabs.
2.  **Draw!**: Each tab acts as a separate user. Draw on one canvas and watch your strokes appear instantly on the others.
3.  **Test Undo/Redo**: Click "Undo" in any tab. The last operation—regardless of who drew it—will be removed for everyone. "Redo" brings it back.

## Future Improvements

-   **No User Authentication**: All users are currently anonymous. A proper user identification system could be added.
-   **More Drawing Tools**: The UI could be expanded to include options for changing brush/eraser size.
-   **State Persistence**: The canvas state is stored in-memory. If the server restarts, all drawings are lost. A database like Redis or a file-based log could be used for persistence.
-   **Room Management UI**: The `roomId` is currently hardcoded. A UI to create, list, and join different rooms would be a great addition.
-   **Improved Client-Side Error Handling**: The client could more gracefully handle network disconnects or invalid server messages.

## Time Spent on the Project

Approximately 3 days were spent on this project, focusing on implementing the core real-time collaborative drawing functionality, WebSocket communication, undo/redo logic, and server-side state management.


