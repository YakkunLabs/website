import '../styles/Industries.css';
import pricingImg from '../assets/portfolio-3.jpg';

const Industries = () => {
  return (
    <section className="industries">
      <h2>Pricing Plans</h2>
      <p>Affordable plans tailored for studios and enterprise clients.</p>
      <img src={pricingImg} alt="pricing" className="industries-img" />
    </section>
  );
};

export default Industries;
export {};