import { useState } from 'react';
import './App.css';

function App() {

	//State for selected dropdown value
	const [selectedValue, setSelectedValue] = useState('');
  
	//State for the user input text
	const [userInput, setUserInput] = useState('');
  
	//State to display the result
	const [result, setResult] = useState('');

	//Hold our IDs
	const [recommendationIds, setRecommendationIds] = useState([]);

	//Handle dropdown change
	const handleChange = (event) => {
		setSelectedValue(event.target.value);
	};

	//Handle text input change
	const handleTextChange = (event) => {
		setUserInput(event.target.value);
	};

	//Handle button click to print the result
	const handleButtonClick = async () => {
        const type = selectedValue;
        const query = userInput;

        if (!type || !query) {
            setResult("Please select a type and enter a search term.");
            return;
        }

        try {
            const response = await fetch(`http://localhost:3000/api/recommendations?type=${type}&${type}=${query.replace(/ /g, '+')}`);
            
            if (!response.ok) {
                throw new Error(`HTTP Error`);
            }

            const data = await response.json();

			const ids = data.recommendations.map((rec) => rec.id);
        	setRecommendationIds(ids);

            setResult(`type=${type} | ${type}=${query}`);
            
        } catch (error) {
            setResult("No Results");
        }
    };

	return (
		<div className="App">
		<div className="lightning-title">
			<h>MUSIC OF THE UNIVERSE</h>
		</div>
      
		<div className="search">
			<label htmlFor="dropdown">Select an option: </label>
			<select id="dropdown" value={selectedValue} onChange={handleChange}>
				<option value="">-- Choose an option --</option>
				<option value="album">Album</option>
				<option value="artist">Artist</option>
				<option value="genre">Genre</option>
				<option value="track">Song</option>
			</select>
		</div>

		<div className="text-box">
			<label htmlFor="userInput">Enter Search Term: </label>
			<input 
				type="text" 
				id="userInput" 
				value={userInput} 
				onChange={handleTextChange} 
			/>
		</div>

		<div className="submit-button">
			<button onClick={handleButtonClick}>Submit</button>
		</div>

		<div className="result-display">
			{result && <p>{result}</p>}
		</div>

		{recommendationIds.length > 0 && (
        	<ul>
          		{recommendationIds.map((id) => (
            		<li key={id}>
						<iframe
        					src={`https://open.spotify.com/embed/track/${id}?utm_source=generator`}
        					width="300"
        					height="140"
        					allow="encrypted-media"
        					title="Spotify Embed"
      					>
						</iframe>
					</li>
          		))}
        	</ul>
      	)}

	</div>
	);
}

export default App;

