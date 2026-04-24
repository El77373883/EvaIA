export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: 'Falta mensaje' });
  try {
    const r = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + process.env.GROQ_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: 'Responde siempre en español. Eres Mistral, una IA experta.' },
          { role: 'user', content: message }
        ],
        max_tokens: 1500
      })
    });
    const d = await r.json();
    res.status(200).json({ answer: d.choices?.[0]?.message?.content || 'No respondió' });
  } catch(e) {
    res.status(200).json({ answer: 'Error: ' + e.message });
  }
}