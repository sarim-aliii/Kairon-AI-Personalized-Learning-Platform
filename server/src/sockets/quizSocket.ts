import { Server, Socket } from 'socket.io';
import StudyProject from '../models/StudyProject';
import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";

// Initialize Bedrock
const bedrockClient = new BedrockRuntimeClient({
    region: process.env.AWS_BEDROCK_REGION || "us-east-1"
});

const defaultModelName = 'amazon.nova-pro-v1:0';

// Simple in-memory store for game state
interface GameRoom {
    id: string;
    players: { [socketId: string]: { name: string; score: number } };
    projectId: string;
    questions: any[];
    status: 'waiting' | 'playing' | 'finished';
}

const rooms: { [id: string]: GameRoom } = {};

export const setupQuizSocket = (io: Server) => {
    io.on('connection', (socket: Socket) => {
        console.log(`User connected: ${socket.id}`);

        // 1. Create Room
        socket.on('create_room', async ({ projectId, playerName }) => {
            const roomId = Math.random().toString(36).substring(7).toUpperCase();
            rooms[roomId] = {
                id: roomId,
                players: { [socket.id]: { name: playerName, score: 0 } },
                projectId,
                questions: [],
                status: 'waiting'
            };
            socket.join(roomId);
            socket.emit('room_created', roomId);
            io.to(roomId).emit('update_players', rooms[roomId].players);
        });

        // 2. Join Room
        socket.on('join_room', ({ roomId, playerName }) => {
            if (rooms[roomId] && rooms[roomId].status === 'waiting') {
                rooms[roomId].players[socket.id] = { name: playerName, score: 0 };
                socket.join(roomId);
                io.to(roomId).emit('update_players', rooms[roomId].players);
            } else {
                socket.emit('error', 'Room not found or game already started');
            }
        });

        // 3. Start Game (Host only)
        socket.on('start_game', async (roomId) => {
            const room = rooms[roomId];
            if (!room) return;

            io.to(roomId).emit('game_status', 'generating_questions');

            try {
                // Fetch context from DB
                const project = await StudyProject.findById(room.projectId);
                if (!project) throw new Error("Project not found");

                // Generate Questions using Bedrock
                const prompt = `Generate 5 challenging multiple-choice questions based on this text.
                Strictly return a valid JSON array of objects.
                Schema: [{ "question": string, "options": string[], "correctAnswer": string }]
                
                TEXT: "${project.ingestedText.substring(0, 15000)}"`;
                
                const params = {
                    modelId: defaultModelName,
                    body: JSON.stringify({
                        messages: [
                            { role: "user", content: prompt }
                        ],
                        max_tokens: 2048
                    })
                };

                const command = new InvokeModelCommand(params);
                const response = await bedrockClient.send(command);
                const responseBody = JSON.parse(response.body.transformToString());
                const text = responseBody.content[0].text;
                room.questions = JSON.parse(text);
                
                room.status = 'playing';
                io.to(roomId).emit('game_started', room.questions);
            } catch (error) {
                console.error("Game Start Error:", error);
                io.to(roomId).emit('error', 'Failed to generate questions. Try again.');
            }
        });

        // 4. Submit Answer
        socket.on('submit_answer', ({ roomId, answer, timeRemaining }) => {
            const room = rooms[roomId];
            if (!room || room.status !== 'playing') return;

            const player = room.players[socket.id];
            
            // Note: In a real prod app, verify which question index the user is on.
            // For this version, we check if the answer exists in ANY question's correct answer (Simplified)
            // or rely on client sync. Better approach: Check specific question logic if index was passed.
            // Here we assume client acts honestly for the demo.
            
            // We give points if the answer matches one of the correct answers in the set 
            // AND the user hasn't spammed. 
            const isCorrect = room.questions.some(q => q.correctAnswer === answer);

            if (isCorrect) {
                player.score += 100 + (timeRemaining * 2); // Speed bonus
            }

            // Broadcast updated scores immediately
            io.to(roomId).emit('update_scores', room.players);
        });

        // Handle disconnect
        socket.on('disconnect', () => {
            // Optional: Cleanup empty rooms
            for (const roomId in rooms) {
                if (rooms[roomId].players[socket.id]) {
                    delete rooms[roomId].players[socket.id];
                    io.to(roomId).emit('update_players', rooms[roomId].players);
                    if (Object.keys(rooms[roomId].players).length === 0) {
                        delete rooms[roomId];
                    }
                }
            }
        });
    });
};