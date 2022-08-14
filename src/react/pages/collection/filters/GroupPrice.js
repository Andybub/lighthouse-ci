const GroupPrice = () => {

  const onClick = () => {
    console.log('GroupPrice click!');
  };

  return (
    <div>
      <div id="price-slider-container"/>
      <div className="price-container">
        <div className="price-control">
          <label htmlFor="price-min">$</label><input id="price-min" type="number" placeholder="0"/>
        </div>
        <span> - </span>
        <div className="price-control">
          <label htmlFor="price-max">$</label><input id="price-max" type="number" placeholder="100"/>
        </div>
        <button onClick={onClick} type="button" className="btn btn-submit">»</button>
        <p className="error-message d-none">Please fix price range</p>
      </div>
    </div>
  );
};

export default GroupPrice;