import PropTypes from 'prop-types';

const BodyAndFootnoteBlock = ({ bodyFootnote }) => {

  return (
    <div className="container body-and-footnote-block w-100">
      <div className="promo_body" dangerouslySetInnerHTML={{ __html: bodyFootnote.promo_body }} />
      <div className="promo_footnote" dangerouslySetInnerHTML={{ __html: bodyFootnote.promo_footnote }} />
    </div>
  )
};

BodyAndFootnoteBlock.propTypes = {
  bodyFootnote: PropTypes.object.isRequired,
};

export default BodyAndFootnoteBlock;
