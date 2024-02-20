import Phaser from "phaser";
import Frame_LT from "../frame_lt";
import StoreItemSlot from "./store_item_slot";
import Frame from "../frame";
import ToolTip from "../tooltip";
import SelectBox from "../select_box";

const pad = 20;
// Ui 요소간의 간격
const space = 10;

export default class StoreTabBody extends Frame_LT {

    scene;
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

    // 포인터 다운 리스너
    downListener = null;

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

        if (type === 0) {

            const txtStyle = {
                fontFamily: 'Arial',
                fontSize: 18,
                color: 'black',
                fontStyle: 'bold',
                align: 'center',
                /* stroke: 'white', // 외곽선
                strokeThickness: 3 // 외곽선 두께   */
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

                    // 유저 소유 아이템 중에서 감자 씨앗 찾기
                    const ownItemSlot = scene.findAddItemSlot(item_name);
                    //console.log('소유 아이템 슬롯', ownItemSlot);

                    // 소유한 아이템과 소유하지 않은 아이템의 처리

                    // 아이템 이미지 게임에 존재하는 씨앗들을 표시하게 변경
                    const itemSlot = new StoreItemSlot(scene, slotX, slotY, slotSize, slotSize, index);
                    itemSlot.setItemImg(item_name);

                    // 유저가 아이템을 소유하고 있을 경우 아이템 개수를 연동한다.
                    if (ownItemSlot.item) {
                        itemSlot.setItemCount(ownItemSlot.item.count);
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

                        // 거래 버튼들 상태 설정
                        this.setSingleBtnState(selectItem);
                        this.setMultiBtnState(selectItem);
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
            const selectItem = this.purchaseList[0];

            this.itemToolTips.setStoreToolTip(selectItem);
            this.itemSlots[0].selectBox.setVisible(true);
            this.selectIndex = 0;

            // 거래 버튼 상태 설정
            this.setSingleBtnState(selectItem);
            this.setMultiBtnState(selectItem);
        }
    }

    // 1개 거래 버튼 상태 설정
    // 지금은 1개 구매 상태만 설정한다.
    // 나중에 1개 판매 상태일 때도 설정해야 한다.
    setSingleBtnState(selectItem) {

        // 모든 이벤트 리스너 제거
        this.singleTradeBtn.removeAllListeners();

        // 구매할 아이템 가격
        let item_price = selectItem.item_price;

        // 유저 소지금이 충분하다면
        if (this.scene.characterInfo.cft >= item_price) {
            console.log(`유저 소지금이 ${selectItem.item_name} 1개를 사는데 충분하다.`);

            // 포인터 오버
            this.singleTradeBtn.on('pointerover', (pointer) => {
                document.body.style.cursor = 'pointer';
            });

            // 포인터 다운 이벤트 추가
            this.singleTradeBtn.on('pointerdown', (pointer) => {
                this.sendPurchaseRequest(1);
            });

            // 버튼 알파값 조정
            this.singleTradeBtn.setAlpha(1);
            this.singleTxt.setAlpha(1);
        }
        // 유저 소지금이 부족하다면
        else {
            console.log(`유저 소지금이 ${selectItem.item_name} 1개를 사는데 부족하다.`);

            // 포인터 오버 - 마우스 포인터 모양을 금지로 변경
            this.singleTradeBtn.on('pointerover', (pointer) => {
                document.body.style.cursor = 'not-allowed';
            });
            // 포인터 다운 이벤트 리스너 설정 안함 <- 아이템 구매 불가능하게 막음.

            // 버튼, 텍스트 알파 값 조정
            this.singleTradeBtn.setAlpha(0.5);
            this.singleTxt.setAlpha(0.5);
        }

        // 포인터 아웃 이벤트 설정
        this.singleTradeBtn.on('pointerout', (pointer) => {
            document.body.style.cursor = 'default';
        });

    }

    // 10개 거래 버튼 상태 설정
    setMultiBtnState(selectItem){

        // 모든 이벤트 리스너 제거
        this.multiTradeBtn.removeAllListeners();

        // 구매할 아이템 가격
        let item_price = selectItem.item_price * 10;

        // 유저 소지금이 충분하다면
        if (this.scene.characterInfo.cft >= item_price) {
            console.log(`유저 소지금이 ${selectItem.item_name} 10개를 사는데 충분하다.`);

            // 포인터 오버
            this.multiTradeBtn.on('pointerover', (pointer) => {
                document.body.style.cursor = 'pointer';
            });

            // 포인터 다운 이벤트 추가
            this.multiTradeBtn.on('pointerdown', (pointer) => {
                this.sendPurchaseRequest(10);
            });

            // 버튼 알파값 조정
            this.multiTradeBtn.setAlpha(1);
            this.multiTxt.setAlpha(1);
        }
        // 유저 소지금이 부족하다면
        else {
            console.log(`유저 소지금이 ${selectItem.item_name} 1개를 사는데 부족하다.`);

            // 포인터 오버 - 마우스 포인터 모양을 금지로 변경
            this.multiTradeBtn.on('pointerover', (pointer) => {
                document.body.style.cursor = 'not-allowed';
            });
            // 포인터 다운 이벤트 리스너 설정 안함 <- 아이템 구매 불가능하게 막음.

            // 버튼, 텍스트 알파 값 조정
            this.multiTradeBtn.setAlpha(0.5);
            this.multiTxt.setAlpha(0.5);
        }

        // 포인터 아웃 이벤트 설정
        this.multiTradeBtn.on('pointerout', (pointer) => {
            document.body.style.cursor = 'default';
        });

    }

    // 구매 탭, 판매 탭 전환
    switchTabs(type) {

        this.type = type;

        // 셀렉트 박스 visible 끄기
        this.itemSlots.forEach(itemSlot => {
            itemSlot.selectBox.setVisible(false);
        });

        // 구매 탭
        if (type === 0) {

            this.categoryTxt.setText('씨앗');

            this.itemSlots.forEach((itemSlot, index) => {
                itemSlot.setItemImg(this.purchaseList[index].item_name);

                const ownItemSlot = this.scene.findAddItemSlot(this.purchaseList[index].item_name);
                // 유저가 아이템을 소유하고 있을 경우 아이템 개수를 연동한다.
                if (ownItemSlot.item) {
                    itemSlot.setItemCount(ownItemSlot.item.count);
                }

            });

            // 판매 버튼으로 설정
            this.singleTxt.setText('1개 구매');
            this.multiTxt.setText('10개 구매');

            // 기본 아이템 선택된 상태로 변경
            this.itemToolTips.setStoreToolTip(this.purchaseList[0]);
            this.itemSlots[0].selectBox.setVisible(true);
            this.selectIndex = 0;
        }
        // 판매 탭
        else if (type === 1) {

            this.categoryTxt.setText('농작물');

            this.itemSlots.forEach((itemSlot, index) => {
                itemSlot.setItemImg(this.saleList[index].item_name);

                const ownItemSlot = this.scene.findAddItemSlot(this.saleList[index].item_name);
                // 유저가 아이템을 소유하고 있을 경우 아이템 개수를 연동한다.
                if (ownItemSlot.item) {
                    itemSlot.setItemCount(ownItemSlot.item.count);
                }

            });

            // 판매 버튼으로 설정
            this.singleTxt.setText('1개 판매');
            this.multiTxt.setText('10개 판매');

            // 기본 아이템 선택된 상태로 변경
            this.itemToolTips.setStoreToolTip(this.saleList[0]);
            this.itemSlots[0].selectBox.setVisible(true);
            this.selectIndex = 0;
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

}