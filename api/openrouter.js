export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
    
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: 'Falta mensaje' });

    try {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + (process.env.OPENROUTER_API_KEY || 'sk-or-v1-default'),
                'Content-Type': 'application/json',
                'HTTP-Referer': 'https://eva-chat.vercel.app',
                'X-Title': 'Eva Chat'
            },
            body: JSON.stringify({
                model: 'qwen/qwen-2-7b-instruct:free',  // ← MODELO CORREGIDO
                messages: [
                    { role: 'system', content: 'Eres Qwen, una IA asistente. Respondes en español de forma útil y amigable.' },
                    { role: 'user', content: message }
                ],
                max_tokens: 1500
            })
        });

        const data = await response.json();
        const answer = data.choices?.[0]?.message?.content || null;
        res.status(200).json({ answer });
    } catch (error) {
        res.status(200).json({ answer: null });
    }
}