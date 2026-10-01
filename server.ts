import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ limit: '25mb', extended: true }));

// ==========================================
// ១. កន្លែងដាក់ API Key របស់អ្នក (តែមួយកន្លែងនេះគត់)
// ==========================================
const apiKey = process.env.GEMINI_API_KEY || "";

// ការណែនាំ AI (System Instruction)
const systemInstruction = "អ្នកគឺជា K-Chat AI ជំនួយការឆ្លាតវៃកម្រិតកំពូល។ វិភាគរហ័ស ឆ្លើយចំសំណួរភ្លាមៗ ប្រើភាសាខ្មែររលូនមានវិជ្ជាជីវៈ។ បើអ្នកប្រើប្តូរប្រធានបទ ត្រូវឆ្លើយតាមប្រធានបទថ្មីភ្លាម កុំនៅជាប់រឿងចាស់។";

app.post('/api/chat', async (req, res) => {
  try {
    const { messages = [], userText = '', imageBase64 } = req.body;

    // ២. ប្រព័ន្ធគូររូប Free (Pollinations)
    const isDraw = /គូរ|រូប|បង្កើតរូប|draw|image|picture/i.test(userText);
    if (isDraw && !imageBase64) {
      const promptClean = encodeURIComponent(userText);
      const freeImageUrl = `https://image.pollinations.ai/prompt/${promptClean}?width=1024&height=1024&nologo=true`;
      return res.json({
        reply: "នេះជារូបភាពដែលអ្នកបានស្នើសុំ៖",
        imageUrl: freeImageUrl
      });
    }

    if (!apiKey || apiKey === "ដាក់_API_KEY_របស់អ្នកនៅត្រង់នេះ") {
      return res.status(401).json({ error: "សូមដាក់ API Key ត្រឹមត្រូវនៅក្នុង server.ts ជាមុនសិន!" });
    }

    // ៣. ដំណើរការជាមួយ Gemini 2.0 Flash
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      systemInstruction: systemInstruction,
      generationConfig: {
        temperature: 0.5,
        maxOutputTokens: 4096,
      }
    });

    const parts: any[] = [];

    // បើមានរូបភាព Upload មកជាមួយ
    if (imageBase64) {
      parts.push({
        inlineData: {
          data: imageBase64,
          mimeType: "image/jpeg"
        }
      });
    }

    // កាត់យកតែ ៤ សារចុងក្រោយ ដើម្បីការពារកុំឱ្យ AI វង្វេងនឹងរឿងចាស់
    const recentHistory = messages.slice(-4).map((m: any) => `${m.role === 'assistant' ? 'AI' : 'User'}: ${m.text || m.content || ''}`).join('\n');
    if (recentHistory) {
      parts.push(`ប្រវត្តិសន្ទនាកន្លងមក៖\n${recentHistory}`);
    }

    parts.push(`សំណួរចុងក្រោយរបស់ User៖ ${userText}`);

    const result = await model.generateContent(parts);
    return res.json({ reply: result.response.text() });

  } catch (error) {
    console.error("Server Error:", error);
    return res.status(500).json({ error: "ប្រព័ន្ធរវល់ សូមព្យាយាមម្តងទៀត!" });
  }
});

app.listen(PORT, () => {
  console.log(`K-Chat AI កំពុងដំណើរការលើ Port ${PORT}`);
});