import Phaser from "phaser";
import Frame from '../ui/frame';


export default class Auction extends Frame {

    exitIcon;

    headerLine;
    headerText;
    enable()
    {
        this.setVisible(true);
    }
    disable() {

        this.setVisible(false);
    }
    constructor(scene, x, y, width, height) {

        super(scene, x, y, width, height);

        // 씬의 디스플레이 목록에 추가하여 시각적으로 나타내게 한다.
        scene.add.existing(this);

        this.setDepth(100).setScrollFactor(0);

        // 크립토 옥션 제목
        this.headerText = scene.add.text(22, 22, "크립토 옥션", {
            //fontFamily: 'Arial',
            font: '37px yeongdeokFont',
            color: 'black',
            fontStyle: 'bold'
        });

        //나가기 X버튼
        this.exitIcon = scene.add.image(width-19, 19, "exit_icon");
        this.exitIcon.setOrigin(1,0).setDisplaySize(40, 40).setScrollFactor(0).setInteractive();
        this.exitIcon.on('pointerup', (event) => this.disable());
        // 자식 게임 오브젝트들 컨테이너에 추가
        this.add([
            this.exitIcon,this.headerLine,this.headerText
        ])
        this.setDepth(1000);
    }

}