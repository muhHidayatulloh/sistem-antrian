import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import CustomerPage from './components/CustomerPage';
import AdminPage from './components/AdminPage';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faUser, faSpinner, faTicket, faUserPlus, faUsers  } from '@fortawesome/free-solid-svg-icons';

library.add(faUser, faSpinner, faTicket, faUserPlus, faUsers );


function App() {
  return (
    <Router>
      <nav style={{ padding: '1rem', background: '#f0f0f0' }}>
        <Link to="/">Customer</Link> |{' '}
        <Link to="/admin">Admin</Link>
      </nav>

      <main style={{ padding: '2rem' }}>
        <Routes>
          <Route path="/" element={<CustomerPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;