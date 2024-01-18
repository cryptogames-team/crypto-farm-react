import Phaser from "phaser";


const pad = 7;


export default class ItemSlot extends Phaser.GameObjects.Container {

    // 퀵슬롯으로 사용시 슬롯 번호 텍스트
    slotNumberTxt;
    // 퀵슬롯으로 사용 시 슬롯 번호
    slotNumber;
    // 아이템 슬롯의 타입 : 어느 UI의 슬롯인지 나타낸다.
    // 기본값 0 - 인벤토리
    type = 0;

    // 아이템 제목 <- 삭제 해야됨.
    itemTitle;
    // 아이템 이미지
    itemImg;
    // 아이템 슬롯 배경
    slotBG;
    // 아이템 수량 텍스트
    countTxt;
    // 아이템 수량
    count;
    // 아이템 이름 텍스트
    nameTxt;
    // 아이템 슬롯에 있는 아이템 객체
    item = null;


    // 아이템 슬롯의 높이와 길이
    width;
    height;
    // 배경 안쪽 사각형 패딩
    bgPad = 5;

    // 아이템 슬롯의 인벤토리나 퀵슬롯 내의 인덱스
    index;

    scene;

    // 퀵슬롯 크기 서버에서 인벤 인덱스는 9부터임
    quickSize = 9;

    // 아이템과 슬롯 번호에 디폴트 매개변수 적용
    // 아이템 슬롯, 빈 아이템 슬롯, 퀵슬롯, 빈 퀵슬롯으로 사용 가능함
    constructor(scene, x, y, width, height, bgPad = 5,
        item = null, slotNumber = null) {

        super(scene, x, y);


        this.setSize(width, height);
        this.setDepth(100).setScrollFactor(0);

        // 씬의 디스플레이 목록에 추가하여 시각적으로 나타내게 한다.
        scene.add.existing(this);

        this.slotNumber = slotNumber;
        this.bgPad = bgPad;
        // 슬롯의 길이 높이 설정
        this.width = width;
        this.height = height;
        this.scene = scene;

        //console.log("아이템 슬롯의 길이와 높이 : " , width, height);

        // 페이저는 HEX 색상 코드가 아니라 16진수 형식으로 받는다.
        // 아이템 슬롯 배경
        this.slotBG = scene.add.graphics();
        this.slotBG.fillStyle(0xB55001, 1);
        this.slotBG.fillRect(0, 0, width, height);
        this.slotBG.fillStyle(0xF5B667, 1);
        this.slotBG.fillRect(this.bgPad, this.bgPad,
            width - this.bgPad * 2, height - this.bgPad * 2);
        this.add([this.slotBG]);

        // 아이템 객체를 받아서 아이템 슬롯으로 사용 시
        if (item) {
            this.itemTitle = item.title;
            this.count = item.count;

            // 아이템 이미지 추가하고 슬롯 중앙에 배치
            this.itemImg = scene.add.sprite(width / 2, height / 2, item.imgKey);
            this.itemImg.setDisplaySize(width / 2, height / 2)


        }
        // 빈 아이템 슬롯으로 사용 시
        else {
            // 텍스트에 undefined 넣어도 되고 아무것도 안뜸.
            this.itemTitle = undefined;
            this.count = undefined;

            // 아이템 이미지 추가하고 슬롯 중앙에 배치
            this.itemImg = scene.add.sprite(width / 2, height / 2, null);
            this.itemImg.setDisplaySize(width / 2, height / 2)
                .setVisible(false);

        }


        let txtConfig = {
            fontFamily: 'serif',
            fontSize: 15,
            color: 'white',
            fontStyle: 'bold'
        };

        this.countTxt = scene.add.text(width - pad, pad, this.count,
            txtConfig);
        this.countTxt.setDepth(100).setOrigin(1, 0);

        txtConfig.color = 'black';
        txtConfig.fontSize = 15;
        // 아이템 이름 텍스트 추가하고 중앙 하단에 배치
        this.nameTxt = scene.add.text(width / 2, height - pad, this.itemTitle,
            txtConfig);
        this.nameTxt.setDepth(100).setOrigin(0.5, 1);

        this.add([this.countTxt, this.nameTxt, this.itemImg]);

        // 퀵슬롯 UI로 사용시
        if (this.slotNumber !== null) {
            //console.log("퀵슬롯 UI로 사용중");
            // 퀵슬릇 번호 텍스트 추가하고 왼쪽 상단에 배치
            txtConfig.fontSize = 20;
            txtConfig.color = 'black';
            this.slotNumberTxt = scene.add.text(pad, pad, slotNumber,
                txtConfig);
            this.slotNumberTxt.setDepth(100).setOrigin(0);
            this.add(this.slotNumberTxt);


            // 빈 퀵슬롯인지 확인
            if (item) {
                // 아이템 타입이 'Tool'이 아니면
                if (item.type !== 'Tool') {
                    // 아이템 수량 표시
                    this.countTxt.setText('50');
                }
            }
            this.type = 1;


        }

        // 아이템 슬롯에 상호작용 영역 설정
        this.setInteractive(new Phaser.Geom.Rectangle(this.width / 2, this.height / 2,
            this.width, this.height),
            Phaser.Geom.Rectangle.Contains);



        // 아이템 슬롯 이벤트 추가
        // 마우스 포인터오버
        // 마우스 오버하면 딱 한번만 호출됨
        this.on('pointerover', (pointer) => {

            //console.log("아이템 슬롯 포인터 오버");
            //this.hoverIndex = this.index;

            scene.hoverSlot = this;

            let slotInfo = {
                type: scene.hoverSlot.type,
                index: scene.hoverSlot.index
            };

            //console.log("마우스 올린 슬롯 정보 : ", slotInfo);

            // 마우스 올린 인벤 슬롯에 아이템이 존재하면 툴팁 띄우기
            // 드래그 중이 아니면 조건 추가
            if (scene.hoverSlot.item !== null && scene.isDragging === false) {

                // 인벤 슬롯일 경우
                if (scene.hoverSlot.type === 0) {
                    const toolTip = scene.inventory.toolTip;
                    const toolTipPad = 20;
                    // 상대 위치 구하기
                    const toolTipX = pointer.x - scene.inventory.x + toolTipPad;
                    const toolTipY = pointer.y - scene.inventory.y;

                    toolTip.setToolTip(scene.hoverSlot.item);
                    toolTip.setVisible(true);
                    toolTip.setPosition(toolTipX, toolTipY);
                }
                // 퀵슬롯일 경우
                else if (scene.hoverSlot.type === 1) {


                    const toolTip = scene.quickSlotUI.toolTip;

                    // 계속 호출해도 문제가 없나보네?
                    scene.quickSlotUI.remove(toolTip, false);
                    toolTip.setDepth(2000);

                    const toolTipPad = 20;
                    // 상대 위치 구하기
                    /* const toolTipX = pointer.x - scene.quickSlotUI.x + toolTipPad;
                    const toolTipY = pointer.y - scene.quickSlotUI.y - scene.quickSlotUI.toolTip.height; */

                    // 자식에서 해제되서 절대 위치 사용할 경우
                    const toolTipX = pointer.x + toolTipPad;
                    const toolTipY = pointer.y - scene.quickSlotUI.toolTip.height;

                    toolTip.setToolTip(scene.hoverSlot.item);
                    toolTip.setVisible(true);
                    toolTip.setPosition(toolTipX, toolTipY);
                }
            }

            scene.input.setTopOnly(false);

        });

        // 마우스가 움직일 때 마다 발생한다.
        // 신기하게 pointermove가 1회 호출되고 그 다음에 pointerover가 호출됨.
        this.on('pointermove', (pointer) => {

            scene.hoverSlot = this;

            //console.log("아이템 슬롯 안에서 마우스 움직이는 중");
            // 마우스 오버한 슬롯에 아이템이 있고 그 슬롯이 인벤 슬롯이고
            // 드래그 중이 아니면
            if (scene.hoverSlot.item !== null && scene.isDragging === false) {

                // 인벤 슬롯일 경우
                if (scene.hoverSlot.type === 0) {
                    const toolTip = scene.inventory.toolTip;
                    const toolTipPad = 20;
                    // 상대 위치 구하기
                    const toolTipX = pointer.x - scene.inventory.x + toolTipPad;
                    const toolTipY = pointer.y - scene.inventory.y;

                    toolTip.setToolTip(scene.hoverSlot.item);
                    toolTip.setVisible(true);
                    toolTip.setPosition(toolTipX, toolTipY);
                }
                // 퀵슬롯일 경우
                else if (scene.hoverSlot.type === 1) {

                    // 자식에서 해제할까

                    const toolTip = scene.quickSlotUI.toolTip;

                    // 계속 호출해도 문제가 없나보네?
                    scene.quickSlotUI.remove(toolTip, false);
                    toolTip.setDepth(2000);

                    const toolTipPad = 20;
                    // 상대 위치 구하기
                    /* const toolTipX = pointer.x - scene.quickSlotUI.x + toolTipPad;
                    const toolTipY = pointer.y - scene.quickSlotUI.y - scene.quickSlotUI.toolTip.height; */

                    // 자식에서 해제되서 절대 위치 사용할 경우
                    const toolTipX = pointer.x + toolTipPad;
                    const toolTipY = pointer.y - scene.quickSlotUI.toolTip.height;

                    toolTip.setToolTip(scene.hoverSlot.item);
                    toolTip.setVisible(true);
                    toolTip.setPosition(toolTipX, toolTipY);
                }
            }


        });

        // pointermove가 1회 호출되고 pointerout-> pointerover 순으로 호출된다.
        // 마우스 포인터 아웃
        this.on('pointerout', (pointer) => {

            //console.log("아이템 슬롯 포인터 아웃");
            //this.hoverIndex = null;

            scene.hoverSlot = null;

            scene.inventory.toolTip.setVisible(false);
            scene.quickSlotUI.toolTip.setVisible(false);

            scene.quickSlotUI.add(scene.quickSlotUI.toolTip);
            scene.quickSlotUI.toolTip.x = 0;
            scene.quickSlotUI.toolTip.y = 0;

        });

        // 아이템 슬롯 이미지 이벤트 추가
        // 슬롯 이미지 포인터 오버
        this.itemImg.on('pointerover', (pointer) => {
            scene.input.setTopOnly(false);
            //console.log("겹치는 오브젝트들 상호작용 가능함.");
        });

        // 슬롯 이미지 드래그 시작
        this.itemImg.on("dragstart", (pointer) => {
            // 마우스 올려둔 슬롯이 드래그 시작 슬롯이 됨
            scene.startSlot = scene.hoverSlot;

            let slotInfo = {
                type: scene.startSlot.type,
                index: scene.startSlot.index
            };

            //console.log("이미지 드래그 시작 슬롯 정보 : ", slotInfo);
            //console.log("드래그 시작한 슬롯의 아이템 정보 : ", scene.startSlot.item);

            // 일시적으로 컨테이너 자식에서 해제하고 depth 설정하기 
            this.remove(this.itemImg, false);
            this.setDepth(2000);

            // 아이템 드래그할 때 시작 슬롯의 텍스트 안보이게 하기
            this.nameTxt.setVisible(false);
            this.countTxt.setVisible(false);

            // 아이템 이미지가 이제 월드 위치를 사용함.
            this.itemImg.x = pointer.x;
            this.itemImg.y = pointer.y;

            // 툴팁 끄기
            const toolTip = scene.inventory.toolTip;
            toolTip.setVisible(false);

            scene.quickSlotUI.toolTip.setVisible(false);
            scene.quickSlotUI.add(scene.quickSlotUI.toolTip);
            scene.quickSlotUI.toolTip.x = 0;
            scene.quickSlotUI.toolTip.y = 0;

            scene.isDragging = true;
        });

        // 슬롯 이미지 드래그
        this.itemImg.on('drag', (pointer, dragX, dragY) => {

            // 아이템 이미지가 일시적으로 컨테이너의 자식에서 해제됐으니 월드 위치를 사용해야 한다.
            this.itemImg.x = pointer.x;
            this.itemImg.y = pointer.y;


        });

        // 슬롯 이미지 드래그 종료
        this.itemImg.on('dragend', (pointer) => {

            // 더 이상 멤버 슬롯 인덱스는 사용하지 않는다.

            // 드랍한 슬롯의 정보
            scene.endSlot = scene.hoverSlot;

            // 아이템 슬롯안에 드랍했는지 확인
            // 아이템 슬롯 바깥으로 마우스 포인터가 나가면 scene.endSlot === null
            if (scene.endSlot !== null) {

                let slotInfo = {
                    type: scene.endSlot.type,
                    index: scene.endSlot.index
                };



                //console.log("드랍한 슬롯의 정보", slotInfo);

                // 마우스 포인터가 위치한 슬롯의 아이템이 존재하는지 체크
                let isItemExist = false;
                scene.hoverSlot.item ? isItemExist = true : isItemExist = false;

                if (isItemExist) {
                    //console.log("드랍한 슬롯에 아이템이 존재함.");

                    // 드랍한 슬롯이 드래그 시작한 슬롯과 같지 않으면 아이템을 교체한다.
                    // 이 경우에는 동일한 객체 참조 여부를 검사해야되는건가?
                    if (scene.endSlot !== scene.startSlot) {
                        //console.log("시작 슬롯과 드랍 슬롯이 동일하지 않아서 아이템 교체");

                        // start -> end 이동 요청
                        this.sendMoveItem(scene.startSlot, scene.endSlot);
                        // end -> start 이동 요청
                        this.sendMoveItem(scene.endSlot, scene.startSlot);
                        // 아이템 교체
                        this.swapItem(scene.startSlot, scene.endSlot);



                    }
                    else {
                        //console.log("시작 슬롯과 드랍 슬롯이 동일함.");
                    }
                }
                else {

                    // 씬에게 아이템 이동 요청 서버에 보내달라고 한다.
                    this.sendMoveItem(scene.startSlot, scene.endSlot);

                    // 이동 요청 결과 안 기다리고 걍 옮겨
                    // 빈 슬롯으로 아이템 옮기기
                    this.moveItem(scene.startSlot, scene.endSlot);

                    // 툴팁 내용 재설정
                    scene.inventory.toolTip.setToolTip(scene.hoverSlot.item);
                    scene.quickSlotUI.toolTip.setToolTip(scene.hoverSlot.item);

                }

            }


            // 어떤 경우에도 아이템 이미지가 원래 있던 슬롯으로 복귀 해야한다.
            this.returnImg();

            // 텍스트 다시 보이게 하기
            this.nameTxt.setVisible(true);
            this.countTxt.setVisible(true);

            scene.isDragging = false;

        });

    }


    // 씬에게 아이템 이동 요청 서버에게 보내달라고 전달한다. 
    sendMoveItem(startSlot, endSlot) {

        const item_name = startSlot.item.name;

        // 아이템이 이동할 슬롯의 인덱스
        // 드랍한 슬롯의 타입에 따라 인덱스 값에 보정이 들가야된다.
        // 퀵슬롯이면 그대로 넣으면 되지만
        let move_index = endSlot.index;

        // 인벤이면 퀵슬롯 크기만큼 추가해서 9부터 시작해야 된다
        if (endSlot.type === 0) {
            move_index += this.quickSize;
        }

        // 아이템 이동 요청
        this.scene.serverMoveItem(item_name, move_index);

    }

    // 빈 아이템 슬롯에서 아이템 슬롯으로 변경될 때
    // 아이템 객체를 전달받아 아이템의 이미지, 수량, 제목을 표시한다.
    // 아이템 이미지가 상호작용 가능해진다.
    setSlotItem(item) {
        this.item = item;
        this.itemImg.setTexture(item.name).setVisible(true)
            .setDisplaySize(this.width / 2, this.height / 2);
        this.nameTxt.setText(item.name);

        // 아이템 타입이 4이면 수량 텍스트 표시 안함.
        if (item.type === 4)
            this.countTxt.setText(undefined);
        else
            this.countTxt.setText(item.count);

        // 아이템 이미지가 표시되니까 드래그 이벤트 설정

        // 아이템 이미지 상호작용 영역 설정
        this.itemImg.setInteractive(new Phaser.Geom.Rectangle(-this.itemImg.width / 2,
            -this.itemImg.height / 2, this.itemImg.width * 2, this.itemImg.height * 2),
            Phaser.Geom.Rectangle.Contains);

        /* this.itemImg.setInteractive(); */

        // 아이템 이미지 드래그 가능하게 설정
        this.scene.input.setDraggable(this.itemImg);
        this.itemImg.setScrollFactor(0);


        // 아이템 이미지 상호작용 영역 보기
        this.itemImg.setDepth(1500);

    }

    // 아이템 소비해서 수량 감소시키는 함수
    // 다 사용하면 슬롯에서 아이템 삭제함.
    // spend : 사용 개수
    useItem(spend) {

        let item = null;
        if (this.item) {
            item = this.item;
        }


        // 사용할 개수 만큼 수량이 남아 있는지 체크
        if (item.count >= spend) {
            // 사용 개수 만큼 수량 감소
            item.count -= spend;

            console.log('남은 아이템 수량 : ', item.count);

            // 수량 텍스트 업데이트
            this.countTxt.setText(item.count);

            // 아이템의 남은 수량이 없으면 삭제
            if (item.count <= 0)
                this.removeItem();

            return true;
        }

        // 사용할 개수만큼 수량이 남아 있지 않다면
        return false;

    }

    // 아이템 슬롯에서 빈 아이템 슬롯으로 변경한다.
    // 아이템 이미지 상호작용 해제해야 한다.
    removeItem() {
        this.item = null;
        this.itemImg.setTexture(null).setVisible(false);
        this.nameTxt.setText(null);
        this.countTxt.setText(null);

        this.itemImg.removeInteractive();
    }

    // 드래그 시작 슬롯과 드래그 종료 슬롯에 있는 아이템 서로 교체
    swapItem(startSlot, endSlot) {

        // 객체의 참조와 할당, 얕은 복사 깊은 복사
        // 변수에 객체를 참조하고 값을 변경하면 원본 객체 값도 변경되지만
        // 새로운 객체를 할당하면 기존 객체와 독립적인 참조가 된다.

        let hoverItem = JSON.parse(JSON.stringify(endSlot.item));

        console.log("드랍 슬롯의 원본 아이템 : ", hoverItem);
        console.log("시작 슬롯의 아이템 : ", startSlot.item);

        // 드랍 슬롯의 아이템을 드래그 시작 슬롯의 아이템으로 교체
        endSlot.item = Object.assign({}, startSlot.item);
        endSlot.itemImg.setTexture(endSlot.item.name)
            .setDisplaySize(endSlot.width / 2, endSlot.height / 2);
        endSlot.nameTxt.setText(endSlot.item.name);
        endSlot.countTxt.setText(endSlot.item.count);

        console.log("바뀐 후의 드랍 슬롯 아이템 : ", endSlot.item);

        // HitArea 변경으로 원본 텍스처가 달라져 크기가 변경되도
        // 이미지의 상호작용 영역 크기를 아이템 슬롯에 맞춤.
        endSlot.setImgHitArea();



        // 드래그 시작 슬롯의 아이템을 드랍 슬롯의 아이템으로 교체하기
        // 드랍 슬롯 아이템 객체의 복사본이 필요하다.
        // Js에서 클래스 객체를 대입하면 객체에 대한 참조가 전달된다.
        startSlot.item = hoverItem;
        startSlot.itemImg.setTexture(startSlot.item.name)
            .setDisplaySize(startSlot.width / 2, startSlot.height / 2);
        startSlot.nameTxt.setText(startSlot.item.name);
        startSlot.countTxt.setText(startSlot.item.count);

        startSlot.setImgHitArea();
    }

    // 빈 아이템 슬롯으로 아이템 옮기기
    moveItem(startSlot, endSlot) {



        endSlot.setSlotItem(startSlot.item);
        startSlot.removeItem();
    }

    // 아이템 이미지의 상호작용 영역을 슬롯 크기에 맞춘다.
    // 아이템 이미지 텍스처가 변경되었을 때 호출해야됨.
    setImgHitArea() {

        //console.log("setImgHitArea() 호출됨.");

        // 아이템 이미지의 크기와 길이
        let imgWidth = this.itemImg.width;
        let imgHeight = this.itemImg.height;

        // 아이템 이미지의 displaySize가 아이템 슬롯의 절반이니
        // 슬롯 크기에 맞출려면 시작점을 아이템 이미지 절반 크기만큼 빼고
        // 영역의 길이, 높이를 이미지 크기 2배만큼 줘야 슬롯 크기에 맞는다.
        this.itemImg.input.hitArea.setTo(-imgWidth / 2, -imgHeight / 2,
            imgWidth * 2, imgHeight * 2);

    }

    // 자식에서 해제한 이미지를 자식으로 다시 추가한다.
    returnImg() {
        this.add(this.itemImg);
        this.itemImg.x = this.width / 2;
        this.itemImg.y = this.height / 2;
    }


}