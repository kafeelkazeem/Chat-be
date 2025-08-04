"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
dotenv_1.default.config();
const DATABASE_URI = process.env.DATABASE_URI;
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
});
// Socket.IO logic
io.on('connection', (socket) => {
    console.log('🟢 User connected:', socket.id);
    socket.on('sendMessage', (data) => {
        console.log('📨 Message received:', data);
        io.emit('receiveMessage', data); // broadcast to all
    });
    socket.on('disconnect', () => {
        console.log('🔴 User disconnected:', socket.id);
    });
});
mongoose_1.default.connect(DATABASE_URI)
    .then(res => {
    console.log('connected');
})
    .catch(err => console.log('not connected'));
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
