import React, { useState } from 'react';

export function SearchBar(props) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchQueryChange = (event) => {
    setSearchQuery(event.target.value);
    // Call the parent component's function to update the search results
    props.handleSearchQueryChange(event.target.value);
  };

  return (
    <div>
      <input type="text" value={searchQuery} onChange={handleSearchQueryChange} placeholder="Search for vets..." />
    </div>
  );
};