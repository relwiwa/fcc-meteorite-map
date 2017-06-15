import React from 'react';

const MapFilter = (props) => {
  const { currentFilter, filterCategories, onUpdateFilter } = props;

  const filterBackwards = () => {
    if (currentFilter === null) {
      onUpdateFilter(filterCategories[filterCategories.length - 1]);
    }
    else if (currentFilter === filterCategories[0]) {
      onUpdateFilter(null);
    }
    else {
      onUpdateFilter(currentFilter - 100);
    }
  }

  const filterForwards = () => {
    if (currentFilter === filterCategories[filterCategories.length - 1]) {
      onUpdateFilter(null);
    }
    else if (currentFilter === null) {
      onUpdateFilter(filterCategories[0]);
    }
    else {
      onUpdateFilter(currentFilter + 100);
    }
  }

  return (
    <div className="map-filter">
      <ul className="show-for-medium menu align-center">
        <li
          className={currentFilter === null ? 'is-active' : null}
        >
          <a onClick={() => onUpdateFilter(null)}>All-Time</a>
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
      <ul className="show-for-small-only menu expanded align-center row">
        <li className="column small-4">
          <a onClick={() => filterBackwards()}>&lt;&lt;&lt;</a>
        </li>
        <li className="is-active column small-4">
          <a>{currentFilter === null ? 'All-Time' : currentFilter}</a>
        </li>
        <li className="column small-4">
          <a onClick={() => filterForwards()}>&gt;&gt;&gt;</a>
        </li>
      </ul>
    </div>
  );
}

export default MapFilter;
