import Phaser from "phaser";
import Frame from "../frame";
import Frame_LT from "../frame_lt";
import StoreTabBody from "./store_tab_body";


export default class SeedStoreUI extends Frame {

    scene;

    titleTxt;
    purchaseTxt;
    purchaseTab;
    saleTxt;
    saleTab;

    constructor(scene, x, y, width, height){

        super(scene, x, y, width, height);
        this.scene = scene;
        scene.add.existing(this);

        this.setScrollFactor(0).setDepth(500);


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

        // 구매 탭 버튼 만들기
        const purchaseX = headerPad;
        const purchaseY = titleY + this.titleTxt.height + headerSpaceY;
        this.purchaseTab = new Frame_LT(scene, purchaseX, purchaseY, 100, 50, 1);

        // 구매 탭 버튼 텍스트 추가
        txtStyle.fontSize = 20;
        const purchaseTxtX = purchaseX + this.purchaseTab.width / 2;
        const purchaseTxtY = purchaseY + this.purchaseTab.height / 2;
        this.purchaseTxt = scene.add.text(purchaseTxtX, purchaseTxtY, '구매', txtStyle);
        this.purchaseTxt.setOrigin(0.5, 0.5);


        //판매 탭 버튼 만들기
        const saleX = purchaseX + this.purchaseTab.width;
        const saleY = purchaseY;
        this.saleTab = new Frame_LT(scene, saleX, saleY, 100, 50, 2);

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
        const tabBodyheight = this.height - headerPad * 2  - (this.titleTxt.height + this.purchaseTab.height);
        this.tabBody = new StoreTabBody(scene, tabBodyX, tabBodyY, tabBodyWidth, tabBodyheight);

        // 카테고리 표시
        /* const categoryX = purchaseTxtX;
        const categoryY = tabBodyY + 10;
        this.categoryTxt = scene.add.text(categoryX, categoryY, '농작물', txtStyle);
        this.categoryTxt.setOrigin(0.5, 0); */



        this.add([this.titleTxt]);
        this.add([this.tabBody]);
        this.add([this.purchaseTab, this.purchaseTxt]);
        this.add([this.saleTab, this.saleTxt]);


        //this.purchaseTab.setVisible(false);
        this.saleTab.setVisible(false);
    }

}