import React, { useEffect, useState } from 'react';


// 캐릭터 이미지만 필요하다.
function CharCreateItem({characterInfo, onClick, setUnregiCharInfo }) {


    // NFT 캐릭터 생성 컴포넌트의 클릭 이벤트에 등록할 콜백 함수
    // 캐릭터 생성 아이템을 클릭할 경우 
    // 1. 부모 컴포넌트한테 선택된 캐릭터의 정보를 넘겨준다.
    // 2. 캐릭터 이름 입력 모달창을 열라고 부모한테 알린다.
    // 캐릭터 정보 : asset_id, ImageURL
    const handleClick = () => {
        //console.log("생성할 캐릭터의 정보", props.characterInfo);
        setUnregiCharInfo(characterInfo);
        onClick();
    };

    // NFT 캐릭터 생성 컴포넌트를 클릭하면 캐릭터 이름 입력 창 뜨게 만들기
    // 조건부 렌더링

    return (


        <div className="nft_character_container" onClick={handleClick}>
            <div className="nft_character_border">
                <img src={characterInfo.imageURL}
                    className='nft_create_image'></img>
            </div>
        </div>

    );
}


export default CharCreateItem;