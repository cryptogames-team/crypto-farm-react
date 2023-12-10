import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {createBrowserRouter, RouterProvider, Outlet, Link} from "react-router-dom";
import ErrorPage from './pages/home/error-page';
import LandHome from './pages/land/land-home';
import MarketHome from './pages/market/market-home';
import PlayHome from './pages/home/play-home';
import PlayIndex from './pages/home/play-index';
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
  
    <RouterProvider router={router} />
  
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
