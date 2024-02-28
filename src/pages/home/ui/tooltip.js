import Frame_LT from "./frame/frame_lt";

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
    goldIcon;

    // 요리 재료 1
    ingredient1Txt;
    ingredient1Icon;
    // 요리 재료 2
    ingredient2Txt;
    ingredient2Icon;

    // 경험치 표시
    expTxt;
    expIcon;

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

        this.nameTxt = scene.add.text(nameX, nameY, '아이템 이름', {
            fontFamily: 'Arial',
            fontSize: 25,
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

        this.headerLine = scene.add.image(headerX, headerY, 'tab_9slice_tc')
            .setOrigin(0, 0).setDisplaySize(width - (this.edgeSize * 2), this.edgeSize);


        // 아이템 설명 텍스트
        const desX = this.pad;
        const desY = headerY + this.headerLine.displayHeight + this.space;

        this.desTxt = scene.add.text(desX, desY, '아이템 설명', {
            fontFamily: 'Arial',
            fontSize: 18,
            color: 'black',
            fontStyle: 'bold',
            // 텍스트가 일정 길이 이상 길어질 때 자동으로 줄 바꿈
            wordWrap: {
                // 줄바꿈할 최대 너비
                width: this.width - this.edgeSize * 2,
                // 고급 줄 바꿈 옵션 : 공백이 아닌 문자에서도 줄바꿈을 허용한다.
                useAdvancedWrap: true
            }
        });

        //console.log("desTxt 높이", this.desTxt.height);

        // 가격 텍스트 중앙 배치
        const priceX = (this.width - this.edgeSize * 2) / 2;
        const priceY = desY + this.desTxt.height + this.space;
        this.priceTxt = scene.add.text(priceX, priceY, '아이템 가격', {
            fontFamily: 'Arial',
            fontSize: 15,
            color: 'white',
            fontStyle: 'bold'
        });
        this.priceTxt.setOrigin(0.5, 0);

        // 골드 아이콘 가격 텍스트 왼쪽 옆에 추가
        const goldX = priceX - this.priceTxt.width / 2 - this.pad * 2;
        const goldY = priceY;
        this.goldIcon = scene.add.image(goldX, goldY, 'goldIcon');
        this.goldIcon.setOrigin(0, 0).setDisplaySize(18, 18);

        // 성장 시간 텍스트 <- 중앙배치
        const seedTimeX = (this.width - this.edgeSize * 2) / 2;
        const seedTimeY = priceY + this.priceTxt.height + this.space;

        // 텍스트에 멀 넣든 고정 크기를 가진다.
        this.seedTimeTxt = scene.add.text(seedTimeX, seedTimeY, '성장 시간', {
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

        this.timerIcon = scene.add.image(timerX, timerY, 'timer');
        this.timerIcon.setOrigin(0, 0).setDisplaySize(18, 18);

        //console.log("seedTimeTxt 높이", this.seedTimeTxt.height);

        // 요리 재료 1 텍스트 추가 - 툴팁 중앙 배치
        let ingredient1X = (this.width - this.edgeSize * 2) / 2;
        let ingredient1Y = seedTimeY + this.seedTimeTxt.height + this.space;
        this.ingredient1Txt = scene.add.text(ingredient1X, ingredient1Y, '요리 재료 1', {
            fontFamily: 'Arial',
            fontSize: 15,
            color: 'white',
            fontStyle: 'bold'
        });
        this.ingredient1Txt.setOrigin(0.5, 0);

        // 요리 재료 1 아이콘 추가 - 텍스트 옆 배치
        ingredient1X = ingredient1X - this.ingredient1Txt.width / 2 - this.pad * 2;
        this.ingredient1Icon = scene.add.image(ingredient1X, ingredient1Y, '감자');
        this.ingredient1Icon.setOrigin(0, 0).setDisplaySize(18, 18);

        // 요리 재료 2 텍스트 추가
        let ingredient2X = (this.width - this.edgeSize * 2) / 2;
        let ingredient2Y = ingredient1Y + this.ingredient1Txt.height + this.space;
        this.ingredient2Txt = scene.add.text(ingredient2X, ingredient2Y, '요리 재료 2', {
            fontFamily: 'Arial',
            fontSize: 15,
            color: 'white',
            fontStyle: 'bold'
        });
        this.ingredient2Txt.setOrigin(0.5, 0);

        // 요리 재료 2 아이콘 추가
        ingredient2X = ingredient2X - this.ingredient2Txt.width / 2 - this.pad * 2;
        this.ingredient2Icon = scene.add.image(ingredient2X, ingredient2Y, '양배추');
        this.ingredient2Icon.setOrigin(0, 0).setDisplaySize(18, 18);

        // 경험치량 텍스트
        let expX = (this.width - this.edgeSize * 2) / 2;
        let expY = ingredient2Y + this.ingredient2Txt.height + this.space;
        this.expTxt = scene.add.text(expX, expY, '경험치', {
            fontFamily: 'Arial',
            fontSize: 15,
            color: 'white',
            fontStyle: 'bold'
        });
        this.expTxt.setOrigin(0.5, 0);

        // 경험치 아이콘 expIcon
        expX = expX - this.expTxt.width / 2 - this.pad * 2;
        this.expIcon = scene.add.image(expX, expY, 'expIcon');
        this.expIcon.setOrigin(0, 0).setDisplaySize(18, 18);

        // 툴팁 컨테이너에 추가한다.
        this.add([this.nameTxt, this.typeTxt, this.headerLine, this.desTxt,
        this.priceTxt, this.goldIcon, this.seedTimeTxt, this.timerIcon]);
        this.add([this.ingredient1Txt, this.ingredient1Icon]);
        this.add([this.ingredient2Txt, this.ingredient2Icon]);
        this.add([this.expTxt, this.expIcon]);
    }


    // 아이템 툴팁 내용 재설정하기
    setToolTip(item) {

        // 반드시 표시되어야 하는 항목 : 아이템 이름, 타입, 헤더 라인, 아이템 설명
        // 아이템 타입에 따라 표시되어야 하는 항목 : 성장 시간, 얻는 경험치 량

        //console.log('전달받은 아이템 객체', item);

        let type = null;

        // 성장 시간 표시 초기화
        this.seedTimeTxt.setText('');
        // 타이머도 안보이게 함
        this.timerIcon.setVisible(false);

        // 텍스트 안보이게 하기
        this.ingredient1Txt.setVisible(false);
        this.ingredient2Txt.setVisible(false);
        this.expTxt.setVisible(false);

        // 아이템 가격 텍스트, 골드 아이콘, 요리 재료, 경험치량 안보이게 하기
        this.priceTxt.setVisible(false);
        this.goldIcon.setVisible(false);
        this.ingredient1Icon.setVisible(false);
        this.ingredient2Icon.setVisible(false);
        this.expIcon.setVisible(false);

        if (item.type === 0) {
            type = '씨앗';
        } else if (item.type === 1) {
            type = '농작물';
        } else if (item.type === 2) {
            type = '제작 재료';
        } else if (item.type === 3) {
            type = '요리 재료';
        } else if (item.type === 4) {
            type = '도구';
        } else if (item.type === 5) {
            type = '요리';
        }

        this.nameTxt.setText(item.name);
        this.typeTxt.setText(type);
        this.desTxt.setText(item.des);

        // 성장 시간 표시
        if (type === '씨앗') {

            // 성장 시간 표시하는 텍스트 내용
            let seedTimeTxt = this.setSeedTime(item.seed_Time);

            // 텍스트 위치 변경 해야됨 왜? 아이템 마다 설명 길이가 다르니까
            const seedTimeX = (this.width - this.edgeSize * 2) / 2;
            const seedTimeY = this.desTxt.y + this.desTxt.height + this.space;
            this.seedTimeTxt.x = seedTimeX;
            this.seedTimeTxt.y = seedTimeY;

            this.seedTimeTxt.setText(seedTimeTxt);

            // 변경된 성장 시간 텍스트 내용에 따라 타이머 아이콘도 이동한다.
            const timerX = seedTimeX - this.seedTimeTxt.width / 2 - this.pad * 2;
            const timerY = seedTimeY;
            this.timerIcon.x = timerX;
            this.timerIcon.y = timerY;
            this.timerIcon.setVisible(true);
        }
        else if (type === '요리'){ // 얻는 경험치량 표시

            let exp = item.seed_Time + ' EXP';
            // 경험치 텍스트 표시
            let expX = (this.width - this.edgeSize * 2) / 2;
            let expY = this.desTxt.y + this.desTxt.height + this.space;
            this.expTxt.x = expX; this.expTxt.y = expY;
            this.expTxt.setVisible(true);
            this.expTxt.setText(exp);

            // 경험치 아이콘 표시
            expX = expX - this.expTxt.width / 2 - this.pad * 2;
            this.expIcon.x = expX; this.expIcon.y = expY;
            this.expIcon.setVisible(true);
        }
    }

    // 상점, 화덕 UI에 표시할 아이템 툴팁 설정
    setStoreToolTip(item) {

        // 객체에 없는 속성을 분해해도 문제 없음
        // undefined가 할당된다
        const { item_id, item_type, item_name,
            item_des, seed_time, use_level, item_price, ingredients } = item;

        //console.log('setStoreToolTip item', item);

        // 아이템 정보 텍스트들 전부 초기화
        this.priceTxt.setText('');
        this.seedTimeTxt.setText('');
        this.ingredient1Txt.setText('');
        this.ingredient2Txt.setText('');
        this.expTxt.setText('');
        // 아이콘들 안보이게 설정
        this.timerIcon.setVisible(false);
        this.goldIcon.setVisible(false);
        this.ingredient1Icon.setVisible(false);
        this.ingredient2Icon.setVisible(false);
        this.expIcon.setVisible(false);

        // 타입 표시 텍스트
        let type = null;
        if (item_type === 0) {
            type = '씨앗';
        } else if (item_type === 1) {
            type = '농작물';
        } else if (item_type === 2) {
            type = '제작 재료';
        } else if (item_type === 3) {
            type = '요리 재료';
        } else if (item_type === 4) {
            type = '도구';
        } else if (item_type === 5) {
            type = '요리';
        }

        // 아이템 타입에 상관 없이 기본으로 표시되어야 하는 정보들
        this.nameTxt.setText(item_name);
        this.typeTxt.setText(type);
        this.desTxt.setText(item_des);

        // 아이템 타입이 씨앗 이거나 농작물일 때 표시될 텍스트들과 아이콘 설정
        if (type === '씨앗' || type === '농작물') {

            // 아이템 타입에 따라 표시될 텍스트들과 아이콘 설정
            // 가격 텍스트 위치, 내용 설정
            const priceX = (this.width - this.edgeSize * 2) / 2;
            const priceY = this.desTxt.y + this.desTxt.height + this.space;
            this.priceTxt.x = priceX;
            this.priceTxt.y = priceY;
            this.priceTxt.setText(item_price);
            // 골드 아이콘 위치 설정
            const goldX = priceX - this.priceTxt.width / 2 - this.pad * 2;
            const goldY = priceY;
            this.goldIcon.x = goldX;
            this.goldIcon.y = goldY;
            this.goldIcon.setVisible(true);
        }

        // 농작물 씨앗일때만 표시한다
        if (type === '씨앗') {
            // 성장 시간 표시하는 텍스트에 들어갈 내용
            let seedTimeTxt = this.setSeedTime(seed_time);

            // 성장 시간 텍스트
            const seedTimeX = (this.width - this.edgeSize * 2) / 2;
            const seedTimeY = this.priceTxt.y + this.priceTxt.height + this.space;
            this.seedTimeTxt.x = seedTimeX;
            this.seedTimeTxt.y = seedTimeY;
            this.seedTimeTxt.setText(seedTimeTxt);

            // 타이머 아이콘
            const timerX = seedTimeX - this.seedTimeTxt.width / 2 - this.pad * 2;
            const timerY = seedTimeY;
            this.timerIcon.x = timerX;
            this.timerIcon.y = timerY;
            this.timerIcon.setVisible(true);
        }

        if (type === '요리') {

            // 요리 재료 1 표시
            // 텍스트
            let ingredient1X = (this.width - this.edgeSize * 2) / 2;
            let ingredient1Y = this.desTxt.y + this.desTxt.height + this.space;
            this.ingredient1Txt.x = ingredient1X; this.ingredient1Txt.y = ingredient1Y;

            // 유저가 소유한 재료 아이템 1 개수
            let ownIngr1 = 0;
            const ownIngr1Slot = this.scene.findAddItemSlot(ingredients[0].name);
            if (ownIngr1Slot.item)
                ownIngr1 = ownIngr1Slot.item.count;

            // 요리에 필요한 재료 아이템 1 개수
            let requireIngr1 = ingredients[0].quantity;
            this.ingredient1Txt.setText(`${ownIngr1} / ${requireIngr1}`);

            // 소유한 재료 아이템 개수가 부족하면 빨간색으로 글씨 변경
            if (ownIngr1 < requireIngr1) {
                this.ingredient1Txt.setColor('red');
            } else {
                this.ingredient1Txt.setColor('white');
            }

            // 아이콘
            ingredient1X = ingredient1X - this.ingredient1Txt.width / 2 - this.pad * 2;
            this.ingredient1Icon.x = ingredient1X; this.ingredient1Icon.y = ingredient1Y;
            // 아이콘 이미지 변경하기
            this.ingredient1Icon.setTexture(ingredients[0].name);
            this.ingredient1Icon.setDisplaySize(18, 18);
            this.ingredient1Icon.setVisible(true);

            // 경험치 텍스트 위치
            let expX = (this.width - this.edgeSize * 2) / 2;
            let expY = this.ingredient1Txt.y + this.ingredient1Txt.height + this.space;

            if (ingredients.length === 1) {
                //console.log('1가지 재료 사용 요리');
            } else if (ingredients.length === 2) {
                //console.log('2가지 재료 사용 요리');

                // 요리 재료 2 표시
                // 텍스트
                let ingredient2X = (this.width - this.edgeSize * 2) / 2;
                let ingredient2Y = this.ingredient1Txt.y + this.ingredient1Txt.height + this.space;
                this.ingredient2Txt.x = ingredient2X; this.ingredient2Txt.y = ingredient2Y;
                // 유저가 소유한 재료 아이템 2 개수
                let ownIngr2 = 0;
                const ownIngr2Slot = this.scene.findAddItemSlot(ingredients[1].name);
                if (ownIngr2Slot.item)
                    ownIngr2 = ownIngr2Slot.item.count;
                // 요리에 필요한 재료 아이템 2 개수
                let requireIngr2 = ingredients[1].quantity;
                this.ingredient2Txt.setText(`${ownIngr2} / ${requireIngr2}`);

                // 소유한 재료 아이템 개수가 부족하면 빨간색으로 글씨 변경
                if (ownIngr2 < requireIngr2) {
                    this.ingredient2Txt.setColor('red');
                } else {
                    this.ingredient2Txt.setColor('white');
                }

                // 아이콘
                ingredient2X = ingredient2X - this.ingredient2Txt.width / 2 - this.pad * 2;
                this.ingredient2Icon.x = ingredient2X;
                this.ingredient2Icon.y = ingredient2Y;
                // 아이콘 이미지 변경
                this.ingredient2Icon.setTexture(ingredients[1].name);
                this.ingredient2Icon.setDisplaySize(18, 18);
                this.ingredient2Icon.setVisible(true);

                // 경험치 텍스트 위치 변경 <- 제일 아래에 있어야한다.
                expY = this.ingredient2Txt.y + this.ingredient2Txt.height + this.space;
            }

            // 얻는 경험치 표시
            // 텍스트
            this.expTxt.x = expX; this.expTxt.y = expY;
            this.expTxt.setText(seed_time + ' EXP');
            // 아이콘
            expX = expX - this.expTxt.width / 2 - this.pad * 2;
            this.expIcon.x = expX; this.expIcon.y = expY;
            this.expIcon.setVisible(true);
        }
    }

    // 씨앗 아이템의 성장 시간(초)를 몇분 몇초 형식으로 변환하고 리턴
    setSeedTime(seedTime) {

        // 성장 시간 표시하는 텍스트 내용
        let seedTimeTxt = '';
        // 성장 시간(초)를 몇분 몇초 형식으로 변환한다.

        // 분 구하기
        // 정수 부분만 필요하니 소수 부분은 버림.
        const seedMin = Math.floor(seedTime / 60);
        if (seedMin !== 0) {
            seedTimeTxt += seedMin + '분'
        }

        // 나머지 연산해서 '초' 구하기
        const seedSec = seedTime % 60;
        if (seedSec !== 0) {
            seedTimeTxt += ' ' + seedSec + '초';
        }
        return seedTimeTxt;
    }
}