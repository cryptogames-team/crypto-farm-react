import Phaser from "phaser";


<<<<<<< HEAD

export default class Frame extends Phaser.GameObjects.Container {

=======
// UI 틀 객체
export default class Frame extends Phaser.GameObjects.Container {

    //테두리
    topLeft;
    topCenter;
    topRight;

    centerLeft;
    center;
    centerRight;

    bottomLeft;
    bottomCenter;
    bottomRight;

    // 테두리 크기
    edgeSize;

>>>>>>> 54ebdb5310b53a4cb72326f44daee2c4e10c12a2
    constructor(scene, x, y, width, height) {

        super(scene,x, y);

        // 씬의 디스플레이 목록에 추가하여 시각적으로 나타내게 한다.
        scene.add.existing(this);
<<<<<<< HEAD
        // UI 객체라서 물리 효과가 필요 없지만 테두리 확인할려고 추가
=======
        // UI 객체라서 물리 효과가 필요 없지만 바디로 경계 확인할려고 추가
>>>>>>> 54ebdb5310b53a4cb72326f44daee2c4e10c12a2
        //scene.physics.add.existing(this);


        this.setDepth(100).setScrollFactor(0);

<<<<<<< HEAD
        // 페이저는 HEX 색상 코드가 아니라 16진수 형식으로 받는다.
        // 퀵슬롯 배경

        
        this.edge=[]
        const edgeSize=10;
=======
        
        const edgeSize=10;
        // 자식 클래스에서도 테두리 크기 변수 사용할려고 멤버 변수화 함.
        this.edgeSize = edgeSize;

>>>>>>> 54ebdb5310b53a4cb72326f44daee2c4e10c12a2
        //테두리 추가
        // 사각형의 각 꼭짓점에 select box UI 추가
        this.topLeft = scene.add.image(0, 0, '9slice_tl')
        .setOrigin(0, 0)
        .setDisplaySize(edgeSize,edgeSize);

        this.topCenter = scene.add.image(edgeSize, 0, '9slice_tc')     
        .setOrigin(0, 0)
        .setDisplaySize(width-(edgeSize*2),edgeSize);


        this.topRight = scene.add.image(width, 0, '9slice_tr')
        .setOrigin(1, 0)
        .setDisplaySize(edgeSize,edgeSize);
        

        
        this.centerLeft = scene.add.image(0, edgeSize, '9slice_lc')
        .setOrigin(0, 0)
        .setDisplaySize(edgeSize,height-(edgeSize*2));

        this.center = scene.add.image(edgeSize, edgeSize, '9slice_c')
        .setOrigin(0, 0)
        .setDisplaySize(width-(edgeSize*2),height-(edgeSize*2));

        this.centerRight = scene.add.image(width-edgeSize, edgeSize, '9slice_rc')
        .setOrigin(0, 0)
        .setDisplaySize(edgeSize,height-(edgeSize*2));



        this.bottomLeft = scene.add.image(0, height, '9slice_bl')
        .setOrigin(0, 1)
        .setDisplaySize(edgeSize,edgeSize);

        this.bottomCenter = scene.add.image(edgeSize, height, '9slice_bc')
        .setOrigin(0, 1)
        .setDisplaySize(width-(edgeSize*2),edgeSize);


        this.bottomRight = scene.add.image(width, height, '9slice_br')
        .setOrigin(1, 1)
        .setDisplaySize(edgeSize,edgeSize);

<<<<<<< HEAD
        

        // 자식 게임 오브젝트들 컨테이너에 추가
        this.add([
            this.topLeft,this.topCenter,this.topRight,
            this.centerLeft,this.center,this.centerRight,
            this.bottomLeft,this.bottomCenter,this.bottomRight,
        ])
        this.setDepth(1000);
    }

=======


        // 자식 게임 오브젝트들 컨테이너에 추가
        this.add([
            this.topLeft,
            this.topCenter,
            this.topRight,
            this.centerLeft,
            this.center,
            this.centerRight,
            this.bottomLeft,
            this.bottomCenter,
            this.bottomRight
        ])

        this.setDepth(1000);
    }

    

>>>>>>> 54ebdb5310b53a4cb72326f44daee2c4e10c12a2

}