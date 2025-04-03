import '../styles/Page.css';
import image from '../assets/slider-1.png';

const Home = () => (
  <div className="page">
    <h1>Welcome to Yakkun Labs</h1>
    <img src={image} alt="Home" />
    <p>We create stunning game worlds, mechanics, and immersive experiences for global audiences.</p>
  </div>
);

export default Home;
export {}; // ✅ Fix for isolatedModules
