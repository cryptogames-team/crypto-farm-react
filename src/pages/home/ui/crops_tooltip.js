import Frame_LT from "./frame_lt";

// 농작물 정보 툴팁 클래스
export default class CropsToolTip extends Frame_LT {

    scene;

    nameTxt;
    cropIcon;
    growRemainTxt;
    growRemainContent;

    // 컨테이너 패딩
    pad = 10;
    // 텍스트나 라인간 간격
    space = 10;

    depth = 100;

    constructor(scene, x, y, width, height){

        super(scene, x, y, width, height);

        this.scene = scene;
        // 스크롤 팩터 해제
        this.setSize(width, height).setDepth(100).setScrollFactor(1);


        const txtStyle = {
            fontFamily: 'Arial',
            fontSize: 20,
            color: 'white',
            fontStyle: 'bold',
            align: 'center',
            stroke: 'black', // 외곽선
            strokeThickness: 4 // 외곽선 두께  
        };

        
        this.nameTxt = scene.add.text(this.width / 2, this.pad, '농작물 이름', txtStyle);
        this.nameTxt.setOrigin(0.5, 0);

        txtStyle.fontSize = 20;
        this.growRemainTxt = scene.add.text(this.width / 2, this.height - this.pad , '5분 30초', txtStyle);
        this.growRemainTxt.setOrigin(0.5, 1);

        // 컨테이너에 자식 추가
        this.add([this.nameTxt, this.growRemainTxt]);
    }


    // 농작물 정보 받아서 툴팁 정보 표시하기
    setToolTip(){

    }

}