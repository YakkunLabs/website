import '../styles/Home.css';
import banner from '../assets/slider-1.png';
import about from '../assets/about-story.jpg';
import services from '../assets/portfolio-4.jpg';
import portfolio from '../assets/portfolio-1.jpg';
import pricing from '../assets/portfolio-5.jpg';
import careers from '../assets/team-2.jpg';
import contact from '../assets/single.jpg';

const Home = () => {
  return (
    <div className="home">
      <section className="section banner">
        <div className="text">
          <h1>Yakkun Labs</h1>
          <p>We design and build next-gen games for every screen.</p>
        </div>
        <img src={banner} alt="Banner" />
      </section>

      <section className="section about">
        <div className="text">
          <h2>About Us</h2>
          <p>Yakkun Labs is a game development company focused on high-performance gameplay, immersive storytelling, and unforgettable visuals. Based in Sri Lanka, creating for the world.</p>
        </div>
        <img src={about} alt="About Us" />
      </section>

      <section className="section services">
        <div className="text">
          <h2>Our Services</h2>
          <p>From prototyping to live deployment — we cover level design, mechanics, multiplayer systems, and game art. We use Unity, Unreal, and Godot engines for cross-platform success.</p>
        </div>
        <img src={services} alt="Services" />
      </section>

      <section className="section portfolio">
        <div className="text">
          <h2>Portfolio</h2>
          <p>Check out our released titles, mobile hits, console experiments, and indie tools. Every pixel is passion-driven.</p>
        </div>
        <img src={portfolio} alt="Portfolio" />
      </section>

      <section className="section pricing">
        <div className="text">
          <h2>Pricing</h2>
          <p>Simple pricing for teams of all sizes. Indie plans, studio retainers, and premium publisher deals available.</p>
        </div>
        <img src={pricing} alt="Pricing" />
      </section>

      <section className="section careers">
        <div className="text">
          <h2>Join Our Team</h2>
          <p>We’re hiring passionate creators! Developers, designers, animators — remote and hybrid roles open now.</p>
        </div>
        <img src={careers} alt="Careers" />
      </section>

      <section className="section contact">
        <div className="text">
          <h2>Contact Us</h2>
          <p>Email: support@yakkunlabs.com<br />Phone: +94 77 123 4567<br />Our support team is always ready to assist you.</p>
        </div>
        <img src={contact} alt="Contact" />
      </section>
    </div>
  );
};

export default Home;
export {};
