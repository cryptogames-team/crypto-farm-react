import Phaser from "phaser";
import Item from "../../elements/item";

export default class AuctionItem extends Phaser.GameObjects.Container {


    itemInfo
    itemCount
    setInfo(itemInfo,itemCount)
    {
        this.itemInfo=itemInfo
        this.item_image.setTexture(itemInfo.item_name)      
        .setVisible(true)
        this.itemCount=itemCount
        this.item_count.text=itemCount
        this.item_count.setVisible(true)
    }
    disable()
    {
        this.item_image.setVisible(false)
        this.item_count.setVisible(false)
    }

    setCount(value)
    {
        this.itemCount+=value
        this.item_count.text=this.itemCount
    }

    constructor(scene,index) {

        super(scene);
        scene.add.existing(this);
        this.setDepth(100).setScrollFactor(0);
        const textConfig={
            fontFamily: 'Arial',
            fontSize: '24px',
            color: 'black',
            fontStyle: 'bold'
        }
   
        
        const size=80
        const x_position=14+((index%11)*(size+7))
        const y_position=14+((Math.floor(index/11))*(size+7))

        this.ItemBG = scene.add.graphics()
        .fillStyle(0xCCCCCCC) // 채우기 색상 설정
        .fillRoundedRect(x_position, y_position, size, size, 8) // round rectangle 그리기
        .lineStyle(2, 0x000000) // 선 스타일 설정 (선 두께, 선 색상)
        .strokeRoundedRect(x_position, y_position, size, size, 8) // round rectangle 테두리 그리기
        .setScrollFactor(0)
        

        this.item_image = scene.add.image(x_position+(size/2), y_position+(size/2), "감자")   
        .setOrigin(0.5,0.5)
        .setDisplaySize(40,40)
        .setVisible(false)


        this.item_count = scene.add.text(x_position+5, y_position+50, "1", {
            fontFamily: 'Arial',
            fontSize: '22px',
            color: 'black',
            fontStyle: 'bold'
        }).setVisible(false)
 
        this.add([
            this.ItemBG,
            this.item_image,
            this.item_count
        ])
        
        
    }


}