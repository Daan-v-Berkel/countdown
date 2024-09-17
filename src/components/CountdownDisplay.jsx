import { DateTime } from 'luxon';
import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import clsx from 'clsx';
import ReactFitText from 'react-fittext';

function CountdownDisplay({ className, countdownData, countdownDetails, countdownStyling }) {
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
    <div className={clsx("grow flex flex-col items-center align-middle", className)}
		style={{
			border: `${countdownStyling.outerBorderWidth}px ${countdownStyling.outerBorderStyle} ${countdownStyling.outerBorderColor}`,
			background: countdownStyling.outerBackgroundColor,
			}}>
			{countdownDetails.showName &&<div style={{width: `${countdownStyling.countdownNameSize}%`}}>
				<ReactFitText>
					<h6 className="text-center text-green-200 py-2">{countdownDetails.countdownName}</h6>
				</ReactFitText>
			</div>}
			<div className={clsx(`w-fit h-fit mx-auto my-auto flex ${countdownStyling.counterOrientation === "vertical" ? "flex-col" : "flex-row"}`)}
			style={{
				gap: `${countdownStyling.counterSpacing}px`,
			}}>
				{(isFinished && !countdownData.keepCounting) ? <p>Countdown finished</p>
				:
				timeLeft.seconds === null
				?
				<p>Loading...</p>
				:
				Object.entries(timeLeft).map(([key, value]) => (
					countdownDetails.forceTimeValueWhenEmpty ?
					<span key={key}>{Math.abs(parseInt(value))} {key} </span>
					:
					Math.abs(value) > 0 && <span key={key}>{Math.abs(parseInt(value))} {key} </span>
				))
			}
			</div>
			{countdownDetails.countdownLink && 
			["link", "button"].includes(countdownDetails.linkType) &&
			<div>
				<a href={countdownDetails.countdownLink} target="_blank" rel="noreferrer">
					<Button
					variant={countdownDetails.linkType === "link" ? "link" : "default"}
					>{countdownDetails.linkText || countdownDetails.countdownLink}</Button>
				</a>
			</div>}
    </div>
  );
}

export default CountdownDisplay;