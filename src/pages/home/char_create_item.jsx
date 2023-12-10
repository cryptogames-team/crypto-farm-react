import React, { useEffect, useState } from 'react';


// 캐릭터 이미지만 필요하다.
function CharCreateItem(props) {


    // NFT 캐릭터 생성 컴포넌트의 클릭 이벤트에 등록할 콜백 함수
    // 서버에 등록되지 않은 NFT 캐릭터 정보를 로그에 띄운다.
    // asset_id, ImageURL

    const handleClick = () => {
        //console.log("생성할 캐릭터의 정보", props.characterInfo);

        props.setUnregiCharInfo(props.characterInfo);
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


export default CharCreateItem;