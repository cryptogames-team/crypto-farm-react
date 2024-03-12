import Phaser from "phaser";
import Frame_LT from "../frame/frame_lt";

export default class SellItem extends Phaser.GameObjects.Container {


    index
    setInfo(item)
    {   
        this.tokenCount_text.text=item.cft
        this.itemPrice_text.text=item.price
        this.itemTotalPrice_text.text=(item.cft)*(item.price)
    }
    constructor(scene, width,x_position,index) {

        super(scene);
        scene.add.existing(this);
        this.setDepth(100).setScrollFactor(0);
        const textConfig={
            fontFamily: 'DNFbitbitv2',
            fontSize: '24px',
            color: 'black',
        }
        this.index=index;
        // UI 객체라서 물리 효과가 필요 없지만 테두리 확인할려고 추가
        //scene.physics.add.existing(this);

        //검색 결과 아이템
        const frame_searchResult_width = width-40;
        const frame_searchResult_height = 55;   
        const frame_searchResult_x = x_position+8;
        const frame_searchResult_y = 33+(index*57);      
        this.frame_searchResult=new Frame_LT(scene, frame_searchResult_x, frame_searchResult_y, 
            frame_searchResult_width, frame_searchResult_height); 
        this.setDepth(100).setScrollFactor(0);


        this.tokenCount_text=scene.add.text(frame_searchResult_x+95, frame_searchResult_y+16, "",textConfig).setOrigin(1,0);
        this.itemPrice_text=scene.add.text(frame_searchResult_x+300, frame_searchResult_y+16, "",textConfig).setOrigin(1,0);
        this.itemTotalPrice_text=scene.add.text(frame_searchResult_x+500, frame_searchResult_y+16, "",textConfig).setOrigin(1,0);


        this.gold=scene.add.text(frame_searchResult_x+107, frame_searchResult_y+20, "Gold",{
            fontFamily: 'DNFbitbitv2',
            fontSize: '16px',
            color: 'white',
            stroke: '#000000',
            strokeThickness: 4
        });


        this.hep1=scene.add.text(frame_searchResult_x+312, frame_searchResult_y+20, "HEP",{
            fontFamily: 'DNFbitbitv2',
            fontSize: '16px',
            color: 'white',
            stroke: '#000000',
            strokeThickness: 4
        });
        this.hep2=scene.add.text(frame_searchResult_x+512, frame_searchResult_y+20, "HEP",{
            fontFamily: 'DNFbitbitv2',
            fontSize: '16px',
            color: 'white',
            stroke: '#000000',
            strokeThickness: 4
        });

        this.add([
            this.frame_searchResult,
            this.tokenCount_text,this.itemPrice_text,this.itemTotalPrice_text,this.hep1,this.hep2,this.gold
        ])
        
        
    }


}