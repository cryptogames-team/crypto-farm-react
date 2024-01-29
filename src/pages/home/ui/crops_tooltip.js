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
    crops = null;

    constructor(scene, x, y, width, height) {

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
            strokeThickness: 5 // 외곽선 두께  
        };

        // 바뀔 UI 총 높이
        let totalHeight = this.pad;


        this.nameTxt = scene.add.text(this.width / 2, this.pad, '양배추', txtStyle);
        this.nameTxt.setOrigin(0.5, 0);

        const cropIconPad = 3;
        const cropIconX = this.nameTxt.x - (this.nameTxt.width / 2) - cropIconPad;

        // 농작물 아이콘 추가하기
        this.cropIcon = scene.add.image(cropIconX, totalHeight, '감자');
        this.cropIcon.setOrigin(1, 0).setDisplaySize(this.nameTxt.height, this.nameTxt.height);

        totalHeight += this.nameTxt.height;

        this.growRemainTxt = scene.add.text(this.width / 2, totalHeight + this.space, '남은 성장 시간', txtStyle);
        this.growRemainTxt.setOrigin(0.5, 0);

        totalHeight += this.space + this.growRemainTxt.height;
        totalHeight += this.pad;


        //console.log("새로 설정될 높이 ", totalHeight);

        // 부모 클래스 함수 호출해서 UI 높이 조정
        this.setUISize(width, totalHeight);
        this.setSize(width, totalHeight);


        // 컨테이너에 자식 추가
        this.add([this.nameTxt, this.growRemainTxt, this.cropIcon]);
    }

    // 농작물 객체 참조 설정
    // 마우스 아웃하면 객체 참조 초기화
    setCrops(crops) {
        this.crops = crops;

        if (crops) {

            this.nameTxt.setText(crops.name);
            // 농작물 아이콘 위치 변경과 텍스처 변경
            const cropIconPad = 3;
            const cropIconX = this.nameTxt.x - (this.nameTxt.width / 2) - cropIconPad;
            this.cropIcon.x = cropIconX;

            // crop.name 농작물 이름은 한글
            this.cropIcon.setTexture(crops.name)
            .setDisplaySize(this.nameTxt.height, this.nameTxt.height);


            this.setGrowRemainContent();
            this.growRemainTxt.setText(this.growRemainContent);
        }
    }

    // 참조한 농작물 객체가 있으면 성장 완료까지 남은 시간 표시하기 위해
    // 업데이트
    update(delta) {

        if (this.crops) {

            // 참조한 농작물의 상태 확인하기
            if (this.crops.state === 'harvest') {
                console.log("참조한 농작물 성장 완료");

                // 농작물 정보 툴팁 끄기
                this.crops = null;
                this.setVisible(false).setPosition(0, 0);
            }

            this.setGrowRemainContent();
            this.growRemainTxt.setText(this.growRemainContent);
        }
    }

    // 참조한 농작물 객체의 remainTime(초)를 '몇분 몇초' 형식의 텍스트로 변환한다.
    setGrowRemainContent() {

        this.growRemainContent = '';

        if (this.crops) {

            const mins = Math.floor((this.crops.remainTime % 3600) / 60);
            const secs = Math.floor(this.crops.remainTime % 60);

            if (mins > 0) {
                this.growRemainContent += mins + 'm';
            }
            // 초 단위는 올림 처리
            if (secs >= 0) {

                if (this.growRemainContent !== '') {

                    console.log('몇분 몇초로 표시되어야 하니까 분초 사이에 한칸 공백 줌');
                    this.growRemainContent += ' ';
                }

                this.growRemainContent += (secs + 1) + 's';
            }

        }

    }

}