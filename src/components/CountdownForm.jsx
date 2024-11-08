import React, { useState } from 'react';
import newTimezones from '../utils/timezones';
import { DateTime, Settings } from 'luxon';
import {Button} from './ui/button';
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group"
import { Slider } from "@/components/ui/slider"
import CountdownDisplay from './CountdownDisplay';

function CountdownForm({ setLatestCountdowns }) {
	const [countdownData, setCountdownData] = useState({
		date: (DateTime.now().plus({ days: 10 })).toISODate(),
		time: '00:00:00',
		timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
		keepCounting: false,
		timeValuesDisplayed : {
			years: false,
			quarters: false,
			months: false,
			weeks: false,
			days: true,
			hours: true,
			minutes: true,
			seconds: true,
		},
		errors: {},
	});
	const [countdownDetails, setCountdownDetails] = useState({
		countdownName: 'My Countdown',
		showName: true,
		countdownLink: '',
		linkText: '',
		linkType: 'button',
		forceTimeValueWhenEmpty: false,
		errors: {},
	});

	const [countdownStyling, setCountdownStyling] = useState({
		outerBorderColor: '#00FF00',
		outerBorderWidth: 2,
		outerBorderStyle: 'solid',
		innerBorderColor: '#00FF00',
		innerBorderWidth: 1,
		innerBorderStyle: 'solid',
		counterOrientation: 'horizontal',
		counterSpacing: 4,
		outerBackgroundColor: '#FFFFFF',
		countdownNameSize: 24,
		errors: {},
	})
	const [createdCountdown, setCreatedCountdown] = useState(null);
	Settings.defaultZone = countdownData.timezone;
  const handleSubmit = (e) => {
    e.preventDefault();
    
		if (!coundownDataValid()) {
			return;
		}
    // Save countdown data to localStorage atm
		const countdownId = `cd-${Math.random().toString(36).substr(2, 9)}`;  // Generate a unique id
    localStorage.setItem(countdownId, JSON.stringify({countdownData: countdownData, countdownDetails: countdownDetails, countdownStyling: countdownStyling}));
    setCreatedCountdown(window.location + `countdown/${countdownId}`);
		setLatestCountdowns((prevState) => [...prevState, countdownId]);
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
		if (countdownDetails.countdownName.length < 3 || countdownDetails.countdownName.length > 20) {
			errors.countdownName = "Name should be between 3 and 20 characters";
		}

		setCountdownData((prevState) => ({ ...prevState, errors: errors }));
		if ((Object.keys(errors)).length > 0) {
			return false;
		}
		return true
	}

	function handleTimeChange(event) {
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

	function handleDetailChange(event) {
		const {name, value, type, checked} = event.target
		const errorsCopy = { ...countdownDetails.errors };
		errorsCopy[name] = "";
		setCountdownDetails(preCountdownDetails => {
				return {
						...preCountdownDetails,
						[name]: type === "checkbox" ? checked : value,
						errors: errorsCopy
				}
		})
	}
	function handleStyleChange(event) {
		const {name, value, type, checked} = event.target
		const errorsCopy = { ...countdownStyling.errors };
		errorsCopy[name] = "";
		setCountdownStyling(preCountdownStyling => {
				return {
						...preCountdownStyling,
						[name]: type === "checkbox" ? checked : value,
						errors: errorsCopy
				}
		})
	}

	function handleValueChange(values) {
		// essentially the same as handleChange but nessessary for Togglegroup
		const valueschanged = {
			years: false,
			quarters: false,
			months: false,
			weeks: false,
			days: false,
			hours: false,
			minutes: false,
			seconds: false,
		}
		values.forEach(element => {
			valueschanged[element] = true
		});

		setCountdownData(precountdownData => {
			return {
				...precountdownData,
				timeValuesDisplayed: {...precountdownData.timeValuesDisplayed, ...valueschanged}
			}
		})
	}

	function handleStyleValueChange(name, values) {
		console.log(name, values)
		setCountdownStyling(precountdownStyling => {
			return {
				...precountdownStyling,
				[name]: values
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
							onChange={handleTimeChange}
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
							onChange={handleTimeChange}
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
							onChange={handleTimeChange}
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
							checked={countdownData.keepCounting}
							onChange={handleTimeChange}
						/>
						{countdownData.errors.keepCounting && (
							<p className='text-red-500'>{countdownData.errors.keepCounting}</p>
						)}
					</label>

					<ToggleGroup type="multiple" variant="outline" className="justify-start flex-row flex-wrap" 
					value={Object.keys(countdownData.timeValuesDisplayed).filter((key) => countdownData.timeValuesDisplayed[key])}
					onValueChange={handleValueChange}
					name="timeValuesDisplayed">
						{Object.entries(countdownData.timeValuesDisplayed).map(([key, value]) => (
							<ToggleGroupItem 
							defaultChecked={value} 
							value={key} key={key}
							name={key}
							>{key}
								</ToggleGroupItem>
						))}
					</ToggleGroup>

					<label>
						Display values when empty:
						<input
							type="checkbox"
							name="forceTimeValueWhenEmpty"
							checked={countdownDetails.keepCforceTimeValueWhenEmptyounting}
							onChange={handleDetailChange}
						/>
						{countdownDetails.errors.forceTimeValueWhenEmpty && (
							<p className='text-red-500'>{countdownDetails.errors.forceTimeValueWhenEmpty}</p>
						)}
					</label>
					<label>
						Name:
						<input
							type="text"
							name="countdownName"
							value={countdownDetails.countdownName}
							onChange={handleDetailChange}
						/>
						{countdownDetails.errors.countdownName && (
							<p className='text-red-500'>{countdownDetails.errors.countdownName}</p>
						)}
					</label>
					<label>
						display name in counter:
						<input
							type="checkbox"
							name="showName"
							checked={countdownDetails.showName}
							onChange={handleDetailChange}
						/>
						{countdownDetails.errors.showName && (
							<p className='text-red-500'>{countdownDetails.errors.showName}</p>
						)}
					</label>
					<label>
						Link:
						<input
							type="text"
							name="countdownLink"
							placeholder='https://example.com'
							value={countdownDetails.countdownLink}
							onChange={handleDetailChange}
						/>
						{countdownDetails.errors.countdownLink && (
							<p className='text-red-500'>{countdownDetails.errors.countdownLink}</p>
						)}
					</label>

					<fieldset>
						<legend>Display link as</legend>
						<input 
								type="radio"
								id="button"
								name="linkType"
								value="button"
								checked={countdownDetails.linkType === "button"}
								onChange={handleDetailChange}
						/>
						<label htmlFor="button">button</label>
						<br />
						
						<input 
								type="radio"
								id="whole"
								name="linkType"
								value="whole"
								checked={countdownDetails.linkType === "whole"}
								onChange={handleDetailChange}
						/>
						<label htmlFor="whole">entire countdown area</label>
						<br />
						
						<input 
								type="radio"
								id="link"
								name="linkType"
								value="link"
								checked={countdownDetails.linkType === "link"}
								onChange={handleDetailChange}
								/>
						<label htmlFor="link">link</label>
						<br />
						<label>
						Link text:
						<input
							type="text"
							name="linkText"
							placeholder='text on the button'
							value={countdownDetails.linkText}
							onChange={handleDetailChange}
							/>
						{countdownDetails.errors.linkText && (
							<p className='text-red-500'>{countdownDetails.errors.linkText}</p>
						)}
					</label>
				</fieldset>
						<br />
						<label>
						Border color:
						<input
							type="color"
							name="outerBorderColor"
							value={countdownStyling.outerBorderColor}
							onChange={handleStyleChange}
						/>
						{countdownStyling.errors.outerBorderColor && (
							<p className='text-red-500'>{countdownStyling.errors.outerBorderColor}</p>
						)}
					</label>
					<label>
						Border style:
						<select
							name="outerBorderStyle"
							value={countdownStyling.outerBorderStyle}
							onChange={handleStyleChange}
						>
							{["hidden","dotted","dashed","solid","double","groove","ridge","inset","outset"].map((style) => (
								<option key={style} value={style}>{style}</option>
							))}
						</select>
						{countdownStyling.errors.outerBorderStyle && (
							<p className='text-red-500'>{countdownStyling.errors.outerBorderStyle}</p>
						)}
					</label>
					<label>
						counter spacing:
						<Slider value={[countdownStyling.counterSpacing]} onValueChange={(values) => handleStyleValueChange("counterSpacing", values)}
						max={100} min={0} step={1} />
						{countdownStyling.errors.counterSpacing && (
							<p className='text-red-500'>{countdownStyling.errors.counterSpacing}</p>
						)}
					</label>

					<ToggleGroup type="single" variant="outline" className="justify-start flex-row flex-wrap" 
					onValueChange={(values) => handleStyleValueChange("counterOrientation", values)}
					name="counterOrientation" value={countdownStyling.counterOrientation}>
							<ToggleGroupItem
							value="horizontal"
							>horizontal
								</ToggleGroupItem>
							<ToggleGroupItem
							value="vertical"
							>vertical
								</ToggleGroupItem>
					</ToggleGroup>

					<br />
						<label>
						Background color:
						<input
							type="color"
							name="outerBackgroundColor"
							value={countdownStyling.outerBackgroundColor}
							onChange={handleStyleChange}
						/>
						{countdownStyling.errors.outerBackgroundColor && (
							<p className='text-red-500'>{countdownStyling.errors.outerBackgroundColor}</p>
						)}
					</label>

					<label>
						counter name size:
						<Slider value={[countdownStyling.countdownNameSize]} onValueChange={(values) => handleStyleValueChange("countdownNameSize", values)}
						max={100} min={8} step={1} />
						{countdownStyling.errors.countdownNameSize && (
							<p className='text-red-500'>{countdownStyling.errors.countdownNameSize}</p>
						)}
					</label>

					<Button>Create Countdown</Button>
				</form>
				{createdCountdown && <p>Created countdown: <a href={createdCountdown}>{createdCountdown}</a></p>}
			</div>
			<div className='flex flex-col space-y-2 py-4 px-2 grow'>
				<h2 className='text-3xl'>Countdown Preview</h2>
				<CountdownDisplay 
				countdownData={countdownData}
				countdownDetails={countdownDetails}
				countdownStyling={countdownStyling} />
			</div>
    </div>
  );
}

export default CountdownForm;