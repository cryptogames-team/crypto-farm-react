import Phaser from "phaser";
import StoreItemSlot from "./seed_store/store_item_slot";
import ToolTip from "./tooltip";
import Frame from "./frame/frame";
import Frame_LT from "./frame/frame_lt";



const pad = 20;
const space = 10;

export default class TabBodyUI extends Frame_LT {

    scene;

    categoryTxt;

    itemSlots = [];
    itemToolTip;

    // 아이템 슬롯 행, 열 개수
    gridRow = 0;
    gridCol = 0;

    // 지금 선택중인 슬롯의 인덱스
    selectIndex;


    constructor(scene, x, y, width, height, gridRow, gridCol){

        super(scene, x, y, width, height, 0);

        this.gridRow = gridRow;
        this.gridCol = gridCol;

        // 카테고리 텍스트 추가
        const txtStyle = {
            fontFamily: 'DNFbitbitv2',
            fontSize: 18,
            color: 'black',
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

        this.add([this.categoryTxt, this.itemToolTip]);
    }

}