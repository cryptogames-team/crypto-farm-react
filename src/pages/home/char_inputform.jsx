import React, { useEffect, useState } from 'react';

// CSS import
import './char_inputform.css';

// 캐릭터 이름 입력 폼
// props 구조 분해 할당
function CharInputForm({ unregiCharInfo, onClose, onCreateChar }) {
    const [userName, setUserName] = useState('');
    const serverURL = 'http://221.148.25.234:1234/user/create';
    console.log("선택한 미등록 NFT 캐릭터 정보 : ", unregiCharInfo);


    const onChangeListner = (e) => {
        setUserName(e.target.value);
    }
    const createUser = async () => {
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
                body: JSON.stringify({ asset_id: unregiCharInfo.asset_id, user_name: userName })

            });
            const data = await response.json();
            // 캐릭터 생성 성공 시 액세스 토큰이 아니라
            // 생성된 NFT 캐릭터의 정보 객체를 받는다
            // Image URL을 전달 받고 있지 않음
            // 이유 : 블록 체인 노드에서 응답 받으니까


            // 캐릭터 생성 성공 시 처리
            if (data.error === undefined) {
                // NFT 정보 객체에 ImageURL 키 추가하기
                data.imageURL = unregiCharInfo.imageURL;
                onCreateChar(data);
                console.log("캐릭터 생성 성공", data);
            }
            // 캐릭터 생성 실패 시 처리
            else {
                console.log("캐릭터 생성 실패", data);

            }


        } catch (error) {
            console.log(error);

            // 중복되는 캐릭터 이름 입력 시 에러뜸

        }

    }
    return (

        <div className="form_border1">
            <div className="form_border2">
                <div className="form_border3">
                    <div className="form_border4">
                        <div className="input_container">
                            <span className="user_name_text">Character Name : </span>
                            <input type="text" className="input_user_name" onChange={onChangeListner}></input>
                        </div>
                        <div className="button_container">
                            <div className="back_btn_container1" onClick={onClose}>
                                <div className="back_btn_container2">
                                    Back
                                </div>
                            </div>
                            <div className="create_btn_container1" onClick={createUser}>
                                <div className="create_btn_container2">
                                    Create
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>


    );

}


export default CharInputForm;

// 기존에 만들던 입력 폼
/*
        <div className="nft_character_form">
            <div className="nft_character_form_border1">
                <form style={{
                    width: "100%",
                    height: "100%"
                }}>
                    <div className='div_flex_row_center'>
                        <p>캐릭터 이름 : </p>

                        <input className='input_character'
                            type="text"
                            name="characterName"
                            maxLength="15"></input>
                    </div>
                    <div className='div_flex_row_space-between'>
                        <button className='character_input_button'>생성</button>
                        <button className='character_input_button'>취소</button>
                    </div>
                </form>
            </div>
        </div>
 */