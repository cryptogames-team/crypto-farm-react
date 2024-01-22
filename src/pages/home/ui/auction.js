import Phaser from "phaser";
import Frame from '../ui/frame';
import TabItem from "./tabItem";

export default class Auction extends Frame {

    exitIcon;

    headerLine;
    headerText;

    tabMenuLine;

    tabItem_search;
    tabItem_sell;
    tabItem_complete;
    
    goldText;
    tabItems=[];
    selectTabItem(index)
    {
        this.tabItems.forEach((item) => {
            item.disable();
        });
        this.tabItems[index].enable();
        if(index==1)
        {
            this.tabItems[index].setMyItems()
            this.tabItems[index].setMySellingItems()
        }
    }
    enable()
    {
        this.setVisible(true);
    }
    disable() {

        this.setVisible(false);
    }
    constructor(scene, x, y, width, height) {

        super(scene, x, y, width, height);

        const edgeSize=10;
        // 씬의 디스플레이 목록에 추가하여 시각적으로 나타내게 한다.
        scene.add.existing(this);

        this.setScrollFactor(0);

        // 크립토 옥션 제목
        this.headerText = scene.add.text(30, 26, "크립토 옥션", {
            fontFamily: 'Arial',
            fontSize: '37px',
            color: 'white',
            fontStyle: 'bold'
        });



        //나가기 X버튼
        this.exitIcon = scene.add.image(width-19, 19, "auction_exit");
        this.exitIcon.setOrigin(1,0);         
        this.exitIcon.setDisplaySize(40, 40);
        this.exitIcon.setScrollFactor(0);
        this.exitIcon.setInteractive()
        this.exitIcon.on('pointerup', (event) => this.disable());
        

        

        this.tabItem_search=new TabItem(scene,x,y,width,height,0,"검색");
        this.tabItems.push(this.tabItem_search);
        this.tabItem_sell=new TabItem(scene,x,y,width,height,1,"판매");
        this.tabItems.push(this.tabItem_sell);
        this.tabItem_complete=new TabItem(scene,x,y,width,height,2,"완료");
        this.tabItems.push(this.tabItem_complete);
        for (let i = 0; i < 3; i++) {
            this.tabItems[i].disable();   
        }
        //옥션창 열면 검색창 켜줌
        this.tabItems[0].enable();
        


        this.tab_texts=[];

        const textStyle = {
            fontFamily: 'Arial',
            fontSize: 30,
            color: 'black',
            fontStyle: 'bold'
        };
        //탭이름
        this.search_text = scene.add.text(50, 100, "검색",textStyle)
        this.tab_texts.push(this.search_text);
        
        //탭이름
        this.sell_text = scene.add.text(170, 100, "판매",textStyle)
        this.tab_texts.push(this.sell_text);
        //탭이름
        this.complete_text = scene.add.text(290, 100, "완료",textStyle)
        this.tab_texts.push(this.complete_text);
    
        
        //골드 프레임
        const goldFrameWidth = 250;
        const goldFrameHeight = 55;   
        const goldFrameX = width-270;
        const goldFrameY = 80;      
        this.goldFrame=new Frame(scene, goldFrameX, goldFrameY, 
            goldFrameWidth, goldFrameHeight);      

        //골드아이콘
        this.goldIcon = scene.add.image(width-255, 90, 'goldIcon');
        this.goldIcon.setOrigin(0, 0)
        this.goldIcon.setDisplaySize(32, 32);
        
        //골드 텍스트
        this.goldText = scene.add.text(width-40, 91, scene.characterInfo.cft.toLocaleString(),{
            fontFamily: 'Arial',
            fontSize: '29px',
            color: 'white',
            fontStyle: 'bold'
        }).setOrigin(1,0)
        scene.goldText=this.goldText

        for (let i = 0; i < 3; i++) {
            this.tab_texts[i].setSize(100,50);
            this.tab_texts[i].setScrollFactor(0);
            this.tab_texts[i].setInteractive()
            this.tab_texts[i].on('pointerup', (event) => this.selectTabItem(i));         
        }
        // 자식 게임 오브젝트들 컨테이너에 추가
        this.add([
            this.exitIcon,this.headerText,
            this.tabItem_search,this.tabItem_sell,this.tabItem_complete,
            this.search_text,this.sell_text,this.complete_text,
            this.goldFrame,this.goldIcon,this.goldText
            
        ])
        this.setDepth(1000);

        
    }

    
}