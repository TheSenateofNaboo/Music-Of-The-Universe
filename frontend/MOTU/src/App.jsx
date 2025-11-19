/*This is the main page*/

import { useState } from 'react'
import './App.css'
import {SearchBar} from "./components/SearchBar/SearchBar.jsx"
import {SearchResultsList} from "./components/SearchBar/SearchResultsList.jsx"

function App() {
	const [results, setResults] = useState([])

	const [selectedValue, setSelectedValue] = useState('');

  	const handleChange = (event) => {
    	setSelectedValue(event.target.value);
  	};


	return (
		<div className="App">
			<div className="lightning-title">
      			<h>MUSIC OF THE UNIVERSE</h>
    		</div>
			<div className="search-bar-container">
				<SearchBar setResults={setResults} />
				<SearchResultsList results={results} />
				<label htmlFor="dropdown">Select an option: </label>
      			<select id="dropdown" value={selectedValue} onChange={handleChange}>
        			<option value="">-- Choose an option --</option>
        			<option value="option1">Option 1</option>
        			<option value="option2">Option 2</option>
        			<option value="option3">Option 3</option>
      			</select>
      			<p>Selected Value: {selectedValue}</p>
			</div>

			<div className="castle-background">
			</div>
    	</div>
  )
}

export default App
