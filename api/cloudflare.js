export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
    
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: 'Falta mensaje' });

    try {
        const response = await fetch(
            `https://api.cloudflare.com/client/v4/accounts/${process.env.CF_ACCOUNT_ID}/ai/run/@cf/meta/llama-3-8b-instruct`,
            {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + process.env.CF_API_TOKEN,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    messages: [
                        { role: 'system', content: 'Responde en español.' },
                        { role: 'user', content: message }
                    ]
                })
            }
        );

        const data = await response.json();
        const answer = data.result?.response || null;
        res.status(200).json({ answer });
    } catch (error) {
        res.status(200).json({ answer: null });
    }
}