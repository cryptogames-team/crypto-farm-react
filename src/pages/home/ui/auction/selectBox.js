import Phaser from "phaser";

// 플레이어가 상호작용할 타일을 표시하거나 선택한 아이템을 표시하는 UI 박스
class SelectBox extends Phaser.GameObjects.Container {

    topLeft;
    topRight;
    bottomLeft;
    bottomRight;

    // scene : 박스 UI가 추가될 씬
    // x, y 박스 위치 시작점
    // width, height 박스의 길이와 높이
    // scale : 박스를 구성하는 UI들의 스케일
    constructor(scene, x, y, width, height, scale, depth) {
        super(scene, x, y);

        scene.add.existing(this);
        // 씬의 물리 시스템에 추가하여 물리적 상호작용을 가능하게 한다.
        // 디버그용
        //scene.physics.add.existing(this);

        this.setDepth(depth);

        // 사각형의 각 꼭짓점에 select box UI 추가
        this.topLeft = scene.add.image(0, 0, 'selectbox_tl');
        this.topLeft.setOrigin(0, 0).setScale(scale);

        this.topRight = scene.add.image(width, 0, 'selectbox_tr');
        this.topRight.setOrigin(1, 0).setScale(scale);

        this.bottomLeft = scene.add.image(0, height, 'selectbox_bl');
        this.bottomLeft.setOrigin(0, 1).setScale(scale);
        this.bottomRight = scene.add.image(width, height, 'selectbox_br');
        this.bottomRight.setOrigin(1, 1).setScale(scale);


        this.add([this.topLeft, this.topRight, this.bottomLeft, this.bottomRight]);
    }
}