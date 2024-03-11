import React, { useEffect, useState } from 'react';

// CSS import
//import './char_result_modal.css'

// 캐릭터 생성 결과 모달창
// 성공, 실패에 따라 처리가 달라야함.

function CharResultModal({ onClose, charResult }) {


    // 캐릭터 생성 결과 안내 텍스트
    let resultText;

    if (charResult) {
        resultText = "캐릭터 생성 성공!";
    } else {
        // 줄 바꿈이 안되고 있음
        resultText = "캐릭터 생성 실패! \n 이름이 중복 됩니다.";
    }


    console.log("캐릭터 생성 결과 : " + charResult);

    // 전달 받은 props 값에 따라 결과 메시지 변경하기


    // 이거 form_border 어디서 가져오는거지?
    // char_inputform.css
    return (
        <div className="form_border1">
            <div className="form_border2">
                <div className="form_border3">
                    <div className="form_border4">
                        <span className="result_text"
                            style={{ whiteSpace: 'pre-line' }}>{resultText}</span>
                        <div className="back_btn_container2" onClick={onClose}>
                            확인
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );

}

export default CharResultModal;