import React, { useEffect, useState } from 'react';


const serverURL = 'http://221.148.25.234:1234/user/';

// 서버에 등록된 NFT 캐릭터 정보 객체를 부모 컴포넌트로부터 전달받는다
// 구조 분해 할당 사용
function NFTCharacter({registeredCharacter}) {


    //console.log(registeredCharacter);

    // Too many re-renders
    // 주로 잘못된 setState의 사용으로 발생한다.
    // 항상 조건문이나 이벤트 핸들러 안에서만 setState를 사용해야 한다.

    // NFT 캐릭터 선택 컴포넌트 클릭 이벤트에 등록할 콜백 함수
    // 서버에 등록된 NFT 캐릭터 정보를 로그에 띄운다.
    const handleClick = async () => {
        console.log(registeredCharacter);

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
      
                // JSON 형식으로 보내기

              });
      
              // 여기서 서버 응답을 받는다.
              // .json() : 받은 응답을 JSON 형식으로 변환한다.
              const data = await response.json();

              // accesstoken
              console.log(data);

        } catch (error) {
            
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


export default NFTCharacter;