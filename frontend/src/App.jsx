import { Routes, Route, Navigate, Link, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Login } from './pages/Login';
import { Dashboard } from './pages/admin/Dashboard';
import { Students } from './pages/admin/Students';
import { Courses } from './pages/admin/Courses';
import { Exams } from './pages/admin/Exams';
import { QuestionEditor } from './pages/admin/QuestionEditor';
import { Results } from './pages/admin/Results';
import { ExamList } from './pages/student/ExamList';
import { TakeExam } from './pages/student/TakeExam';
import { ExamResult } from './pages/student/ExamResult';
import { History } from './pages/student/History';

function AdminLayout() {
  const { logout } = useAuth();
  return (
    <div style={{ fontFamily: 'sans-serif', padding: 20 }}>
      <nav>
        <Link to="/admin">Dashboard</Link> | <Link to="/admin/students">Étudiants</Link> |{' '}
        <Link to="/admin/courses">Cours</Link> | <Link to="/admin/exams">Examens</Link> |{' '}
        <button onClick={logout}>Déconnexion</button>
      </nav>
      <hr />
      <Outlet />
    </div>
  );
}

function StudentLayout() {
  const { logout } = useAuth();
  return (
    <div style={{ fontFamily: 'sans-serif', padding: 20 }}>
      <nav>
        <Link to="/student">Examens</Link> | <Link to="/student/history">Historique</Link> |{' '}
        <button onClick={logout}>Déconnexion</button>
      </nav>
      <hr />
      <Outlet />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<ProtectedRoute role="admin"><AdminLayout /></ProtectedRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="students" element={<Students />} />
          <Route path="courses" element={<Courses />} />
          <Route path="exams" element={<Exams />} />
          <Route path="exams/:examId/questions" element={<QuestionEditor />} />
          <Route path="exams/:examId/results" element={<Results />} />
        </Route>
        <Route path="/student" element={<ProtectedRoute role="student"><StudentLayout /></ProtectedRoute>}>
          <Route index element={<ExamList />} />
          <Route path="exams/:examId" element={<TakeExam />} />
          <Route path="exams/:examId/result" element={<ExamResult />} />
          <Route path="history" element={<History />} />
        </Route>
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </AuthProvider>
  );
}
