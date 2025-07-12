const DAILY_LIMIT = 15;

function getTodayKey() {
  const today = new Date().toISOString().split('T')[0];
  return `questions_${today}`;
}

function getQuestionCount() {
  return parseInt(localStorage.getItem(getTodayKey()) || '0');
}

function incrementQuestionCount() {
  const count = getQuestionCount() + 1;
  localStorage.setItem(getTodayKey(), count);
}

function updateRemainingCount() {
  const remaining = DAILY_LIMIT - getQuestionCount();
  document.getElementById('remainingCount').textContent = remaining;
}

async function sendQuestion() {
  const responseDiv = document.getElementById('response');
  const question = document.getElementById('userInput').value;

  if (!question.trim()) {
    responseDiv.innerHTML = "<span style='color:red;'>Por favor, escribe una pregunta.</span>";
    return;
  }

  if (getQuestionCount() >= DAILY_LIMIT) {
    responseDiv.innerHTML = `
      <div style="color:red;">
        Has alcanzado el límite de 15 preguntas gratis hoy. 
        <br><br>
        <strong>Pronto podrás hacerte Premium y desbloquear más preguntas.</strong>
      </div>`;
    return;
  }

  responseDiv.innerHTML = "Pensando... ⏳";

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer TU_API_KEY' // ← REEMPLÁZALO
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `Eres un profesor experto que ayuda a estudiantes de secundaria y bachillerato a resolver sus tareas. Siempre explicas paso a paso, con un tono amigable y claro.`
        },
        {
          role: 'user',
          content: question
        }
      ]
    })
  });

  const data = await res.json();
  const answer = data.choices[0].message.content;
  responseDiv.innerHTML = `<strong>Respuesta:</strong><br>${answer}`;
  incrementQuestionCount();
  updateRemainingCount();
}

// Actualiza contador al cargar
updateRemainingCount();
