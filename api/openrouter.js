export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
    
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: 'Falta mensaje' });

    try {
        const response = await fetch('https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + (process.env.HF_API_KEY || 'hf_xxx'),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                inputs: `<s>[INST] Responde en español: ${message} [/INST]`,
                parameters: { max_new_tokens: 500 }
            })
        });

        const data = await response.json();
        const answer = data[0]?.generated_text || null;
        res.status(200).json({ answer });
    } catch (error) {
        res.status(200).json({ answer: null });
    }
}