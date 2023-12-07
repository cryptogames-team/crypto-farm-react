import React, { useEffect, useState } from 'react';

// CSS import
import './create_character_inputform.css';

// 캐릭터 이름 입력 폼

function NFTCharacterForm(props) {
    const [userName,setUserName] = useState('');
    const serverURL = 'http://221.148.25.234:1234/user/create';
    console.log(props.asset_id);
    const onChangeListner = (e) => {
        setUserName(e.target.value);
    }
    const createUser = async() => {
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
                body: JSON.stringify({asset_id:props.asset_id,user_name:userName})
      
              });
              const data = await response.json(); 
              console.log(data)
        }catch(error){
            console.log(error)
        }
        
    }
    return (

        <div className="form_border1">
        <div className="form_border2">
            <div className="form_border3">
                <div className="form_border4">
                    <div className="input_container">
                        <span className="user_name_text">Enter User Name:</span>
                        <input type="text" className="input_user_name" onChange={onChangeListner}></input>
                    </div>
                    <div className="button_container">
                        <div className="back_btn_container1">
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


export default NFTCharacterForm;

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