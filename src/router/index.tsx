import NotFound from '../views/404';
import Home from '../views/Home/index';

const routes = [
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/*',
    element: <NotFound />,
  },
];

export default routes;
