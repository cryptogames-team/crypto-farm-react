import TabBodyUI from "../tab_body_ui";
import Frame from "../frame";

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

        this.cookingList = scene.allItemList.filter(item => item.item_type === 5);

        // 요리 레시피 정보 추가
        this.cookingList.forEach((cookItem, index) => {
            cookItem.ingredients = scene.cookRecipes[index].ingredients;
        });

        console.log('요리 리스트 초기화', this.cookingList);

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

        // 버튼 텍스트 추가
        const cookingTxtX = cookingBtnX + this.cookingBtn.width / 2;
        const cookingTxtY = cookingBtnY + this.cookingBtn.height / 2;
        this.cookingTxt = scene.add.text(cookingTxtX, cookingTxtY, '요리하기', txtStyle);
        this.cookingTxt.setOrigin(0.5, 0.5);

        this.add([this.cookingBtn, this.cookingTxt]);


        // 요리 아이템 표시하게 아이템 슬롯 초기화
        this.itemSlots.forEach((itemSlot, index) => {

            // 선택한 요리 아이템 정보
            const selectItem = this.cookingList[index];

            // 요리 아이템 정보 구조 분해
            const { item_id, item_type, item_name,
                item_des, seed_time, use_level, item_price, ingredients } = selectItem;

            // 요리 아이템 소유 중인지 확인
            const ownItemSlot = scene.findAddItemSlot(item_name);

            // 요리 아이템 개수 설정
            if (ownItemSlot.item) {
                itemSlot.setItemCount(ownItemSlot.item.count);
            } else { // 없으면 0개로 표시
                itemSlot.setItemCount(0);
            }

            // 요리 아이템 이미지 설정
            itemSlot.setItemImg(item_name);
            itemSlot.itemImg.setScale(3.5);

            // 아이템 슬롯 클릭 리스너 설정
            itemSlot.on('pointerdown', (pointer) => {
                //console.log('요리 아이템 슬롯 클릭됨!');

                this.itemToolTip.setStoreToolTip(selectItem);
            });

        });

    }

    // 요리 아이템 표시하기 아이템 슬롯들 초기화 해야됨.
    // 아이템 목록 리스트가 필요하다.

}