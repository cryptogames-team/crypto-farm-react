import Phaser from "phaser";
import Item from "../elements/item";

export default class NetworkManager {

    scene;

    apiURL = process.env.REACT_APP_API;
    accessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX25hbWUiOiJ0ZXN0IiwiYXNzZXRfaWQiOiI0NTYzNDU2IiwiaWF0IjoxNzA3Mzc3ODgwLCJleHAiOjE3MDc0MTM4ODB9.YXmA7-0jcyw1XbhRHdaD6PZHbqhfWwcPMfgjsFY0hC4';

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

    // 서버에 로그인 한 유저에게 새 아이템 추가, 기존 아이템 수량 증가 요청하는 함수
    async serverAddItem(item_count, item_index, addItemInfo, addItemSlot) {

        const { item_id, item_type, item_name,
            item_des, seed_time, use_level, item_price } = addItemInfo;

        const requestURL = this.apiURL + 'item/add/';
        const requestBody = {
            'item_id': item_id,
            'item_count': item_count,
            'item_index': item_index
        };

        //console.log("서버 아이템 추가 요청에 사용할 바디 ", requestBody);

        try {
            const response = await fetch(requestURL, {
                // 요청 방식
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + this.accessToken
                },
                body: JSON.stringify(requestBody)
            });

            // .text() : 받은 응답을 text 형식으로 변환한다.
            const data = await response.text();

            //console.log("받은 응답 헤더의 콘텐츠 타입", response.headers.get("content-type"));

            // 요청이 성공하면 새 아이템의 추가나 중복 아이템 수량 증가 시키기
            if (data === 'success') {

                //console.log('서버 아이템 추가 요청 성공 - 추가될 아이템 슬롯', addItemSlot);

                // 중복 아이템 수량 증가
                if (addItemSlot.item !== null) {
                    addItemSlot.item.count += 1;
                    addItemSlot.setSlotItem(addItemSlot.item);
                }
                // 새 아이템 추가
                else {
                    addItemSlot.setSlotItem(new Item(addItemInfo, item_count));
                }
            }
            else {
                console.log('서버 아이템 추가 실패');
            }

        } catch (error) {
            console.error('serverAddItem() Error : ', error);
        }

    }

    // 서버에 로그인 한 유저의 아이템 소비 요청함.
    async serverUseItem(useItemInfo, item_count, useItemSlot) {

        const { item_id, item_type, item_name,
            item_des, seed_time, use_level, item_price } = useItemInfo;

        const requestURL = this.apiURL + 'item/use/';
        const requestBody = {
            'item_id': item_id,
            'item_count': item_count,
        }

        //console.log("서버 아이템 사용 요청에 사용할 바디 ", requestBody);

        try {
            const response = await fetch(requestURL, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + this.accessToken
                },
                body: JSON.stringify(requestBody)
            });

            const data = await response.text();

            // 요청이 성공하면 클라이언트에서도 아이템 소비와 삭제
            if (data === 'use success') {
                //console.log('아이템이 소비되는 슬롯', useItemSlot);
                useItemSlot.useItem(item_count);
            }
            else {
                console.log('서버 아이템 소비 실패');
            }
        } catch (error) {
            console.error('serverUseItem() Error : ', error);
        }
    }

    // 서버에 아이템 이동 요청
    async serverMoveItem(moveItemInfo, item_index) {

        const { item_id, item_type, item_name,
            item_des, seed_time, use_level, item_price } = moveItemInfo;

        const requestURL = this.apiURL + 'item/move/' + item_id + '/' + item_index;

        try {
            const response = await fetch(requestURL, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + this.accessToken
                },
            });

            const data = await response.text();

            // 요청이 성공했는지 확인
            if (data === 'success') {
                console.log('서버 아이템 이동 성공');
            }
            else {
                console.log('서버 아이템 이동 실패');
            }

        } catch (error) {
            console.error('serverMoveItem() Error : ', error);
        }
    }

    // 서버에 맵 데이터 추가 및 수정 요청
    async serverAddMap(mapData) {

        const requestURL = this.apiURL + 'map/';
        const requestBody = JSON.stringify(mapData);

        console.log("서버에 맵 데이터 추가 및 수정 요청");

        try {
            const response = await fetch(requestURL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + this.accessToken
                },
                body: requestBody
            });

            //console.log("mapData 객체 JSON화", requestBody);
            const data = await response.json();

            // 서버로부터 받은 변경된 유저 맵 정보
            console.log('응답받은 맵 정보', data);
        } catch (error) {
            console.error('serverAddMap() Error : ', error);
        }
    }

    // 로그인 한 유저의 맵 데이터 요청
    async serverGetMap(asset_id) {

        const requestURL = this.apiURL + 'map/' + asset_id;
        try {
            const response = await fetch(requestURL, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();
            // 서버로부터 받은 유저 아이템 정보들
            console.log('받은 맵 정보', data);

            return data;
        } catch (error) {
            console.error('serverGetMap() Error : ', error);
            return null;
        }
    }
}