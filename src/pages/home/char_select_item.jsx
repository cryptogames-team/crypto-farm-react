import React, { useEffect, useState } from 'react';

const serverURL = process.env.REACT_APP_API + 'user/';

// NFT 캐릭터 선택 창에 들어가는 캐릭터 아이템

// 서버에 등록된 NFT 캐릭터 정보 객체를 부모 컴포넌트로부터 전달받는다
// 구조 분해 할당 사용
function CharSelectItem({registeredCharacter, onCharSelect}) {


    //console.log(registeredCharacter);

    // NFT 캐릭터 선택 컴포넌트 클릭 이벤트에 등록할 콜백 함수
    // 서버에 등록된 NFT 캐릭터 정보를 로그에 띄운다.
    const handleClick = async () => {

        let selectCharInfo = registeredCharacter;

        console.log("선택한 캐릭터 정보", selectCharInfo);

        // JWT 토큰 발급받는듯? 
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
                body: JSON.stringify({ asset_id : registeredCharacter.asset_id,
                user_name : registeredCharacter.user_name})
              });
      
              // 여기서 서버 응답을 받는다.
              // .json() : 받은 응답을 JSON 형식으로 변환한다.
              const data = await response.json();

              // accessToken 받아오기
              console.log(data);
              // 로컬 스토리지에 저장
              localStorage.setItem('accessToken', data.accessToken);
              // 로컬 스토리지에 저장한 액세스 토큰값 확인
              console.log('로컬 스토리지에 저장한 액세스 토큰 값 ', localStorage.getItem('accessToken'));

              onCharSelect(selectCharInfo);

        } catch (error) {

            console.log("handleClick Error");
            
        }

    };


    return (
        
        <div className="nft_character_container" onClick={handleClick}>
            <div className="nft_character_border">
                <img src={registeredCharacter.imageURL}
                className='nft_image'></img>
                <p className='nft_p'>Lv. {registeredCharacter.level}</p>
                <p className='nft_p'>{registeredCharacter.user_name}</p>
            </div>
        </div>

    );
}


export default CharSelectItem;