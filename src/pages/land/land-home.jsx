import React from 'react'
import {useLoaderData } from "react-router-dom";
  
export default function LandHome() {
  const loader_data = useLoaderData();
  console.log(`loader_data : `, loader_data);
  
  return (
    <>
      <div>랜드</div>
    </>
  );
  
}