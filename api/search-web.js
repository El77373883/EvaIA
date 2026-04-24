export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
    
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: 'Falta mensaje' });

    try {
        const response = await fetch('https://api.tavily.com/search', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + process.env.TAVILY_API_KEY
            },
            body: JSON.stringify({
                query: message,
                search_depth: 'basic',
                include_answer: true,
                max_results: 3
            })
        });

        const data = await response.json();
        let answer = data.answer || '';
        
        if (data.results && data.results.length > 0) {
            answer += '\n\n📎 **Fuentes:**\n';
            data.results.forEach(function(r) {
                answer += '\n- ' + r.title + ': ' + r.url;
            });
        }
        
        res.status(200).json({ answer: answer || 'No encontré resultados.' });
    } catch (error) {
        res.status(200).json({ answer: null });
    }
}