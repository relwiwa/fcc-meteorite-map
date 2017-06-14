import React from 'react';

import '../styles/map-filter.scss';

const MapFilter = (props) => {
  const { currentFilter, filterCategories, onUpdateFilter } = props;

  return (
    <ul className="map-filter menu align-center">
      <li
        className={currentFilter === null ? 'is-active' : null}
      >
        <a onClick={() => onUpdateFilter(null)}>All-time</a>
      </li>
      {filterCategories.map(item => (
        <li
          key={item}
          className={currentFilter === item ? 'is-active' : null}
        >
          <a onClick={() => onUpdateFilter(item)}>{item}</a>
        </li>
      ))}
    </ul>
  );
}

export default MapFilter;
