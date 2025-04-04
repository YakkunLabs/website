import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Game from './pages/Game';
import Store from './pages/Store';

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/games" element={<Game />} />  {/* Ensure the path is correct */}
        <Route path="/store" element={<Store />} />
      </Routes>
    </Router>
  );
}

export default App;
