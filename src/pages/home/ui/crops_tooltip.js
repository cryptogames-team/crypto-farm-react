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
    space = 5;

    depth = 100;

    // 농작물 객체 참조
    crops;

    constructor(scene, x, y, width, height){

        super(scene, x, y, width, height);

        this.scene = scene;
        // 스크롤 팩터 해제
        this.setSize(width, height).setDepth(100).setScrollFactor(1);


        const txtStyle = {
            fontFamily: 'Arial',
            fontSize: 18,
            color: 'white',
            fontStyle: 'bold',
            align: 'center',
            stroke: 'black', // 외곽선
            strokeThickness: 4 // 외곽선 두께  
        };

        // 바뀔 UI 총 높이
        let totalHeight = this.pad;

        
        this.nameTxt = scene.add.text(this.width / 2, this.pad, '농작물 이름', txtStyle);
        this.nameTxt.setOrigin(0.5, 0);

        totalHeight += this.nameTxt.height;

        this.growRemainTxt = scene.add.text(this.width / 2,  totalHeight + this.space, '남은 성장 시간', txtStyle);
        this.growRemainTxt.setOrigin(0.5, 0);

        totalHeight += this.space + this.growRemainTxt.height;
        totalHeight += this.pad;


        //console.log("새로 설정될 높이 ", totalHeight);

        // 부모 클래스 함수 호출해서 UI 높이 조정
        this.setUISize(width, totalHeight);
        this.setSize(width, totalHeight);


        // 컨테이너에 자식 추가
        this.add([this.nameTxt, this.growRemainTxt]);
    }

    // 농작물 객체 참조 설정
    setCrops(crops){
        this.crops = crops;

        this.nameTxt.setText(crops.name);
        this.growRemainTxt.setText(crops.remainTime);
    }

    // 농작물 정보 받아서 툴팁 정보 표시하기
    setToolTip(){

    }

}