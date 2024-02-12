import Phaser from "phaser";
import Frame from "../frame";
import Frame_LT from "../frame_lt";


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


        // 헤더 만들기 제목 텍스트, 구매, 판매 탭 포함
        const headerSpaceX = 20;
        const headerSpaceY = 10;
        const headerPad = 10;
        const txtStyle = {
            fontFamily: 'Arial',
            fontSize: 25,
            color: 'white',
            fontStyle: 'bold',
            align: 'center',
            stroke: 'black', // 외곽선
            strokeThickness: 5 // 외곽선 두께  
        };
        const titleX = this.edgeSize + headerPad;
        const titleY = this.edgeSize + headerPad;
        this.titleTxt = scene.add.text(titleX, titleY, '씨앗 상점', txtStyle);

        // 구매 탭 만들기
        txtStyle.fontSize = 20;
        const purchaseX = this.edgeSize + headerPad;
        const purchaseY = titleY + this.titleTxt.height + headerSpaceY;
        this.purchaseTxt = scene.add.text(purchaseX, purchaseY, '구매', txtStyle);

        // 판매 탭 만들기
        const saleX = purchaseX + this.purchaseTxt.width + headerSpaceX;
        const saleY = purchaseY;
        this.saleTxt = scene.add.text(saleX, saleY, '판매', txtStyle);

        // frame_lt 쓴 건가?
        // 밑이 뚫린 프레임을 직접 만들었음.

        // 구매 탭에 사용할 프레임 만들기

        this.purchaseTab = new Frame_LT(scene, 0, 0, 100, 100, 1);
        //this.tab_tc = scene.add.image(purchaseX, );

        // 새로 만드는 게 낫겠음.

        /* this.topLeft = scene.add.image(purchaseX, purchaseY, 'tab_9slice_tl')
        .setOrigin(0, 0)
        .setDisplaySize(this.edgeSize, this.edgeSize);

        this.topCenter = scene.add.image(purchaseX + this.edgeSize, purchaseY, 'tab_9slice_tc')     
        .setOrigin(0, 0)
        .setDisplaySize(this.purchaseTxt.width-(this.edgeSize*2),this.edgeSize);

        this.topRight = scene.add.image(this.purchaseTxt.width + this.edgeSize * 2, purchaseY, 'tab_9slice_tr')
        .setOrigin(1, 0)
        .setDisplaySize(this.edgeSize,this.edgeSize); */





        // 헤더랑 바디로 나눠져있다고 생각해본다.
        // 바디도 탭 아이템에 다 몰아 넣은건가?


        this.add([this.titleTxt, this.purchaseTxt, this.saleTxt, this.purchaseTab]);
    }

}