// import React from 'react';
// import './Ui.css'; // Import the CSS file

// function Ui({ setCurrentSection }) {
//   return (
//     <div className="background-image">
//       <nav className="navbar">
//         <span className="logo">
//           <img src="/birdlogo.png" alt="Bird Logo" />
//           <p className='title'>Bird Audio Detector</p>
//         </span>
//         <ul className="nav-links">
//           <li><a href="#home" onClick={() => setCurrentSection('home')}>Home</a></li>
//           <li><a href="#about" onClick={() => setCurrentSection('about')}>About</a></li>
//           <li><a href="#contact" onClick={() => setCurrentSection('contact')}>Contact</a></li>
//           <li><a href="#search" onClick={() => setCurrentSection('search')}>Search...</a></li>
//         </ul>
//       </nav>

//       {/* Your content here */}
//     </div>
//   );
// }

// export default Ui;


import React from 'react';
import './Ui.css'; // Import the CSS file

function Ui({ currentSection, setCurrentSection }) {
  return (
    <nav className="navbar">
      <span className="logo" onClick={() => setCurrentSection('home')} style={{ cursor: 'pointer' }}>
        <img src="/birdlogo.png" alt="Bird Logo" />
        <p className='title'>Bird Species Detector</p>
      </span>
      <ul className="nav-links">
        <li>
          <a
            href="#home"
            onClick={() => setCurrentSection('home')}
            className={currentSection === 'home' ? 'active-link' : ''}
          >
            Home
          </a>
        </li>
        <li>
          <a
            href="#about"
            onClick={() => setCurrentSection('about')}
            className={currentSection === 'about' ? 'active-link' : ''}
          >
            About
          </a>
        </li>
        <li>
          <a
            href="#contact"
            onClick={() => setCurrentSection('contact')}
            className={currentSection === 'contact' ? 'active-link' : ''}
          >
            Contact
          </a>
        </li>
        <li>
          <a
            href="#search"
            onClick={() => setCurrentSection('search')}
            className={currentSection === 'search' ? 'active-link' : ''}
          >
            Search
          </a>
        </li>
      </ul>
    </nav>
  );
}

export default Ui;