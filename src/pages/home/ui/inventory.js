import Phaser from "phaser";
import Frame from '../ui/frame';
import ItemSlot from "./item_slot";
import Item from "../elements/item";
import Frame_LT from "./frame_lt";
import ToolTip from "./tooltip";

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

    hi=5;

    // 인벤토리 시작 인덱스
    startIndex = 9;
    // 인벤토리 끝 인덱스
    endIndex = this.startIndex + this.size - 1;

    // 퀵슬롯 크기
    quickSize = 9;


    // 인벤토리의 아이템을 퀵슬롯에 드래그 앤 드랍 한 거 알아내는 법
    // 1. 인벤토리와 퀵슬롯은 같은 씬에 있음.
    // 2. 퀵슬롯에 마우스 오버하면 그 퀵슬롯의 인덱스를 알아내줌.
    // 인게임 씬에서 호버 인덱스 관리하기?
    // 호버, 시작, 끝 인덱스를 객체 타입으로 구조 변경
    // 어디의 몇번 인덱스라고 알려주면 됨.



    // 디버그 영역 그리는 그래픽스 객체
    graphics;

    scene;

    toolTip;

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


        this.add([this.headerLine, this.headerText, this.headerIcon, this.exitIcon]);


        // 인벤토리에 상호작용 영역 설정하기
        this.setInteractive(new Phaser.Geom.Rectangle(this.width / 2, this.height / 2,
            this.width, this.height),
            Phaser.Geom.Rectangle.Contains);


        // 겹치는 오브젝트 전체에게 이벤트 전송
        this.on('pointerover', (pointer) => {
            scene.input.setTopOnly(false);
            console.log("겹치는 오브젝트들 상호작용 가능함.");
        });

        // 퀵슬롯 컨테이너에서 마우스 해제하면 겹치는 대화형 오브젝트 중 가장 상위한테만 
        // 이벤트 전송
        this.on('pointerout', (pointer) => {

            if (!scene.isDragging) {
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


                // 디버그 그래픽 보기 위해서 뎁스 설정
                //itemSlot.setDepth(1001).setScrollFactor(0);
                //scene.input.enableDebug(itemSlot);


                // Phaser에선 겹치는 개체들 중에서 가장 상위 객체(마지막에 추가된 객체)에만 
                // 이벤트를 전달하는 기본동작을 가진다고 한다.

                // 아이템 슬롯 객체가 생성될 때 컨테이너가 만들어지고
                // 거기에 자식 객체들이 생성되고 추가되는 방식이라서 그런가 봄.


                this.add(itemSlot);
                this.itemSlots.push(itemSlot);

            }
        }

        this.initInventory(scene.own_items);

        // 아이템 툴팁 생성하기
        this.toolTip = new ToolTip(scene, 0 ,0, 250, 250);
        this.toolTip.setVisible(false);
        this.add(this.toolTip);

        

        // 하드 코딩으로 아이템 추가하기
        // 아이템 슬롯에 새 아이템이 추가될 때 마다 상호작용 설정한다.
        /* this.itemSlots[0].setSlotItem(new Item('Crops', 'potato', '감자', 'potato_05'));
        this.itemSlots[10].setSlotItem(new Item('Crops', 'carrot', '당근', 'carrot_05'));
        this.itemSlots[14].setSlotItem(new Item('Crops', 'cabbage', '양배추', 'cabbage_05')); */

    }

    // own_items : 서버에서 비동기로 받아오는 아이템 목록 배열. 
    // 서버에서 로드되기 전에 먼저 이 함수가 실행될 수 있음.
    initInventory(own_items) {

        own_items.forEach((own_item, index) => {

            const { item, item_count, item_index } = own_item;


            // 아이템 인덱스 범위가 9~35인지 확인하기
            if (item_index >= this.startIndex && item_index <= this.endIndex) {
                //console.log("아이템 인덱스가 0~8 안임" , item.item_index);

                //console.log("인벤에 들어갈 아이템 정보", item);
                const type = item.item_type;
                const id = item.item_id;
                const name = item.item_name;
                const des = item.item_des;
                const seedTime = item.seed_time;
                const useLevel = item.use_level;
                const price = item.item_price;
                const count = item_count;

                // 서버의 item_index는 퀵슬롯 인벤 구별하지 않음.
                // 0~8는 퀵슬롯에 할당되고 9부터 인벤에 할당되는거라서
                // 인벤에 아이템 들어갈 때 퀵슬롯 크기만큼 빼줘야 함.
                this.itemSlots[item_index - this.quickSize].setSlotItem(
                    new Item(item, count));
                    console.log(item)

                //console.log(this.quickSlots[item.item_index].item.type);
            }
        });

    }


    // 인벤토리에 빈 공간이 있는지 체크하고 빈 공간중에서 가장 낮은 인덱스 슬롯에 새 아이템 추가
    // 만약에 중복 아이템이 있으면 수량 증가
    addItem(item) {
        // 이미 itemSlots 배열에 아이템 슬롯 객체들이 들어가 있어서 push는 안통함.
        // 보통 인벤토리에 아이템이 추가될 때 공간이 남아 있다면 인덱스가 가장 낮은 쪽에 추가됨.


        // 중복 아이템이 있는지 찾고 없으면 빈 슬롯을 찾는다.



        // 빈 아이템 슬롯의 인덱스
        // 인벤토리에 빈 공간이 있는지 체크
        let emptyIndex = this.findEmptySlot();


        // 인벤토리에 빈 공간 없으면 추가 안함.
        if (emptyIndex === null) {
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
                    //itemSlot.item.quantity += 1;
                    //itemSlot.setSlotItem(itemSlot.item);
                    return true;
                } else {
                    return false;
                }
            }
        });

        // 먹은 아이템이 중복 아이템이 아니고 인벤토리에 공간이 있으면
        if (itemExist === false && emptyIndex !== null) {
            console.log("새 아이템 추가");
            this.itemSlots[emptyIndex].setSlotItem(item);
        }

    }

    // 인벤토리에 빈 공간이 있는지 체크하고 빈 공간 인덱스 리턴
    findEmptySlot() {

        // 새 아이템이 추가될 슬롯의 인덱스
        let emptySlot = null;

        // 인벤토리에 빈 공간이 있는지 체크
        const invenSpace = this.itemSlots.some((itemSlot, index) => {

            if (itemSlot.item === null) {

                // 서버에선 인벤토리 인덱스 시작이 9번부터임.
                const emptyIndex = index + this.quickSize;
                console.log("빈 아이템 슬롯 발견 슬롯 인덱스 : " + emptyIndex);

                emptySlot = itemSlot;
                return true;
            } else {
                return false;
            }
        });
        return emptySlot;
    }

    // 중복 아이템이 있는 아이템 슬롯 찾기
    // 지금은 인덱스 반환 중
    findDupSlot(itemName){

        // 중복 아이템이 있는 슬롯
        let dupSlot = null;

        // 얻은 아이템이 인벤토리에 이미 존재하는지 탐색
        const itemExist = this.itemSlots.some((itemSlot, index) => {

            // 빈 아이템 슬롯인지 체크
            if (itemSlot.item === null) {
                return false;
            } else {
                // 아이템 슬롯의 아이템 이름을 비교해서 중복되는 아이템을 먹었는지 확인.
                if (itemSlot.item.name === itemName) {

                    // 서버에서 인벤 인덱스 시작이 9부터임.
                    const dupIndex = index + this.quickSize;

                    console.log("인벤에서 중복 아이템 발견",itemSlot.item.name, itemName );
                    console.log("중복 아이템이 있는 슬롯 인덱스", dupIndex);

                    // 중복 아이템 있는 슬롯 찾음
                    dupSlot = itemSlot;
                    return true;
                } else {
                    return false;
                }
            }
        });

        return dupSlot;

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

    // 드래그 할 때 슬롯 자식에서 해제된 이미지를 다시 자식으로 되돌린다.
    returnImg(returnSlot, returnImg) {
        returnSlot.add(returnImg);
        returnImg.x = returnSlot.width / 2;
        returnImg.y = returnSlot.height / 2;
        //returnImg.setDepth(0);
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
