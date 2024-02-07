import Phaser from "phaser";


export default class NetworkManager {

    scene;

    apiURL = process.env.REACT_APP_API;

    constructor(scene) {
        this.scene = scene;
    }

    // 네트워크 요청 메서드들
    // 서버에 로그인 한 유저의 아이템 목록 요청
    async serverGetUserItem(user_id) {

        const requestURL = this.apiURL + 'item/own-item/' + user_id;
        //console.log("네트워크 매니저 requestURL", requestURL);

        try {
            const response = await fetch(requestURL, {
                // 요청 방식 - GET에는 body 포함 불가능
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
            });

            // .json() : 받은 응답을 JSON 형식으로 변환한다.
            const data = await response.json();

            console.log('유저 아이템 목록', data);

            // async 함수에서 반환하는 값은 항상 Promise 객체로 감싸져 있다.
            return data;
        } catch (error) {
            console.error('serverGetUserItem() Error : ', error);
            return null;
        }

    }

        // 모든 아이템 정보를 담은 목록 요청
        async serverGetAllItem() {

            const requestURL = this.apiURL + 'item/item/all';
    
            try {
                const response = await fetch(requestURL, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                });
    
                const data = await response.json();
                console.log('네트워크 매니저 전체 아이템 목록', data);
    
                return data;
            } catch (error) {
                console.error('serverGetAllItem() Error : ', error);
                return null;
            }
        }

    // 응답 처리 로직
}