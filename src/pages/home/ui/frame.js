import Phaser from "phaser";


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

    constructor(scene, x, y, width, height) {

        super(scene,x, y);

        // 씬의 디스플레이 목록에 추가하여 시각적으로 나타내게 한다.
        scene.add.existing(this);
        // UI 객체라서 물리 효과가 필요 없지만 바디로 경계 확인할려고 추가
        //scene.physics.add.existing(this);


        this.setDepth(100).setScrollFactor(0);

        // 페이저는 HEX 색상 코드가 아니라 16진수 형식으로 받는다.

        
        this.edge=[]
        const edgeSize=10;
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

        this.headerLine = scene.add.image(7, 75, '9slice_tc')     
        .setOrigin(0, 0)
        .setDisplaySize(width+3-(edgeSize*2),edgeSize);


        // 크립토 옥션 제목
        this.headerText = scene.add.text(22, 22, "크립토 옥션", {
            fontFamily: 'Arial',
            font: '37px',
            color: 'black',
            fontStyle: 'bold'
        });


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

    


}