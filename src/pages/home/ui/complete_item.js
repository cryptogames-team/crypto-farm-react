import Phaser from "phaser";
import Frame_LT from './frame_lt';

export default class CompleteItem extends Phaser.GameObjects.Container {


    index
    info
    userName="park"
    setInfo(info,type)
    {   
        //console.log(info)
        this.info=info
        if(info.auction)
        if(type==0)
        {
            if(this.userName==info.auction.user.user_name)
            {
                this.itemTrade_text.text="판매"
            }else
            {
                this.itemTrade_text.text="구매"
            }
        }else
        {
            if(type==1)
            {
                this.itemTrade_text.text="판매"
            }else
            {
                this.itemTrade_text.text="구매"
            }
        }
        
        
        this.tradeTime_text.text=info.purchase_date
        this.item_image.setTexture(info.auction.item.item_name).setDisplaySize(30,30)
        this.item_text.text=info.auction.item.item_name
        this.itemCount_text.text=info.purchase_count+"개"
        this.itemPrice_text.text=info.auction.item_price+"원"
        this.itemTotalPrice_text.text=(parseInt(this.itemCount_text.text)*parseInt(this.itemPrice_text.text))+"원"
        this.setVisible(true)
    }
    constructor(scene,index) {

        super(scene);
        scene.add.existing(this);
        this.setDepth(100).setScrollFactor(0);
        const textConfig={
            fontFamily: 'Arial',
            fontSize: '28px',
            color: 'black',
            fontStyle: 'bold'
        }
       
        this.index=index;
        // UI 객체라서 물리 효과가 필요 없지만 테두리 확인할려고 추가
        //scene.physics.add.existing(this);

        //검색 결과 아이템
        const frame_searchResult_width = 1310;
        const frame_searchResult_height = 70;   
        const frame_searchResult_x = 10;
        const frame_searchResult_y = 40+(index)*(frame_searchResult_height+3);      
        this.frame_searchResult=new Frame_LT(scene, frame_searchResult_x, frame_searchResult_y, 
            frame_searchResult_width, frame_searchResult_height); 
        this.setDepth(100).setScrollFactor(0);



        const BGsize=frame_searchResult_height-20
        this.ItemBG = scene.add.graphics()
        .fillStyle(0xCCCCCCC) // 채우기 색상 설정
        .fillRoundedRect(frame_searchResult_x+350, frame_searchResult_y+10, BGsize, BGsize, 8) // round rectangle 그리기
        .lineStyle(2, 0x000000) // 선 스타일 설정 (선 두께, 선 색상)
        .strokeRoundedRect(frame_searchResult_x+350, frame_searchResult_y+10, BGsize, BGsize, 8) // round rectangle 테두리 그리기
        .setScrollFactor(0)
        
    

        this.tradeTime_text=scene.add.text(frame_searchResult_x+220, frame_searchResult_y+15, "2024-01-17\n  17:53:25",{
            fontFamily: 'Arial',
            fontSize: '20px',
            color: 'black',
            fontStyle: 'bold'
        }).setOrigin(0.5,0);
        this.itemTrade_text=scene.add.text(frame_searchResult_x+30, frame_searchResult_y+20, "판매",textConfig).setOrigin(0,0);
        this.item_image = scene.add.image(frame_searchResult_x+375, frame_searchResult_y+35, "케일 씨앗")   
        .setDisplaySize(30,30)
        this.item_text = scene.add.text(frame_searchResult_x+495, frame_searchResult_y+20,"케일 씨앗",textConfig).setOrigin(0.5,0);
        this.itemCount_text=scene.add.text(frame_searchResult_x+785, frame_searchResult_y+20, "2000개", textConfig).setOrigin(1,0);
        this.itemPrice_text=scene.add.text(frame_searchResult_x+1025, frame_searchResult_y+20, "140원",textConfig).setOrigin(1,0);
        this.itemTotalPrice_text=scene.add.text(frame_searchResult_x+1250, frame_searchResult_y+20, "380000원",textConfig).setOrigin(1,0);

        this.add([
            this.frame_searchResult,this.ItemBG,
            this.itemTrade_text,this.tradeTime_text,this.item_image,this.item_text,this.itemCount_text,this.itemPrice_text,this.itemTotalPrice_text
        ])
        
        
    }


}