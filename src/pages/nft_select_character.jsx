import React, { useEffect, useState } from 'react';


// 서버에 등록된 NFT 캐릭터 정보 객체를 부모 컴포넌트로부터 전달받는다
// 구조 분해 할당 사용
function NFTCharacter({registeredCharacter}) {


    //console.log(registeredCharacter);

    // Too many re-renders
    // 주로 잘못된 setState의 사용으로 발생한다.
    // 항상 조건문이나 이벤트 핸들러 안에서만 setState를 사용해야 한다.


    return (
        

        <div className="nft_character_container">
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