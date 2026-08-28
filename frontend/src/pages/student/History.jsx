import { useEffect, useState } from 'react';
import { apiFetch } from '../../api/client';

export function History() {
  const [data, setData] = useState({ attempts: [], average: null });
  useEffect(() => { apiFetch('/my/results').then(setData); }, []);
  return (
    <div>
      <h2>Historique des résultats</h2>
      <p>Moyenne : {data.average !== null ? data.average.toFixed(2) : '—'}</p>
      <ul>
        {data.attempts.map((a) => (
          <li key={a.id}>{a.course_name} — {a.exam_name} : {a.score ?? '—'}</li>
        ))}
      </ul>
    </div>
  );
}
