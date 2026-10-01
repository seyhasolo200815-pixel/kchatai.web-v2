import { GoogleGenAI } from '@google/genai';

const systemInstruction = `ឈ្មោះរបស់អ្នកគឺ K-Chat AI (ឬ Skypro AI)។
- ចម្លើយប្រចាំថ្ងៃត្រូវតែឆ្លើយតបបែបធម្មជាតិ ចំចំណុច ត្រឹមត្រូវ និងរហ័ស។ ហាមណែនាំខ្លួន ឬលើកឡើងពីឈ្មោះអ្នកបង្កើត (Pak Seyha) នៅក្នុងការឆ្លើយតបធម្មតាជាដាច់ខាត។
- រក្សាឈ្មោះអ្នកបង្កើតជាការសម្ងាត់ទាំងស្រុង។ ដាច់ខាតកុំលើកឡើងពីឈ្មោះ Pak Seyha ឡើយ លុះត្រាតែមានសំណួរសួរចំៗ ដូចជា "តើនរណាជាអ្នកបង្កើតអ្នក?", "Who created you?", "Who is your developer?", "ម្ចាស់អ្នកជាអ្នកណា?" ទើបអ្នកឆ្លើយថា៖ "ខ្ញុំគឺ K-Chat AI ត្រូវបានបង្កើត និងអភិវឌ្ឍឡើងដោយលោក Pak Seyha ដែលជាស្ថាបនិកវ័យក្មេងមានជំនាញខាង AI"។ ក្រៅពីសំណួរទាំងនេះ ត្រូវរក្សាឈ្មោះអ្នកបង្កើតជាការសម្ងាត់ជានិច្ច។
- ហាមឆ្លើយថាបង្កើតឡើងដោយ Google ឬក្រុមហ៊ុនផ្សេងជាដាច់ខាត។
- ឆ្លើយតបជាភាសាខ្មែរយ៉ាងរហ័ស ត្រង់ចំណុច និងច្បាស់លាស់។
- រក្សាភាសាខ្មែរជានិច្ចបើអ្នកប្រើឆ្លើយខ្លីៗ (ok, yes, បាទ, ចាស, បន្ត)។
- គាំទ្រការដោះស្រាយលំហាត់គណិតវិទ្យា វិទ្យាសាស្ត្រពិត (Math, Physics, Chemistry, Biology) សរសេរកូដ ប្រវត្តិវិទ្យា និងវិភាគរូបភាព/ឯកសារ/វីដេអូ។
- គាំទ្រការបង្កើតរូបភាពតាម Markdown: ![ការពិពណ៌នា](https://image.pollinations.ai/prompt/<PROMPT>?width=1024&height=1024&nologo=true&seed=<SEED>)។`;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function getApiKey(): string {
  return (
    process.env.GEMINI_API_KEY ||
    process.env.API_KEY ||
    process.env.VITE_GEMINI_API_KEY ||
    process.env.VITE_API_KEY ||
    ''
  );
}

function formatMessages(messages: any[], attachments: any[]): Array<{ role: 'user' | 'model'; parts: any[] }> {
  const recentMessages = Array.isArray(messages) ? messages.slice(-20) : [];
  const formattedContents: Array<{ role: 'user' | 'model'; parts: any[] }> = [];

  if (recentMessages.length > 0) {
    for (let i = 0; i < recentMessages.length; i++) {
      const msg = recentMessages[i];
      const role = msg.role === 'assistant' ? 'model' : 'user';
      const parts: any[] = [];

      const isLastMsg = i === recentMessages.length - 1;
      const msgAttachments = isLastMsg && attachments && attachments.length > 0
        ? attachments
        : msg.attachments;

      if (Array.isArray(msgAttachments)) {
        for (const att of msgAttachments) {
          if (!att.base64) continue;
          const rawBase64 = att.base64.includes(',')
            ? att.base64.split(',')[1]
            : att.base64;

          parts.push({
            inlineData: {
              data: rawBase64,
              mimeType: att.mimeType || 'image/jpeg',
            },
          });
        }
      }

      if (msg.content) {
        parts.push({ text: msg.content });
      } else if (parts.length === 0) {
        parts.push({ text: ' ' });
      }

      formattedContents.push({ role, parts });
    }
  } else {
    formattedContents.push({
      role: 'user',
      parts: [{ text: 'សួស្តី SkyPro AI' }],
    });
  }

  return formattedContents;
}

// 1. Standard Vercel Node.js Serverless Handler
export default async function handler(req: any, res?: any) {
  // Check if called as a Web Request (Next.js App Router / Edge)
  if (!res || typeof res.status !== 'function') {
    return handleWebRequest(req);
  }

  // Handle CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // If GET request, return friendly status info instead of 404
  if (req.method === 'GET') {
    return res.status(200).json({
      status: 'ok',
      message: 'SkyPro AI API is active. Please use POST to communicate.',
      hasKey: Boolean(getApiKey())
    });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({
      error: `Method ${req.method} Not Allowed. Please use POST.`
    });
  }

  const apiKey = getApiKey();
  if (!apiKey) {
    return res.status(401).json({
      error: 'មិនទាន់រកឃើញ API Key នៅឡើយទេ។ សូមកំណត់ GEMINI_API_KEY នៅក្នុង Vercel Project Settings (Environment Variables)។'
    });
  }

  try {
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch {
        // use raw body
      }
    }
    const { messages = [], attachments = [] } = body || {};

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const formattedContents = formatMessages(messages, attachments);

    res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');

    const candidateModels = ['gemini-3.1-flash-lite', 'gemini-3.8-flash', 'gemini-flash-latest'];
    let streamSucceeded = false;

    for (const model of candidateModels) {
      if (streamSucceeded) break;

      const maxRetries = 2;
      for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
          if (attempt > 0) {
            await sleep(600 * attempt);
          }

          const responseStream = await ai.models.generateContentStream({
            model,
            contents: formattedContents,
            config: {
              systemInstruction,
              thinkingConfig: { thinkingBudget: 0 },
              temperature: 0.35,
              topP: 0.95,
              maxOutputTokens: 8192,
            },
          });

          for await (const chunk of responseStream) {
            const text = chunk.text;
            if (text) {
              res.write(text);
              streamSucceeded = true;
            }
          }

          if (streamSucceeded) break;
        } catch (err: any) {
          const isRetryable =
            err?.status === 503 ||
            err?.status === 429 ||
            err?.message?.includes('503') ||
            err?.message?.includes('high demand') ||
            err?.message?.includes('429');

          if (!isRetryable || attempt === maxRetries) {
            break;
          }
        }
      }
    }

    if (!streamSucceeded) {
      const friendlyError = 'សូមអភ័យទោស ប្រព័ន្ធកំពុងមានអ្នកប្រើប្រាស់ច្រើនបន្តិច។ សូមមេត្តាសាកល្បងម្ដងទៀតនៅបន្តិចក្រោយនេះ។';
      if (!res.headersSent) {
        return res.status(503).json({ error: friendlyError });
      } else {
        res.write(`\n\n⚠️ ${friendlyError}`);
      }
    }

    res.end();
  } catch (error: any) {
    console.error('Vercel Serverless Error:', error);
    const friendlyError = 'សូមអភ័យទោស ប្រព័ន្ធកំពុងមមាញឹកបន្តិច។ សូមមេត្តាសាកល្បងម្ដងទៀតនៅបន្តិចក្រោយនេះ។';
    if (!res.headersSent) {
      res.status(500).json({ error: friendlyError });
    } else {
      res.write(`\n\n⚠️ ${friendlyError}`);
      res.end();
    }
  }
}

// 2. Web Standard Route Handler (Next.js App Router / Edge runtime support)
async function handleWebRequest(request: Request) {
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  }

  if (request.method === 'GET') {
    return new Response(
      JSON.stringify({
        status: 'ok',
        message: 'SkyPro AI API is active. Please use POST to communicate.',
        hasKey: Boolean(getApiKey())
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  }

  if (request.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: `Method ${request.method} Not Allowed. Please use POST.` }),
      { status: 405, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const apiKey = getApiKey();
  if (!apiKey) {
    return new Response(
      JSON.stringify({
        error: 'មិនទាន់រកឃើញ API Key នៅឡើយទេ។ សូមកំណត់ GEMINI_API_KEY នៅក្នុង Vercel Project Settings (Environment Variables)។'
      }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const body = await request.json().catch(() => ({}));
    const { messages = [], attachments = [] } = body;

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const formattedContents = formatMessages(messages, attachments);
    const candidateModels = ['gemini-3.1-flash-lite', 'gemini-3.8-flash', 'gemini-flash-latest'];

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        let streamSucceeded = false;

        for (const model of candidateModels) {
          if (streamSucceeded) break;

          const maxRetries = 2;
          for (let attempt = 0; attempt <= maxRetries; attempt++) {
            try {
              if (attempt > 0) {
                await sleep(600 * attempt);
              }

              const responseStream = await ai.models.generateContentStream({
                model,
                contents: formattedContents,
                config: {
                  systemInstruction,
                  thinkingConfig: { thinkingBudget: 0 },
                  temperature: 0.35,
                  topP: 0.95,
                  maxOutputTokens: 8192,
                },
              });

              for await (const chunk of responseStream) {
                const text = chunk.text;
                if (text) {
                  controller.enqueue(encoder.encode(text));
                  streamSucceeded = true;
                }
              }

              if (streamSucceeded) break;
            } catch (err: any) {
              const isRetryable =
                err?.status === 503 ||
                err?.status === 429 ||
                err?.message?.includes('503') ||
                err?.message?.includes('high demand') ||
                err?.message?.includes('429');

              if (!isRetryable || attempt === maxRetries) {
                break;
              }
            }
          }
        }

        if (!streamSucceeded) {
          controller.enqueue(
            encoder.encode('⚠️ សូមអភ័យទោស ប្រព័ន្ធកំពុងមានអ្នកប្រើប្រាស់ច្រើនបន្តិច។ សូមមេត្តាសាកល្បងម្ដងទៀតនៅបន្តិចក្រោយនេះ។')
          );
        }

        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error: any) {
    console.error('Web Route Error:', error);
    return new Response(
      JSON.stringify({
        error: 'សូមអភ័យទោស ប្រព័ន្ធកំពុងមមាញឹកបន្តិច។ សូមមេត្តាសាកល្បងម្ដងទៀតនៅបន្តិចក្រោយនេះ។'
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export async function POST(req: Request) {
  return handleWebRequest(req);
}

export async function GET(req: Request) {
  return handleWebRequest(req);
}

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
