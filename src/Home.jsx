import { useState, useEffect } from 'react';
import Spline from '@splinetool/react-spline';
import App from './App';
import Title from '../title.png'; // Import your image
import './landing.css';

export default function Home() {
  const [showSpline, setShowSpline] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSpline(false);
    }, 5000); // 5000 milliseconds = 5 seconds

    return () => clearTimeout(timer);
  }, []);

  return (
    <main>
      {showSpline ? (
        <>
        <img src={Title} alt="Title" className="slide-in" />
        <Spline
          scene="https://prod.spline.design/89aIroCXFVFyA02E/scene.splinecode" 
        />
        </>
      ) : (
        <>
          <App />
        </>
      )}
    </main>
  );
}