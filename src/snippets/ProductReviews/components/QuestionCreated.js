import './QuestionCreated.scss';
import { memo } from 'react';

const QuestionCreated = () => {
  // console.log('QuestionCreated');

  return (
    <div className="question-created-container container row">
      <p className="title col-12 text-center">Thank you for submitting a question!</p>
      <p className="body col-12 text-center">Your input is very much appreciated!</p>
    </div>
  );
};

export default memo(QuestionCreated);

QuestionCreated.propTypes = {};

QuestionCreated.defaultProps = {};
