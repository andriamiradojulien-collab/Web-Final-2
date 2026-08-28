import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { apiFetch } from '../../api/client';

export function TakeExam() {
  const { examId } = useParams();
  const [data, setData] = useState(null);
  const [answers, setAnswers] = useState({});
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    apiFetch(`/my/exams/${examId}`).then(setData).catch((e) => setError(e.message));
  }, [examId]);

  function select(questionId, choiceId) {
    setAnswers({ ...answers, [questionId]: choiceId });
  }

  async function handleSubmit() {
    try {
      const payload = Object.entries(answers).map(([questionId, choiceId]) => ({
        questionId: Number(questionId), choiceId,
      }));
      const result = await apiFetch(`/my/exams/${examId}/submit`, { method: 'POST', body: { answers: payload } });
      navigate(`/student/exams/${examId}/result`, { state: result });
    } catch (err) { setError(err.message); }
  }

  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!data) return <p>Chargement...</p>;

  return (
    <div>
      <h2>{data.exam.name}</h2>
      {data.questions.map((q) => (
        <div key={q.id}>
          <p>{q.statement} ({q.points} pt)</p>
          {q.choices.map((c) => (
            <label key={c.id} style={{ display: 'block' }}>
              <input type="radio" name={`q${q.id}`} checked={answers[q.id] === c.id} onChange={() => select(q.id, c.id)} />
              {c.text}
            </label>
          ))}
        </div>
      ))}
      {!confirming ? (
        <button onClick={() => setConfirming(true)}>Soumettre</button>
      ) : (
        <div>
          <p>Confirmer la soumission ? Cette action est définitive (une seule tentative autorisée).</p>
          <button onClick={handleSubmit}>Confirmer</button>
          <button onClick={() => setConfirming(false)}>Annuler</button>
        </div>
      )}
    </div>
  );
}
