import Phaser from "phaser";
import Frame_LT from './frame_lt';

export default class SearchItem extends Phaser.GameObjects.Container {


    index
    setInfo(item)
    {   
        this.item_image.setTexture(item.item.item_name);
        this.item_text.text=item.item.item_name
        this.itemCount_text.text=item.item_count
        this.itemPrice_text.text=item.item_price
        this.itemTotalPrice_text.text=(item.item_price)*(item.item_count)
    }
    constructor(scene, width,x_position,index) {

        super(scene);
        scene.add.existing(this);
        this.setDepth(100).setScrollFactor(0);
        const textConfig={
            fontFamily: 'Arial',
            fontSize: '24px',
            color: 'black',
            fontStyle: 'bold'
        }
        this.index=index;
        // UI 객체라서 물리 효과가 필요 없지만 테두리 확인할려고 추가
        //scene.physics.add.existing(this);

        //검색 결과 아이템
        const frame_searchResult_width = width-40;
        const frame_searchResult_height = 70;   
        const frame_searchResult_x = x_position+18;
        const frame_searchResult_y = 230+(index*70);      
        this.frame_searchResult=new Frame_LT(scene, frame_searchResult_x, frame_searchResult_y, 
            frame_searchResult_width, frame_searchResult_height); 
        this.setDepth(100).setScrollFactor(0);



        
        this.ItemBG = scene.add.graphics()
        .fillStyle(0xCCCCCCC) // 채우기 색상 설정
        .fillRoundedRect(frame_searchResult_x+16, frame_searchResult_y+10, 50, 50, 8) // round rectangle 그리기
        .lineStyle(2, 0x000000) // 선 스타일 설정 (선 두께, 선 색상)
        .strokeRoundedRect(frame_searchResult_x+16, frame_searchResult_y+10, 50, 50, 8) // round rectangle 테두리 그리기
        .setScrollFactor(0)
        
    

        const imageX=frame_searchResult_x+26
        const imageY=frame_searchResult_y+20

        

        this.item_image = scene.add.image(imageX+13, imageY+13, "감자")   
        .setOrigin(0.5,0.5)
        .setDisplaySize(25,25)

        this.item_text = scene.add.text(frame_searchResult_x+255, frame_searchResult_y+22,"",textConfig).setOrigin(1,0);

        this.itemCount_text=scene.add.text(frame_searchResult_x+390, frame_searchResult_y+22, "",textConfig).setOrigin(1,0);
        this.itemPrice_text=scene.add.text(frame_searchResult_x+590, frame_searchResult_y+22, "",textConfig).setOrigin(1,0);
        this.itemTotalPrice_text=scene.add.text(frame_searchResult_x+805, frame_searchResult_y+22, "",textConfig).setOrigin(1,0);
        this.add([
            this.frame_searchResult,this.ItemBG,
            this.item_image,this.item_text,this.itemCount_text,this.itemPrice_text,this.itemTotalPrice_text
        ])
        
        
    }


}