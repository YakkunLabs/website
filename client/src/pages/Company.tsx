import '../styles/Page.css';
import image from '../assets/about-story.jpg';

const Company = () => (
  <div className="page">
    <h1>About Yakkun Labs</h1>
    <img src={image} alt="About Company" />
    <p>A creative game tech company based in Sri Lanka. We bring stories to life through technology and design.</p>
  </div>
);

export default Company;
