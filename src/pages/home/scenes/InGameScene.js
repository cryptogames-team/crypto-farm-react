import Phaser from 'phaser'
import Player from '../characters/player'


export default class InGameScene extends Phaser.Scene {


    constructor() {
        super('InGameScene');

        //console.log("인 게임 씬 실행");
    }
    // 씬이 시작될 때 가장 먼저 실행되는 메서드이다.
    // 씬의 초기화를 담당하며, 씬이 시작하기 전에 필요한 설정이나 변수의 초기화등을 수행하는데 사용된다.
    // 씬으로 전달되는 데이터를 받을 수 있는 유일한 곳
    init(characterInfo) {

        // 로그인 씬으로부터 파라미터를 전달 받는다.
        console.log("인게임 씬을 시작하며 전달받은 데이터", characterInfo)

    }

    // 애셋 로드
    preload() {
        // 자산 로딩


        // sunnysideworld 타일셋 PNG 파일 로드
        this.load.image('sunnysideworld_tiles', 'assets/maps/spr_tileset_sunnysideworld_16px.png');
        this.load.image('cow_tiles', 'assets/maps/spr_deco_cow_strip4.png');

        // 타일맵 JSON 파일 로드
        this.load.tilemapTiledJSON('ingame_tilemap', 'assets/maps/ingame/Crypto_Farm_InGame.json');




        // 캐릭터 스프라이트 시트 로드
        // 애셋 경로 : assets/Character
        // 대기 스프라이트 시트
        this.load.spritesheet('player_idle', 'assets/Character/IDLE/base_idle_strip9.png', {
            // 실제 스프라이트 시트의 각 프레임 크기에 맞춰야 함.
            // IDLE width 96 heigth 64
            frameWidth: 96,
            frameHeight: 64
        });

        this.load.spritesheet('player_idle_hand', 'assets/Character/IDLE/tools_idle_strip9.png', {
            frameWidth: 96,
            frameHeight: 64
        });

        this.load.spritesheet('player_idle_hair', 'assets/Character/IDLE/bowlhair_idle_strip9.png', {
            frameWidth: 96,
            frameHeight: 64
        });

        // 이동 스프라이트 시트


        // 땅 파기 스프라이트 시트

    }

    create() {



        // 타일 맵 생성
        // 타일 맵 정보를 담은 Json 로드할 때 설정한 키값과 맞춰야 한다.
        const ingameMap = this.make.tilemap({ key: 'ingame_tilemap' });
        // 현재 사용중인 타일셋 이미지를 추가
        const sunnysideworld_tileset = ingameMap.addTilesetImage('sunnysideworld_16px', 'sunnysideworld_tiles');
        // 소 타일셋 이미지
        const cow_tileset = ingameMap.addTilesetImage('spr_deco_cow_strip4', 'cow_tiles');

        // 제일 밑에 있는 레이어를 가장 먼저 생성한다.
        for (let i = 0; i < ingameMap.layers.length; i++) {
            // 이 방법을 쓰면 레이어 이름을 일일히 지정할 필요가 없음.
            // 레이어 인덱스 값을 넣어도 됨.
            const layer = ingameMap.createLayer(i, sunnysideworld_tileset, 0, 0);
            // 레이어 깊이 설정. 깊이 값은 레이어 간의 시각적 순서를 결정한다.
            // 낮은 깊이를 가진 레이어가 뒤에 배치되고, 높은 깊이를 가진 레이어가 앞에 배치된다.
            layer.setDepth(i);
            // 레이어 스케일 설정
            layer.scale = 3;
        }


        // 화면 크기에 맞게 타일맵 스케일 조정
        const scaleX = this.cameras.main.width / ingameMap.widthInPixels;
        const scaleY = this.cameras.main.height / ingameMap.heightInPixels;
        const scale = Math.max(scaleX, scaleY);
        // 카메라 줌 설정으로 타일맵 조정
        const zoom = Math.min(scaleX, scaleY);


        // 카메라는 화면 중앙을 비추고 있음
        // this.cameras.main.setZoom(zoom);

        // 카메라가 움직일 수 있는 경계 설정
        //this.cameras.main.setBounds(0, 0, this.cameras.main.width, this.cameras.main.height);

        // 키보드 입력 설정
        this.cursors = this.input.keyboard.createCursorKeys();
        // 카메라 참조
        this.camera = this.cameras.main;


        // 스프라이트 인스턴스는 한 번에 하나의 텍스처 또는 이미지 키만을 사용한다.
        // 캐릭터 생성
        this.player = new Player(this, 600, 600, 'player_idle');
        // 캐릭터 오른손 생성
        this.player_hand = new Player(this, 600, 600, 'player_idle_hand');
        // 캐릭터 헤어 생성
        this.player_hair = new Player(this, 600, 600, 'player_idle_hair');



    }

    update() {

        // 메인 카메라 이동
        // 카메라 속도
        /*         const cameraSpeed = 5;
                // 위쪽 화살표가 눌렸을 때
                if (this.cursors.up.isDown) {
                    this.camera.scrollY -= cameraSpeed;
                }
                // 아래쪽 화살표가 눌렸을 때
                if (this.cursors.down.isDown) {
                    this.camera.scrollY += cameraSpeed;
                }
                // 왼쪽 화살표가 눌렸을 때
                if (this.cursors.left.isDown) {
                    this.camera.scrollX -= cameraSpeed;
                }
                // 오른쪽 화살표가 눌렸을 때
                if (this.cursors.right.isDown) {
                    this.camera.scrollX += cameraSpeed;
                } */

        this.player.update(this.cursors);
        this.player_hand.update(this.cursors);
        this.player_hair.update(this.cursors);

    }

}