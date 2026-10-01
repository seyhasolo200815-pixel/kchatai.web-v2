export default async function handler(req: any, res?: any) {
  // Support both standard Node.js (req, res) and Web Request
  if (res && typeof res.status === 'function') {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }

    const hasKey = Boolean(
      process.env.GEMINI_API_KEY ||
      process.env.API_KEY ||
      process.env.VITE_GEMINI_API_KEY ||
      process.env.VITE_API_KEY
    );

    return res.status(200).json({
      status: 'ok',
      hasKey,
      service: 'K-Chat AI Vercel Serverless',
      time: new Date().toISOString()
    });
  }

  // Web Standard Response (Edge / App Router)
  const hasKey = Boolean(
    process.env.GEMINI_API_KEY ||
    process.env.API_KEY ||
    process.env.VITE_GEMINI_API_KEY ||
    process.env.VITE_API_KEY
  );

  return new Response(
    JSON.stringify({
      status: 'ok',
      hasKey,
      service: 'K-Chat AI Vercel Serverless',
      time: new Date().toISOString()
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    }
  );
}

export async function GET(req: Request) {
  return handler(req);
}
