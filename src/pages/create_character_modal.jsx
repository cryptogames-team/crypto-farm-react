import React, { useEffect, useState } from 'react';
// import custom function component
import NFTCreateCharacter from './nft_create_character';
import NFTCharacterForm from './create_character_inputform';

// import image
import closeImage from '../assets/close.png'



// onClose 함수를 props로 받음
// 부모 컴포넌트한테 전달받는 데이터를 props로 묶거나 
// 명시적으로 따로따로 전달받을 수 있다.
function CreateCharacterModal({ unregisteredCharacters, onClose }) {

  //console.log(nftImageURLs);


  const [isModalOpen, setIsModalOpen] = useState(false);

  const [asset_id, setAsset_Id] = useState('');

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);



  return (

    <div className="create_character_modal">
      <div className="create_character_modal_border">
        {unregisteredCharacters.map((characterInfo, index) => (
          <NFTCreateCharacter key={index} characterInfo={characterInfo}
            onOpen={openModal}
            setAsset_Id={setAsset_Id}
          />
        ))}

        {isModalOpen && <NFTCharacterForm
          asset_id={asset_id}
          onClose={closeModal} />}

        <img src={closeImage} 
        onClick={onClose}
        className='close_window_button'></img>

      </div>
    </div>

  );

}


export default CreateCharacterModal;