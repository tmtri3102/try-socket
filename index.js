import express from "express";
import { createServer } from "node:http";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { Server } from "socket.io"; // send and receive any events you want

import sqlite3 from "sqlite3";
import { open } from "sqlite";

const app = express();
const server = createServer(app); // Express initializes app to be a function handler that you can supply to an HTTP server
const io = new Server(server, {
	connectionStateRecovery: {},
}); // initialize a new instance of socket.io by passing the server (the HTTP server) object

// Calling res.send() and passing it a string of HTML:
// app.get("/", (req, res) => {
// 	res.send("<h1>Hello world</h1>");
// }); // We define a route handler / that gets called when we hit our website home. (server send/respond 'Hello World' to current '/' page: localhost:3000)
const __dirname = dirname(fileURLToPath(import.meta.url));

// Calling res.sendFile() and passing it an entire HTML file name, not just 'Hello World' (sendFile not send)
app.get("/", (req, res) => {
	res.sendFile(join(__dirname, "index.html"));
});

io.on("connection", (socket) => {
	// console.log("a user connected"); // listen on the connection event for incoming sockets and log it to the console.
	socket.on("chat message", (msg) => {
		io.emit("chat message", msg); // io.emit để display onscreen
		console.log("message: " + msg); // connect với key ở socket.emit
	});
});
server.listen(3000, () => {
	console.log("server running at http://localhost:3000");
}); // We make the http server listen on port 3000.

/////////////////////////////
// Client

// socket.emit('hello', 'world');

// Server

// io.on('connection', (socket) => {
//   socket.on('hello', (arg) => {
//     console.log(arg); // 'world'
//   });
// });

// a Socket.IO client is not always connected
// a Socket.IO server does not store any event
///////////////////////////////////

// open the database file
const db = await open({
	filename: "chat.db",
	driver: sqlite3.Database,
});

// create our 'messages' table (you can ignore the 'client_offset' column for now)
await db.exec(`
  CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      client_offset TEXT UNIQUE,
      content TEXT
  );
`);
