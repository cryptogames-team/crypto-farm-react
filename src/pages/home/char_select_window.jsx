import React, { useEffect, useRef, useState } from 'react';
// 데이터를 헵타곤 메인 네트워크에서 불러오기 위해 import
import { JsonRpc } from 'eosjs';

// import custom function component
import CharSelectItem from './char_select_item';
import CharCreateModal from './char_create_modal';
import CharBuyModal from './char_buy_modal';

// import image
import addIcon from '../../assets/add_character.png'
import { BsCartCheck } from "react-icons/bs";
import { TbSelect } from "react-icons/tb";


let nodeURL = process.env.REACT_APP_NODE;

// Rpc : 메인넷에 있는 노드 하나의 주소
// EOS 블록체인 네트워크와의 통신을 담당한다.
const rpc = new JsonRpc(nodeURL);


// .env 파일에 있는 변수 사용

const serverURL = process.env.REACT_APP_API + 'user/all';



// async : 비동기 처리
// 함수형 컴포넌트는 async로 실행 불가능함.
function CharSelectWindow({ accountName, onCharSelect, callbackMintNFT}) {

  // 캐릭터 정보가 있는 NFT 배열 이름
  const [regChars, setRegChars] = useState([]);
  // 캐릭터 정보가 없는 NFT 배열 이름
  const [unregChars, setUnregChars] = useState([]);

  // 모달창 노출 여부 상태
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);

  // transaction 관련 html 요소들
  


  const handleCharSelect = onCharSelect;

  // 자식 컴포넌트에서 부모 컴포넌트의 상태 변경하기
  // 캐릭터 생성 성공 시 생성된 캐릭터를 regChars에 추가한다.
  const handleCreateChar = (character) => {

    console.log("생성된 캐릭터를 regChars에 추가");

    // 상태 관리되는 변수나 배열을 직접 변경하면 안된다.

    // 배열에 요소를 추가할 때는 새로운 배열을 생성하는 방식으로 상태를 변경한다.
    setRegChars(prevCharacters => [...prevCharacters, character]);

  };

  // 캐릭터 생성 성공 시 생성된 캐릭터를 unregChars에서 제거한다.
  const rmCreateChar = (characterToRemove) => {

    console.log("미등록 캐릭터 배열에서 제거될 캐릭터 정보", characterToRemove);


    // 캐릭터가 미등록 배열에서 제거 되지 않고 있음.
    // 이유 : 제거될 캐릭터 정보와 미등록 캐릭터 배열의 객체의 키 값이 달라서 생기는 문제이다.
    // asset_id로 비교하니 미등록 배열에서 삭제가 되었음.

    console.log("생성된 캐릭터가 제거되기 전의 미등록 캐릭터 배열" , unregChars);

    // filter : 주어진 조건에 맞는 요소만을 포함하는 새 배열을 반환한다.
    setUnregChars(unregChars.filter(character => character.asset_id !== characterToRemove.asset_id));
    
    console.log("생성된 캐릭터가 제거되고 난 후에 미등록 캐릭터 배열" , unregChars);
  }



  // 화살표 함수를 변수에 대입한다는 건
  // 해당 변수로 함수를 참조한다. 
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const openBuyModal = () => {
    setIsBuyModalOpen(true);
    // setTrxPage('buyCharacterNFT');
  } 
  const closeBuyModal = () => {
    setIsBuyModalOpen(false);
    // setTrxPage('');
  }



  // 계정에 있는 NFT 정보를 모조리 가져온다.
  async function loadNFT() {
    // 노드 기능중에 하나인 get_info() 호출
    // 노드의 정보를 가져온다.
    try {
      // get_table_rows는 모든 NFT를 가져온다.
      // 크립토 팜의 캐릭터 NFT를 가져와야 함.
      const response = await rpc.get_table_rows({
        // 여기 안에 조건을 추가하면 크립토 팜의 NFT 캐릭터만 가져오게 할 수 있음.
        json: true,
        code: 'eosio.nft',
        scope: accountName,
        table: 'assets',
        index_position: 2,
        key_type: "name",
        lower_bound: "cryptofarmss",
        upper_bound: "cryptofarmss",
        limit: 100
      });

      // 계정의 크립토 팜 관련 NFT
      console.log("크립토 팜 NFT 정보",response);

      // 받은 NFT 정보 개수만큼 배열에 넣기
      response.rows.forEach(function (nft) {

        // ipfs에서 계정의 NFT 이미지를 로드한다.
        // 이미지 해쉬값으로 string이 들어감          
        let imageURL = "https://ipfs.io/ipfs/" + nft.immutable_serialized_data[1].value[1];
        // nft 애셋 id
        let asset_id = nft.asset_id;
        // 캐릭터 구별하는 name 키값
        let name = nft.immutable_serialized_data[2].value[1];

        // nft 정보 담는 객체 생성
        let nft_info = {
          asset_id: asset_id,
          imageURL: imageURL,
          name : name
        }

        my_nfts.push(nft_info);

      });

      console.log("크립토 팜 NFT 정보에서 필요한 거만 빼옴", my_nfts);




    } catch (error) {
      console.error('Error:', error);
    }


    fetchNFTInfo();

  }

  // 게임 서버에 계정의 NFT들이 등록되어 있는지 요청한다.
  async function fetchNFTInfo() {

    // NFT asset id만 담는 배열
    let asset_ids = [];

    // 서버에 등록된 NFT 정보를 담는 배열
    let regNFTs = [];

    // 서버에 등록되지 않은 NFT 정보를 담는 배열
    let unregNFTs = [];

    // nft 정보 배열에서 asset id만 빼서 다른 배열로 만들기
    my_nfts.forEach((nft) => {

      asset_ids.push(nft.asset_id);

    });

    console.log("계정의 NFT asset id 배열", asset_ids);


    try {
      const response = await fetch(serverURL, {
        // 요청 방식
        // API 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // asset id
        // 서버에 없는 asset id 보내면 아무것도 안온다.
        // Content-Type과 body를 안 맞추면 Bad Request 
        body: JSON.stringify(asset_ids)

      });

      // 여기서 서버 응답을 받는다.
      // .json() : 받은 응답을 JSON 형식으로 변환한다.
      const data = await response.json();

      // data는 캐릭터 정보가 담긴 객체들의 배열이다.
      console.log("서버로부터 받은 등록된 NFT 캐릭터들의 정보", data);


      // 내 NFT 배열을 전부 탐색하면서 서버로부터 받은 asset_id와 일치하는 요소 찾기
      my_nfts.forEach((nft) => {

        // 서버에 등록된 asset_id를 찾았는지 여부
        let found = false;

        // 서버에 등록된 NFT 캐릭터 정보 배열에서 
        // asset_id를 비교해서 registeredNFTs에 추가한다.
        data.forEach((characterInfo) => {

          // 서버에 등록된 asset_id 일 경우
          if (nft.asset_id === characterInfo.asset_id) {
            //console.log("서버에 등록된 assetId 발견 : " + characterInfo.asset_id);

            // 서버에 등록된 캐릭터 정보를 담는 객체
            let registeredCharInfo = characterInfo;

            // 캐릭터 정보 객체에 imageURL 추가
            registeredCharInfo.imageURL = nft.imageURL;
            // name key 추가
            registeredCharInfo.name = nft.name;

            // 문자열과 함께 객체를 출력하려면 객체를 문자열로 변환해야 한다.
            //console.log("등록된 NFT 캐릭터의 정보 : ",registeredCharInfo);

            regNFTs.push(registeredCharInfo);

            // forEach()는 루프를 중간에 탈출하는 기능을 직접 제공하지 않음.
            // continue도 사용 불가능함
            found = true;

          }

        });


        // 이 asset_id는 서버에 등록되지 않았음          
        if (!found) {

          //console.log("서버에 등록되지 않은 assetId 발견 : " + nft.asset_id);

          // 서버에 등록되지 않은 캐릭터 정보를 담는 객체
          let unregisteredCharInfo = nft;

          //console.log(unregisteredCharInfo);

          unregNFTs.push(unregisteredCharInfo);
        }

      });


      // 배열의 길이 length
      if (regNFTs.length > 0)
        console.log("등록된 NFT 캐릭터들의 정보 : ", regNFTs);
      else
        console.log("등록된 NFT 캐릭터가 없음");

      if (unregNFTs.length > 0)
        console.log("등록되지 않은 NFT 캐릭터들의 정보 : ", unregNFTs);
      else
        console.log("등록되지 않은 NFT 캐릭터가 없음.");


      // 서버에 등록된 NFT 배열의 상태 설정
      setRegChars(regNFTs);
      // 서버에 등록되지 않은 NFT 배열의 상태 설정
      setUnregChars(unregNFTs);

    }
    catch (error) {
      console.error('Error : ', error);

      /*       for (let i = 0; i < 1; i++) {
              unregNFTs.push("");
            }
            // 서버에 등록되지 않은 NFT 배열의 상태 설정
            setUnregChars(unregNFTs); */


    }

  }



  // 내 계정 nft 정보 배열
  // asset id, 이미지 URL 값 들어감
  let my_nfts = [];

  // useEffect로 비동기 함수 실행
  useEffect(() => {

    // 계정에 있는 모든 NFT 정보를 로드한다.
    loadNFT();

    return () => {

      console.log('캐릭터 선택 창 컴포넌트 언마운트');
    }

  }, []);
  // 의존성 배열을 생략하면 컴포넌트가 렌더링될 때 마다 실행된다.




  // useState()로 관리되는 변수를 전달 받지 않으면 undefined가 뜬다.
  // 계속 렌더링되는 모양
  console.log("부모한테 받은 계정 이름 : " + accountName);


  return (


    // 반복문으론 주로 map()이 사용된다.
    // map() : 배열의 각 요소에 실행되는 함수를 적용하고, 
    // 그 결과로 새 배열을 반환한다.
    // 이 새 배열은 React 요소의 배열로 변환되어 JSX 내에서 렌더링될 수 있다.
    // for 루프나 foreach는 return()문 내에서 직접 사용하기 어렵다.
    // 이유 : 새 배열을 반환하지 않기 때문이다.

    //unRegisteredCharacters={unregChars}
    <div className = "character_select_container">
    <p id='select_text'>NFT 캐릭터 선택</p>
    <div className="character_select_border1">
      <div className="character_select_border2">

        {isModalOpen && <CharCreateModal
          unregChars={unregChars}
          onClose={closeModal}
          onCreateChar={{handleCreateChar, rmCreateChar}} />}

        {isBuyModalOpen && <CharBuyModal
          onClose={closeBuyModal}
          callbackMintNFT={callbackMintNFT}
          />}


        <div className="character_select_border3">
          <div className="character_select_border4 ">

          <div className='character_select_border5'>
          {regChars.map((character, index) => (
              <CharSelectItem key={index} 
              registeredCharacter={character}
              onCharSelect={handleCharSelect}
              />
            ))}
          </div>
            
          <div className='add_character_btn_group gap-2 px-4 pb-3 self-end'>
              <button className='border-black rounded-xl border-4 p-3 text-xl flex items-center' onClick={openModal}><TbSelect size={30}/><span className='pl-2'>캐릭터 생성</span></button>
              <button className='ml-3 border-black rounded-xl border-4 p-3 text-xl flex items-center' onClick={openBuyModal}><BsCartCheck size={30} /><span className='pl-2'>상점</span></button>
            </div>
            
            
          </div>
          
        </div>
      </div>
    </div>
  
    </div>

  );

}

export default CharSelectWindow;