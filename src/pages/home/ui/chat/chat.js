import Phaser from "phaser";


export default class Chat extends Phaser.GameObjects.Container {


    constructor(scene) {

        super(scene);
        scene.add.existing(this);
        this.setDepth(100).setScrollFactor(0);

        const heigt=45

        const sayButtonX=250
        //채팅 말하기 버튼 텍스트
        this.sayButtonText = scene.add.text(sayButtonX+60, 8, "말하기", {
            fontFamily: 'Arial',
            fontSize: '27px',
            color: 'white',
            fontStyle: 'bold',
        }).setOrigin(0.5, 0)

        var shape = new Phaser.Geom.Rectangle(sayButtonX, 0,
            120, 45);
        this.sayButton = scene.add.graphics()
            .fillStyle(0x000000) // 채우기 색상 설정
            .fillRoundedRect(sayButtonX, 0, 120, heigt, 5) // round rectangle 그리기
            .lineStyle(2, 0xFFFFFF) // 선 스타일 설정 (선 두께, 선 색상)
            .strokeRoundedRect(sayButtonX, 0, 120, heigt, 5) // round rectangle 테두리 그리기
            .setScrollFactor(0)
            .setInteractive(shape, Phaser.Geom.Rectangle.Contains)
            .on('pointerup', () => {
                scene.socket.emit("chat",this.chatContentText.text)
                this.chatContentText.text=""               
            });

        const chatBoxWidth=600
        const chatBoxX=-(chatBoxWidth/2+50) 
        this.chatContentBox = scene.add.graphics()
            .fillStyle(0xffffff) // 채우기 색상 설정
            .fillRoundedRect(chatBoxX-2, 0, chatBoxWidth, heigt, 5) // round rectangle 그리기
            .lineStyle(2, 0x000000) // 선 스타일 설정 (선 두께, 선 색상)
            .strokeRoundedRect(chatBoxX-2, 0, chatBoxWidth, heigt, 5) // round rectangle 테두리 그리기
            .setScrollFactor(0)

        
        this.chatContentText=scene.add.text(chatBoxX+5, 10, 'aaaaaaa', {
            fontFamily: 'Arial',
            fixedWidth: 480,
            fixedHeight: 30,
            fontSize: '22px',
            color: 'black',
            fontStyle: 'bold'
        })
        shape = new Phaser.Geom.Rectangle(chatBoxX-2, 0,
            chatBoxWidth, heigt);
        this.chatContentBox.setInteractive(shape, Phaser.Geom.Rectangle.Contains);
        this.chatContentBox.on('pointerup', () => {
            scene.rexUI.edit(this.chatContentText, {
                
                placeholder: '내용을 입력해주세요',
                space: {
                    top: 10
                }
            });
        });
        this.add([this.chatContentBox,this.chatContentText,this.sayButton, this.sayButtonText])
    }


}