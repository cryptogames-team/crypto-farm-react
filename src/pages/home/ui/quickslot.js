import Phaser from "phaser";
import ItemSlot from "./item_slot";
import Item from "../elements/item";


// 퀵슬롯 UI
export default class QuickSlot extends Phaser.GameObjects.Container {


    row = 1;
    col = 9;

    // 퀵슬롯 개수
    size = this.row * this.col;

    // 퀵슬롯 시작 인덱스
    startIndex = 0;

    // 퀵슬롯 끝 인덱스
    endIndex = this.size - 1;

    // 퀵슬롯 크기 100x100
    slotSize = 100;


    // 퀵슬롯 배열
    quickSlots = [];

    scene;

    // 퀵슬롯 컨테이너의 길이와 크기
    //width;
    //height;

    constructor(scene, x, y) {

        super(scene, x, y);

        // 씬의 디스플레이 목록에 추가
        scene.add.existing(this);

        this.setDepth(100).setScrollFactor(0);
        this.scene = scene;

        // 퀵슬롯 추가
        const slotBGPad = 5;
        // 슬롯의 크기
        const slotSize = 100;
        // 아이템 슬롯 격자 배치의 시작 위치
        const startX = 0;
        const startY = 0;
        // 슬롯간 간격
        const spacing = 0;

        // 퀵슬롯 생성
        for (let col = 0; col < this.col; col++) {

            // 퀵슬롯 위치 정할 때 퀵슬롯 컨테이너에서 상대 위치를 정하는 것임.

            // 각 퀵슬롯은 서로의 길이만큼만 떨어지면됨.
            const slotX = startX + slotSize * col + spacing;
            const slotY = startY;

            const slotNumber = col + 1;

            let quickSlot = new ItemSlot(scene, slotX, slotY,
                slotSize, slotSize, slotBGPad, null, slotNumber);

            // 퀵슬롯마다 인덱스 부여
            quickSlot.index = col;


            // 상호작용 영역 디버그 그래픽으로 표시
            /* quickSlot.setDepth(100).setScrollFactor(0);
            scene.input.enableDebug(quickSlot); */


            // 생성된 퀵슬롯을 퀵슬롯 컨테이너에 자식으로 추가한다.
            this.quickSlots.push(quickSlot);
            this.add(quickSlot);

        }

        // 생성된 퀵슬롯 개수 바탕으로 퀵슬롯 컨테이너 크기 명시적으로 설정
        this.setSize(slotSize * this.col, slotSize);

        // 퀵슬롯 컨테이너 상호작용 영역 설정
        this.setInteractive(new Phaser.Geom.Rectangle(this.width / 2, this.height / 2,
            this.width, this.height),
            Phaser.Geom.Rectangle.Contains);



        // 개별 퀵슬롯이나 퀵슬롯 아이템 이미지에 가려진다.
        // setTopOnly(false) 트리거를 개별 퀵슬롯이나 퀵슬롯 아이템 이미지에 설정한다.

        // 퀵슬롯 컨테이너에서 마우스 해제하면 겹치는 대화형 오브젝트 중 가장 상위한테만 
        // 이벤트 전송
        this.on('pointerout', (pointer) => {
            // 드래그 중이 아닐때만
            if (!scene.isDragging) {
                scene.input.setTopOnly(true);
                console.log("겹치는 오브젝트들 상호작용 불가능함.");
            }
        });


        // 서버에서 받아온 소유 아이템들을 퀵슬롯에 추가하여 퀵슬롯 초기화
        this.initQuick(scene.own_items);

        // 퀵슬롯 아이템 하드코딩으로 추가하기
        /* this.quickSlots[0].setSlotItem(new Item('Tool', 'shovel', '삽', 'shovel_icon'));
        this.quickSlots[1].setSlotItem(new Item('Tool', 'harvest', '수확하기', 'harvest_icon'));
        this.quickSlots[2].setSlotItem(new Item('Tool', 'axe', '도끼', 'axe_icon'));
        this.quickSlots[3].setSlotItem(new Item('Tool', 'pickaxe', '곡괭이', 'pickaxe_icon'));
        this.quickSlots[4].setSlotItem(new Item('Seed', 'potato_seed', '감자 씨앗', 'potato_00', 4));
        this.quickSlots[5].setSlotItem(new Item('Seed', 'carrot_seed', '당근 씨앗', 'carrot_00', 1));
        this.quickSlots[6].setSlotItem(new Item('Seed', 'pumpkin_seed', '호박 씨앗', 'pumpkin_00', 2));
        this.quickSlots[7].setSlotItem(new Item('Seed', 'cabbage_seed', '양배추 씨앗', 'cabbage_00',3 )); */

    }


    // own_items 서버에서 비동기로 가져오잖아 
    // 로드 완료하기전에 initQuick 실행되서 그런듯
    // 서버에서 받아온 소유 아이템들을 퀵슬롯에 추가하기
    initQuick(own_items) {

        own_items.forEach((own_item, index) => {
            // 구조 분해 할당 
            const { item, item_count, item_index } = own_item;


            // 아이템 인덱스 범위가 0~8인지 확인하기
            if (item_index >= this.startIndex && item_index <= this.endIndex) {
                //console.log("아이템 인덱스가 0~8 안임" , item.item_index);
                console.log("퀵슬롯에 들어갈 아이템 정보", item);

                const type = item.item_type;
                const id = item.item_id;
                const name = item.item_name;
                const count = item_count;

                this.quickSlots[item_index].setSlotItem(new Item(type, id, name, count));

                //console.log(this.quickSlots[item.item_index].item.type);
            }
        });

    }

    // 퀵슬롯에 중복 아이템이 있는지 확인한다.
    // 있으면 아이템 수량 증가 시킴.
    findDupItem(item) {
        // 얻은 아이템이 인벤토리에 이미 존재하는지 탐색
        const itemExist = this.quickSlots.some((itemSlot, index) => {

            // 빈 아이템 슬롯인지 체크
            if (itemSlot.item === null) {
                return false;
            } else {
                // 아이템 슬롯의 아이템의 타입과 이름을 비교해서 중복되는 아이템을 먹었는지 확인.
                if (itemSlot.item.type === item.type && itemSlot.item.name === item.name) {

                    console.log("퀵슬롯에 중복 아이템 발견 수량 증가");
                    // 중복 아이템의 수량 증가
                    itemSlot.item.count += 1;
                    itemSlot.setSlotItem(itemSlot.item);
                    return true;
                } else {
                    return false;
                }
            }
        });

        return itemExist;
    }

    // 퀵슬롯에 중복 아이템이 있는지 확인하고
    // 있으면 그 아이템 수량 증가 시켜달라고 서버에 요청하고
    // 성공하면 클라이언트 아이템 개수 증가시킨다.
    newfindDupItem(itemName) {

        // 얻은 아이템이 인벤토리에 이미 존재하는지 탐색
        const itemExist = this.quickSlots.some((itemSlot, index) => {

            // 빈 아이템 슬롯인지 체크
            if (itemSlot.item === null) {
                return false;
            } else {
                // 아이템 슬롯의 아이템의  이름을 비교해서 중복되는 아이템을 먹었는지 확인.
                if (itemSlot.item.name === itemName) {

                    console.log("퀵슬롯에 중복 아이템 발견 수량 증가");

                    // 아이템 클래스에 id가 없음.
                    // 크롭 클래스에도 추가해야되나?

                    // 아이템 정보 기반으로 농작물 객체 생성하나?

                    this.scene.serverAddItem(itemSlot.item.id, 1, 
                        index);

                    return true;
                } else {

                    return false;
                }
            }
        });

    }


    // 드래그 할 때 슬롯 자식에서 해제된 이미지를 다시 자식으로 되돌린다.
    returnImg(returnSlot, returnImg) {
        returnSlot.add(returnImg);
        returnImg.x = returnSlot.width / 2;
        returnImg.y = returnSlot.height / 2;
        //returnImg.setDepth(0);
    }


}