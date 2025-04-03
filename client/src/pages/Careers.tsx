import '../styles/Careers.css';
import team1 from '../assets/team-1.jpg';
import team2 from '../assets/team-2.jpg';
import team3 from '../assets/team-3.jpg';
import team4 from '../assets/team-4.jpg';

const Careers = () => {
  return (
    <section className="careers">
      <h2>Join Our Team</h2>
      <p>We’re always hiring passionate designers, developers, and storytellers.</p>
      <div className="team-grid">
        <img src={team1} alt="team 1" />
        <img src={team2} alt="team 2" />
        <img src={team3} alt="team 3" />
        <img src={team4} alt="team 4" />
      </div>
    </section>
  );
};

export default Careers;
export {};