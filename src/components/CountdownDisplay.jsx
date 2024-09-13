import { DateTime } from 'luxon';
import React, { useState, useEffect } from 'react';

function CountdownDisplay({ countdownDateTime }) {
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

  useEffect(() => {
    let intervalId;

    if (countdownDateTime) {
      intervalId = setInterval(() => {
        const countdownDuration = countdownDateTime.diff(DateTime.now(), ['years', 'months', 'days', 'hours', 'minutes', 'seconds']);

        if (countdownDuration.toMillis() <= 0) {
          setIsFinished(true);
          clearInterval(intervalId);
        } else {
          setTimeLeft(() => {
            return {
              ...timeLeft,
              ...countdownDuration.toObject(),
            }
          });
        }
      }, 1000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [countdownDateTime]);


  return (
    <div>
			{isFinished ? <p>Countdown finished</p>
			:
			timeLeft.seconds === null
			? 
			<p>Loading...</p>
				:
				Object.entries(timeLeft).map(([key, value]) => (
					value > 0 && <span key={key}>{parseInt(value)} {key} </span>
				))}
    </div>
  );
}

export default CountdownDisplay;