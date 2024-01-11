import Phaser from "phaser";


const padding = 5;

export default class QuickSlot extends Phaser.GameObjects.Container {

    // 퀵슬롯 번호 텍스트
    slotNumberTxt;
    // 도구 아이콘 이미지
    toolIcon;
    // 퀵슬롯 배경
    slotBackground;

    // 퀵슬롯의 높이와 길이
    width;
    height;
    // 배경 패딩
    bgPadding = 3;

    constructor(scene, x, y, width, height, slotNumber, toolIcon) {

        super(scene, x, y);

        this.slotNumber = slotNumber;

        // 씬의 디스플레이 목록에 추가하여 시각적으로 나타내게 한다.
        scene.add.existing(this);
        // UI 객체라서 물리 효과가 필요 없지만 테두리 확인할려고 추가
        //scene.physics.add.existing(this);


        this.setDepth(100).setScrollFactor(0);

        //this.setDisplaySize(100);
        //this.body.debugShowBody = true;

        // 페이저는 HEX 색상 코드가 아니라 16진수 형식으로 받는다.
        // 퀵슬롯 배경
        this.slotBackground = scene.add.graphics();
        this.slotBackground.fillStyle(0xB55001, 1);
        this.slotBackground.fillRect(0, 0, width, height + 2);
        this.slotBackground.fillStyle(0xF5B667, 1);
        this.slotBackground.fillRect(this.bgPadding, this.bgPadding, 144, 144);

        // 퀵슬릇 번호 텍스트 추가하고 왼쪽 상단에 배치
        this.slotNumberTxt = scene.add.text(padding, padding, slotNumber, {
            fontFamily: 'Arial',
            fontSize: 30,
            color: 'black',
            fontStyle: 'bold'
        });
        this.slotNumberTxt.setDepth(100).setOrigin(0);

        // 도구 아이콘 추가하고 컨테이너에 중앙 배치
        this.toolIcon = scene.add.image(width / 2, height / 2, toolIcon);
        this.toolIcon.setDisplaySize(width * 0.75, height * 0.75);
        this.toolIcon.setScrollFactor(0);
        this.toolIcon.setSize(width / 2, height / 2);

        // 자식 게임 오브젝트들 컨테이너에 추가
        this.add([this.slotBackground,this.toolIcon,this.slotNumberTxt]);

    }

}