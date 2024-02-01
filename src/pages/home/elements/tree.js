import Phaser from 'phaser';

const scale = 4;
const depth = 3;

// 타일 하나의 크기
const tileSize = 64;

// 타일의 중앙 위치
const tileCenterX = tileSize / 2;
const tileCenterY = tileSize / 2;


export default class Tree extends Phaser.GameObjects.Container {


    scene;

    state = 'tree';
    // 벌목된 시간
    loggingTime
    // 재생성되는 시간
    respawnTime = null;
    // 재생성까지 남은 시간(초)
    remainTime = null;
    treeSprite;
    // 나무의 내구도
    hp = 2;

    constructor(scene, x, y){
        super(scene, x ,y);

        this.scene = scene;

        this.setSize(tileSize * 2, tileSize * 2);
        this.setDepth(depth);

        // 씬의 디스플레이 목록에 추가하여 시각적으로 나타내게 한다.
        scene.add.existing(this);
        // 씬의 물리 시스템에 추가하여 물리적 상호작용을 가능하게 한다.
        //scene.physics.add.existing(this);
        



        // 스프라이트 시트 적용
        this.treeSprite = scene.physics.add.sprite(0,0, 'tree1');
        const bodyWidth = tileSize * 2 / scale;
        const bodyHeight = tileSize * 2 / scale;
        this.treeSprite.setScale(scale);
        // body size는 scale이나 displaySize에 영향받음
        // 스케일이나 디스플레이 사이즈 비율을 적용하면 된다.
        // setSize : cetner 매개변수 - 바디의 오프셋을 조정함. 
        // true - 바디의 중앙을 스프라이트 중앙에 위치시킨다.
        this.treeSprite.setOrigin(0, 0).body.setSize(bodyWidth, bodyHeight, false);


        

        this.add([this.treeSprite]);

    }


    // 도끼질 당할 때 반응하는 함수
    chopTree(){

        /* this.scene.tweens.add({
            targets: this,
            rotation: Phaser.Math.DegToRad(5), // 오른쪽으로 약간 회전 (도: degree)
            ease: 'Sine.easeInOut', // 부드러운 흔들림을 위한 이징
            duration: 100, // 흔들림의 지속 시간
            yoyo: true, // 애니메이션을 역방향으로 재생 (원래 상태로 돌아옴)
            repeat: 3, // 흔들림 반복 횟수
            onStart: function () { this.rotation = Phaser.Math.DegToRad(-5); } // 왼쪽으로 약간 회전하고 시작
        }); */

    }

 
}
