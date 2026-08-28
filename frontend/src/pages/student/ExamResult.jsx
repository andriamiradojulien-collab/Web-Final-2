import { useLocation, useParams } from 'react-router-dom';

export function ExamResult() {
  const { state } = useLocation();
  const { examId } = useParams();

  if (!state) return <p>Aucun résultat à afficher pour l'examen {examId}. Consultez votre historique.</p>;

  return (
    <div>
      <h2>Résultat : {state.score} points</h2>
      <ol>
        {state.detail.map((d) => (
          <li key={d.questionId} style={{ color: d.isCorrect ? 'green' : 'crimson' }}>
            {d.statement} — {d.isCorrect ? 'Correct' : 'Incorrect'} ({d.pointsAwarded}/{d.points} pt)
            <ul>
              {d.choices.map((c) => (
                <li key={c.id}>
                  {c.text} {c.isCorrect && '✅'} {c.id === d.selectedChoiceId && '← votre réponse'}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </div>
  );
}
