import './QuestionsContainer.scss';
import PropTypes from 'prop-types';
import { useCallback, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { checkQuestionForm } from '@/utils/Stamped';
import { getHeaderHeight } from '@/react/utils/public';
import { makeQuestion, fetchQuestionsList, makeVoteQuestion } from '../actions';
import QuestionForm from '../components/QuestionForm';
import QuestionCreated from '../components/QuestionCreated';
import QuestionList from '../components/QuestionList';
import Pagination from '../components/Pagination';

const QuestionsContainer = ({ display }) => {
  const dispatch = useDispatch();
  const { questionCreated, questionsListParams, questionsList, makeQuestionLoading } = useSelector(
    (state) => state.data,
  );
  const [displayForm, setDisplayForm] = useState(false);

  const clickWriteQuestionHandler = useCallback(() => {
    // console.log('clickWriteQuestionHandler');
    setDisplayForm(true);
  }, [setDisplayForm]);

  const submitHandler = useCallback((form) => {
    // console.log('submitHandler');
    if (checkQuestionForm(form)) {
      dispatch(makeQuestion(form));
    }
  }, []);

  /**
   * Questions List Data
   */
  const { results: questions, total } = questionsList || {};
  const { page, search } = questionsListParams || {};
  console.log('search', search);
  const changePage = (pageEmit) => {
    dispatch(fetchQuestionsList({ page: pageEmit, search }));
    const anchor = document.getElementById('questionListAnchor');
    anchor.scrollIntoView({
      behavior: 'smooth',
    });
  };

  /**
   * Voting Func
   */
  const atVote = async (questionId) => {
    await dispatch(makeVoteQuestion({ questionId }));
    dispatch(fetchQuestionsList(questionsListParams));
  };

  return (
    <div className="questions-container container" data-display={display}>
      <div className="form-container row justify-content-between">
        {!questionCreated && (
          <div className="col-12 text-center">
            <button
              type="button"
              className="btn-write-question rounded-pill prevent-children"
              onClick={clickWriteQuestionHandler}
              data-display={!displayForm}
            >
              <i className="icomoon-write" />
              Write a Question
            </button>
            <QuestionForm
              display={displayForm}
              submitHandler={submitHandler}
              makeQuestionLoading={makeQuestionLoading}
            />
          </div>
        )}
        {questionCreated && <QuestionCreated />}
      </div>
      <div className="position-relative">
        <div id="questionListAnchor" style={{ position: 'absolute', top: `-${getHeaderHeight()}px` }} />
      </div>
      {!!questions?.length && (
        <>
          <QuestionList questions={questions} atVote={atVote} />
          <Pagination
            urrentPage={page}
            itemsPerPage={10}
            totalData={total}
            pagesLengthLimit={8}
            changePage={changePage}
          />
        </>
      )}
    </div>
  );
};

export default QuestionsContainer;

QuestionsContainer.propTypes = {
  display: PropTypes.bool.isRequired,
};

QuestionsContainer.defaultProps = {};
