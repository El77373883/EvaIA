export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
    
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: 'Falta mensaje' });

    try {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + process.env.GROQ_API_KEY,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'llama-3.3-70b-versatile',
                messages: [
                    { role: 'system', content: 'Eres Mistral, IA europea experta. Responde en español con precisión y claridad.' },
                    { role: 'user', content: message }
                ],
                max_tokens: 1500
            })
        });
        const data = await response.json();
        res.status(200).json({ answer: data.choices?.[0]?.message?.content || null });
    } catch (error) {
        res.status(200).json({ answer: null });
    }
}