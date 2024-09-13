import React from 'react'
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import CountdownDisplay from './CountdownDisplay'

export default function CountdownView() {
	const { id } = useParams();
	const [countdownData, setCountdownData] = useState({}
	)

	useEffect(() => {
		setCountdownData(JSON.parse(localStorage.getItem(id)))
	}, [id])

	return (
		<div>
			<h1 className='text-3xl'>Countdown</h1>
			<CountdownDisplay countdownData={countdownData} />
		</div>
	)
}