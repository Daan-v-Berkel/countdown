import { DateTime } from 'luxon';
import React, { useState, useEffect } from 'react';

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
        const countdownDuration = countdownDateTime.diff(DateTime.now(), ['years', 'months', 'days', 'hours', 'minutes', 'seconds']);
				console.log(countdownDuration.toMillis())
				console.log(typeof countdownData.keepCounting)
        if ((countdownDuration.toMillis() <= 0) && !countdownData.keepCounting) {
          setIsFinished(true);
          clearInterval(intervalId);
        } else {
					setIsFinished(false);
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
  }, [countdownData]);


  return (
    <div className="border-2 border-slate-200 grow flex items-center align-middle">
			<div className="w-fit h-fit mx-auto">
				{(isFinished && !countdownData.keepCounting) ? <p>Countdown finished</p>
				:
				timeLeft.seconds === null
				?
				<p>Loading...</p>
					:
					Object.entries(timeLeft).map(([key, value]) => (
						Math.abs(value) > 0 && <span key={key}>{Math.abs(parseInt(value))} {key} </span>
					))}
			</div>
    </div>
  );
}

export default CountdownDisplay;