import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Store from './pages/Store';
import Game from './pages/Game';
import News from './pages/News';  // Import News page

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/store" element={<Store />} />
        <Route path="/games" element={<Game />} />
        <Route path="/news" element={<News />} />  {/* Add route for News page */}
      </Routes>
    </Router>
  );
}

export default App;
