

// import custom function component
import NFTCreateCharacter from './nft_create_character';

// onClose 함수를 props로 받음
// 부모 컴포넌트한테 전달받는 데이터를 props로 묶거나 
// 명시적으로 따로따로 전달받을 수 있다.
function CreateCharacterModal({ unregisteredCharacters, onClose }) {

  //console.log(nftImageURLs);


  return (

    <div className="create_character_modal">
      <div className="create_character_modal_border">

        {unregisteredCharacters.map((characterInfo, index) => (
          <NFTCreateCharacter key={index} characterInfo={characterInfo}/>
        ))}

        <button onClick={onClose}
          className="add_character_button">닫기</button>
      </div>
    </div>


  );


}


export default CreateCharacterModal;