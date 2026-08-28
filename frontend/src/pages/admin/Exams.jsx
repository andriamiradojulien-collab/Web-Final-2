import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiFetch } from '../../api/client';

export function Exams() {
  const [exams, setExams] = useState([]);
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState({ courseId: '', name: '', startDate: '', endDate: '' });
  const [error, setError] = useState(null);

  async function load() {
    setExams(await apiFetch('/exams'));
    setCourses(await apiFetch('/courses'));
  }
  useEffect(() => { load(); }, []);

  async function handleCreate(e) {
    e.preventDefault();
    setError(null);
    try {
      await apiFetch('/exams', { method: 'POST', body: { ...form, courseId: Number(form.courseId) } });
      setForm({ courseId: '', name: '', startDate: '', endDate: '' });
      load();
    } catch (err) { setError(err.message); }
  }

  async function handleDelete(id) {
    try { await apiFetch(`/exams/${id}`, { method: 'DELETE' }); load(); }
    catch (err) { setError(err.message); } // RG-09
  }

  return (
    <div>
      <h2>Gestion des examens</h2>
      <form onSubmit={handleCreate}>
        <select value={form.courseId} onChange={(e) => setForm({ ...form, courseId: e.target.value })} required>
          <option value="">-- cours --</option>
          {courses.map((c) => <option key={c.id} value={c.id}>{c.code}</option>)}
        </select>
        <input placeholder="nom" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input type="datetime-local" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
        <input type="datetime-local" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
        <button type="submit">Créer</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {exams.map((ex) => (
          <li key={ex.id}>
            {ex.name} ({ex.start_date} → {ex.end_date})
            {' '}<Link to={`/admin/exams/${ex.id}/questions`}>Questions</Link>
            {' '}<Link to={`/admin/exams/${ex.id}/results`}>Résultats</Link>
            {' '}<button onClick={() => handleDelete(ex.id)}>Supprimer</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
