import Phaser from "phaser";
import Frame from "./frame/frame";

const pad = 15;
const space = 5;

export default class CharacterInfo extends Frame {

    scene;

    levelText;
    nameText;
    expTxt;

    expProgress;

    characterInfo;

    // 현재 경험치
    currentExp = 0;
    // 다음 레벨까지 필요한 경험치
    nextLevelExp = 10;


    // 캐릭터 정보 받아와야 한다.
    constructor(scene, x, y, width, height, characterInfo) {

        super(scene, x, y, width, height);
        this.scene = scene;
        this.characterInfo = characterInfo;
        scene.add.existing(this);

        this.currentExp = characterInfo.exp;
        this.nextLevelExp = this.getNextLevelExp();

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
        this.expTxt = scene.add.text(expX, expY, `${this.currentExp}/${this.nextLevelExp} EXP`, txtStyle);
        this.expTxt.setDepth(50).setScrollFactor(0).setOrigin(0.5, 0);


        const COLOR_PRIMARY = 0x20de07;
        // 0x7b5e57
        const COLOR_LIGHT = 0xe9ecef;
        //0x260e04
        const COLOR_DARK = 0x000000;

        let progressX = this.width / 2;
        let progressY = expY + this.expTxt.height;
        let progressWidth = this.width - pad * 2;

        // 경험치 바
        this.expProgress = scene.rexUI.add.lineProgress(progressX, progressY, progressWidth, 15, {
            barColor: COLOR_PRIMARY,
            trackColor: COLOR_DARK,
            trackStrokeColor: COLOR_LIGHT,
            trackStrokeThickness: 2,

            skewX: 5,
            // rtl: true,
            value: 0
        });

        this.expProgress.setDepth(50).setScrollFactor(0).setOrigin(0.5, 0);
        // ease 시간 설정 : ms 단위
        this.expProgress.setEaseValueDuration(1250);
        this.initExpBarValue();

        //this.onEarnExp(60);

        this.add([this.levelText, this.nameText]);
        this.add([this.expTxt, this.expProgress]);

        // UI창 크기 재설정
        this.setUISize(this.width, progressY + this.expProgress.height + pad);
    }

    // UI창 재설정


    // 초기 경험치 바 값 설정
    // 현재 경험치 / 다음 레벨에 필요한 경험치 를 값으로 설정
    initExpBarValue() {
        let value = this.currentExp / this.nextLevelExp;
        this.expProgress.setValue(value);
    }

    // 경험치 관련 UI 설정
    // 경험치 텍스트, 경험치 바
    setExpUI() {

        // 경험치 바 값 설정
        let value = this.currentExp / this.nextLevelExp;
        this.expProgress.easeValueTo(value);
        // 경험치 텍스트 설정
        this.expTxt.setText(`${this.currentExp}/${this.nextLevelExp} EXP`);

    }

    // 경험치 얻었을 때 처리
    // UI 처리와 경험치 계산
    // 1. 다음 레벨 도달까지 충분한 경험치를 얻지 못함
    // 2. 다음 레벨 도달까지 충분한 경험치를 얻었음.
    onEarnExp(earnExp) {

        // 캐릭터 정보 객체의 현재 경험치 값 증가
        this.characterInfo.exp += earnExp;

        // 경험치 계산
        // 다음 레벨 도달까지 충분한 경험치를 얻지 못함.
        if (this.characterInfo.exp < this.nextLevelExp) {

            //console.log('다음 레벨 도달까지 충분한 경험치를 얻지 못함.');

            // 현재 경험치 동기화
            this.currentExp = this.characterInfo.exp;
            this.setExpUI();

        }
        else { // 다음 레벨까지 충분한 경험치를 얻음 - 레벨업!

            //console.log('다음 레벨 도달까지 충분한 경험치를 얻음.');

            // 레벨업 전부 처리
            while (this.characterInfo.exp >= this.nextLevelExp) {
                // 현재 경험치 - 다음 레벨까지 필요한 경험치 
                this.characterInfo.exp -= this.nextLevelExp;

                // 1레벨 증가
                this.characterInfo.level += 1;
                // 다음 레벨까지 필요한 경험치 값 재설정
                // ex : 2레벨에 도달하면 3레벨에 필요한 경험치 값으로 조정
                this.nextLevelExp = this.getNextLevelExp();

                //console.log(`다음 ${this.characterInfo.level + 1}레벨까지 필요한 경험치 량`, this.nextLevelExp);
            }

            // 현재 경험치 동기화
            this.currentExp = this.characterInfo.exp;

            // 레벨 텍스트 재설정
            this.levelText.setText('LV. ' + this.characterInfo.level);
            
            // 경험치 관련 UI 설정
            this.expProgress.setValue(0);
            this.setExpUI();
        }
    }

    // 다음 레벨까지 필요한 경험치 값 구하기
    getNextLevelExp() {
        return this.characterInfo.level * 20;
    }

    // 레벨업 할 때 처리

}