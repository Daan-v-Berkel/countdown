import React, { useState } from 'react';
import newTimezones from '../utils/timezones';
import { DateTime, Settings } from 'luxon';
import {Button} from './ui/button';
import CountdownDisplay from './CountdownDisplay';

function CountdownForm() {
	const [countdownData, setCountdownData] = useState({
		date: (DateTime.now().plus({ days: 10 })).toISODate(),
		time: '00:00:00',
		keepCounting: false,
		timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
		countdownName: 'My Countdown',
		errors: {},
	});
	const [createdCountdown, setCreatedCountdown] = useState(null);
	Settings.defaultZone = countdownData.timezone;

  const handleSubmit = (e) => {
    e.preventDefault();
    
		if (!coundownDataValid()) {
			return;
		}
    // Save countdown data to localStorage atm
		const countdownId = Math.random().toString(36).substr(2, 9);  // Generate a unique id
    localStorage.setItem(countdownId, JSON.stringify(countdownData));
    setCreatedCountdown(window.location + `countdown/${countdownId}`);
  };

	const coundownDataValid = () => {
		const errors = {};

		if (!DateTime.fromISO(countdownData.date).isValid) {
			errors.date = "Invalid date";
		}
		const regexp = /^(2[0-3]|[01]?[0-9]):([0-5]?[0-9]):([0-5]?[0-9])$/;
		if (!regexp.test(countdownData.time)) {
			errors.time = "Invalid time";
		}
		if (!newTimezones.includes(countdownData.timezone)) {
			errors.timezone = "Invalid timezone";
		}
		if (countdownData.countdownName.length < 3 || countdownData.countdownName.length > 20) {
			errors.countdownName = "Name should be between 3 and 20 characters";
		}

		setCountdownData((prevState) => ({ ...prevState, errors: errors }));
		if ((Object.keys(errors)).length > 0) {
			return false;
		}
		return true
	}

	function handleChange(event) {
		const {name, value, type, checked} = event.target
		const errorsCopy = { ...countdownData.errors };
		errorsCopy[name] = "";
		setCountdownData(preCountdownData => {
				return {
						...preCountdownData,
						[name]: type === "checkbox" ? checked : value,
						errors: errorsCopy
				}
		})
}

  return (
    <div className='flex flex-row space-x-4'>
			<div className='border-2 border-red-500 flex flex-col space-y-2 py-4 px-2'>
				<h2 className='text-3xl'>Create a Countdown</h2>
				<form onSubmit={handleSubmit} 
							className="flex flex-col space-y-2 max-w-sm">
					<label>
						Date:
						<input
							type="date"
							name="date"
							value={countdownData.date}
							onChange={handleChange}
							required
						/>
						{countdownData.errors.date && (
							<p className='text-red-500'>{countdownData.errors.date}</p>
						)}
					</label>
					<label>
						Time:
						<input
							type="time"
							name="time"
							step={1}
							value={countdownData.time}
							onChange={handleChange}
							required
						/>
						{countdownData.errors.time && (
							<p className='text-red-500'>{countdownData.errors.time}</p>
						)}
					</label>
					<label>
						Time zone:
						<select
							name="timezone"
							value={countdownData.timezone}
							onChange={handleChange}
							required
						>
							{newTimezones.map(tz => (
								<option key={tz} value={tz}>{tz}</option>
							))}
						</select>
						{countdownData.errors.timezone && (
							<p className='text-red-500'>{countdownData.errors.timezone}</p>
						)}
					</label>
					<label>
						Keep counting when time is up:
						<input
							type="checkbox"
							name="keepCounting"
							value={countdownData.keepCounting}
							onChange={handleChange}
						/>
						{countdownData.errors.keepCounting && (
							<p className='text-red-500'>{countdownData.errors.keepCounting}</p>
						)}
					</label>
					<label>
						Name:
						<input
							type="text"
							name="countdownName"
							value={countdownData.countdownName}
							onChange={handleChange}
						/>
						{countdownData.errors.countdownName && (
							<p className='text-red-500'>{countdownData.errors.countdownName}</p>
						)}
					</label>
					<Button>Create Countdown</Button>
				</form>
				{createdCountdown && <p>Created countdown: <a href={createdCountdown}>{createdCountdown}</a></p>}
			</div>
			<div className='flex flex-col space-y-2 py-4 px-2 grow'>
				<h2 className='text-3xl'>Countdown Preview</h2>
				<CountdownDisplay countdownData={countdownData} />
			</div>
    </div>
  );
}

export default CountdownForm;