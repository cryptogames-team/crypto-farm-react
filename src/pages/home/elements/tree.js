import Phaser from 'phaser';

const scale = 4;
const depth = 3;

// 타일 하나의 크기
const tileSize = 64;

// 타일의 중앙 위치
const tileCenterX = tileSize / 2;
const tileCenterY = tileSize / 2;

export default class Tree extends Phaser.GameObjects.Container {

    scene;

    // 가질 수 있는 상태 : 나무, 그루터기
    state = 'tree';
    // 아이템 이름과 1대1 대응
    name = '나무';
    type = 'tree';
    // 벌목된 시간
    loggingTime = null;
    // 재생성 되는 데 걸리는 시간(초)
    respawnTime = 600;
    // 재생성이 되는 시간
    respawnCompleteTime = null;
    // 재생성까지 남은 시간(초)
    remainTime = null;
    treeSprite;
    stumpSprite;
    // 나무의 최대 내구도
    maxHP = 2;
    // 나무의 현재 내구도
    currentHP = this.maxHP;

    constructor(scene, x, y, loggingTime, isload = false) {
        super(scene, x, y);

        this.scene = scene;
        this.setSize(tileSize * 2, tileSize * 2);
        this.setDepth(depth);

        // 씬의 디스플레이 목록에 추가하여 시각적으로 나타내게 한다.
        scene.add.existing(this);
        // 씬의 물리 시스템에 추가하여 물리적 상호작용을 가능하게 한다.
        scene.physics.add.existing(this);
        // 바디 오프셋 설정
        this.body.setOffset(tileSize, tileSize);
        this.body.setAllowGravity(false);
        this.body.moves = false;


        // 스프라이트 위치를 나무 부분이 컨테이너 영역 안에 들어가게 조정한다.
        this.treeSprite = scene.add.sprite(0, 0, 'tree');

        // 원본 스프라이트 왼쪽 공백
        const leftBlank = 31;
        // 나무 부분 길이
        const treeWidth = 26;
        // 나무 스프라이트 가로 패딩
        let treeWidthPad = (tileSize * 2 - treeWidth * scale) / 2;
        // 나무 스프라이트의 컨테이너에서 상대 x 위치
        const treeX = -leftBlank * scale + treeWidthPad;
        // 나무 스프라이트의 상대 y 위치
        // 컨테이너 높이 - 스프라이트 높이 <- 윗 부분이 살짝 넘치게 한다.
        const treeY = -Math.abs(this.height - this.treeSprite.height * scale);

        this.treeSprite.x = treeX;
        this.treeSprite.y = treeY;
        this.treeSprite.setOrigin(0, 0).setScale(4);

        // 그루터기 스프라이트 16x14
        this.stumpSprite = scene.add.sprite(32, 63, 'stump');
        this.stumpSprite.setOrigin(0, 0).setScale(scale).setVisible(false);

        // 벌목 시간이 기록되지 않으면 state === 'tree'
        // 나무가 생성되는데 벌목 시간이 기록되어 있으면 중간에 들어왔다는 뜻
        // 2가지 분기
        // 1. 현재 시간 < 재생성 되는 시간 <- state === stump
        // 2. 현재 시간 >= 재생성 되는 시간 <- state === tree
        this.setInitState(loggingTime);

        // 상호작용 영역을 컨테이너에 맞춤
        this.setInteractive(new Phaser.Geom.Rectangle(this.width / 2, this.height / 2,
            this.width, this.height),
            Phaser.Geom.Rectangle.Contains);
        scene.input.enableDebug(this);

        this.on('pointerover', () => {
            //console.log("나무에 마우스 오버");
            if (this.state === 'stump') {
                scene.objectToolTip.setVisible(true);

                // 이거 위치 기준이 뭐지?
                // 아마 컨테이너 실제 영역이랑, 상호작용 영역이 다른듯
                scene.objectToolTip.x = this.x + this.width / 2 - scene.objectToolTip.width / 2;
                scene.objectToolTip.y = this.y - 20;

                scene.objectToolTip.setObject(this);
            }
        });

        this.on('pointerout', () => {
            //console.log("나무에 마우스 아웃");
            scene.objectToolTip.setObject(null);
            scene.objectToolTip.setVisible(false).setPosition(0, 0);
        });

        this.add([this.treeSprite, this.stumpSprite]);
    }

    // 초기 상태 설정
    setInitState(loggingTime) {

        if (loggingTime === null) {
            return;
        } else {
            // 벌목된 시간 기록
            this.loggingTime = loggingTime
            console.log("벌목된 시간", this.loggingTime);

            // 나무 재생성되는 시간 계산
            this.respawnCompleteTime = new Date(this.loggingTime.getTime() + this.respawnTime * 1000);
            console.log("나무가 재생성 되는 시간", this.respawnCompleteTime);

            // 현재 시간 <- 유저가 게임에 접속한 시간
            const now = new Date();

            if (now.getTime() < this.respawnCompleteTime.getTime()) {

                this.state = 'stump';
                this.treeSprite.setVisible(false);
                this.stumpSprite.setVisible(true);

                console.log("나무 옵젝이 생성된 시간", now);

                // 재생성까지 남은 초 설정
                this.remainTime = this.getRemainTime(now);

                console.log("재생성까지 남은 초", this.remainTime);

            } else {

                console.log("재생성 완료");
                // 나무 상태로 변경
                this.state = 'tree';
                this.treeSprite.setVisible(true);
                this.stumpSprite.setVisible(false);

                // 벌목된 시간 나무 재생성 되는 시간 초기화
                this.loggingTime = null;
                this.respawnCompleteTime = null;
                this.remainTime = null;
            }
        }

    }

    // 나무 오브젝트가 속한 씬에서 업데이트
    update(delta) {
        if(this.remainTime >= 0){
            this.remainTime -= delta / 1000;
        }

    }

    // 도끼질 당할 때 반응하는 함수
    chopTree() {

        // 벌목 가능한 상태가 아니면
        if (this.state !== 'tree') {
            return;
        }

        this.currentHP--;
        console.log("나무 내구도 줄어듦.", this.currentHP);

        if (this.currentHP <= 0) {

            console.log('벌목됨.');
            this.state = 'stump';
            this.treeSprite.setVisible(false);
            this.stumpSprite.setVisible(true);

            this.scene.time.addEvent({
                delay: this.respawnTime * 1000, // 단위 : ms
                callback: this.recoverTree,
                callbackScope: this,
                loop: false
            });

            // 벌목된 시간 기록
            this.loggingTime = new Date();
            console.log("벌목된 시간", this.loggingTime);

            // 나무 재생성되는 시간 계산
            this.respawnCompleteTime = new Date(this.loggingTime.getTime() + this.respawnTime * 1000);
            console.log("나무가 재생성 되는 시간", this.respawnCompleteTime);

            this.remainTime = this.respawnTime;

            // 벌목 성공 시 플레이어 인벤에 나무가 추가
            // 새 아이템이 추가되거나 중복 아이템 수량이 증가할 아이템 슬롯 찾기
            let addItemSlot = null;
            addItemSlot = this.scene.findAddItemSlot(this.name);

            // 추가할 아이템 슬롯이 있으면
            // 아이템 추가 요청할 때 필요한 데이터 모아서 서버에 아이템 추가 요청함.
            if (addItemSlot !== null) {
                this.scene.sendAddItem(this.name, addItemSlot);
            }

        } else {
            // 애니메이션 실행 중에 재실행 명령 내리면 무시함
            this.treeSprite.anims.play('tree_shake', true);
        }

    }

    // 나무 재생성
    recoverTree() {
        this.state = 'tree';
        this.currentHP = this.maxHP;
        this.treeSprite.setVisible(true);
        this.stumpSprite.setVisible(false);

        // 벌목 시간, 재생성 시간 전부 초기화
        this.loggingTime = null;
        this.respawnCompleteTime = null;
        this.remainTime = null;
    }
    // 남은 초 구하기
    getRemainTime(now) {

        const completeTime = new Date(this.respawnCompleteTime);
        // 남은 시간 초로 변환
        let remainTimeInSec = (completeTime - now) / 1000;

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
