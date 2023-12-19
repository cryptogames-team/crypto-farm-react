import Phaser from 'phaser';

// 캐릭터가 바라보고 있는 방향
let direction = "right";

// GameObjects.Container : 여러 게임 오브젝트(예: 스프라이트, 텍스트, 그래픽 등)를 
// 그룹화하고 하나의 단위로 관리할 수 있게 해주는 컨테이너
export default class PlayerObject extends Phaser.GameObjects.Container {

    // 생성자에 아무거나 보낼 수 있나?
    constructor(scene, x, y, sprites) {
        super(scene, x, y);
        this.sprites = sprites;

        //console.log(sprites);

        // 씬에 캐릭터 추가
        // 씬의 디스플레이 목록에 추가하여 시각적으로 나타내게 한다.
        scene.add.existing(this);
        // 씬의 물리 시스템에 추가하여 물리적 상호작용을 가능하게 한다.
        scene.physics.add.existing(this);

        // 물리
        // 중력 비활성화
        this.body.setGravity(0);
        // 충돌 크기 변경
        // Body가 Wolrd 경계와 충돌하는지 여부 설정
        this.body.setCollideWorldBounds(true);
        //this.body.setBounce(1);
        this.body.setSize(48, 48);
        // 자식 오브젝트들은 부모 컨테이너 depth 따라가나봄.
        this.setDepth(2);

        // Container에도 body가 있음
        // 기본 body size는 64,64px


        // 캐릭터 스프라이트 추가
        // 24px 만큼 이동시키면 컨테이너 바디랑 딱 일치함. 왜 그런지는 아직 모름
        // 컨테이너에 스프라이트를 추가할 때, 스프라이트 위치는 컨테이너 내에서 상대적 위치를 나타냄.
        // 컨테이너 내부의 스프라이트가 바디를 넘어가지 않게 상대 위치를 조정해야 한다.
        this.hairSprite = scene.add.sprite(24, 24, this.sprites.hair);
        this.hairSprite.setScale(3);
        this.bodySprite = scene.add.sprite(24, 24, this.sprites.body);
        this.bodySprite.setScale(3);
        this.handSprite = scene.add.sprite(24, 24, this.sprites.hand);
        this.handSprite.setScale(3);


        // 스프라이트를 컨테이너 자식에 추가하기
        this.add(this.bodySprite);
        this.add(this.hairSprite);
        this.add(this.handSprite);


    }


    update(cursors) {
        const speed = 150;


        // 대기 애니메이션 재생 - 나중에 조건 추가
        this.hairSprite.anims.play('idle_hair', true);
        this.bodySprite.anims.play('idle_body', true);
        this.handSprite.anims.play('idle_hand', true);


        // 왼쪽 이동
        if (cursors.left.isDown) {

            this.body.setVelocityX(-speed);
            this.flipSprites(true);
        } else if (cursors.right.isDown) {
            this.body.setVelocityX(speed);
            this.flipSprites(false);
        } else {
            this.body.setVelocityX(0);
        }

        if (cursors.up.isDown) { // 위로 이동
            this.body.setVelocityY(-speed);
        } else if (cursors.down.isDown) { // 아래로 이동
            this.body.setVelocityY(speed);
        } else {
            this.body.setVelocityY(0);
        }
    }

    // 좌우 이동할 때 스프라이트 반전시킴
    flipSprites(isFlipped) {
        this.bodySprite.setFlipX(isFlipped);
        this.hairSprite.setFlipX(isFlipped);
        this.handSprite.setFlipX(isFlipped);
    }



}
