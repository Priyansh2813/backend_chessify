import express, { Request, Response } from 'express';
import http from 'http';
import WebSocket, { WebSocketServer } from 'ws';
import path from 'path';
import { ChessGame } from './ChessGame';

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

let waitingUser: WebSocket | null = null;
const gameChess = new ChessGame();
wss.on('connection', (socket) => {
  console.log('A user connected.');
  
  gameChess.addUser(socket);


});

app.use(express.static(path.join(__dirname, 'public')));

// Serve the HTML file for the client
app.get('/', (req: Request, res: Response) => {
  res.send("Hello This is my Server");
});

server.listen(3000, () => {
  console.log('Server is listening on port 3000');
});