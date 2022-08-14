import PropTypes from 'prop-types';
import { memo, useEffect, useState, useRef } from 'react';
import './ReviewSearch.scss';

const SearchTopic = (props) => {
  const { topic, keyword, setKeyowrd, setInputValue } = props;

  const atClick = (topicTitle) => {
    const topicValue = topicTitle !== keyword ? topicTitle : '';

    setInputValue(topicValue);
    setKeyowrd(topicValue);
  };

  return (
    <button
      type="button"
      className="search-topic d-inline-flex align-items-center"
      data-active={topic.title === keyword}
      onClick={() => atClick(topic.title)}
    >
      <span>{topic.title}</span>
      <i className="icomoon-icon icomoon-close" />
    </button>
  );
};

SearchTopic.propTypes = {
  topic: PropTypes.shape({
    title: PropTypes.string.isRequired,
  }).isRequired,
  keyword: PropTypes.string.isRequired,
  setKeyowrd: PropTypes.func.isRequired,
  setInputValue: PropTypes.func.isRequired,
};

const ReviewSearch = (props) => {
  // eslint-disable-next-line no-unused-vars
  const { topics, atSearch } = props;

  const didMount = useRef(false);

  // const [inputValue, setInputValue] = useState('');
  // const [keyword, setKeyowrd] = useState('');
  const [selectValue, setSelectValue] = useState('photos');

  useEffect(() => {
    if (didMount.current) {
      // const [filterKey, filterValue] = selectValue.split(':');
      const params = {
        sortReviews: selectValue,
        // [filterKey]: filterValue,
        // search: keyword,
      };

      atSearch(params);
    } else {
      didMount.current = true;
    }
  }, [selectValue]);

  // const trySearch = () => {
  //   if (inputValue === keyword) return;
  //   setKeyowrd(inputValue);
  // };

  // const atKeyPress = (e) => {
  //   if (e.key === 'Enter') {
  //     trySearch();
  //   }
  // };

  const atChange = (e) => {
    setSelectValue(e.target.value);
  };

  return (
    <div className="review-search py-4">
      {/* <div className="review-search-top pb-4 py-md-5">
        <div className="review-search-input mb-4 position-relative">
          <input
            className="w-100"
            type="text"
            placeholder="What can we help you find?"
            onInput={(e) => setInputValue(e.target.value)}
            onKeyPress={atKeyPress}
            value={inputValue}
          />
          <button className="review-search-btn" type="button" onClick={trySearch}>
            <i className="icomoon-icon icomoon-nav-research" />
          </button>
        </div>
        <div className="review-search-topics">
          {topics.map((topic) => {
            return (
              <SearchTopic
                key={topic.topicId}
                topic={topic}
                keyword={keyword}
                setKeyowrd={setKeyowrd}
                setInputValue={setInputValue}
              />
            );
          })}
        </div>
      </div> */}
      <div className="review-search-bottom">
        <div className="review-search-filter position-relative">
          <select
            className="w-100"
            name="reviews-list-filter"
            id="reviews-list-filter"
            onChange={atChange}
            value={selectValue}
          >
            <option value="">Sort</option>
            <option value="photos">With Photos</option>
            {/* <option value="isVideo:true">With Videos</option> */}
            <option value="highest-rating">Highest Rating</option>
            <option value="lowest-rating">Lowest Rating</option>
            <option value="featured">Featured</option>
            <option value="most-votes">Most Helpful</option>
          </select>
          <i className="icomoon-icon icomoon-arrow-3" />
        </div>
      </div>
    </div>
  );
};

ReviewSearch.propTypes = {
  topics: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
    }),
  ).isRequired,
  atSearch: PropTypes.func.isRequired,
};

export default memo(ReviewSearch);
