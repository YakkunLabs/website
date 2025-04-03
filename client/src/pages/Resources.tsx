import '../styles/Resources.css';
import galleryImg from '../assets/portfolio-6.jpg';

const Resources = () => {
  return (
    <section className="resources">
      <h2>Game Portfolio</h2>
      <p>From RPGs to multiplayer, check out our visual archive of excellence.</p>
      <img src={galleryImg} alt="portfolio" className="resources-img" />
    </section>
  );
};

export default Resources;
export {};