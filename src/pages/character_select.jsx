import React, { useEffect, useState } from 'react';
// 데이터를 헵타곤 메인 네트워크에서 불러오기 위해 import
import { JsonRpc } from 'eosjs';


// import custom function component
import NFTCharacter from './nft_select_character';
import CreateCharacterModal from './create_character_modal';

// import image
import AddIcon from '../assets/add_character1.png'




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

  // 모달창 노출 여부 상태
  const [isModalOpen, setIsModalOpen] = useState(false);


  // 화살표 함수를 변수에 대입한다는 건
  // 해당 변수를 함수를 참조한다. 
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);


  // https://sunflower-land.com/long_logo.png 
  // https://sunflower-land.com/assets/dawn_breaker_items.2f415d5a.png


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

        console.log(response);


        // 내 계정 nft 정보 배열
        // asset id, 이미지 URL 값 들어감
        let my_nfts = [];

        // 받은 NFT 정보 개수만큼 배열에 넣기
        response.rows.forEach(function (nft) {

          // ipfs에서 계정의 NFT 이미지를 로드한다.
          // 이미지 해쉬값으로 string이 들어감          
          let imageURL = "https://ipfs.io/ipfs/" + nft.immutable_serialized_data[0].value[1];

          let asset_id = nft.asset_id;

          let nft_info = {
            asset_id: asset_id,
            imageURL: imageURL
          }

          my_nfts.push(nft_info);

        });

        console.log(my_nfts);


        // NFT 이미지 URL 배열에 아이템 4개 추가
        for (let i = 0; i < 8; i++) {
          //my_nfts.push("");
        }


        // NFT 이미지 URL 로드가 완료되면 URL 변경하기
        // 변경된 URL에서 이미지를 가져와서 띄우는 것 확인
        setNFTImageURLs(my_nfts);

        // useState()를 사용해야 하는가
        // my_nfts 배열에 assetID, 이미지 해쉬 값 저장한다.
        // 객체 저장




      } catch (error) {
        console.error('Error:', error);
      }


    }

    // fetch 사용해보기
    async function fetchData() {
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
          body: JSON.stringify([12234])

        });
        const data = await response.json();
        console.log(data);
      }
      catch (error) {
        console.error('Error : ', error);
      }

    }


    // 계정에 있는 모든 NFT 정보를 로드한다.
    loadNFT();

    // 서버에 API 요청
    fetchData();

  }, []);


  // 지금 블록체인 네트워크에 접속할 수 없어서
  // nft 이미지 배열에 임의의 하드 코딩된 값을 여러개 넣어
  // 여러개의 NFT 캐릭터 컴포넌트가 생성되는지 테스트하는 함수
  function makeNFTURLArray() {

    let nftImageURLs = [];
    for (let i = 0; i < 3; i++) {
      nftImageURLs.push("안농");
    }

    setNFTImageURLs(nftImageURLs);
  }



  // useState()로 관리되는 변수를 전달 받지 않으면 undefined가 뜬다.
  console.log("부모한테 받은 계정 이름 : " + props.accountName);

  // 여기 안에 반복문 사용 가능하다.
  return (

    // <NFTCharacter nftImageURLs={nftImageURLs} />

    // 일단 이 안에서 반복문 사용이 가능한지 시도
    // 주로 map()가 사용된다.
    // map()이 배열의 각 요소에 실행되는 함수를 적용하고, 
    // 그 결과로 새 배열을 반환한다.
    // 이 새 배열은 React 요소의 배열로 변환되어 JSX 내에서 렌더링될 수 있다.
    // for 루프나 foreach는 return()문 내에서 직접 사용하기 어렵다.
    // 이유 : 새 배열을 반환하지 않기 때문이다.

    <div className="character_select_border1">
      <div className="character_select_border2">
        {isModalOpen && <CreateCharacterModal nftImageURLs={nftImageURLs} onClose={closeModal} />}
        <div className="character_select_border3">
          <div className="character_select_border4">

            {nftImageURLs.map((url, index) => (
              <NFTCharacter key={index} nftImageURLs={url} />
            ))}
            <button onClick={openModal}
              className="add_character_button">캐릭터 생성</button>

          </div>
        </div>
      </div>
    </div>

  );

}

//<img src={AddIcon} className='add_img' />

export default CharacterSelect;