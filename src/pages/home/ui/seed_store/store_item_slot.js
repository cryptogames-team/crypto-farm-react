import Phaser from "phaser";
import Frame from "../frame";
import Item from "../../elements/item";


export default class StoreItemSlot extends Frame{

    scene;

    item;

    itemImg;

    // 수량 관련 변수들
    countTxt;
    count;

    constructor(scene, x, y, width, height){

        super(scene, x, y, width, height);
        this.scene = scene;
        this.setSize(width, height);


        // 오늘은 일단 UI틀만 만든다.

        // 아이템 이미지 하드코딩해서 추가
        const itemImgX = this.width / 2;
        const itemImgY = this.height / 2;
        this.itemImg = scene.add.image(itemImgX, itemImgY, '감자 씨앗');
        this.itemImg.setDisplaySize(30, 30);

        // 디스플레이 사이즈를 변경하면 이미지 크기를 거기에 맞추기 위해
        // 디스플레이 사이즈 / 원본 사이즈 값으로 스케일 값이 변경됨.
        //console.log('아이템 이미지 스케일', this.itemImg.scaleX, this.itemImg.scaleY );

        this.add([this.itemImg]);
    }


}