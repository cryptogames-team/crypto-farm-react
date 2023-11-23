import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {createBrowserRouter, RouterProvider, Outlet, Link} from "react-router-dom";
import ErrorPage from './pages/error-page';
import LandHome from './pages/land/land-home';
import MarketHome from './pages/market/market-home';
import PlayHome from './pages/play-home';
import PlayIndex from './pages/play-index';
import { landLoader } from './loader/land-loader';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "play",
        element: <PlayIndex />,
        children: [
          {index : true, element: <PlayHome />},
          {path: "land/:assetId", element: <LandHome />, loader:landLoader},
          {path: "market", element: <MarketHome />},
        ]
      }
    ],
    errorElement: <ErrorPage />
  }
]);


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
