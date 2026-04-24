// ============================================
// 🧠 EVA BRAIN - Memoria y Seguimiento
// ============================================

// Variables globales
var conversationTopic = null;
var topicStartedAt = null;
var lastAskedTopic = null;

// Memoria a corto plazo mejorada
function addToShortTermMemory(userMsg, evaMsg) {
    shortTermMemory.push({
        user: userMsg,
        eva: evaMsg,
        timestamp: Date.now(),
        sentiment: analyzeSentiment(userMsg)
    });
    if (shortTermMemory.length > 10) shortTermMemory.shift();
    updateConversationTopic(userMsg, evaMsg);
}

// Detectar y seguir el tema de conversación
function updateConversationTopic(userMsg, evaMsg) {
    var msg = userMsg.toLowerCase();
    
    if (msg.match(/programacion|codigo|programar|html|css|javascript|python|js|react|node|error|bug|web|pagina|app|desarrollar/)) {
        conversationTopic = 'programacion'; topicStartedAt = Date.now();
    } else if (msg.match(/matematica|calculo|suma|resta|multiplicar|dividir|ecuacion|algebra|geometria|numero|formula/)) {
        conversationTopic = 'matematicas'; topicStartedAt = Date.now();
    } else if (msg.match(/tarea|tareas|escuela|colegio|universidad|estudiar|examen|prueba|parcial|materia/)) {
        conversationTopic = 'escolar'; topicStartedAt = Date.now();
    } else if (msg.match(/ciencia|fisica|quimica|biologia|astronomia|universo|planeta/)) {
        conversationTopic = 'ciencia'; topicStartedAt = Date.now();
    } else if (msg.match(/historia|guerra|revolucion|civilizacion|presidente|antiguo/)) {
        conversationTopic = 'historia'; topicStartedAt = Date.now();
    } else if (msg.match(/ingles|traducir|english|idioma|gramatica|vocabulario/)) {
        conversationTopic = 'idiomas'; topicStartedAt = Date.now();
    } else if (msg.match(/triste|feliz|enojado|preocupado|solo|consejo|amor|amistad|problema personal|estresado/)) {
        conversationTopic = 'emocional'; topicStartedAt = Date.now();
    } else if (msg.match(/hola|que tal|saludos|buen dia|buenas|adios|chao|bye|gracias/)) {
        conversationTopic = null;
    }
    
    if (topicStartedAt && Date.now() - topicStartedAt > 300000) {
        conversationTopic = null;
    }
}

// Seguimiento inteligente de conversación
function getFollowUpResponse(msg) {
    if (!conversationTopic || shortTermMemory.length === 0) return null;
    
    var msgWords = msg.trim().split(/\s+/);
    var lastEvaMsg = shortTermMemory[shortTermMemory.length - 1].eva.toLowerCase();
    
    // Si Eva preguntó "en qué puedo ayudarte" y usuario responde palabra suelta
    if ((lastEvaMsg.includes('en qué puedo ayudarte') || lastEvaMsg.includes('ayudarte hoy')) && msgWords.length <= 2) {
        var topicResponses = {
            'programacion': '💻 ¿Quieres aprender, tienes un error o necesitas crear algo?',
            'matematicas': '🔢 Dime el problema o tema y te ayudo.',
            'escolar': '📚 Cuéntame de qué materia y te ayudo.',
            'ciencia': '🔬 ¿Física, química o biología?',
            'historia': '📜 ¿Qué época o evento te interesa?',
            'idiomas': '🌎 ¿Traducción o gramática?',
            'emocional': '💙 Te escucho. Cuéntame qué pasa.',
            'tareas': '📚 ¿De qué materia es tu tarea?',
            'tarea': '📚 ¿Qué tarea necesitas hacer?',
            'examen': '📝 ¿De qué materia es el examen?'
        };
        for (var key in topicResponses) {
            if (msg.includes(key)) return topicResponses[key];
        }
    }
    
    // Seguir conversación existente
    var isGreeting = msg.match(/hola|que tal|saludos|buen dia|hey|buenas|adios|chao|bye|gracias/);
    var isQuestion = msg.includes('?') || msg.match(/que es|quien es|como se|cuanto es|explica|definicion/);
    var isCodeRequest = msg.match(/revisa|analiza|checa|arregla|corrige|mejora|optimiza/);
    var isCreation = msg.match(/crea|hazme|genera|hacer|quiero|necesito/);
    
    if (!isGreeting && !isQuestion && !isCodeRequest && !isCreation && msgWords.length <= 3) {
        var followUp = {
            'programacion': 'Sigo ayudándote con programación 💻 ¿Algo más?',
            'matematicas': 'Seguimos con matemáticas 🔢 ¿Otro problema?',
            'escolar': '¿Algo más sobre tus estudios? 📚',
            'ciencia': '¿Otra pregunta científica? 🔬',
            'historia': '¿Algo más de historia? 📜',
            'idiomas': '¿Más dudas de inglés? 🌎',
            'emocional': 'Sigo escuchándote 💙 ¿Qué más pasa?'
        };
        if (followUp[conversationTopic]) return followUp[conversationTopic];
    }
    
    return null;
}