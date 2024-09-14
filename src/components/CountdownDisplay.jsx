import { DateTime } from 'luxon';
import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';

function CountdownDisplay({ countdownData }) {
  const [timeLeft, setTimeLeft] = useState(
		{
			years: null,
			months: null,
			days: null,
			hours: null,
			minutes: null,
			seconds: null,
		}
	);
	const [isFinished, setIsFinished] = useState(false);

	const getCountdown = () => {
		return DateTime.fromFormat(`${countdownData.date} ${countdownData.time}`, 'yyyy-MM-dd HH:mm:ss', { zone: countdownData.timezone });
	}

  useEffect(() => {
    let intervalId;

		const countdownDateTime = getCountdown();
    if (countdownDateTime) {
      intervalId = setInterval(() => {
        const countdownDuration = countdownDateTime.diff(DateTime.now(), 
				Object.keys(countdownData.timeValuesDisplayed).filter((key) => countdownData.timeValuesDisplayed[key]));
        if ((countdownDuration.toMillis() <= 0) && !countdownData.keepCounting) {
          setIsFinished(true);
          clearInterval(intervalId);
        } else {
					setIsFinished(false);
        }
				setTimeLeft(() => {
					return {
						...countdownDuration.toObject(),
					}
				});
      }, 1000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [countdownData]);


  return (
    <div className="border-2 border-slate-200 grow flex flex-col items-center align-middle">
			{countdownData.showName &&<div>
				<h6 className="text-center text-3xl text-green-200 py-2">{countdownData.countdownName}</h6>
			</div>}
			<div className="w-fit h-fit mx-auto my-auto">
				{(isFinished && !countdownData.keepCounting) ? <p>Countdown finished</p>
				:
				timeLeft.seconds === null
				?
				<p>Loading...</p>
				:
				Object.entries(timeLeft).map(([key, value]) => (
					Math.abs(value) > 0 && <span key={key}>{Math.abs(parseInt(value))} {key} </span>
				))
			}
			</div>
			{countdownData.countdownLink && 
			["link", "button"].includes(countdownData.linkType) &&
			<div>
				<a href={countdownData.countdownLink} target="_blank" rel="noreferrer">
					<Button
					variant={countdownData.linkType === "link" ? "link" : "default"}
					>{countdownData.linkText || countdownData.countdownLink}</Button>
				</a>
			</div>}
    </div>
  );
}

export default CountdownDisplay;