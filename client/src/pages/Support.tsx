import '../styles/Support.css';
import supportImg from '../assets/about-story.jpg';

const Support = () => {
  return (
    <section className="support">
      <h2>Contact & Support</h2>
      <p>Need help? Our support team is here 24/7 to assist your game journey.</p>
      <img src={supportImg} alt="support" className="support-img" />
    </section>
  );
};

export default Support;
export {};
