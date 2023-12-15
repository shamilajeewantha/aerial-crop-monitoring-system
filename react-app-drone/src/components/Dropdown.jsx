import React, { useState } from 'react';

function Dropdown() {
  const [selectedOption, setSelectedOption] = useState('');

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  return (
    <div>
      <label>Select an option:</label>
      <select value={selectedOption} onChange={handleOptionChange}>
        <option value="">-- Select an option --</option>
        <option value="option1">Option 1</option>
        <option value="option2">Option 2</option>
        <option value="option3">Option 3</option>
      </select>
      <p>Selected Option: {selectedOption}</p>
    </div>
  );
}

export default Dropdown;
