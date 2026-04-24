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

    const r = await fetch('https://api.duckduckgo.com/?q=' + encodeURIComponent(cleanQuery) + '&format=json&no_html=1&skip_disambig=1');
    const d = await r.json();
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
      answer = 'No encontré resultados.';
    }

    res.status(200).json({ answer });
  } catch (e) {
    res.status(200).json({ answer: 'Error de conexión con DuckDuckGo. Intenta de nuevo en unos segundos.' });
  }
}