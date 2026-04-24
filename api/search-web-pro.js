export default async function handler(req, res) {
    // Solo aceptar POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { message } = req.body;
    
    if (!message || message.trim().length < 2) {
        return res.status(400).json({ error: 'Falta mensaje' });
    }

    try {
        // Limpiar la query
        const cleanQuery = message
            .replace(/busca en internet /gi, '')
            .replace(/busca /gi, '')
            .replace(/que es /gi, '')
            .replace(/quien es /gi, '')
            .replace(/que son /gi, '')
            .replace(/\?/g, '')
            .trim();

        console.log('🦆 DuckDuckGo buscando:', cleanQuery);

        const response = await fetch(
            'https://api.duckduckgo.com/?q=' + 
            encodeURIComponent(cleanQuery) + 
            '&format=json&no_html=1&skip_disambig=1'
        );
        
        const data = await response.json();
        let answer = '';

        // ✅ CORRECTO: Abstract (no AbstractText)
        if (data.Abstract && data.Abstract.length > 20) {
            answer = '📚 ' + data.Abstract;
            if (data.AbstractURL) {
                answer += '\n\n🔗 Fuente: ' + data.AbstractURL;
            }
        }
        // Si no hay Abstract, probar con Answer
        else if (data.Answer && data.Answer.length > 3) {
            answer = '💡 ' + data.Answer;
        }
        // Si no, probar con Definition
        else if (data.Definition && data.Definition.length > 3) {
            answer = '📝 ' + data.Definition;
            if (data.DefinitionSource) {
                answer += '\n\n🔗 Fuente: ' + data.DefinitionSource;
            }
        }
        // Si no, mostrar temas relacionados
        else if (data.RelatedTopics && data.RelatedTopics.length > 0) {
            answer = '🔍 Resultados encontrados:\n';
            data.RelatedTopics.slice(0, 5).forEach(topic => {
                if (topic.Text) {
                    answer += '\n• ' + topic.Text.split(' - ')[0].trim();
                    if (topic.FirstURL) {
                        answer += '\n  🔗 ' + topic.FirstURL;
                    }
                }
            });
        } else {
            answer = 'No encontré resultados para "' + message + '". Intenta con otras palabras.';
        }

        console.log('✅ Respuesta:', answer.substring(0, 100) + '...');
        return res.status(200).json({ answer });

    } catch (error) {
        console.error('❌ Error DuckDuckGo:', error);
        return res.status(200).json({ 
            answer: 'Error de conexión con DuckDuckGo. Intenta de nuevo en unos segundos.' 
        });
    }
}