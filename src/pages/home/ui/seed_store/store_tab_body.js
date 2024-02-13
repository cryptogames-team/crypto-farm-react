import Phaser from "phaser";
import Frame_LT from "../frame_lt";
import StoreItemSlot from "./store_item_slot";
import Frame from "../frame";
import ToolTip from "../tooltip";

const pad = 20;
// Ui 요소간의 간격
const space = 10;

export default class StoreTabBody extends Frame_LT {

    scene;

    categoryTxt;
    selectBox;

    itemSlots = [];
    itemToolTips;

    purchaseBtn;
    saleBtn;

    // 아이템 슬롯 행, 열 개수
    gridRow = 2;
    gridCol = 4;

    // 아이템 슬롯과 툴팁 나누는 경계선
    borderLine;

    constructor(scene, x, y, width, height) {

        super(scene, x, y, width, height, 0);

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
        this.categoryTxt = scene.add.text(categoryX, categoryY, '농작물 씨앗', txtStyle);

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

                const itemSlot = new StoreItemSlot(scene, slotX, slotY, slotSize, slotSize);

                this.add([itemSlot]);
                this.itemSlots.push(itemSlot);
            }
        }
        this.add([this.categoryTxt]);

        // 경계선 추가
        const borderX = slotStartX + slotSize * this.gridCol + slotSpace * (this.gridCol + 1);
        const borderY = this.edgeSize;
        /* this.borderLine = scene.add.image(borderX, borderY, 'tab_9slice_lc');
        this.borderLine.setOrigin(0,0).setDisplaySize(this.edgeSize, this.height - (this.edgeSize * 2));

        this.add([this.borderLine]); */

        // 아이템 정보 툴팁 추가 하기전에 위치 잡기
        const toolTipPad = 15;
        const toolTipX = slotStartX + slotSize * this.gridCol + slotSpace * (this.gridCol + 1);
        const toolTipY = toolTipPad;
        // 크기
        const toolTipWidth = this.width - toolTipPad - pad - slotSize * this.gridCol - slotSpace * (this.gridCol + 1);
        const toolTipheight = this.height - toolTipPad * 2;

        this.itemToolTips = new ToolTip(scene, toolTipX, toolTipY, toolTipWidth, toolTipheight);

        // 아이템 툴팁은 Frame_LT이네
        
        this.add([this.itemToolTips]);

        // 구매 버튼 추가하기 Frame 클래스로 일단 위치 크기 잡기
        // 제일 밑에 배치
        const btnPad = 10;
        const btnWidth = this.itemToolTips.width - btnPad * 2;
        const btnHeight = 50;
        const btnX = toolTipX + btnPad;
        const btnY = toolTipY + this.itemToolTips.height - btnHeight - btnPad;

        this.purchaseBtn = new Frame(scene, btnX, btnY, btnWidth, btnHeight );
        this.add([this.purchaseBtn]);

    }
}