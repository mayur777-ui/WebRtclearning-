import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Lobby from './component/Lobby'; 
import Room from './component/Room';
const routeApp = createBrowserRouter([
  {
    path: '/',
    element: <Lobby />, 
  },
  {
    path:'/room/:roomId',
    element: <Room />
  }
]);

function App() {
  return <RouterProvider router={routeApp} />;
}

export default App;
