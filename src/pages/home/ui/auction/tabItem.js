import Phaser from "phaser";
import Frame from '../frame/frame';
import SearchItem from './searchItem';
import BuyConfirm from "./buyConfirm";
import AuctionItem from "./auction_item"
import SellingItem from "./selling_item"
import CompleteItem from "./complete_item";
import Item from "../../elements/item";
import Prompt from './prompt';

export default class TabItem extends Phaser.GameObjects.Container {

    //테두리
    myItems = []
    myItemsData = []
    mySellingItemData = []
    scene

    reOrganize(index) {
        for (let i = index; i < this.mySellingItemCount; i++) {
            if (this.sellingItems[i + 1].sellingInfo != null) {
                this.mySellingItemData[i] = this.mySellingItemData[i + 1]
                this.sellingItems[i].setInfo(this.sellingItems[i + 1].sellingInfo)
                this.sellingItems[i].index = i               
            } else {
                this.sellingItems[i].setVisible(false)
            }
        }
        this.mySellingItemCount--
    }
    addSellingItem()
    {
        for (let i = this.mySellingItemCount-1; i >= 0; i--) {
            if (this.sellingItems[i].sellingInfo != null) {
                console.log("index : "+i)
                //this.mySellingItemData[i+1] = this.mySellingItemData[i]
                this.sellingItems[i+1].setInfo(this.sellingItems[i].sellingInfo)
                this.sellingItems[i+1].index = i
            } else {
                this.sellingItems[i + 1].setVisible(false)
            }
        }
    }

    enable() {
        this.setVisible(true);
    }
    disable() {

        this.setVisible(false);
    }

    setMyItems() {
        const url = this.scene.APIurl+'/item/own-item/' + this.scene.characterInfo.user_id

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
                for(let i = 0; i < 32; i++)
                {
                    this.myItems[i].disable()
                    this.myItems[i].itemInfo=null                 
                }
                for (let i = 0; i < data.length; i++) {
                    if (data[i].item.item_type != 3) {
                        this.myItems[i].setInfo(data[i].item,data[i].item_count)
                    }
                    this.myItemsData.push(data[i])
                }
            })
            .catch(error => {
                console.error('There was a problem with the POST request:', error);
            });
    }

    setMySellingItems() {
        const url = this.scene.APIurl+'/auction/sell/1'

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

    modifyItemInfo(remainItemCount) {
        this.selectedSellingitemInfo.item_count = remainItemCount;
        this.searchItems[this.selectedItemIndex].setInfo(this.selectedSellingitemInfo)
    }

    notice(mention) {
        this.prompt.show(mention)
    }

    constructor(scene, x, y, width, height, index, name) {

        super(scene);
        this.scene = scene
        // 씬의 디스플레이 목록에 추가하여 시각적으로 나타내게 한다.
        scene.add.existing(this);
        // UI 객체라서 물리 효과가 필요 없지만 테두리 확인할려고 추가
        //scene.physics.add.existing(this);

        this.prompt = new Prompt(scene, width / 4, (height / 2), width / 2, height * 1 / 10)
            .setVisible(false)
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


                });
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
                    this.buyConfirmFrame.setVisible(true);
                    this.buyConfirmFrame.SelectedItemInfo(this.selectedSellingitemInfo);
                    this.buyConfirmFrame.sendToBack();
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


                    const url = scene.APIurl+'/auction?search_keyword=' + this.searchItem_name.text + '&item_name=1&item_price=0&page=1'

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

                            this.page_count = Math.ceil((data.count) / 6);
                            this.nowPage = 1;
                            this.order = '&item_name=1&item_price=0'
                            this.pageText.text = "1 / " + this.page_count
                            this.pageText.setVisible(true)
                            if (this.page_count > 1) {
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
            this.searchItems = []
            for (let i = 0; i < 6; i++) {
                this.newItem = new SearchItem(scene, frame_result_width, frame_result_x_position, this.count);
                shape = new Phaser.Geom.Rectangle(frame_result_x_position + 18, 235 + (this.count * 70),
                    frame_result_width - 40, 70);
                this.newItem
                    .setInteractive(shape, Phaser.Geom.Rectangle.Contains)
                    .on('pointerup', () => {

                        this.selectedItemIndex = i;
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


                    const url = scene.APIurl+'/auction?search_keyword=' + this.searchItem_name.text + '&item_name=1&item_price=0&page=1'
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
                            this.nowPage = 1;
                            this.order = '&item_name=1&item_price=0'
                            this.pageText.text = "1 / " + this.page_count
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
                    const url = scene.APIurl+'/auction?search_keyword=' + this.searchItem_name.text + '&item_name=0&page=1'
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
                            this.nowPage = 1;
                            this.order = '&item_name=0'
                            this.pageText.text = "1 / " + this.page_count
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
                    const url = scene.APIurl+'/auction?search_keyword=' + this.searchItem_name.text + '&item_price=1&page=1'
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
                            this.nowPage = 1;
                            this.order = '&item_price=1'
                            this.pageText.text = "1 / " + this.page_count
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
                    const url = scene.APIurl+'/auction?search_keyword=' + this.searchItem_name.text + '&item_price=0&page=1'
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
                            this.nowPage = 1;
                            this.order = '&item_price=0'
                            this.pageText.text = "1 / " + this.page_count
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
            this.before_page = scene.add.image(frame_result_x_position + 410, frame_result_y_position + frame_search_height - 90, 'before')
                .setScrollFactor(0)
                .setInteractive()
                .setDisplaySize(23, 23)
                .on('pointerup', () => {
                    if (this.nowPage == 1) {
                        this.nowPage = this.page_count
                    } else {
                        this.nowPage--
                    }

                    const url = scene.APIurl+'/auction?search_keyword=' + this.searchItem_name.text + this.order + '&page=' + this.nowPage
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

            this.pageText = scene.add.text(frame_result_x_position + 453, frame_result_y_position + frame_search_height - 102, "5 / 10", {
                fontFamily: 'Arial',
                fontSize: '22px',
                color: 'white',
                fontStyle: 'bold'
            }).setVisible(false)

            //아이템 페이징을 위한 인디케이터
            this.next_page = scene.add.image(frame_result_x_position + 540, frame_result_y_position + frame_search_height - 90, 'next')
                .setScrollFactor(0)
                .setInteractive()
                .setDisplaySize(23, 23)
                .on('pointerup', () => {
                    this.nowPage++;
                    if (this.nowPage > this.page_count) {
                        this.nowPage = 1
                    }
                    const url = scene.APIurl+'/auction?search_keyword=' + this.searchItem_name.text + this.order + '&page=' + this.nowPage
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

            const url = scene.APIurl+'/auction?item_name=1&item_price=0&page=1'
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
                    this.page_count = Math.ceil((data.count) / 6);
                    this.nowPage = 1;
                    this.order = '&item_name=1&item_price=0'
                    this.pageText.text = "1 / " + this.page_count
                    this.pageText.setVisible(true)
                    if (this.page_count > 1) {
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


            //내아이템 목록 프레임            
            const frame_items_x_position = 35;
            const frame_items_y_position = 155;
            const frame_items_width = (width - frame_items_x_position) * 2.87 / 4;
            const frame_items_height = ((height - frame_items_y_position) / 2) - 40;
            this.myItemFrame = new Frame(scene, frame_items_x_position, frame_items_y_position,
                frame_items_width, frame_items_height);


            //아이템들            
            for (let i = 0; i < 32; i++) {
                //console.log("scene.inventory.itemSlots[i] : "+scene.inventory.itemSlots[i].name)

                this.auctionItem = new AuctionItem(scene, i)
                this.myItemFrame.add(this.auctionItem)
                this.myItems.push(this.auctionItem)

                const size = 80
                const x_position = 14 + ((i % 11) * (size + 7))
                const y_position = 14 + ((Math.floor(i / 11)) * (size + 7))

                //아이템 클릭이벤트 붙여줌;
                shape = new Phaser.Geom.Rectangle(x_position, y_position,
                    size, size);
                this.auctionItem
                    .setInteractive(shape, Phaser.Geom.Rectangle.Contains)
                    .on('pointerup', () => {
                        this.selected_myItem = i;
                        this.selectedItem.x = x_position
                        this.selectedItem.y = y_position
                        this.selectedItem.setVisible(true)
                        if (this.myItems[i].itemInfo != null) {
                            this.selectedItemName_text.text = this.myItems[i].itemInfo.item_name
                            this.item_image.setTexture(this.myItems[i].itemInfo.item_name)
                            this.enrollmentionBG.setVisible(false)
                        } else {
                            this.enrollmentionBG.setVisible(true)
                        }

                        /*
                        this.buyButton.setVisible(true)
                        this.buyButtonText.setVisible(true)
                        */
                    });
            }


            //선택한 아이템 표시 selectBox
            this.selectedItem = new SelectedSellingItem(scene, 0, 0, 80, 80, 0)
                .setVisible(false);
            this.myItemFrame.add(this.selectedItem)

            //this.selectedItem.setVisible(false)

            const frame_enroll_x_position = frame_items_x_position + frame_items_width + 40;
            const frame_enroll_y_position = 155;
            const frame_enroll_width = width - frame_items_width - 110;
            const frame_enroll_height = ((height - frame_enroll_y_position) / 2) - 40;
            this.enrollmentionBG = new Frame(scene, frame_enroll_x_position, frame_enroll_y_position,
                frame_enroll_width, frame_enroll_height);



            //아이템을 클릭해주세요
            this.pleaseSelectItemText = scene.add.text(frame_enroll_width / 2, frame_enroll_height / 2, "판매하실 아이템을 \n    클릭해주세요.", {
                fontFamily: 'Arial',
                fontSize: '33px',
                color: 'white',
                fontStyle: 'bold'
            }).setOrigin(0.5, 0.5)
            this.enrollmentionBG.add(this.pleaseSelectItemText)



            //아이템 등록 프레임            
            this.enrollFrame = new Frame(scene, frame_enroll_x_position, frame_enroll_y_position,
                frame_enroll_width, frame_enroll_height);




            //선택된 아이템 이미지
            const size = 100
            const x_position = 20
            const y_position = 20
            this.ItemBG = scene.add.graphics()
                .fillStyle(0xCCCCCCC) // 채우기 색상 설정
                .fillRoundedRect(x_position, y_position, size, size, 8) // round rectangle 그리기
                .lineStyle(2, 0x000000) // 선 스타일 설정 (선 두께, 선 색상)
                .strokeRoundedRect(x_position, y_position, size, size, 8) // round rectangle 테두리 그리기
                .setScrollFactor(0)


            this.item_image = scene.add.image(x_position + (size / 2), y_position + (size / 2), "사탕무")
                .setOrigin(0.5, 0.5)
                .setDisplaySize(size - 10, size - 10)


            //선택된 아이템 이름
            this.selectedItemName_text = scene.add.text(x_position + (size * 2), y_position + (size / 2), "사탕무", {
                fontFamily: 'Arial',
                fontSize: '33px',
                color: 'white',
                fontStyle: 'bold'
            }).setOrigin(0.5, 0.5)

            //판매 수량 텍스트
            this.sellingCount_text = scene.add.text(x_position + (size / 2), y_position + size + 15, "판매 수량", {
                fontFamily: 'Arial',
                fontSize: '15px',
                color: 'white',
                fontStyle: 'bold'
            }).setOrigin(0.5, 0.5)


            this.sellingCountInput_text = scene.add.text(x_position + 6, y_position + 130, '', {
                fixedWidth: 120,
                fixedHeight: 36,
                fontSize: '18px',
                color: 'black',
                fontStyle: 'bold'
            })
                .setOrigin(0, -0.4)


            this.countBox = scene.add.graphics()
                .fillStyle(0xffffff) // 채우기 색상 설정
                .fillRoundedRect(x_position, y_position + 130, size, 40, 5) // round rectangle 그리기
                .lineStyle(2, 0x000000) // 선 스타일 설정 (선 두께, 선 색상)
                .strokeRoundedRect(x_position, y_position + 130, size, 40, 5) // round rectangle 테두리 그리기
                .setScrollFactor(0)

            var shape = new Phaser.Geom.Rectangle(x_position, y_position + 140,
                size, 40);
            this.countBox.setInteractive(shape, Phaser.Geom.Rectangle.Contains);
            this.countBox.on('pointerup', () => {
                scene.rexUI.edit(this.sellingCountInput_text, {
                    y: 0,
                    placeholder: '수량',
                    space: {
                        left: 10,
                        right: 10,
                    }
                });
            });




            //판매 가격 텍스트
            this.sellingPrice_text = scene.add.text(x_position + (size * 2), y_position + size + 15, "판매 가격", {
                fontFamily: 'Arial',
                fontSize: '15px',
                color: 'white',
                fontStyle: 'bold'
            }).setOrigin(0.5, 0.5)

            this.sellingPriceInput_text = scene.add.text(x_position + 156, y_position + 130, '', {
                fixedWidth: 120,
                fixedHeight: 36,
                fontSize: '18px',
                color: 'black',
                fontStyle: 'bold'
            })
                .setOrigin(0, -0.4)


            this.priceBox = scene.add.graphics()
                .fillStyle(0xffffff) // 채우기 색상 설정
                .fillRoundedRect(x_position + 150, y_position + 130, size, 40, 5) // round rectangle 그리기
                .lineStyle(2, 0x000000) // 선 스타일 설정 (선 두께, 선 색상)
                .strokeRoundedRect(x_position + 150, y_position + 130, size, 40, 5) // round rectangle 테두리 그리기
                .setScrollFactor(0)

            var shape = new Phaser.Geom.Rectangle(x_position + 150, y_position + 130,
                size, 40);
            this.priceBox.setInteractive(shape, Phaser.Geom.Rectangle.Contains);
            this.priceBox.on('pointerup', () => {
                scene.rexUI.edit(this.sellingPriceInput_text, {
                    y: 0,
                    placeholder: '가격',
                    space: {
                        left: 10,
                        right: 10,
                    }
                });
            });



            //판매등록 버튼
            shape = new Phaser.Geom.Rectangle(x_position + 50, y_position + 190,
                155, 50);
            this.enrollButton = scene.add.graphics()
                .fillStyle(0xA5C72A) // 채우기 색상 설정
                .fillRoundedRect(x_position + 50, y_position + 190, 155, 50, 3) // round rectangle 그리기
                .lineStyle(2, 0xA5C72A) // 선 스타일 설정 (선 두께, 선 색상)
                .strokeRoundedRect(x_position + 50, y_position + 190, 155, 50, 3) // round rectangle 테두리 그리기
                .setScrollFactor(0)
                .setInteractive(shape, Phaser.Geom.Rectangle.Contains)
                .on('pointerup', () => {

                    const url = scene.APIurl+'/auction'
                    const postData = {
                        "item_id": this.myItems[this.selected_myItem].itemInfo.item_id,
                        "item_count": parseInt(this.sellingCountInput_text.text),
                        "item_price": parseInt(this.sellingPriceInput_text.text),
                    }

                    console.log("postData : " + JSON.stringify(postData))
                    //요청 보내기
                    fetch(url, {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer `+this.scene.accessToken,
                            'Content-Type': 'application/json'
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
                            //판매등록 성공했다는 다이얼로그 띄워줘야함
                            this.prompt.show("       아이템이 판매등록 완료되었습니다.")
                            //판매목록에 추가
                            const info = {
                                item: {
                                    item_name: this.myItems[this.selected_myItem].itemInfo.item_name
                                },
                                item_count: parseInt(this.sellingCountInput_text.text),
                                item_price: parseInt(this.sellingPriceInput_text.text),
                                fontStyle: 'bold'
                            }
                            //this.sellingItems[this.sellingItemCount].setInfo(info)
                            //this.addSellingItem()
                            //this.sellingItems[0].setInfo(info)
                            this.mySellingItemCount++
                            

                            
                            

                            //아이템목록 갱신
                            this.setMyItems()
                            //판매중 아이템 갱신
                            this.setMySellingItems()

                            //인벤토리 아이템 갯수 변경
                            //인벤토리창에서 뺴줘야함
                            this.itemSlot=scene.findAddItemSlot(info.item.item_name)
                            this.itemSlot.useItem(parseInt(this.sellingCountInput_text.text))
                            

                            this.sellingCountInput_text.text = ""
                            this.sellingPriceInput_text.text = ""
                            
                        })
                        .catch(error => {
                            console.error('There was a problem with the POST request:', error);
                        });
                });

            //판매등록 버튼 텍스트
            this.enrollButtonText = scene.add.text(x_position + 125, y_position + 202, "판매등록", {
                fontFamily: 'Arial',
                fontSize: '27px',
                color: 'white',
                fontStyle: 'bold',
            }).setOrigin(0.5, 0)


            this.enrollFrame.add([this.sellingCount_text, this.ItemBG, this.item_image, this.selectedItemName_text,
            this.countBox, this.sellingCountInput_text,
            this.sellingPrice_text, this.priceBox, this.sellingPriceInput_text,
            this.enrollButton, this.enrollButtonText])


            //판매중 아이템 프레임  
            const frame_selling_x_position = 35;
            const frame_selling_y_position = 165 + frame_enroll_height;
            const frame_selling_width = width - 70;
            const frame_selling_height = (height - frame_items_height) - 200;
            this.sellingFrame = new Frame(scene, frame_selling_x_position, frame_selling_y_position,
                frame_selling_width, frame_selling_height);

            this.sellingItems = []
            for (let i = 0; i < 9; i++) {
                this.sellingItem = new SellingItem(scene, i)
                this.sellingFrame.add(this.sellingItem)
                this.sellingItems.push(this.sellingItem)
                this.sellingItem.setVisible(false)
            }


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


            //전체기록 버튼
            this.completeButtons = []
            this.completeButtonTexts = []

            shape = new Phaser.Geom.Rectangle(40, 153, 80, 45);
            this.wholeLogButton = scene.add.graphics()
                .fillStyle(0x000000) // 채우기 색상 설정
                .fillRoundedRect(40, 153, 80, 45, 5) // round rectangle 그리기
                .lineStyle(2, 0xFFFFFF) // 선 스타일 설정 (선 두께, 선 색상)
                .strokeRoundedRect(40, 153, 80, 45, 5) // round rectangle 테두리 그리기
                .setScrollFactor(0)
                .setInteractive(shape, Phaser.Geom.Rectangle.Contains)
                .on('pointerup', () => {
                    this.nowCompletePage = 1
                    const url = scene.APIurl+'/auction/transaction-all/' + this.nowCompletePage

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
                            this.completePageCount = Math.ceil((data.count) / 6);
                            this.completeType = 0
                            this.completePageText.text = "1 / " + this.completePageCount
                            if (this.completePageCount > 1) {
                                this.complete_next_page.setVisible(true)
                                this.completePageText.setVisible(true)
                                this.complete_before_page.setVisible(true)
                            } else {
                                this.complete_next_page.setVisible(false)
                                this.completePageText.setVisible(false)
                                this.complete_before_page.setVisible(false)
                            }
                            for (let i = 0; i < 6; i++) {
                                this.completeItems[i].setVisible(false)
                            }
                            for (let i = 0; i < data.result.length; i++) {
                                this.completeItems[i].setVisible(true)
                                this.completeItems[i].setInfo(data.result[i], 0)
                            }
                            for(let i=0;i<3;i++)
                            {
                                this.disableTexts[i].setVisible(true)
                                this.disableButtons[i].setVisible(true)
                            }
                            this.disableTexts[0].setVisible(false)
                            this.disableButtons[0].setVisible(false)

                                

                        })
                        .catch(error => {
                            console.error('There was a problem with the POST request:', error);
                        });
                });



            //전체기록 버튼 텍스트
            this.wholeLogButtonText = scene.add.text(79, 161, "전체", {
                fontFamily: 'Arial',
                fontSize: '27px',
                color: 'white',
                fontStyle: 'bold',
            }).setOrigin(0.5, 0)



            //판매완료 버튼
            shape = new Phaser.Geom.Rectangle(140, 153,
                80, 45);
            this.soldButton = scene.add.graphics()
                .fillStyle(0x000000) // 채우기 색상 설정
                .fillRoundedRect(140, 153, 80, 45, 5) // round rectangle 그리기
                .lineStyle(2, 0xFFFFFF) // 선 스타일 설정 (선 두께, 선 색상)
                .strokeRoundedRect(140, 153, 80, 45, 5) // round rectangle 테두리 그리기
                .setScrollFactor(0)
                .setInteractive(shape, Phaser.Geom.Rectangle.Contains)
                .on('pointerup', () => {
                    this.nowCompletePage = 1
                    const url = scene.APIurl+'/auction/sell-complete/' + this.nowCompletePage

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
                            this.completePageCount = Math.ceil((data.count) / 6);
                            this.completeType = 1
                            this.completePageText.text = "1 / " + this.completePageCount
                            if (this.completePageCount > 1) {
                                this.complete_next_page.setVisible(true)
                                this.completePageText.setVisible(true)
                                this.complete_before_page.setVisible(true)
                            } else {
                                this.complete_next_page.setVisible(false)
                                this.completePageText.setVisible(false)
                                this.complete_before_page.setVisible(false)
                            }
                            for (let i = 0; i < 6; i++) {
                                this.completeItems[i].setVisible(false)
                            }
                            for (let i = 0; i < data.result.length; i++) {
                                this.completeItems[i].setVisible(true)
                                this.completeItems[i].setInfo(data.result[i], 1)
                            }
                            for(let i=0;i<3;i++)
                            {
                                this.disableTexts[i].setVisible(true)
                                this.disableButtons[i].setVisible(true)
                            }
                            this.disableTexts[1].setVisible(false)
                            this.disableButtons[1].setVisible(false)
                        })
                        .catch(error => {
                            console.error('There was a problem with the POST request:', error);
                        });


                });

            //판매완료 버튼 텍스트
            this.soldButtonText = scene.add.text(179, 161, "판매", {
                fontFamily: 'Arial',
                fontSize: '27px',
                color: 'white',
                fontStyle: 'bold',
            }).setOrigin(0.5, 0)


            //구매완료 버튼
            shape = new Phaser.Geom.Rectangle(240, 153,
                80, 45);
            this.boughtButton = scene.add.graphics()
                .fillStyle(0x000000) // 채우기 색상 설정
                .fillRoundedRect(240, 153, 80, 45, 5) // round rectangle 그리기
                .lineStyle(2, 0xFFFFFF) // 선 스타일 설정 (선 두께, 선 색상)
                .strokeRoundedRect(240, 153, 80, 45, 5) // round rectangle 테두리 그리기
                .setScrollFactor(0)
                .setInteractive(shape, Phaser.Geom.Rectangle.Contains)
                .on('pointerup', () => {
                    this.nowCompletePage = 1
                    const url = scene.APIurl+'/auction/purchase/' + this.nowCompletePage

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
                            this.completePageCount = Math.ceil((data.count) / 6);
                            this.completeType = 2
                            this.completePageText.text = "1 / " + this.completePageCount
                            if (this.completePageCount > 1) {
                                this.complete_next_page.setVisible(true)
                                this.completePageText.setVisible(true)
                                this.complete_before_page.setVisible(true)
                            } else {
                                this.complete_next_page.setVisible(false)
                                this.completePageText.setVisible(false)
                                this.complete_before_page.setVisible(false)
                            }
                            for (let i = 0; i < 6; i++) {
                                this.completeItems[i].setVisible(false)
                            }
                            for (let i = 0; i < data.result.length; i++) {
                                this.completeItems[i].setVisible(true)
                                this.completeItems[i].setInfo(data.result[i], 2)
                            }

                            for(let i=0;i<3;i++)
                            {
                                this.disableTexts[i].setVisible(true)
                                this.disableButtons[i].setVisible(true)
                            }
                            this.disableTexts[2].setVisible(false)
                            this.disableButtons[2].setVisible(false)
                        })
                        .catch(error => {
                            console.error('There was a problem with the POST request:', error);
                        });

                });

            //구매완료 버튼 텍스트
            this.boughtButtonText = scene.add.text(279, 161, "구매", {
                fontFamily: 'Arial',
                fontSize: '27px',
                color: 'white',
                fontStyle: 'bold',
            }).setOrigin(0.5, 0)

            //완료 아이템목록 프레임  
            const frame_complete_x_position = 35;
            const frame_complete_y_position = 205;
            const frame_complete_width = width - 70;
            const frame_complete_height = height - 240;
            this.completeFrame = new Frame(scene, frame_complete_x_position, frame_complete_y_position,
                frame_complete_width, frame_complete_height);

            const headerTextConfig = {
                fontFamily: 'Arial',
                fontSize: '17px',
                color: 'white',
                fontStyle: 'bold'
            }

            this.itemAction = scene.add.text(50, 18, "거래", headerTextConfig)
            this.itemTimeText = scene.add.text(195, 18, "거래시간", headerTextConfig)
            this.itemNameText = scene.add.text(460, 18, "아이템이름", headerTextConfig)
            this.itemCountText = scene.add.text(730, 18, "개수", headerTextConfig)
            this.itemPriceText = scene.add.text(960, 18, "개당가격", headerTextConfig)
            this.itemTotalText = scene.add.text(1190, 18, "총가격", headerTextConfig)
            this.completeFrame.add([this.itemAction, this.itemTimeText, this.itemNameText, this.itemCountText, this.itemPriceText, this.itemTotalText])

            this.completeItems = []
            for (let i = 0; i < 6; i++) {
                this.completeItem = new CompleteItem(scene, i)
                this.completeFrame.add(this.completeItem)
                this.completeItems.push(this.completeItem)
                this.completeItem.setVisible(false)
            }
            this.completeButtons.push([this.wholeLogButton, this.soldButton, this.boughtButton])
            this.completeButtonTexts.push([this.wholeLogButtonText, this.soldButtonText, this.boughtButtonText])

            //활성화된 버튼을 보여주기위함
            this.disableTexts=[]
            this.disableText_1 = scene.add.text(79, 161, "전체", {
                fontFamily: 'Arial',
                fontSize: '27px',
                color: 'black',
                fontStyle: 'bold',
            }).setOrigin(0.5, 0)
            this.disableTexts.push(this.disableText_1)
            this.disableText_2 = scene.add.text(179, 161, "판매", {
                fontFamily: 'Arial',
                fontSize: '27px',
                color: 'black',
                fontStyle: 'bold',
            }).setOrigin(0.5, 0)
            this.disableTexts.push(this.disableText_2)
            this.disableText_3 = scene.add.text(279, 161, "구매", {
                fontFamily: 'Arial',
                fontSize: '27px',
                color: 'black',
                fontStyle: 'bold',
            }).setOrigin(0.5, 0)
            this.disableTexts.push(this.disableText_3)

            this.disableButtons=[]
            this.disableButton_1 = scene.add.graphics()
                .fillStyle(0xFFFFFF) // 채우기 색상 설정
                .fillRoundedRect(40, 153, 80, 45, 5) // round rectangle 그리기
                .lineStyle(2, 0x000000) // 선 스타일 설정 (선 두께, 선 색상)
                .strokeRoundedRect(40, 153, 80, 45, 5) // round rectangle 테두리 그리기
                .setScrollFactor(0)
                this.disableButtons.push(this.disableButton_1)
                this.disableButton_2 = scene.add.graphics()
                .fillStyle(0xFFFFFF) // 채우기 색상 설정
                .fillRoundedRect(140, 153, 80, 45, 5) // round rectangle 그리기
                .lineStyle(2, 0x000000) // 선 스타일 설정 (선 두께, 선 색상)
                .strokeRoundedRect(140, 153, 80, 45, 5) // round rectangle 테두리 그리기
                .setScrollFactor(0)
                this.disableButtons.push(this.disableButton_2)
                this.disableButton_3 = scene.add.graphics()
                .fillStyle(0xFFFFFF) // 채우기 색상 설정
                .fillRoundedRect(240, 153, 80, 45, 5) // round rectangle 그리기
                .lineStyle(2, 0x000000) // 선 스타일 설정 (선 두께, 선 색상)
                .strokeRoundedRect(240, 153, 80, 45, 5) // round rectangle 테두리 그리기
                .setScrollFactor(0)
                this.disableButtons.push(this.disableButton_3)

            //아이템 페이징을 위한 인디케이터
            this.complete_before_page = scene.add.image(frame_complete_width / 2 - 82, 505, 'before')
                .setScrollFactor(0)
                .setInteractive()
                .setDisplaySize(28, 28)
                .on('pointerup', () => {
                    this.nowCompletePage--
                    if (this.nowCompletePage == 0) {
                        this.nowCompletePage = this.completePageCount
                    }
                    var url
                    if (this.completeType == 0) {
                        url = 'http://221.148.25.234:1234/auction/transaction-all/' + this.nowCompletePage
                    } else if (this.completeType == 1) {
                        url = 'http://221.148.25.234:1234/auction/sell-complete/' + this.nowCompletePage
                    } else {
                        url = 'http://221.148.25.234:1234/auction/purchase/' + this.nowCompletePage
                    }


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
                            this.completePageText.text = this.nowCompletePage + " / " + this.completePageCount
                            for (let i = 0; i < 6; i++) {
                                this.completeItems[i].setVisible(false)
                            }
                            for (let i = 0; i < data.result.length; i++) {
                                this.completeItems[i].setVisible(true)
                                this.completeItems[i].setInfo(data.result[i], 0)
                            }


                        })
                        .catch(error => {
                            console.error('There was a problem with the POST request:', error);
                        });
                }).setVisible(false)

            this.completePageText = scene.add.text(frame_complete_width / 2, 505, "5 / 9", {
                fontFamily: 'Arial',
                fontSize: '26px',
                color: 'white',
                fontStyle: 'bold'
            }).setOrigin(0.5, 0.5).setVisible(false)

            //아이템 페이징을 위한 인디케이터
            this.complete_next_page = scene.add.image(frame_complete_width / 2 + 80, 505, 'next')
                .setScrollFactor(0)
                .setInteractive()
                .setDisplaySize(28, 28)
                .on('pointerup', () => {
                    this.nowCompletePage++
                    if (this.nowCompletePage > this.completePageCount) {
                        this.nowCompletePage = 1
                    }
                    var url
                    if (this.completeType == 0) {
                        url = 'http://221.148.25.234:1234/auction/transaction-all/' + this.nowCompletePage
                    } else if (this.completeType == 1) {
                        url = 'http://221.148.25.234:1234/auction/sell-complete/' + this.nowCompletePage
                    } else {
                        url = 'http://221.148.25.234:1234/auction/purchase/' + this.nowCompletePage
                    }


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
                            this.completePageText.text = this.nowCompletePage + " / " + this.completePageCount
                            for (let i = 0; i < 6; i++) {
                                this.completeItems[i].setVisible(false)
                            }
                            for (let i = 0; i < data.result.length; i++) {
                                this.completeItems[i].setVisible(true)
                                this.completeItems[i].setInfo(data.result[i], 0)
                            }


                        })
                        .catch(error => {
                            console.error('There was a problem with the POST request:', error);
                        });
                }).setVisible(false)

            this.completeFrame.add([this.complete_before_page, this.completePageText, this.complete_next_page])
            this.nowCompletePage = 1
            const url = scene.APIurl+'/auction/transaction-all/' + this.nowCompletePage

            //처음에 전체버튼 한번누른걸로
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
                    this.completePageCount = Math.ceil((data.count) / 6);
                    this.completeType = 0
                    this.completePageText.text = "1 / " + this.completePageCount
                    if (this.completePageCount > 1) {
                        this.complete_next_page.setVisible(true)
                        this.completePageText.setVisible(true)
                        this.complete_before_page.setVisible(true)
                    } else {
                        this.complete_next_page.setVisible(false)
                        this.completePageText.setVisible(false)
                        this.complete_before_page.setVisible(false)
                    }
                    for (let i = 0; i < 6; i++) {
                        this.completeItems[i].setVisible(false)
                    }
                    for (let i = 0; i < data.result.length; i++) {
                        this.completeItems[i].setVisible(true)
                        this.completeItems[i].setInfo(data.result[i], 0)
                    }
                    for(let i=0;i<3;i++)
                    {
                        this.disableTexts[i].setVisible(true)
                        this.disableButtons[i].setVisible(true)
                    }
                    this.disableTexts[0].setVisible(false)
                    this.disableButtons[0].setVisible(false)

                        

                })
                .catch(error => {
                    console.error('There was a problem with the POST request:', error);
                });

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
                this.next_page, this.before_page, this.pageText
            ])
            for (let i = 0; i < 6; i++) {
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
                this.button_bl, this.button_br,

                this.myItemFrame, this.enrollFrame, this.sellingFrame,
                this.enrollmentionBG
            ])

        } else if (index == 2) {

            this.add([
                this.tab_tl, this.tab_tc, this.tab_tr,
                this.tab_cl, this.tab_c, this.tab_cr,
                this.tab_bl, this.tab_bc, this.tab_br,
                this.button_tl, this.button_tc, this.button_tr,
                this.button_c, this.button_cr, this.button_cl,
                this.button_bl, this.button_br,
                this.completeFrame, this.soldButton, this.soldButtonText, this.boughtButton, this.boughtButtonText,
                this.wholeLogButton, this.wholeLogButtonText,this.disableButtons[0],this.disableButtons[1],this.disableButtons[2],this.disableText_1,this.disableText_2,this.disableText_3
            ])

        }
        this.add(this.prompt)

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
    
}


