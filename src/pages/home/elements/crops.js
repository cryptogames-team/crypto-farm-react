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

    constructor(scene, x, y, texture, seed) {
        super(scene, x, y);

        this.name = seed;
        this.scene = scene;

        //console.log("농작물 객체 생성 : " + this.name);

        // 씬의 디스플레이 목록에 추가하여 시각적으로 나타내게 한다.
        scene.add.existing(this);
        // 씬의 물리 시스템에 추가하여 물리적 상호작용을 가능하게 한다.
        // 디버그용
        scene.physics.add.existing(this);

        this.setSize(tileSize, tileSize);
        
        //console.log("Crops Container Origin :", this.originX, this.originY);


        // 물리 바디 오프셋 설정 가능하다.
        //this.body.setOffset(tileSize / 2, tileSize / 2);

        // body 사이즈는 Scale에 영향받음.
        //this.body.setSize(tileSize, tileSize);
        this.setDepth(depth);

        // 컨테이너 객체는 기본적으로 크기나 모양이 없기 때문에 setInteractive() 호출 전에
        // 크기를 지정하거나 대화형 영역을 명시적으로 설정해야 한다.


        // 컨테이너를 클릭 가능하게 변경한다.
/*         this.setInteractive();
        this.on('pointerdown', () => {
            console.log(this.name + " 클릭함.");
        }); */

        // 농작물 스프라이트 생성
        // 새싹 이미지로 설정한다.
        // 스프라이트 상대 위치는 컨테이너 중앙 위치(0, 0)에서 
        // 1픽셀 아래인 (0, 4)에 배치시킨다. 
        this.cropSprite = scene.add.sprite(0, this.offsetY, texture);
        this.cropSprite.setScale(scale).setOrigin(0.5, 1);

        // 컨테이너에 자식 오브젝트 추가
        this.add([this.cropSprite]);


        // 타이머 이벤트 추가
        // 주의 : callback 부분에 존재하지 않는 함수 등록해도 에러 발생 안됨.
        scene.time.addEvent({
            delay: 4000, // 단위 : ms
            callback: this.grow1,
            callbackScope: this,
            loop: false
        });

        // 함수 연쇄 호출이 가능한가?
    }

    setInitialStage() {
        // 농작물의 초기 텍스처 설정
        this.setTexture('seedTexture');
    }

    // 성장기 1
    grow1() {

        //console.log("농작물 성장기 1");

        // 성장기 1에 사용되는 이미지 키는 name + '_02'이다.
        // 예) this.name = potato면 'potato_02'
        const grow1ImgKey = this.name + '_02';
        const scene = this.scene;

        this.state = 'grow1';

        // 이미지를 초기 위치로 초기화 (0, 4)
        // 전 성장단계에서 위치 조정이 있는 경우 보정하기 위해
        this.cropSprite.x = 0;
        this.cropSprite.y = this.offsetY;

        this.cropSprite.setTexture(grow1ImgKey);



        // 호박 반 픽셀 왼쪽, 1픽셀 아래(-2, 8)
        if (this.name === 'pumpkin') {
            console.log("호박 성장기 1 위치 조정");
            // 타일의 이루는 픽셀의 크기는 4x4
            // 가로 길이가 홀수인 이미지는 2픽셀(반 픽셀) 만큼 빼면 밭 타일이랑 중앙에 위치됨.
            this.cropSprite.x = this.cropSprite.x - this.offsetX / 2;
            this.cropSprite.y = this.cropSprite.y + this.offsetY;
        }

        scene.time.addEvent({
            delay: 4000, // 단위 : ms
            callback: this.grow2,
            callbackScope: this,
            loop: false
        });
    }
    // 성장기 2
    grow2() {

        //console.log("농작물 성장기 2");
        // 성장기 1에 사용되는 이미지 키는 name + '_03'이다.        
        const grow2ImgKey = this.name + '_03';
        const scene = this.scene;

        this.state = 'grow2';

        // 이미지를 초기 위치로 초기화
        // 전 성장단계에서 위치 조정이 있는 경우 보정하기 위해
        this.cropSprite.x = 0;
        this.cropSprite.y = 0 + this.offsetY;

        this.cropSprite.setTexture(grow2ImgKey);

        // 감자 1픽셀 아래
        if (this.name === 'potato') {
            console.log("감자 성장기 2 위치 조정");
            this.cropSprite.y = this.cropSprite.y + this.offsetY;
        }
        // 호박 1픽셀 왼쪽, 1픽셀 아래
        else if (this.name === 'pumpkin') {
            console.log("호박 성장기 2 위치 조정");
            this.cropSprite.x = this.cropSprite.x - this.offsetX;
            this.cropSprite.y = this.cropSprite.y + this.offsetY;
        }
        // 양배추 1픽셀 아래
        else if (this.name === 'cabbage') {
            console.log("양배추 성장기 2 위치 조정");
            this.cropSprite.y = this.cropSprite.y + this.offsetY;
        }


        scene.time.addEvent({
            delay: 4000, // 단위 : ms
            callback: this.growComplete,
            callbackScope: this,
            loop: false
        });
    }
    // 수확기
    growComplete() {

        // 성장기 1에 사용되는 이미지 키는 name + '_04'이다.        
        const growComImgKey = this.name + '_04';
        const scene = this.scene;

        this.state = 'harvest';

        // 이미지를 초기 위치로 초기화
        // 전 성장단계에서 위치 조정이 있는 경우 보정하기 위해
        this.cropSprite.x = 0;
        this.cropSprite.y = 0 + this.offsetY;

        // 수확기 이미지 위치 조정
        // 감자 반픽셀 오른쪽, 1픽셀 아래
        if (this.name === 'potato') {
            console.log("감자 수확기 위치 조정");
            this.cropSprite.x = this.cropSprite.x + this.offsetX / 2;
            this.cropSprite.y = this.cropSprite.y + this.offsetY;
        }
        // 호박 1픽셀 아래
        else if (this.name === 'pumpkin') {
            console.log("호박 수확기 위치 조정");
            this.cropSprite.y = this.cropSprite.y + this.offsetY;
        }
        // 양배추 2픽셀 아래
        else if (this.name === 'cabbage') {
            console.log("양배추 수확기 위치 조정");
            this.cropSprite.y = this.cropSprite.y + this.offsetY * 2;
        }


        this.cropSprite.setTexture(growComImgKey);
        //console.log("농작물 수확기");


    }

    // 농작물 수확
    harvest(){
        this.destroy();
    }
}