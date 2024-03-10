import React, { useEffect, useRef, useState } from 'react'
import { eventSystem } from './event_system';

import PhaserGameComponent from "./phaser_component";
import LoginWindow from "./login_window";
import CharSelectWindow from "./char_select_window";

// import CSS
import './play.css';
import { MintNFT } from '../../js/MintNFT';
import TrxModal from '../../components/TrxModal';




// 브라우저 창의 크기가 변경될 때
window.addEventListener('resize', event => {

  //console.log("브라우저 창 크기 변경됨!");

}, false);


// 로그인과 캐릭터 선택 컴포넌트를 담는 부모 컴포넌트
// 여기에 페이저 컴포넌트를 넣을까?
function LoginWithCharacter({callbackMintNFT}) {


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
    onCharSelect={handleCharSelect}
    callbackMintNFT={callbackMintNFT}
     />;
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

const handleEvent = () => {

};

// 여기서 로그인 컴포넌트 사라지게 만들어야 함.
export default function PlayHome() {

  const [trxPage, setTrxPage] = useState(''); // 지갑으로부터 트랜잭션이 처리되고 페이저로 갈 지, 구매 컴포넌트로 갈 지 정해주는 변수. buyCharacterNFT 일때는 구매 컴포넌트로
  const [templateId, setTemplateId] = useState('');
  const [isTrxModalOpen, setIsTrxModalOpen] = useState(false); // 트랜잭션 결과를 알려주는 모달의 on, off
  const [trxIds, setTrxIds] = useState([]);

   // 트랜잭션 처리를 위한 ref들
   const ref_user_data = useRef(null); // 유저의 정보가 담길 input 태그
   const ref_trx_data = useRef(null); // 트랜잭션의 정보가 담길 input 태그
   const ref_wallet_start = useRef(null); // 지갑 팝업창을 띄어줄 버튼. click 메서드가 발동되면 지갑에 주입된 리스너의 콜백이 발동된다.
  
   const ref_status = useRef(null); // 지갑의 결과 성공 여부가 담길 input 태그
   const ref_result = useRef(null); // 지갑의 결과 데이터가 담길 input 태그
   const ref_wallet_finish = useRef(null); // 지갑의 동작이 끝난 뒤에 click 이벤트가 발생할 버튼 - click 이벤트에 ref_status와 ref_result의 값을 이용해 후처리를 해주면 된다.


   // 돈을 전송하는 트랜잭션을 발동시키는 콜백 메서드. 지갑에 의해 상호작용이 끝나면
   const callbackMintNFT = (amount, template_id) => {
     console.log("callbackMintNFT 호출", amount, template_id);
     
     
     setTrxPage('buyCharacterNFT'); // trxPage를 정의한다. 이는 철민씨가 작성한 트랜잭션과의 충돌을 피하기 위함이다.
     setTemplateId(template_id); // template id를 저장한다. 이 값은 sendComplete(지갑이 클릭리스너를 호출할 때)에서 쓰인다.

     
     // 돈을 전송한다. 이후 돈 전송이 끝나면 nft를 발급하는 코드가 작동된다.
     TransferHep(amount, ref_user_data, ref_trx_data, ref_wallet_start);
   }


  const sendComplete = async (value) => {

    // 2. 템플릿 id로 nft를 발행한다.
    if(trxPage === "buyCharacterNFT") {

      if(ref_status.current.value === "SUCCESS"){
        
        setTrxIds(prev => [...prev, JSON.parse(ref_result.current.value)[0]]);
        const mintRes = await MintNFT(templateId);

        console.log(mintRes);

        if(mintRes.status === "SUCCESS"){
          setTrxIds(prev => [...prev, mintRes.result.transaction_id]);
          handleTrxOpen();

        } else {
          alert("민팅 실패", mintRes);
        }

      } else {
        alert("토큰 전송 실패", ref_status.current.value);
      }
      
    } else {
      eventSystem.emit('sendComplete', value); // 철민씨가 작성한 거래소로 전송되는 코드      
    }
   
  }

  const handleTrxOpen = () => {
    console.log("handleTrxOpen 호출");
    setIsTrxModalOpen(true);
  }

  const handleTrxClose = () => {
    console.log("handleTrxClose 호출");
    setIsTrxModalOpen(false);
  
  }
  return (
    <>
      <TrxModal isTrxModalOpen={isTrxModalOpen} closeModal={handleTrxClose} trxIds={trxIds} ></TrxModal>
      
      <div id="container">
        <PhaserGameComponent/>
        <input id="auth_name_for_multi" type="hidden" value="" ref={ref_user_data}></input>
        <input id="datas_for_multi" type="hidden" ref={ref_trx_data}></input>
        <button id="transactions" type="hidden" ref={ref_wallet_start}></button>

        <input id="result_for_multi" type="hidden" ref={ref_result}></input>
        <input id="status_for_multi" type="hidden" ref={ref_status}></input>
        <button id="transaction_complete_for_multi" type="hidden" onClick={sendComplete} ref={ref_wallet_finish}></button>

        <LoginWithCharacter
            callbackMintNFT={callbackMintNFT}
        ></LoginWithCharacter>

      </div>
    </>

    
  );
}





function TransferHep(hep_amout, ref_user_data, ref_trx_data, ref_wallet_start) {
  
  if (ref_user_data.current && ref_trx_data.current && ref_wallet_start.current) {
    ref_user_data.current.value = localStorage.getItem("account_name"); // 유저데이터 넣어줌
    const trx_data = [
      {
        action_account: "eosio.token",
        action_name: "transfer",
        data: {
          from: localStorage.getItem("account_name"),
          to: "test4",
          quantity: hep_amout+".0000 HEP",
          memo: `${localStorage.getItem("account_name")}가 test4에게 토큰 전송`,
        },
      },
    ];    
    ref_trx_data.current.value = JSON.stringify(trx_data); // 트랜잭션 데이터 넣기

    ref_wallet_start.current.click(); // 버튼 클릭                          
  }    
}

