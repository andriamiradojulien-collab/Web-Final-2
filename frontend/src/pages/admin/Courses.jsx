import { useEffect, useState } from 'react';
import { apiFetch } from '../../api/client';

export function Courses() {
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState({ code: '', name: '', description: '' });
  const [error, setError] = useState(null);

  async function load() { setCourses(await apiFetch('/courses')); }
  useEffect(() => { load(); }, []);

  async function handleCreate(e) {
    e.preventDefault();
    setError(null);
    try {
      await apiFetch('/courses', { method: 'POST', body: form });
      setForm({ code: '', name: '', description: '' });
      load();
    } catch (err) { setError(err.message); }
  }

  async function handleDelete(id) {
    try { await apiFetch(`/courses/${id}`, { method: 'DELETE' }); load(); }
    catch (err) { setError(err.message); } // RG-09
  }

  return (
    <div>
      <h2>Gestion des cours</h2>
      <form onSubmit={handleCreate}>
        <input placeholder="code" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} />
        <input placeholder="nom" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input placeholder="description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <button type="submit">Créer</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {courses.map((c) => (
          <li key={c.id}>{c.code} — {c.name} <button onClick={() => handleDelete(c.id)}>Supprimer</button></li>
        ))}
      </ul>
    </div>
  );
}
