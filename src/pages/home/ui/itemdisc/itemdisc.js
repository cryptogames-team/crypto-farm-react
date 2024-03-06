import Phaser from "phaser"

export default class ItemDisc extends Phaser.GameObjects.Container {

    scene;

    // 배경 이미지
    itemDisc;
    
    constructor(scene, x, y, width, height){

        super(scene, x, y);

        // 씬의 디스플레이 목록에 추가하여 시각적으로 나타내게 한다.
        scene.add.existing(this);

        this.setDepth(100).setScrollFactor(0);
        this.setSize(width, height);


        this.itemDisc = scene.add.image(0, 0, 'itemdisc01')
        .setOrigin(0,0).setDisplaySize(width, height);

        this.add([this.itemDisc]);

    }

}