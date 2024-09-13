import React, { useState } from 'react';
//import { useNavigate } from 'react-router-dom';
import newTimezones from '../utils/timezones';
import { DateTime, Settings } from 'luxon';
import {Button} from './ui/button';
import CountdownDisplay from './CountdownDisplay';

function CountdownForm() {
  const [date, setDate] = useState((DateTime.now().plus({ days: 10 })).toISODate());
  const [time, setTime] = useState('00:00');
	const [createdCountdown, setCreatedCountdown] = useState(null);
  const [timezone, setTimezone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone);
	Settings.defaultZone = timezone;

  const handleSubmit = (e) => {
    e.preventDefault();
    const countdownId = Math.random().toString(36).substr(2, 9);  // Generate a unique id
    
		const targetDate = getCountdown();
		console.log(`timezone: ${timezone}`);
		console.log(targetDate);
    // Save countdown data to localStorage or an API
    localStorage.setItem(countdownId, targetDate.toJSON());
    setCreatedCountdown(window.location + `countdown/${countdownId}`);
    // Navigate to the public countdown page
    //navigate(`/countdown/${countdownId}`);
  };

	const getCountdown = () => {
		return DateTime.fromFormat(`${date} ${time}`, 'yyyy-MM-dd HH:mm', { zone: timezone });
	}

  return (
    <div>
      <h1 className='text-3xl py-4 px-2'>Create a Countdown</h1>
      <form onSubmit={handleSubmit}
			className="flex flex-col space-y-2 max-w-sm">
        <div>
          <label>Date:</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        </div>
        <div>
          <label>Time:</label>
          <input type="time" value={time} onChange={(e) => setTime(e.target.value)} required />
        </div>
        <div>
          <label>Timezone:</label>
          <select value={timezone} onChange={(e) => setTimezone(e.target.label)} required>
            {newTimezones.map(tz => (
              <option key={tz} value={tz}>{tz}</option>
            ))}
          </select>
        </div>
        <Button>Create Countdown</Button>
      </form>
			{createdCountdown && <p>Created countdown: <a href={createdCountdown}>{createdCountdown}</a></p>}
			<CountdownDisplay countdownDateTime={getCountdown()} />
    </div>
  );
}

export default CountdownForm;