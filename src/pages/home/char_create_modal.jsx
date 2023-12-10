import React, { useEffect, useState } from 'react';
// import custom function component
import CharCreateItem from './char_create_item';
import CharInputForm from './char_inputform';

// import image
import closeImage from '../../assets/close.png'



// onClose 함수를 props로 받음
// 부모 컴포넌트한테 전달받는 데이터를 props로 묶거나 
// 명시적으로 따로따로 전달받을 수 있다.
function CharCreateModal({ unregChars, onClose, onCreateChar }) {

  const [isModalOpen, setIsModalOpen] = useState(false);

  // 선택한 캐릭터 생성 아이템의 애셋 id로 추정됨.
  // 애셋 id와 ImageURL을 객체로 묶어 상태 관리한다.
  
  // unregiCharInfo : 캐릭터 생성 창에서 선택한
  // 서버에 등록되지 않은(캐릭터 생성할) NFT의 정보 객체
  const [unregiCharInfo, setUnregiCharInfo] = useState({});

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (

    <div className="create_character_modal">
      <div className="create_character_modal_border">
        {unregChars.map((characterInfo, index) => (
          <CharCreateItem key={index} characterInfo={characterInfo}
            onOpen={openModal}
            setUnregiCharInfo={setUnregiCharInfo}
          />
        ))}

        

        {isModalOpen && <CharInputForm
          unregiCharInfo={unregiCharInfo}
          onClose={closeModal}
          onCreateChar={onCreateChar} />}

        <img src={closeImage} 
        onClick={onClose}
        className='close_window_button'></img>

      </div>
    </div>

  );

}


export default CharCreateModal;