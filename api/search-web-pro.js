export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message } = req.body;
  if (!message || message.trim().length < 2) {
    return res.status(400).json({ error: 'Falta mensaje' });
  }

  try {
    const cleanQuery = message
      .replace(/busca en internet|busca|que es|quien es|que son|\?/gi, '')
      .trim();

    const r = await fetch(
      'https://api.duckduckgo.com/?q=' + encodeURIComponent(cleanQuery) + '&format=json&no_html=1&skip_disambig=1',
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; EvaIA/1.0)',
          'Accept': 'application/json'
        }
      }
    );

    // Leer como texto primero, luego parsear
    const text = await r.text();
    if (!text || text.trim().length === 0) {
      return res.status(200).json({ answer: 'No encontré resultados para esa búsqueda.' });
    }

    let d;
    try {
      d = JSON.parse(text);
    } catch {
      return res.status(200).json({ answer: 'No encontré resultados para esa búsqueda.' });
    }

    let answer = '';

    if (d.Abstract && d.Abstract.length > 10) {
      answer = d.Abstract;
      if (d.AbstractURL) answer += '\n\nFuente: ' + d.AbstractURL;
    } else if (d.AbstractText && d.AbstractText.length > 10) {
      answer = d.AbstractText;
    } else if (d.RelatedTopics && d.RelatedTopics.length > 0) {
      answer = 'Resultados:';
      d.RelatedTopics.slice(0, 5).forEach(t => {
        if (t.Text) answer += '\n- ' + t.Text.split(' - ')[0].trim();
      });
    } else {
      answer = 'No encontré resultados para esa búsqueda.';
    }

    res.status(200).json({ answer });

  } catch (e) {
    console.error('DDG error:', e.message);
    res.status(200).json({ answer: 'No pude conectarme a DuckDuckGo. Intenta con otra pregunta.' });
  }
}
