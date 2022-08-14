import './index.scss';
import PropTypes from 'prop-types';
import { useCallback } from 'react';
import { highlight } from '@/react/utils/highlight';

const RelatedTerms = (props) => {
  const { relatedTerms, mainTerm, setRealRequest } = props;

  const onClick = useCallback(
    (e) => {
      e.preventDefault();
      // console.log(e.target.dataset.term);
      setRealRequest((request) => ({ ...request, page: 1, narrowBy: [], query: e.target.dataset.term }));
    },
    [setRealRequest],
  );

  return (
    <div className="related-term-container w-100">
      {relatedTerms.map((relatedTerm) => {
        const [front, middle, back] = highlight(relatedTerm, mainTerm);
        return (
          <a
            key={relatedTerm}
            onClick={onClick}
            href={`/pages/search-result?q=${relatedTerm}`}
            className="related-term rounded-pill d-inline-block mr-3 prevent-children"
            data-term={relatedTerm}
          >
            {front}
            {middle && <span className="font-weight-bold">{middle}</span>}
            {back}
          </a>
        );
      })}
    </div>
  );
};

RelatedTerms.propTypes = {
  relatedTerms: PropTypes.array.isRequired,
  mainTerm: PropTypes.string.isRequired,
  setRealRequest: PropTypes.func.isRequired,
};

export default RelatedTerms;
