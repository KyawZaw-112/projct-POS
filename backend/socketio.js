// socket.js
import { Server } from "socket.io";


export function initSocket(server) {
    // Create Socket.IO server attached to the existing HTTP server
    const io = new Server(server, {
        cors: {
            origin: "*",          // later you can restrict this to your frontend URL
            methods: ["GET", "POST"],
        },
    });

    console.log("✅ Socket.IO server initialized");

    io.on("connection", (socket) => {
        console.log("🔌 Client connected:", socket.id);

        // Simple test event to show in console
        socket.emit("hello", "Hello from Socket.IO server!");

        socket.on("disconnect", () => {
            console.log("❌ Client disconnected:", socket.id);
        });
    });

    // Return io so index.js can use it to emit events
    return io;
}
