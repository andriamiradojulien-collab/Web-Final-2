import { useEffect, useState } from 'react';
import { apiFetch } from '../../api/client';

export function Students() {
  const [students, setStudents] = useState([]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  async function load() { setStudents(await apiFetch('/students')); }
  useEffect(() => { load(); }, []);

  async function handleCreate(e) {
    e.preventDefault();
    setError(null);
    try {
      await apiFetch('/students', { method: 'POST', body: { email, password } });
      setEmail(''); setPassword('');
      load();
    } catch (err) { setError(err.message); }
  }

  async function toggleActive(student) {
    if (student.is_active) {
      await apiFetch(`/students/${student.id}`, { method: 'DELETE' }); // désactivation, RG-10
    } else {
      await apiFetch(`/students/${student.id}`, { method: 'PUT', body: { isActive: true } });
    }
    load();
  }

  return (
    <div>
      <h2>Gestion des étudiants</h2>
      <form onSubmit={handleCreate}>
        <input placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input placeholder="mot de passe" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type="submit">Créer</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <table>
        <thead><tr><th>Email</th><th>Statut</th><th>Action</th></tr></thead>
        <tbody>
          {students.map((s) => (
            <tr key={s.id}>
              <td>{s.email}</td>
              <td>{s.is_active ? 'Actif' : 'Désactivé'}</td>
              <td><button onClick={() => toggleActive(s)}>{s.is_active ? 'Désactiver' : 'Réactiver'}</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
