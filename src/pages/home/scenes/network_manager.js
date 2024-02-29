import Phaser from "phaser";
import Item from "../elements/item";

export default class NetworkManager {

    scene;

    apiURL = process.env.REACT_APP_API;
    accessToken = '';

    constructor(scene) {
        this.scene = scene;
        this.accessToken = scene.accessToken;

        //console.log('네트워크 매니저 액세스 토큰 값', this.accessToken);
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
            // 서버로부터 받은 맵 정보
            console.log('받은 맵 정보', data);

            return data;
        } catch (error) {
            console.error('serverGetMap() Error : ', error);
            return null;
        }
    }

    // 아이템 구매 요청
    // 아이템 구매가 성공하면 새 아이템 추가하거나, 기존 아이템 수량 증가시킨다.
    async serverBuyItem(item_count, item_index, buyItemInfo, addItemSlot, tabBody) {

        //console.log('buyItemInfo : ', buyItemInfo);

        const { item_id, item_type, item_name,
            item_des, seed_time, use_level, item_price } = buyItemInfo;

        const requestURL = this.apiURL + 'item/buyItem/'
        const requestBody = {
            'item_id': item_id,
            'item_count': item_count,
            'item_price': item_price * item_count,
            item_index: item_index
        };

        try {
            const response = await fetch(requestURL, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + this.accessToken
                },
                body: JSON.stringify(requestBody)
            });

            const data = await response.json();
            // 아이템 구매 결과
            console.log('아이템 구매 결과', data);

            // 소지금 변동
            this.scene.characterInfo.cft -= item_price * item_count;

            // 중복 아이템 수량 증가
            if (addItemSlot.item !== null) {
                addItemSlot.item.count += item_count;
                addItemSlot.setSlotItem(addItemSlot.item);
            }
            // 새 아이템 추가
            else {
                addItemSlot.setSlotItem(new Item(buyItemInfo, item_count));
            }

            // 상점 아이템 슬롯의 아이템 개수도 업데이트
            tabBody.itemSlots.forEach((itemSlot, index) => {
                itemSlot.setItemImg(tabBody.purchaseList[index].item_name);

                const ownItemSlot = tabBody.scene.findAddItemSlot(tabBody.purchaseList[index].item_name);
                // 유저가 아이템을 소유하고 있을 경우 아이템 개수를 연동한다.
                if (ownItemSlot.item) {
                    itemSlot.setItemCount(ownItemSlot.item.count);
                }
            });

            // 변동된 소지금 표시
            tabBody.storeUI.setCFTTxt();

            // 낱개 거래 버튼 상태 설정
            tabBody.setTradeBtnState(tabBody.singleTradeBtn, tabBody.singleTxt, buyItemInfo, 1);
            // 10개 거래 버튼 상태 설정
            tabBody.setTradeBtnState(tabBody.multiTradeBtn, tabBody.multiTxt, buyItemInfo, 10);

        } catch (error) {
            console.error('serverBuyItem() Error : ', error);
            return null;
        }

    }

    // 아이템 판매 요청
    // 아이템 판매가 성공되면 전부 판매했을 경우 아이템을 삭제하거나 기존 아이템 수량을 감소시킨다.
    // tabBody : 상점 탭 바디 참조해서 소지금과 아이템 수량 표시 업데이트
    async serverSellItem(item_count, item_index, sellItemInfo, sellItemSlot, tabBody) {

        const { item_id, item_type, item_name,
            item_des, seed_time, use_level, item_price } = sellItemInfo;

        console.log('판매될 아이템 슬롯 인덱스', item_index);

        // 아이템 총 판매 가격
        let sell_price = item_count * item_price;

        const requestURL = this.apiURL + 'item/sellItem/';
        const requestBody = {
            'item_id': item_id,
            'item_count': item_count,
            'item_price': sell_price,
            'item_index': item_index
        };

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
            // 아이템 판매 결과 - 성공하면 'success'
            console.log('아이템 판매 결과', data);

            if (data === 'success') {

                // 소지금 변동
                this.scene.characterInfo.cft += sell_price;

                // 판매한 아이템 수량 감소
                sellItemSlot.useItem(item_count);

                // 판매한 상점 아이템 슬롯의 아이템 개수도 변경
                tabBody.itemSlots.forEach((itemSlot, index) => {
                    itemSlot.setItemImg(tabBody.saleList[index].item_name);

                    const ownItemSlot = tabBody.scene.findAddItemSlot(tabBody.saleList[index].item_name);
                    // 남은 아이템 수량 표시
                    if (ownItemSlot.item) {
                        itemSlot.setItemCount(ownItemSlot.item.count);
                    }
                    // 아이템 다 팔았으면 0개로 표시
                    else {
                        itemSlot.setItemCount(0);
                    }
                });

                // 변동된 소지금 표시
                tabBody.storeUI.setCFTTxt();

                // 낱개 거래 버튼 상태 설정
                tabBody.setTradeBtnState(tabBody.singleTradeBtn, tabBody.singleTxt, sellItemInfo, 1);
                // 10개 거래 버튼 상태 설정
                tabBody.setTradeBtnState(tabBody.multiTradeBtn, tabBody.multiTxt, sellItemInfo, 10);

            }

        } catch (error) {
            console.error('serverSellItem() Error : ', error);
            return null;
        }

    }

    // 서버에 요리 제작 요청
    // 성공하면 요리 아이템 추가, 기존 요리 아이템 수량 증가
    async serverCook(cookingItemInfo, item_index, cookingItemSlot){

        const { item_id, item_type, item_name,
            item_des, seed_time, use_level, item_price, ingredients } = cookingItemInfo;

        const requestURL = this.apiURL + 'cook/';

        // 요리를 만드는 데 필요한 재료의 종류
        let needIngrType = ingredients.length;
        //console.log(`${item_name}을 만드는 데 요리 재료 ${needIngrType}종류가 필요함.`);

        // 요리 재료 1 id
        let ingr1_id = 0;
        // 요리 재료 2 id
        let ingr2_id = 0;

        // 요리 재료 1종류 필요할 때
        if( needIngrType === 1){
            ingr1_id = this.scene.allItemMap.get(ingredients[0].name).item_id;
            ingr2_id = ingr1_id;
        }
        else if( needIngrType === 2){ // 2종류 필요할 때
            ingr1_id = this.scene.allItemMap.get(ingredients[0].name).item_id;
            ingr2_id = this.scene.allItemMap.get(ingredients[1].name).item_id;
        }

        const requestBody = {
            "cook": item_id,
            "ingredient1": ingr1_id,
            "ingredient2": ingr2_id,
            "item_index": item_index
        };

        console.log('serverCook() 리퀘스트 바디 : ', requestBody);

        try {
            const response = await fetch(requestURL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + this.accessToken
                },
                body: JSON.stringify(requestBody)
            });

            const data = await response.text();
            // 요리 요청 결과 - 성공하면 'success'
            console.log('요리 요청 결과', data);

            if (data === 'success') {

                // 기존 요리 아이템 수량 증가
                if (cookingItemSlot.item !== null){
                    cookingItemSlot.item.count += 1;
                    cookingItemSlot.setSlotItem(cookingItemSlot.item);
                }else{ // 새 요리 아이템 추가 
                    cookingItemSlot.setSlotItem(new Item(cookingItemInfo,1));
                }

                // 화덕 UI 아이템 슬롯의 개수 표시 업데이트
                // 화덕 UI의 cookingTab 참조
                const cookingTab = this.scene.FirePitUI.tabBody;

                cookingTab.itemSlots.forEach((itemSlot, index) => {
                    // 요리 아이템 이미지 새로 설정
                    let item_name = cookingTab.cookingList[index].item_name;
                    itemSlot.setItemImg(item_name);
                    // 요리 아이템 이미지 스케일은 3.5
                    itemSlot.itemImg.setScale(3.5);

                    const ownItemSlot = this.scene.findAddItemSlot(item_name);
                    // 유저가 인벤토리이나 퀵슬롯에 요리 아이템을 소유하고 있을 경우 아이템 개수를 연동함.
                    if(ownItemSlot.item) {
                        itemSlot.setItemCount(ownItemSlot.item.count);
                    }
                });

                // 재료 아이템 소비된 거 수량 감소하고 표시 업데이트
                // (서버에서 이미 소비가 된 상태라서 아이템 소비 요청 보낼 필요 없음)
                ingredients.forEach((ingr, index) => {
                    const ingrSlot = this.scene.findAddItemSlot(ingr.name);
                    ingrSlot.useItem(ingr.quantity);
                });

                // 요리 버튼 상태 재설정
                cookingTab.setCookBtnState(cookingItemInfo);

                // 툴팁 상태도 재설정
                cookingTab.itemToolTip.setStoreToolTip(cookingItemInfo);
            }

        } catch (error) {
            console.error('serverCook() Error : ', error);
            return null;
        }

    }

    // 서버에 캐릭터 경험치 올려달라고 요청
    async serverAddExp(exp){

        const requestURL = this.apiURL + 'user/exp/';
        const requestBody = {
            "exp": exp
        };

        console.log('severAddExp() 리퀘스트 바디', requestBody);

        try {
            const response = await fetch(requestURL, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + this.accessToken
                },
                body: JSON.stringify(requestBody)
            });

            const data = await response.json();

            console.log('경험치 올리기 요청 결과', data);

            return data;

        } catch (error) {
            console.error('serverAddExp() Error : ', error);
            return null;
        }

    }
}