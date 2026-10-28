/**
 * CHATBOT ROUTES
 * Medical chatbot powered strictly by Pinecone + Groq LLaMA 3 LangChain RAG microservice.
 */

const express = require('express');
const axios = require('axios');
const { getChatbotResponse } = require('../utils/geminiAI');

const router = express.Router();
const rawRagUrl = (process.env.RAG_SERVICE_URL || 'http://localhost:5000/ask').trim().replace(/\/+$/, '');
const RAG_SERVICE_URL = rawRagUrl.endsWith('/ask') ? rawRagUrl : `${rawRagUrl}/ask`;

/**
 * POST /api/chatbot
 * Handles conversational medical inquiries strictly via the Python RAG microservice.
 * Preserves multi-turn conversation context and rejects fallback to generic vision LLMs.
 *
 * @name handleChatMessage
 * @function
 * @param {import('express').Request} req - Express request containing { message: string, history: Array }
 * @param {import('express').Response} res - Express response with { success: boolean, reply: string, engine: string }
 * @returns {Promise<void>}
 */
router.post('/chatbot', async (req, res) => {
  try {
    const { message, history = [] } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        error: 'No message provided',
        reply: 'Please send a message.',
      });
    }

    if (message.length > 1000) {
      return res.status(400).json({
        success: false,
        error: 'Message too long',
        reply: 'Please keep your question under 1000 characters.',
      });
    }

    console.log(`💬 Chatbot RAG query: "${message.substring(0, 60)}..." (History length: ${Array.isArray(history) ? history.length : 0})`);

    // Normalize past chat history turns for the Python RAG microservice
    const formattedHistory = (Array.isArray(history) ? history : [])
      .map(h => {
        if (!h || typeof h !== 'object') return null;
        const role = (h.role === 'user' || h.type === 'user') ? 'user' : 'assistant';
        const content = (h.content || h.text || '').trim();
        return content ? { role, content } : null;
      })
      .filter(Boolean);

    // Call Python Medical-Chatbot RAG microservice (Pinecone / LangChain / Groq LLaMA 3)
    try {
      const ragResponse = await axios.post(
        RAG_SERVICE_URL,
        { query: message.trim(), history: formattedHistory },
        { 
          timeout: 90000, // 90 seconds to tolerate cold starts on free tier hosting (Render/Koyeb)
          headers: { 'Content-Type': 'application/json' }
        }
      );

      if (ragResponse.data && ragResponse.data.answer) {
        console.log('✅ Response generated via Python Medical RAG service');
        return res.json({
          success: true,
          reply: ragResponse.data.answer,
          engine: 'python-medical-rag',
          timestamp: new Date().toISOString(),
        });
      }

      throw new Error('RAG microservice returned an invalid or empty answer format.');

    } catch (ragError) {
      console.warn(`⚠️  Python RAG microservice unavailable (${ragError.message}) — attempting Gemini AI fallback...`);

      // Seamless fallback to Google Gemini Medical AI
      try {
        const geminiReply = await getChatbotResponse(message.trim(), formattedHistory);
        console.log('✅ Response generated via Google Gemini AI fallback');
        return res.json({
          success: true,
          reply: geminiReply,
          engine: 'google-gemini-fallback',
          timestamp: new Date().toISOString(),
        });
      } catch (geminiError) {
        console.error('❌ Gemini fallback also failed:', geminiError.message);

        const isConnRefused = ragError.code === 'ECONNREFUSED';
        let diagnosticMessage = '';
        if (isConnRefused) {
          diagnosticMessage = `Could not connect to Python RAG service, and Gemini fallback reported: ${geminiError.message}`;
        } else {
          diagnosticMessage = `Chatbot error: ${geminiError.message || ragError.message}`;
        }

        return res.status(503).json({
          success: false,
          error: 'CHATBOT_SERVICE_UNAVAILABLE',
          reply: `⚠️ Medical Assistant Notice: ${diagnosticMessage}`,
          engine: 'none'
        });
      }
    }

  } catch (error) {
    console.error('❌ Chatbot server error:', error);
    res.status(500).json({
      success: false,
      error: 'Chatbot error',
      reply: "An internal server error occurred while contacting the RAG system.",
    });
  }
});

// CHATBOT INFO

/**
 * GET /api/chatbot/info
 * Returns metadata detailing active AI capabilities and service configuration.
 *
 * @name getChatbotInfo
 * @function
 * @param {import('express').Request} req - Express request
 * @param {import('express').Response} res - Express response describing engine configuration
 * @returns {void}
 */
router.get('/chatbot/info', (req, res) => {
  res.json({
    success: true,
    info: {
      name: 'MedPulse Medical RAG Assistant',
      version: '3.1.0',
      engine: 'Pinecone Vector DB + Groq LLaMA 3 RAG Pipeline',
      ragServiceUrl: RAG_SERVICE_URL,
      capabilities: [
        'Evidence-based Q&A from Medical Literature & Fleischner Guidelines',
        'CT Scan & Pulmonary Nodule Clinical Interpretation',
        'Context-aware Multi-turn Conversations',
        'Strict RAG Mode (No generic LLM fallback)'
      ],
      disclaimer: 'Educational and clinical diagnostic support only. Consult a physician for definitive diagnosis.'
    },
  });
});

module.exports = router;

