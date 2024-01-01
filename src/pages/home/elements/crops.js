import Phaser from 'phaser';

const scale = 4;
const depth = 3;

// 농작물 게임 오브젝트
export default class Crops extends Phaser.GameObjects.Sprite {

    // 농작물 이름
    name = null;

    constructor(scene, x, y, texture, seed) {
        super(scene, x, y, texture);

        this.name = seed;

        console.log("농작물 객체 생성 : " + this.name);

        // 씬의 디스플레이 목록에 추가하여 시각적으로 나타내게 한다.
        scene.add.existing(this);

        this.setDepth(depth).setScale(scale).setOrigin(0.5, 1);

        
/*         // 농작물의 초기 상태 설정
        this.setInitialStage();

        // 타이머 이벤트 추가
        scene.time.addEvent({
            delay: 10000, // 예: 10초마다
            callback: this.grow,
            callbackScope: this,
            loop: true
        }); */
    }

    setInitialStage() {
        // 농작물의 초기 텍스처 설정
        this.setTexture('seedTexture');
    }

    // 성장기 1
    grow1() {
        // 농작물 성장 로직
        // 예: 텍스처 변경
        this.setTexture('grownTexture');
    }
    // 성장기 2
    grow2() {
        // 농작물 성장 로직
        // 예: 텍스처 변경
        this.setTexture('grownTexture');
    }
    // 수확기
    growComplete() {
        // 농작물 성장 로직
        // 예: 텍스처 변경
        this.setTexture('grownTexture');
    }
}