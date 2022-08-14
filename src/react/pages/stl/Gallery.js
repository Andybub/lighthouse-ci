import { useState } from 'react';
import Masonry from 'react-masonry-component';
import './Gallery.scss';
import { useModalContext } from '@/react/contexts/STLModal';
// https://github.com/eiriklv/react-masonry-component

const Item = ({ look }) => {
  const { setPopupLook } = useModalContext();
  const [isImgLoaded, setImgLoaded] = useState(false);

  const onImgLoaded = (e) => {
    // console.log("onImgLoaded");
    // console.log(e);
    setImgLoaded(true);
  };

  return (
    <li
      className="stl-image-container gtm-click-stl"
      onClick={() => {
        setPopupLook(look.id);
      }}
    >
      <div className={`stl-sub-image-container ${isImgLoaded ? '' : 'loading'}`}>
        <img
          className="tw-stl-gallery-image"
          data-look-id={look.id}
          src={look.image_url}
          alt={look.title}
          onLoad={onImgLoaded}
        />
        <p>
          <span>{look.title}</span>
        </p>
      </div>
    </li>
  );
};

const Gallery = ({ looks }) => {
  // console.log("Gallery.js");
  const masonryOptions = { transitionDuration: 0 };

  return (
    <Masonry
      className="stl-gallery-container" // default ''
      elementType="ul" // default 'div'
      options={masonryOptions} // default {}
      updateOnEachImageLoad
    >
      {looks.map((look) => {
        return <Item look={look} key={look.id} />;
      })}
    </Masonry>
  );
};

export default Gallery;
