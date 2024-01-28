import Phaser from 'phaser';

const scale = 4;
const depth = 3;

// 타일 하나의 크기
const tileSize = 64;

// 타일의 중앙 위치
const tileCenterX = tileSize / 2;
const tileCenterY = tileSize / 2;

// 농작물 게임 오브젝트
// 부모 클래스 Container로 변경
export default class Crops extends Phaser.GameObjects.Container {

    // 농작물 이름 
    name = null;
    // 농작물이 존재할 씬 객체
    scene;

    // 밭 타일 중앙 위치에서 몇 픽셀 만큼 떨어져야 되는지
    // 이걸로 이미지를 밭 타일에 딱 맞춘다.
    offsetX = 1 * scale;
    offsetY = 1 * scale;

    cropSprite;
    // 성장 진행도 게이지 UI
    progressBar;
    // 남은 성장 시간 텍스트로 표시
    progressText;
    progressContent;

    // 농작물의 현재 상태를 나타낸다
    // 처음엔 새싹 상태
    state = 'sprout';

    // 심은 시간
    plantTime;
    // 성장 시간(단위 : 초)
    growSec;
    // 전체 성장 완료 시간
    growCompleteTime;
    // 성장 완료 시간(초로 변환)
    // 성장 완료까지 남은 시간
    remainTime;

    // 각 성장 단계에 도달하는 시간
    // 성장 1
    grow1Time;
    // 성장 2
    grow2Time;
    // 열매(수확기)
    harvestTime;

    // 다음 성장 단계에 도달하는데 남은 시간(단위 : 밀리초)
    nextGrowRemain = null;
    // 다음 성장 단계까지 필요한 총 성장 시간
    nextGrowingTime = null;

    // 농작물 스프라이트가 사용할 텍스처 키
    imgKey;

    // 게임에서 심은건지 게임 맵에서 불러온 건지 구별한다.
    isload;

    constructor(scene, x, y, seedName, plantTime, growSec, isload = false) {
        super(scene, x, y);

        this.name = seedName;
        this.scene = scene;

        this.imgKey = seedName + '_01';

        this.plantTime = plantTime;
        this.growSec = growSec;

        // 심은 시간 = 현재 시간

        //console.log("심은 농작물 이름 :", this.name);
        console.log("이 농작물의 심은 시간", plantTime);
        console.log("이 농작물의 전체 성장에 필요한 초", growSec);

        // 성장 완료 시간 계산하기
        this.growCompleteTime = new Date(plantTime.getTime() + growSec * 1000);
        //console.log("이 농작물의 전체 성장 완료 시간", this.growCompleteTime);



        // 인게임에서 농작물 심었다 plantTime

        // 중간에 접속했다 new Date()


        // 유저가 들어온 시간
        if (this.isload === true) {
            // 성장 완료까지 남은 시간 계산
            this.remainTime = this.getRemainTime(new Date());    

        } else {
            // 성장 완료까지 남은 시간 계산
            this.remainTime = this.getRemainTime(plantTime);
        }

        console.log("농작물 성장 완료까지 남은 시간(초) ", this.remainTime);


        // 씬의 디스플레이 목록에 추가하여 시각적으로 나타내게 한다.
        scene.add.existing(this);
        // 씬의 물리 시스템에 추가하여 물리적 상호작용을 가능하게 한다.
        scene.physics.add.existing(this);

        this.setSize(tileSize, tileSize);
        this.setDepth(depth);

        // 심은 시간으로부터 일정 시간 뒤 구하기
        // 유저가 성장 중간에 들어온 경우를 가정해서 테스트 가능하다.
        // const nowDate = new Date();
        // nowDate.getTime() + 15 * 1000

        // 농작물이 생성된 시간
        const now = new Date();

        // 생성된 시간에서 일정시간만큼 더해보기
        // 유저가 농작물을 심고 일정 시간 후에 재접속했다는 것을 가정함.
        //const nowPlus = new Date(now.getTime() + 7 * 1000);


        // 다음 성장 단계까지 필요한 총 성장 시간
        this.nextGrowingTime = growSec / 3 * 1000;
        const nextGrowingTime = this.nextGrowingTime;

        // 각 성장 단계에 도달하는 시간 계산
        this.grow1Time = new Date(plantTime.getTime() + nextGrowingTime);
        this.grow2Time = new Date(this.grow1Time.getTime() + nextGrowingTime);
        this.harvestTime = new Date(this.grow2Time.getTime() + nextGrowingTime);

        //console.log("성장 1단계 도달시간", this.grow1Time);
        //console.log("성장 2단계 도달시간", this.grow2Time);
        //console.log("수확기 도달시간", this.harvestTime);

        // 농작물 초기 성장 단계 설정
        // 현재 시간이랑 성장 완료 시간 비교
        this.setInitialStage(now);


        // 농작물 스프라이트 생성
        // 스프라이트 초기 상대 위치는 컨테이너 중앙 위치(0, 0)에서 
        // 1픽셀 아래인 (0, 4)에 배치시킨다. 
        this.cropSprite = scene.add.sprite(0, this.offsetY, this.imgKey);
        this.cropSprite.setScale(scale).setOrigin(0.5, 1);
        this.setSpritePosition();

        // 농작물 옵젝을 상호작용 가능하게 변경함.
        this.setInteractive();

        // 상호작용 영역 확인하고 싶음
        scene.input.enableDebug(this);

        this.on('pointerover', () => {
        //console.log(this.name + "에 마우스 오버함.");

        scene.cropsToolTip.setVisible(true);

        // 이거 위치 기준이 뭐지?
        // 아마 컨테이너 실제 영역이랑, 상호작용 영역이 다른듯

        scene.cropsToolTip.x = this.x - scene.cropsToolTip.width / 2;
        scene.cropsToolTip.y = this.y - scene.cropsToolTip.height - (this.height / 2) - scene.cropsToolTip.space ;

        scene.cropsToolTip.setCrops(this);

        });

        this.on('pointerout', (pointer) => {
            //console.log(this.name + "에 마우스 아웃");

            scene.cropsToolTip.setVisible(false);
        });



        // 성장 진행도 UI 표시
        this.progressBar = scene.add.image(0, 0, 'greenbar00');
        this.progressBar.setDisplaySize(this.progressBar.width * 4, this.progressBar.height * 3)
            .setOrigin(0.5, 1);
        this.progressBar.y += this.progressBar.displayHeight + this.offsetY;


        if (this.state === 'grow1') {
            this.progressBar.setTexture('greenbar02');
        } else if (this.state === 'grow2') {
            this.progressBar.setTexture('greenbar04');
        } else if (this.state === 'harvest') {
            this.progressBar.setVisible(false);
        }


        const txtStyle = {
            fontFamily: 'Arial',
            fontSize: 15,
            color: 'white',
            fontStyle: 'bold',
            align: 'center',
            stroke: 'black', // 외곽선
            strokeThickness: 4 // 외곽선 두께  
        };

        // 남은 성장 시간 표시하는 타이머 텍스트
        // 남은 성장 시간 초기화

        // 남은 시간이 60초 초과면 1m

        // 남은 시간이 60초 이하가 되면 60s

        // 70초 짜리로 테스트
        this.progressContent = '';

        const mins = Math.floor((this.remainTime % 3600) / 60);
        const secs = Math.floor(this.remainTime % 60);

        // 시간 표시를 제일 큰 단위, 작은 단위 표시로 할까 <- 일단 이걸로 한다
        // 아니면 제일 큰 단위만 나오게 할까?

        if( mins > 0){
            this.progressContent += mins + 'm';
        }

        if( secs > 0){
            this.progressContent += secs + 's';
        }

        this.progressText = scene.add.text(0, -this.offsetY, this.progressContent, txtStyle);
        this.progressText.setOrigin(0.5, 0.5);

        // 컨테이너에 자식 오브젝트 추가
        this.add([this.cropSprite, this.progressBar, this.progressText]);
    }

    // 농작물 오브젝트가 속한 씬에서 업데이트를 해줘야함.
    update(delta) {
        //console.log('농작물 성장중...');

        if( this.remainTime >= 0){
        this.remainTime -= delta / 1000;

        this.progressContent = '';

        // Math.floor : 소숫점 없애버리고 정수값만 리턴
        const mins = Math.floor((this.remainTime % 3600) / 60);
        const secs = Math.floor(this.remainTime % 60);

        // 성장완료랑 타이머 0초되는데 대략 1초정도 오차남
        if( mins > 0){
            this.progressContent += mins + 'm';
        }

        // 초단위는 올림처리해서 보여줘야 함.
        if( secs >= 0){
            this.progressContent += (secs + 1) + 's';
        }

        this.progressText.setText(this.progressContent);
        }
    }

    // 초기 성장단계 설정
    setInitialStage(now) {

        // 농작물 초기 성장 단계 설정
        // 현재 시간이랑 성장 완료 시간 비교
        if (now.getTime() >= this.growCompleteTime.getTime()) {
            // 열매 수확기로 설정
            //console.log("농작물 초기 성장 상태 : 열매(수확기)");

            this.imgKey = this.name + '_04';
            this.state = 'harvest';
        }
        // 성장이 다 끝나지 않은 경우
        else {

            // 새싹
            if (now.getTime() < this.grow1Time) {
                //console.log("농작물 초기 성장 상태 : 새싹");

                this.state = 'sprout';

                //console.log('농작물이 생성되고 난 후 5초 뒤의 시간', now);
                //console.log('성장 1단계 도달 시간', this.grow1Time);

                // 다음 성장 단계(성장 1단계)까지 남은 시간 계산(밀리초)
                this.nextGrowRemain = (this.grow1Time - now);
                //console.log("다음 성장 단계까지 남은 초", this.nextGrowRemain / 1000);

                // 성장 타이머 이벤트 추가
                this.scene.time.addEvent({
                    delay: this.nextGrowRemain, // 단위 : ms
                    callback: this.grow1,
                    callbackScope: this,
                    loop: false
                });

            }
            else if (now.getTime() < this.grow2Time) { // 성장 1
                //console.log("농작물 초기 성장 상태 : 성장1");

                this.imgKey = this.name + '_02';
                this.state = 'grow1';

                // 다음 성장 단계(성장 2단계)에 도달하는 데 남은 시간 계산(밀리초)
                this.nextGrowRemain = (this.grow2Time - now);

                //console.log('다음 성장 단계까지 남은 초', this.nextGrowRemain / 1000);

                // 다음 성장 단계로 가는 타이머 이벤트 설정
                this.scene.time.addEvent({
                    delay: this.nextGrowRemain, // 단위 : ms
                    callback: this.grow2,
                    callbackScope: this,
                    loop: false
                });

            }
            else { // 성장 2
                //console.log("농작물 초기 성장 상태 : 성장2");

                this.imgKey = this.name + '_03';
                this.state = 'grow2';

                // 다음 성장 단계(수확기)에 도달하는 데 남은 시간 계산(밀리초)
                this.nextGrowRemain = (this.harvestTime - now);

                //console.log('다음 성장 단계까지 남은 초', this.nextGrowRemain / 1000);

                // 다음 성장 단계로 가는 타이머 이벤트 설정
                this.scene.time.addEvent({
                    delay: this.nextGrowRemain, // 단위 : ms
                    callback: this.growComplete,
                    callbackScope: this,
                    loop: false
                });


            }
        }

    }

    // 성장기 1
    grow1() {

        //console.log("농작물 성장 1단계 도달");
        //console.log("다음 성장까지 남은 초", this.nextGrowingTime / 1000);

        // 성장기 1에 사용되는 이미지 키는 name + '_02'이다.
        // 예) this.name = 감자면 '감자_02'
        this.imgKey = this.name + '_02';
        const scene = this.scene;

        this.state = 'grow1';

        this.cropSprite.setTexture(this.imgKey);
        this.setSpritePosition();

        this.progressBar.setTexture('greenbar02');

        scene.time.addEvent({
            delay: this.nextGrowingTime, // 단위 : ms
            callback: this.grow2,
            callbackScope: this,
            loop: false
        });
    }
    // 성장기 2 설정 함수
    grow2() {

        //console.log("농작물 성장 2단계 도달");
        //console.log("다음 성장까지 남은 초", this.nextGrowingTime / 1000);

        // 성장기 1에 사용되는 이미지 키는 name + '_03'이다.        
        this.imgKey = this.name + '_03';
        const scene = this.scene;

        this.state = 'grow2';

        this.cropSprite.setTexture(this.imgKey);
        this.setSpritePosition();

        this.progressBar.setTexture('greenbar04');

        scene.time.addEvent({
            delay: this.nextGrowingTime, // 단위 : ms
            callback: this.growComplete,
            callbackScope: this,
            loop: false
        });
    }
    // 수확기
    growComplete() {

        //console.log("농작물 수확기 도달");
        //console.log('성장 완료');

        // 성장기 1에 사용되는 이미지 키는 name + '_04'이다.        
        this.imgKey = this.name + '_04';
        const scene = this.scene;

        this.state = 'harvest';

        this.cropSprite.setTexture(this.imgKey);
        this.setSpritePosition();

        this.progressBar.setTexture('greenbar00').setVisible(false);

        // 성장이 완료되어서 다음 성장 단계는 없음.

    }

    // 농작물 수확
    harvest() {
        this.destroy();
    }

    // 농작물 성장 완료까지 남은 시간 계산
    getRemainTime(now) {


        const completeTime = new Date(this.growCompleteTime);
        // 남은 시간 초로 변환
        const remainTimeInSec = (completeTime - now) / 1000;

        if (remainTimeInSec <= 0) {
            remainTimeInSec = 0;
        }

        // 시간 분 초 분리
        const hours = Math.floor(remainTimeInSec / 3600);
        const mins = Math.floor((remainTimeInSec % 3600) / 60);
        const secs = Math.floor((remainTimeInSec % 60));

        return remainTimeInSec;

    }

    //농작물 이름과 상태에 따라 농작물 스프라이트 위치를 밭 타일에 딱 맞게 설정한다.
    setSpritePosition() {

        // 스프라이트 위치를 초기 위치로 초기화 (0,4)
        //  전 성장단계에서 위치 조정이 있는 경우 보정
        this.cropSprite.x = 0;
        this.cropSprite.y = this.offsetY;

        // 새싹
        if (this.state === 'sprout') {

            switch (this.name) {
                case '':

                    break;
            }

        }
        // 성장1
        else if (this.state === 'grow1') {

            switch (this.name) {
                case '호박':
                    // 타일의 이루는 픽셀의 크기는 4x4
                    // 가로 길이가 홀수인 이미지는 2픽셀(반 픽셀) 만큼 빼면 밭 타일이랑 중앙에 위치됨.
                    this.cropSprite.x = this.cropSprite.x - this.offsetX / 2;
                    this.cropSprite.y = this.cropSprite.y + this.offsetY;

                    break;
            }

        }
        // 성장2
        else if (this.state === 'grow2') {
            switch (this.name) {

                // 1픽셀 아래
                case '감자':
                    this.cropSprite.y = this.cropSprite.y + this.offsetY;
                    break;
                // 1픽셀 왼쪽, 1픽셀 아래
                case '호박':
                    this.cropSprite.x = this.cropSprite.x - this.offsetX;
                    this.cropSprite.y = this.cropSprite.y + this.offsetY;
                    break;
                // 양배추 1픽셀 아래
                case '양배추':
                    this.cropSprite.y = this.cropSprite.y + this.offsetY;
                    break;

            }
        }
        // 수확기
        else if (this.state === 'harvest') {
            switch (this.name) {

                // 반픽셀 오른쪽, 1픽셀 아래
                case '감자':
                    this.cropSprite.x = this.cropSprite.x + this.offsetX / 2;
                    this.cropSprite.y = this.cropSprite.y + this.offsetY;
                    break;
                // 1픽셀 아래
                case '호박':
                    this.cropSprite.y = this.cropSprite.y + this.offsetY;
                    break;
                // 2픽셀 아래
                case '양배추':
                    this.cropSprite.y = this.cropSprite.y + this.offsetY * 2;
                    break;

            }
        } else {
            console.log("정의되지 않은 성장 상태");
        }
    }
}