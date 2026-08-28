import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiFetch } from '../../api/client';

export function ExamList() {
  const [exams, setExams] = useState([]);
  useEffect(() => { apiFetch('/my/exams').then(setExams); }, []);
  return (
    <div>
      <h2>Examens disponibles</h2>
      <ul>
        {exams.map((e) => (
          <li key={e.id}>{e.name} (jusqu'au {e.end_date}) <Link to={`/student/exams/${e.id}`}>Passer</Link></li>
        ))}
      </ul>
    </div>
  );
}
