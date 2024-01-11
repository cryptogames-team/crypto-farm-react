import Phaser from "phaser";
import ItemSlot from "./item_slot";
import Item from "../elements/item";


// 퀵슬롯 UI
export default class QuickSlot extends Phaser.GameObjects.Container {


    row = 1;
    col = 9;

    // 퀵슬롯 개수
    size = this.row * this.col;

    // 퀵슬롯 크기 100x100
    slotSize = 100;


    // 퀵슬롯 배열
    quickSlots = [];

    // 현재 마우스 올려진 퀵슬롯의 인덱스
    hoverIndex = null;
    // 마우스로 드래그가 시작된 퀵슬롯의 인덱스
    startIndex;
    // 마우스로 드래그가 끝난 퀵슬롯의 인덱스
    endIndex;

    // 퀵슬롯 컨테이너의 길이와 크기
    //width;
    //height;

    constructor(scene, x, y) {

        super(scene, x, y);

        // 씬의 디스플레이 목록에 추가
        scene.add.existing(this);

        this.setDepth(100).setScrollFactor(0);


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

            // 개별 퀵슬롯에 상호작용 영역 설정
            quickSlot.setInteractive(new Phaser.Geom.Rectangle(quickSlot.width / 2, quickSlot.height / 2,
                quickSlot.width, quickSlot.height),
                Phaser.Geom.Rectangle.Contains);

            // 상호작용 영역 디버그 그래픽으로 표시
            quickSlot.setDepth(0).setScrollFactor(0);
            //scene.input.enableDebug(quickSlot);


            // 개별 퀵슬롯에 이벤트 리스너 추가
            quickSlot.on('pointerover', (pointer) => {
                this.hoverIndex = quickSlot.index;

                scene.hoverSlot = quickSlot;

                //console.log("마우스 올린 퀵슬롯의 인덱스 : ", this.hoverIndex);

                scene.input.setTopOnly(false);
                //console.log("겹치는 오브젝트들 상호작용 가능함.");
            });

            quickSlot.on('pointerout', (pointer) => {
                this.hoverIndex = null;
                //console.log("퀵슬롯 포인터 아웃");

                scene.hoverSlot = null;
            });


            // 퀵슬롯 아이템 이미지 이벤트 리스너 추가
            // 퀵슬롯 아이템 이미지에 마우스 올리면 겹치는 대화형 오브젝트 전부에게 이벤트 전송
            quickSlot.itemImg.on('pointerover', (pointer) => {

                scene.input.setTopOnly(false);
                //console.log("겹치는 오브젝트들 상호작용 가능함.");
            });

            // 여기도 예외 처리가 필요하네
            /* quickSlot.itemImg.on('pointerout', (pointer) => {
                scene.input.setTopOnly(true);
                console.log("겹치는 오브젝트들 상호작용 불가능함.");
            }); */

            // 드래그 이벤트 리스너
            quickSlot.itemImg.on('dragstart', (pointer) => {
                // 아이템 이미지 객체 참조
                let itemImg = quickSlot.itemImg;

                // 드래그 시작한 슬롯의 참조 씬에 저장한다.
                scene.startSlot = scene.hoverSlot;

                this.startIndex = this.hoverIndex;
                console.log("아이템 이미지 드래그 시작 startIndex : ", this.startIndex);
                console.log("드래그 시작한 슬롯의 아이템 정보 : ", this.quickSlots[this.startIndex].item);
                
                // 일시적으로 퀵슬롯 자식에서 해제
                quickSlot.remove(itemImg, false);
                itemImg.setDepth(2000);

                // 아이템 이미지가 일시적으로 컨테이너의 자식에서 해제됐으니 월드 위치를 사용해야 한다.
                itemImg.x = pointer.x;
                itemImg.y = pointer.y;

                quickSlot.itemNameTxt.setVisible(false);
                quickSlot.itemStackTxt.setVisible(false);

                scene.isDragging = true;
            });

            quickSlot.itemImg.on('drag', (pointer, dragX, dragY) => {
                // 아이템 이미지 객체 참조
                let itemImg = quickSlot.itemImg;

                itemImg.x = pointer.x;
                itemImg.y = pointer.y;

            });

            quickSlot.itemImg.on('dragend', (pointer) => {
                // 아이템 이미지 객체 참조
                let itemImg = quickSlot.itemImg;
                let quickSlots = this.quickSlots;

                this.endIndex = this.hoverIndex;
                console.log("아이템 이미지 드래그 끝 endIndex : " + this.endIndex);


                
                // 드랍한 슬롯의 정보
                scene.endSlot = scene.hoverSlot;

                if(scene.endSlot){
                // 인벤토리에 드랍 구현
                console.log("드랍한 슬롯의 정보 : " , scene.endSlot.type, scene.endSlot.index);

                if( scene.endSlot.type === 0){

                    if( scene.endSlot.item){
                        console.log("인벤에 퀵슬롯 아이템 넣음");

                        this.swapItem(scene.startSlot, scene.endSlot);
                    }
                    else{
                        console.log("빈 인벤 슬롯에 퀵슬롯 아이템 넣음");


                        // 아이템 객체 참조만 정확하게 할당하면 됨.
                        scene.endSlot.setSlotItem(scene.startSlot.item);
                        scene.startSlot.removeItem();
                    }
                }
            }

                if( this.hoverIndex !== null){
                    // 드래그가 시작된 아이템 슬롯
                    let startSlot = quickSlots[this.startIndex];
                    // 드래그 종료시 마우스 포인터가 위치한 아이템 슬롯
                    let hoverSlot = quickSlots[this.hoverIndex];

                    // 드래그 종료 슬롯의 아이템이 존재하는지 체크한다.
                    let isItemExist = false;
                    hoverSlot.item ? isItemExist = true : isItemExist = false;

                    if(isItemExist){
                        //console.log("퀵슬롯에 아이템이 존재함.");

                        if(this.startIndex !== this.hoverIndex)
                        {
                            //console.log("아이템 교체");
                            this.swapItem(startSlot, hoverSlot);
                        }
                    }
                    else{

                        //console.log("빈 퀵슬롯임.");
                        // 빈 슬롯으로 아이템이 옮겨진다.
                        hoverSlot.setSlotItem(startSlot.item);
                        startSlot.removeItem();
                    }

                }

                // 아이템 이미지는 원래 퀵슬롯으로 돌아간다.
                this.returnImg(quickSlot, itemImg);

                // 슬롯의 텍스트 다시 보여지게 하기
                quickSlot.itemNameTxt.setVisible(true);
                quickSlot.itemStackTxt.setVisible(true);

                scene.isDragging = false;

            });

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
            if(!scene.isDragging){
            scene.input.setTopOnly(true);
            console.log("겹치는 오브젝트들 상호작용 불가능함.");
            }
        });


        // 퀵슬롯 아이템 하드코딩으로 추가하기
        this.quickSlots[0].setSlotItem(new Item('Tool', 'shovel', '삽', 'shovel_icon'));
        this.quickSlots[3].setSlotItem(new Item('Tool', 'harvest', '수확하기', 'harvest_icon'));
        this.quickSlots[5].setSlotItem(new Item('Seed', 'potato_seed', '감자 씨앗', 'potato_00'));


        // 아이템 목록
        /* new Item('Tool', 'shovel', '삽', 'shovel_icon');
        new Item('Tool', 'harvest', '수확하기', 'harvest_icon');
        new Item('Tool', 'axe', '도끼', 'axe_icon');
        new Item('Tool', 'pickaxe', '곡괭이', 'pickaxe_icon');

        new Item('Seed', 'potato_seed', '감자 씨앗', 'potato_00');
        new Item('Seed', 'carrot_seed', '당근 씨앗', 'carrot_00');
        new Item('Seed', 'pumpkin_seed', '호박 씨앗', 'pumpkin_00');
        new Item('Seed', 'cabbage_seed', '양배추 씨앗', 'cabbage_00'); */
    }


    // 드래그 할 때 슬롯 자식에서 해제된 이미지를 다시 자식으로 되돌린다.
    returnImg(returnSlot, returnImg) {
        returnSlot.add(returnImg);
        returnImg.x = returnSlot.width / 2;
        returnImg.y = returnSlot.height / 2;
        //returnImg.setDepth(0);
    }

    // 드래그 시작 슬롯과 드래그 종료 슬롯에 있는 아이템을 서로 교체한다.
    swapItem(startSlot, endSlot) {

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

}