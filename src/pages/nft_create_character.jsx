import React, { useEffect, useState } from 'react';


// nft 캐릭터 생성 모달창에서 사용할 nft 캐릭터 생성 컴포넌트
import style from './nft_select_character'

import image from '../logo.svg';



// 캐릭터 이미지만 필요하다.
function NFTCreateCharacter(props) {


    // Too many re-renders
    // 주로 잘못된 setState의 사용으로 발생한다.
    // 항상 조건문이나 이벤트 핸들러 안에서만 setState를 사용해야 한다.
    //setImageURL(props.nftImageURL);

    // 부모한테 전달받은 nftImageURL 확인 
    //console.log("부모한테 전달받은 nftImageURL : %s", props.nftImageURL );

        // NFT 캐릭터 생성 컴포넌트의 클릭 이벤트에 등록할 콜백 함수
        // 서버에 등록되지 않은 NFT 캐릭터 정보를 로그에 띄운다.
        // asset_id

    const handleClick = () => {
        console.log(props.characterInfo);

        props.setAsset_Id(props.characterInfo.asset_id);

        props.onOpen();


    };

    // NFT 캐릭터 생성 컴포넌트를 클릭하면 캐릭터 이름 입력 창 뜨게 만들기
    // 조건부 렌더링

    return (
        

        <div className="nft_character_container" onClick={handleClick}>
            <div className="nft_character_border">
                <img src={props.characterInfo.imageURL}
                className='nft_create_image'></img>
            </div>
        </div>

    );
}


export default NFTCreateCharacter;