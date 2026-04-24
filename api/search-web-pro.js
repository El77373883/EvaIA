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

    const r = await fetch('https://google.serper.dev/search', {
      method: 'POST',
      headers: {
        'X-API-KEY': process.env.SERPER_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ q: cleanQuery, hl: 'es', gl: 'mx', num: 3 })
    });

    const d = await r.json();
    let answer = '';

    // Respuesta directa (knowledge graph)
    if (d.knowledgeGraph) {
      const kg = d.knowledgeGraph;
      answer = (kg.title ? kg.title + '\n' : '') + (kg.description || '');
    }

    // Resultados orgánicos
    if (!answer && d.organic && d.organic.length > 0) {
      answer = d.organic.slice(0, 3).map(r =>
        `• ${r.title}\n  ${r.snippet || ''}`
      ).join('\n\n');
    }

    // Snippet destacado
    if (d.answerBox) {
      answer = d.answerBox.answer || d.answerBox.snippet || answer;
    }

    if (!answer) answer = 'No encontré resultados para esa búsqueda.';

    res.status(200).json({ answer });

  } catch (e) {
    console.error('Serper error:', e.message);
    res.status(200).json({ answer: 'Error al buscar. Intenta de nuevo.' });
  }
}
