import Phaser from 'phaser'
import PlayerObject from '../characters/player_object'

let currentMapWidth = 512;
let currentMapHeight = 320;

export default class InGameScene extends Phaser.Scene {


    locationText;
    bodyLocationText;

    constructor() {
        super('InGameScene');


    }
    // 씬이 시작될 때 가장 먼저 실행되는 메서드이다.
    // 씬의 초기화를 담당하며, 씬이 시작하기 전에 필요한 설정이나 변수의 초기화등을 수행하는데 사용된다.
    // 씬으로 전달되는 데이터를 받을 수 있는 유일한 곳
    init(characterInfo) {

        // 로그인 씬으로부터 파라미터를 전달 받는다.
        console.log("인게임 씬을 시작하며 전달받은 데이터", characterInfo)
        this.characterInfo = characterInfo;

        // 스프라이트 로더 인스턴스 생성
        this.spriteLoader = new SpriteLoader(this);

    }

    // 애셋 로드
    preload() {

        // 캐릭터 스프라이트 시트 로드 정보 담은 객체 배열

        // 현재 헤어스프라이트만 캐릭터마다 다름.
        // 로드할 헤어 스프라이트 시트들
        const characterHairSprties = [
            // 대기 헤어 스프라이트 시트
            { name: 'bowlhair_idle', path: 'assets/Character/IDLE/bowlhair_idle_strip9.png', frameWidth: 96, frameHeight: 64 },
            { name: 'longhair_idle', path: 'assets/Character/IDLE/longhair_idle_strip9.png', frameWidth: 96, frameHeight: 64 },
            { name: 'curlyhair_idle', path: 'assets/Character/IDLE/curlyhair_idle_strip9.png', frameWidth: 96, frameHeight: 64 },
            // 걷는 헤어 스프라이트 시트
            { name: 'bowlhair_walk', path: 'assets/Character/WALKING/bowlhair_walk_strip8.png', frameWidth: 96, frameHeight: 64 },
            { name: 'longhair_walk', path: 'assets/Character/WALKING/longhair_walk_strip8.png', frameWidth: 96, frameHeight: 64 },
            { name: 'curlyhair_walk', path: 'assets/Character/WALKING/curlyhair_walk_strip8.png', frameWidth: 96, frameHeight: 64 },
            // 달리는 헤어 스프라이트 시트
            { name: 'bowlhair_run', path: 'assets/Character/RUN/bowlhair_run_strip8.png', frameWidth: 96, frameHeight: 64 },
            { name: 'longhair_run', path: 'assets/Character/RUN/longhair_run_strip8.png', frameWidth: 96, frameHeight: 64 },
            { name: 'curlyhair_run', path: 'assets/Character/RUN/curlyhair_run_strip8.png', frameWidth: 96, frameHeight: 64 },
            // 땅파는 헤어 스프라이트 시트
            { name: 'bowlhair_dig', path: 'assets/Character/DIG/bowlhair_dig_strip13.png', frameWidth: 96, frameHeight: 64 },
            { name: 'longhair_dig', path: 'assets/Character/DIG/longhair_dig_strip13.png', frameWidth: 96, frameHeight: 64 },
            { name: 'curlyhair_dig', path: 'assets/Character/DIG/curlyhair_dig_strip13.png', frameWidth: 96, frameHeight: 64 },
        ];

        // 헤어 애셋 경로
        let idle_hair_path = '';
        let walk_hair_path = '';
        let run_hair_path = '';
        let dig_hair_path = '';

        // base는 빡빡이라서 헤어 스프라이트가 필요 없음
        if (this.characterInfo.name === 'long hair') {
            idle_hair_path = 'assets/Character/IDLE/longhair_idle_strip9.png';
            walk_hair_path = 'assets/Character/WALKING/longhair_walk_strip8.png';
            run_hair_path = 'assets/Character/RUN/longhair_run_strip8.png';
            dig_hair_path = 'assets/Character/DIG/longhair_dig_strip13.png';

        } else if (this.characterInfo.name === 'curly') {
            idle_hair_path = 'assets/Character/IDLE/curlyhair_idle_strip9.png';
            walk_hair_path = 'assets/Character/WALKING/curlyhair_walk_strip8.png';
            run_hair_path = 'assets/Character/RUN/curlyhair_run_strip8.png';
            dig_hair_path = 'assets/Character/DIG/curlyhair_dig_strip13.png';
        } 
        // 로그인 안하고 인 게임 기능 구현할 때 바가지 머리 캐릭터 사용
        else if (this.characterInfo.name === 'bow' || this.characterInfo.name === undefined) {
            idle_hair_path = 'assets/Character/IDLE/bowlhair_idle_strip9.png';
            walk_hair_path = 'assets/Character/WALKING/bowlhair_walk_strip8.png';
            run_hair_path = 'assets/Character/RUN/bowlhair_run_strip8.png';
            dig_hair_path = 'assets/Character/DIG/bowlhair_dig_strip13.png';
        }


        const characterSprites = [
            // 대기 스프라이트 시트
            { name: 'player_idle_hair', path: idle_hair_path, frameWidth: 96, frameHeight: 64 },
            { name: 'player_idle_body', path: 'assets/Character/IDLE/base_idle_strip9.png', frameWidth: 96, frameHeight: 64 },
            { name: 'player_idle_hand', path: 'assets/Character/IDLE/tools_idle_strip9.png', frameWidth: 96, frameHeight: 64 },
            // 걷는 스프라이트 시트
            { name: 'player_walk_hair', path: walk_hair_path, frameWidth: 96, frameHeight: 64 },
            { name: 'player_walk_body', path: 'assets/Character/WALKING/base_walk_strip8.png', frameWidth: 96, frameHeight: 64 },
            { name: 'player_walk_hand', path: 'assets/Character/WALKING/tools_walk_strip8.png', frameWidth: 96, frameHeight: 64 },
            // 달리는 스프라이트 시트
            { name: 'player_run_hair', path: run_hair_path, frameWidth: 96, frameHeight: 64 },
            { name: 'player_run_body', path: 'assets/Character/RUN/base_run_strip8.png', frameWidth: 96, frameHeight: 64 },
            { name: 'player_run_hand', path: 'assets/Character/RUN/tools_run_strip8.png', frameWidth: 96, frameHeight: 64 },
            // 땅파는 스프라이트 시트
            { name: 'player_dig_hair', path: dig_hair_path, frameWidth: 96, frameHeight: 64 },
            { name: 'player_dig_body', path: 'assets/Character/DIG/base_dig_strip13.png', frameWidth: 96, frameHeight: 64 },
            { name: 'player_dig_hand', path: 'assets/Character/DIG/tools_dig_strip13.png', frameWidth: 96, frameHeight: 64 },
        ];

        // 플레이어 캐릭터에 사용할 스프라이트 시트 로드
        characterSprites.forEach(sprite => this.spriteLoader.loadSprite(sprite));


        // sunnysideworld 타일셋 PNG 파일 로드
        this.load.image('sunnysideworld_tiles', 'assets/maps/spr_tileset_sunnysideworld_16px.png');
        this.load.image('cow_tiles', 'assets/maps/spr_deco_cow_strip4.png');

        // 타일맵 JSON 파일 로드
        this.load.tilemapTiledJSON('ingame_tilemap', 'assets/maps/ingame/Crypto_Farm_InGame.json');


    }

    create() {

        // 캐릭터 애니메이션 생성에 필요한 정보를 담은 객체 배열 
        const animations = [
            // 대기 애니메이션 9 프레임
            { key: 'idle_hair', frames: this.anims.generateFrameNumbers('player_idle_hair', { start: 0, end: 8 }), frameRate: 9, repeat: -1 },
            { key: 'idle_body', frames: this.anims.generateFrameNumbers('player_idle_body', { start: 0, end: 8 }), frameRate: 9, repeat: -1 },
            { key: 'idle_hand', frames: this.anims.generateFrameNumbers('player_idle_hand', { start: 0, end: 8 }), frameRate: 9, repeat: -1 },
            // 걷는 애니메이션 8 프레임
            { key: 'walk_hair', frames: this.anims.generateFrameNumbers('player_walk_hair', { start: 0, end: 7 }), frameRate: 8, repeat: -1 },
            { key: 'walk_body', frames: this.anims.generateFrameNumbers('player_walk_body', { start: 0, end: 7 }), frameRate: 8, repeat: -1 },
            { key: 'walk_hand', frames: this.anims.generateFrameNumbers('player_walk_hand', { start: 0, end: 7 }), frameRate: 8, repeat: -1 },
            // 달리는 애니메이션 8 프레임
            { key: 'run_hair', frames: this.anims.generateFrameNumbers('player_run_hair', { start: 0, end: 7 }), frameRate: 8, repeat: -1 },
            { key: 'run_body', frames: this.anims.generateFrameNumbers('player_run_body', { start: 0, end: 7 }), frameRate: 8, repeat: -1 },
            { key: 'run_hand', frames: this.anims.generateFrameNumbers('player_run_hand', { start: 0, end: 7 }), frameRate: 8, repeat: -1 },
            // 땅파는 애니메이션 13 프레임
            { key: 'dig_hair', frames: this.anims.generateFrameNumbers('player_dig_hair', { start: 0, end: 12 }), frameRate: 13, repeat: 0 },
            { key: 'dig_body', frames: this.anims.generateFrameNumbers('player_dig_body', { start: 0, end: 12 }), frameRate: 13, repeat: 0 },
            { key: 'dig_hand', frames: this.anims.generateFrameNumbers('player_dig_hand', { start: 0, end: 12 }), frameRate: 13, repeat: 0 },
        ];


        // 스프라이트 로더 클래스에 애니메이션 정보 전달해서 씬에서 애니메이션 생성하기
        animations.forEach(animation => this.spriteLoader.createAnimation(animation));

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
            layer.scale = 4;

            // 현재 맵 크기 설정
            currentMapWidth = layer.displayWidth;
            currentMapHeight = layer.displayHeight;

            //console.log(layer.displayWidth, layer.displayHeight);
            // displayWidth, displayHeight
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

        // 플레이어 캐릭터 오브젝트 씬에 생성
        this.playerObject = new PlayerObject(this, 500, 600);

        // 키보드 입력 설정
        this.cursorsKeys = this.input.keyboard.createCursorKeys();
        // addKeys() : 특정 키 또는 여러 키에 대한 Phaser Key 객체를 생성한다.
        this.keys = this.input.keyboard.addKeys('W,A,S,D');

        // 카메라 참조
        this.camera = this.cameras.main;
        // 카메라 이동 경계 설정
        // 월드 경계랑 크기가 동일하다.
        this.cameras.main.setBounds(0, 0, currentMapWidth, currentMapHeight);
        this.camera.startFollow(this.playerObject);

        // 월드 경계 설정
        this.physics.world.setBounds(0,0, currentMapWidth, currentMapHeight);



        // 디버그 텍스트 추가
        //  Pass in a basic style object with the constructor
        //this.locationText = this.add.text(1300, 0, 'Phaser', { fontFamily: 'Arial', fontSize: 30 }).setDepth(100);


    }

    update() {

        // 메인 카메라 이동
        /*         const cameraSpeed = 5;
                // 위쪽 화살표가 눌렸을 때
                if (this.cursorsKeys.up.isDown) {
                    this.camera.scrollY -= cameraSpeed;
                }
                // 아래쪽 화살표가 눌렸을 때
                if (this.cursorsKeys.down.isDown) {
                    this.camera.scrollY += cameraSpeed;
                }
                // 왼쪽 화살표가 눌렸을 때
                if (this.cursorsKeys.left.isDown) {
                    this.camera.scrollX -= cameraSpeed;
                }
                // 오른쪽 화살표가 눌렸을 때
                if (this.cursorsKeys.right.isDown) {
                    this.camera.scrollX += cameraSpeed;
                } */


        this.playerObject.update(this.cursorsKeys, this.keys);


        //this.locationText.setText("PlayerObject x : " + this.playerObject.x);

    }


    // 함수 분리
    createAnimation() {

        // 대기 애니메이션 생성 9 프레임
        // this : Scene
        // anims : AnimationManager
        this.anims.create({
            // 애니메이션의 고유 이름 설정
            key: 'idle_hair',
            // 애니메이션에 사용될 프레임을 정의한다.
            frames: this.anims.generateFrameNumbers('player_idle_hair', { start: 0, end: 8 }),
            // 애니메이션의 프레임 속도
            frameRate: 9,
            // 애니메이션의 반복 여부
            repeat: -1
        });
        this.anims.create({
            key: 'idle_body',
            frames: this.anims.generateFrameNumbers('player_idle_body', { start: 0, end: 8 }),
            frameRate: 9,
            repeat: -1
        });
        this.anims.create({
            key: 'idle_hand',
            frames: this.anims.generateFrameNumbers('player_idle_hand', { start: 0, end: 8 }),
            frameRate: 9,
            repeat: -1
        });

        // 걷는 애니메이션 생성 8프레임
        this.anims.create({
            key: 'walk_hair',
            frames: this.anims.generateFrameNumbers('player_walk_hair', { start: 0, end: 7 }),
            frameRate: 8,
            repeat: -1
        });
        this.anims.create({
            key: 'walk_body',
            frames: this.anims.generateFrameNumbers('player_walk_body', { start: 0, end: 7 }),
            frameRate: 8,
            repeat: -1
        });
        this.anims.create({
            key: 'walk_hand',
            frames: this.anims.generateFrameNumbers('player_walk_hand', { start: 0, end: 7 }),
            frameRate: 8,
            repeat: -1
        });

        // 달리기 애니메이션 생성 8 프레임
        this.anims.create({
            key: 'run_hair',
            frames: this.anims.generateFrameNumbers('player_run_hair', { start: 0, end: 7 }),
            frameRate: 8,
            repeat: -1
        });
        this.anims.create({
            key: 'run_body',
            frames: this.anims.generateFrameNumbers('player_run_body', { start: 0, end: 7 }),
            frameRate: 8,
            repeat: -1
        });
        this.anims.create({
            key: 'run_hand',
            frames: this.anims.generateFrameNumbers('player_run_hand', { start: 0, end: 7 }),
            frameRate: 8,
            repeat: -1
        });

        // 땅파기 애니메이션 생성 13 프레임
        this.anims.create({
            key: 'dig_hair',
            frames: this.anims.generateFrameNumbers('player_dig_hair', { start: 0, end: 12 }),
            frameRate: 13,
            repeat: 0
        });
        this.anims.create({
            key: 'dig_body',
            frames: this.anims.generateFrameNumbers('player_dig_body', { start: 0, end: 12 }),
            frameRate: 13,
            repeat: 0
        });
        this.anims.create({
            key: 'dig_hand',
            frames: this.anims.generateFrameNumbers('player_dig_hand', { start: 0, end: 12 }),
            frameRate: 13,
            repeat: 0
        });

    }

    // 스프라이트 로드 함수
    loadSpriteSheet() {
        // 캐릭터 스프라이트 시트 로드
        // 애셋 경로 : assets/Character
        // 대기 스프라이트 시트
        this.load.spritesheet('player_idle_body', 'assets/Character/IDLE/base_idle_strip9.png', {
            // 실제 스프라이트 시트의 각 프레임 크기에 맞춰야 함.
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

        // 걷는 스프라이트 시트 player_walk
        this.load.spritesheet('player_walk_body', 'assets/Character/WALKING/base_walk_strip8.png', {
            frameWidth: 96,
            frameHeight: 64
        });
        this.load.spritesheet('player_walk_hand', 'assets/Character/WALKING/tools_walk_strip8.png', {
            frameWidth: 96,
            frameHeight: 64
        });
        this.load.spritesheet('player_walk_hair', 'assets/Character/WALKING/bowlhair_walk_strip8.png', {
            frameWidth: 96,
            frameHeight: 64
        });

        // 달리는 스프라이트 시트 player_run
        this.load.spritesheet('player_run_body', 'assets/Character/RUN/base_run_strip8.png', {
            frameWidth: 96,
            frameHeight: 64
        });
        this.load.spritesheet('player_run_hand', 'assets/Character/RUN/tools_run_strip8.png', {
            frameWidth: 96,
            frameHeight: 64
        });
        this.load.spritesheet('player_run_hair', 'assets/Character/RUN/bowlhair_run_strip8.png', {
            frameWidth: 96,
            frameHeight: 64
        });

        // 땅 파기 스프라이트 시트 player_dig
        this.load.spritesheet('player_dig_body', 'assets/Character/DIG/base_dig_strip13.png', {
            frameWidth: 96,
            frameHeight: 64
        });
        this.load.spritesheet('player_dig_hand', 'assets/Character/DIG/tools_dig_strip13.png', {
            frameWidth: 96,
            frameHeight: 64
        });
        this.load.spritesheet('player_dig_hair', 'assets/Character/DIG/bowlhair_dig_strip13.png', {
            frameWidth: 96,
            frameHeight: 64
        });

    }

}


class SpriteLoader {
    constructor(scene) {
        this.scene = scene;
    }

    loadSprite(spriteData) {

        // 선택한 캐릭터가 base(빡빡이)면 경로가 ''로 들어오니
        // 아무것도 안하면 됨.
        if(spriteData.path === '')
        {
            return;
        }

        this.scene.load.spritesheet(
            spriteData.name,
            spriteData.path, {
            frameWidth: spriteData.frameWidth,
            frameHeight: spriteData.frameHeight
        });
    }

    createAnimation(animationData) {
        this.scene.anims.create(animationData);
    }

}