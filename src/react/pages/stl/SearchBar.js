import { useEffect, useState } from 'react';
import './SearchBar.scss';
import { useModalContext } from '@/react/contexts/STLModal';

const SearchBar = () => {
  const { setPage, setSkus, search, setSearch } = useModalContext();
  const [searchValue, setSearchValue] = useState(search);

  useEffect(() => {
    setSearchValue(search);
  }, [search]);

  const onSearchValueChange = (e) => {
    setSearchValue(e.target.value);
  };

  const onSearchClickHandler = (e) => {
    setSearch(searchValue);
    setPage(1);
    setSkus('');
  };

  const onSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      setSearch(searchValue);
      setPage(1);
      setSkus('');
    }
  };

  return (
    <div className="stl-search-container">
      <input
        type="text"
        autoComplete="off"
        isp_ignore="off"
        placeholder="Search for Looks"
        value={searchValue}
        onChange={onSearchValueChange}
        onKeyPress={onSearchKeyPress}
      />
      <button type="button" onClick={onSearchClickHandler}>
        <i className="icomoon-nav-research" />
      </button>
    </div>
  );
};

export default SearchBar;
