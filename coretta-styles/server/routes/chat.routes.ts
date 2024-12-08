import express from 'express';
import ChatService from '../services/chat.service';

const router = express.Router();

router.post('/chat', async (req, res) => {
    try {
        const { messages } = req.body;
        const chatService = ChatService.getInstance();
        const response = await chatService.generateResponse(messages);
        res.json({ response });
    } catch (error: any) {
        console.error('Chat endpoint error:', error);
        res.status(500).json({ 
            error: 'Failed to process chat request',
            details: error.message
        });
    }
});

export default router; 

</```rewritten_file>