
import { useState, useEffect } from "react"
import { DateTime } from "luxon"

export const HeaderNavigation = () => {
	const [dueDates, setDueDates] = useState({
		"zd8nbaztu": null,
		"3nr7d4q3c": null,
		"3dquz0fdz": null,
	})

	useEffect(() => {
		setDueDates(oldDueDates => {
			const newDueDates = { ...oldDueDates }
			Object.keys(oldDueDates)
			.map(key => newDueDates[key] = DateTime.fromISO(localStorage.getItem(key)))

			return newDueDates
		})
	
	}, [])
	

	return (
    <header className="flex justify-between items-center px-6 py-4 bg-gray-100">
      {/* Logo Section */}
      <div className="text-2xl font-bold">
        <span>Logo</span>
      </div>

      {/* Navigation Menu Section */}
      <div className="flex justify-between flex-row grow max-w-[80%]">
        <a href="/">Create</a>
        <a href="/countdown/3dquz0fdz">1</a>
        <a href="/countdown/3nr7d4q3c">2</a>
        <a href="/countdown/zd8nbaztu">3</a>
      </div>
    </header>

	)}