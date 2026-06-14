import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import PokemonDetail from './pages/PokemonDetail';
import Arcade from './pages/Arcade';
import Battle from './pages/Battle';
import WhosThat from './pages/WhosThat';
import MemoryMatch from './pages/MemoryMatch';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/pokemon/:id" element={<PokemonDetail />} />
          <Route path="/arcade" element={<Arcade />} />
          <Route path="/arcade/clash" element={<Battle />} />
          <Route path="/arcade/guess" element={<WhosThat />} />
          <Route path="/arcade/memory" element={<MemoryMatch />} />
          <Route path="/battle" element={<Navigate to="/arcade/clash" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
