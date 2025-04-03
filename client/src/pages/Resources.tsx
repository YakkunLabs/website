import '../styles/Page.css';
import image from '../assets/portfolio-1.jpg';

const Resources = () => (
  <div className="page">
    <h1>Our Portfolio</h1>
    <img src={image} alt="Portfolio" />
    <p>Explore our published games, prototypes, tools, and creative experiments in gaming tech.</p>
  </div>
);

export default Resources;
