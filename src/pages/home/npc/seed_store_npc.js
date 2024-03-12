import Phaser from "phaser";

const tileSize = 64;

const scale = 4;

export default class SeedStoreNPC extends Phaser.GameObjects.Container {

    scene;

    building;
    npcHair;
    npcBody;
    npcHand;
    nameTag;

    constructor(scene, x, y) {

        super(scene, x, y);
        this.scene = scene;

        // 씬의 디스플레이 목록에 추가하여 시각적으로 나타내게 한다.
        scene.add.existing(this);
        this.setDepth(4).setScrollFactor(1).setSize(tileSize * 3, tileSize * 2);

        // 이미지를 타일 3x2 안에 넣어야 된다.
        // 192 x 128

        // 컨테이너 오리진 (0,0);
        // 컨테이너에 상호작용 영역을 설정하는 건 일반적이지 않다고 함.

        // 건물 이미지 추가
        this.building = scene.add.image(0, 0, '씨앗상점');
        // setDisplaySize() 설정하면 원본과의 크기 비율을 신경 써야 됨.
        this.building.setOrigin(0, 0).setDisplaySize(tileSize * 3, tileSize * 2);

        // NPC 캐릭터 스프라이트 추가
        // 머리
        this.npcHair = scene.add.sprite(0, 0, 'shorthair_idle');
        this.npcHair.setScale(scale).setFlipX(true);
        this.npcHair.x = this.width - this.npcHair.width / 2;
        this.npcHair.y = this.height * (2 / 3);
        // 몸통
        this.npcBody = scene.add.sprite(0, 0, 'player_idle_body');
        this.npcBody.setScale(scale).setFlipX(true);
        this.npcBody.x = this.width - this.npcBody.width / 2;
        this.npcBody.y = this.height * (2 / 3);
        // 손
        this.npcHand = scene.add.sprite(0, 0, 'player_idle_hand');
        this.npcHand.setScale(scale).setFlipX(true);
        this.npcHand.x = this.width - this.npcHand.width / 2;
        this.npcHand.y = this.height * (2 / 3);

        // 대기 애니메이션 재생
        this.npcHair.anims.play('npc_idle_hair', true);
        this.npcBody.anims.play('idle_body', true);
        this.npcHand.anims.play('idle_hand', true);


        // NPC 이름표 추가
        const txtStyle = {
            fontFamily: 'DNFbitbitv2',
            fontSize: 18,
            color: 'white',
            align: 'center',
            stroke: 'black', // 외곽선
            strokeThickness: 5 // 외곽선 두께  
        };
        const nameTagPad = 5;
        this.nameTag = scene.add.text(0, 0, '씨앗 상점', txtStyle);
        this.nameTag.x = this.width / 2;
        this.nameTag.y -= this.nameTag.height + nameTagPad;
        this.nameTag.setOrigin(0.5, 0);

        // 상호작용 영역 설정하기
        this.building.setInteractive();

        // 시작 위치와 크기가 스프라이트의 원본 텍스쳐 크기(48x38)를 기준점으로 된다.
        // setDisplaySize를 설정하면 원본과 보이는 크기의 비율도 신경 써야 한다.

        // 자유롭게 영역 설정하는 연습해보기 - 20분 제한두기
        // 마지막으로 30 픽셀씩 크기 늘려보기
        /* this.building.setInteractive(new Phaser.Geom.Rectangle
            (0, 0, originalWidth, originalHeight ),
            Phaser.Geom.Rectangle.Contains); */

        // 확실한 건 30픽셀보다 더 커짐
        // 원본 영역 크기에서 30픽셀이 더해진 다음 보이는 크기 / 원본 크기 비율만큼 늘어나는 구조

        /* const widthRatio = this.building.displayWidth / this.building.width;
        const heightRatio = this.building.displayHeight / this.building.height;
        console.log("스케일 비율", widthRatio, heightRatio);
        this.building.input.hitArea.setTo(-(15 / widthRatio), (-15 / heightRatio), 48 + (30 / widthRatio), 38 + (30 / heightRatio)); */

        // 마우스 오버, 클릭 이벤트 설정
        this.building.on('pointerover', (pointer) => {
            document.body.style.cursor = 'pointer';
        });

        this.building.on('pointerout', (pointer) => {
            document.body.style.cursor = 'default';
        });

        this.building.on('pointerdown', (pointer) => {
            //console.log("씨앗 상점 NPC 클릭됨!");

            // 상점 UI 창 오픈
            this.scene.seedStoreUI.enable();
        });


        // 상호작용 영역보기
        /* this.building.setDepth(10);
        this.scene.input.enableDebug(this.building); */


        this.add([this.building, this.npcBody, this.npcHair, this.npcHand, this.nameTag]);
    }

}
