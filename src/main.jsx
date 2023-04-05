import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import EncryptPage from './components/EncryptPage'
import './index.css'

const router = createBrowserRouter([
  {
    path: "/",
    element: <EncryptPage />,
  },
  {
    path: "/encrypt",
    element: <EncryptPage />,
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App>
      <RouterProvider router={router} />
    </App>
  </React.StrictMode>,
)
