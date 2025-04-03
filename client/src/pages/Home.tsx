import '../styles/Home.css';
import { useState } from 'react';
import slider1 from '../assets/slider-1.png';
import slider2 from '../assets/slider-2.png';
import slider3 from '../assets/slider-3.png';

const images = [slider1, slider2, slider3];

const Home = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  return (
    <div className="home">
      <section className="section banner">
  <div className="text">
    <h1>Yakkun Labs</h1>
    <p>We design and build next-gen games for every screen.</p>
  </div>
  <div className="slider">
    <button className="slider-button left" onClick={goToPrevious}>
      &#60;
    </button>
    <img src={images[currentIndex]} alt="Slider" className="slider-image" />
    <button className="slider-button right" onClick={goToNext}>
      &#62;
    </button>
  </div>
</section>

      {/* About Section */}
      <section className="section about">
        <div className="text">
          <h2>About Us</h2>
          <p>Yakkun Labs is a game development company focused on high-performance gameplay, immersive storytelling, and unforgettable visuals. Based in Sri Lanka, creating for the world.</p>
        </div>
        <img src={slider1} alt="About Us" />
      </section>

      {/* Services Section */}
      <section className="section services">
        <div className="text">
          <h2>Our Services</h2>
          <p>From prototyping to live deployment — we cover level design, mechanics, multiplayer systems, and game art. We use Unity, Unreal, and Godot engines for cross-platform success.</p>
        </div>
        <img src={slider2} alt="Services" />
      </section>

      {/* Portfolio Section */}
      <section className="section portfolio">
        <div className="text">
          <h2>Portfolio</h2>
          <p>Check out our released titles, mobile hits, console experiments, and indie tools. Every pixel is passion-driven.</p>
        </div>
        <img src={slider3} alt="Portfolio" />
      </section>

      {/* Pricing Section */}
      <section className="section pricing">
        <div className="text">
          <h2>Pricing</h2>
          <p>Simple pricing for teams of all sizes. Indie plans, studio retainers, and premium publisher deals available.</p>
        </div>
        <img src={slider1} alt="Pricing" />
      </section>

      {/* Careers Section */}
      <section className="section careers">
        <div className="text">
          <h2>Join Our Team</h2>
          <p>We’re hiring passionate creators! Developers, designers, animators — remote and hybrid roles open now.</p>
        </div>
        <img src={slider2} alt="Careers" />
      </section>

      {/* Contact Section */}
      <section className="section contact">
        <div className="text">
          <h2>Contact Us</h2>
          <p>Email: support@yakkunlabs.com<br />Phone: +94 77 123 4567<br />Our support team is always ready to assist you.</p>
        </div>
        <img src={slider3} alt="Contact" />
      </section>
    </div>
  );
};

export default Home;
