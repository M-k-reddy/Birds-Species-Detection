// import React, { useState, useRef, useEffect } from 'react';
// import './App.css';
// import Ui from './components/Ui';
// import MainContent from './components/MainContent';
// import About from './components/About';
// import Contact from './components/Contact';
// import Search from './components/Search';

// function App() {
//   const [currentSection, setCurrentSection] = useState('home');
//   const [paddingTop, setPaddingTop] = useState('0px');
//   const aboutRef = useRef(null);
//   const contactRef = useRef(null);
//   const searchRef = useRef(null);

//   const handleSetCurrentSection = (section) => {
//     setCurrentSection(section);
//     if (section === 'home') {
//       window.scrollTo({ top: 0, behavior: 'smooth' });
//     }
//     if (section === 'about' && aboutRef.current) {
//       aboutRef.current.scrollIntoView({ behavior: 'smooth' });
//     }
//     if (section === 'contact' && contactRef.current) {
//       contactRef.current.scrollIntoView({ behavior: 'smooth' });
//     }
//     if (section === 'search' && searchRef.current) {
//       searchRef.current.scrollIntoView({ behavior: 'smooth' });
//     }
//   };

//   useEffect(() => {
//     if (currentSection === 'about') {
//       setPaddingTop('117px');
//     } else {
//       setPaddingTop('0px');
//     }
//   }, [currentSection]);

//   return (
//     <div className="App">
//       <Ui setCurrentSection={handleSetCurrentSection} />
//       <div className="content" style={{ paddingTop }}>
//         <MainContent />
//         <div ref={aboutRef}>
//           <About />
//         </div>
//         <div ref={contactRef}>
//           <Contact />
//         </div>
//         <div ref={searchRef}>
//           <Search />
//         </div>
//       </div>
//     </div>
//   );
// }

// export default App;



import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import Ui from './components/Ui';
import MainContent from './components/MainContent';
import About from './components/About';
import Journal from './components/Journal';
import Search from './components/Search';

function App() {
  const [currentSection, setCurrentSection] = useState('home');
  const aboutRef = useRef(null);
  const contactRef = useRef(null);
  const searchRef = useRef(null);

  const handleSetCurrentSection = (section) => {
    setCurrentSection(section);
    if (section === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    if (section === 'about' && aboutRef.current) {
      aboutRef.current.scrollIntoView({ behavior: 'smooth' });
    }
    if (section === 'contact' && contactRef.current) {
      contactRef.current.scrollIntoView({ behavior: 'smooth' });
    }
    if (section === 'search' && searchRef.current) {
      searchRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.5,
    };

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setCurrentSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    const aboutElement = aboutRef.current;
    const contactElement = contactRef.current;
    const searchElement = searchRef.current;

    if (aboutElement) observer.observe(aboutElement);
    if (contactElement) observer.observe(contactElement);
    if (searchElement) observer.observe(searchElement);

    const handleScroll = () => {
      if (window.scrollY === 0) {
        setCurrentSection('home');
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      if (aboutElement) observer.unobserve(aboutElement);
      if (contactElement) observer.unobserve(contactElement);
      if (searchElement) observer.unobserve(searchElement);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="App" style={{
      backgroundImage: "linear-gradient(135deg, #f0f7f4 0%, #e9f2f9 100%)",
      backgroundSize: "cover",
      backgroundAttachment: "fixed",
      backgroundPosition: "center"
    }}>
      <div className="aurora-glow glow-1"></div>
      <div className="aurora-glow glow-2"></div>
      <div className="aurora-glow glow-3"></div>
      <Ui currentSection={currentSection} setCurrentSection={handleSetCurrentSection} />
      <div className="content">
        <MainContent />
        <div id="about" ref={aboutRef}>
          <About />
        </div>
        <div id="contact" ref={contactRef}>
          <Journal />
        </div>
        <div id="search" ref={searchRef}>
          <Search />
        </div>
      </div>
    </div>
  );
}

export default App;



// import React, { useState, useRef, useEffect } from 'react';
// import './App.css';
// import Ui from './components/Ui';
// import MainContent from './components/MainContent';
// import About from './components/About';
// import Contact from './components/Contact';
// import Search from './components/Search';

// function App() {
//   const [currentSection, setCurrentSection] = useState('home');
//   const aboutRef = useRef(null);
//   const contactRef = useRef(null);
//   const searchRef = useRef(null);

//   const handleSetCurrentSection = (section) => {
//     setCurrentSection(section);
//     if (section === 'home') {
//       window.scrollTo({ top: 0, behavior: 'smooth' });
//     }
//     if (section === 'about' && aboutRef.current) {
//       aboutRef.current.scrollIntoView({ behavior: 'smooth' });
//     }
//     if (section === 'contact' && contactRef.current) {
//       contactRef.current.scrollIntoView({ behavior: 'smooth' });
//     }
//     if (section === 'search' && searchRef.current) {
//       searchRef.current.scrollIntoView({ behavior: 'smooth' });
//     }
//   };

//   useEffect(() => {
//     const observerOptions = {
//       root: null,
//       rootMargin: '0px',
//       threshold: 0.1, // Adjusted threshold to ensure intersection is detected correctly
//     };

//     const observerCallback = (entries) => {
//       entries.forEach((entry) => {
//         if (entry.isIntersecting) {
//           setCurrentSection(entry.target.id);
//         }
//       });
//     };

//     const observer = new IntersectionObserver(observerCallback, observerOptions);

//     const aboutElement = aboutRef.current;
//     const contactElement = contactRef.current;
//     const searchElement = searchRef.current;

//     if (aboutElement) observer.observe(aboutElement);
//     if (contactElement) observer.observe(contactElement);
//     if (searchElement) observer.observe(searchElement);

//     const handleScroll = () => {
//       if (window.scrollY === 0) {
//         setCurrentSection('home');
//       }
//     };

//     window.addEventListener('scroll', handleScroll);

//     return () => {
//       if (aboutElement) observer.unobserve(aboutElement);
//       if (contactElement) observer.unobserve(contactElement);
//       if (searchElement) observer.unobserve(searchElement);
//       window.removeEventListener('scroll', handleScroll);
//     };
//   }, []);

//   return (
//     <div className="App">
//       <Ui currentSection={currentSection} setCurrentSection={handleSetCurrentSection} />
//       <div className="content">
//         <MainContent />
//         <div id="about" ref={aboutRef}>
//           <About />
//         </div>
//         <div id="contact" ref={contactRef}>
//           <Contact />
//         </div>
//         <div id="search" ref={searchRef}>
//           <Search />
//         </div>
//       </div>
//     </div>
//   );
// }

// export default App;