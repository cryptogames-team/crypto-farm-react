import React, { useRef } from 'react';
import Logo from '../../assets/heptagon_logo.png'



// 리액트 함수 컴포넌트에서 페이저 게임 실행

// 이미지 import
import GameLogo from '../../assets/crypto_farm_logo.png'

// props 구조 분해 할당
function LoginWindow({onLogin}) {
  // 로그인 폼 관련 로직


  // 지갑 로그인 팝업창을 띄어줄 버튼. click이 되면 지갑에서 주입한 리스너의 콜백이 발생한다.
  const ref_wallet_login_start = useRef(null); 
  // 지갑의 동작이 끝난 뒤에 click 이벤트가 발생할 버튼
  const ref_wallet_login_complete = useRef(null);
  const ref_user_name = useRef(null);
  const ref_user_key = useRef(null);

  const handleLogin = () => {
    console.log("handleLogin 호출");
    if (ref_wallet_login_start.current && ref_wallet_login_complete.current) {
      ref_wallet_login_complete.current.addEventListener("click", handleLoginComplete);
      ref_wallet_login_start.current.click(); // 지갑에서 주입된 스크립트가 실행
    }
  }


  // 지갑을 통해 계정 정보 가져온 이후 실행되는 함수
  const handleLoginComplete = async () => {
    console.log("handleLoginComplete 호출");


    if (ref_user_name.current && ref_user_key.current) {
      // 계정 이름
      const nameValue = ref_user_name.current.value;
      // 공캐 키
      const keyValue = ref_user_key.current.value;

      // 로컬스토리지에 계정이름을 저장한다.
      localStorage.setItem("account_name", nameValue);
      // 로컬스토리지에 계정이름을 가져온다.
      console.log("로컬 스토리지 확인", localStorage.getItem("account_name"))

      console.log(`계정 이름 : ${nameValue}, 공개 키 : ${keyValue}`);


      // 부모 컴포넌트한테 로그인한 계정 이름 보내기
      onLogin(nameValue);
    }
  }


  return (
    <div className="login_wrapper">
      {/*지갑 로그인 관련 태그들 - return 안에 어디에 위치시키든 상관없다. */}
      <button id="login" ref={ref_wallet_login_start} type='hidden'></button>
      <button id="login_complete" ref={ref_wallet_login_complete} type='hidden'></button>
      <input type="hidden" id="UserName" value="undefined" ref={ref_user_name}></input>
      <input type="hidden" id="UserKey" value="undefined" ref={ref_user_key}></input>


      <div className='border_container'>
        <img src={GameLogo} className="gamelogo" />
        <p id ="login_text">Login</p>
        <div className="border1">
          <div className="border2">
            <div className="border3">
              <div className="border4">
{/*               <button onClick={() => props.onAction("안녕하세요?")}>
              props</button> */}

                <div className="border5">
                  <button className="button" onClick={handleLogin}>
                    <img src={Logo} className="heptagon" /> Heptagon Wallet</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>


    </div>






  );

}

export default LoginWindow;
