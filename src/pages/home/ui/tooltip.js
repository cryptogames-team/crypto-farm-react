import Frame_LT from "./frame_lt";

// 아이템 툴팁 클래스
export default class ToolTip extends Frame_LT {

    // 씬 참조
    scene;

    // 헤더 라인 추가
    headerLine;

    nameTxt;
    typeTxt;
    desTxt;
    seedTimeTxt;
    timerIcon;
    priceTxt;

    // 컨테이너 패딩
    pad = 15;
    // 텍스트나 라인간 간격
    space = 10;

    constructor(scene, x, y, width, height) {

        super(scene, x, y, width, height);

        this.scene = scene;
        this.setSize(width, height);

        // 아이템 이름 텍스트
        const nameX = this.pad;
        const nameY = this.pad;

        this.nameTxt = scene.add.text(nameX, nameY, '양배추', {
            fontFamily: 'Arial',
            fontSize: 30,
            color: 'black',
            fontStyle: 'bold'
        });

        // 텍스트의 높이를 구함 : 텍스트가 화면에 렌더링된 후에 정확한 값을 가짐.
        // 텍스트의 내용과 스타일(예 : 글꼴 크기)에 따라 높이가 달라진다.
        //console.log("nameTxt의 높이", this.nameTxt.height);

        const typeX = this.pad;
        const typeY = nameY + this.nameTxt.height + this.space;

        this.typeTxt = scene.add.text(typeX, typeY, '농작물', {
            fontFamily: 'Arial',
            fontSize: 20,
            color: 'black',
            fontStyle: 'bold'
        });

        //console.log("typeTxt의 높이", this.typeTxt.height);

        // 헤더 라인 추가
        const headerX = this.edgeSize;
        const headerY = typeY + this.typeTxt.height + this.space;

        this.headerLine = scene.add.image(headerX, headerY , 'tab_9slice_tc')
        .setOrigin(0,0).setDisplaySize(width - (this.edgeSize * 2), this.edgeSize );


        // 아이템 설명 텍스트 <- 여기 자동 줄 바꿈되어야 하는데
        const desX = this.pad;
        const desY = headerY + this.headerLine.displayHeight + this.space;

        this.desTxt = scene.add.text(desX, desY, '아이템 설명', {
            fontFamily: 'Arial',
            fontSize: 20,
            color: 'black',
            fontStyle: 'bold',
            // 텍스트가 일정 길이 이상 길어질 때 자동으로 줄 바꿈
            wordWrap : {
                // 줄바꿈할 최대 너비
                width : this.width - this.edgeSize * 2,
                // 고급 줄 바꿈 옵션 : 공백이 아닌 문자에서도 줄바꿈을 허용한다.
                useAdvancedWrap : true
            }
        });

        //console.log("desTxt 높이", this.desTxt.height);


        // 성장 시간 텍스트 <- 중앙배치
        const seedTimeX = (this.width - this.edgeSize * 2 ) / 2;
        const seedTimeY = desY + this.desTxt.height + this.space;

        // 텍스트에 멀 넣든 고정 크기를 가진다.
        this.seedTimeTxt = scene.add.text(seedTimeX, seedTimeY, '성장 시간' , {
            fontFamily: 'Arial',
            fontSize: 15,
            color: 'white',
            fontStyle: 'bold'
        });
        this.seedTimeTxt.setOrigin(0.5, 0);

        // 성장 시간 타이머 아이콘 추가
        // 성장 시간 텍스트 왼쪽에 붙임.
        const timerX = seedTimeX - this.seedTimeTxt.width / 2 - this.pad * 2;
        const timerY = seedTimeY;

        this.timerIcon = scene.add.image(timerX , timerY, 'timer');
        this.timerIcon.setOrigin(0,0).setDisplaySize(15, 15);

        //console.log("seedTimeTxt 높이", this.seedTimeTxt.height);

        // 툴팁 컨테이너에 추가한다.
        this.add([this.nameTxt, this.typeTxt, this.headerLine, this.desTxt, this.seedTimeTxt,
        this.timerIcon]);
    }


    // 아이템 툴팁 내용 재설정하기
    setToolTip(item){
        
        // 반드시 표시되어야 하는 항목 : 아이템 이름, 타입, 헤더 라인, 아이템 설명
        // 아이템 타입에 따라 표시되어야 하는 항목 : 성장 시간

        let type = null;

        // 성장 시간 표시 초기화
        this.seedTimeTxt.setText('');
        // 타이머도 안보이게 함
        this.timerIcon.setVisible(false);

        if( item.type === 0 ){
            type = '씨앗';

        }else if ( item.type === 1){
            type = '농작물';
        }else if ( item.type === 2 ){
            type = '제작 재료';
        }else if ( item.type === 3){
            type = '요리 재료';
        }else if ( item.type === 4){
            type = '도구';
        }

        this.nameTxt.setText(item.name);
        this.typeTxt.setText(type);
        this.desTxt.setText(item.des);


        // 성장 시간 표시
        if( type === '씨앗'){


            // 성장 시간 표시하는 텍스트 내용
            let seedTimeTxt = '';
            // 성장 시간(초)를 몇분 몇초로 변환한다.

            // 제일 긴게 3000초임 3600초가 1시간
            // 지금은 분 초로 표현가능

            // 분 구하기
            // 정수 부분만 필요하니 소수 부분은 버림.
            const seedMin = Math.floor(item.seed_Time / 60);
            if(seedMin !== 0){
                seedTimeTxt += seedMin + '분'
            }

            // 나머지 연산
            const seedSec = item.seed_Time % 60;
            if(seedSec !== 0){
                seedTimeTxt += ' ' + seedSec + '초';
            }

            // 텍스트 위치 변경 해야됨 왜? 아이템 마다 설명 길이가 다르니까
            const seedTimeX = (this.width - this.edgeSize * 2 ) / 2;
            const seedTimeY = this.desTxt.y + this.desTxt.height + this.space;
            this.seedTimeTxt.x = seedTimeX;
            this.seedTimeTxt.y = seedTimeY;

            this.timerIcon.setVisible(true);
            this.seedTimeTxt.setText(seedTimeTxt);

            // 변경된 성장 시간 텍스트 내용에 따라 타이머 아이콘도 이동한다.
            const timerX = seedTimeX - this.seedTimeTxt.width / 2 - this.pad * 2;
            const timerY = seedTimeY;
            this.timerIcon.x = timerX;
            this.timerIcon.y = timerY;
        }



    }

}