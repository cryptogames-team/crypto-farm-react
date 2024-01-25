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

    // 농작물의 현재 상태를 나타낸다
    // 처음엔 새싹 상태
    state = 'sprout';

    // 심은 시간
    // yyyy:mm:dd hh:mm:ss 형식 <- 굳이 이렇게 안해도 날짜 계산이 된다.
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

    // 각 성장 단계에 도달하는데 남은 시간
    grow1Remain;
    grow2Remain;
    harvestTime;


    // 농작물 스프라이트가 사용할 텍스처 키
    imgKey;

    constructor(scene, x, y, seedName, plantTime, growSec) {
        super(scene, x, y);

        this.name = seedName;
        this.scene = scene;

        this.imgKey = seedName + '_01';

        this.plantTime = plantTime;
        this.growSec = growSec;

        console.log("이 농작물의 심은 시간", plantTime);
        console.log("이 농작물의 전체 성장 시간", growSec);

        // 성장 완료 시간 계산하기
        this.growCompleteTime = new Date(plantTime.getTime() + growSec * 1000);

        console.log("이 농작물의 전체 성장 완료 시간", this.growCompleteTime);

        // 성장 완료까지 남은 시간 계산
        this.remainTime = this.getRemainTime();

        console.log("농작물 성장 완료까지 남은 시간(밀리초) ", this.remainTime);



        //console.log("농작물 객체 생성 : " + this.name);

        // 씬의 디스플레이 목록에 추가하여 시각적으로 나타내게 한다.
        scene.add.existing(this);
        // 씬의 물리 시스템에 추가하여 물리적 상호작용을 가능하게 한다.
        scene.physics.add.existing(this);

        this.setSize(tileSize, tileSize);
        this.setDepth(depth);


        // 농작물이 생성된 시간
        const now = new Date();

        // 생성된 시간에서 일정시간만큼 더해보기
        const nowPlus = new Date(now.getTime() + 7 * 1000);

        // 각 단계의 성장 시간(단위 : 밀리초)
        const growingTime = growSec / 3 * 1000;


        this.grow1Time = new Date(plantTime.getTime() + growingTime);
        this.grow2Time = new Date(this.grow1Time.getTime() + growingTime);
        this.harvestTime = new Date(this.grow2Time.getTime() + growingTime);

        console.log("성장 1단계 도달시간", this.grow1Time);
        console.log("성장 2단계 도달시간", this.grow2Time);
        console.log("수확기 도달시간", this.harvestTime);

        // 농작물 초기 성장 단계 설정하기
        // 심은 시간이랑 현재 시간 비교해서 성장단계 설정하기

        // 현재 시간 >= 성장 완료 시간
        // 열매(수확기)

        // 현재 시간 < 성장 완료 시간 <- 여기 세부화
        // 새싹, 성장1, 성장2


        // 초기 상태가 성장 1일때 테스트


        // 현재 시간이랑 성장 완료 시간 비교
        if (nowPlus.getTime() >= this.growCompleteTime.getTime()) {
            // 열매 수확기로 설정
            console.log("농작물 초기 성장 상태 : 열매(수확기)");

            this.imgKey = seedName + '_04';

            this.cropSprite = scene.add.sprite(0, this.offsetY, this.imgKey);
            this.cropSprite.setScale(scale).setOrigin(0.5, 1);
        }
        else {

            // 새싹
            if (nowPlus.getTime() < this.grow1Time) {
                console.log("농작물 초기 성장 상태 : 새싹");

                // 농작물 스프라이트 생성
                // 새싹 이미지로 설정한다.
                // 스프라이트 상대 위치는 컨테이너 중앙 위치(0, 0)에서 
                // 1픽셀 아래인 (0, 4)에 배치시킨다. 
                this.cropSprite = scene.add.sprite(0, this.offsetY, this.imgKey);
                this.cropSprite.setScale(scale).setOrigin(0.5, 1);

                this.state = 'sprout';
            }
            else if (nowPlus.getTime() < this.grow2Time) { // 성장 1
                console.log("농작물 초기 성장 상태 : 성장1");

                this.imgKey = seedName + '_02';

                this.cropSprite = scene.add.sprite(0, this.offsetY, this.imgKey);
                this.cropSprite.setScale(scale).setOrigin(0.5, 1);
            }
            else { // 성장 2
                console.log("농작물 초기 성장 상태 : 성장2");

                this.imgKey = seedName + '_03';

                this.cropSprite = scene.add.sprite(0, this.offsetY, this.imgKey);
                this.cropSprite.setScale(scale).setOrigin(0.5, 1);
            }
        }


        // 농작물 컨테이너를 클릭 가능하게 변경한다.
        /*         this.setInteractive();
                this.on('pointerdown', () => {
                    console.log(this.name + " 클릭함.");
                }); */



        // 컨테이너에 자식 오브젝트 추가
        this.add([this.cropSprite]);


        // 타이머 이벤트 추가
        // 주의 : callback 부분에 존재하지 않는 함수 등록해도 에러 발생 안됨.
/*         scene.time.addEvent({
            delay: 1000, // 단위 : ms
            callback: this.grow1,
            callbackScope: this,
            loop: false
        }); */

    }

    setInitialStage() {
        // 농작물의 초기 텍스처 설정
        this.setTexture('seedTexture');
    }

    // 성장기 1
    grow1() {

        //console.log("농작물 성장기 1");

        // 성장기 1에 사용되는 이미지 키는 name + '_02'이다.
        // 예) this.name = 감자면 '감자_02'
        this.imgKey = this.name + '_02';
        const scene = this.scene;

        this.state = 'grow1';

        // 이미지를 초기 위치로 초기화 (0, 4)
        // 전 성장단계에서 위치 조정이 있는 경우 보정하기 위해
        this.cropSprite.x = 0;
        this.cropSprite.y = this.offsetY;

        this.cropSprite.setTexture(this.imgKey);



        // 호박 반 픽셀 왼쪽, 1픽셀 아래(-2, 8)
        if (this.name === '호박') {
            //console.log("호박 성장기 1 위치 조정");
            // 타일의 이루는 픽셀의 크기는 4x4
            // 가로 길이가 홀수인 이미지는 2픽셀(반 픽셀) 만큼 빼면 밭 타일이랑 중앙에 위치됨.
            this.cropSprite.x = this.cropSprite.x - this.offsetX / 2;
            this.cropSprite.y = this.cropSprite.y + this.offsetY;
        }

        /* scene.time.addEvent({
            delay: 1000, // 단위 : ms
            callback: this.grow2,
            callbackScope: this,
            loop: false
        }); */
    }
    // 성장기 2
    grow2() {

        //console.log("농작물 성장기 2");
        // 성장기 1에 사용되는 이미지 키는 name + '_03'이다.        
        this.imgKey = this.name + '_03';
        const scene = this.scene;

        this.state = 'grow2';

        // 이미지를 초기 위치로 초기화
        // 전 성장단계에서 위치 조정이 있는 경우 보정하기 위해
        this.cropSprite.x = 0;
        this.cropSprite.y = 0 + this.offsetY;

        this.cropSprite.setTexture(this.imgKey);

        // 감자 1픽셀 아래
        if (this.name === '감자') {
            //console.log("감자 성장기 2 위치 조정");
            this.cropSprite.y = this.cropSprite.y + this.offsetY;
        }
        // 호박 1픽셀 왼쪽, 1픽셀 아래
        else if (this.name === '호박') {
            //console.log("호박 성장기 2 위치 조정");
            this.cropSprite.x = this.cropSprite.x - this.offsetX;
            this.cropSprite.y = this.cropSprite.y + this.offsetY;
        }
        // 양배추 1픽셀 아래
        else if (this.name === '양배추') {
            //console.log("양배추 성장기 2 위치 조정");
            this.cropSprite.y = this.cropSprite.y + this.offsetY;
        }


        /* scene.time.addEvent({
            delay: 1000, // 단위 : ms
            callback: this.growComplete,
            callbackScope: this,
            loop: false
        }); */
    }
    // 수확기
    growComplete() {

        // 성장기 1에 사용되는 이미지 키는 name + '_04'이다.        
        this.imgKey = this.name + '_04';
        const scene = this.scene;

        this.state = 'harvest';

        // 이미지를 초기 위치로 초기화
        // 전 성장단계에서 위치 조정이 있는 경우 보정하기 위해
        this.cropSprite.x = 0;
        this.cropSprite.y = 0 + this.offsetY;

        // 수확기 이미지 위치 조정
        // 감자 반픽셀 오른쪽, 1픽셀 아래
        if (this.name === '감자') {
            //console.log("감자 수확기 위치 조정");
            this.cropSprite.x = this.cropSprite.x + this.offsetX / 2;
            this.cropSprite.y = this.cropSprite.y + this.offsetY;
        }
        // 호박 1픽셀 아래
        else if (this.name === '호박') {
            //console.log("호박 수확기 위치 조정");
            this.cropSprite.y = this.cropSprite.y + this.offsetY;
        }
        // 양배추 2픽셀 아래
        else if (this.name === '양배추') {
            //console.log("양배추 수확기 위치 조정");
            this.cropSprite.y = this.cropSprite.y + this.offsetY * 2;
        }


        this.cropSprite.setTexture(this.imgKey);
        //console.log("농작물 수확기");


    }

    // 농작물 수확
    harvest() {
        this.destroy();
    }

    // 농작물 성장 완료까지 남은 시간 계산
    getRemainTime() {
        const now = new Date();
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
}