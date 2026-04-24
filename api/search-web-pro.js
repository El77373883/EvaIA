export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: 'Falta mensaje' });
    try {
        const r = await fetch('https://api.duckduckgo.com/?q=' + encodeURIComponent(message) + '&format=json&no_html=1&skip_disambig=1');
        const d = await r.json();
        let answer = '';
        
        if (d.AbstractText) answer = d.AbstractText + '\n📎 ' + d.AbstractURL;
        else if (d.RelatedTopics && d.RelatedTopics.length > 0) {
            answer = '📎 Resultados:\n';
            d.RelatedTopics.slice(0, 5).forEach(function(t) {
                if (t.Text) answer += '\n- ' + t.Text + '\n  ' + t.FirstURL;
            });
        }
        res.status(200).json({ answer: answer || 'No encontré resultados. Prueba con otras palabras.' });
    } catch(e) { res.status(200).json({ answer: 'Error de conexión con DuckDuckGo.' }); }
}