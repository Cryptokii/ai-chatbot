import { OpenAI } from 'openai';
import { rateLimit } from 'express-rate-limit';
import dotenv from 'dotenv';
import express from 'express';

dotenv.config();

const router = express.Router();

// Initialize OpenAI
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Rate limiting middleware
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});

router.use(limiter);

// Chat endpoint
router.post('/chat', async (req, res) => {
    try {
        const { messages } = req.body;

        if (!messages || !Array.isArray(messages)) {
            return res.status(400).json({ error: 'Invalid messages format' });
        }

        // Convert messages to OpenAI format
        const formattedMessages = messages.map(msg => ({
            role: msg.role,
            content: msg.content
        }));

        // Add system message for context
        formattedMessages.unshift({
            role: 'system',
            content: 'You are a helpful fashion assistant for Coretta Styles, an online clothing store. Help customers with style advice, sizing, and product recommendations.'
        });

        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: formattedMessages,
            temperature: 0.7,
            max_tokens: 150
        });

        const response = completion.choices[0]?.message?.content || 'I apologize, but I cannot provide a response at this time.';
        res.json({ response });

    } catch (error) {
        console.error('OpenAI API error:', error);
        res.status(500).json({ error: 'Failed to get response from AI' });
    }
});

export default router;
