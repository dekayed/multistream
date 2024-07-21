import { createBrowserRouter } from 'react-router-dom';

import { Space } from 'space';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Space />,
  },
  {
    path: '/:encKey',
    element: <Space />,
  },
]);