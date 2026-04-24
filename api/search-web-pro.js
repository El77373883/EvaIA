export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
    
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: 'Falta mensaje' });
    
    try {
        const cleanQuery = message
            .replace(/busca en internet /gi, '')
            .replace(/busca /gi, '')
            .replace(/que es /gi, '')
            .replace(/quien es /gi, '')
            .replace(/que son /gi, '')
            .replace(/\?/g, '')
            .trim();
        
        const r = await fetch('https://api.duckduckgo.com/?q=' + encodeURIComponent(cleanQuery) + '&format=json&no_html=1&skip_disambig=1');
        const d = await r.json();
        let answer = '';
        
        // ✅ CORRECTO: d.Abstract (no d.AbstractText)
        if (d.Abstract && d.Abstract.length > 20) {
            answer = d.Abstract;
            if (d.AbstractURL) answer += '\n\n📎 ' + d.AbstractURL;
        }
        // Respuesta tipo definición
        else if (d.Answer && d.Answer.length > 3) {
            answer = '💡 ' + d.Answer;
        }
        // Definición
        else if (d.Definition && d.Definition.length > 3) {
            answer = d.Definition;
            if (d.DefinitionSource) answer += '\n\n📎 ' + d.DefinitionSource;
        }
        // Temas relacionados
        else if (d.RelatedTopics && d.RelatedTopics.length > 0) {
            answer = '🔍 Resultados encontrados:\n';
            d.RelatedTopics.slice(0, 5).forEach(function(t) {
                if (t.Text) {
                    answer += '\n• ' + t.Text.split(' - ')[0].trim();
                    if (t.FirstURL) answer += '\n  🔗 ' + t.FirstURL;
                }
            });
        } else {
            answer = 'No encontré resultados. Prueba con otras palabras.';
        }
        
        res.status(200).json({ answer: answer });
        
    } catch(e) {
        console.error('Error:', e.message);
        res.status(200).json({ answer: 'Error de conexión con DuckDuckGo.' });
    }
}