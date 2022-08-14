import './QuestionItem.scss';
import PropTypes from 'prop-types';
import { memo } from 'react';
import VoteBtn from './VoteBtn';

const QuestionContent = (props) => {
  const { author, date, content } = props;

  return (
    <div className="question-content">
      <div className="pb-4 d-flex justify-content-between align-items-center">
        <div className="question-item-author">{author}</div>
        <div className="question-item-date">{date}</div>
      </div>
      <div className="question-item-answer-content">{content}</div>
    </div>
  );
};

QuestionContent.propTypes = {
  author: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
};

const QuestionItem = (props) => {
  const { question: data, atVote } = props;
  const { question, voteUp } = data;
  const { name, message, dateCreated, answersList } = question;

  const dateFormat = (value) => {
    const date = new Date(value);
    return date.toLocaleDateString('en-US');
  };

  return (
    <div className="question-item py-5">
      <div className="question-item-top pb-4">
        <QuestionContent author={name} date={dateFormat(dateCreated)} content={message} />
      </div>
      <div className="question-item-bottom">
        <div className="question-item-answers-count pb-4 d-flex align-items-center">
          <i className="icomoon-bubble" />
          <span>Answers</span>
          <span>({answersList.length})</span>
        </div>
        <ul className="question-item-answers pb-4">
          {answersList.map((answer) => {
            return (
              <li key={answer.id} className="question-item-answer">
                <QuestionContent author={answer.name} date={dateFormat(answer.dateCreated)} content={answer.message} />
              </li>
            );
          })}
        </ul>
        <div className="d-flex justify-content-end">
          <VoteBtn voteCount={voteUp} atVote={() => atVote(question?.id)} />
        </div>
      </div>
    </div>
  );
};

QuestionItem.propTypes = {
  question: PropTypes.shape({
    question: PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      message: PropTypes.string.isRequired,
      dateCreated: PropTypes.string.isRequired,
      answersList: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
    }).isRequired,
    voteUp: PropTypes.number.isRequired,
  }).isRequired,
  atVote: PropTypes.func.isRequired,
};

export default memo(QuestionItem);
