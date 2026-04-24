export default async function handler(req, res) {
    const { q } = req.query;
    if (!q) return res.status(400).json({ error: 'Falta query' });

    try {
        const response = await fetch(`https://api.duckduckgo.com/?q=${encodeURIComponent(q)}&format=json&no_html=1&skip_disambig=1`);
        const data = await response.json();
        
        let result = '';
        
        if (data.AbstractText) {
            result = data.AbstractText;
        } else if (data.Answer) {
            result = data.Answer;
        } else if (data.RelatedTopics && data.RelatedTopics.length > 0) {
            result = data.RelatedTopics[0].Text || 'No encontré información clara.';
        } else {
            result = 'No encontré nada sobre eso. ¿Me preguntas otra cosa?';
        }

        res.status(200).json({ answer: result, source: data.AbstractURL || 'DuckDuckGo' });
    } catch (error) {
        res.status(500).json({ error: 'Error al buscar' });
    }
}