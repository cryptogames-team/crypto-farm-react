import Phaser from "phaser";
import Frame from '../frame/frame';
import Item from "../../elements/item";
import Prompt from "../auction/prompt";

export default class Selltab extends Phaser.GameObjects.Container {



    enable() {
        this.setVisible(true);
    }
    disable() {

        this.setVisible(false);
    }





    constructor(scene, x, y, width, height) {

        super(scene);
        this.scene = scene
        // 씬의 디스플레이 목록에 추가하여 시각적으로 나타내게 한다.
        scene.add.existing(this);
        // UI 객체라서 물리 효과가 필요 없지만 테두리 확인할려고 추가
        //scene.physics.add.existing(this);

        this.setDepth(100).setScrollFactor(0);

        // 페이저는 HEX 색상 코드가 아니라 16진수 형식으로 받는다.
        // 퀵슬롯 배경

        this.edge = []
        const edgeSize = 10;
        this.setSize(120, 100);

        const index = 1
        this.button_tl = scene.add.image(18 + (index * 120), 80, 'tab_9slice_tl')
            .setOrigin(0, 0)
            .setDisplaySize(edgeSize, edgeSize);

        this.button_tc = scene.add.image(18 + edgeSize + (index * 120), 80, 'tab_9slice_tc')
            .setOrigin(0, 0)
            .setDisplaySize(133 - (edgeSize * 3), edgeSize);

        this.button_tr = scene.add.image(130 + (index * 120), 80, 'tab_9slice_tr')
            .setOrigin(0, 0)
            .setDisplaySize(edgeSize, edgeSize);

        this.button_cl = scene.add.image(18 + (index * 120), 80 + edgeSize, 'tab_9slice_lc')
            .setOrigin(0, 0)
            .setDisplaySize(edgeSize, 70 - (edgeSize * 2));

        this.button_c = scene.add.image(18 + (index * 120), 80 + edgeSize, 'tab_9slice_c')
            .setOrigin(0, 0)
            .setDisplaySize(153 - (edgeSize * 3), 80 - (edgeSize * 2))


        this.button_cr = scene.add.image(130 + (index * 120), 80 + edgeSize, 'tab_9slice_rc')
            .setOrigin(0, 0)
            .setDisplaySize(edgeSize, 70 - (edgeSize * 2));

        this.button_br = scene.add.image(130 + (index * 120), 130 + edgeSize, 'tab_9slice_bl')
            .setOrigin(0, 0)
            .setDisplaySize(edgeSize, edgeSize);

        this.button_bl = scene.add.image(18 + (index * 120), 130 + edgeSize, 'tab_9slice_br')
            .setOrigin(0, 0)
            .setDisplaySize(edgeSize, edgeSize);

        this.tab_tc = scene.add.image(18 + edgeSize, 130 + edgeSize, 'tab_9slice_tc')
            .setOrigin(0, 0)
            .setDisplaySize(width - 58, edgeSize);

        this.tab_tl = scene.add.image(18, 130 + edgeSize, 'tab_9slice_tl')
            .setOrigin(0, 0)
            .setDisplaySize(edgeSize, edgeSize);

        this.tab_tr = scene.add.image(width - 30, 130 + edgeSize, 'tab_9slice_tr')
            .setOrigin(0, 0)
            .setDisplaySize(edgeSize, edgeSize);

        this.tab_cl = scene.add.image(18, 130 + (edgeSize * 2), 'tab_9slice_lc')
            .setOrigin(0, 0)
            .setDisplaySize(edgeSize, height - 160 - (edgeSize * 2));

        this.tab_c = scene.add.image(18 + edgeSize, 130 + (edgeSize * 2), 'tab_9slice_c')
            .setOrigin(0, 0)
            .setDisplaySize(width - 58, height - 180);

        this.tab_cr = scene.add.image(width - 40 + edgeSize, 130 + (edgeSize * 2), 'tab_9slice_rc')
            .setOrigin(0, 0)
            .setDisplaySize(edgeSize, height - 180);


        this.tab_bl = scene.add.image(18, height - 50 + (edgeSize * 2), 'tab_9slice_bl')
            .setOrigin(0, 0)
            .setDisplaySize(edgeSize, edgeSize);

        this.tab_bc = scene.add.image(18 + edgeSize, height - 50 + (edgeSize * 2), 'tab_9slice_bc')
            .setOrigin(0, 0)
            .setDisplaySize(width - 55, edgeSize);

        this.tab_br = scene.add.image(width - 40 + edgeSize, height - 50 + (edgeSize * 2), 'tab_9slice_br')
            .setOrigin(0, 0)
            .setDisplaySize(edgeSize, edgeSize);

        const textGray = {
            fontFamily: 'Arial',
            fontSize: '20px',
            color: 'gray',
            fontStyle: 'bold'
        }
        const textWhite = {
            fontFamily: 'DNFbitbitv2',
            fontSize: '22px',
            color: 'white',
        }
        const textYellow = {
            fontFamily: 'DNFbitbitv2',
            fontSize: '24px',
            color: 'yellow',
            stroke: '#000000',
            strokeThickness: 4
        }
        //검색창 프레임
        const frame_search_width = 400;
        const frame_search_height = height - 190;
        const frame_search_x_position = 35;
        const frame_search_y_position = 155;
        this.searchFrame = new Frame(scene, frame_search_x_position, frame_search_y_position,
            frame_search_width, frame_search_height);







        const inputXpos = 280
        //판매 희망가격
        this.hopePriceText = scene.add.text(frame_search_x_position + 20, frame_search_y_position + 28, "> 판매희망 가격(100골드당)", {
            fontFamily: 'DNFbitbitv2',
            fontSize: '17px',
            color: 'white',
        })
        this.hopeInputBox = scene.add.graphics()
            .fillStyle(0xffffff) // 채우기 색상 설정
            .fillRoundedRect(inputXpos, frame_search_y_position + 18, 80, 40, 5) // round rectangle 그리기
            .lineStyle(2, 0x000000) // 선 스타일 설정 (선 두께, 선 색상)
            .strokeRoundedRect(inputXpos, frame_search_y_position + 18, 80, 40, 5) // round rectangle 테두리 그리기
            .setScrollFactor(0)
        this.hopePrice = scene.add.text(inputXpos + 7, frame_search_y_position + 24, '', {
            fontFamily: 'DNFbitbitv2',
            fixedWidth: 480,
            fixedHeight: 30,
            fontSize: '22px',
            color: 'black',
        })
        var shape = new Phaser.Geom.Rectangle(inputXpos, frame_search_y_position + 18,
            80, 40);
        this.hopeInputBox.setInteractive(shape, Phaser.Geom.Rectangle.Contains);
        this.hopeInputBox.on('pointerup', () => {
            scene.rexUI.edit(this.hopePrice, {
                onClose: () => {
                    if (this.quantatyText.text != "" && this.hopePrice.text != "") {
                        this.buyHEPQuantaty.text = (parseInt(this.quantatyText.text) * (parseInt(this.hopePrice.text) / 100)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                        this.depositQuantaty.text = (parseInt(this.quantatyText.text)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                }
            })


        });
        //HEP
        this.hepText = scene.add.text(inputXpos + 90, frame_search_y_position + 28, "HEP", {
            fontFamily: 'DNFbitbitv2',
            fontSize: '22px',
            color: 'white',
        })




        //골드 판매량
        this.quantaty = scene.add.text(frame_search_x_position + 20, frame_search_y_position + 78, "> 골드 판매량", {
            fontFamily: 'DNFbitbitv2',
            fontSize: '18px',
            color: 'white',
        })
        this.quantatyInput = scene.add.graphics()
            .fillStyle(0xffffff) // 채우기 색상 설정
            .fillRoundedRect(inputXpos, frame_search_y_position + 68, 80, 40, 5) // round rectangle 그리기
            .lineStyle(2, 0x000000) // 선 스타일 설정 (선 두께, 선 색상)
            .strokeRoundedRect(inputXpos, frame_search_y_position + 68, 80, 40, 5) // round rectangle 테두리 그리기
            .setScrollFactor(0)
        this.quantatyText = scene.add.text(inputXpos + 7, frame_search_y_position + 74, '', {
            fontFamily: 'DNFbitbitv2',
            fixedWidth: 480,
            fixedHeight: 30,
            fontSize: '22px',
            color: 'black',
        })
        var shape = new Phaser.Geom.Rectangle(inputXpos, frame_search_y_position + 68,
            80, 40);
        this.quantatyInput.setInteractive(shape, Phaser.Geom.Rectangle.Contains);
        this.quantatyInput.on('pointerup', () => {
            scene.rexUI.edit(this.quantatyText, {
                onClose: () => {
                    if (this.quantatyText.text != "" && this.hopePrice.text != "") {
                        this.buyHEPQuantaty.text = (parseInt(this.quantatyText.text) * (parseInt(this.hopePrice.text) / 100)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                        this.depositQuantaty.text = (parseInt(this.quantatyText.text)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                }
            });
        });
        //골드
        this.goldText = scene.add.text(inputXpos + 90, frame_search_y_position + 78, "골드", {
            fontFamily: 'DNFbitbitv2',
            fontSize: '22px',
            color: 'white',
        })

/*
        //거래 가격
        this.tradePrice = scene.add.text(frame_search_x_position + 20, frame_search_y_position + 140, "| 거래 가격", {
            fontFamily: 'Arial',
            fontSize: '21px',
            color: 'white',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 4
        })
*/
        /*
        this.immediatelyBG = scene.add.graphics()
            .fillStyle(0x333333) // 채우기 색상 설정
            .fillRoundedRect(frame_search_x_position + 20, frame_search_y_position + 180, 355, 40, 5) // round rectangle 그리기
            .lineStyle(2, 0x000000) // 선 스타일 설정 (선 두께, 선 색상)
            .strokeRoundedRect(frame_search_x_position + 20, frame_search_y_position + 180, 355, 40, 5) // round rectangle 테두리 그리기
            .setScrollFactor(0)

            */
        /*
        this.averagePriceBG = scene.add.graphics()
            .fillStyle(0x333333) // 채우기 색상 설정
            .fillRoundedRect(frame_search_x_position + 20, frame_search_y_position + 225, 355, 40, 5) // round rectangle 그리기
            .lineStyle(2, 0x000000) // 선 스타일 설정 (선 두께, 선 색상)
            .strokeRoundedRect(frame_search_x_position + 20, frame_search_y_position + 225, 355, 40, 5) // round rectangle 테두리 그리기
            .setScrollFactor(0)

        this.recomendPriceBG = scene.add.graphics()
            .fillStyle(0x333333) // 채우기 색상 설정
            .fillRoundedRect(frame_search_x_position + 20, frame_search_y_position + 270, 355, 40, 5) // round rectangle 그리기
            .lineStyle(2, 0x000000) // 선 스타일 설정 (선 두께, 선 색상)
            .strokeRoundedRect(frame_search_x_position + 20, frame_search_y_position + 270, 355, 40, 5) // round rectangle 테두리 그리기
            .setScrollFactor(0)
        */

        /*
        this.immediately1 = scene.add.text(frame_search_x_position + 25, frame_search_y_position + 192, "즉시거래가", {
            fontFamily: 'Arial',
            fontSize: '18px',
            color: 'white',
            fontStyle: 'bold'
        })
        this.immediately2 = scene.add.text(frame_search_x_position + 140, frame_search_y_position + 189, "100 골드:", textWhite)
        this.immediately3 = scene.add.text(frame_search_x_position + 265, frame_search_y_position + 186, "256", textYellow)
        this.immediately4 = scene.add.text(frame_search_x_position + 315, frame_search_y_position + 189, "HEP", textWhite)

        */

        // this.average1 = scene.add.text(frame_search_x_position + 25, frame_search_y_position + 237, "평균거래가", {
        //     fontFamily: 'Arial',
        //     fontSize: '18px',
        //     color: 'white',
        //     fontStyle: 'bold'
        // })
        // this.average2 = scene.add.text(frame_search_x_position + 140, frame_search_y_position + 234, "100 골드:", textWhite)
        // this.average3 = scene.add.text(frame_search_x_position + 265, frame_search_y_position + 231, "256", textYellow)
        // this.average4 = scene.add.text(frame_search_x_position + 315, frame_search_y_position + 234, "HEP", textWhite)

        this.recomend1 = scene.add.text(frame_search_x_position + 25, frame_search_y_position + 282, "추천거래가", {
            fontFamily: 'DNFbitbitv2',
            fontSize: '18px',
            color: 'white',
        })
        this.recomend2 = scene.add.text(frame_search_x_position + 140, frame_search_y_position + 279, "100 골드:", textWhite)
        this.recomend3 = scene.add.text(frame_search_x_position + 265, frame_search_y_position + 276, "256", textYellow)
        this.recomend4 = scene.add.text(frame_search_x_position + 315, frame_search_y_position + 279, "HEP", textWhite)


        //예상결과창 프레임
        const frame_result_width = width - frame_search_width - 85;
        const frame_result_height = height - 190;
        const frame_result_x_position = frame_search_x_position + frame_search_width + 15;
        const frame_result_y_position = 155;
        this.resultFrame = new Frame(scene, frame_result_x_position, frame_result_y_position,
            frame_result_width, frame_result_height);

        //예상 거래 결과 텍스트
        this.predictResultText = scene.add.text(frame_result_x_position + frame_result_width / 3 - 5, frame_result_y_position + 18, "예상 거래 결과", {
            fontFamily: 'DNFbitbitv2',
            fontSize: '26px',
            color: 'white',
        })


        //예치금
        this.deposit = scene.add.text(frame_result_x_position + 20, frame_search_y_position + 70, "| 예치금", {
            fontFamily: 'DNFbitbitv2',
            fontSize: '21px',
            color: 'white',
            stroke: '#000000',
            strokeThickness: 4

        })
        this.depositBG = scene.add.graphics()
            .fillStyle(0x333333) // 채우기 색상 설정
            .fillRoundedRect(frame_result_x_position + 105, frame_search_y_position + 100, 300, 55, 5) // round rectangle 그리기
            .lineStyle(2, 0x000000) // 선 스타일 설정 (선 두께, 선 색상)
            .strokeRoundedRect(frame_result_x_position + 105, frame_search_y_position + 100, 300, 55, 5) // round rectangle 테두리 그리기
            .setScrollFactor(0)
        this.depositQuantaty = scene.add.text(frame_result_x_position + frame_result_width / 2 + 20, frame_search_y_position + 110, "0",
            {
                fontFamily: 'DNFbitbitv2',
                fontSize: '32px',
                color: 'yellow',
                stroke: '#000000',
                strokeThickness: 4
            }).setOrigin(1, 0)

        //골드
        this.depositGold = scene.add.text(frame_result_x_position + 285, frame_search_y_position + 120, "골드", {
            fontFamily: 'DNFbitbitv2',
            fontSize: '22px',
            color: 'white',
        })


        //구입 HEP
        this.buyHEP = scene.add.text(frame_result_x_position + 20, frame_search_y_position + 170, "| 구입 HEP", {
            fontFamily: 'DNFbitbitv2',
            fontSize: '21px',
            color: 'white',
            stroke: '#000000',
            strokeThickness: 4
        })

        this.buyHEPBG = scene.add.graphics()
            .fillStyle(0x333333) // 채우기 색상 설정
            .fillRoundedRect(frame_result_x_position + 105, frame_search_y_position + 200, 300, 55, 5) // round rectangle 그리기
            .lineStyle(2, 0x000000) // 선 스타일 설정 (선 두께, 선 색상)
            .strokeRoundedRect(frame_result_x_position + 105, frame_search_y_position + 200, 300, 55, 5) // round rectangle 테두리 그리기
            .setScrollFactor(0)
        this.buyHEPQuantaty = scene.add.text(frame_result_x_position + frame_result_width / 2 + 20, frame_search_y_position + 210, "0",
            {
                fontFamily: 'DNFbitbitv2',
                fontSize: '32px',
                color: 'yellow',
                stroke: '#000000',
                strokeThickness: 4
            }).setOrigin(1, 0)

        //골드
        this.buyHEPText = scene.add.text(frame_result_x_position + 285, frame_search_y_position + 220, "HEP", {
            fontFamily: 'DNFbitbitv2',
            fontSize: '22px',
            color: 'white',
        })

        //구매하기
        shape = new Phaser.Geom.Rectangle(frame_result_x_position + 105, frame_search_y_position + 320, 300, 55, 5);
        this.buyButton = scene.add.graphics()
            .fillStyle(0xA5C72A) // 채우기 색상 설정
            .fillRoundedRect(frame_result_x_position + 105, frame_search_y_position + 320, 300, 55, 5) // round rectangle 그리기
            .lineStyle(2, 0xA5C72A) // 선 스타일 설정 (선 두께, 선 색상)
            .strokeRoundedRect(frame_result_x_position + 105, frame_search_y_position + 320, 300, 55, 5) // round rectangle 테두리 그리기
            .setScrollFactor(0)
            .setInteractive(shape, Phaser.Geom.Rectangle.Contains)
            .on('pointerup', () => {

                this.BuyHEPRequest()
            })

        //구매하기 버튼 텍스트
        this.buyButtonText = scene.add.text(frame_result_x_position + 255, frame_search_y_position + 335, "거래신청", {
            fontFamily: 'DNFbitbitv2',
            fontSize: '27px',
            color: 'white',
        }).setOrigin(0.5, 0)


        this.prompt = new Prompt(scene, width / 5, (height / 2), width*5/8 , height * 1.2 / 10)
        .setVisible(false)

        this.add([

            this.tab_tl, this.tab_tc, this.tab_tr,
            this.tab_cl, this.tab_c, this.tab_cr,
            this.tab_bl, this.tab_bc, this.tab_br,
            this.button_tl, this.button_tc, this.button_tr,
            this.button_c, this.button_cr, this.button_cl,
            this.button_bl, this.button_br,
            this.searchFrame, this.resultFrame, this.predictResultText,
            this.hopePriceText, this.hopeInputBox, this.hopePrice, this.hepText,
            this.goldText, this.quantaty, this.quantatyInput, this.quantatyText, /*this.tradePrice*/
             /*this.immediatelyBG,*/
            /*this.recomend1, this.recomend2, this.recomend3, this.recomend4,
            this.average1, this.average2, this.average3, this.average4,*/
            /*this.immediately1, this.immediately2, this.immediately3, this.immediately4,*/
            this.depositBG, this.buyHEP, this.buyHEPBG,
            this.buyHEPQuantaty, this.buyHEPText,
            this.deposit, this.depositQuantaty, this.depositGold, this.buyButton, this.buyButtonText
            ,this.prompt


        ])



    }

    BuyHEPRequest() {
        const url = this.scene.APIurl+'/cft'
        const postData = {
            "cft": parseInt(this.quantatyText.text),
            "price": parseInt(this.hopePrice.text),
            // "cft": parseInt(this.quantatyText.text),
            // "price": parseInt(this.hopePriceText.text),
        }
        console.log(postData)
        //요청 보내기
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+this.scene.accessToken
            },
            body: JSON.stringify(postData)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log(data)
                this.scene.market.gold-=parseInt(this.quantatyText.text)
                this.scene.market.goldText.text=this.scene.market.gold.toLocaleString()
                this.prompt.show("골드판매 등록이 완료되었습니다.")
            })
            .catch(error => {
                console.error('There was a problem with the request:', error);
            });
    }



    GetSellingItems() {
        const url = this.scene.APIurl+'/cft?cft_price=1&page_number=1'
        //요청 보내기
        fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+this.scene.accessToken
            },
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {

                for (let i = 0; i < 9; i++) {
                    this.sellingItems[i].setVisible(false)
                }
                for (let i = 0; i < data.result.length; i++) {
                    this.mySellingItemData.push(data.result[i])
                    this.sellingItems[i].setInfo(data.result[i])
                    this.mySellingItemCount = data.result.length
                }
            })
            .catch(error => {
                console.error('There was a problem with the request:', error);
            });
    }
}





