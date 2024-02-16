import Phaser from "phaser";
import Frame from "../frame";
import Frame_LT from "../frame_lt";
import StoreTabBody from "./store_tab_body";


export default class SeedStoreUI extends Frame {

    scene;
    // 어떤 탭을 열고 있는지 나타내는 상태
    state = 'purchase';

    titleTxt;
    purchaseTxt;
    purchaseTab;
    saleTxt;
    saleTab;

    exitIcon;

    tabs = [];

    constructor(scene, x, y, width, height) {

        super(scene, x, y, width, height);
        this.scene = scene;
        scene.add.existing(this);

        this.setScrollFactor(0).setDepth(500);


        // 기본 상태 : 구매 탭
        this.state = 'purchase';

        // 헤더 만들기 제목 텍스트, 구매, 판매 탭 버튼 포함
        const headerSpaceX = 20;
        const headerSpaceY = 10;
        const headerPad = this.edgeSize + 10;
        const txtStyle = {
            fontFamily: 'Arial',
            fontSize: 25,
            color: 'white',
            fontStyle: 'bold',
            align: 'center',
            stroke: 'black', // 외곽선
            strokeThickness: 5 // 외곽선 두께  
        };
        const titleX = headerPad;
        const titleY = headerPad;
        this.titleTxt = scene.add.text(titleX, titleY, '씨앗 상점', txtStyle);

        // 나가기 버튼
        this.exitIcon = scene.add.image(this.width - headerPad, headerPad, 'exit_icon');
        this.exitIcon.setOrigin(1, 0).setDisplaySize(30, 30).setScrollFactor(0)
            .setInteractive();
        //scene.input.enableDebug(this.exitIcon);
        this.exitIcon.on('pointerdown', (event) => {
            this.setVisible(false);
        });

        // 구매 탭 버튼 만들기
        const purchaseX = headerPad;
        const purchaseY = titleY + this.titleTxt.height + headerSpaceY;
        this.purchaseTab = new Frame_LT(scene, purchaseX, purchaseY, 100, 50, 1);
        // 상호작용 영역 설정
        this.purchaseTab.setInteractive(new Phaser.Geom.Rectangle(this.purchaseTab.width / 2, this.purchaseTab.height / 2,
            this.purchaseTab.width, this.purchaseTab.height),
            Phaser.Geom.Rectangle.Contains);
        //scene.input.enableDebug(this.purchaseTab);

        this.purchaseTab.on('pointerover', (pointer) => {
            //console.log("판매 탭 버튼에 마우스 오버");
        });
        this.purchaseTab.on('pointerdown', (pointer) => {

            if(this.state === 'purchase')
            return;

            //console.log("구매 탭 전환");
            this.saleTab.setImgVisible(false);
            this.purchaseTab.setImgVisible(true);

            this.state = 'purchase';
            
            this.tabBody.switchTabs(0);
        });

        // 구매 탭 버튼 텍스트 추가
        txtStyle.fontSize = 20;
        const purchaseTxtX = purchaseX + this.purchaseTab.width / 2;
        const purchaseTxtY = purchaseY + this.purchaseTab.height / 2;
        this.purchaseTxt = scene.add.text(purchaseTxtX, purchaseTxtY, '구매', txtStyle);
        this.purchaseTxt.setOrigin(0.5, 0.5);


        // 판매 탭 버튼 만들기
        const saleX = purchaseX + this.purchaseTab.width;
        const saleY = purchaseY;
        this.saleTab = new Frame_LT(scene, saleX, saleY, 100, 50, 2);
        // 상호작용 영역 설정
        this.saleTab.setInteractive(new Phaser.Geom.Rectangle(this.saleTab.width / 2, this.saleTab.height / 2,
            this.saleTab.width, this.saleTab.height),
            Phaser.Geom.Rectangle.Contains);
        //scene.input.enableDebug(this.saleTab);

        // 판매 탭 버튼 이벤트 리스너 설정
        this.saleTab.on('pointerover', (pointer) => {
            //console.log("판매 탭 버튼에 마우스 오버");
        });
        this.saleTab.on('pointerdown', (pointer) => {

            if(this.state === 'sale')
            return;

            //console.log("판매 탭 전환");
            // 절대로 visible 건들면 안됨.
            this.purchaseTab.setImgVisible(false);
            this.saleTab.setImgVisible(true);

            this.state = 'sale';

            this.tabBody.switchTabs(1);
        });

        //판매 탭 버튼 텍스트 추가
        txtStyle.fontSize = 20;
        const saleTxtX = saleX + this.saleTab.width / 2;
        const saleTxtY = saleY + this.saleTab.height / 2;
        this.saleTxt = scene.add.text(saleTxtX, saleTxtY, '판매', txtStyle);
        this.saleTxt.setOrigin(0.5, 0.5);

        // 탭 바디 만들기 크기 , 높이 변수화
        const tabBodyX = this.purchaseTab.x;
        const tabBodyY = this.purchaseTab.y + this.purchaseTab.height - this.purchaseTab.edgeSize;
        const tabBodyWidth = this.width - headerPad * 2;
        const tabBodyheight = this.height - headerPad * 2 - (this.titleTxt.height + this.purchaseTab.height);
        this.tabBody = new StoreTabBody(scene, tabBodyX, tabBodyY, tabBodyWidth, tabBodyheight, 0);
        // 컨테이너에 추가
        this.add([this.titleTxt, this.exitIcon]);
        this.add([this.tabBody]);
        this.add([this.purchaseTab, this.purchaseTxt]);
        this.add([this.saleTab, this.saleTxt]);

        this.saleTab.setImgVisible(false);
    }

}