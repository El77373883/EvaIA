export default async function handler(req, res) {
    const { q } = req.query;
    if (!q) return res.status(400).json({ error: 'Falta query' });

    try {
        const url = `https://api.duckduckgo.com/?q=${encodeURIComponent(q)}&format=json&no_html=1&skip_disambig=1&t=eva-ia`;
        
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (compatible; Eva-IA/1.0)',
                'Accept': 'application/json'
            }
        });
        
        const data = await response.json();
        
        let result = '';
        if (data.AbstractText) result = data.AbstractText;
        else if (data.Answer) result = data.Answer;
        else if (data.RelatedTopics && data.RelatedTopics.length > 0) {
            result = data.RelatedTopics[0].Text || '';
        }
        
        if (!result) {
            return res.status(200).json({ answer: null });
        }

        res.status(200).json({ answer: result, source: data.AbstractURL || '' });
    } catch (error) {
        res.status(200).json({ answer: null });
    }
}
