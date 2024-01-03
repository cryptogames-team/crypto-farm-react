import Phaser from "phaser";


const padding = 7;

export default class ItemSlot extends Phaser.GameObjects.Container {

    // 퀵슬롯으로 사용시 슬롯 번호 텍스트
    slotNumberTxt;
    // 퀵슬롯으로 사용 시 슬롯 번호
    slotNumber;

    // 아이템 제목
    itemTitleTxt;
    // 아이템 이미지
    itemImg;
    // 아이템 슬롯 배경
    slotBackground;
    // 아이템 스택 수 텍스트
    itemstackTxt;

    // 아이템 슬롯의 높이와 길이
    width;
    height;
    // 배경 패딩
    bgPadding = 3;



    // 슬롯 번호에 디폴트 매개변수 적용
    constructor(scene, x, y, width, height, item, slotNumber = undefined) {

        super(scene, x, y);

        this.slotNumber = slotNumber;
        this.itemTitleTxt = item.title;

        // 씬의 디스플레이 목록에 추가하여 시각적으로 나타내게 한다.
        scene.add.existing(this);
        // UI 객체라서 물리 효과가 필요 없지만 테두리 확인할려고 추가
        //scene.physics.add.existing(this);


        this.setSize(width, height).setDepth(100).setScrollFactor(0);

        //this.setDisplaySize(100);
        //this.body.debugShowBody = true;

        // 페이저는 HEX 색상 코드가 아니라 16진수 형식으로 받는다.
        // 아이템 슬롯 배경
        this.slotBackground = scene.add.graphics();
        this.slotBackground.fillStyle(0xB55001, 1);
        this.slotBackground.fillRect(0, 0, width, height + 2);
        this.slotBackground.fillStyle(0xF5B667, 1);
        this.slotBackground.fillRect(this.bgPadding, this.bgPadding, 144, 144);

        this.add([this.slotBackground]);

        // 퀵슬롯 UI로 사용시
        if( this.slotNumber !== undefined){

            console.log("퀵슬롯 UI로 사용중");
        // 퀵슬릇 번호 텍스트 추가하고 왼쪽 상단에 배치
        this.slotNumberTxt = scene.add.text(padding, padding, slotNumber, {
            fontFamily: 'Arial',
            fontSize: 30,
            color: 'black',
            fontStyle: 'bold'
        });
        this.slotNumberTxt.setDepth(100).setOrigin(0);
        this.add(this.slotNumberTxt)
        }

        // 아이템 이름 텍스트 추가하고 중앙 하단에 배치
        this.itemNameTxt = scene.add.text(width / 2, height - padding, this.itemTitleTxt, {
            fontFamily: 'Arial',
            fontSize: 20,
            color: 'black',
            fontStyle: 'bold'
        });
        this.itemNameTxt.setDepth(100).setOrigin(0.5 , 1);

        // 아이템 스택 수 텍스트 추가하고 오른쪽 상단에 배치
        this.itemstackTxt = scene.add.text(width - padding, padding, '50', {
            fontFamily: 'Arial',
            fontSize: 20,
            color: 'white',
            fontStyle: 'bold'
        });
        this.itemstackTxt.setDepth(100).setOrigin(1 , 0);

        // 도구 아이콘 추가하고 컨테이너에 중앙 배치
        this.itemImg = scene.add.image(width / 2, height / 2, item.imgKey);
        this.itemImg.setDisplaySize(width * 0.5, height * 0.5);

        // 자식 게임 오브젝트들 컨테이너에 추가
        this.add([this.itemImg,
        this.itemNameTxt,
        this.itemstackTxt
    ]);

    // 퀵슬롯 UI로 사용 시
    

    }

}