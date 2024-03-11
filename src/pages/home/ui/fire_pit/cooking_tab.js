import Phaser from "phaser";
import TabBodyUI from "../tab_body_ui";
import Frame from "../frame/frame";



export default class CookingTab extends TabBodyUI {

    scene;

    // 부모 컨테이너 클래스 참조
    parentRef;
    type;

    // 요리 버튼과 텍스트
    cookingBtn;
    cookingTxt;

    // 요리 리스트
    cookingList = [];


    constructor(scene, x, y, width, height, gridRow, gridCol) {

        super(scene, x, y, width, height, gridRow, gridCol);

        this.scene = scene;

        // 카테고리 텍스트 내용 변경
        this.categoryTxt.setText('기본 요리');

        const txtStyle = {
            fontFamily: 'Arial',
            fontSize: 18,
            color: 'white',
            fontStyle: 'bold',
            align: 'center',
            stroke: 'black',
            strokeThickness: 5,
        };

        // 요리 버튼 추가
        const btnPad = 10;
        const btnSpace = 5;
        const btnWidth = this.itemToolTip.width - btnPad * 2;
        const btnHeight = 45;

        const cookingBtnX = this.itemToolTip.x + btnPad;
        const cookingBtnY = this.itemToolTip.y + this.itemToolTip.height - btnHeight - btnPad;
        this.cookingBtn = new Frame(scene, cookingBtnX, cookingBtnY, btnWidth, btnHeight);

        // 요리 버튼 상호작용 영역 설정
        const cookHitArea = new Phaser.Geom.Rectangle(this.cookingBtn.width / 2,
            this.cookingBtn.height / 2,
            this.cookingBtn.width, this.cookingBtn.height);
        const cookHitCallBack = Phaser.Geom.Rectangle.Contains;
        this.cookingBtn.setInteractive(cookHitArea, cookHitCallBack);

        // 버튼 텍스트 추가
        const cookingTxtX = cookingBtnX + this.cookingBtn.width / 2;
        const cookingTxtY = cookingBtnY + this.cookingBtn.height / 2;
        this.cookingTxt = scene.add.text(cookingTxtX, cookingTxtY, '요리하기', txtStyle);
        this.cookingTxt.setOrigin(0.5, 0.5);

        this.add([this.cookingBtn, this.cookingTxt]);

        // 아이템 슬롯들에 클릭 리스너 추가
        this.itemSlots.forEach((itemSlot, index) => {

            // 아이템 슬롯 클릭 리스너 설정
            itemSlot.on('pointerdown', (pointer) => {
                this.selectItemSlot(itemSlot.index);
            });

        });
    }

    // 요리 버튼 상태 설정
    setCookBtnState(cookingItem, item_count = 1) {

        this.cookingBtn.removeAllListeners();

        // 요리 아이템 정보 구조 분해
        const { item_id, item_type, item_name,
            item_des, seed_time, use_level, item_price, ingredients } = cookingItem;

        // 요리 재료 아이템을 충분히 소유했는지 확인하는 플래그
        let isEnough = true;

        // 재료가 몇가지 필요한지 확인한다. 최대 2가지
        let needIngr = ingredients.length;

        // 유저가 재료 아이템을 가지고 있는지 확인
        ingredients.forEach((ingr, index) => {

            // 유저가 소유한 index번째 재료 아이템 개수 찾기
            let ownIngr = 0;
            const ownIngrSlot = this.scene.findAddItemSlot(ingr.name);
            if (ownIngrSlot.item)
                ownIngr = ownIngrSlot.item.count;

            // 요리에 필요한 재료 아이템 개수
            let requireIngr = ingr.quantity;

            if (ownIngr < requireIngr)
                isEnough = false;
        });

        // 재료 아이템이 충분하면 버튼 활성화
        if (isEnough) {
            //console.log('재료 아이템이 충분합니다.');

            // 버튼 이벤트 리스너 설정
            this.cookingBtn.on('pointerover', (pointer) => {
                document.body.style.cursor = 'pointer';
            });
            this.cookingBtn.on('pointerdown', (pointer) => {

                // 만들려는 요리 아이템 정보
                let cookingItem = this.cookingList[this.selectIndex];
                this.sendCookRequest(cookingItem);
            });

            // 버튼, 텍스트 알파값 조정
            this.cookingBtn.setAlpha(1);
            this.cookingTxt.setAlpha(1);
        }
        else { // 재료 아이템이 부족하면 버튼 비활성화
            //console.log('재료 아이템이 부족합니다.');

            // 버튼 이벤트 리스너 설정
            this.cookingBtn.on('pointerover', (pointer) => {
                document.body.style.cursor = 'not-allowed';
            });
            // 클릭 이벤트 리스너 설정 x

            // 버튼, 텍스트 알파값 조정
            this.cookingBtn.setAlpha(0.5);
            this.cookingTxt.setAlpha(0.5);
        }

        // 마우스 포인터 아웃
        this.cookingBtn.on('pointerout', (pointer) => {
            document.body.style.cursor = 'default';
        });
    }

    // 네트워크 매니저에게 서버에 요리 요청 해달라고 전달
    sendCookRequest(cookingItem, item_count = 1) {
        // 요리 아이템이 추가될 슬롯
        const cookingItemSlot = this.scene.findAddItemSlot(cookingItem.item_name);

        // 요리 아이템이 추가될 슬롯 인덱스 구하기
        let item_index = 0;
        if (cookingItemSlot.type === 0) {
            item_index = cookingItemSlot.index + this.scene.quickSlotUI.size;
        } else {
            item_index = cookingItemSlot.index;
        }
        //console.log('요리 아이템이 추가될 아이템 슬롯 인덱스 ', item_index);

        this.scene.networkManager.serverCook(cookingItem, item_index, cookingItemSlot);
    }

    // 소유한 요리 아이템 개수를 UI 슬롯에 표시
    // 유저 소유 아이템 정보가 이거 실행하는 시점보다 늦어서 0개로 뜨는듯?
    syncItemCount() {

        //console.log('소유한 요리 아이템 개수 연동');
        this.itemSlots.forEach((itemSlot, index) => {
            // 요리 아이템 이미지 새로 설정
            let item_name = this.cookingList[index].item_name;
            itemSlot.setItemImg(item_name);
            // 요리 아이템 이미지 스케일은 3.5
            itemSlot.itemImg.setScale(3.5);

            const ownItemSlot = this.scene.findAddItemSlot(item_name);
            // 유저가 인벤토리이나 퀵슬롯에 요리 아이템을 소유하고 있을 경우 아이템 개수를 연동함.
            if (ownItemSlot.item) {
                itemSlot.setItemCount(ownItemSlot.item.count);
            } else {
                itemSlot.setItemCount(0);
            }
        });

    }

    // 특정 아이템 슬롯 선택
    selectItemSlot(selectIndex) {

        this.selectIndex = selectIndex;
        const selectItem = this.cookingList[selectIndex];
        // 선택한 요리 아이템 정보 표시하게 툴팁 설정
        this.itemToolTip.setStoreToolTip(selectItem);
        // 요리 버튼 상태 설정
        this.setCookBtnState(selectItem);
        // 요리 아이템 개수 연동
        this.syncItemCount();
        // 선택한 아이템 슬롯 셀렉트 박스 표시
        this.setSelectBoxVisible(selectIndex);
    }

    // 선택한 슬롯의 셀렉트 박스 표시 켜기
    setSelectBoxVisible(selectIndex) {
        // 모든 슬롯의 셀렉트 박스 표시 끄기
        this.itemSlots.forEach((itemSlot, index) => {
            itemSlot.selectBox.setVisible(false);
        });
        // 셀렉트 박스를 표시를 켜기
        this.itemSlots[selectIndex].selectBox.setVisible(true);
    }

    // 요리 아이템 표시하게 전체 아이템 슬롯들 초기화
    initItemSlots() {

        this.itemSlots.forEach((itemSlot, index) => {
        // 요리 아이템 정보
        const selectItem = this.cookingList[index];

        // 요리 아이템 정보 구조 분해
        const { item_id, item_type, item_name,
            item_des, seed_time, use_level, item_price, ingredients } = selectItem;

        // 요리 아이템 소유 중인지 확인
        const ownItemSlot = this.scene.findAddItemSlot(item_name);

        // 요리 아이템 개수 설정
        if (ownItemSlot.item) {
            itemSlot.setItemCount(ownItemSlot.item.count);
        } else { // 없으면 0개로 표시
            itemSlot.setItemCount(0);
        }

        // 요리 아이템 이미지 설정
        itemSlot.setItemImg(item_name);
        itemSlot.itemImg.setScale(3.5);
        });
    }

    // UI에서 사용할 요리 아이템 리스트 초기화
    // 게임의 전체 아이템 리스트에서 요리 아이템만 뽑아냄.
    initItemList() {
        this.cookingList = this.scene.allItemList.filter(item => item.item_type === 5);
        // 요리 레시피 정보 추가
        this.cookingList.forEach((cookItem, index) => {
            cookItem.ingredients = this.scene.cookRecipes[index].ingredients;
        });
        //console.log('요리 리스트 초기화', this.cookingList);
    }
    // UI 탭 초기화
    initTab() {
        this.initItemList();
        this.initItemSlots();
        // 기본 요리 아이템 선택
        this.selectItemSlot(0);
    }
}