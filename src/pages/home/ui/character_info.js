import Phaser from "phaser";
import Frame from "./frame";


const pad = 15;
const space = 5;

export default class CharacterInfo extends Frame{

    scene;

    levelText;
    nameText;
    expTxt;

    expProgress;

    characterInfo;

    // 캐릭터 정보 받아와야 한다.
    constructor(scene, x, y, width, height, characterInfo){

        super(scene, x, y, width, height);
        this.scene = scene;
        this.characterInfo = characterInfo;
        scene.add.existing(this);

        this.setScrollFactor(0).setDepth(500);

        const txtStyle = {
            fontFamily: 'Arial',
            fontSize: 18,
            color: 'white',
            fontStyle: 'bold',
            align: 'center',
            stroke: 'black', // 외곽선
            strokeThickness: 5 // 외곽선 두께  
        };


        // 레벨 표시 텍스트
        txtStyle.backgroundColor = '';
        txtStyle.color = 'yellow';
        let levelX = this.width / 4 + pad;
        let levelY = pad;
        this.levelText = scene.add.text(levelX, levelY, 'LV. ' + characterInfo.level, txtStyle);
        this.levelText.setDepth(50).setScrollFactor(0).setOrigin(0.5, 0);

        // 캐릭터 이름 표시 텍스트
        txtStyle.color = 'white';
        let nameX = this.width / 1.5;
        let nameY = levelY;
        this.nameText = scene.add.text(nameX, nameY, characterInfo.user_name, txtStyle);
        this.nameText.setDepth(50).setScrollFactor(0).setOrigin(0.5, 0);




        // 경험치 표시 텍스트
        txtStyle.fontSize = 15;
        let expX = this.width / 2;
        let expY = nameY + this.nameText.height + space;
        this.expTxt = scene.add.text(expX, expY, characterInfo.exp + '/100 EXP', txtStyle);
        this.expTxt.setDepth(50).setScrollFactor(0).setOrigin(0.5, 0);

        const COLOR_PRIMARY = 0x00a12f;
        const COLOR_LIGHT = 0x7b5e57;
        const COLOR_DARK = 0x260e04;

        let progressX = this.width / 2;
        let progressY = expY + this.expTxt.height;
        let progressWidth = this.width - pad * 2;

        // rexUI 써보기
        this.expProgress = scene.rexUI.add.lineProgress(progressX, progressY, progressWidth, 15, {
            barColor: COLOR_PRIMARY,
            trackColor: COLOR_DARK,
            trackStrokeColor: COLOR_LIGHT,
            trackStrokeThickness: 3,

            skewX: 5,
            // rtl: true,
            value: 0.5
        });

        this.expProgress.setDepth(50).setScrollFactor(0).setOrigin(0.5, 0);

        this.add([this.levelText, this.nameText]);
        this.add([this.expTxt, this.expProgress]);


        this.setUISize(this.width, progressY + this.expProgress.height + pad);
    }

    // height만 변경하기

    // UI창 재설정

    // 경험치 올리기


    // 레벨업 처리

}