import Frame_LT from "./frame_lt";

// 농작물 정보 툴팁 클래스
// 게임 오브젝트 정보 툴팁으로 변경
export default class ObjectToolTip extends Frame_LT {

    scene;

    nameTxt;
    objIcon;
    remainTxt;
    remainContent;

    // 컨테이너 패딩
    pad = 10;
    // 텍스트나 라인간 간격
    space = 5;
    depth = 100;

    // 농작물 객체 참조
    crops = null;
    // 게임 오브젝트 객체
    gameObject = null;

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

        const objIconPad = 3;
        const objIconX = this.nameTxt.x - (this.nameTxt.width / 2) - objIconPad;

        // 오브젝트 아이콘 추가하기
        this.objIcon = scene.add.image(objIconX, totalHeight, '감자');
        this.objIcon.setOrigin(1, 0).setDisplaySize(this.nameTxt.height, this.nameTxt.height);

        totalHeight += this.nameTxt.height;

        this.remainTxt = scene.add.text(this.width / 2, totalHeight + this.space, '남은 성장 시간', txtStyle);
        this.remainTxt.setOrigin(0.5, 0);

        totalHeight += this.space + this.remainTxt.height;
        totalHeight += this.pad;

        //console.log("새로 설정될 높이 ", totalHeight);

        // 부모 클래스 함수 호출해서 UI 높이 조정
        this.setUISize(width, totalHeight);
        this.setSize(width, totalHeight);


        // 컨테이너에 자식 추가
        this.add([this.nameTxt, this.remainTxt, this.objIcon]);
    }


    // 마우스 오버 시 오브젝트 객체 참조 설정
    // 마우스 아웃하면 객체 참조 초기화
    setObject(object) {

        this.object = object;

        if (this.object === null) {
            return;
        }

        if (object.type === 'crops') {
            this.nameTxt.setText(object.name);
            // 농작물 아이콘 위치 변경과 텍스처 변경
            const objIconPad = 3;
            const objIconX = this.nameTxt.x - (this.nameTxt.width / 2) - objIconPad;
            this.objIcon.x = objIconX;
            this.objIcon.setVisible(true);

            // crop.name 농작물 이름은 한글
            this.objIcon.setTexture(object.name)
                .setDisplaySize(this.nameTxt.height, this.nameTxt.height);


            this.setRemainContent();
            this.remainTxt.setText(this.remainContent);

        } else if (object.type === 'tree') {
            //console.log('참조된 오브젝트는 나무');

            // 아이콘 감추기
            this.nameTxt.setText('재생성까지...');
            this.objIcon.setVisible(false);
            this.setRemainContent();
            this.remainTxt.setText(this.remainContent);
        }

    }
    // 참조한 오브젝트 객체가 있으면 성장 완료나 재생성까지 남은 시간 표시 하기 위해
    // 업데이트
    update(delta) {

        if (!this.object)
            return;

        // 참조한 객체의 타입이 농작물이면
        if (this.object.type === 'crops') {
            // 참조한 농작물의 상태 확인하기
            if (this.object.state === 'harvest') {
                console.log("참조한 농작물 성장 완료");

                // 오브젝트 정보 툴팁 끄기
                this.object = null;
                this.setVisible(false).setPosition(0, 0);
            }

            this.setRemainContent();
            this.remainTxt.setText(this.remainContent);
        }
        // 나무라면
        else if (this.object.type === 'tree') {

            if (this.object.state === 'tree'){

                this.object = null;
                this.setVisible(false).setPosition(0, 0);
            }

            this.setRemainContent();
            this.remainTxt.setText(this.remainContent);

        }
    }

    // 참조한 오브젝트의 remainTime(초)를 '몇분 몇초' 형식의 텍스트로 변환
    setRemainContent() {

        this.remainContent = '';

        if (this.object) {

            const mins = Math.floor((this.object.remainTime % 3600) / 60);
            const secs = Math.floor(this.object.remainTime % 60);

            if (mins > 0) {
                this.remainContent += mins + 'm';
            }
            // 초 단위는 올림 처리
            if (secs >= 0) {

                if (this.remainContent !== '') {

                    //console.log('몇분 몇초로 표시되어야 하니까 분초 사이에 한칸 공백 줌');
                    this.remainContent += ' ';
                }

                this.remainContent += (secs + 1) + 's';
            }

        }

    }

}