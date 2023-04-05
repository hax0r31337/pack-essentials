import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import EncryptPage from './page/EncryptPage'
import DecryptPage from './page/DecryptPage'
import './index.css'

const router = createBrowserRouter([
  {
    path: "/",
    element: <EncryptPage />,
  },
  {
    path: "/encrypt",
    element: <EncryptPage />,
  },
  {
    path: "/decrypt",
    element: <DecryptPage />,
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <div className="ribbon">
      <a href="https://github.com/hax0r31337/pack-essentials" target="_blank">Fork me on GitHub</a>
    </div>
    <App>
      <RouterProvider router={router} />
    </App>
  </React.StrictMode>,
)
