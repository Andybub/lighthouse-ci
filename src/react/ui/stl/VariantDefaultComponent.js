import { useCallback, useEffect, useMemo, memo, useRef } from 'react';

import { useProductContext } from '@/react/contexts/STLProduct';

const VariantDefaultComponent = () => {
  const { productData, variantDefaultData, variantDefaultIndex, setVariantDefaultIndex } = useProductContext();

  const displayName = useMemo(
    () => variantDefaultData[variantDefaultIndex].option1,
    [variantDefaultData, variantDefaultIndex],
  );

  const getVariantPrice = useCallback(
    (variant) => {
      const { title, price } = variant;
      const arr = /^pack of (\d+)/i.exec(title);
      const unitCount = arr && arr.length > 1 ? +arr[1] : 0;
      if (unitCount) return `$${(Math.round(price / +unitCount) * 0.01).toFixed(2)} each`;
      const { caseQty, unit_name: unitName } = productData;
      if (caseQty < 1) return '';
      const casePrice = Math.round(((100 * price) / caseQty) * 0.01);
      return `$${(casePrice * 0.01).toFixed(2)} per ${unitName || 'pack'}`;
    },
    [productData],
  );

  const showSaving = useCallback((variant) => variant.title.toLowerCase().includes('case'), []);

  const savingPercent = useMemo(() => {
    let unitCount = 0;
    let basePrice = 0;
    let casePrice = 0;
    let normalPrice = 0;
    variantDefaultData.forEach((variant) => {
      const title = variant.title.toLowerCase();
      if (title.includes('pack of')) {
        basePrice = variant.price;
        const arr = /pack of (\d+)/.exec(title);
        unitCount = arr && arr.length > 1 ? +arr[1] : 0;
      } else casePrice = variant.price;
    });
    const { caseQty } = productData;
    if (caseQty < 1) return '';
    if (caseQty === +unitCount) normalPrice = +unitCount * basePrice;
    else normalPrice = (caseQty / +unitCount) * basePrice;
    const avgSave = (normalPrice - casePrice) / normalPrice;
    return ` Save ${Math.round(100 * avgSave)}%`;
  }, [productData, variantDefaultData]);

  const isTypeLetter = useMemo(() => {
    return productData.data.tags.includes('type-letter');
  }, [productData]);

  const onSelectChange = useCallback(
    (e) => {
      setVariantDefaultIndex(e.target.selectedIndex);
    },
    [setVariantDefaultIndex],
  );

  const selectRef = useRef();
  useEffect(() => {
    if (productData && selectRef && selectRef.current) {
      selectRef.current.selectedIndex = 0;
    }
  }, [productData, selectRef]);

  return (
    <div className="variant-container variant-default-container">
      {!!variantDefaultData && variantDefaultData.length > 1 && (
        <>
          <p className="title">
            {!isTypeLetter && <span>Set : </span>}
            {isTypeLetter && <span>Style : </span>}
            <span>{displayName}</span>
          </p>
          {!isTypeLetter && (
            <ul>
              {variantDefaultData.map((variant, index) => {
                const { id } = variant;
                return (
                  <li
                    key={id}
                    data-variant-id={id}
                    onClick={() => setVariantDefaultIndex(index)}
                    className={variantDefaultIndex === index ? 'active' : ''}
                  >
                    <div className="txt-variant-name">{variant.option1}</div>
                    <div className="txt-each-saving">
                      <span className="txt-each-price">{getVariantPrice(variant)}</span>
                      {index > 0 && showSaving && <span className="txt-saving-percentage">{savingPercent}</span>}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
          {isTypeLetter && (
            <select onChange={onSelectChange} ref={selectRef}>
              {variantDefaultData.map((variant) => {
                const { id } = variant;
                return (
                  <option value="{variant.title}" key={id} data-variant-id={id}>
                    {variant.title}
                  </option>
                );
              })}
            </select>
          )}
        </>
      )}
    </div>
  );
};

export default memo(VariantDefaultComponent);
