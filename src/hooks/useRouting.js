import { goBack, goHome, goTo } from 'services/RoutingService';
import { useHistory } from 'react-router-dom';

const useRouting = () => {
  const history = useHistory();
  return {
    push: (pathname, state = {}) => goTo(history, pathname, state),
    goBack: (path) => path ? goTo(history, path) : goBack(history),
    goHome: () => goHome(history),
  };
};

export default useRouting;
