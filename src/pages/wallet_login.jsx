import React, { useEffect, useRef, useState } from 'react'
import { Outlet } from 'react-router-dom';
import Header from '../component/header';
import Footer from '../component/footer';
import { isLogin_user, new_postJSON } from '../js/api-new';
import Modal from "react-modal";
import { MdOutlineCancel } from "react-icons/md";

const customModalStyles = {
  overlay: {
    backgroundColor: " rgba(0, 0, 0, 0.4)",
    width: "100%",
    height: "100vh",
    zIndex: "10",
    position: "fixed",
    top: "0",
    left: "0",
  },
  content: {
    width: "700px",
    height: "380px",
    zIndex: "150",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -70%)",
    borderRadius: "10px",
    borderColor: "rgb(0,0,0)",
    boxShadow: "2px 2px 2px rgba(0, 0, 0, 0.25)",
    color: "white",
    backgroundColor: "#1A203C",
    justifyContent: "center",
    overflow: "auto",
  },
};
  
export default function Root() {

  
  const ref_user_data = useRef(null); // 유저의 정보가 담길 input 태그
  const ref_trx_data = useRef(null); // 트랜잭션의 정보가 담길 input 태그
  const ref_wallet_start = useRef(null); // 지갑 팝업창을 띄어줄 버튼. click 메서드가 발동되면 지갑에 주입된 리스너의 콜백이 발동된다.
  
  const ref_status = useRef(null); // 지갑의 결과 성공 여부가 담길 input 태그
  const ref_result = useRef(null); // 지갑의 결과 데이터가 담길 input 태그
  const ref_wallet_finish = useRef(null); // 지갑의 동작이 끝난 뒤에 click 이벤트가 발생할 버튼 - click 이벤트에 ref_status와 ref_result의 값을 이용해 후처리를 해주면 된다.

  const ref_wallet_login_start = useRef(null); // 지갑 로그인 팝업창을 띄어줄 버튼. click이 되면 지갑에서 주입한 리스너의 콜백이 발생한다.
  const ref_wallet_login_complete = useRef(null);  // 지갑의 동작이 끝난 뒤에 click 이벤트가 발생할 버튼
  const ref_user_name = useRef(null);
  const ref_user_key = useRef(null);
  

  const [isLogin, setIsLogin] = useState(false); // 로그인 관련 상태 관리 변수
  const [isNeedLoginModal, setIsNeedLoginModal] = useState(false); // 로그인 요구하는 모달


  const handleLogin = () => {
    console.log("handleLogin 호출");
    if(ref_wallet_login_start.current && ref_wallet_login_complete.current){
      ref_wallet_login_complete.current.addEventListener("click", handleLoginComplete);
      ref_wallet_login_start.current.click();
    }
  }
  

  // 지갑을 통해 계정 정보 가져온 이후 실행되는 함수
  const handleLoginComplete = async () => {
    console.log("handleLoginComplete 호출");

    if (ref_user_name.current && ref_user_key.current) {
      const nameValue = ref_user_name.current.value; // 계정 이름
      const keyValue = ref_user_key.current.value; // 공개 키

      console.log(`계정 이름 : ${nameValue}, 공개 키 : ${keyValue}`);
      
      const url = "http://221.148.25.234:6666/user";
      const data = {
        user_name : nameValue
      };

      new_postJSON(url, data).then((response) => {
        
        setIsLogin(true);
        setIsNeedLoginModal(false); // 모달 닫기

        console.log(`response : `,response);
        localStorage.setItem('access_token', response.accessToken);
        localStorage.setItem('account_name', nameValue);
        console.log(`access token 저장 확인 : `, localStorage.getItem('access_token'));

      });
    }    
  }

  useEffect(() => {
    isLogin_user()
    .then(res => {
      console.log(`응답 성공`, res);
      setIsLogin(true);      
    })
    .catch(error => {
      setIsLogin(false);      
      console.log(`로그인 정보가 없음.`, error);  
    });

  }, []);

  return (
    <>     
      <input id="auth_name_for_multi" type="hidden" ref={ref_user_data}></input>
      <input id="datas_for_multi" type="hidden" ref={ref_trx_data}/>
      <button id="transactions" ref={ref_wallet_start}></button>

      <input id="result_for_multi" type="hidden" ref={ref_result}></input>
      <input id="status_for_multi" type="hidden" ref={ref_status}></input>
      <button id="transaction_complete_for_multi" ref={ref_wallet_finish}></button>

      <button id="login" ref={ref_wallet_login_start}></button>
      <button id="login_complete" ref={ref_wallet_login_complete}></button>
      <input type="hidden" id="UserName" value="undefined" ref={ref_user_name}></input>
      <input type="hidden" id="UserKey" value="undefined" ref={ref_user_key}></input>
      

      <Modal
        isOpen={isNeedLoginModal}
        style={customModalStyles}
      >
        <div className="font-san w-full h-full flex flex-col justify-center items-center">
          <div className='self-end' onClick={() => setIsNeedLoginModal(false)}>
            <MdOutlineCancel size={35} />
          </div>        
          <div className="mt-7 text-4xl font-bold">Get started on Heptagon!</div>
          <div className="my-7 text-xl">Heptagon 지갑을 통해 로그인을 해주세요. </div>
          <button className='mt-10 rounded-full fontbold text-2xl py-4 px-10 bg-orange-400 w-full' onClick={handleLogin}>Login</button>
        </div>
      </Modal>

      <div className="flex flex-col items-center">
        <Header 
          isLogin={isLogin}
          setIsLogin={setIsLogin}
          
          ref_user_data={ref_user_data}  
          ref_trx_data={ref_trx_data}  
          ref_wallet_start={ref_wallet_start}  
          ref_status={ref_status}  
          ref_result={ref_result}            
          ref_wallet_finish={ref_wallet_finish}  
          
          ref_wallet_login_start={ref_wallet_login_start}
          ref_wallet_login_complete={ref_wallet_login_complete}
          ref_user_name={ref_user_name}
          ref_user_key={ref_user_key}
        />

        <div className="container mb-10 sm:px-0 px-3">
          <Outlet context={
            {
              isLogin : {isLogin},
              setIsLogin : {setIsLogin},
              ref_user_data : {ref_user_data},
              ref_trx_data : {ref_trx_data},
              ref_wallet_start : {ref_wallet_start},
              ref_status : {ref_status},
              ref_result : {ref_result},
              ref_wallet_finish : {ref_wallet_finish}
            }
          } 
          />
        </div>


        <Footer />
      </div>
    </>
  );
  
}