import '../styles/Page.css';
import image from '../assets/team-2.jpg';

const Careers = () => (
  <div className="page">
    <h1>Join Our Team</h1>
    <img src={image} alt="Careers" />
    <p>We're hiring developers, designers, and artists to help us build the future of gaming.</p>
  </div>
);

export default Careers;
