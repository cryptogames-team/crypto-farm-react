import Phaser from "phaser";

const tileSize = 64;
const scale = 4;

export default class FirePitNPC extends Phaser.GameObjects.Container {

    scene;

    building;
    npcSprite;
    nameTag;

    constructor(scene, x, y) {

        super(scene, x, y);
        this.scene = scene;

        // 씬의 디스플레이 목록에 추가하여 시각적으로 나타내게 한다.
        scene.add.existing(this);
        this.setDepth(4).setScrollFactor(1).setSize(tileSize * 3, tileSize * 2);

        // 씨앗 상점과 같은 크기 3x2 192 x 128
        this.building = scene.add.image(0, 0, '화덕');
        this.building.setOrigin(0, 0).setDisplaySize(tileSize * 3, tileSize * 2);

        // NPC 스프라이트 추가
        this.npcSprite = scene.add.sprite(0, 0, 'cook');
        this.npcSprite.setScale(scale);
        this.npcSprite.x = this.width / 2 - this.npcSprite.displayWidth / 2;
        this.npcSprite.y = this.height / 2 - this.npcSprite.displayHeight * (1 / 3);

        // 대기 애니메이션 재생
        this.npcSprite.anims.play('npc_cook_idle', true);

        // NPC 이름표 추가
        const txtStyle = {
            fontFamily: 'Arial',
            fontSize: 18,
            color: 'white',
            fontStyle: 'bold',
            align: 'center',
            stroke: 'black', // 외곽선
            strokeThickness: 5 // 외곽선 두께  
        };
        const nameTagPad = 5;
        this.nameTag = scene.add.text(0, 0, '화덕', txtStyle);
        this.nameTag.x = this.width / 2;
        this.nameTag.y -= this.nameTag.height + nameTagPad;
        this.nameTag.setOrigin(0.5, 0);

        // 상호작용 영역 설정
        this.building.setInteractive();

        // 마우스 오버, 클릭 이벤트 설정
        this.building.on('pointerover', (pointer) => {
            document.body.style.cursor = 'pointer';
        });

        this.building.on('pointerout', (pointer) => {
            document.body.style.cursor = 'default';
        });

        this.building.on('pointerdown', (pointer) => {
            //console.log("화덕 NPC 클릭됨!");
        });

        // 상호작용 영역보기
        /* this.building.setDepth(10);
        this.scene.input.enableDebug(this.building); */

        this.add([this.building, this.npcSprite, this.nameTag]);
    }

}