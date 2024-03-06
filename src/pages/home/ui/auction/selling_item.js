import Phaser from "phaser";
import Frame_LT from "../frame/frame_lt";
import Item from "../../elements/item";

export default class SellingItem extends Phaser.GameObjects.Container {

    sellingInfo
    index
    setInfo(sellingInfo) {
        this.sellingInfo = sellingInfo
        this.item_image.setTexture(this.sellingInfo.item.item_name);
        this.item_text.text = this.sellingInfo.item.item_name
        this.itemCount_text.text = this.sellingInfo.item_count + "개"
        this.itemPrice_text.text = this.sellingInfo.item_price + "원"
        this.setVisible(true)
        //this.itemTotalPrice_text.text=(item.item_price)*(item.item_count)
    }
    constructor(scene, index) {

        super(scene);
        scene.add.existing(this);
        this.setDepth(100).setScrollFactor(0);
        const textConfig = {
            fontFamily: 'Arial',
            fontSize: '28px',
            color: 'black',
            fontStyle: 'bold'
        }

        this.index = index;
        // UI 객체라서 물리 효과가 필요 없지만 테두리 확인할려고 추가
        //scene.physics.add.existing(this);

        //검색 결과 아이템
        const frame_searchResult_width = 420;
        const frame_searchResult_height = 80;
        const frame_searchResult_x = 18 + ((index % 3) * (frame_searchResult_width + 10));
        const frame_searchResult_y = 18 + (Math.trunc((index / 3)) * 100);
        this.frame_searchResult = new Frame_LT(scene, frame_searchResult_x, frame_searchResult_y,
            frame_searchResult_width, frame_searchResult_height);
        this.setDepth(100).setScrollFactor(0);




        this.ItemBG = scene.add.graphics()
            .fillStyle(0xCCCCCCC) // 채우기 색상 설정
            .fillRoundedRect(frame_searchResult_x + 12, frame_searchResult_y + 10, 58, 58, 8) // round rectangle 그리기
            .lineStyle(2, 0x000000) // 선 스타일 설정 (선 두께, 선 색상)
            .strokeRoundedRect(frame_searchResult_x + 12, frame_searchResult_y + 10, 58, 58, 8) // round rectangle 테두리 그리기
            .setScrollFactor(0)



        const imageX = frame_searchResult_x + 29
        const imageY = frame_searchResult_y + 29



        this.item_image = scene.add.image(imageX + 12, imageY + 10, "감자")
            .setDisplaySize(30, 30)

        this.item_text = scene.add.text(frame_searchResult_x + 80, frame_searchResult_y + 25, "감자", textConfig).setOrigin(0, 0);

        this.itemCount_text = scene.add.text(frame_searchResult_x + 280, frame_searchResult_y + 12, "2000개", {
            fontFamily: 'Arial',
            fontSize: '20px',
            color: 'black',
            fontStyle: 'bold'
        }).setOrigin(1, 0);
        this.itemPrice_text = scene.add.text(frame_searchResult_x + 280, frame_searchResult_y + 46, "개당 140원", {
            fontFamily: 'Arial',
            fontSize: '20px',
            color: 'black',
            fontStyle: 'bold'
        }).setOrigin(1, 0);


        this.cancel_image = scene.add.image(frame_searchResult_x + 380, frame_searchResult_y + 40, "auction_exit")
            .setDisplaySize(30, 30)
            .setInteractive()
            .setScrollFactor(0)
            .on('pointerup', () => {

                // 인벤토리에 빈 위치 찾기               
                this.itemSlot = scene.findAddItemSlot(this.sellingInfo.item.item_name)
                this.emptySlotIndex = this.itemSlot.index
                const url = scene.APIurl + '/auction/' + this.sellingInfo.auction_id + '/' + this.emptySlotIndex
                
                console.log("auction_id : " + this.sellingInfo.auction_id)
                console.log("emptySlotIndex : " + this.emptySlotIndex)
                //요청 보내기
                fetch(url, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + scene.accessToken
                    },
                })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Network response was not ok');
                        }
                        return response.text();
                    })
                    .then(data => {
                        if (data == "cancel success") {

                            scene.auction.tabItems[1].notice("       아이템을 판매취소 하였습니다.") 
                            
                            
                            if (this.itemSlot.item!=null) {
                                console.log("before count : " + this.itemSlot.item.count)
                                this.setCount = this.itemSlot.item.count + this.sellingInfo.item_count
                                this.itemSlot.setSlotItem(new Item(this.sellingInfo.item, this.setCount))
                            } else {
                                console.log("before count : 0")
                                this.setCount = this.sellingInfo.item_count
                                this.itemSlot.setSlotItem(new Item(this.sellingInfo.item, this.setCount))
                            }
                            
                            scene.auction.tabItems[1].setMySellingItems()
                            scene.auction.tabItems[1].setMyItems()
                        }
                    })
                    .catch(error => {
                        console.error('There was a problem with the request:', error);
                    });
            });


        this.add([
            this.frame_searchResult, this.ItemBG,
            this.item_image, this.item_text, this.itemCount_text, this.itemPrice_text,
            this.cancel_image
        ])


    }


}