import '../styles/Page.css';
import image from '../assets/portfolio-5.jpg';

const Industries = () => (
  <div className="page">
    <h1>Pricing Plans</h1>
    <img src={image} alt="Pricing" />
    <p>Choose from Indie, Studio, or Enterprise packages customized for your project scale and goals.</p>
  </div>
);

export default Industries;
