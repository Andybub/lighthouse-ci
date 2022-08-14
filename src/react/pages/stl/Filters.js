import { useState, useCallback, useEffect } from 'react';
import './Filters.scss';
import FiltersCategory from '@/react/ui/stl/FilterCategory';
import { useModalContext } from '@/react/contexts/STLModal';

const Filters = ({ sourceTags }) => {
  const { selectedTags, setSelectedTags, setPage, setSkus } = useModalContext();

  const [tags, setTags] = useState([]);
  const [isCollapse, setCollapse] = useState(false);
  const [collapseIndex, setCollapseIndex] = useState(0);
  const [toggle, setToggle] = useState(false); // for mobile

  const removeTag = useCallback(
    (group, value) => {
      const _array = selectedTags.filter((tag) => {
        const [_group, _value] = tag.split(':');
        return group !== _group || value !== _value;
      });
      setSelectedTags(_array);
      setPage(1);
      setSkus('');
    },
    [selectedTags, setSelectedTags, setPage, setSkus],
  );

  const removeAllSelectedTags = useCallback(() => {
    setSelectedTags([]);
    setPage(1);
    setSkus('');
  }, [setSelectedTags, setPage, setSkus]);

  useEffect(() => {
    const list = [];
    sourceTags.forEach((group_value_count, index) => {
      const [group, value, count = 0] = group_value_count.split(':');
      if (value) {
        const found = list.find((tag) => tag.group === group);
        if (found) {
          found.values.push({ value, count });
        } else {
          list.push({ group, values: [{ value, count }] });
        }
      }
    });

    list.sort((a, b) => (a.group > b.group ? 1 : -1));
    list.forEach((tag) => {
      tag.values.sort((a, b) => (a.value > b.value ? 1 : -1));
    });
    setTags(list);
  }, [sourceTags]);

  return (
    <div className={`stl-filters-container ${toggle ? 'toggle-on' : ''}`}>
      <button
        className="btn-toggle-on"
        onClick={() => {
          setToggle(true);
        }}
      >
        <i className="icomoon icomoon-equalizer" />
        <span>Filter By</span>
      </button>
      <div
        className="stl-filter-block"
        onClick={() => {
          setToggle(false);
        }}
      />
      <div className="stl-filters-inner">
        <button
          className="btn-toggle-off"
          onClick={() => {
            setToggle(false);
          }}
        >
          <i className="icomoon icomoon-close-2" />
        </button>
        {selectedTags && selectedTags.length > 0 && (
          <div className={`stl-selected-tags-container ${isCollapse ? 'collapse' : ''}`}>
            <div className="head" onClick={() => setCollapse(!isCollapse)}>
              <span>SELECTED TAGS</span>
              <i className="icomoon icomoon-arrow-2" />
            </div>
            <ul className="body">
              {selectedTags.map((group_value) => {
                // console.log(group_value);
                const [group, value] = group_value.split(':');
                return (
                  <li
                    data-tag-group={group}
                    data-tag-value={value}
                    key={group_value}
                    onClick={() => {
                      removeTag(group, value);
                    }}
                  >
                    <span>{value}</span>
                    <i className="icomoon icomoon-close" />
                  </li>
                );
              })}
            </ul>
            <button type="button" onClick={removeAllSelectedTags}>
              Clear All
            </button>
          </div>
        )}
        <ul className="stl-selectable-tags-container">
          {tags.map((groups, index) => {
            return (
              <FiltersCategory
                groups={groups}
                index={index}
                collapseIndex={collapseIndex}
                setCollapseIndex={setCollapseIndex}
                key={groups.group}
              />
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default Filters;
