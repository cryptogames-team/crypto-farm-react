import Phaser from "phaser";
import StoreItemSlot from "../seed_store/store_item_slot";
import ToolTip from "../tooltip";
import Frame from "../frame";
import Frame_LT from "../frame_lt";



const pad = 20;
const space = 10;

export default class TabBodyUI extends Frame_LT {

    scene;
    // 부모 컨테이너 클래스 참조
    parentRef;

    type;
    categoryTxt;

    itemSlots = [];
    itemToolTip;

    // 아이템 슬롯 행, 열 개수
    gridRow = 2;
    gridCol = 4;

    // 지금 선택중인 슬롯의 인덱스
    selectIndex;

    // 나중에 분리해야될 요리 버튼
    cookingBtn;
    cookingTxt;

    constructor(scene, x, y, width, height, parentRef = null, type = 0){

        super(scene, x, y, width, height, 0);

        this.parentRef = parentRef;
        this.type = type;
        
        // 카테고리 텍스트 추가
        const txtStyle = {
            fontFamily: 'Arial',
            fontSize: 18,
            color: 'black',
            fontStyle: 'bold',
            align: 'center',
        };
        const categoryX = pad;
        const categoryY = pad;
        this.categoryTxt = scene.add.text(categoryX, categoryY, '카테고리', txtStyle);

        // 아이템 슬롯 추가
        const slotSize = 75;
        const slotStartX = categoryX;
        const slotStartY = pad + this.categoryTxt.height + space;
        const slotSpace = 10;

        for (let row = 0; row < this.gridRow; row++) {
            for (let col = 0; col < this.gridCol; col++) {
                // 각 슬롯의 위치
                let slotX = slotStartX + slotSize * col + slotSpace * col;
                let slotY = slotStartY + slotSize * row + slotSpace * row;

                let index = row * this.gridCol + col;

                const itemSlot = new StoreItemSlot(scene, slotX, slotY, slotSize, slotSize, index);
                itemSlot.setItemCount(0);


                this.add([itemSlot]);
                this.itemSlots.push(itemSlot);

            }
        }

        // 요리 아이템 정보 툴팁 추가
        const toolTipPad = 15;
        const toolTipX = slotStartX + slotSize * this.gridCol + slotSpace * (this.gridCol + 1);
        const toolTipY = toolTipPad;
        // 크기
        const toolTipWidth = this.width - toolTipPad - pad - slotSize * this.gridCol - slotSpace * (this.gridCol + 1);
        const toolTipheight = this.height - toolTipPad * 2;

        this.itemToolTip = new ToolTip(scene, toolTipX, toolTipY, toolTipWidth, toolTipheight);

        // 요리 버튼 추가 나중에 분리
        const btnPad = 10;
        const btnSpace = 5;
        const btnWidth = this.itemToolTip.width - btnPad * 2;
        const btnHeight = 45;

        const cookingBtnX = toolTipX + btnPad;
        const cookingBtnY = toolTipY + this.itemToolTip.height - btnHeight - btnPad;
        this.cookingBtn = new Frame(scene, cookingBtnX, cookingBtnY, btnWidth, btnHeight);

        // 버튼 텍스트 추가
        txtStyle.fontSize = 18;
        txtStyle.color = 'white';
        txtStyle.stroke = 'black';
        txtStyle.strokeThickness = 5;
        // 10개 거래 텍스트 추가
        const cookingTxtX = cookingBtnX + this.cookingBtn.width / 2;
        const cookingTxtY = cookingBtnY + this.cookingBtn.height / 2;
        this.cookingTxt = scene.add.text(cookingTxtX, cookingTxtY, '요리하기', txtStyle);
        this.cookingTxt.setOrigin(0.5, 0.5);

        this.add([this.categoryTxt, this.itemToolTip]);
        this.add([this.cookingBtn, this.cookingTxt]);

    }

}