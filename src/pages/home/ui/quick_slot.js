import Phaser from "phaser";


const padding = 5;

export default class QuickSlot extends Phaser.GameObjects.Container {

    // 퀵슬롯 번호 텍스트
    slotNumberTxt;
    // 도구 아이콘 이미지
    toolIcon;
    // 현재 장착중인 슬롯을 나타내는 테두리 그리는 그래픽스 객체는 나중에 추가


    constructor(scene, x, y, slotNumber, toolIcon) {

        super(scene, x , y);

        this.slotNumber = slotNumber;

        // 씬의 디스플레이 목록에 추가하여 시각적으로 나타내게 한다.
        scene.add.existing(this);
        // UI 객체라서 물리 효과가 필요 없지만 테두리 확인할려고 추가
        scene.physics.add.existing(this);


        this.body.setSize(0,0);
        this.setDepth(100).setScrollFactor(0);

        //this.setDisplaySize(100);

        this.body.debugShowBody = true;


        // 퀵슬릇 번호 텍스트 추가하고 왼쪽 상단에 배치
        this.slotNumberTxt = scene.add.text(padding, padding, slotNumber, {
            fontFamily: 'Arial',
            fontSize: 30,
            color : 'black',
            fontStyle : 'bold'
        });
        this.slotNumberTxt.setDepth(100).setOrigin(0);

        // 도구 아이콘 추가하고 컨테이너에 중앙 배치
        this.toolIcon = scene.add.image(50, 50, toolIcon);
        this.toolIcon.setDisplaySize(60, 60);

        // 자식 게임 오브젝트들 컨테이너에 추가
        this.add(this.toolIcon);
        this.add(this.slotNumberTxt);
    }

}