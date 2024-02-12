import Phaser from "phaser";



export default class Frame_LT extends Phaser.GameObjects.Container {

    // 테두리 크기
    edgeSize;

    // 0일때 외부 박스, 1일때 탭으로 사용
    type = 0;

    constructor(scene, x, y, width, height, type = 0) {

        super(scene, x, y);

        // 씬의 디스플레이 목록에 추가하여 시각적으로 나타내게 한다.
        scene.add.existing(this);

        this.setDepth(100).setScrollFactor(0);

        // 페이저는 HEX 색상 코드가 아니라 16진수 형식으로 받는다.
        // 퀵슬롯 배경

        this.edge = [];
        const edgeSize = 10;
        this.edgeSize = edgeSize;
        this.type = type;


        if (type === 0) {
            //테두리 추가
            // 사각형의 각 꼭짓점에 select box UI 추가
            this.topLeft = scene.add.image(0, 0, 'tab_9slice_tl')
                .setOrigin(0, 0)
                .setDisplaySize(edgeSize, edgeSize);

            this.topCenter = scene.add.image(edgeSize, 0, 'tab_9slice_tc')
                .setOrigin(0, 0)
                .setDisplaySize(width - (edgeSize * 2), edgeSize);

            this.topRight = scene.add.image(width, 0, 'tab_9slice_tr')
                .setOrigin(1, 0)
                .setDisplaySize(edgeSize, edgeSize);

            this.centerLeft = scene.add.image(0, edgeSize, 'tab_9slice_lc')
                .setOrigin(0, 0)
                .setDisplaySize(edgeSize, height - (edgeSize * 2));

            this.center = scene.add.image(edgeSize, edgeSize, 'tab_9slice_c')
                .setOrigin(0, 0)
                .setDisplaySize(width - (edgeSize * 2), height - (edgeSize * 2));

            this.centerRight = scene.add.image(width - edgeSize, edgeSize, 'tab_9slice_rc')
                .setOrigin(0, 0)
                .setDisplaySize(edgeSize, height - (edgeSize * 2));

            this.bottomLeft = scene.add.image(0, height, 'tab_9slice_bl')
                .setOrigin(0, 1)
                .setDisplaySize(edgeSize, edgeSize);

            this.bottomCenter = scene.add.image(edgeSize, height, 'tab_9slice_bc')
                .setOrigin(0, 1)
                .setDisplaySize(width - (edgeSize * 2), edgeSize);

            this.bottomRight = scene.add.image(width, height, 'tab_9slice_br')
                .setOrigin(1, 1)
                .setDisplaySize(edgeSize, edgeSize);

            // 자식 게임 오브젝트들 컨테이너에 추가
            this.add([
                this.topLeft, this.topCenter, this.topRight,
                this.centerLeft, this.center, this.centerRight,
                this.bottomLeft, this.bottomCenter, this.bottomRight,
            ]);
        }
        else if (type === 1) {

            this.topLeft = scene.add.image(0, 0, 'tab_9slice_tl')
                .setOrigin(0, 0)
                .setDisplaySize(edgeSize, edgeSize);

            this.topCenter = scene.add.image(edgeSize, 0, 'tab_9slice_tc')
                .setOrigin(0, 0)
                .setDisplaySize(width - (edgeSize * 2), edgeSize);

            this.topRight = scene.add.image(width, 0, 'tab_9slice_tr')
                .setOrigin(1, 0)
                .setDisplaySize(edgeSize, edgeSize);

            this.centerLeft = scene.add.image(0, edgeSize, 'tab_9slice_lc')
                .setOrigin(0, 0)
                .setDisplaySize(edgeSize, height - (edgeSize * 2));

            this.center = scene.add.image(edgeSize, edgeSize, 'tab_9slice_c')
                .setOrigin(0, 0)
                .setDisplaySize(width - (edgeSize * 2), height - (edgeSize * 2));

            this.centerRight = scene.add.image(width - edgeSize, edgeSize, 'tab_9slice_rc')
                .setOrigin(0, 0)
                .setDisplaySize(edgeSize, height - (edgeSize * 2));

            this.bottomRight = scene.add.image(width , height, 'tab_9slice_bl')
                .setOrigin(1, 1)
                .setDisplaySize(edgeSize, edgeSize);

            this.add([
                this.topLeft, this.topCenter, this.topRight,
                this.centerLeft, this.center, this.centerRight,
                this.bottomRight
            ]);

        }

        this.setDepth(1000);
    }


    // 9분할 박스 UI 크기 변경
    setUISize(width, height) {
        //console.log('setUISize 호출됨.');

        const edgeSize = this.edgeSize;

        if (this.type === 0) {
            // top 부분은 height 필요 없음
            // topCenter, topRight
            this.topCenter.setDisplaySize(width - (edgeSize * 2), edgeSize);
            this.topRight.setPosition(width, 0);

            // center 부분 width, height 
            // centerLeft, center, centerRight
            this.centerLeft.setDisplaySize(edgeSize, height - (edgeSize * 2));
            this.center.setDisplaySize(width - (edgeSize * 2), height - (edgeSize * 2));
            this.centerRight.setPosition(width - edgeSize, edgeSize);
            this.centerRight.setDisplaySize(edgeSize, height - (edgeSize * 2));

            // bottom 부분 width, height
            this.bottomLeft.setPosition(0, height);
            this.bottomCenter.setPosition(edgeSize, height)
                .setDisplaySize(width - (edgeSize * 2), edgeSize);
            this.bottomRight.setPosition(width, height);
        }
    }

}