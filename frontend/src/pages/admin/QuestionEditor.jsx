import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { apiFetch } from '../../api/client';

const emptyChoice = () => ({ text: '', isCorrect: false });

export function QuestionEditor() {
  const { examId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [locked, setLocked] = useState(false);
  const [statement, setStatement] = useState('');
  const [points, setPoints] = useState(1);
  const [choices, setChoices] = useState([emptyChoice(), emptyChoice()]);
  const [error, setError] = useState(null);

  async function load() {
    const results = await apiFetch(`/exams/${examId}/results`).catch(() => []);
    setLocked(results.length > 0); // verrouillage visible dès qu'il existe des tentatives (RG-08)
    setQuestions(await apiFetch(`/exams/${examId}/questions`));
  }
  useEffect(() => { load(); }, [examId]);

  function updateChoice(i, field, value) {
    const next = [...choices];
    next[i] = { ...next[i], [field]: value };
    setChoices(next);
  }

  function setCorrect(i) {
    setChoices(choices.map((c, idx) => ({ ...c, isCorrect: idx === i })));
  }

  async function handleCreate(e) {
    e.preventDefault();
    setError(null);
    try {
      await apiFetch(`/exams/${examId}/questions`, {
        method: 'POST',
        body: { statement, points: Number(points), choices },
      });
      setStatement(''); setPoints(1); setChoices([emptyChoice(), emptyChoice()]);
      load();
    } catch (err) { setError(err.message); }
  }

  return (
    <div>
      <h2>Éditeur de questions {locked && <span style={{ color: 'red' }}>(verrouillé : tentatives existantes)</span>}</h2>
      {!locked && (
        <form onSubmit={handleCreate}>
          <input placeholder="énoncé" value={statement} onChange={(e) => setStatement(e.target.value)} required />
          <input type="number" min={0} step="0.5" value={points} onChange={(e) => setPoints(e.target.value)} />
          {choices.map((c, i) => (
            <div key={i}>
              <input placeholder={`choix ${i + 1}`} value={c.text} onChange={(e) => updateChoice(i, 'text', e.target.value)} />
              <label><input type="radio" name="correct" checked={c.isCorrect} onChange={() => setCorrect(i)} /> correct</label>
            </div>
          ))}
          {choices.length < 6 && (
            <button type="button" onClick={() => setChoices([...choices, emptyChoice()])}>+ choix</button>
          )}
          <button type="submit">Ajouter la question</button>
        </form>
      )}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ol>
        {questions.map((q) => (
          <li key={q.id}>
            {q.statement} ({q.points} pt)
            <ul>
              {q.choices.map((c) => (
                <li key={c.id}>{c.text} {c.is_correct && '✅'}</li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </div>
  );
}
