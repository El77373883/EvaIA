export default async function handler(req, res) {
    const { q } = req.query;
    if (!q) return res.status(400).json({ error: 'Falta query' });

    try {
        const url = `https://api.duckduckgo.com/?q=${encodeURIComponent(q)}&format=json&no_html=1&skip_disambig=1`;
        const response = await fetch(url, {
            headers: { 'User-Agent': 'Mozilla/5.0' }
        });
        const data = await response.json();
        
        let result = data.AbstractText || data.Answer || '';
        
        if (!result && data.RelatedTopics) {
            for (let t of data.RelatedTopics) {
                if (t.Text && t.Text.length > 20) {
                    result = t.Text;
                    break;
                }
                if (t.Topics) {
                    for (let sub of t.Topics) {
                        if (sub.Text && sub.Text.length > 20) {
                            result = sub.Text;
                            break;
                        }
                    }
                }
                if (result) break;
            }
        }

        res.status(200).json({ answer: result || null });
    } catch (error) {
        res.status(200).json({ answer: null });
    }
}
