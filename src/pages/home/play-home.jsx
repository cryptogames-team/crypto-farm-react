import React, { useEffect, useRef, useState } from 'react'

import PhaserGameComponent from "./phaser_component";
import LoginWindow from "./login_window";
import CharSelectWindow from "./char_select_window";

// import CSS
import './play.css';




// 브라우저 창의 크기가 변경될 때
window.addEventListener('resize', event => {

  //console.log("브라우저 창 크기 변경됨!");

}, false);





// 리액트 컴포넌트에서 반드시 return() 포함되어야 함.
// 로그인과 캐릭터 선택 컴포넌트를 담는 부모 컴포넌트
// 컴포넌트 전환이 이루어져야 한다.
function LoginWithCharacter() {


  // useState 미사용하면 변수가 변경되어도 렌더링이 안되거나 적용이 안된다.
  // 계정 이름 관리
  const [accountName, setAccountName] = useState('');


  // 로그인 컴포넌트에서 지갑 로그인이 완료되면 계정 이름을 받고
  // 로그인 컴포넌트 -> 캐릭터 선택 컴포넌트로 교체하는 함수
  const handleLogin = (value) => {
    console.log("로그인 컴포넌트한테 받은 계정 이름 :", value);


    // 로그인 컴포넌트로부터 받은 계정 이름 전달
    setAccountName(value);

    setCurrentComponent("characterSelect");
  }

  // 로그인 컴포넌트로부터 받은 계정 이름 전달
  // props에 함수로 전달하는게 맞나


  const [currentComponent, setCurrentComponent] = useState("login");

  // 렌더링할 컴포넌트 저장
  let componentToRender;
  if (currentComponent === "login") {

    // 초기화 전에 'handleLogin'에 접근 불가능함.
    componentToRender = <LoginWindow onLogin={handleLogin} />;
  } else {
    componentToRender = <CharSelectWindow accountName={accountName} />;
  }


  return (

    <div>
      {componentToRender}
    </div>

  );

}


export default function PlayHome() {
  return (

    <div id="container">
      <PhaserGameComponent />
      <LoginWithCharacter />
    </div>


  );

}

