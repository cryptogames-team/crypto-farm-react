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
    gridCol = 9;

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


    // 인벤토리의 아이템을 퀵슬롯에 드래그 앤 드랍 한 거 알아내는 법
    // 1. 인벤토리와 퀵슬롯은 같은 씬에 있음.
    // 2. 퀵슬롯에 마우스 오버하면 그 퀵슬롯의 인덱스를 알아내줌.
    // 인게임 씬에서 호버 인덱스 관리하기?
    // 호버, 시작, 끝 인덱스를 객체 타입으로 구조 변경
    // 어디의 몇번 인덱스라고 알려주면 됨.



    // 디버그 영역 그리는 그래픽스 객체
    graphics;

    scene;

    constructor(scene, x, y, width, height) {

        super(scene, x, y, width, height);

        // 씬의 디스플레이 목록에 추가하여 시각적으로 나타내게 한다.
        scene.add.existing(this);

        this.scene = scene;

        this.setDepth(1000).setScrollFactor(0);
        this.setSize(width, height);

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


        // 인벤토리에 상호작용 영역 설정하기
        this.setInteractive(new Phaser.Geom.Rectangle(this.width / 2, this.height / 2,
            this.width, this.height),
            Phaser.Geom.Rectangle.Contains);
        // 디버그 영역 재설정
        this.scene.input.enableDebug(this);

        // 겹치는 오브젝트 전체에게 이벤트 전송
        this.on('pointerover', (pointer) => {
            scene.input.setTopOnly(false);
            console.log("겹치는 오브젝트들 상호작용 가능함.");
        });

        // 퀵슬롯 컨테이너에서 마우스 해제하면 겹치는 대화형 오브젝트 중 가장 상위한테만 
        // 이벤트 전송
        this.on('pointerout', (pointer) => {

            if(!scene.isDragging){
            scene.input.setTopOnly(true);
            console.log("겹치는 오브젝트들 상호작용 불가능함.");
            }
        });


        // 아이템 슬롯 추가
        const slotBGPad = 5;
        // 슬롯의 크기
        const slotSize = 100;
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


                itemSlot.index = slotIndex;

                // 아이템 슬롯에 상호작용 영역 설정
                itemSlot.setInteractive(new Phaser.Geom.Rectangle(itemSlot.width / 2, itemSlot.height / 2,
                 itemSlot.width, itemSlot.height),
                    Phaser.Geom.Rectangle.Contains);

                // 디버그 그래픽 보기 위해서 뎁스 설정
                itemSlot.setDepth(1001).setScrollFactor(0);
                //this.scene.input.enableDebug(itemSlot);

                // Phaser에선 겹치는 개체들 중에서 가장 상위 객체(마지막에 추가된 객체)에만 
                // 이벤트를 전달하는 기본동작을 가진다고 한다.

                // 아이템 슬롯 객체가 생성될 때 컨테이너가 만들어지고
                // 거기에 자식 객체들이 생성되고 추가되는 방식이라서 그런가 봄.


                // 아이템 슬롯 이벤트 추가
                // 아이템 슬롯 마우스 오버
                itemSlot.on('pointerover', (pointer) => {

                    //console.log("아이템 슬롯 포인터 오버");
                    this.hoverIndex = itemSlot.index;
                    //console.log("마우스 올린 슬롯의 인덱스 : ", this.hoverIndex);

                    scene.hoverSlot = itemSlot;

                    scene.input.setTopOnly(false);

                });
                // 포인터 아웃
                itemSlot.on('pointerout', (pointer) => {

                    //console.log("아이템 슬롯 포인터 아웃");
                    this.hoverIndex = null;

                    scene.hoverSlot = null;

                });

                // 아이템 슬롯 이미지 이벤트 추가
                itemSlot.itemImg.on('pointerover', (pointer) => {

                    scene.input.setTopOnly(false);
                    //console.log("겹치는 오브젝트들 상호작용 가능함.");
                });




                // 슬롯 이미지 드래그
                itemSlot.itemImg.on("dragstart", (pointer) => {
                    let itemImg = itemSlot.itemImg;

                    // 객체 참조 조심
                    scene.startSlot = scene.hoverSlot;

                    this.startIndex = this.hoverIndex;
                    console.log("아이템 이미지 드래그 시작 startIndex : ", this.startIndex);
                    console.log("드래그 시작한 슬롯의 아이템 정보 : ", this.itemSlots[this.startIndex].item);

                    // 일시적으로 컨테이너 자식에서 해제하고 depth 설정하기 
                    itemSlot.remove(itemImg, false);
                    itemImg.setDepth(2000);

                    
                    itemSlot.itemNameTxt.setVisible(false);
                    itemSlot.itemStackTxt.setVisible(false);


                    // 아이템 이미지가 일시적으로 컨테이너의 자식에서 해제됐으니 월드 위치를 사용해야 한다.
                    itemImg.x = pointer.x;
                    itemImg.y = pointer.y;

                    scene.isDragging = true;

                });

                // 슬롯 이미지 드래그
                // pointer : 현재 활성화된 포인터 객체 <- 마우스 포인터
                // dragX : 드래그 중인 객체의 현재 x 위치
                // dragY : 드래그 중인 객체의 현재 y 위치
                // 절대 위치나 컨테이너에 있으면 상대 위치를 나타낸다.
                itemSlot.itemImg.on("drag", (pointer, dragX, dragY) => {

                    let itemImg = itemSlot.itemImg;

                    // 아이템 이미지가 일시적으로 컨테이너의 자식에서 해제됐으니 월드 위치를 사용해야 한다.
                    //console.log("아이템 이미지 드래그 중");
                    itemImg.x = pointer.x;
                    itemImg.y = pointer.y;

                });

                // 슬롯 이미지 드래그 종료
                itemSlot.itemImg.on("dragend", (pointer) => {

                    let itemImg = itemSlot.itemImg;
                    let itemSlots = this.itemSlots;

                    this.endIndex = this.hoverIndex;
                    console.log("아이템 이미지 드래그 끝 endIndex : " + this.endIndex);

                    // 드랍한 슬롯의 정보
                    scene.endSlot = scene.hoverSlot;

                    // 아이템 슬롯에 드랍했는지 확인하기
                    if(scene.endSlot){
                    console.log("드랍한 슬롯의 정보 : " , scene.endSlot.type, scene.endSlot.index);

                    // 퀵슬롯에 아이템 옮기기 구현
                    if( scene.endSlot.type === 1){


                        if( scene.endSlot.item){
                            console.log("퀵슬롯에 인벤 아이템 넣음");

                            this.swapItem(scene.startSlot, scene.endSlot);
                        }
                        else{
                            console.log("빈 퀵슬롯에 인벤 아이템 넣음");


                            // 아이템 객체 참조만 정확하게 할당하면 됨.
                            scene.endSlot.setSlotItem(scene.startSlot.item);
                            scene.startSlot.removeItem();
                        }
                    }
                }


                    // 아이템 슬롯 안인지 밖인지 파악하기
                    // hoverIndex가 null이면 아이템 슬롯 바깥임
                    // 아이템 슬롯 바깥으로 포인터가 나가면 hoverIndex = null이 되게 설정했음.

                    // 아이템 슬롯 안에 넣었을 경우
                    if (this.hoverIndex !== null) {

                        // 드래그가 시작된 아이템 슬롯
                        let startSlot = itemSlots[this.startIndex];
                        // 드래그 종료시 마우스 포인터가 위치한 아이템 슬롯
                        let hoverSlot = itemSlots[this.hoverIndex];

                        // 마우스 포인터가 위치한 슬롯의 아이템이 존재하는지 체크한다.
                        let isItemExist = false;
                        hoverSlot.item ? isItemExist = true : isItemExist = false;

                        // 아이템이 존재하는 슬롯인지 체그한다.
                        if (isItemExist) {

                            // 드래그 앤 드랍한 슬롯이 드래그가 시작된 아이템 슬롯이면
                            if (this.startIndex === this.hoverIndex) {
                                // 원래 아이템 슬롯으로 복귀
                                this.returnImg(startSlot, itemImg);
                            }
                            else {

                                // 아이템 교체
                                // 드래그 시작 슬롯과 드래그 끝난 슬롯의 아이템이 바뀌어야 한다.
                                // 아이템 이미지는 원래대로 돌아가고 
                                // 슬롯의 아이템만 바뀌게 한다.
                                console.log("아이템 교체");
                                this.swapItem(startSlot, hoverSlot);
      
                            // 아이템 이미지는 원래 아이템 슬롯으로 복귀~
                            this.returnImg(itemSlot, itemImg);

                            }

                        }
                        // 빈 아이템 슬롯이면
                        else {

                            // 빈 슬롯으로 아이템이 옮겨진다.
                            hoverSlot.setSlotItem(startSlot.item);
                            startSlot.removeItem();

                            // 아이템 이미지는 원래 아이템 슬롯으로 복귀~
                            this.returnImg(itemSlot, itemImg);

                        }

                    }
                    // 아이템 슬롯이 아닌 곳에 넣었을 경우
                    else {
                        // 원래 아이템 슬롯으로 복귀~
                        this.returnImg(itemSlot, itemImg);
                    }

                    itemSlot.itemNameTxt.setVisible(true);
                    itemSlot.itemStackTxt.setVisible(true);

                });


                this.add(itemSlot);
                this.itemSlots.push(itemSlot);

                scene.isDragging = false;
            }
        }



        // 하드 코딩으로 아이템 추가하기
        // 아이템 슬롯에 새 아이템이 추가될 때 마다 상호작용 설정한다.
        this.itemSlots[0].setSlotItem(new Item('Crops', 'potato', '감자', 'potato_05'));
        this.itemSlots[10].setSlotItem(new Item('Crops', 'carrot', '당근', 'carrot_05'));
        this.itemSlots[14].setSlotItem(new Item('Crops', 'cabbage', '양배추', 'cabbage_05'));

    }

    // 드래그 할 때 슬롯 자식에서 해제된 이미지를 다시 자식으로 되돌린다.
    returnImg(returnSlot, returnImg){
        returnSlot.add(returnImg);
        returnImg.x = returnSlot.width / 2;
        returnImg.y = returnSlot.height / 2;
        //returnImg.setDepth(0);
    }



    // 드래그 시작 슬롯과 드래그 종료 슬롯에 있는 아이템을 서로 교체한다.
    swapItem(startSlot, endSlot){



        // 객체의 참조와 할당, 얕은 복사 깊은 복사
        // 변수에 객체를 참조하고 값을 변경하면 원본 객체 값도 변경되지만
        // 새로운 객체를 할당하면 기존 객체와 독립적인 참조가 된다.
       
        let hoverItem = JSON.parse(JSON.stringify(endSlot.item));

        console.log("드랍 슬롯의 원본 아이템 : ", hoverItem);
        console.log("시작 슬롯의 아이템 : ", startSlot.item);

        // 드랍 슬롯의 아이템을 드래그 시작 슬롯의 아이템으로 교체
        endSlot.item = Object.assign({}, startSlot.item);
        endSlot.itemImg.setTexture(endSlot.item.imgKey)
        .setDisplaySize(endSlot.width / 2, endSlot.height / 2);
        endSlot.itemNameTxt.setText(endSlot.item.title);
        endSlot.itemStackTxt.setText(endSlot.item.quantity);

        console.log("바뀐 후의 드랍 슬롯 아이템 : ", endSlot.item);

        // HitArea 변경으로 원본 텍스처가 달라져 크기가 변경되도
        // 이미지의 상호작용 영역 크기를 아이템 슬롯에 맞춤.
        endSlot.setImgHitArea();

        // 디버그 영역 재설정
        this.scene.input.enableDebug(endSlot.itemImg);


        // 드래그 시작 슬롯의 아이템을 드랍 슬롯의 아이템으로 교체하기
        // 드랍 슬롯 아이템 객체의 복사본이 필요하다.
        // Js에서 클래스 객체를 대입하면 객체에 대한 참조가 전달된다.
        startSlot.item = hoverItem;
        startSlot.itemImg.setTexture(startSlot.item.imgKey)
        .setDisplaySize(startSlot.width / 2, startSlot.height / 2);
        startSlot.itemNameTxt.setText(startSlot.item.title);
        startSlot.itemStackTxt.setText(startSlot.item.quantity);

        startSlot.setImgHitArea();

        // 디버그 영역 재설정
        this.scene.input.enableDebug(startSlot.itemImg);


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
        //this.scene.input.setTopOnly(false);
    }
    disable() {
        //console.log("인벤 닫음");
        this.setVisible(false);
        //this.scene.input.setTopOnly(true);
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