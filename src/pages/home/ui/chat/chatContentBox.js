import Phaser from "phaser";

export default class chatContentBox extends Phaser.GameObjects.Container {

    chatWidth = 150
    chatHeight = 60
    scene
    constructor(scene) {

        super(scene);
        this.scene=scene
        scene.add.existing(this);
        this.setDepth(100)
        const textConfig = {
            fontFamily: 'Arial',
            fontSize: '28px',
            color: 'black',
            fontStyle: 'bold'
        }

        this.chatContentBox = scene.add.graphics()
            .fillStyle(0xffffff) // 채우기 색상 설정
            .fillRoundedRect(-this.chatWidth / 2 + 32, -this.chatHeight - 13, this.chatWidth, this.chatHeight, 5) // round rectangle 그리기
            .lineStyle(2, 0x000000) // 선 스타일 설정 (선 두께, 선 색상)
            .strokeRoundedRect(-this.chatWidth / 2 + 32, -this.chatHeight - 13, this.chatWidth, this.chatHeight, 5) // round rectangle 테두리 그리기
        this.add(this.chatContentBox)

        this.chatContentText = scene.add.text(-this.chatWidth/2+50, -this.chatHeight - 10, '', {
            fontFamily: 'DNFbitbitv2',
            fixedWidth: this.chatWidth,
            fontSize: '22px',
            color: 'black',
            wordWrap : {
                // 줄바꿈할 최대 너비
                width : this.chatWidth-30,
                // 고급 줄 바꿈 옵션 : 공백이 아닌 문자에서도 줄바꿈을 허용한다.
                useAdvancedWrap : true
            }
        }).setOrigin(0,0)
        this.add(this.chatContentText)
        this.setVisible(false)
    }

    NewChat(content) {
        this.chatContentText.text = content
        this.chatContentText.y=-this.chatContentText.height-15
        this.chatContentBox.destroy();
        this.chatContentBox = this.scene.add.graphics()
            .fillStyle(0xffffff)
            .fillRoundedRect(this.chatContentText.x-19, this.chatContentText.y-2, this.chatWidth, this.chatContentText.height+3, 5)
            .lineStyle(2, 0x000000)
            .strokeRoundedRect(this.chatContentText.x-19, this.chatContentText.y-2, this.chatWidth, this.chatContentText.height+3, 5);
        this.add(this.chatContentBox)
        this.bringToTop(this.chatContentText)
        this.setVisible(true)
        setTimeout(() => this.setVisible(false), 2500);
    }
}