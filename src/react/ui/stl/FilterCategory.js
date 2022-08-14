import { useCallback } from 'react';
import { useModalContext } from '@/react/contexts/STLModal';

const FiltersCategory = ({ groups, index, collapseIndex, setCollapseIndex }) => {
  const { selectedTags, setSelectedTags, setPage, setSkus } = useModalContext();

  const toggleTagsGroup = useCallback(
    (e) => {
      if (index === collapseIndex) setCollapseIndex(-1);
      else setCollapseIndex(index);
    },
    [index, collapseIndex, setCollapseIndex],
  );

  const getIfChecked = useCallback(
    (group, value) => {
      let selected = false;
      selectedTags.forEach((group_value) => {
        const [_group, _value] = group_value.split(':');
        if (group === _group && value === _value) {
          selected = true;
        }
      });
      return selected;
    },
    [selectedTags],
  );

  const addTag = useCallback(
    (group, value) => {
      const _array = selectedTags.concat(`${group}:${value}`);
      setSelectedTags(_array);
      setPage(1);
      setSkus('');
    },
    [selectedTags, setSelectedTags, setPage, setSkus],
  );

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

  const onChangeHandler = useCallback(
    (e, group, value) => {
      const { checked } = e.target;
      if (checked) addTag(group, value);
      else removeTag(group, value);
    },
    [addTag, removeTag],
  );

  return (
    <li className={`stl-tags-group ${index !== collapseIndex ? 'collapse' : ''}`}>
      <div className="head" onClick={toggleTagsGroup}>
        <span>{groups.group}</span>
        <i className="icomoon icomoon-arrow-2" />
      </div>
      <ul className="body">
        {groups.values.map((value) => {
          const { group } = groups;
          const id = `stl-tags-${group}-category-${value.value}`;
          return (
            <li key={value.value}>
              <input
                type="checkbox"
                id={id}
                className="tw-stl-filter-checkbox"
                data-tag-group={group}
                data-tag-value={value.value}
                data-tag-count={value.count}
                checked={getIfChecked(group, value.value)}
                onChange={(e) => {
                  onChangeHandler(e, group, value.value);
                }}
              />
              <label htmlFor={id}>{`${value.value} (${value.count})`}</label>
            </li>
          );
        })}
      </ul>
    </li>
  );
};

export default FiltersCategory;
