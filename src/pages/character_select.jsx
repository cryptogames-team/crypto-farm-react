import React, { useEffect, useState } from 'react';
// 데이터를 헵타곤 메인 네트워크에서 불러오기 위해 import
import { JsonRpc } from 'eosjs';


// import custom function component
import NFTCharacter from './nft_select_character';
import CreateCharacterModal from './create_character_modal';

// import image
import addIcon from '../assets/add_character1.png'




// Rpc : 메인넷에 있는 노드 하나의 주소
// EOS 블록체인 네트워크와의 통신을 담당한다.
const rpc = new JsonRpc('http://14.63.34.160:8888');

const serverURL = 'http://221.148.25.234:1234/user/all';

// async : 비동기 처리
// 함수형 컴포넌트는 async로 실행 불가능함.
// useEffect 사용하기
function CharacterSelect(props) {



  // nftImageURLs : nft 이미지 URL을 담는 배열
  const [nftImageURLs, setNFTImageURLs] = useState([]);

  // 캐릭터 정보가 있는 NFT 배열 이름
  const [registeredCharacters, setRegisteredCharacters] = useState([]);
  // 캐릭터 정보가 없는 NFT 배열 이름
  const [unregisteredCharacters, setUnregisteredCharacters] = useState([]);

  // 모달창 노출 여부 상태
  const [isModalOpen, setIsModalOpen] = useState(false);


  // 화살표 함수를 변수에 대입한다는 건
  // 해당 변수를 함수를 참조한다. 
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);


  // 내 계정 nft 정보 배열
  // asset id, 이미지 URL 값 들어감
  let my_nfts = [];

  // useEffect로 비동기 함수 실행
  useEffect(() => {

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
          scope: props.accountName,
          table: 'assets',
          limit: 100
        });

        // 계정의 모든 NFT
        console.log(response);

        // 받은 NFT 정보 개수만큼 배열에 넣기
        response.rows.forEach(function (nft) {

          // ipfs에서 계정의 NFT 이미지를 로드한다.
          // 이미지 해쉬값으로 string이 들어감          
          let imageURL = "https://ipfs.io/ipfs/" + nft.immutable_serialized_data[0].value[1];
          // nft 애셋 id
          let asset_id = nft.asset_id;

          // nft 정보 담는 객체 생성
          let nft_info = {
            asset_id: asset_id,
            imageURL: imageURL
          }

          my_nfts.push(nft_info);

        });

        console.log(my_nfts);

        // NFT 이미지 URL 로드가 완료되면 URL 변경하기
        // 변경된 URL에서 이미지를 가져와서 띄우는 것 확인
        //setNFTImageURLs(my_nfts);


      } catch (error) {
        console.error('Error:', error);
      }


      fetchData();


    }

    // 서버 API한테 유저의 NFT가 등록되어있는지 요청한다.
    async function fetchData() {


      let asset_ids = [];

      // nft 정보 배열에서 asset id만 빼서 다른 배열로 만들기
      my_nfts.forEach((nft) => {

        asset_ids.push(nft.asset_id);

      });

      console.log(asset_ids);

      try {
        const response = await fetch(serverURL, {
          // 요청 방식
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          // asset id
          // 서버에 없는 asset id 보내면 아무것도 안온다.
          // Content-Type과 body를 안 맞추면 Bad Request 
          body: JSON.stringify(asset_ids)

        });

        // 여기서 서버 응답을 받는다.
        // .json() : 받은 응답을 JSON 형식으로 변환한다.
        const data = await response.json();

        // 지금 서버에 등록된 NFT는 단 하나이다.        

        // data는 캐릭터 정보가 담긴 객체들의 배열이다.
        console.log(data);


        // 서버에 등록된 NFT 정보를 담는 배열
        // data 배열의 요소에 있는 asset_id 값과 일치하는 my_nft 요소만 넣기
        // my_nft에 이미지 URL이 있음.
        let registeredNFTs = [];

        // 서버에 등록되지 않은 NFT 정보를 담는 배열
        let unregisteredNFTs = [];

        // 나중에 List 같은 자료구조가 있는지 확인하기

        // 내 NFT 배열을 전부 탐색하면서 서버로부터 받은 asset_id와 일치하는 요소 찾기
        my_nfts.forEach((nft) => {

          // 서버에 등록된 asset_id를 찾았는지 여부
          let found = false;

          data.forEach((characterInfo) => {

            // 서버에 등록된 asset_id 일 경우
            if (nft.asset_id === characterInfo.asset_id) {
              console.log("서버에 등록된 assetId 발견 : " + characterInfo.asset_id);

              // 서버에 등록된 캐릭터 정보를 담는 객체
              let registeredCharInfo = characterInfo;

              // 캐릭터 정보 객체에 imageURL 추가
              registeredCharInfo.imageURL = nft.imageURL;

              //console.log(registeredCharInfo);

              registeredNFTs.push(registeredCharInfo);

              // forEach()는 루프를 중간에 탈출하는 기능을 직접 제공하지 않음.
              // continue도 사용 불가능함
              found = true;

            }

          });


          // 이 asset_id는 서버에 등록되지 않았음          
          if (!found) {

            console.log("서버에 등록되지 않은 assetId 발견 : " + nft.asset_id);

            // 서버에 등록되지 않은 캐릭터 정보를 담는 객체
            let unregisteredCharInfo = nft;

            //console.log(unregisteredCharInfo);

            unregisteredNFTs.push(unregisteredCharInfo);
          }

        });

        //console.log(unregisteredNFTs);



        for (let i = 0; i < 4; i++) {
          //registeredNFTs.push("");
        }

        for (let i = 0; i < 11; i++) {
          //unregisteredNFTs.push("");
        }



        // 서버에 등록된 NFT 배열의 상태 설정
        setRegisteredCharacters(registeredNFTs);
        // 서버에 등록되지 않은 NFT 배열의 상태 설정
        setUnregisteredCharacters(unregisteredNFTs);

      }
      catch (error) {
        console.error('Error : ', error);
      }

    }


    // 계정에 있는 모든 NFT 정보를 로드한다.
    loadNFT();


  }, []);




  // useState()로 관리되는 변수를 전달 받지 않으면 undefined가 뜬다.
  console.log("부모한테 받은 계정 이름 : " + props.accountName);


  return (


    // 반복문으론 주로 map()이 사용된다.
    // map() : 배열의 각 요소에 실행되는 함수를 적용하고, 
    // 그 결과로 새 배열을 반환한다.
    // 이 새 배열은 React 요소의 배열로 변환되어 JSX 내에서 렌더링될 수 있다.
    // for 루프나 foreach는 return()문 내에서 직접 사용하기 어렵다.
    // 이유 : 새 배열을 반환하지 않기 때문이다.

    //unRegisteredCharacters={unregisteredCharacters}

    <div className="character_select_border1">
      <div className="character_select_border2">

        {isModalOpen && <CreateCharacterModal
          unregisteredCharacters={unregisteredCharacters}
          onClose={closeModal} />}

        <div className="character_select_border3">
          <div className="character_select_border4">

            {registeredCharacters.map((character, index) => (
              <NFTCharacter key={index} registeredCharacter={character}
               />
            ))}

            <img src={addIcon}
              onClick={openModal}
              className='add_character_button'></img>

          </div>
        </div>
      </div>
    </div>

  );

}

//<img src={AddIcon} className='add_img' />

export default CharacterSelect;