import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
    if (window?.performance?.navigation?.type === 1) {
      window.location.hash = "#/";
    }
  }, [pathname]);

  return null;
};

export default ScrollToTop;