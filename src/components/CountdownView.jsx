import React from 'react'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { DateTime } from 'luxon'
import CountdownDisplay from './CountdownDisplay'

export default function CountdownView() {
	const { id } = useParams();
	const [countdownData, setCountdownData] = useState(
		JSON.parse(localStorage.getItem(id))
	)

	return (
		<div>
			<h1 className='text-3xl'>Countdown</h1>
			<CountdownDisplay countdownData={countdownData} />
		</div>
	)
}