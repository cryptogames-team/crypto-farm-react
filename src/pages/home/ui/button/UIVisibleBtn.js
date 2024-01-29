import Phaser from "phaser";
import ItemDisc from "../itemdisc/itemdisc";


// 특정 UI 표시 토글 버튼
// 지금은 농작물 성장 진행도, 남은 시간 텍스트가 포함됨.
export default class UIVisibleBtn extends ItemDisc {


    uiBar;

    // 특정 UI들의 보임 여부 설정
    // 초기값 : true
    uiVisible = true;

    constructor(scene, x, y, width, height) {

        super(scene, x, y, width, height);

        // 씬의 디스플레이 목록에 추가하여 시각적으로 나타내게 한다.
        scene.add.existing(this);

        this.uiBar = scene.add.image(this.width / 2, this.height / 2, 'greenbar04')
            .setDisplaySize(this.width - 20, 20);

        // 상호작용 가능하게 변경
        // hitArea : inputConfiguration 객체도 받음
        this.setInteractive(
            new Phaser.Geom.Rectangle(this.width / 2, this.height / 2, this.width, this.height),
            Phaser.Geom.Rectangle.Contains);

        //scene.input.enableDebug(this);

        // 마우스 오버하면 포인터 모양 변경
        this.on('pointerover', (pointer) => {
            document.body.style.cursor = 'pointer';
        });

        this.on('pointerout', (pointer) => {
            document.body.style.cursor = 'default';
        });


        // 클릭 이벤트 설정하기
        this.on('pointerdown', () => this.toggleUIVisible());

        // 컨테이너에 이미지 추가하기
        this.add([this.uiBar]);
    }

    // 특정 UI들 보임 여부 설정
    toggleUIVisible() {
        console.log("toggleUIVisible 호출됨");

        switch (this.uiVisible) {

            // UI 표시
            case true:
                this.scene.crops.forEach((crop, index) => {
                    crop.progressText.setVisible(false);
                    crop.progressBar.setVisible(false);
                });

                this.uiBar.setTexture('redbar04');
                this.uiVisible = false;
                break;
            // UI 표시 안함
            case false:
                this.scene.crops.forEach((crop, index) => {

                    // 성장 완료된 농작물은 UI 표시 안한다.
                    if (crop.state !== 'harvest') {
                        crop.progressText.setVisible(true);
                        crop.progressBar.setVisible(true);
                    }

                });

                this.uiBar.setTexture('greenbar04');
                this.uiVisible = true;
                break;
        }

    }


}