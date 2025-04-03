import '../styles/Company.css';
import aboutImg from '../assets/about.jpg';

const Company = () => {
  return (
    <section className="company">
      <h2>About Us</h2>
      <p>Yakkun Labs is a passionate team of creatives and engineers building immersive game experiences.</p>
      <img src={aboutImg} alt="about us" className="company-img" />
    </section>
  );
};

export default Company;
export {};