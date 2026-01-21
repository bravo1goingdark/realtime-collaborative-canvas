# Real-Time Collaborative Canvas

This is a real-time collaborative canvas application where multiple users can draw and erase on a shared canvas.

## Setup Instructions

To get the project up and running, follow these steps:

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
    To run the application, you need to start the client (frontend) and the server (backend) separately.

    a.  **Start the client:**
        *   Open a terminal and navigate to the project root directory:
            ```bash
            cd realtimecanvas
            ```
        *   Run the client development server using the npm script:
            ```bash
            npm run client
            ```
        *   The client will typically be available at `http://localhost:5173` (the port might vary).

    b.  **Start the server:**
        *   Open another terminal and navigate to the project root directory:
            ```bash
            cd realtimecanvas
            ```
        *   Run the WebSocket server using the npm script:
            ```bash
            npm run server
            ```

## How to Test with Multiple Users

To test the collaborative features with multiple users:

1.  **Open multiple browser tabs or windows:** After starting the application, open `http://localhost:5173` in several different browser tabs or even different browsers.
2.  **Interact on each tab:** Each tab represents a different user. You can draw and erase on the canvas in one tab, and observe the changes in real-time on all other tabs.
3.  **Test Undo/Redo:**
    *   Perform some drawing operations across different tabs.
    *   In any one tab, click "Undo" or use `Ctrl+Z`. Observe that the last operation, regardless of which user performed it, is undone on all connected clients.
    *   Click "Redo" or use `Ctrl+Y` to restore the undone operation across all clients.

## Features

-   **Quadratic Bézier Smoothing**: To enhance the drawing experience, brush strokes are rendered using Quadratic Bézier curves. This provides a smoother, more natural appearance to the lines drawn on the canvas, improving the overall aesthetic quality.

## Known Limitations/Bugs

*   **No user authentication/identification**: Currently, all users are anonymous. There is no mechanism to identify individual users beyond a randomly generated `userId` for internal tracking.
*   **Basic Drawing Tools**: Only basic brush and eraser tools are available. There are no options for changing colors, brush sizes, or other drawing features from the UI (though these are hardcoded in the client).
*   **No persistence beyond server restart**: The drawing state is held in memory on the server. If the server restarts, the entire drawing history for all rooms is lost.
*   **Limited Error Handling on Client**: While the server validates incoming operations, the client's error handling for network issues or invalid server responses is basic.
*   **No Room Listing**: Users must know the `roomId` beforehand (currently hardcoded as "room1"). There's no UI to create, list, or select different rooms.
*   **Performance for Very High Load**: While designed for real-time, very high-frequency input from many concurrent users might expose performance bottlenecks not currently optimized for.

## Time Spent on the Project

Approximately 3 days were spent on this project, focusing on implementing the core real-time collaborative drawing functionality, WebSocket communication, undo/redo logic, and server-side state management.


