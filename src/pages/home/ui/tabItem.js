import Phaser from "phaser";
import Frame from '../ui/frame';
import SearchItem from './searchItem';
import BuyConfirm from "../ui/buyConfirm";


export default class TabItem extends Phaser.GameObjects.Container {

    //테두리

    enable() {
        this.setVisible(true);
    }
    disable() {

        this.setVisible(false);
    }
    constructor(scene, x, y, width, height, index, name) {

        super(scene);

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




        if (index == 0) {
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

            //검색창 프레임
            const frame_search_width = 300;
            const frame_search_height = height - 190;
            const frame_search_x_position = 35;
            const frame_search_y_position = 155;
            this.searchFrame = new Frame(scene, frame_search_x_position, frame_search_y_position,
                frame_search_width, frame_search_height);

            //아이템 이름 텍스트
            this.itemNameText = scene.add.text(frame_search_x_position + 18, frame_search_y_position + 18, "아이템이름", {
                fontFamily: 'Arial',
                fontSize: '17px',
                color: 'white',
                fontStyle: 'bold'
            })




            this.searchItem_name = scene.add.text(frame_search_x_position + 22, frame_search_y_position + 48, '', {
                fixedWidth: 250,
                fixedHeight: 36,
                fontSize: '25px',
                color: 'black',
                fontStyle: 'bold'
            })
                .setOrigin(0, -0.3)


            this.searchBox = scene.add.graphics()
                .fillStyle(0xffffff) // 채우기 색상 설정
                .fillRoundedRect(frame_search_x_position + 16, frame_search_y_position + 48, frame_search_width - 35, 50, 5) // round rectangle 그리기
                .lineStyle(2, 0x000000) // 선 스타일 설정 (선 두께, 선 색상)
                .strokeRoundedRect(frame_search_x_position + 16, frame_search_y_position + 48, frame_search_width - 35, 50, 5) // round rectangle 테두리 그리기
                .setScrollFactor(0)

            var shape = new Phaser.Geom.Rectangle(frame_search_x_position + 18, frame_search_y_position + 58,
                frame_search_width - 40, 50);
            this.searchBox.setInteractive(shape, Phaser.Geom.Rectangle.Contains);
            this.searchBox.on('pointerup', () => {
                scene.rexUI.edit(this.searchItem_name, {
                    y: 0,
                    placeholder: '아이템 이름 입력',
                    space: {
                        left: 10,
                        right: 10,
                    }


                });        // 여기에 클릭 시 실행할 작업을 추가할 수 있습니다.
            });
            //검색결과창 프레임
            const frame_result_width = width - frame_search_width - 85;
            const frame_result_height = height - 190;
            const frame_result_x_position = frame_search_x_position + frame_search_width + 15;
            const frame_result_y_position = 155;
            this.resultFrame = new Frame(scene, frame_result_x_position, frame_result_y_position,
                frame_result_width, frame_result_height);

            //검색결과 텍스트
            this.resultText = scene.add.text(frame_result_x_position + 18, frame_result_y_position + 18, "| 검색결과", {
                fontFamily: 'Arial',
                fontSize: '25px',
                color: 'white',
                fontStyle: 'bold'
            })

            //구매확인 패널
            this.buyConfirmFrame = new BuyConfirm(scene, frame_result_x_position, frame_result_y_position, frame_result_width, frame_result_height)
                .setVisible(false)
            /*
            this.buyConfirmFrame = new Frame(scene, width/2, height/3,
                width/3, height/2)
                */
            /*.setVisible(false)*/


            //구매하기
            shape = new Phaser.Geom.Rectangle(width - 700, height - 100,
                frame_search_width - 35, 50);
            this.buyButton = scene.add.graphics()
                .fillStyle(0xA5C72A) // 채우기 색상 설정
                .fillRoundedRect(width - 700, height - 100, frame_search_width - 35, 50, 3) // round rectangle 그리기
                .lineStyle(2, 0xA5C72A) // 선 스타일 설정 (선 두께, 선 색상)
                .strokeRoundedRect(width - 700, height - 100, frame_search_width - 35, 50, 3) // round rectangle 테두리 그리기
                .setScrollFactor(0)
                .setInteractive(shape, Phaser.Geom.Rectangle.Contains)
                .on('pointerup', () => {


                    const postData = {

                        accountName: 'chul1'/*,
                        key2: 'value2'*/

                    };
                    const url = 'https://jsonplaceholder.typicode.com/todos/1'
                    // POST 요청 보내기
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
                            // POST 요청에 대한 응답 처리
                            console.log('구매하기 버튼 누름');
                            this.buyConfirmFrame.setVisible(true);
                            this.buyConfirmFrame.SelectedItemInfo(this.selectedSellingitemInfo);
                            this.buyConfirmFrame.sendToBack();
                        })
                        .catch(error => {
                            // 오류 처리
                            console.error('There was a problem with the POST request:', error);
                        });

                    /*
                    fetch(url)
                    .then(response => response.json())
                    .then(json => console.log(json))
                    */
                })
                .setVisible(false);
            //구매하기 버튼 텍스트

            this.buyButtonText = scene.add.text(width - 700 + ((frame_search_width - 35) / 2), height - 90, "구매하기", {
                fontFamily: 'Arial',
                fontSize: '27px',
                color: 'white',
                fontStyle: 'bold',
            }).setOrigin(0.5, 0)
                .setVisible(false)



            //판매아이템 선택
            this.selectedSellingItem = new SelectedSellingItem(scene, frame_result_x_position + 12, 227, frame_result_width - 28, 80, 0);
            this.selectedSellingItem.setVisible(false)
            //검색결과 아이템들
            this.searchResultItems = [];

            //검색결과
            this.count = 0;
            //검색하기 버튼
            shape = new Phaser.Geom.Rectangle(frame_search_x_position + 16, height - 500,
                frame_search_width - 35, 50);
            this.searchButton = scene.add.graphics()
                .fillStyle(0xA5C72A) // 채우기 색상 설정
                .fillRoundedRect(frame_search_x_position + 16, height - 500, frame_search_width - 35, 50, 3) // round rectangle 그리기
                .lineStyle(2, 0xA5C72A) // 선 스타일 설정 (선 두께, 선 색상)
                .strokeRoundedRect(frame_search_x_position + 16, height - 500, frame_search_width - 35, 50, 3) // round rectangle 테두리 그리기
                .setScrollFactor(0)
                .setInteractive(shape, Phaser.Geom.Rectangle.Contains)
                .on('pointerup', () => {


                    const url = 'http://221.148.25.234:1234/auction?search_keyword=' + this.searchItem_name.text + '&item_name=1&item_price=0&page=1'

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

                            this.page_count=Math.ceil((data.count)/7);
                            this.nowPage=1;
                            this.order='&item_name=1&item_price=0'
                            this.pageText.text="1 / "+this.page_count
                            this.pageText.setVisible(true)
                            if(this.page_count>1)
                            {
                                this.next_page.setVisible(true)
                                this.before_page.setVisible(true)
                            }
                                
                            for (let i = 0; i < this.searchItems.length; i++) {
                                this.searchItems[i].setVisible(false);
                            }
                            for (let i = 0; i < data.auctions.length; i++) {
                                this.searchItems[i].setInfo(data.auctions[i]);
                                this.searchItems[i]
                                    .on('pointerup', () => {                               
                                        this.selectedSellingitemInfo = data.auctions[i];                                      
                                    })
                                    .setVisible(true);
                                //뷰 추가
                                this.bringToTop(this.buyConfirmFrame);
                            }


                        })
                        .catch(error => {
                            console.error('There was a problem with the POST request:', error);
                        });

                });

            //검색한 결과 틀
            this.searchItems=[]
            for (let i = 0; i < 6; i++) {
                this.newItem = new SearchItem(scene, frame_result_width, frame_result_x_position, this.count);
                shape = new Phaser.Geom.Rectangle(frame_result_x_position + 18, 235 + (this.count * 70),
                    frame_result_width - 40, 70);
                this.newItem
                    .setInteractive(shape, Phaser.Geom.Rectangle.Contains)
                    .on('pointerup', () => {

                        console.log(i + "번째 아이템 클릭~");
                        this.selectedSellingItem.y = (i * 70)
                        this.selectedSellingItem.setVisible(true)
                        this.buyButton.setVisible(true)
                        this.buyButtonText.setVisible(true)
                    });
                this.searchItems.push(this.newItem);
                this.count++
                //뷰 추가
                this.bringToTop(this.buyConfirmFrame);

            }


            //검색하기 버튼 텍스트
            this.searchButtonText = scene.add.text(frame_search_x_position + 18 + ((frame_search_width - 35) / 2), height - 490, "검색시작", {
                fontFamily: 'Arial',
                fontSize: '27px',
                color: 'white',
                fontStyle: 'bold',
            }).setOrigin(0.5, 0)

            const categoryTextType = {
                fontFamily: 'Arial',
                fontSize: '16px',
                color: 'white',
                fontStyle: 'bold'
            }
            //검색결과 아이템 이름
            this.category_itemName_text = scene.add.text(frame_result_x_position + 190, frame_result_y_position + 55, "아이템 이름", categoryTextType)
            //정렬을 위한 인디케이터
            this.itemNameArrange_up = scene.add.image(frame_result_x_position + 285, frame_result_y_position + 58, 'indicator')
                .setScrollFactor(0)
                .setDisplaySize(10, -10)
                .setInteractive()
                .on('pointerup', () => {


                    const url = 'http://221.148.25.234:1234/auction?search_keyword=' + this.searchItem_name.text + '&item_name=1&item_price=0&page=1'
                    //보내기
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
                            this.nowPage=1;
                            this.order='&item_name=1&item_price=0'
                            this.pageText.text="1 / "+this.page_count
                            for (let i = 0; i < this.searchItems.length; i++) {
                                this.searchItems[i].setVisible(false);
                            }
                            for (let i = 0; i < data.auctions.length; i++) {
                                this.searchItems[i].setInfo(data.auctions[i]);
                                this.searchItems[i]
                                    .on('pointerup', () => {                               
                                        this.selectedSellingitemInfo = data.auctions[i];                                      
                                    })
                                    .setVisible(true);
                                //뷰 추가
                                this.bringToTop(this.buyConfirmFrame);
                            }
                        })
                });

            this.itemNameArrange_down = scene.add.image(frame_result_x_position + 285, frame_result_y_position + 68, 'indicator')
                .setScrollFactor(0)
                .setInteractive()
                .setDisplaySize(10, 10)
                .on('pointerup', () => {
                    const url = 'http://221.148.25.234:1234/auction?search_keyword=' + this.searchItem_name.text + '&item_name=0&page=1'
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
                            this.nowPage=1;
                            this.order='&item_name=0'
                            this.pageText.text="1 / "+this.page_count
                            for (let i = 0; i < this.searchItems.length; i++) {
                                this.searchItems[i].setVisible(false);
                            }
                            for (let i = 0; i < data.auctions.length; i++) {
                                this.searchItems[i].setInfo(data.auctions[i]);
                                this.searchItems[i]
                                    .on('pointerup', () => {                               
                                        this.selectedSellingitemInfo = data.auctions[i];                                      
                                    })
                                    .setVisible(true);
                                //뷰 추가
                                this.bringToTop(this.buyConfirmFrame);
                            }
                        })
                });


            this.category_count_text = scene.add.text(frame_result_x_position + 380, frame_result_y_position + 55, "개수", categoryTextType)
            this.category_Price_text = scene.add.text(frame_result_x_position + 540, frame_result_y_position + 55, "개당 가격", categoryTextType)
            //정렬을 위한 인디케이터
            this.itemPriceArrange_up = scene.add.image(frame_result_x_position + 620, frame_result_y_position + 58, 'indicator')
                .setScrollFactor(0)
                .setDisplaySize(10, -10)
                .setInteractive()
                .on('pointerup', () => {
                    const url = 'http://221.148.25.234:1234/auction?search_keyword=' + this.searchItem_name.text + '&item_price=1&page=1'
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
                            this.nowPage=1;
                            this.order='&item_price=1'
                            this.pageText.text="1 / "+this.page_count
                            for (let i = 0; i < this.searchItems.length; i++) {
                                this.searchItems[i].setVisible(false);
                            }
                            for (let i = 0; i < data.auctions.length; i++) {
                                this.searchItems[i].setInfo(data.auctions[i]);
                                this.searchItems[i]
                                    .on('pointerup', () => {                               
                                        this.selectedSellingitemInfo = data.auctions[i];                                      
                                    })
                                    .setVisible(true);
                                //뷰 추가
                                this.bringToTop(this.buyConfirmFrame);
                            }
                        })
                });

            this.itemPriceArrange_down = scene.add.image(frame_result_x_position + 620, frame_result_y_position + 68, 'indicator')
                .setScrollFactor(0)
                .setInteractive()
                .setDisplaySize(10, 10)
                .on('pointerup', () => {
                    const url = 'http://221.148.25.234:1234/auction?search_keyword=' + this.searchItem_name.text + '&item_price=0&page=1'
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
                            this.nowPage=1;
                            this.order='&item_price=0'
                            this.pageText.text="1 / "+this.page_count
                            for (let i = 0; i < this.searchItems.length; i++) {
                                this.searchItems[i].setVisible(false);
                            }
                            for (let i = 0; i < data.auctions.length; i++) {
                                this.searchItems[i].setInfo(data.auctions[i]);
                                this.searchItems[i]
                                    .on('pointerup', () => {                               
                                        this.selectedSellingitemInfo = data.auctions[i];                                      
                                    })
                                    .setVisible(true);
                                //뷰 추가
                                this.bringToTop(this.buyConfirmFrame);
                            }
                        })
                });

            
            //아이템 페이징을 위한 인디케이터
            this.before_page= scene.add.image(frame_result_x_position + 410, frame_result_y_position+frame_search_height-90, 'before')
            .setScrollFactor(0)
            .setInteractive()
            .setDisplaySize(23, 23)
            .on('pointerup', () => {
                if(this.nowPage==1)
                {
                    this.nowPage=this.page_count
                }else
                {
                    this.nowPage--
                }
                
                const url = 'http://221.148.25.234:1234/auction?search_keyword=' + this.searchItem_name.text + this.order+'&page='+this.nowPage
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
                        this.pageText.text=this.nowPage+" / "+this.page_count
                        for (let i = 0; i < this.searchItems.length; i++) {
                            this.searchItems[i].setVisible(false);
                        }
                        for (let i = 0; i < data.auctions.length; i++) {
                            this.searchItems[i].setInfo(data.auctions[i]);
                            this.searchItems[i]
                                .on('pointerup', () => {                               
                                    this.selectedSellingitemInfo = data.auctions[i];                                      
                                })
                                .setVisible(true);
                            //뷰 추가
                            this.bringToTop(this.buyConfirmFrame);
                        }
                    })
            }).setVisible(false);
            
            this.pageText = scene.add.text(frame_result_x_position + 453, frame_result_y_position+frame_search_height-102, "5 / 10", {
                fontFamily: 'Arial',
                fontSize: '22px',
                color: 'white',
                fontStyle: 'bold'
            }).setVisible(false)

            //아이템 페이징을 위한 인디케이터
            this.next_page= scene.add.image(frame_result_x_position + 540, frame_result_y_position+frame_search_height-90, 'next')
            .setScrollFactor(0)
            .setInteractive()
            .setDisplaySize(23, 23)
            .on('pointerup', () => {
                this.nowPage++;
                if(this.nowPage>this.page_count)
                {
                    this.nowPage=1
                }
                const url = 'http://221.148.25.234:1234/auction?search_keyword=' + this.searchItem_name.text + this.order+'&page='+this.nowPage
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
                        this.pageText.text=this.nowPage+" / "+this.page_count
                        for (let i = 0; i < this.searchItems.length; i++) {
                            this.searchItems[i].setVisible(false);
                        }
                        for (let i = 0; i < data.auctions.length; i++) {
                            this.searchItems[i].setInfo(data.auctions[i]);
                            this.searchItems[i]
                                .on('pointerup', () => {                               
                                    this.selectedSellingitemInfo = data.auctions[i];                                      
                                })
                                .setVisible(true);
                            //뷰 추가
                            this.bringToTop(this.buyConfirmFrame);
                        }
                    })
            }).setVisible(false);        


            this.category_totalPrice_text = scene.add.text(frame_result_x_position + 770, frame_result_y_position + 55, "총 가격", categoryTextType)




        } else if (index == 1) {
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
        } else if (index == 2) {
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
        }




        // 자식 게임 오브젝트들 컨테이너에 추가
        if (index == 0) {

            this.add([

                this.button_tl, this.button_tc, this.button_tr,
                this.button_cl, this.button_c, this.button_cr,
                this.button_br,
                this.tab_tc, this.tab_tr,
                this.tab_cl, this.tab_c, this.tab_cr,
                this.tab_bl, this.tab_bc, this.tab_br,
                this.searchFrame, this.resultFrame, this.resultText, this.itemNameText, this.searchBox, this.searchItem_name,
                this.searchButton, this.searchButtonText,
                this.category_itemName_text, this.category_count_text, this.category_Price_text, this.category_totalPrice_text,
                this.selectedSellingItem,
                this.buyButton, this.buyButtonText,
                this.buyConfirmFrame,
                this.itemNameArrange_up, this.itemNameArrange_down, this.itemPriceArrange_up, this.itemPriceArrange_down,
                this.next_page,this.before_page,this.pageText
            ])
            for(let i=0;i<6;i++)
            {
                this.add([this.searchItems[i]])
                this.searchItems[i].setVisible(false)
            }

        } else if (index == 1) {

            this.add([

                this.tab_tl, this.tab_tc, this.tab_tr,
                this.tab_cl, this.tab_c, this.tab_cr,
                this.tab_bl, this.tab_bc, this.tab_br,
                this.button_tl, this.button_tc, this.button_tr,
                this.button_c, this.button_cr, this.button_cl,
                this.button_bl, this.button_br
            ])

        } else if (index == 2) {

            this.add([
                this.tab_tl, this.tab_tc, this.tab_tr,
                this.tab_cl, this.tab_c, this.tab_cr,
                this.tab_bl, this.tab_bc, this.tab_br,
                this.button_tl, this.button_tc, this.button_tr,
                this.button_c, this.button_cr, this.button_cl,
                this.button_bl, this.button_br
            ])

        }


    }

}


class SelectedSellingItem extends Phaser.GameObjects.Container {

    // scene : 박스 UI가 추가될 씬
    // x, y 박스 위치 시작점
    // width, height 박스의 길이와 높이
    // scale : 박스를 구성하는 UI들의 스케일


    constructor(scene, x, y, width, height, index) {
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
