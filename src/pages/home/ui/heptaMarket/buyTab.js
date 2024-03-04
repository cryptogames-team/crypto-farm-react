import Phaser from "phaser";
import Frame from '../frame/frame';
import Item from "../../elements/item";
import Prompt from "../auction/prompt";
import SellItem from "./sellItem";
import { eventSystem } from "../../event_system";

export default class BuyTab extends Phaser.GameObjects.Container {


    lowest;
    enable() {
        this.setVisible(true);
        this.getCFTLists()
    }
    disable() {

        this.setVisible(false);
    }


    sendComplete(value)
    {
        this.BuyGoldRequest()
    }


    constructor(scene, x, y, width, height) {

        super(scene);
        this.scene = scene

        eventSystem.on('sendComplete', (value) => this.sendComplete(value));
        //html 버튼에 이벤트 붙여줌
        /*
        document.getElementById("transaction_complete_for_multi").addEventListener("click",()=>{
        })
        */
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


        const categoryTextType = {
            fontFamily: 'Arial',
            fontSize: '16px',
            color: 'white',
            fontStyle: 'bold'
        }


        

        this.button_tl = scene.add.image(18, 80, 'tab_9slice_tl')
            .setOrigin(0, 0)
            .setDisplaySize(edgeSize, edgeSize);

        this.button_tc = scene.add.image(18 + edgeSize, 80, 'tab_9slice_tc')
            .setOrigin(0, 0)
            .setDisplaySize(133 - (edgeSize * 3), edgeSize);

        this.button_tr = scene.add.image(130, 80, 'tab_9slice_tr')
            .setOrigin(0, 0)
            .setDisplaySize(edgeSize, edgeSize);

        this.button_cl = scene.add.image(18, 80 + edgeSize, 'tab_9slice_lc')
            .setOrigin(0, 0)
            .setDisplaySize(edgeSize, 80 - (edgeSize * 2));

        this.button_c = scene.add.image(18 + edgeSize, 80 + edgeSize, 'tab_9slice_c')
            .setOrigin(0, 0)
            .setDisplaySize(143 - (edgeSize * 3), 80 - (edgeSize * 2))


        this.button_cr = scene.add.image(130, 80 + edgeSize, 'tab_9slice_rc')
            .setOrigin(0, 0)
            .setDisplaySize(edgeSize, 70 - (edgeSize * 2));

        this.button_br = scene.add.image(130, 130 + edgeSize, 'tab_9slice_bl')
            .setOrigin(0, 0)
            .setDisplaySize(edgeSize, edgeSize);

        this.tab_tc = scene.add.image(140, 130 + edgeSize, 'tab_9slice_tc')
            .setOrigin(0, 0)
            .setDisplaySize(width - 170, edgeSize);

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
            fontFamily: 'Arial',
            fontSize: '22px',
            color: 'white',
            fontStyle: 'bold'
        }
        const textYellow = {
            fontFamily: 'Arial',
            fontSize: '24px',
            color: 'yellow',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 4
        }
        //검색창 프레임
        const frame_search_width = 600;
        const frame_search_height = height - 190;
        const frame_search_x_position = 35;
        const frame_search_y_position = 155;
        this.searchFrame = new Frame(scene, frame_search_x_position, frame_search_y_position,
            frame_search_width, frame_search_height);


        //검색한 결과 틀
        this.count = 0
        this.sellItems = []
        this.selectedItem = new SelectedSellingItem(scene, 15, 0, frame_search_width - 30, 60, 0).setVisible(false)
        this.gold_amout = scene.add.text(70, 10, "골드량", categoryTextType)
        this.price = scene.add.text(220, 10, "100골드당 가격(HEP)", categoryTextType)
        this.total_price = scene.add.text(470, 10, "총가격", categoryTextType)
        for (let i = 0; i < 6; i++) {
            this.newItem = new SellItem(scene, frame_search_width, 10, this.count).setVisible(false);
            shape = new Phaser.Geom.Rectangle(18, 33 + (this.count * 57),
                frame_search_width - 40, 70);
            this.newItem
                .setInteractive(shape, Phaser.Geom.Rectangle.Contains)
                .on('pointerup', () => {

                    this.selectedItemIndex = i;
                    this.selectedItem.y = 33 + (i * 57)
                    this.selectedItem.setVisible(true)
                });
            this.sellItems.push(this.newItem);
            this.count++

        }
        this.searchFrame.add(this.sellItems)
        this.searchFrame.add([this.gold_amout, this.price, this.total_price, this.selectedItem])



        //정렬을 위한 인디케이터
        this.quantatyArrage_up = scene.add.image(130, 13, 'indicator')
            .setScrollFactor(0)
            .setDisplaySize(10, -10)
            .setInteractive()
            .on('pointerup', () => {
                this.order("&cft_count=1")
            });

        //정렬을 위한 인디케이터
        this.quantatyArrage_down = scene.add.image(130, 23, 'indicator')
            .setScrollFactor(0)
            .setDisplaySize(10, 10)
            .setInteractive()
            .on('pointerup', () => {
                this.order("&cft_count=0")
            });

        //정렬을 위한 인디케이터
        this.priceArrage_up = scene.add.image(387, 13, 'indicator')
            .setScrollFactor(0)
            .setDisplaySize(10, -10)
            .setInteractive()
            .on('pointerup', () => {
                this.order("&cft_price=1")
            });

        //정렬을 위한 인디케이터
        this.priceArrage_down = scene.add.image(387, 23, 'indicator')
            .setScrollFactor(0)
            .setDisplaySize(10, 10)
            .setInteractive()
            .on('pointerup', () => {
                this.order("&cft_price=0")
            });

        this.searchFrame.add([this.quantatyArrage_up, this.quantatyArrage_down, this.priceArrage_up, this.priceArrage_down])

        //아이템 페이징을 위한 인디케이터
        this.before_page = scene.add.image(233, 387, 'before')
            .setScrollFactor(0)
            .setInteractive()
            .setDisplaySize(23, 23)
            .on('pointerup', () => {
                this.paging(true)
            })
        this.pageText = scene.add.text(273, 375, "5 / 10", {
            fontFamily: 'Arial',
            fontSize: '22px',
            color: 'white',
            fontStyle: 'bold'
        })
        //아이템 페이징을 위한 인디케이터
        this.next_page = scene.add.image(362, 387, 'next')
            .setScrollFactor(0)
            .setInteractive()
            .setDisplaySize(23, 23)
            .on('pointerup', () => {
                this.paging(false)
            })

        this.searchFrame.add([this.before_page, this.next_page, this.pageText])



        var shape
        //예상결과창 프레임
        const frame_result_width = width - frame_search_width - 85;
        const frame_result_height = height - 190;
        const frame_result_x_position = frame_search_x_position + frame_search_width + 15;
        const frame_result_y_position = 155;
        this.resultFrame = new Frame(scene, frame_result_x_position, frame_result_y_position,
            frame_result_width, frame_result_height);


        const inputXpos = frame_result_x_position + 150
        //구매 희망가격
        //골드 구매량
        this.quantaty = scene.add.text(frame_result_x_position + 20, frame_search_y_position + 53, "> 골드 구매량", {
            fontFamily: 'Arial',
            fontSize: '18px',
            color: 'white',
            fontStyle: 'bold'
        })
        this.quantatyInput = scene.add.graphics()
            .fillStyle(0xffffff) // 채우기 색상 설정
            .fillRoundedRect(inputXpos, frame_search_y_position + 43, 80, 40, 5) // round rectangle 그리기
            .lineStyle(2, 0x000000) // 선 스타일 설정 (선 두께, 선 색상)
            .strokeRoundedRect(inputXpos, frame_search_y_position + 43, 80, 40, 5) // round rectangle 테두리 그리기
            .setScrollFactor(0)
        this.quantatyText = scene.add.text(inputXpos + 7, frame_search_y_position + 49, '', {
            fontFamily: 'Arial',
            fixedWidth: 480,
            fixedHeight: 30,
            fontSize: '22px',
            color: 'black',
            fontStyle: 'bold'
        })
        var shape = new Phaser.Geom.Rectangle(inputXpos, frame_search_y_position + 43,
            80, 40);
        this.quantatyInput.setInteractive(shape, Phaser.Geom.Rectangle.Contains);
        this.quantatyInput.on('pointerup', () => {
            scene.rexUI.edit(this.quantatyText, {
                onClose: () => {
                    if(this.selectedSellingitemInfo!=null)
                    {
                        this.tokenAmount=(parseInt(this.quantatyText.text)/100)*this.selectedSellingitemInfo.price
                        this.depositQuantaty.text=this.tokenAmount
                        this.buyGoldQuantaty.text=this.quantatyText.text
                    }else
                    {
                        this.quantatyText.text=""
                    }            
                }     
            })
            
        });
        //골드
        this.goldText = scene.add.text(inputXpos + 90, frame_search_y_position + 53, "골드", {
            fontFamily: 'Arial',
            fontSize: '22px',
            color: 'white',
            fontStyle: 'bold'
        })

        //토큰 비용
        this.deposit = scene.add.text(frame_result_x_position + 20, frame_search_y_position + 100, "| 토큰 비용", {
            fontFamily: 'Arial',
            fontSize: '21px',
            color: 'white',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 4

        })
        this.depositBG = scene.add.graphics()
            .fillStyle(0x333333) // 채우기 색상 설정
            .fillRoundedRect(frame_result_x_position + 40, frame_search_y_position + 130, 240, 55, 5) // round rectangle 그리기
            .lineStyle(2, 0x000000) // 선 스타일 설정 (선 두께, 선 색상)
            .strokeRoundedRect(frame_result_x_position + 40, frame_search_y_position + 130, 240, 55, 5) // round rectangle 테두리 그리기
            .setScrollFactor(0)
        this.depositQuantaty = scene.add.text(frame_result_x_position + frame_result_width / 2 + 40, frame_search_y_position + 140, "0",
            {
                fontFamily: 'Arial',
                fontSize: '32px',
                color: 'yellow',
                fontStyle: 'bold',
                stroke: '#000000',
                strokeThickness: 4
            }).setOrigin(1, 0)

        //HEP
        this.depositHep = scene.add.text(frame_result_x_position + 215, frame_search_y_position + 150, "HEP", {
            fontFamily: 'Arial',
            fontSize: '22px',
            color: 'white',
            fontStyle: 'bold'
        })


        //구입 골드
        this.buyGold = scene.add.text(frame_result_x_position + 20, frame_search_y_position + 200, "| 구입 골드", {
            fontFamily: 'Arial',
            fontSize: '21px',
            color: 'white',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 4
        })

        this.buyGoldBG = scene.add.graphics()
            .fillStyle(0x333333) // 채우기 색상 설정
            .fillRoundedRect(frame_result_x_position + 40, frame_search_y_position + 230, 240, 55, 5) // round rectangle 그리기
            .lineStyle(2, 0x000000) // 선 스타일 설정 (선 두께, 선 색상)
            .strokeRoundedRect(frame_result_x_position + 40, frame_search_y_position + 230, 240, 55, 5) // round rectangle 테두리 그리기
            .setScrollFactor(0)
        this.buyGoldQuantaty = scene.add.text(frame_result_x_position + frame_result_width / 2 + 40, frame_search_y_position + 240, "0",
            {
                fontFamily: 'Arial',
                fontSize: '32px',
                color: 'yellow',
                fontStyle: 'bold',
                stroke: '#000000',
                strokeThickness: 4
            }).setOrigin(1, 0)

        //골드
        this.buyGoldText = scene.add.text(frame_result_x_position + 215, frame_search_y_position + 250, "골드", {
            fontFamily: 'Arial',
            fontSize: '22px',
            color: 'white',
            fontStyle: 'bold'
        })

        //구매하기
        shape = new Phaser.Geom.Rectangle(frame_result_x_position + 40, frame_search_y_position + 320, 240, 55, 5);
        this.buyButton = scene.add.graphics()
            .fillStyle(0xA5C72A) // 채우기 색상 설정
            .fillRoundedRect(frame_result_x_position + 40, frame_search_y_position + 320, 240, 55, 5) // round rectangle 그리기
            .lineStyle(2, 0xA5C72A) // 선 스타일 설정 (선 두께, 선 색상)
            .strokeRoundedRect(frame_result_x_position + 40, frame_search_y_position + 320, 240, 55, 5) // round rectangle 테두리 그리기
            .setScrollFactor(0)
            .setInteractive(shape, Phaser.Geom.Rectangle.Contains)
            .on('pointerup', () => {
                console.log(this.selectedSellingitemInfo)
                console.log(this.quantatyText)
                
                if(this.selectedSellingitemInfo==null || this.quantatyText.text=="")
                {
                    return
                }
                const trx_data = [
                    {
                      action_account: "eosio.token",
                      action_name: "transfer",
                      data: {
                        from: localStorage.getItem('account_name'),
                        to: this.selectedSellingitemInfo.user.user_name,
                        quantity: this.quantatyText.text+".0000 HEP",
                        memo: "send",
                      },
                    },
                  ];    
                console.log(trx_data)
                
                
                document.getElementById("auth_name_for_multi").value =localStorage.getItem('account_name');
                document.getElementById("datas_for_multi").value = JSON.stringify(trx_data);
                document.getElementById("transactions").click()
                
            })

        //구매하기 버튼 텍스트
        this.buyButtonText = scene.add.text(frame_result_x_position + 160, frame_search_y_position + 335, "거래신청", {
            fontFamily: 'Arial',
            fontSize: '27px',
            color: 'white',
            fontStyle: 'bold',
        }).setOrigin(0.5, 0)


        this.prompt = new Prompt(scene, width / 5, (height / 2), width * 5 / 8, height * 1.2 / 10)
            .setVisible(false)

        this.add([

            this.button_tl, this.button_tc, this.button_tr,
            this.button_cl, this.button_c, this.button_cr,
            this.button_br,
            this.tab_tc, this.tab_tr,
            this.tab_cl, this.tab_c, this.tab_cr,
            this.tab_bl, this.tab_bc, this.tab_br,
            this.searchFrame, this.resultFrame,
            this.goldText, this.quantaty, this.quantatyInput, this.quantatyText,
            /*
            this.recomend1, this.recomend2, this.recomend3, this.recomend4,
            this.average1, this.average2, this.average3, this.average4,*/
            this.depositBG, this.buyGold, this.buyGoldBG,
            this.buyGoldQuantaty, this.buyGoldText,
            this.deposit, this.depositQuantaty, this.depositHep, this.buyButton, this.buyButtonText
            , this.prompt


        ])



    }

    BuyGoldRequest() {
        const url = this.scene.APIurl + 'cft'
        const postData = {
            "cft_auction_id": this.selectedSellingitemInfo.cft_auction_id,
            "cft": parseInt(this.quantatyText.text),
        }

        console.log(url)
        console.log(postData)
        //요청 보내기
        fetch(url, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.scene.accessToken
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
                this.scene.market.gold+=parseInt(this.quantatyText.text)
                this.scene.market.goldText.text=this.scene.market.gold.toLocaleString()
                this.renew()
                this.prompt.show("토큰 전송. 골드 구매가 완료되었습니다.")
            })
            .catch(error => {
                console.error('There was a problem with the request:', error);
            });
    }


    getCFTLists() {
        const url = this.scene.APIurl + 'cft?page=1&cft_price=1'
        //요청 보내기
        fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log(data)
                this.page_count = Math.ceil((data.count) / 6);
                this.nowPage = 1;
                this.condition = '&cft_price=1'
                this.pageText.text = "1 / " + this.page_count
                this.pageText.setVisible(true)
                if (this.page_count > 1) {
                    this.next_page.setVisible(true)
                    this.before_page.setVisible(true)
                }

                for (let i = 0; i < this.sellItems.length; i++) {
                    this.sellItems[i].setVisible(false);
                }
                for (let i = 0; i < this.sellItems.length; i++) {
                    this.sellItems[i].setInfo(data.auctions[i]);
                    this.sellItems[i]
                        .on('pointerup', () => {
                            this.selectedSellingitemInfo = data.auctions[i];
                        })
                        .setVisible(true);
                    //뷰 추가
                    this.bringToTop(this.prompt);
                }

            })
            .catch(error => {
                console.error('There was a problem with the POST request:', error);
            });
    }

    order(condition) {
        const url = this.scene.APIurl + 'cft?page=1' + condition

        //요청 보내기
        fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log(data)
                this.nowPage = 1;
                this.condition = condition
                this.pageText.text = "1 / " + this.page_count
                this.pageText.setVisible(true)
                if (this.page_count > 1) {
                    this.next_page.setVisible(true)
                    this.before_page.setVisible(true)
                }
                for (let i = 0; i < this.sellItems.length; i++) {
                    this.sellItems[i].setVisible(false);
                }
                for (let i = 0; i < this.sellItems.length; i++) {
                    this.sellItems[i].setInfo(data.auctions[i]);
                    this.sellItems[i]
                        .on('pointerup', () => {
                            this.selectedSellingitemInfo = data.auctions[i];
                        })
                        .setVisible(true);
                    //뷰 추가
                    this.bringToTop(this.prompt);
                }

            })
            .catch(error => {
                console.error('There was a problem with the POST request:', error);
            });
    }

    paging(before) {
        if (before == true) {
            if (this.nowPage == 1) {
                this.nowPage = this.page_count
            } else {
                this.nowPage--
            }
        } else {
            this.nowPage++;
            if (this.nowPage > this.page_count) {
                this.nowPage = 1
            }
        }



        const url = this.scene.APIurl + 'cft?page=' + this.nowPage + this.condition
        //요청 보내기
        fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                this.pageText.text = this.nowPage + " / " + this.page_count
                for (let i = 0; i < this.sellItems.length; i++) {
                    this.sellItems[i].setVisible(false);
                }
                for (let i = 0; i < data.auctions.length; i++) {
                    this.sellItems[i].setInfo(data.auctions[i]);
                    this.sellItems[i]
                        .on('pointerup', () => {
                            this.selectedSellingitemInfo = data.auctions[i];
                        })
                        .setVisible(true);
                    //뷰 추가
                    this.bringToTop(this.prompt);
                }
            })


    }

    renew()
    {
        const url = this.scene.APIurl + 'cft?page=' + this.nowPage + this.condition
        //요청 보내기
        fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                this.pageText.text = this.nowPage + " / " + this.page_count
                for (let i = 0; i < this.sellItems.length; i++) {
                    this.sellItems[i].setVisible(false);
                }
                for (let i = 0; i < data.auctions.length; i++) {
                    this.sellItems[i].setInfo(data.auctions[i]);
                    this.sellItems[i]
                        .on('pointerup', () => {
                            this.selectedSellingitemInfo = data.auctions[i];
                        })
                        .setVisible(true);
                    //뷰 추가
                    this.bringToTop(this.prompt);
                }
            })

    }
    
}


class SelectedSellingItem extends Phaser.GameObjects.Container {

    // scene : 박스 UI가 추가될 씬
    // x, y 박스 위치 시작점
    // width, height 박스의 길이와 높이
    // scale : 박스를 구성하는 UI들의 스케일


    constructor(scene, x, y, width, height) {
        super(scene);

        scene.add.existing(this);

        this.setDepth(100);

        // 사각형의 각 꼭짓점에 select box UI 추가
        this.topLeft = scene.add.image(x, y, 'selectbox_tl');
        this.topLeft.setOrigin(0, 0).setScale(2);

        this.topRight = scene.add.image(x + width, y, 'selectbox_tr');
        this.topRight.setOrigin(1, 0).setScale(2);

        this.bottomLeft = scene.add.image(x, y + height, 'selectbox_bl');
        this.bottomLeft.setOrigin(0, 1).setScale(2);

        this.bottomRight = scene.add.image(x + width, y + height, 'selectbox_br');
        this.bottomRight.setOrigin(1, 1).setScale(2);


        this.add(this.topLeft);
        this.add(this.topRight);
        this.add(this.bottomLeft);
        this.add(this.bottomRight);

    }
    gb
}


