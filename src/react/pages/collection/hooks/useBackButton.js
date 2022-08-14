import {useEffect, useState} from "react";

const useBackButton = () => {
  const [isBack, setIsBack] = useState(false);
  const handleEvent = () => {
    // console.log('handleEvent');
    setIsBack(true);
  };

  useEffect(() => {
    // console.log('useEffect useBackButton');
    window.addEventListener("popstate", handleEvent);
    return () => {
      // console.log('useEffect useBackButton remove');
      setIsBack(false);
      window.removeEventListener("popstate", handleEvent)
    };
  });

  return isBack;
};

export default useBackButton;