import Phaser, { RIGHT } from "phaser";
import Frame from '../ui/frame';
import Prompt from '../ui/prompt';
import Item from '../elements/item'

export default class BuyConfirm extends Phaser.GameObjects.Container {


    itemInfo
    SelectedItemInfo(selectedSellingitemInfo) {
        this.itemInfo = selectedSellingitemInfo
        console.log("this.itemInfo : " + this.itemInfo)

        this.item_text.text = selectedSellingitemInfo.item.item_name
        this.priceValueText.text = selectedSellingitemInfo.item_price
        this.countValueText.text = selectedSellingitemInfo.item_count
        this.item_image.setTexture(selectedSellingitemInfo.item.item_name);

    }

    constructor(scene, x, y, width, height) {

        super(scene);

        //구매확인 패널
        scene.add.existing(this);
        this.setDepth(100).setScrollFactor(0);
        this.buyConfirmFrame = new Frame(scene, x + width / 4, y + (height / 12), width / 2, height * 4 / 5,
            width / 3, height / 2)


        this.prompt = new Prompt(scene, 800, y + (height / 2), width - 400, height * 1 / 8)
            .setVisible(false)
        /*.setVisible(false)*/
        const textConfig = {
            fontFamily: 'Arial',
            fontSize: '30px',
            color: 'black',
            fontStyle: 'bold'
        }

        const textConfigWhite = {
            fontFamily: 'Arial',
            fontSize: '24px',
            color: 'white',
            fontStyle: 'bold'
        }

        this.ItemBG = scene.add.graphics()
            .fillStyle(0xCCCCCCC) // 채우기 색상 설정
            .fillRoundedRect(x + width / 4 + 150, y + (height / 12) + 40, 60, 60, 8) // round rectangle 그리기
            .lineStyle(2, 0x000000) // 선 스타일 설정 (선 두께, 선 색상)
            .strokeRoundedRect(x + width / 4 + 150, y + (height / 12) + 40, 60, 60, 8) // round rectangle 테두리 그리기


        this.item_name = "감자"
        this.item_image = scene.add.image(x + (width / 4) + 178, y + (height / 12) + 68, '감자')
            .setOrigin(0.5, 0.5)
            .setDisplaySize(28, 28);
        this.item_text = scene.add.text(x + width / 4 + 240, y + (height / 12) + 55, this.item_name, textConfig);



        //개당 가격 텍스트
        this.priceText = scene.add.text((x + width / 4) + 120, y + (height / 12) + 120, "개당가격", textConfigWhite)
        //가격값 텍스트
        this.priceValueText = scene.add.text((x + width / 4) + 215, y + (height / 12) + 155, "150", textConfigWhite)
            .setOrigin(1, 0)

        //아이템 개수 텍스트
        this.countText = scene.add.text((x + width / 4) + 320, y + (height / 12) + 120, "개수", textConfigWhite)

        //아이템개수값 텍스트
        this.countValueText = scene.add.text((x + width / 4) + 365, y + (height / 12) + 155, "20", textConfigWhite)
            .setOrigin(1, 0)

        //구매할 수량 텍스트
        this.buyCountText = scene.add.text((x + width / 4) + 320, y + (height / 12) + 220, "구매할 수량", textConfigWhite)
            .setOrigin(1, 0)


        //입력된 구매수량 텍스트
        this.buyCountValueText = scene.add.text((x + width / 4) + 325, y + (height / 12) + 260, '', {
            fixedWidth: 120,
            fixedHeight: 36,
            fontSize: '25px',
            color: 'black',
            fontStyle: 'bold',
        })
            .setOrigin(1, -0.3)

        //구매할 수량 인풋박스
        this.buyCountInputBox = scene.add.graphics()
            .fillStyle(0xffffff) // 채우기 색상 설정
            .fillRoundedRect((x + width / 4) + 200, y + (height / 12) + 260, 120, 50, 5) // round rectangle 그리기
            .lineStyle(2, 0x000000) // 선 스타일 설정 (선 두께, 선 색상)
            .strokeRoundedRect((x + width / 4) + 200, y + (height / 12) + 260, 120, 50, 5) // round rectangle 테두리 그리기
            .setScrollFactor(0)

        var shape = new Phaser.Geom.Rectangle((x + width / 4) + 200, y + (height / 12) + 260,
            120, 50);
        this.buyCountInputBox.setInteractive(shape, Phaser.Geom.Rectangle.Contains);
        this.buyCountInputBox.on('pointerup', () => {
            scene.rexUI.edit(this.buyCountValueText, {
                y: 0,
                space: {
                    left: 10,
                    right: 10,
                }


            });        // 여기에 클릭 시 실행할 작업을 추가할 수 있습니다.
        });



        //확인 버튼
        this.shape = new Phaser.Geom.Rectangle(x + width / 2.8, y + (height / 1.35),
            130, 50);
        this.buyButton = scene.add.graphics()
            .fillStyle(0xA5C72A) // 채우기 색상 설정
            .fillRoundedRect(x + width / 2.8, y + (height / 1.35), 130, 50, 3) // round rectangle 그리기
            .lineStyle(2, 0xA5C72A) // 선 스타일 설정 (선 두께, 선 색상)
            .strokeRoundedRect(x + width / 2.8, y + (height / 1.35), 130, 50, 3) // round rectangle 테두리 그리기
            .setScrollFactor(0)
            .setInteractive(this.shape, Phaser.Geom.Rectangle.Contains)
            .on('pointerup', () => {


               this.itemSlot = scene.findAddItemSlot(this.itemInfo.item_name)
                this.emptySlotIndex = this.itemSlot.index
              
                const url = scene.APIurl+'/auction/buy'
                const patchData = {
                    'auction_id': this.itemInfo.auction_id,
                    'item_count': parseInt(this.buyCountValueText.text),
                    'item_index': this.emptySlotIndex
                }
                console.log("patchData : " + JSON.stringify(patchData))
                //요청 보내기
                fetch(url, {
                    method: 'PATCH',
                    headers: {
                        'Authorization': `Bearer `+scene.accessToken,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(patchData)

                })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Network response was not ok');
                        }
                        return response.text();
                    })
                    .then(data => {
                        if(data==="buy success")
                        {
                            this.prompt.show("아이템 구매가 완료되었습니다.")
                            this.setVisible(false)
                            scene.characterInfo.cft -= (parseInt(this.buyCountValueText.text,10)*this.itemInfo.item_price)
                            scene.goldText.text = scene.characterInfo.cft.toLocaleString()
                            this.remainItemCount=this.itemInfo.item_count-(parseInt(this.buyCountValueText.text,10))
                            

                            scene.auction.tabItems[0].modifyItemInfo(this.remainItemCount)

                            //인벤토리창에 넣어 줘야                                              
                            if(this.itemSlot.item)
                            {
                                console.log("before count : "+this.itemSlot.item.count)    
                                this.setCount=this.itemSlot.item.count+parseInt(this.buyCountValueText.text)                      
                                this.itemSlot.setSlotItem(new Item(this.itemInfo.item,this.setCount))  
                            }else
                            {
                                console.log("before count : 0")    
                                this.setCount=parseInt(this.buyCountValueText.text)                      
                                this.itemSlot.setSlotItem(new Item(this.itemInfo.item,this.setCount))  
                            }
                                                     
                               
                        }else
                        {
                            this.prompt.show("아이템 구매를 실패하였습니다.")
                            this.setVisible(false)                      
                        }
                    })
                    .catch(error => {
                        console.error('There was a problem with the request:', error);
                    });
            })


        //확인 버튼 텍스트       
        this.confirmButtonText = scene.add.text(x + width / 2.45 + 15, y + (height / 1.32), "확인", {
            fontFamily: 'Arial',
            fontSize: '27px',
            color: 'white',
            fontStyle: 'bold',
        }).setOrigin(0.5, 0)


        //취소 버튼
        this.shape = new Phaser.Geom.Rectangle(x + width / 1.8 - 20, y + (height / 1.35),
            130, 50);
        this.cancelButton = scene.add.graphics()
            .fillStyle(0xCCCCCC) // 채우기 색상 설정
            .fillRoundedRect(x + width / 1.8 - 20, y + (height / 1.35), 130, 50, 3) // round rectangle 그리기
            .lineStyle(2, 0xCCCCCC) // 선 스타일 설정 (선 두께, 선 색상)
            .strokeRoundedRect(x + width / 1.8 - 20, y + (height / 1.35), 130, 50, 3) // round rectangle 테두리 그리기
            .setScrollFactor(0)
            .setInteractive(this.shape, Phaser.Geom.Rectangle.Contains)
            .on('pointerup', () => {

                this.setVisible(false)
                this.buyCountValueText.text = ""
            })

        //취소 버튼 텍스트       
        this.cancelButtonText = scene.add.text(x + width / 1.65 - 5, y + (height / 1.32), "취소", {
            fontFamily: 'Arial',
            fontSize: '27px',
            color: 'black',
            fontStyle: 'bold',
        }).setOrigin(0.5, 0)



        this.add([this.buyConfirmFrame,
        this.ItemBG, this.item_image, this.item_text,
        this.priceText, this.countText,
        this.priceValueText, this.countValueText,
        this.buyCountText, this.buyCountInputBox, this.buyCountValueText,
        this.buyButton, this.confirmButtonText,
        this.cancelButton, this.cancelButtonText])
    }


}