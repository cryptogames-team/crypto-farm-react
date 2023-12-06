import React, { useEffect, useState } from 'react';


// 캐릭터 이미지, 레벨, 이름
// 일단 하드코딩된 데이터 넣기
function NFTCharacter(props) {

    const [ImageURL, setImageURL] = useState("");

    // Too many re-renders
    // 주로 잘못된 setState의 사용으로 발생한다.
    // 항상 조건문이나 이벤트 핸들러 안에서만 setState를 사용해야 한다.
    //setImageURL(props.nftImageURL);

    // 부모한테 전달받은 nftImageURL 확인 
    //console.log("부모한테 전달받은 nftImageURL : %s", props.nftImageURL );


    // 캐릭터 레벨, 캐릭터 이름

    return (
        

        <div className="nft_character_container">
            <div className="nft_character_border">
                <img src={props.nftImageURLs}
                className='nft_image'></img>
                <p className='nft_p'>Lv. 1</p>
                <p className='nft_p'>임강현</p>
            </div>
        </div>

    );
}


export default NFTCharacter;