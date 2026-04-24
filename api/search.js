export default async function handler(req, res) {
    const { q } = req.query;
    if (!q) return res.status(400).json({ error: 'Falta query' });

    try {
        const url = `https://es.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(q)}`;
        const response = await fetch(url, {
            headers: { 'User-Agent': 'Eva-IA/1.0' }
        });
        const data = await response.json();
        
        if (data.extract && data.extract.length > 20) {
            return res.status(200).json({ answer: data.extract });
        }
        
        res.status(200).json({ answer: null });
    } catch (error) {
        res.status(200).json({ answer: null });
    }
}
