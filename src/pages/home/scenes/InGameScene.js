import Phaser from 'phaser'

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

    preload() {
        // 자산 로딩

        // 지금 tileset 폴더에 아무것도 없음

        // sunnysideworld 타일셋 PNG 파일 로드
        this.load.image('sunnysideworld_tiles', 'assets/maps/spr_tileset_sunnysideworld_16px.png');
        this.load.image('cow_tiles', 'assets/maps/spr_deco_cow_strip4.png');
        // 타일맵 JSON 파일 로드
        this.load.tilemapTiledJSON('login_tilemap', 'assets/maps/Crypto_Farm_Login.json');

    }

    create() {

        // 타일 맵 생성
        const map = this.make.tilemap({ key: 'login_tilemap' });
        // 현재 사용중인 타일셋 이미지를 추가
        const sunnysideworld_tileset = map.addTilesetImage('sunnysideworld_16px', 'sunnysideworld_tiles');
        // 소 타일셋 이미지
        const cow_tileset = map.addTilesetImage('spr_deco_cow_strip4', 'cow_tiles');
        // 레이어들이 '배경' 폴더에 존재함
        // 레이어 경로 예시 : '배경/연못'
        // 원하는 레이어를 올바른 순서로 만든다.
        // 제일 밑에 있는 레이어를 가장 먼저 생성한다.
        const groundLayer = map.createLayer('배경/땅, 길', sunnysideworld_tileset);
        map.createLayer('배경/연못', sunnysideworld_tileset);
        map.createLayer('배경/풀', sunnysideworld_tileset);
        map.createLayer('배경/밭, 돌', sunnysideworld_tileset);
        map.createLayer('배경/농작물', sunnysideworld_tileset);
        map.createLayer('배경/나무', sunnysideworld_tileset);
        map.createLayer('배경/건물, 소품', sunnysideworld_tileset);
        map.createLayer('배경/동물들', cow_tileset);


        // 화면 크기에 맞게 타일맵 스케일 조정
        const scaleX = this.cameras.main.width / map.widthInPixels;
        const scaleY = this.cameras.main.height / map.heightInPixels;
        const scale = Math.max(scaleX, scaleY);
        // 카메라 줌 설정으로 타일맵 조정
        const zoom = Math.min(scaleX, scaleY);


       groundLayer.setScale(scaleX,scaleY);

        // 카메라는 화면 중앙을 비추고 있음
       // this.cameras.main.setZoom(zoom);

        // 카메라가 움직일 수 있는 경계 설정
        //this.cameras.main.setBounds(0, 0, 800, 600);

        // 키보드 입력 설정
        this.cursors = this.input.keyboard.createCursorKeys();
        // 카메라 참조
        this.camera = this.cameras.main;


    }

    update() {



    }




}