import Phaser from "phaser";


export default class Chat extends Phaser.GameObjects.Container {

    chatLogs = []
    chatLogTexts = []
    scene
    chatBoxWidth = 600
    chatBoxX = -(this.chatBoxWidth / 2 + 50)
    constructor(scene) {

        super(scene);
        this.scene = scene
        scene.add.existing(this);
        this.setDepth(100).setScrollFactor(0);

        const heigt = 45

        const sayButtonX = 250
        //채팅 말하기 버튼 텍스트
        this.sayButtonText = scene.add.text(sayButtonX + 60, 8, "말하기", {
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

                scene.socket.emit('chat', this.chatContentText.text)
                this.NewChat(scene.characterInfo.user_name + ": " + this.chatContentText.text)
                scene.playerObject.chatContentBox.NewChat(this.chatContentText.text)
                this.chatContentText.text = ""
            });

        
        this.chatContentBox = scene.add.graphics()
            .fillStyle(0xffffff) // 채우기 색상 설정
            .fillRoundedRect(this.chatBoxX - 2, 0, this.chatBoxWidth, heigt, 5) // round rectangle 그리기
            .lineStyle(2, 0x000000) // 선 스타일 설정 (선 두께, 선 색상)
            .strokeRoundedRect(this.chatBoxX - 2, 0, this.chatBoxWidth, heigt, 5) // round rectangle 테두리 그리기
            .setScrollFactor(0)



        const logBoxHeight = 55
        this.chatLogBox = scene.add.graphics()
            .fillStyle(0x000000) // 채우기 색상 설정
            .fillRoundedRect(this.chatBoxX - 2, -logBoxHeight, this.chatBoxWidth, logBoxHeight, 5) // round rectangle 그리기
            .lineStyle(2, 0xffffff) // 선 스타일 설정 (선 두께, 선 색상)
            .strokeRoundedRect(this.chatBoxX - 2, -logBoxHeight, this.chatBoxWidth, logBoxHeight, 5) // round rectangle 테두리 그리기
            .setScrollFactor(0)
            .setAlpha(0.5)



        this.chatContentText = scene.add.text(this.chatBoxX + 5, 10, '', {
            fontFamily: 'Arial',
            fixedWidth: 480,
            fixedHeight: 30,
            fontSize: '22px',
            color: 'black',
            fontStyle: 'bold'
        })
        shape = new Phaser.Geom.Rectangle(this.chatBoxX - 2, 0,
            this.chatBoxWidth, heigt);
        this.chatContentBox.setInteractive(shape, Phaser.Geom.Rectangle.Contains);
        this.chatContentBox.on('pointerup', () => {
            scene.rexUI.edit(this.chatContentText, {

                placeholder: '내용을 입력해주세요',
                space: {
                    top: 10
                }
            });
        });

        for (let i = 0; i < 8; i++) {
            var chatContentText = this.scene.add.text(-345, -27 - i * 24, '', {
                fontFamily: 'Arial',
                fixedWidth: 480,
                fixedHeight: 30,
                fontSize: '22px',
                color: 'white',
                fontStyle: 'bold'
            })
            this.chatLogTexts.push(chatContentText)
        }


        shape = new Phaser.Geom.Rectangle(205, -240,
            40, 40);
        //- 버튼
        this.chatMinusButton = scene.add.graphics()
            .fillStyle(0x000000) // 채우기 색상 설정
            .fillRoundedRect(205, -240, 40, 40, 10) // round rectangle 그리기
            .lineStyle(2, 0xffffff) // 선 스타일 설정 (선 두께, 선 색상)
            .strokeRoundedRect(205, -240, 40, 40, 10) // round rectangle 테두리 그리기
            .setScrollFactor(0)
            .setInteractive(shape, Phaser.Geom.Rectangle.Contains)
            .on('pointerup', () => {

                this.ReSizeChatPanel(false)
            }).setVisible(false);

        this.minusText = scene.add.text(217, -245, "-", {
            fontFamily: 'Arial',
            fontSize: '40px',
            color: 'white',
            fontStyle: 'bold',
        }).setOrigin(0, 0)
        .setVisible(false)

        shape = new Phaser.Geom.Rectangle(205, -95,
            40, 40);
        //+ 버튼
        this.plustButton = scene.add.graphics()
            .fillStyle(0x000000) // 채우기 색상 설정
            .fillRoundedRect(205, -95, 40, 40, 10) // round rectangle 그리기
            .lineStyle(2, 0xffffff) // 선 스타일 설정 (선 두께, 선 색상)
            .strokeRoundedRect(205, -95, 40, 40, 10) // round rectangle 테두리 그리기
            .setScrollFactor(0)
            .setInteractive(shape, Phaser.Geom.Rectangle.Contains)
            .on('pointerup', () => {

                this.ReSizeChatPanel(true)
            });

        this.plusText = scene.add.text(214, -97, "+", {
            fontFamily: 'Arial',
            fontSize: '40px',
            color: 'white',
            fontStyle: 'bold',
        }).setOrigin(0, 0)




        shape = new Phaser.Geom.Rectangle(-395, 3,
            40, 40);
        //+ 버튼
        this.downButton = scene.add.graphics()
            .fillStyle(0x000000) // 채우기 색상 설정
            .fillRoundedRect(-395, 3, 40, 40, 10) // round rectangle 그리기
            .lineStyle(2, 0xffffff) // 선 스타일 설정 (선 두께, 선 색상)
            .strokeRoundedRect(-395, 3, 40, 40, 10) // round rectangle 테두리 그리기
            .setScrollFactor(0)
            .setInteractive(shape, Phaser.Geom.Rectangle.Contains)
            .on('pointerup', () => {

                this.ChatWindowEnable(false)
            });

        this.downText = scene.add.text(-387, 9, "▼", {
            fontFamily: 'Arial',
            fontSize: '25px',
            color: 'white',
            fontStyle: 'bold',
        }).setOrigin(0, 0)




        shape = new Phaser.Geom.Rectangle(-395, 3,
            40, 40);
        //+ 버튼
        this.upButton = scene.add.graphics()
            .fillStyle(0x000000) // 채우기 색상 설정
            .fillRoundedRect(-395, 3, 40, 40, 10) // round rectangle 그리기
            .lineStyle(2, 0xffffff) // 선 스타일 설정 (선 두께, 선 색상)
            .strokeRoundedRect(-395, 3, 40, 40, 10) // round rectangle 테두리 그리기
            .setScrollFactor(0)
            .setInteractive(shape, Phaser.Geom.Rectangle.Contains)
            .on('pointerup', () => {

                this.ChatWindowEnable(true)
            })
            .setVisible(false)

        this.upText = scene.add.text(-387, 9, "▲", {
            fontFamily: 'Arial',
            fontSize: '25px',
            color: 'white',
            fontStyle: 'bold',
        }).setOrigin(0, 0)
        .setVisible(false)



        for(let i=2;i<8;i++)
        {
            this.chatLogTexts[i].setVisible(false)
        }
        this.add([this.chatContentBox, this.chatContentText, this.sayButton, this.sayButtonText, this.chatLogBox])
        this.add([this.chatMinusButton, this.minusText,this.plustButton,this.plusText])
        this.add(this.chatLogTexts)
        this.add([this.downButton,this.downText,this.upButton,this.upText])
    }


    getChat(data) {
        this.chatLogs = data

        for (let i = 0; i < this.chatLogs.length; i++) {
            this.NewChat(this.chatLogs[i])
        }
    }

    NewChat(content) {
        for (let i = 7; i >= 1; i--) {
            this.chatLogTexts[i].text = this.chatLogTexts[i - 1].text
        }
        this.chatLogTexts[0].text = content
    }

    ReSizeChatPanel(plus) {
        if (plus == true) {
            this.chatMinusButton.setVisible(true)
            this.minusText.setVisible(true)
            this.plustButton.setVisible(false)
            this.plusText.setVisible(false)

            const logBoxHeight = 200
            this.chatLogBox.destroy();
            this.chatLogBox = this.scene.add.graphics()
                .fillStyle(0x000000) // 채우기 색상 설정
                .fillRoundedRect(this.chatBoxX - 2, -logBoxHeight, this.chatBoxWidth, logBoxHeight, 5) // round rectangle 그리기
                .lineStyle(2, 0xffffff) // 선 스타일 설정 (선 두께, 선 색상)
                .strokeRoundedRect(this.chatBoxX - 2, -logBoxHeight, this.chatBoxWidth, logBoxHeight, 5) // round rectangle 테두리 그리기
                .setScrollFactor(0)
                .setAlpha(0.5)
            this.add(this.chatLogBox)

            for(let i=0;i<8;i++)
            {
                this.chatLogTexts[i].setVisible(true)
            }
            for(let i=0;i<8;i++)
            {
                this.bringToTop(this.chatLogTexts[i])                
            }
        } else {
            this.chatMinusButton.setVisible(false)
            this.minusText.setVisible(false)
            this.plustButton.setVisible(true)
            this.plusText.setVisible(true)

            const logBoxHeight = 55
            this.chatLogBox.destroy();
            this.chatLogBox = this.scene.add.graphics()
                .fillStyle(0x000000) // 채우기 색상 설정
                .fillRoundedRect(this.chatBoxX - 2,-logBoxHeight, this.chatBoxWidth, logBoxHeight, 5) // round rectangle 그리기
                .lineStyle(2, 0xffffff) // 선 스타일 설정 (선 두께, 선 색상)
                .strokeRoundedRect(this.chatBoxX - 2, -logBoxHeight, this.chatBoxWidth, logBoxHeight, 5) // round rectangle 테두리 그리기
                .setScrollFactor(0)
                .setAlpha(0.5)
            this.add(this.chatLogBox)

            for(let i=2;i<8;i++)
            {
                this.chatLogTexts[i].setVisible(false)
            }

            for(let i=0;i<2;i++)
            {
                this.bringToTop(this.chatLogTexts[i])                
            }

        }
    }


    ChatWindowEnable(enable)
    {
        if(enable)
        {
            this.downButton.setVisible(true)
            this.downText.setVisible(true)
            this.sayButton.setVisible(true)
            this.sayButtonText.setVisible(true)
            this.plustButton.setVisible(true)
            this.plusText.setVisible(true)
            this.chatContentBox.setVisible(true)
            this.chatContentText.setVisible(true)
            this.chatLogBox.setVisible(true)
            for(let i=0;i<2;i++)
            {
                this.chatLogTexts[i].setVisible(true)
            }
            this.upButton.setVisible(false)
            this.upText.setVisible(false)     
        }else
        {
            this.ReSizeChatPanel(false)
            this.downButton.setVisible(false)
            this.downText.setVisible(false)
            this.sayButton.setVisible(false)
            this.sayButtonText.setVisible(false)
            this.plustButton.setVisible(false)
            this.plusText.setVisible(false)
            this.chatContentBox.setVisible(false)
            this.chatContentText.setVisible(false)
            this.chatLogBox.setVisible(false)
            for(let i=0;i<8;i++)
            {
                this.chatLogTexts[i].setVisible(false)
            }
            this.upButton.setVisible(true)
            this.upText.setVisible(true)         
        }
    }
}