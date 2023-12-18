import Phaser from 'phaser';


// 캐릭터가 바라보고 있는 방향
let direction = "right";

// export default : 이 클래스를 모듈의 기본 내보내기로 설정하여 다른 JS 파일에서 이 클래스 임포트 가능.
// Arcade.Sprite : Phaser에서 물리적 상호작용을 가지는 스프라이트 객체를 다루는데 사용
export default class Player extends Phaser.Physics.Arcade.Sprite {

    // 클래스의 생성자
    // scene : Player 객체가 속할 Phaser 씬
    // texture : Player 객체에 사용될 텍스처 또는 이미지의 키이다.
    // Phaser 로드 시스템에서 이 키를 통해 해당 이미지를 찾아 사용한다.
    constructor(scene, x, y, texture) {
        // super : 상속받은 클래스의 생성자를 호출한다. 
        // 이를 통해 Player 객체가 Aracde.Sprite로 정상적으로 작동하기 위한 필요한 초기화 작업 수행
        super(scene, x, y, texture);

        // 씬에 캐릭터 추가
        // 씬의 디스플레이 목록에 추가하여 시각적으로 나타내게 한다.
        scene.add.existing(this);
        // 씬의 물리 시스템에 추가하여 물리적 상호작용을 가능하게 한다.
        scene.physics.add.existing(this);

        // 중력 비활성화
        this.body.setGravity(0, 0);

        // 충돌 크기 변경
        this.setBodySize(16, 16);

        // 애니메이션 설정
        this.createAnimations(scene);
        // Body가 Wolrd 경계와 충돌하는지 여부 설정
        this.setCollideWorldBounds(true);


        this.setDepth(2);
        this.setScale(3);


        // 모든 스프라이트가 동일한 기준점을 공유하도록 해야한다.
    }

    createAnimations(scene) {


        // 전달받은 텍스처 키 확인하기
        //console.log("texture key : " + this.texture.key);


        // 초기 스프라이트와 body x,y 값 확인하기
        // 스프라이트와 body 위치가 다르다.
        //console.log("초기 스프라이트 위치", this.x, this.y);
        //console.log("초기 스프라이트 body 위치", this.body.x, this.body.y);

        // origin 값 확인하기
        //console.log("초기 스프라이트 기준", this.originX, this.originY);
        //console.log("초기 스프라이트 body 기준", this.body.offset);



        if (this.texture.key === 'player_idle') {

            // 새로운 애니메이션을 생성한다.
            scene.anims.create({
                // 애니메이션의 고유 이름 설정
                key: 'idle',
                // 애니메이션에 사용될 프레임을 정의한다.
                frames: scene.anims.generateFrameNumbers('player_idle', { start: 0, end: 8 }),
                // 애니메이션의 프레임 속도
                frameRate: 9,
                // 애니메이션의 반복 여부
                repeat: -1
            });

        } else if (this.texture.key === 'player_idle_hand') {

            scene.anims.create({
                // 애니메이션의 고유 이름 설정
                key: 'idle_hand',
                // 애니메이션에 사용될 프레임을 정의한다.
                frames: scene.anims.generateFrameNumbers('player_idle_hand', { start: 0, end: 8 }),
                // 애니메이션의 프레임 속도
                frameRate: 9,
                // 애니메이션의 반복 여부
                repeat: -1
            });

        } else if (this.texture.key === 'player_idle_hair') {

            scene.anims.create({
                // 애니메이션의 고유 이름 설정
                key: 'idle_hair',
                // 애니메이션에 사용될 프레임을 정의한다.
                frames: scene.anims.generateFrameNumbers('player_idle_hair', { start: 0, end: 8 }),
                // 애니메이션의 프레임 속도
                frameRate: 9,
                // 애니메이션의 반복 여부
                repeat: -1
            });

        }

    }

    update(cursors) {
        const speed = 150;

        if (this.texture.key === 'player_idle') {
            this.anims.play('idle', true);
        } else if (this.texture.key === 'player_idle_hand') {
            this.anims.play('idle_hand', true);
        } else if (this.texture.key === 'player_idle_hair') {
            this.anims.play('idle_hair', true);
        }

        // 왼쪽 방향키를 누르는 동안
        if (cursors.left.isDown) {

            this.setVelocityX(-speed);
            // 왼쪽을 바라봄.
            this.scaleX = -3;
            direction = "left";

            //console.log("스프라이트 위치", this.x, this.y);
            //console.log("스프라이트 body 위치", this.body.x, this.body.y);


           // console.log("왼쪽 이동 중 스프라이트 body offset", this.body.offset);

        } else if (cursors.right.isDown) {

            this.setVelocityX(speed);
            // 오른쪽을 바라봄
            this.scaleX = 3;
            direction = "right";
            //console.log("스프라이트 위치", this.x, this.y);
            //console.log("스프라이트 body 위치", this.body.x, this.body.y);

           // console.log("오른쪽 이동 중 스프라이트 body offset", this.body.offset);

        } else {
            this.setVelocityX(0);
        }

        if (cursors.up.isDown) { // 위로 이동
            this.setVelocityY(-speed);
        } else if (cursors.down.isDown) { // 아래로 이동
            this.setVelocityY(speed);
        } else {
            this.setVelocityY(0);
        }

        if (this.scaleX < 0) {
            // 스프라이트가 뒤집혔을 때
            // 오프셋 값을 바디의 크기만큼 추가하면 된다.
            this.body.offset.x = 56;
        }
        else{
            this.body.offset.x = 40;
        }


    }
}