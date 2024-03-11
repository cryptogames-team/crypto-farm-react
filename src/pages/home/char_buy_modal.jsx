import React, { useEffect, useState } from 'react';
// import custom function component
import CharCreateItem from './char_create_item';
import CharInputForm from './char_inputform';
import CharResultModal from './char_result_modal';
import {MintNFT} from '../../js/MintNFT'


// import image
import closeImage from '../../assets/close.png'
import c1 from '../../assets/c1.png'
import c2 from '../../assets/c2.png'
import c3 from '../../assets/c3.png'
import c4 from '../../assets/c4.png'
import TrxModal from '../../components/TrxModal';
import { BsCartCheck } from "react-icons/bs";
import { ReadAccount } from '../../js/ReadAccount';



function CharBuyModal({ onClose, callbackMintNFT}) {

  const [selectedChar, setSelectedChar] = useState(0);
  const [price, setPrice] = useState(0);
  const [balance, setBalance] = useState("");

  const handleClickCharacter = (char_num, price) => {
    console.log("handleClickCharacter 호출", char_num, price);
    setSelectedChar(char_num);
    setPrice(price);  
  }

  // nft를 구매하는 과정은 두 가지로 나누어진다. 1. 돈 전송, 2. test4 계정의 nft 발급 및 소유권 이전
  // 1의 과정은 로그인한 계정이 test4에게 돈을 보내는 과정이다. 이후 과정 2가 시작된다.
  // handleCompletedTransfer를 통해 전송 트랜잭션이 완료되었음을 알게되고 이후 MintNFT를 통해 로그인한 계정에게 NFT가 전송이 된다.
  const handleBuyNFT = () => {
    console.log("handleBuyNFT 호출");
    if(selectedChar === 0 || price === 0){
      console.log(`구매할 캐릭터가 선택되지 않거나 가격이 정해지지 않음`);
      return;
    }

    callbackMintNFT(price, selectedChar);    
    setSelectedChar(0);
  }

  useEffect(() => {
    setMyBalacne();    
  }, [callbackMintNFT]);

  async function setMyBalacne() {
    const myBalace = await ReadAccount(localStorage.getItem("account_name"));
    console.log(`myBalace`, myBalace);    
    setBalance(myBalace);
  }

  
  return (

    <div className="create_character_modal">
      <div className=" create_character_modal_border2">
        {/* <CharCreateItem key={index} characterInfo={characterInfo}
            onClick={openModal}
            setUnregiCharInfo={setUnregiCharInfo}
        /> */}

        <div className='w-full h-full flex flex-col'>
          <div className='flex py-5 px-3 justify-center'>
            <div className='flex-1 text-center text-3xl'>
              크립토팜의 캐릭터를 구매하세요!
            </div>
            <img src={closeImage}
              onClick={onClose}
              className='w-[40px] h-[40px]'></img>
          </div>
          
          <div className='text-lg pr-4 self-end'>보유 코인 : {balance}</div>

          <div className='mt-5 flex-1'>
            <div className='flex justify-center gap-x-10'>
              <button onClick={() => { handleClickCharacter(62, 7) }}>
                <img src={c1} className={`w-[150px] ${selectedChar == 62 ? "border-red-500 border-4" : "border-0"}`}></img>
                <div className='mt-2 text-lg'>빡빡이</div>
                <div className='text-lg'>7 HEP</div>
              </button>
              <button onClick={() => { handleClickCharacter(63, 11) }}>
                <img src={c2} className={`w-[150px] ${selectedChar == 63 ? "border-red-500 border-4" : "border-0"}`}></img>
                <div className='mt-2 text-lg'>포니테일</div>
                <div className='text-lg'>11 HEP</div>
              </button>
              <button onClick={() => { handleClickCharacter(64, 13) }}>
                <img src={c3} className={`w-[150px] ${selectedChar == 64 ? "border-red-500 border-4" : "border-0"}`}></img>
                <div className='mt-2 text-lg'>드레드락</div>
                <div className='text-lg'>13 HEP</div>
              </button>
              <button onClick={() => { handleClickCharacter(65, 17) }}>
                <img src={c4} className={`w-[150px] ${selectedChar == 65 ? "border-red-500 border-4" : "border-0"}`}></img>
                <div className='mt-2 text-lg'>바가지 헤어</div>
                <div className='text-lg'>17 HEP</div>
              </button>
            </div>

          </div>

          <div className={`mx-auto pb-4 ${selectedChar !== 0 ? "text-black" :"text-gray-500"}`}>
            <button 
              className={`${selectedChar !== 0 ? "border-black" : "border-gray-500"} py-3 px-4 flex items-center text-2xl border-2 rounded-2xl`} 
              onClick={handleBuyNFT}>

              <BsCartCheck size={30} />
              <span className='ml-2'>구매하기</span>

            </button>
          </div>

          
        </div>

      </div>
    </div>

  );

}




export default CharBuyModal;