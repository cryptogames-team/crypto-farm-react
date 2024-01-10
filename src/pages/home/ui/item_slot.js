import Phaser from "phaser";


const pad = 7;

export default class ItemSlot extends Phaser.GameObjects.Container {

    // 퀵슬롯으로 사용시 슬롯 번호 텍스트
    slotNumberTxt;
    // 퀵슬롯으로 사용 시 슬롯 번호
    slotNumber;

    // 아이템 제목
    itemTitle;
    // 아이템 이미지
    itemImg;
    // 아이템 슬롯 배경
    slotBG;
    // 아이템 수량 텍스트
    itemStackTxt;
    // 아이템 수량
    itemQuantity;
    // 아이템 이름 텍스트
    itemNameTxt;
    // 아이템 슬롯에 있는 아이템 객체
    item = null;


    // 아이템 슬롯의 높이와 길이
    width;
    height;
    // 배경 안쪽 사각형 패딩
    bgPad = 5;

    // 아이템 슬롯의 인벤토리 내의 인덱스
    index;

    scene;

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
            this.itemQuantity = item.quantity;

            // 아이템 이미지 추가하고 슬롯 중앙에 배치
            this.itemImg = scene.add.sprite(width / 2, height / 2, item.imgKey);
            this.itemImg.setDisplaySize(width / 2, height / 2)
            

        }
        // 빈 아이템 슬롯으로 사용 시
        else {
            // 텍스트에 undefined 넣어도 되고 아무것도 안뜸.
            this.itemTitle = undefined;
            this.itemQuantity = undefined;

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

        this.itemStackTxt = scene.add.text(width - pad, pad, this.itemQuantity,
            txtConfig);
        this.itemStackTxt.setDepth(100).setOrigin(1, 0);

        txtConfig.color = 'black';
        txtConfig.fontSize = 15;
        // 아이템 이름 텍스트 추가하고 중앙 하단에 배치
        this.itemNameTxt = scene.add.text(width / 2, height - pad, this.itemTitle,
            txtConfig);
        this.itemNameTxt.setDepth(100).setOrigin(0.5, 1);

        this.add([this.itemStackTxt, this.itemNameTxt, this.itemImg]);

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

            // 아이템 타입이 'Tool'이 아니면
            if (item.type !== 'Tool') {
                // 아이템 수량 표시
                this.itemStackTxt.setText('50');
            }

        }

    
    }


    // 빈 아이템 슬롯에서 아이템 슬롯으로 변경될 때
    // 아이템 객체를 전달받아 아이템의 이미지, 수량, 제목을 표시한다.
    // 아이템 이미지가 상호작용 가능해진다.
    setSlotItem(item) {
        this.item = item;
        this.itemImg.setTexture(item.imgKey).setVisible(true)
            .setDisplaySize(this.width / 2, this.height / 2);
        this.itemNameTxt.setText(item.title);
        this.itemStackTxt.setText(item.quantity);

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
        this.scene.input.enableDebug(this.itemImg);


    }

    // 아이템 슬롯에서 빈 아이템 슬롯으로 변경한다.
    // 아이템 이미지 상호작용 해제해야 한다.
    removeItem() {
        this.item = null;
        this.itemImg.setTexture(null).setVisible(false);
        this.itemNameTxt.setText(null);
        this.itemStackTxt.setText(null);

        this.itemImg.removeInteractive();
    }

    // 아이템 이미지의 상호작용 영역을 슬롯 크기에 맞춘다.
    // 아이템 이미지 텍스처가 변경되었을 때 호출해야됨.
    setImgHitArea(){

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



    // 빈 퀵슬롯에서 퀵슬롯으로 변경될 때
    // 아이템 객체를 전달 받는다.
    setQuickSlotItem() {

    }

}