import { useState } from 'react';
import './App.css';

function App() {
	//State for selected dropdown value
	const [selectedValue, setSelectedValue] = useState('');
  
	//State for the user input text
	const [userInput, setUserInput] = useState('');
  
	//State to display the result
	const [result, setResult] = useState('');

	//Handle dropdown change
	const handleChange = (event) => {
		setSelectedValue(event.target.value);
	};

	//Handle text input change
	const handleTextChange = (event) => {
		setUserInput(event.target.value);
	};

	//Handle button click to print the result
	const handleButtonClick = () => {
		setResult(`Search Type: ${selectedValue} | User Text: ${userInput}`);
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

		<iframe
        	src='https://open.spotify.com/embed/artist/1Qp56T7n950O3EGMsSl81D?utm_source=generator'
        	width="300"
        	height="380"
        	allow="encrypted-media"
        	title="Spotify Embed"
      	>
		</iframe>

	</div>
	);
}

export default App;

