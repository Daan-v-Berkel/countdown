import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CountdownForm from './components/CountdownForm';
import { HeaderNavigation } from './components/HeaderNavigation';
import CountdownView from './components/CountdownView';

function App() {
	const [latestCountdowns, setLatestCountdowns] = useState([])// useRef?

  return (
		<div className="max-w-[1440px] mx-auto w-full h-full">
    <Router>
		<HeaderNavigation latestCountdowns={latestCountdowns}/>
      <Routes>
        <Route path="/" element={<CountdownForm setLatestCountdowns={setLatestCountdowns} />} />
        <Route path="/countdown/:id" element={<CountdownView />} />
      </Routes>
    </Router>
		</div>
  );
}

export default App;