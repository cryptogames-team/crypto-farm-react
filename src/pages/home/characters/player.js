import Phaser from 'phaser';

export default class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);

        // 씬에 캐릭터 추가
        scene.add.existing(this);
        scene.physics.add.existing(this);

        // 캐릭터에 대한 물리 속성 설정
        this.setCollideWorldBounds(true);
    }

    update(cursors) {
        const speed = 200;

        if (cursors.left.isDown) {
            this.setVelocityX(-speed);
        } else if (cursors.right.isDown) {
            this.setVelocityX(speed);
        } else {
            this.setVelocityX(0);
        }

    }
}