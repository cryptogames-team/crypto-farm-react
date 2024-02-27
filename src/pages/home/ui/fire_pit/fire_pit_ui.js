import Phaser from "phaser";
import Frame from "../frame";
import Frame_LT from "../frame_lt";
import TabBodyUI from "../tab_body_ui";
import CookingTab from "./cooking_tab";


export default class FirePitUI extends Frame {

    scene;
    state = null;

    titleTxt;
    cookingTab;
    cookingTxt;

    // 나가기 아이콘
    exitIcon;

    tabBody;

    constructor(scene, x, y, width, height) {

        super(scene, x, y, width, height);
        this.scene = scene;
        scene.add.existing(this);

        this.setScrollFactor(0).setDepth(499);

        // 헤더 제목 텍스트, 나가기 버튼, 요리 탭 포함
        const headerSpaceX = 20;
        const headerSpaceY = 10;
        const headerPad = this.edgeSize + 10;
        const txtStyle = {
            fontFamily: 'Arial',
            fontSize: 25,
            color: 'white',
            fontStyle: 'bold',
            align: 'center',
            stroke: 'black', // 외곽선
            strokeThickness: 5 // 외곽선 두께  
        };
        // UI 제목 텍스트
        const titleX = headerPad;
        const titleY = headerPad;
        this.titleTxt = scene.add.text(titleX, titleY, '화덕', txtStyle);

        // 나가기 버튼
        const exitX = this.width - headerPad + 5;
        const exitY = headerPad - 5;
        this.exitIcon = scene.add.image(exitX, exitY, 'exit_icon');
        this.exitIcon.setOrigin(1, 0).setDisplaySize(30, 30).setScrollFactor(0)
        .setInteractive();
        // 나가기 버튼 이벤트 리스너
        this.exitIcon.on('pointerdown', (event) => this.disable());

        // 요리 탭 헤더 추가
        const cookingX = headerPad;
        const cookingY = titleY + this.titleTxt.height + headerSpaceY;
        this.cookingTab = new Frame_LT(scene, cookingX, cookingY, 100, 50, 1);

        // 요리 탭 헤더 텍스트 추가
        txtStyle.fontSize = 20;
        const cookTxtX = cookingX + this.cookingTab.width / 2;
        const cookTxtY = cookingY + this.cookingTab.height / 2;
        this.cookingTxt = scene.add.text(cookTxtX, cookTxtY, '요리', txtStyle);
        this.cookingTxt.setOrigin(0.5, 0.5);

        // 탭 바디 추가
        const tabBodyX = this.cookingTab.x;
        const tabBodyY = this.cookingTab.y + this.cookingTab.height - this.edgeSize;
        const tabBodyWidth = this.width - headerPad * 2;
        const tabBodyHeight = this.height - headerPad * 2 - (this.titleTxt.height + this.cookingTab.height);
        this.tabBody = new CookingTab(scene, tabBodyX, tabBodyY, tabBodyWidth, tabBodyHeight, 2, 4);


        // UI 컨테이너에 추가
        this.add([this.titleTxt, this.exitIcon]);
        this.add([this.tabBody]);
        this.add([this.cookingTab, this.cookingTxt]);
        
    }

    // UI창 활성화
    enable(){
        this.setVisible(true);

        this.tabBody.syncItemCount();
    }
    // UI창 비활성화
    disable(){
        this.setVisible(false);
    }


}