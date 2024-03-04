import Phaser from "phaser";
import StoreItemSlot from "./store_item_slot";
import ToolTip from "../tooltip";
import Frame_LT from "../frame/frame_lt";
import Frame from "../frame/frame";


const pad = 20;
// Ui 요소간의 간격
const space = 10;

export default class StoreTabBody extends Frame_LT {

    scene;
    // 부모 컨테이너 클래스 참조
    storeUI;

    // 0 : 구매 탭, 1 : 판매 탭
    type;

    categoryTxt;

    itemSlots = [];
    itemToolTips;

    // 낱개 구매/판매 버튼
    singleTradeBtn;
    // 10개 구매/판매 버튼
    multiTradeBtn;
    // 전체 거래 버튼
    allTradeBtn;

    // 아이템 슬롯 행, 열 개수
    gridRow = 2;
    gridCol = 4;

    // 구매 가능한 씨앗 리스트
    purchaseList = [];
    // 판매 가능한 농작물 아이템 정보 리스트
    saleList = [];

    // 지금 선택중인 슬롯의 인덱스
    selectIndex;

    constructor(scene, x, y, width, height, type = 0, storeUI = null) {

        super(scene, x, y, width, height, 0);

        // 서버에서 전체 아이템 리스트 받고
        // 거기서 구매 가능 아이템, 판매 가능 아이템 리스트로 나누기
        // 구매 가능한 아이템 리스트 초기화
        this.purchaseList = scene.allItemList.filter(item => item.item_type === 0);
        //console.log('구매 가능 아이템 리스트 초기화', this.newPurchaseList);

        // 판매 가능한 아이템(농작물) 리스트 초기화
        this.saleList = scene.allItemList.filter(item => item.item_type === 1);
        //console.log('판매 가능 아이템 리스트 초기화', this.saleList);

        this.type = type;
        this.storeUI = storeUI;

        const txtStyle = {
            fontFamily: 'Arial',
            fontSize: 18,
            color: 'black',
            fontStyle: 'bold',
            align: 'center',
        };

        const categoryX = pad;
        const categoryY = pad;
        this.categoryTxt = scene.add.text(categoryX, categoryY, '씨앗', txtStyle);
        this.add([this.categoryTxt]);

        // 아이템 슬롯 시작 위치
        const slotSize = 75;
        const slotStartX = categoryX;
        const slotStartY = pad + this.categoryTxt.height + space;
        const slotSpace = 10;

        // 아이템 슬롯을 격자 형태로 나열한다.
        for (let row = 0; row < this.gridRow; row++) {
            for (let col = 0; col < this.gridCol; col++) {

                // 각 슬롯의 위치
                let slotX = slotStartX + slotSize * col + slotSpace * col;
                let slotY = slotStartY + slotSize * row + slotSpace * row;

                // 전체 인덱스
                let index = row * this.gridCol + col;

                // 각 슬롯에 들어갈 아이템의 이름
                const { item_id, item_type, item_name,
                    item_des, seed_time, use_level, item_price } = this.purchaseList[index];

                const ownItemSlot = scene.findAddItemSlot(item_name);
                //console.log('소유 아이템 슬롯', ownItemSlot);

                const itemSlot = new StoreItemSlot(scene, slotX, slotY, slotSize, slotSize, index);
                itemSlot.setItemImg(item_name);

                // 유저가 아이템을 소유하고 있을 경우 아이템 개수를 연동한다.
                if (ownItemSlot.item) {
                    itemSlot.setItemCount(ownItemSlot.item.count);
                } else { // 없으면 0개로 표시
                    itemSlot.setItemCount(0);
                }

                // 슬롯 클릭
                itemSlot.on('pointerdown', (pointer) => {
                    // 셀렉트 박스 visible 끄기
                    this.itemSlots.forEach(itemSlot => {
                        itemSlot.selectBox.setVisible(false);
                    });

                    // 클릭한 아이템 슬롯 인덱스
                    this.selectIndex = itemSlot.index;

                    // 표시할 아이템 객체
                    let selectItem = null;

                    if (this.type === 0)
                        selectItem = this.purchaseList[this.selectIndex];
                    else if (this.type === 1)
                        selectItem = this.saleList[this.selectIndex];

                    // 클릭한 아이템 정보를 툴팁에 표시한다.
                    this.itemToolTips.setStoreToolTip(selectItem);
                    itemSlot.selectBox.setVisible(true);

                    // 낱개 거래 버튼 상태 설정
                    this.setTradeBtnState(this.singleTradeBtn, this.singleTxt, selectItem, 1);
                    // 10개 거래 버튼 상태 설정
                    this.setTradeBtnState(this.multiTradeBtn, this.multiTxt, selectItem, 10);
                });

                this.add([itemSlot]);
                this.itemSlots.push(itemSlot);
            }
        }

        // 아이템 정보 툴팁 추가 하기전에 위치 잡기
        const toolTipPad = 15;
        const toolTipX = slotStartX + slotSize * this.gridCol + slotSpace * (this.gridCol + 1);
        const toolTipY = toolTipPad;
        // 크기
        const toolTipWidth = this.width - toolTipPad - pad - slotSize * this.gridCol - slotSpace * (this.gridCol + 1);
        const toolTipheight = this.height - toolTipPad * 2;

        this.itemToolTips = new ToolTip(scene, toolTipX, toolTipY, toolTipWidth, toolTipheight);

        this.add([this.itemToolTips]);

        // 버튼 공용 변수들
        const btnPad = 10;
        const btnSpace = 5;
        const btnWidth = this.itemToolTips.width - btnPad * 2;
        const btnHeight = 45;

        // 10개 거래 버튼 추가
        const multiBtnX = toolTipX + btnPad;
        const multiBtnY = toolTipY + this.itemToolTips.height - btnHeight - btnPad;
        this.multiTradeBtn = new Frame(scene, multiBtnX, multiBtnY, btnWidth, btnHeight);

        // 10개 거래 버튼 상호작용 영역 설정
        const multiHitArea = new Phaser.Geom.Rectangle(this.multiTradeBtn.width / 2,
            this.multiTradeBtn.height / 2,
            this.multiTradeBtn.width, this.multiTradeBtn.height);
        const multiHitCallback = Phaser.Geom.Rectangle.Contains;
        this.multiTradeBtn.setInteractive(multiHitArea, multiHitCallback);

        // 10개 거래 버튼 상호작용 영역 보이게 하기
        /* this.multiTradeBtn.setDepth(1000);
        scene.input.enableDebug(this.multiTradeBtn); */

        // 10개 거래 텍스트 스타일
        txtStyle.fontSize = 18;
        txtStyle.color = 'white';
        txtStyle.stroke = 'black';
        txtStyle.strokeThickness = 5;
        // 10개 거래 텍스트 추가
        const multiTxtX = multiBtnX + this.multiTradeBtn.width / 2;
        const multiTxtY = multiBtnY + this.multiTradeBtn.height / 2;
        this.multiTxt = scene.add.text(multiTxtX, multiTxtY, '10개 구매', txtStyle);
        this.multiTxt.setOrigin(0.5, 0.5);

        this.add([this.multiTradeBtn, this.multiTxt]);

        // 낱개 거래 버튼 추가
        const singleBtnX = multiBtnX;
        const singleBtnY = multiBtnY - this.multiTradeBtn.height - btnSpace;
        this.singleTradeBtn = new Frame(scene, singleBtnX, singleBtnY, btnWidth, btnHeight);

        // 낱개 거래 버튼 상호작용 영역 설정하기
        const singleHitArea = new Phaser.Geom.Rectangle(this.singleTradeBtn.width / 2,
            this.singleTradeBtn.height / 2,
            this.singleTradeBtn.width, this.singleTradeBtn.height);
        const singleHitCallback = Phaser.Geom.Rectangle.Contains;
        this.singleTradeBtn.setInteractive(singleHitArea, singleHitCallback);

        /* this.singleTradeBtn.setDepth(1000);
        scene.input.enableDebug(this.singleTradeBtn); */

        // 낱개 거래 텍스트
        const singleTxtX = singleBtnX + this.singleTradeBtn.width / 2;
        const singleTxtY = singleBtnY + this.singleTradeBtn.height / 2;
        this.singleTxt = scene.add.text(singleTxtX, singleTxtY, '1개 구매', txtStyle);
        this.singleTxt.setOrigin(0.5, 0.5);

        this.add([this.singleTradeBtn, this.singleTxt]);

        // UI 생성할 때
        // 기본 아이템(감자 씨앗, 감자) 선택되있는 상태로 만들기
        this.selectIndex = 0;
        const selectItem = this.purchaseList[this.selectIndex];
        const selectSlot = this.itemSlots[this.selectIndex];

        this.itemToolTips.setStoreToolTip(selectItem);
        selectSlot.selectBox.setVisible(true);
        

        // 캐릭터 레벨 확인하고 슬롯 상태 설정
        let level = this.scene.characterInfo.level;

        // 아이템 슬롯 상태 설정
        this.itemSlots.forEach((itemSlot, index) => {
            // 캐릭터 현재 레벨
            let level = this.scene.characterInfo.level;
            // 아이템 정보
            let itemInfo = this.purchaseList[index];

            if ( level >= itemInfo.use_level){
                itemSlot.setSlotLockState(false);
            }else{
                itemSlot.setSlotLockState(true);
            }

        });


        // 낱개 거래 버튼 상태 설정
        this.setTradeBtnState(this.singleTradeBtn, this.singleTxt, selectItem, 1, false);
        // 10개 거래 버튼 상태 설정
        this.setTradeBtnState(this.multiTradeBtn, this.multiTxt, selectItem, 10);
    }

    // 거래 버튼 상태 설정
    // 현재 탭의 상태에 따라 구매/판매 기능을 하게 상태 변경
    // 추가 : 구매 탭 버튼에서 캐릭터 레벨이 아이템 제한 레벨보다 낮으면 표시 안보이게 설정
    setTradeBtnState(tradeBtn, tradeTxt, selectItem, item_count, visible = true) {

        // 모든 이벤트 리스너 제거
        tradeBtn.removeAllListeners();

        // 구매 탭이면 구매 기능
        if (this.type === 0) {
            console.log('거래 버튼 기능을 아이템 구매로 설정');


            if(visible){
                tradeBtn.setVisible(true);
                tradeTxt.setVisible(true);
            }else{
                tradeBtn.setVisible(false);
                tradeTxt.setVisible(false); 
            }

            // 구매할 아이템의 총 가격
            let item_price = selectItem.item_price * item_count;

            // 유저 소지금이 충분한지 확인
            if (this.scene.characterInfo.cft >= item_price) {
                console.log(`유저 소지금이 ${selectItem.item_name} ${item_count}개를 사는데 충분하다.`);

                // 버튼 포인터 오버 이벤트
                tradeBtn.on('pointerover', (pointer) => {
                    document.body.style.cursor = 'pointer';
                });
                // 버튼 포인터 다운 이벤트 추가
                tradeBtn.on('pointerdown', (pointer) => {
                    this.sendPurchaseRequest(item_count);
                });
                // 버튼, 텍스트 알파값 조정
                tradeBtn.setAlpha(1);
                tradeTxt.setAlpha(1);
            }
            else { // 유저 소지금이 부족하면
                console.log(`유저 소지금이 ${selectItem.item_name} ${item_count}개를 사는데 부족하다.`);
                // 마우스 포인터 모양을 금지 표시로 변경
                tradeBtn.on('pointerover', (pointer) => {
                    document.body.style.cursor = 'not-allowed';
                });
                // 포인터 다운 이벤트 리스너 설정 x <- 아이템 구매 불가능하게 막는다.

                //버튼, 텍스트 알파값 조정
                tradeBtn.setAlpha(0.5);
                tradeTxt.setAlpha(0.5);
            }
        }
        // 판매 탭이면 판매 기능
        else if (this.type === 1) {
            console.log('거래 버튼 기능을 아이템 판매로 설정');

            // 판매할 아이템을 몇 개 소유했는지 확인
            const ownItemSlot = this.scene.findAddItemSlot(selectItem.item_name);

            let own_item_count = 0;
            let sell_item_count = item_count;

            if (ownItemSlot.item)
                own_item_count = ownItemSlot.item.count;

            // 판매할 개수만큼 아이템을 소유하고 있는지 확인한다.
            if (own_item_count >= sell_item_count) {
                console.log(`${selectItem.item_name}를 ${sell_item_count}개 이상 보유하고 있어서 판매 가능함.`);
                // 버튼 포인터 오버
                tradeBtn.on('pointerover', (pointer) => {
                    document.body.style.cursor = 'pointer';
                });
                // 버튼 포인터 다운
                tradeBtn.on('pointerdown', (pointer) => {
                    this.sendSellRequest(sell_item_count);
                });
                // 버튼, 텍스트 알파값 조정
                tradeBtn.setAlpha(1);
                tradeTxt.setAlpha(1);
            } else {
                console.log(`${selectItem.item_name}를 ${sell_item_count}개 이상 보유하지 않고 있어서 판매 불가능함.`);
                // 포인터 오버 - 마우스 포인터 모양을 금지로 변경
                tradeBtn.on('pointerover', (pointer) => {
                    document.body.style.cursor = 'not-allowed';
                });
                // 포인터 다운 이벤트 설정 x <- 아이템 판매 불가능하게 막기

                // 버튼, 텍스트 알파값 조정
                tradeBtn.setAlpha(0.5);
                tradeTxt.setAlpha(0.5);
            }
        }

        // 포인터 아웃 이벤트 설정
        tradeBtn.on('pointerout', (pointer) => {
            document.body.style.cursor = 'default';
        });

    }

    // 구매 탭, 판매 탭 전환
    switchTabs(type) {

        this.type = type;

        let selectItem = null;

        // 셀렉트 박스 visible 끄기
        this.itemSlots.forEach(itemSlot => {
            itemSlot.selectBox.setVisible(false);
        });

        // 구매 탭
        if (type === 0) {

            this.categoryTxt.setText('씨앗');
            selectItem = this.purchaseList[0];

            this.itemSlots.forEach((itemSlot, index) => {
                itemSlot.setItemImg(this.purchaseList[index].item_name);

                const ownItemSlot = this.scene.findAddItemSlot(this.purchaseList[index].item_name);
                // 유저가 아이템을 소유하고 있을 경우 아이템 개수를 연동한다.
                if (ownItemSlot.item) {
                    itemSlot.setItemCount(ownItemSlot.item.count);
                } else { // 없으면 0개로 표시
                    itemSlot.setItemCount(0);
                }

            });

            // 구매 버튼으로 설정
            this.singleTxt.setText('1개 구매');
            this.multiTxt.setText('10개 구매');

            // 기본 아이템 선택된 상태로 변경
            this.itemToolTips.setStoreToolTip(selectItem);
            this.itemSlots[0].selectBox.setVisible(true);
            this.selectIndex = 0;

            // 낱개 거래 버튼 상태 설정
            this.setTradeBtnState(this.singleTradeBtn, this.singleTxt, selectItem, 1);
            // 10개 거래 버튼 상태 설정
            this.setTradeBtnState(this.multiTradeBtn, this.multiTxt, selectItem, 10);
        }
        // 판매 탭
        else if (type === 1) {

            this.categoryTxt.setText('농작물');
            selectItem = this.saleList[0];

            this.itemSlots.forEach((itemSlot, index) => {
                itemSlot.setItemImg(this.saleList[index].item_name);

                const ownItemSlot = this.scene.findAddItemSlot(this.saleList[index].item_name);

                // 유저가 아이템을 소유하고 있을 경우 아이템 개수를 연동한다.
                if (ownItemSlot.item) {
                    itemSlot.setItemCount(ownItemSlot.item.count);
                } else { // 없으면 0개로 표시
                    itemSlot.setItemCount(0);
                }

            });

            // 판매 버튼으로 설정
            this.singleTxt.setText('1개 판매');
            this.multiTxt.setText('10개 판매');

            // 기본 아이템 선택된 상태로 변경
            this.itemToolTips.setStoreToolTip(selectItem);
            this.itemSlots[0].selectBox.setVisible(true);
            this.selectIndex = 0;

            // 낱개 거래 버튼 상태 설정
            this.setTradeBtnState(this.singleTradeBtn, this.singleTxt, selectItem, 1);
            // 10개 거래 버튼 상태 설정
            this.setTradeBtnState(this.multiTradeBtn, this.multiTxt, selectItem, 10);

        }
    }

    // 네트워크 매니저에게 서버에 아이템 구매 요청 보내달라고 전달한다.
    sendPurchaseRequest(item_count) {
        // 구매하는 아이템 정보
        let buyItemInfo = this.purchaseList[this.selectIndex];

        // 구매한 아이템이 들어갈 아이템 슬롯 찾기
        let addItemSlot = this.scene.findAddItemSlot(buyItemInfo.item_name);
        console.log('구매할 아이템이 들어갈 템슬롯', addItemSlot);

        // 구매할 아이템이 들어갈 슬롯 인덱스 구하기
        let item_index = 0;
        if (addItemSlot.type === 0) {
            item_index = addItemSlot.index + this.scene.quickSlotUI.size;
        } else {
            item_index = addItemSlot.index;
        }
        console.log('구매할 아이템이 들어갈 슬롯 인덱스', item_index);

        // 서버에 아이템 구매 요청
        this.scene.networkManager.serverBuyItem(item_count, item_index, buyItemInfo, addItemSlot, this);
    }

    // 네트워크 매니저에게 서버에 아이템 판매 요청 보내달라고 전달한다.
    sendSellRequest(item_count) {
        // 판매하려는 아이템 정보 구하기
        let sellItemInfo = this.saleList[this.selectIndex];

        // 아이템이 판매될 슬롯 찾기
        let sellItemSlot = this.scene.findAddItemSlot(sellItemInfo.item_name);

        // 아이템이 판매될 슬롯의 인덱스 구하기
        let item_index = 0;
        if (sellItemSlot.type === 0) {
            item_index = sellItemSlot.index + this.scene.quickSlotUI.size;
        } else {
            item_index = sellItemSlot.index;
        }

        // 서버에 아이템 판매 요청하기
        this.scene.networkManager.serverSellItem(item_count, item_index, sellItemInfo, sellItemSlot, this);
    }

}