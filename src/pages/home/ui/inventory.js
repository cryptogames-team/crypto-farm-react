import Phaser from "phaser";
import Frame from '../ui/frame';
import ItemSlot from "./item_slot";
import Item from "../elements/item";

// 패딩
const pad = 19;

export default class Inventory extends Frame {

    exitIcon;

    // 경계선
    headerLine;
    // UI 제목
    headerText;
    // UI 아이콘
    headerIcon;

    // 인벤토리 크기
    size = 15;

    gridRow = 3;
    gridCol = 8;

    itemSlots = [];


    constructor(scene, x, y, width, height) {

        super(scene, x, y, width, height);

        // 씬의 디스플레이 목록에 추가하여 시각적으로 나타내게 한다.
        scene.add.existing(this);

        this.setDepth(1000).setScrollFactor(0);

        this.headerLine = scene.add.image(7, 75, '9slice_tc')
            .setOrigin(0, 0)
            .setDisplaySize(width + 3 - (this.edgeSize * 2), this.edgeSize).setDepth(500);

        const imgSize = 40;

        this.headerIcon = scene.add.image(pad, pad, 'inven_icon')
            .setOrigin(0, 0).setDisplaySize(imgSize, imgSize);

        // UI 제목
        // font 속성 쓰니 글씨가 짤린다 -> fontSize로 변경
        this.headerText = scene.add.text(pad + imgSize + 10, pad, "인벤토리", {
            fontFamily: 'Arial',
            fontSize: 40,
            color: 'black',
            fontStyle: 'bold'
        });

        //나가기 X버튼
        this.exitIcon = scene.add.image(width - pad, pad, "exit_icon");
        this.exitIcon.setOrigin(1, 0).setDisplaySize(imgSize, imgSize)
            .setScrollFactor(0).setInteractive();
        this.exitIcon.on('pointerup', (event) => this.disable());

        this.add([this.headerLine, this.headerText, this.headerIcon, this.exitIcon]);


        // 아이템 슬롯 추가

        const slotBGPad = 5;
        const slotSize = 140;
        const slotPadX = 40;
        const slotPadY = 125;
        const slotStartX = 0;
        const slotStartY = 0;
        // 슬롯간 간격
        const slotSpace = 0;
        // (20, 90)


        // 2중 반복문을 사용하여 여러 줄 추가
        // 행을 먼저 추가하고 열을 추가한다

        for (let row = 0; row < this.gridRow; row++) {
            for (let col = 0; col < this.gridCol; col++) {

                // 인벤토리 종횡비 2:1

                // 패딩 + 슬롯 길이 + 슬롯 간격
                let slotX = slotPadX + slotSize * col + slotSpace * col;
                let slotY = slotPadY + slotSize * row + slotSpace / 2 * row;

                const itemSlot = new ItemSlot(scene, slotX, slotY, slotSize, slotSize, slotBGPad);
                this.add(itemSlot);
                this.itemSlots.push(itemSlot);
            }
        }
    }

    // 인벤토리의 아이템 슬롯에 새 아이템 추가
    addItem(item) {
        // 이미 itemSlots 배열에 아이템 슬롯 객체들이 들어가 있어서 push는 안통함.
        // 보통 인벤토리에 아이템이 추가될 때 공간이 남아 있다면 인덱스가 가장 낮은 쪽에 추가됨.

        // 빈 아이템 슬롯의 인덱스
        let emptyIndex = null;

        // 인벤토리에 빈 공간이 있는지 체크
        const invenSpace = this.itemSlots.some((itemSlot, index) => {

            if (itemSlot.item === null) {
                console.log("빈 아이템 슬롯 발견 슬롯 인덱스 : " + index);
                emptyIndex = index;
                return true;
            } else {
                return false;
            }
        });

        // 인벤토리에 빈 공간 없으면 추가 안함.
        if (!invenSpace) {
            console.log("인벤토리가 꽉 차서 새 아이템 추가 불가");
        }

        // 얻은 아이템이 인벤토리에 이미 존재하는지 탐색
        const itemExist = this.itemSlots.some((itemSlot, index) => {

            // 빈 아이템 슬롯인지 체크
            if (itemSlot.item === null) {
                return false;
            } else {
                // 아이템 슬롯의 아이템의 타입과 이름을 비교해서 중복되는 아이템을 먹었는지 확인.
                if (itemSlot.item.type === item.type && itemSlot.item.name === item.name) {

                    console.log("중복 아이템 발견 수량 증가");
                    // 중복 아이템의 수량 증가
                    itemSlot.item.quantity += 1;
                    itemSlot.setSlotItem(itemSlot.item);
                    return true;
                } else {
                    return false;
                }
            }
        });

        // 먹은 아이템이 중복 아이템이 아니고 인벤토리에 공간이 있으면
        if (itemExist === false && invenSpace) {
            console.log("새 아이템 추가");
            this.itemSlots[emptyIndex].setSlotItem(item);
        }

    }

    enable() {
        this.setVisible(true);
    }
    disable() {

        //console.log("인벤 닫음");
        this.setVisible(false);
    }


}