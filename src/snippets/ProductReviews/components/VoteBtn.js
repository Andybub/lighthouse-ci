import './VoteBtn.scss';
import PropTypes from 'prop-types';
import { memo } from 'react';

const VoteBtn = (props) => {
  const { voteCount = 0, atVote } = props;

  return (
    <button type="button" className="vote-btn d-flex align-items-center" onClick={atVote}>
      <i className="icomoon-thumb-up" />
      <span className="ml-2">{voteCount}</span>
    </button>
  );
};

VoteBtn.propTypes = {
  voteCount: PropTypes.number.isRequired,
  atVote: PropTypes.func.isRequired,
};

export default memo(VoteBtn);
