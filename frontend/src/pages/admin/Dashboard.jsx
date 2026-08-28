import { useEffect, useState } from 'react';
import { apiFetch } from '../../api/client';

export function Dashboard() {
  const [counts, setCounts] = useState({ students: 0, courses: 0, exams: 0 });

  useEffect(() => {
    (async () => {
      const [students, courses, exams] = await Promise.all([
        apiFetch('/students'),
        apiFetch('/courses'),
        apiFetch('/exams'),
      ]);
      setCounts({ students: students.length, courses: courses.length, exams: exams.length });
    })();
  }, []);

  return (
    <div>
      <h2>Tableau de bord</h2>
      <ul>
        <li>Étudiants : {counts.students}</li>
        <li>Cours : {counts.courses}</li>
        <li>Examens : {counts.exams}</li>
      </ul>
    </div>
  );
}
