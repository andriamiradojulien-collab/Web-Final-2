import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { apiFetch } from '../../api/client';

export function Results() {
  const { examId } = useParams();
  const [results, setResults] = useState([]);

  useEffect(() => {
    apiFetch(`/exams/${examId}/results`).then(setResults);
  }, [examId]);

  return (
    <div>
      <h2>Résultats de l'examen</h2>
      <table>
        <thead><tr><th>Étudiant</th><th>Note</th><th>Total</th><th>Statut</th></tr></thead>
        <tbody>
          {results.map((r, i) => (
            <tr key={i}>
              <td>{r.studentEmail}</td>
              <td>{r.score ?? '—'}</td>
              <td>{r.totalPoints}</td>
              <td>{r.admis ? 'Admis' : 'Non admis'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
