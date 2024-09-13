import React from 'react'
import { useParams } from 'react-router-dom'
import { DateTime } from 'luxon'
import CountdownDisplay from './CountdownDisplay'

export default function CountdownView() {
	const { id } = useParams();
	const countdownDate = localStorage.getItem(id);
	const countdownDateTime = DateTime.fromISO(countdownDate);

	return (
		<div>
			<h1 className='text-3xl'>Countdown</h1>
			<CountdownDisplay countdownDateTime={countdownDateTime} />
		</div>
	)
}