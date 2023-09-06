import React, { useState } from 'react';
import './customDataListInput.css';

const CustomDataListInput = ({options, placeholder, onSelect}) => {
  const [selectedOption, setSelectedOption] = useState('');
  const [selectedCheckboxes, setSelectedCheckboxes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const filteredOptions = options.filter(
    (option) =>
      option.id.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1
  );

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleCheckboxChange = (event) => {
    console.log(event,"I changed")
    const { value } = event.target;
    const updatedCheckboxes =
      selectedCheckboxes.includes(value)
        ? selectedCheckboxes.filter((selected) => selected !== value)
        : [...selectedCheckboxes, value];
    setSelectedCheckboxes(updatedCheckboxes);
    onSelect(value)
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const toggleOptions = (event) => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="custom-input">
      <input
        type="text"
        placeholder={placeholder}
        value={selectedOption || searchTerm}
        onChange={handleSearchChange}
        onClick={toggleOptions}
      />
      {isOpen && (
        <div className="options">
          {filteredOptions.map((option) => (
            <label key={option.value} className="option">
              <input
                type="checkbox"
                value={option.value}
                checked={selectedCheckboxes.includes(option.value)}
                onChange={handleCheckboxChange}
              />
              <span>{option.id}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
};


export default CustomDataListInput;
