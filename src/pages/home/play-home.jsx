import React, { useEffect, useRef, useState } from 'react'
import { eventSystem } from './event_system';

import PhaserGameComponent from "./phaser_component";
import LoginWindow from "./login_window";
import CharSelectWindow from "./char_select_window";

// import CSS
import './play.css';




// 브라우저 창의 크기가 변경될 때
window.addEventListener('resize', event => {

  //console.log("브라우저 창 크기 변경됨!");

}, false);


// 로그인과 캐릭터 선택 컴포넌트를 담는 부모 컴포넌트
// 여기에 페이저 컴포넌트를 넣을까?
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

  // 캐릭터 선택하면 
  // 1. 캐릭터 선택 컴포넌트 닫고
  // 2. 페이저 컴포넌트에 캐릭터 정보 전달
  const handleCharSelect = (characterInfo) => {


    console.log("부모에서 확인하는 선택한 캐릭터 정보", characterInfo);

    // 캐릭터 선택 컴포넌트 닫기
    setCurrentComponent("");

    // 페이저 컴포넌트에 캐릭터 정보 전달
    //setCharInfo(characterInfo);

    // 캐릭터 선택 이벤트 발생
    eventSystem.emit('charSelection', characterInfo );


  }

  const [currentComponent, setCurrentComponent] = useState("login");

  // 선택한 캐릭터 정보 관리
  //const [charInfo, setCharInfo] = useState({});

  // 렌더링할 컴포넌트 저장
  let componentToRender;
  if (currentComponent === "login") {

    // 초기화 전에 'handleLogin'에 접근 불가능함.
    componentToRender = <LoginWindow onLogin={handleLogin} />;
  } else if (currentComponent === "characterSelect") {
    componentToRender = <CharSelectWindow 
    accountName={accountName}
    onCharSelect={handleCharSelect} />;
  } else {
    // 리액트에서 null이나 false를 렌더링할 경우 아무것도 표시하지 않는다.
    componentToRender = null;
  }


  return (

    <div>
      {componentToRender}
    </div>

  );

}

// 여기서 로그인 컴포넌트 사라지게 만들어야 함.
export default function PlayHome() {
  return (

    <div id="container">
      <PhaserGameComponent  />
{/*       <LoginWithCharacter />  */}
    </div>


  );

}

