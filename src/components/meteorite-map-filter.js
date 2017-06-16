import React from 'react';

/** @name MeteoriteMapFilter
 *  @description Adds ability to filter display of strikes by century
 *  @param filterFunctionalityActive determines whether filter functionality is possible */
const MeteoriteMapFilter = (props) => {
  const { currentFilter, filterFunctionalityActive, filterCategories, onUpdateFilter } = props;

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
    <div className="meteorite-map-filter">
      <ul className="show-for-medium menu align-center">
        {filterCategories.map(item => (
          <li
            key={item}
            className={currentFilter === item ? 'is-active' : null}
          >
            <a onClick={filterFunctionalityActive ? () => onUpdateFilter(item) : null}>{item}</a>
          </li>
        ))}
        <li
          className={currentFilter === null ? 'is-active' : null}
        >
          <a onClick={filterFunctionalityActive ? () => onUpdateFilter(null) : null}>All-Time</a>
        </li>
      </ul>
      <ul className="show-for-small-only menu expanded align-center row">
        <li className="column small-4">
          <a onClick={filterFunctionalityActive ? () => filterBackwards() : null}>&lt;&lt;</a>
        </li>
        <li className="is-active column small-4">
          {!filterFunctionalityActive && <a>{currentFilter === null ? ' ' : currentFilter}</a>}
          {filterFunctionalityActive && <a>{currentFilter === null ? 'All-Time' : currentFilter}</a>}
        </li>
        <li className="column small-4">
          <a onClick={filterFunctionalityActive ? () => filterForwards() : null}>&gt;&gt;</a>
        </li>
      </ul>
    </div>
  );
}

export default MeteoriteMapFilter;
