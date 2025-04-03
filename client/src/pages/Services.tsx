import '../styles/Page.css';
import image from '../assets/portfolio-4.jpg';

const Services = () => (
  <div className="page fade-in">
    <h1>Game Development Services</h1>
    <img src={image} alt="Services" className="page-image" />
    <p>From concept to deployment — our services power your next hit title.</p>
    <section className="page-section">
      <h2>What We Offer</h2>
      <p>Level design, storyboarding, game mechanics, AI, physics, audio — all crafted to perfection.</p>
      <p>Unreal, Unity, Godot — our devs are engine experts with deep cross-platform knowledge.</p>
    </section>
  </div>
);

export default Services;
export {};
