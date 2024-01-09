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

    // 아이템 슬롯 행, 열 개수
    gridRow = 3;
    gridCol = 5;

    // 인벤토리 크기
    size = this.gridRow * this.gridCol;

    // 아이템 슬롯 배열
    itemSlots = [];


    // 현재 마우스가 올려진 인벤토리 슬롯의 인덱스
    hoverIndex = null;
    // 마우스로 드래그가 시작된 인벤토리 슬롯의 인덱스
    startIndex;
    // 마우스로 드래그가 끝난 인벤토리 슬롯의 인덱스
    endIndex;


    // 디버그 영역 그리는 그래픽스 객체
    graphics;

    scene;

    constructor(scene, x, y, width, height) {

        super(scene, x, y, width, height);

        // 씬의 디스플레이 목록에 추가하여 시각적으로 나타내게 한다.
        scene.add.existing(this);

        this.scene = scene;

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
            .setScrollFactor(0).setInteractive().setDepth(1001);
        this.exitIcon.on('pointerup', (event) => this.disable());

        //scene.input.enableDebug(this.exitIcon);

        this.add([this.headerLine, this.headerText, this.headerIcon, this.exitIcon]);


        // 아이템 슬롯 추가

        const slotBGPad = 5;
        // 슬롯의 크기
        const slotSize = 140;
        // 아이템 슬롯 격자 배치의 시작 위치
        const slotStartX = 40;
        const slotStartY = 125;
        // 슬롯간 간격
        const slotSpacing = 0;


        // 2중 반복문을 사용하여 여러 줄 추가
        // 행을 먼저 추가하고 열을 추가한다

        for (let row = 0; row < this.gridRow; row++) {
            for (let col = 0; col < this.gridCol; col++) {

                // 인벤토리 종횡비 2:1

                // 시작 위치 + 슬롯 길이 + 슬롯 간격
                let slotX = slotStartX + slotSize * col + slotSpacing * col;
                let slotY = slotStartY + slotSize * row + slotSpacing / 2 * row;

                // 추가되는 아이템 슬롯의 인덱스 구하기
                // 1차원 배열의 요소들을 격자 형태로 나열해놨으니 그거 염두해서 인덱스 구해야 됨.
                // 하나 행마다 아이템 슬롯이 몇개 있는지 확인
                let slotIndex = this.gridCol * row + col;



                const itemSlot = new ItemSlot(scene, slotX, slotY, slotSize, slotSize, slotBGPad);


                // new Item('Crops', 'potato', '감자', 'potato_05')
                // 디버그 그래픽 표시 보기 위해서 뎁스 설정
                //itemSlot.setDepth(1001);
                itemSlot.index = slotIndex;

                // 아이템 슬롯에 상호작용 영역 설정
                itemSlot.setInteractive(new Phaser.Geom.Rectangle(70, 70, itemSlot.width, itemSlot.height),
                    Phaser.Geom.Rectangle.Contains);

                itemSlot.setDepth(1001).setScrollFactor(0);

                this.scene.input.enableDebug(itemSlot);

                // Phaser에선 겹치는 개체들 중에서 가장 상위 객체(마지막에 추가된 객체)에만 
                // 이벤트를 전달하는 기본동작을 가진다고 한다.

                // 아이템 슬롯 객체가 생성될 때 컨테이너가 만들어지고
                // 거기에 자식 객체들이 생성되고 추가되는 방식이라서 그런가 봄.


                // 아이템 슬롯 마우스 오버
                itemSlot.on('pointerover', (pointer) => {

                    //console.log("아이템 슬롯 포인터 오버");
                    this.hoverIndex = itemSlot.index;
                    console.log("마우스 올린 슬롯의 인덱스 : ", this.hoverIndex);

                });
                // 포인터 아웃
                itemSlot.on('pointerout', (pointer) => {

                    console.log("아이템 슬롯 포인터 아웃");
                    this.hoverIndex = null;

                });

                // 슬롯 이미지 마우스 오버
                /* itemSlot.itemImg.on('pointerover', (pointer) => {
                    console.log("슬롯 이미지 포인터 오버");
                    //itemSlot.emit('pointerover', pointer);
                }); */

                // 슬롯 이미지 드래그
                itemSlot.itemImg.on("dragstart", (pointer) => {
                    let itemImg = itemSlot.itemImg;

                    this.startIndex = this.hoverIndex;
                    console.log("아이템 이미지 드래그 시작 startIndex : ", this.startIndex);

                    // 일시적으로 컨테이너 자식에서 해제하고 depth 설정하기 
                    itemSlot.remove(itemImg, false);
                    itemSlot.setDepth(2000);

                    // 아이템 이미지가 일시적으로 컨테이너의 자식에서 해제됐으니 월드 위치를 사용해야 한다.
                    itemImg.x = pointer.x;
                    itemImg.y = pointer.y;

                });

                // 컨테이너 클래스의 자식 게임 오브젝트들은 setdepth에 영향 받지 않는다.
                // bringToTop and sendToBack 사용


                // 슬롯 이미지 드래그
                // pointer : 현재 활성화된 포인터 객체 <- 마우스 포인터
                // dragX : 드래그 중인 객체의 현재 x 위치
                // dragY : 드래그 중인 객체의 현재 y 위치
                // 절대 위치나 컨테이너에 있으면 상대 위치를 나타낸다.
                itemSlot.itemImg.on("drag", (pointer, dragX, dragY) => {

                    let itemImg = itemSlot.itemImg;


                    // 아이템 이미지가 일시적으로 컨테이너의 자식에서 해제됐으니 월드 위치를 사용해야 한다.
                    console.log("아이템 이미지 드래그 중");
                    itemImg.x = pointer.x;
                    itemImg.y = pointer.y;

                });

                // 슬롯 이미지 드래그 종료
                itemSlot.itemImg.on("dragend", (pointer) => {

                    let itemImg = itemSlot.itemImg;

                    this.endIndex = this.hoverIndex;
                    console.log("아이템 이미지 드래그 끝 endIndex : " + this.endIndex);

                    // 아이템 슬롯 안인지 밖인지 파악하기
                    // hoverIndex가 undefined나 null이면 아이템 슬롯 바깥임
                    // 아이템 슬롯 바깥으로 포인터가 나가면 hoverIndex = null이 되게 설정했음.

                    // 원래 아이템 슬롯으로 복귀~
                    itemSlot.add(itemImg);
                    itemImg.x = itemSlot.width / 2;
                    itemImg.y = itemSlot.height / 2;
                });


                this.add(itemSlot);
                this.itemSlots.push(itemSlot);
            }
        }



        // 아이템 슬롯에 새 아이템이 추가될 때 마다 상호작용 설정한다.
        this.itemSlots[0].setSlotItem(new Item('Crops', 'potato', '감자', 'potato_05'));
        this.itemSlots[10].setSlotItem(new Item('Crops', 'potato', '감자', 'potato_05'));

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
        // setTopOnly : 여러 대화형 오브젝트가 겹쳐져 있는 경우 입력 이벤트를 어떻게 처리할 지 결정한다.
        // true : 가장 상위의 오브젝트에 대해서만 입력 이벤트를 처리함.
        // false : 겹쳐 있는 모든 대화형 오브젝트가 이벤트를 받을 수 있음.
        this.scene.input.setTopOnly(false);
    }
    disable() {
        //console.log("인벤 닫음");
        this.setVisible(false);
        this.scene.input.setTopOnly(true);
    }

    // 디버그 영역 표시
    drawDebugArea(x, y, width, height) {

        let graphics = this.graphics;
        let scene = this.scene;

        if (!graphics) {
            graphics = scene.add.graphics();
            //console.log("그래픽스 객체 생성");
        }

        // 빨간색 선
        graphics.lineStyle(1, 0xff0000, 1.0);
        // 디버그 영역을 빈 사각형으로 표시한다.
        graphics.strokeRect(x, y, width, height)
            .setDepth(1001).setScrollFactor(0);
        // 점 찍고 싶으면 사용
        /* graphics.fillStyle(0xff0000);
        graphics.fillCircle(this.x + itemSlot.x, this.y + itemSlot.y, 3).setDepth(1001).setScrollFactor(0); */

    }

    drawDebugTxt() {
        // 디버그 텍스트 추가
        // 텍스트 스타일 객체
        const txtStyle = {
            fontFamily: 'Arial',
            fontSize: 30,
            backgroundColor: '#000000',
            align: 'center'
        };

        let dragText = this.scene.add.text(0, 0, 'dragXY', txtStyle);
        dragText.setScrollFactor(0).setOrigin(0, 0).setDepth(100);
    }


}