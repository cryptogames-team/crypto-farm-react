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

    gridRow = 2;
    gridCol = 4;

    // 인벤토리 크기
    size = this.gridRow * this.gridCol;

    itemSlots = [];

    
    // 현재 마우스가 올려진 인벤토리 슬롯의 인덱스
    hoverIndex;
    // 마우스로 드래그가 시작된 인벤토리 슬롯의 인덱스
    startIndex;
    // 마우스로 드래그가 끝난 인벤토리 슬롯의 인덱스
    endIndex;


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
            .setScrollFactor(0).setInteractive().setDepth(1001);
        this.exitIcon.on('pointerup', (event) => this.disable());

        //scene.input.enableDebug(this.exitIcon);

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

                // 추가되는 아이템 슬롯의 인덱스 구하기
                // 1차원 배열의 요소들을 격자 형태로 나열해놨으니 그거 염두해서 인덱스 구해야 됨.
                // 하나 행마다 아이템 슬롯이 몇개 있는지 확인
                let slotIndex = this.gridCol * row + col;



                const itemSlot = new ItemSlot(scene, slotX, slotY, slotSize, slotSize, slotBGPad
                    , new Item('Crops', 'potato', '감자', 'potato_05'));

                // 디버그 그래픽 표시 보기 위해서 뎁스 설정
                itemSlot.setDepth(1001);
                itemSlot.index = slotIndex;


                // 아이템 슬롯에 상호작용 영역 설정하고 
                // 아이템 이미지 드래그 가능하게 하고 드래그하면 아이템 이미지가 움직이게 하기
                // 상호 작용 영역 명시적으로 설정
                itemSlot.setInteractive(new Phaser.Geom.Rectangle(70, 70, itemSlot.width, itemSlot.height),
                    Phaser.Geom.Rectangle.Contains);

                // 상호작용 영역이 꼭 같아야하나...?
                // 마우스 빠르게 움직이면 슬롯 인덱스를 못 가져온다.
                // 이벤트 전파를 관리하는 방식 조정?

                // 여러 상호작용이 가능한 객체들이 겹쳐있을 때 가장 상위에 있는 객체에만 이벤트를 전달한다.

                // 아이템 이미지 드래그 가능하게 변경
                itemSlot.itemImg.setInteractive(new Phaser.Geom.Rectangle(-5, -5, itemSlot.itemImg.width * 2, itemSlot.itemImg.height * 2),
                Phaser.Geom.Rectangle.Contains);

                //itemSlot.itemImg.setInteractive();

                scene.input.setDraggable(itemSlot.itemImg);
                itemSlot.itemImg
                .setDepth(1001)
                .setScrollFactor(0);

                // 상호작용 영역끼리 서로 간섭한다. 뎁스는 상관 없음.



                //상호작용 영역 보기
                scene.input.enableDebug(itemSlot);
                scene.input.enableDebug(itemSlot.itemImg);
                // 물리 바디 영역 보기
                //scene.physics.add.existing(itemSlot);

/*                 // Graphics 객체 생성
                // 디버그 영역 표시
                let graphics = scene.add.graphics();
                graphics.lineStyle(1, 0xff0000, 1.0); // 빨간색 선으로 설정
                // 게임 화면 상의 위치를 구하려면 인벤토리의 오리진에서 상대 위치를 더해야 한다.
                console.log("인벤의 게임화면 위치", this.x, this.y);
                // 아이템 슬롯 게임 화면 상의 원점 찍기
                graphics.fillStyle(0xff0000);
                graphics.fillCircle(this.x + itemSlot.x, this.y + itemSlot.y, 3).setDepth(1001).setScrollFactor(0);
                // 실제 영역 보기
                graphics.strokeRect(this.x + itemSlot.x, this.y + itemSlot.y, itemSlot.width, itemSlot.height)
                    .setDepth(1001).setScrollFactor(0); */



                // 마우스 오버
                itemSlot.on('pointerover', () => {

                    //console.log("아이템 슬롯 포인터 오버");
                    this.hoverIndex = itemSlot.index;
                    console.log("마우스 올린 슬롯의 인덱스 : ", this.hoverIndex);

                });
                // 마우스 오버 해제
                itemSlot.on('pointerout', () => {
                    //console.log("아이템 슬롯 포인터 아웃");
                });



                // 아이템 이미지 드래그
                itemSlot.itemImg.on("dragstart", (pointer) => {
                    this.startIndex = this.hoverIndex;
                    console.log("씬에서 드래그 시작 startIndex : " , this.startIndex);

                    // 아이템 슬롯의 이벤트 실행
                    itemSlot.emit('pointerover', pointer);
                });
fsdasdf
                // 드래그 위치 점으로 찍기
                let graphics = scene.add.graphics();
                graphics.fillStyle(0xff0000);

        // 디버그 텍스트 추가
        // 텍스트 스타일 객체
        const txtStyle = {
            fontFamily: 'Arial',
            fontSize: 30,
            backgroundColor: '#000000',
            align: 'center'
        };


            let dragText = scene.add.text(0, 0, 'dragXY', txtStyle);
            dragText.setScrollFactor(0).setOrigin(0,0).setDepth(100);

/*                 // 드래그 시작 이벤트
                itemSlot.on('dragstart', function (pointer) {
                    console.log("아이템 슬롯 드래그 시작");

                    graphics.clear();
                    graphics.fillStyle(0xff0000);
                    graphics.fillCircle(pointer.x, pointer.y , 3).setDepth(1001).setScrollFactor(0);
                }); */

                // 드래그 중 이벤트
                // pointer : 현재 활성화된 포인터 객체 <- 마우스 포인터
                // dragX : 드래그 중인 객체의 현재 x 위치
                // dragY : 드래그 중인 객체의 현재 y 위치
                // 절대 위치나 컨테이너에 있으면 상대 위치를 나타낸다.
/*                 itemSlot.on('drag', function (pointer, dragX, dragY) {
                    // 아이템의 위치를 마우스 포인터 위치로 업데이트
                    console.log("아이템 슬롯 드래그 중");

                    graphics.clear();
                    graphics.fillStyle(0xff0000);
                    graphics.fillCircle(dragX, dragY , 3).setDepth(1001);
                    graphics.fillCircle(pointer.x, pointer.y , 3).setDepth(1001).setScrollFactor(0);
                    dragText.setText('dragX : ' + dragX + '\n dragY : ' + dragY);

                    // 그냥 아이템 이미지만 생각대로 움직이면 됨.
                    // GameObject.getLocalPoint() : 전역 좌표를 게임 오브젝트의 로컬 좌표계료 변환한다.


                    // 마우스 포인터 위치(전역 좌표)를 아이템 오브젝트의 로컬 좌표계로 변환하기도 안됨.
                    let localPoint = this.itemImg.getLocalPoint(pointer.x, pointer.y);
                    dragText.setText('localX : ' + localPoint.x + '\n localY : ' + localPoint.y);

                    //this.itemImg.x = localPoint.x;
                    //this.itemImg.y = localPoint.y;


                    //this.itemImg.x = dragX;
                    //this.itemImg.y = dragY;

                    //this.itemImg.x = pointer.x;
                    //this.itemImg.y = pointer.y;


                    //this.x = dragX;
                    //this.y = dragY;
                });

                // 드래그 종료 이벤트
                itemSlot.on('dragend', function (pointer) {
                    // 드래그 종료 시 처리할 내용
                    // 예: 아이템의 새 위치 결정, 위치 교환, 인벤토리 데이터 업데이트 등
                    graphics.clear();
                    console.log("아이템 슬롯 드래그 종료");



                }); */
                this.add(itemSlot);
                this.itemSlots.push(itemSlot);
            }
        }

        // 드래깅
/*         scene.input.on("dragstart", (pointer) => {
            this.startIndex = this.hoverIndex;
            console.log("씬에서 드래그 시작 startIndex : " , this.startIndex);
        }); */

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