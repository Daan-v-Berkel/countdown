import React from 'react'
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import CountdownDisplay from './CountdownDisplay'

export default function CountdownView() {
	const { id } = useParams();
	const [countdownData, setCountdownData] = useState({})
	const [countdownDetails, setCountdownDetails] = useState({})
	const [countdownStyling, setCountdownStyling] = useState({})

	useEffect(() => {
		const allData = JSON.parse(localStorage.getItem(id))
		setCountdownData(allData.countdownData)
		setCountdownDetails(allData.countdownDetails)
		setCountdownStyling(allData.countdownStyling)
	}, [id])

	return (
		<div>
			<h1 className='text-3xl'>Countdown</h1>
			<CountdownDisplay 
			countdownData={countdownData}
			countdownDetails={countdownDetails}
			countdownStyling={countdownStyling} />
		</div>
	)
}