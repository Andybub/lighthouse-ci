import './QuestionForm.scss';
import PropTypes from 'prop-types';
import { useCallback } from 'react';

const QuestionForm = ({ display, submitHandler, makeQuestionLoading }) => {
  // console.log('QuestionForm');
  const onSubmit = useCallback(
    (e) => {
      e.preventDefault();
      const { name, email, reviewBody } = e.target;
      const form = { name: name.value.trim(), email: email.value.trim(), reviewBody: reviewBody.value.trim() };
      submitHandler(form);
    },
    [submitHandler],
  );

  return (
    <form
      className="question-form-container"
      data-display={display}
      data-loading={makeQuestionLoading}
      onSubmit={onSubmit}
    >
      <div className="form-row">
        <div className="form-group col-12 col-md-6">
          <input type="text" className="form-control" name="name" placeholder="Enter your name" required />
        </div>
        <div className="form-group col-12 col-md-6">
          <input type="email" className="form-control" name="email" placeholder="john.smith@example.com" required />
        </div>
        <div className="form-group col-12">
          <textarea className="form-control" name="reviewBody" placeholder="Write your question here." required />
        </div>
        <button
          type="submit"
          className="btn btn-submit rounded-pill col-12 col-lg-4 align-self-center"
          disabled={makeQuestionLoading}
        >
          {makeQuestionLoading ? 'Sending...' : 'Submit'}
        </button>
      </div>
      <div className="loading app-placeholder position-absolute" data-display={makeQuestionLoading} />
    </form>
  );
};

export default QuestionForm;

QuestionForm.propTypes = {
  display: PropTypes.bool.isRequired,
  submitHandler: PropTypes.func.isRequired,
  makeQuestionLoading: PropTypes.bool.isRequired,
};

QuestionForm.defaultProps = {};
