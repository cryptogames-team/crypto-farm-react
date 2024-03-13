import React, { useEffect, useState } from 'react';

// CSS import
import './char_inputform.css';

// 캐릭터 이름 입력 폼
// props 구조 분해 할당
function CharInputForm({ unregiCharInfo, onClose, onCreateChar, onCreateResult }) {

    let userName = '';

    const serverURL = process.env.REACT_APP_API + 'user/create';

    console.log("선택한 미등록 NFT 캐릭터 정보 : ", unregiCharInfo);

    // 캐릭터 생성 결과 상태
    // 아직 생성 안함, 성공, 실패 3가지 값이 들어간다.
    const [isCharSuccess, setIsCharSuccess] = useState(null);

    // 캐릭터 생성 결과를 알려주는 UI
    let createUI;

    // 초기화 전에 onChangeListener에 접근 불가능...
    // 캐릭터 생성에 성공 했을 때 입력 UI
    if (isCharSuccess === true) {

        createUI = (
            <div>
                <span className="user_name_text">캐릭터 생성에 성공 했습니다.</span>
                <button>확인</button>
            </div>
        );

        // 캐릭터 생성에 실패 했을 때 입력 UI
    } else {

        createUI = (
            <div>
                <span className="user_name_text">캐릭터 생성에 실패 했습니다.</span>
                <button></button>
            </div>
        );
    }




    // 캐릭터가 생성되었을 때 처리하는 함수들
    // handleCreateChar : 등록된 캐릭터 배열에 생성된 캐릭터를 추가한다.
    // rmCreateChar : 등록되지 않은 캐릭터 배열에 생성된 캐릭터를 제거한다.
    const { handleCreateChar, rmCreateChar } = onCreateChar;


    // 입력 값이 변할 때 리스너
    const onChangeListener = (e) => {
        //setUserName(e.target.value);

        userName = e.target.value;
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
                // name key 추가
                data.name = unregiCharInfo.name;
                handleCreateChar(data);
                rmCreateChar(data);
                console.log("캐릭터 생성 성공", data);

                onCreateResult(true);

            }
            // 캐릭터 생성 실패 시 처리
            else {
                console.log("캐릭터 생성 실패", data);

                onCreateResult(false);
            }


        } catch (error) {
            console.log(error);

            // 중복되는 캐릭터 이름 입력 시 에러뜸

        }

    }
    return (

        // 캐릭터 생성 성공, 실패 시 안내 UI 출력
        <div className="form_border1">
            <div className="form_border2">
                <div className="form_border3">
                    <div className="form_border4">
                    <span className="title_text">캐릭터 정보 입력</span>
                        <div className="input_container">
                            <span className="char_name_txt">캐릭터 이름 : </span>
                            <input type="text" className="input_user_name" onChange={onChangeListener}></input>
                        </div>
                        <div className="button_container">
                            <div className="back_btn_container2" onClick={createUser}>
                                캐릭터 생성
                            </div>
                            <div className="back_btn_container2" onClick={onClose}>
                                취소
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CharInputForm;
