import React, { useEffect, useState } from 'react';
// import custom function component
import CharCreateItem from './char_create_item';
import CharInputForm from './char_inputform';
import CharResultModal from './char_result_modal';

// import image
import closeImage from '../../assets/close.png'

// 캐릭터 생성 결과
let charResult = null;

// onClose 함수를 props로 받음
// 부모 컴포넌트한테 전달받는 데이터를 props로 묶거나 
// 명시적으로 따로따로 전달받을 수 있다.
function CharCreateModal({ unregChars, onClose, onCreateChar }) {

  // 캐릭터가 생성되었을 때 처리하는 함수들
  // 이 컴포넌트에서 사용할 함수들은 아니고
  // 자식 컴포넌트인 char_inputform에 전달함.
  const { handleCreateChar, rmCreateChar } = onCreateChar;

  // 캐릭터 이름 입력 모달창 여는 상태
  const [modalOpen, setModalOpen] = useState(false);

  // 캐릭터 생성 결과 모달창을 여는 상태
  const [charResultOpen, setCharResultOpen] = useState(false);


  // 선택한 캐릭터 생성 아이템의 애셋 id로 추정됨.
  // 애셋 id와 ImageURL을 객체로 묶어 상태 관리한다.

  // unregiCharInfo : 캐릭터 생성 창에서 선택한
  // 서버에 등록되지 않은(캐릭터 생성할) NFT의 정보 객체
  const [unregiCharInfo, setUnregiCharInfo] = useState({});


  // 캐릭터 생성 결과
  //let charResult = null;



  // 캐릭터 생성 결과에 따라 입력 모달과 결과 모달창을 제어해야 한다.
  // 일단 캐릭터 생성이 성공했다는 결과를 가정하고 함수 만들기

  // 캐릭터 생성 성공 시 결과창 모달이 뜨게 만드는데 성공
  // 실패 시에서 모달이 뜨게 만든다.
  const openResultModal = (result) => {
    charResult = result;

    setModalOpen(false);
    setCharResultOpen(true);


  }

  // 결과 모달창 닫기
  const closeResultModal = () => setCharResultOpen(false);


  // 캐릭터 이름 입력 모달창 제어
  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  return (

    <div className="create_character_modal">
        {modalOpen && <CharInputForm
          unregiCharInfo={unregiCharInfo}
          onClose={closeModal}
          onCreateChar={onCreateChar}
          onCreateResult={openResultModal} />}


        {charResultOpen && <CharResultModal
          charResult={charResult}
          onClose={closeResultModal}
        />}


      <div className="create_character_modal_border">
        {unregChars.map((characterInfo, index) => (
          <CharCreateItem key={index} characterInfo={characterInfo}
            onClick={openModal}
            setUnregiCharInfo={setUnregiCharInfo}
          />
        ))}

        <img src={closeImage}
          onClick={onClose}
          className='close_window_button'></img>

      </div>
    </div>

  );

}


export default CharCreateModal;