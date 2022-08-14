import { memo } from 'react';
import PropTypes from 'prop-types';
import useWindowDimensions from '@/react/hooks/useWindowDimensions';
import QuestionItem from './QuestionItem';
import './QuestionList.scss';

const QuestionList = (props) => {
  const { questions, atVote } = props;

  let columns = 1;
  const { width } = useWindowDimensions();
  switch (true) {
    case width < 768:
      columns = 1;
      break;
    case width >= 768 && width < 1200:
      columns = 2;
      break;
    case width >= 1200:
      columns = 3;
      break;
    default:
  }

  const columnsContainer = [...Array(columns)].map(() => []);

  questions.reduce((acc, cur) => {
    const idx = questions.findIndex((item) => item.question.id === cur.question.id);
    const remainder = idx % columns;
    acc[remainder].push(cur);
    return acc;
  }, columnsContainer);

  return (
    <div className="question-list d-flex justify-content-between mt-5">
      {columnsContainer.map((columnQuestions, idx) => {
        return (
          <div key={Math.random()} className={`question-list-column media-body ${idx !== 0 && 'pl-4'}`}>
            {columnQuestions.map((question) => {
              return <QuestionItem key={question.question.id} question={question} atVote={atVote} />;
            })}
          </div>
        );
      })}
    </div>
  );
};

QuestionList.propTypes = {
  questions: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  atVote: PropTypes.func.isRequired,
};

export default memo(QuestionList);
