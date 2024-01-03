import Phaser from 'phaser'
import PlayerObject from '../characters/player_object'
import ItemSlot from '../ui/item_slot';
import Crops from '../elements/crops';
import Item from '../elements/item';
import Auction from '../ui/auction';
import Frame from '../ui/frame';

// 현재 맵 크기
// 기본 값 : 농장 타일 맵의 원본 크기
let currentMapWidth = 512;
let currentMapHeight = 320;

// 타일맵
// 레이어 스케일
const layerScale = 4;
// 타일맵의 타일 크기
// 실제 타일 크기에 맞게 설정해야 한다.
const tileSize = 16 * layerScale;

// 플레이어 인벤토리
const inventory = [];

// 게임에 사용할 아이템 데이터들 담는 배열
const items = [];



export default class InGameScene extends Phaser.Scene {

    // 플레이어가 상호작용할 타일의 인덱스
    interactTileIndexTxt;
    // 게임 캐릭터의 정보 - 캐릭터 외형, 레벨, 소지금등을 포함한다.
    characterInfo;
    // 현재 장착중인 도구 슬롯 번호 - 기본값 0
    equipNumber = 0;

    // 인 게임에 사용할 농장 타일맵 
    ingameMap;

    spriteLoader;

    // paint tileMap example
    selectedTile;
    marker;
    controls;
    shiftKey;

    // 플레이어가 상호작용할 타일의 위치
    interactTileX;
    interactTileY;

    // getMousePointerTile()에서 사용할 멤버 변수
    tileIndexText;
    mouseLocationText;

    // 농작물 검색 영역
    searchArea;

    // 플레이어가 상호작용할 타일을 표시하는 UI 마커
    interTileMarker

    // 생성자가 왜 있지?
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

        // 로그인하지 않고 캐릭터 테스트하기 위해 선언한 변수
        //this.characterInfo.name = 'curly';

    }

    // 애셋 로드
    preload() {

        // 헤어 애셋 경로 객체
        const hairPath = {
            idle: "",
            walk: "",
            run: "",
            dig: "",
            axe: "",
            water: "",
            mine: ""
        };

        // base는 빡빡이라서 헤어 스프라이트가 필요 없음
        if (this.characterInfo.name === 'long hair') {
            hairPath.idle = 'IDLE/longhair_idle_strip9.png';
            hairPath.walk = 'WALKING/longhair_walk_strip8.png';
            hairPath.run = 'RUN/longhair_run_strip8.png';
            hairPath.dig = 'DIG/longhair_dig_strip13.png';
            hairPath.axe = 'AXE/longhair_axe_strip10.png';
            hairPath.water = 'WATERING/longhair_watering_strip5.png';
            hairPath.mine = 'MINING/longhair_mining_strip10.png';
            hairPath.do = 'DOING/longhair_doing_strip8.png';
        } else if (this.characterInfo.name === 'curly') {
            hairPath.idle = 'IDLE/curlyhair_idle_strip9.png';
            hairPath.walk = 'WALKING/curlyhair_walk_strip8.png';
            hairPath.run = 'RUN/curlyhair_run_strip8.png';
            hairPath.dig = 'DIG/curlyhair_dig_strip13.png';
            hairPath.axe = 'AXE/curlyhair_axe_strip10.png';
            hairPath.water = 'WATERING/curlyhair_watering_strip5.png';
            hairPath.mine = 'MINING/curlyhair_mining_strip10.png';
            hairPath.do = 'DOING/curlyhair_doing_strip8.png';
        }
        // 로그인 안하고 인 게임 기능 구현할 때 바가지 머리 캐릭터 사용
        else if (this.characterInfo.name === 'bow' || this.characterInfo.name === undefined) {
            hairPath.idle = 'IDLE/bowlhair_idle_strip9.png';
            hairPath.walk = 'WALKING/bowlhair_walk_strip8.png';
            hairPath.run = 'RUN/bowlhair_run_strip8.png';
            hairPath.dig = 'DIG/bowlhair_dig_strip13.png';
            hairPath.axe = 'AXE/bowlhair_axe_strip10.png';
            hairPath.water = 'WATERING/bowlhair_watering_strip5.png';
            hairPath.mine = 'MINING/bowlhair_mining_strip10.png';
            hairPath.do = 'DOING/bowlhair_doing_strip8.png';
        }


        // 스프라이트 시트의 frameWidth 96, frameHeigth 64
        const characterSprites = [
            // 대기 스프라이트 시트
            { name: 'player_idle_hair', path: hairPath.idle },
            { name: 'player_idle_body', path: 'IDLE/base_idle_strip9.png' },
            { name: 'player_idle_hand', path: 'IDLE/tools_idle_strip9.png' },
            // 걷는 스프라이트 시트
            { name: 'player_walk_hair', path: hairPath.walk },
            { name: 'player_walk_body', path: 'WALKING/base_walk_strip8.png' },
            { name: 'player_walk_hand', path: 'WALKING/tools_walk_strip8.png' },
            // 달리는 스프라이트 시트
            { name: 'player_run_hair', path: hairPath.run },
            { name: 'player_run_body', path: 'RUN/base_run_strip8.png' },
            { name: 'player_run_hand', path: 'RUN/tools_run_strip8.png' },
            // 땅파는 스프라이트 시트
            { name: 'player_dig_hair', path: hairPath.dig },
            { name: 'player_dig_body', path: 'DIG/base_dig_strip13.png' },
            { name: 'player_dig_hand', path: 'DIG/tools_dig_strip13.png' },
            // 도끼질 스프라이트 시트
            { name: 'player_axe_hair', path: hairPath.axe },
            { name: 'player_axe_body', path: 'AXE/base_axe_strip10.png' },
            { name: 'player_axe_hand', path: 'AXE/tools_axe_strip10.png' },
            // 물주는 스프라이트 시트
            { name: 'player_water_hair', path: hairPath.water },
            { name: 'player_water_body', path: 'WATERING/base_watering_strip5.png' },
            { name: 'player_water_hand', path: 'WATERING/tools_watering_strip5.png' },
            // 채굴 스프라이트 시트
            { name: 'player_mine_hair', path: hairPath.mine },
            { name: 'player_mine_body', path: 'MINING/base_mining_strip10.png' },
            { name: 'player_mine_hand', path: 'MINING/tools_mining_strip10.png' },
            // 행동 스프라이트 시트
            { name: 'player_do_hair', path: hairPath.do },
            { name: 'player_do_body', path: 'DOING/base_doing_strip8.png' },
            { name: 'player_do_hand', path: 'DOING/tools_doing_strip8.png' },

        ];

        // 상대 경로 설정
        this.load.path = 'assets/Character/';
        // 플레이어 캐릭터에 사용할 스프라이트 시트 로드
        characterSprites.forEach(sprite => this.spriteLoader.loadSprite(sprite));


        // sunnysideworld 타일셋 PNG 파일 로드
        // 상대 경로 설정
        this.load.path = "assets/maps/";
        this.load.image('sunnysideworld_tiles', 'spr_tileset_sunnysideworld_16px.png');
        this.load.image('cow_tiles', 'spr_deco_cow_strip4.png');

        // 타일맵 JSON 파일 로드
        this.load.tilemapTiledJSON('ingame_tilemap', 'ingame/Crypto_Farm_InGame.json');


        // 상대 경로 재설정
        // selectbox.png를 로드
        this.load.path = "assets/UI/";
        this.load.image("selectbox_bl", 'selectbox_bl.png');
        this.load.image("selectbox_br", 'selectbox_br.png');
        this.load.image("selectbox_tl", 'selectbox_tl.png');
        this.load.image("selectbox_tr", 'selectbox_tr.png');

        // 나가기 아이콘 exit_icon
        this.load.image("exit_icon", 'cancel.png');

        // nine-slice 로드
        // 외부 박스
        this.load.path = "assets/UI/9slice_box_white/"
        this.load.image("9slice_tl", 'dt_box_9slice_tl.png');
        this.load.image("9slice_tc", 'dt_box_9slice_tc.png');
        this.load.image("9slice_tr", 'dt_box_9slice_tr.png');
        this.load.image("9slice_lc", 'dt_box_9slice_lc.png');
        this.load.image("9slice_rc", 'dt_box_9slice_rc.png');
        this.load.image("9slice_c", 'dt_box_9slice_c.png');
        this.load.image("9slice_bl", 'dt_box_9slice_bl.png');
        this.load.image("9slice_bc", 'dt_box_9slice_bc.png');
        this.load.image("9slice_br", 'dt_box_9slice_br.png');


        // { key: "water_icon", url: "assets/UI/water.png" }
        this.load.path = "";
        // 로드할 아이콘 이미지 정보를 담은 객체 배열
        // 여기에 아이콘 제목을 넣어서 퀵슬롯에서 아이템 이름이 표시되게 해봄.
/*         this.iconLoadConfigs = [
            // 도구 아이콘들
            { title: '삽', key: "shovel_icon", url: "assets/UI/shovel.png" },
            { title: '수확하기', key: "harvest_icon", url: "assets/UI/hand_open_02.png" },
            { title: '도끼', key: "axe_icon", url: "assets/UI/axe.png" },
            { title: '곡괭이', key: "pickaxe_icon", url: "assets/UI/pickaxe.png" },
            // 씨앗 아이콘들
            { title: '감자 씨앗', key: "potato_icon", url: "assets/Elements/Crops/potato_00.png" },
            { title: '당근 씨앗', key: "carrot_icon", url: "assets/Elements/Crops/carrot_00.png" },
            { title: '호박 씨앗', key: "pumpkin_icon", url: "assets/Elements/Crops/pumpkin_00.png" },
            { title: '양배추 씨앗', key: "cabbage_icon", url: "assets/Elements/Crops/cabbage_00.png" },
        ]; */
        // 퀵슬롯에 사용할 아이콘들 로드
/*         this.iconLoadConfigs.forEach((iconLoadConfig) => {
            this.load.image(iconLoadConfig.key, iconLoadConfig.url);
        }); */

        // 씨앗 아이콘 -> 씨앗 아이템
        // 도구 아이콘 -> 도구 아이템

        // 농작물 아이템 정보 객체 배열
        const cropsLoadPath = "assets/Elements/Crops/"
        const cropsInfoConfigs = [
            { type: 'Crops', name: 'potato', title: '감자', key: 'potato_05', url: "potato_05.png", stackLimit : 999, price : 5},
            { type: 'Crops', name: 'carrot', title: '당근', key: 'carrot_05', url: "carrot_05.png", stackLimit : 999, price : 10},
            { type: 'Crops', name: 'pumpkin', title: '호박', key: 'pumpkin_05', url: "pumpkin_05.png", stackLimit : 999, price : 15},
            { type: 'Crops', name: 'cabbage', title: '양배추', key: 'cabbage_05', url: "cabbage_05.png", stackLimit : 999, price : 45},
        ]

        // 농작물 아이템 이미지 로드
        this.load.path = cropsLoadPath;
        cropsInfoConfigs.forEach((itemInfoConfig) => {
            this.load.image(itemInfoConfig.key, itemInfoConfig.url);
        });

        // 씨앗 아이템 정보 객체 배열
        const seedLoadPath = "assets/Elements/Crops/"
        const seedInfoConfigs = [
            { type: 'Seed', name: 'potato_seed', title: '감자 씨앗', key: 'potato_00', url: "potato_00.png", stackLimit : 999, price : 2},
            { type: 'Seed', name: 'carrot_seed', title: '당근 씨앗', key: 'carrot_00', url: "carrot_00.png", stackLimit : 999, price : 4},
            { type: 'Seed', name: 'pumpkin_seed', title: '호박 씨앗', key: 'pumpkin_00', url: "pumpkin_00.png", stackLimit : 999, price : 8},
            { type: 'Seed', name: 'cabbage_seed', title: '양배추 씨앗', key: 'cabbage_00', url: "cabbage_00.png", stackLimit : 999, price : 16},
        ];

        // 씨앗 아이템 이미지 로드
        this.load.path = seedLoadPath;
        seedInfoConfigs.forEach((itemInfoConfig) => {
            this.load.image(itemInfoConfig.key, itemInfoConfig.url);
        });

        // 도구 아이템 정보 객체 배열
        const toolLoadPath = "assets/UI/"
        this.toolInfoConfigs = [
            { type: 'Tool', name: 'shovel', title: '삽', key: 'shovel_icon', url: toolLoadPath + "shovel.png", stackLimit : 1, price : 2},
            { type: 'Tool', name: 'harvest', title: '수확하기', key: 'harvest_icon', url: toolLoadPath + "hand_open_02.png", stackLimit : 1, price : 4},
            { type: 'Tool', name: 'axe', title: '도끼', key: 'axe_icon', url: toolLoadPath + "axe.png", stackLimit : 1, price : 8},
            { type: 'Tool', name: 'pickaxe', title: '곡괭이', key: 'pickaxe_icon', url: toolLoadPath + "pickaxe.png", stackLimit : 1, price : 16},
        ];

        // 도구 아이템 이미지 로드
        this.load.path = "";
        this.toolInfoConfigs.forEach((itemInfoConfig) => {
            this.load.image(itemInfoConfig.key, itemInfoConfig.url);
        });


        // 아이템 정보 객체 배열
        // 각 타입의 아이템 정보 배열들을 전부 저장한다.
        const itemInfoConfigs = [];
        itemInfoConfigs.push(cropsInfoConfigs, seedInfoConfigs, this.toolInfoConfigs);


        //console.log("전체 아이템 정보 객체 배열", itemInfoConfigs);

        // 농작물 이미지 로드
        this.load.path = "assets/Elements/Crops/"
        // 감자 이미지
        // 새싹
        this.load.image('potato_01', "potato_01.png");
        // 성장기
        this.load.image('potato_02', "potato_02.png");
        this.load.image('potato_03', "potato_03.png");
        // 수확기
        this.load.image('potato_04', "potato_04.png");
        // 열매 
        this.load.image('potato_05', "potato_05.png");
        // 당근
        this.load.image('carrot_01', "carrot_01.png");
        this.load.image('carrot_02', "carrot_02.png");
        this.load.image('carrot_03', "carrot_03.png");
        this.load.image('carrot_04', "carrot_04.png");
        this.load.image('carrot_05', "carrot_05.png");
        // 호박
        this.load.image('pumpkin_01', "pumpkin_01.png");
        this.load.image('pumpkin_02', "pumpkin_02.png");
        this.load.image('pumpkin_03', "pumpkin_03.png");
        this.load.image('pumpkin_04', "pumpkin_04.png");
        this.load.image('pumpkin_05', "pumpkin_05.png");

        // 양배추
        this.load.image('cabbage_01', "cabbage_01.png");
        this.load.image('cabbage_02', "cabbage_02.png");
        this.load.image('cabbage_03', "cabbage_03.png");
        this.load.image('cabbage_04', "cabbage_04.png");
        this.load.image('cabbage_05', "cabbage_05.png");

    }

    create() {


        // 게임 화면의 가로, 세로 중앙 좌표
        const centerX = this.cameras.main.centerX;
        const centerY = this.cameras.main.centerY;

        // 게임 화면의 가로, 세로 좌표
        const rightX = this.cameras.main.width;
        const bottomY = this.cameras.main.height;


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
            // 도끼질 애니메이션 10 프레임
            { key: 'axe_hair', frames: this.anims.generateFrameNumbers('player_axe_hair', { start: 0, end: 9 }), frameRate: 10, repeat: 0 },
            { key: 'axe_body', frames: this.anims.generateFrameNumbers('player_axe_body', { start: 0, end: 9 }), frameRate: 10, repeat: 0 },
            { key: 'axe_hand', frames: this.anims.generateFrameNumbers('player_axe_hand', { start: 0, end: 9 }), frameRate: 10, repeat: 0 },
            // 물주는 애니메이션 5 프레임
            { key: 'water_hair', frames: this.anims.generateFrameNumbers('player_water_hair', { start: 0, end: 4 }), frameRate: 5, repeat: 0 },
            { key: 'water_body', frames: this.anims.generateFrameNumbers('player_water_body', { start: 0, end: 4 }), frameRate: 5, repeat: 0 },
            { key: 'water_hand', frames: this.anims.generateFrameNumbers('player_water_hand', { start: 0, end: 4 }), frameRate: 5, repeat: 0 },
            // 채굴 애니메이션 10 프레임
            { key: 'mine_hair', frames: this.anims.generateFrameNumbers('player_mine_hair', { start: 0, end: 9 }), frameRate: 10, repeat: 0 },
            { key: 'mine_body', frames: this.anims.generateFrameNumbers('player_mine_body', { start: 0, end: 9 }), frameRate: 10, repeat: 0 },
            { key: 'mine_hand', frames: this.anims.generateFrameNumbers('player_mine_hand', { start: 0, end: 9 }), frameRate: 10, repeat: 0 },
            // 행동 애니메이션 8 프레임
            { key: 'do_hair', frames: this.anims.generateFrameNumbers('player_do_hair', { start: 0, end: 7 }), frameRate: 8, repeat: 0 },
            { key: 'do_body', frames: this.anims.generateFrameNumbers('player_do_body', { start: 0, end: 7 }), frameRate: 8, repeat: 0 },
            { key: 'do_hand', frames: this.anims.generateFrameNumbers('player_do_hand', { start: 0, end: 7 }), frameRate: 8, repeat: 0 },
        ];




        // 스프라이트 로더 클래스에 애니메이션 정보 전달해서 씬에서 애니메이션 생성하기
        animations.forEach(animation => this.spriteLoader.createAnimation(animation));
        // 플레이어 캐릭터 오브젝트 씬에 생성
        // 플레이어는 현재 컨테이너 클래스로 이뤄져 있음.
        // 컨테이너 클래스의 오리진은 변경이 불가능하다.
        this.playerObject = new PlayerObject(this, 500, 600);

        // 플레이어가 상호작용할 타일 안에 있는 농작물을 검색하는 물리 객체
        // 스프라이트 키에 null 넣으면 이미지가 표시되지 않음.
        // setSize() 이거 좀 귀찮은 메소드네...
        this.searchArea = this.physics.add.sprite(500, 500, null);
        this.searchArea.setDisplaySize(tileSize, tileSize).setOrigin(0, 0);
        this.searchArea.body.debugShowBody = false;

        // setSize() 하니까 갑자기 물리 바디 오리진이 0,0에서 0.5, 0.5가 됨.


        // 플레이어 캐릭터의 중앙값 구하기
        // 컨테이너의 현재 위치 값에서 컨테이너의 실제 길이, 높이 값의 절반을 더하면 됨.
        const playerCenterX = this.playerObject.x + (this.playerObject.body.width / 2);
        const playerCenterY = this.playerObject.y + (this.playerObject.body.height / 2);

        // 퀵슬롯 UI 생성 코드
        // 생성된 퀵슬롯 UI 객체들을 담을 배열
        this.QuickSlots = [];
        // 퀵슬롯의 개수
        const quickSlotNumber = 8;

        // 퀵슬롯에 들어가는 아이템 담는 배열
        const quickSlotItems = [];

        quickSlotItems.push(new Item('Tool', 'shovel', '삽', 'shovel_icon' ));
        quickSlotItems.push(new Item('Tool', 'harvest', '수확하기', 'harvest_icon' ));
        quickSlotItems.push(new Item('Tool', 'axe', '도끼', 'axe_icon' ));
        quickSlotItems.push(new Item('Tool', 'pickaxe', '곡괭이', 'pickaxe_icon' ));

        quickSlotItems.push(new Item('Seed', 'potato_seed', '감자 씨앗', 'potato_00' ));
        quickSlotItems.push(new Item('Seed', 'carrot_seed', '당근 씨앗', 'carrot_00' ));
        quickSlotItems.push(new Item('Seed', 'pumpkin_seed', '호박 씨앗', 'pumpkin_00' ));
        quickSlotItems.push(new Item('Seed', 'cabbage_seed', '양배추 씨앗', 'cabbage_00' ));

        // 퀵슬롯 UI 생성 컨테이너 클래스는 Origin 설정 불가능함.
        // Origin 기본값 (0,0) 으로 왼쪽 상단임
        // 게임 화면 오른쪽 하단에 위치시키는 코드
        for (let i = 0; i < quickSlotNumber; i++) {
            const slotWidth = 150;
            const slotHeight = 150;

            // 퀵슬롯의 위치
            const slotX = rightX - (slotWidth * (quickSlotNumber - i));
            const slotY = bottomY - slotHeight;

            const slotNumber = i + 1;

/*             const iconKey = this.iconLoadConfigs[i].key;
            const itemTitle = this.iconLoadConfigs[i].title; */

            const iconKey = quickSlotItems[i].imgKey; 
            const itemTitle = quickSlotItems[i].title;

            this.QuickSlots.push(new ItemSlot(this, slotX, slotY,
                slotWidth, slotHeight, quickSlotItems[i], slotNumber));
        }


        // 그래픽스 객체 추가
        // 현재 장착중인 도구 슬롯 표시하는 사각형 객체
        this.equipMarker = this.add.graphics();
        // 사각형 그릴 때 선은 원점에서 감싸지는 형태로 그려진다.
        this.equipMarker.lineStyle(4, 0xFF0000, 1);
        // 사각형 그리기 시작 위치 왼쪽 상단
        this.equipMarker.strokeRect(this.QuickSlots[this.equipNumber].x + 3
            , this.QuickSlots[this.equipNumber].y + 3,
            144, 144);
        this.equipMarker.setDepth(100);
        this.equipMarker.setScrollFactor(0);


        // 프레임 UI 추가

        // 크기
/*         const frameWidth = 800;
        const frameHeight = 400;

        // UI 위치    
        const frameX = this.cameras.main.width / 2 - frameWidth / 2;
        const frameY = this.cameras.main.height / 2 - frameHeight / 2;      
        this.frame =new Frame(this, frameX, frameY, 
            frameWidth, frameHeight); */

        // 플레이어의 중앙 위치에서 바라보는 방향의 바로 앞 타일의 위치를 점으로 찍는다.
        /*         this.frontTilePoint = this.add.graphics({ fillStyle: { color: 0xff0000 } });
                this.frontTilePoint.fillCircle(playerCenterX, playerCenterY, 1);
                this.frontTilePoint.setDepth(100); */


        // 충돌 영역에 대한 디버그 그래픽 설정
        // 각 레이어의 충돌 영역을 그린다.
        const debugGraphics = [];

        // 타일 맵 생성
        // 타일 맵 정보를 담은 Json 로드할 때 설정한 키값과 맞춰야 한다.
        this.ingameMap = this.make.tilemap({ key: 'ingame_tilemap' });
        // 현재 사용중인 타일셋 이미지를 추가
        // 타일셋 오브젝트를 리턴한다.
        const sunnysideworld_tileset = this.ingameMap.addTilesetImage('sunnysideworld_16px', 'sunnysideworld_tiles');
        // 소 타일셋 이미지
        //const cow_tileset = this.ingameMap.addTilesetImage('spr_deco_cow_strip4', 'cow_tiles');

        // 제일 밑에 있는 레이어를 가장 먼저 생성한다.
        for (let i = 0; i < this.ingameMap.layers.length; i++) {
            // 이 방법을 쓰면 레이어 이름을 일일히 지정할 필요가 없음.
            // 레이어 인덱스 값을 넣어도 됨.
            const layer = this.ingameMap.createLayer(i, sunnysideworld_tileset, 0, 0);
            // 레이어 깊이 설정. 깊이 값은 레이어 간의 시각적 순서를 결정한다.
            // 낮은 깊이를 가진 레이어가 뒤에 배치되고, 높은 깊이를 가진 레이어가 앞에 배치된다.
            layer.setDepth(i);
            // 레이어 스케일 설정
            layer.scale = layerScale;
            // 현재 맵 크기 설정
            currentMapWidth = layer.displayWidth;
            currentMapHeight = layer.displayHeight;
            //console.log(layer.displayWidth, layer.displayHeight);

            // 각 레이어에 충돌 적용하기
            layer.setCollisionByProperty({ collides: true });
            // 플레이어 캐릭터와 레이어 충돌 적용
            this.physics.add.collider(this.playerObject, layer);

            // 디버그 그래픽 객체 배열 초기화
            if (i === 0) {
                // 타일맵 레이어 갯수만큼
                for (let j = 0; j < this.ingameMap.layers.length; j++) {
                    debugGraphics.push(this.add.graphics().setAlpha(0.6));
                    debugGraphics[j].setDepth(3);
                }
            }

            // 디버그 그래픽 스타일 객체
            let styleconfig = {
                // 미충돌 타일 색상 없음
                tileColor: null,
                // 충돌 타일 색상
                collidingTileColor: new Phaser.Display.Color(243, 134, 48, 200),
                // 충돌 영역의 경계선 색상
                faceColor: new Phaser.Display.Color(40, 39, 37, 255)
            }
            // 각 타일맵 레이어에 디버그 렌더링 설정
            layer.renderDebug(debugGraphics[i], styleconfig);
        }

        // 키보드 키 입력 설정
        // 방향키, 쉬프트, 스페이스바 키 객체 생성
        this.cursorsKeys = this.input.keyboard.createCursorKeys();
        // 숫자 키 객체 생성 1~5 나중에 9번까지
        this.numberKeys = this.input.keyboard.addKeys({
            'one': 'ONE',
            'two': 'TWO',
            'three': 'THREE',
            'four': 'FOUR',
            'five': 'FIVE',
            'six': 'SIX',
            'seven': 'SEVEN',
            'eight': 'EIGHT',
            'nine': 'NINE',
        });

        // addKeys() : 특정 키 또는 여러 키에 대한 Phaser Key 객체를 생성한다.
        this.shiftKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
        this.keys = this.input.keyboard.addKeys('W,A,S,D');
        let toggleDebugKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.C);

        // 키 입력 이벤트 리스너 등록
        // 1번 키
        this.numberKeys.one.on('down', (event) => this.equipQuickSlot(0));
        // 2번 키
        this.numberKeys.two.on('down', (event) => this.equipQuickSlot(1));
        // 3번 키
        this.numberKeys.three.on('down', (event) => this.equipQuickSlot(2));
        // 4번 키
        this.numberKeys.four.on('down', (event) => this.equipQuickSlot(3));
        // 5번 키
        this.numberKeys.five.on('down', (event) => this.equipQuickSlot(4));
        // 6번 키
        this.numberKeys.six.on('down', (event) => this.equipQuickSlot(5));
        // 7번 키
        this.numberKeys.seven.on('down', (event) => this.equipQuickSlot(6));
        // 8번 키
        this.numberKeys.eight.on('down', (event) => this.equipQuickSlot(7));
        // 9번 키
        //this.numberKeys.nine.on('down', (event) => this.equipQuickSlot(8));

        // 'C' 키 입력 이벤트 리스너
        toggleDebugKey.on('down', function () {
            // 디버그 그래픽 표시 상태 토글
            debugGraphics.forEach((debugGraphic) => {
                debugGraphic.visible = !debugGraphic.visible;
            });

        });

        // 게임 시작시 디버그 그래픽 숨기기
        /*         debugGraphics.forEach((debugGraphic) => {
                    debugGraphic.visible = false;  
                }); */


        // 카메라 참조
        this.camera = this.cameras.main;
        // 카메라 이동 경계 설정
        this.cameras.main.setBounds(0, 0, currentMapWidth, currentMapHeight);
        this.camera.startFollow(this.playerObject);

        // 물리
        // 월드 경계 설정해서 플레이어 캐릭터가 못 나가게 한다.
        this.physics.world.setBounds(0, 0, currentMapWidth, currentMapHeight);

        // 디버그 텍스트 추가
        // 텍스트 스타일 객체
        const txtStyle = {
            fontFamily: 'Arial',
            fontSize: 30,
            backgroundColor: '#000000',
            align: 'center'
        };

        // 현재 플레이어가 위치한 타일의 인덱스 표시하고 화면 왼쪽 아래에 배치     
        this.interactTileIndexTxt = this.add.text(0, bottomY, 'interact tile index', txtStyle);
        this.interactTileIndexTxt.setScrollFactor(0).setOrigin(0, 1).setDepth(100);

        this.interactPropsTxt = this.add.text(centerX, 0, 'interact tile Properties', txtStyle);
        this.interactPropsTxt.setScrollFactor(0).setOrigin(0.5, 0).setDepth(100);

        // 박스의 스케일과 뎁스
        const selectBoxScale = 2;
        const selectBoxDepth = 3;

        // 캐릭터가 상호작용할 타일을 표시하는 selectBox 오브젝트 추가
        this.interTileMarker = new SelectBox(this, 550, 550, tileSize, tileSize, selectBoxScale, selectBoxDepth);
    }

    // time : 게임이 시작된 이후의 총 경과 시간을 밀리초 단위로 나타냄.
    // delta : 이전 프레임과 현재 프레임 사이의 경과 시간을 밀리초 단위로 나타낸다
    // 이 값은 게임이 얼마나 매끄럽게 실행되고 있는지를 나타내는데 사용될 수 있으며,
    // 주로 프레임 간 일정한 속도를 유지하기 위한 물리 계산에 사용한다.
    update(time, delta) {

        this.playerObject.update(this.cursorsKeys, this.keys);

        // 플레이어의 현재 위치 : Vector 2
        const playerX = this.playerObject.x;
        const playerY = this.playerObject.y;

        // 플레이어의 현재 중앙 위치
        // 컨테이너의 현재 위치 값에서 컨테이너의 실제 길이, 높이 값의 절반을 더하면 됨.
        const playerCenterX = playerX + (this.playerObject.body.width / 2);
        const playerCenterY = playerY + (this.playerObject.body.height / 2);


        // 캐릭터 중앙 위치에서 캐릭터가 바라보는 방향 앞에 1타일 크기만큼 떨어진 곳 위치 구하기
        let pointX = playerCenterX;
        // 캐릭터가 현재 바라보는 방향
        if (this.playerObject.playerDirection === 'left') {
            pointX = playerCenterX - tileSize;
        } else if (this.playerObject.playerDirection === "right") {
            pointX = playerCenterX + tileSize;
        }

        // 플레이어 중앙 위치의 바로 앞 타일의 위치를 찍는다.
        /*         this.frontTilePoint.clear();
                this.frontTilePoint.fillCircle(pointX, playerCenterY, 2);
         */
        // 캐릭터가 상호작용할 타일의 인덱스 구하기
        // 캐릭터 중앙 위치에서 캐릭터가 바라보는 방향 바로 앞 타일의 인덱스 구하기
        const interactTileX = this.ingameMap.worldToTileX(pointX);
        const interactTileY = this.ingameMap.worldToTileY(playerCenterY);
        this.interactTileX = interactTileX;
        this.interactTileY = interactTileY;

        const interactTile = this.ingameMap.getTileAt(interactTileX, interactTileY, true, 1);
        // 구한 타일의 인덱스를 텍스트 표시 
        this.interactTileIndexTxt.setText("InteractTileIndex X : " + interactTileX +
            "\nInteractTileIndex Y : " + interactTileY);

        // 맵 바깥에는 타일이 없어서 null들어감.
        if (interactTile)
            // 상호작용할 타일의 프로퍼티 표시
            this.interactPropsTxt.setText("Plantable : " + interactTile.properties.plantable);


        // 캐릭터가 상호작용할 타일의 월드 상의 위치
        const frontTileX = this.ingameMap.tileToWorldX(interactTileX);
        const frontTileY = this.ingameMap.tileToWorldY(interactTileY);

        // 상호작용 할 타일 표시 UI 마커 위치 업데이트
        this.interTileMarker.x = frontTileX;
        this.interTileMarker.y = frontTileY;

        // 검색 영역 위치도 업데이트
        this.searchArea.x = frontTileX;
        this.searchArea.y = frontTileY;

    }

    // 현재 장비하고 있는 퀵슬롯을 표시하는 사각형 그리는 함수
    equipQuickSlot(equipNumber) {

        this.equipNumber = equipNumber;
        this.equipMarker.clear();
        this.equipMarker.lineStyle(4, 0xFF0000, 1);
        this.equipMarker.strokeRect(this.QuickSlots[equipNumber].x + 3
            , this.QuickSlots[equipNumber].y + 3,
            144, 144);
    }

    // 캐릭터가 땅을 판 타일을 다른 타일로 칠한다.
    // 캐릭터 땅파기 애니메이션에 실행될 콜백 함수
    paintTiles() {

        const interactTileX = this.interactTileX;
        const interactTileY = this.interactTileY;
        const ingameMap = this.ingameMap;

        // 타일 인덱스를 전달, 페이저 타일 인덱스는 1부터 시작한다.
        // 전체 레이어의 타일 변경
        // 68 : 갈색 땅 타일 819 : 밭 타일 -1 : 빈 타일 인덱스
        ingameMap.putTileAt(68, interactTileX, interactTileY, true, 0);
        ingameMap.putTileAt(819, interactTileX, interactTileY, true, 1);
        ingameMap.putTileAt(-1, interactTileX, interactTileY, true, 2);


        // 변경한 레이어의 타일들을 배열에 넣음
        let tiles = [];
        tiles.push(ingameMap.getTileAt(interactTileX, interactTileY, true, 0));
        tiles.push(ingameMap.getTileAt(interactTileX, interactTileY, true, 1));
        tiles.push(ingameMap.getTileAt(interactTileX, interactTileY, true, 2));


        // 변경한 타일의 Ground 2 Layer의 프로퍼티를 수정하여 재배 가능한 타일이라고 나타내기
        tiles[1].properties.plantable = true;

        // 각 레이어의 타일의 회전 제거
        tiles.forEach((tile) => {

            if (tile) {
                tile.rotation = 0;
                // 타일의 X축, Y축 반전 제거
                tile.flipX = false;
                tile.flipY = false;
            }
        });
    }

    // 씨앗을 심을 타일 구하기
    getPlantTile() {
        const interactTileX = this.interactTileX;
        const interactTileY = this.interactTileY;

        // 씨앗을 심을 타일
        const plantTile = this.ingameMap.getTileAt(interactTileX, interactTileY, true, 1);
        return plantTile;
    }
    // 씬에 씨앗 이미지 추가 - 일단 감자만
    // seed : 심을 씨앗의 종류나 이름 넣기
    // plantTile : 씨앗을 심을 타일
    addSeed(seed, plantTile) {


        // 씨앗을 심을 타일의 월드상 픽셀 위치 구하기
        const plantTileX = this.ingameMap.tileToWorldX(plantTile.x);
        const plantTileY = this.ingameMap.tileToWorldX(plantTile.y);

        // 씨앗 이미지가 추가될 월드상의 위치
        // 타일의 중앙 위치에 배치
        const plantX = plantTileX + tileSize / 2;
        const plantY = plantTileY + tileSize / 2;


        // 지금 타일맵 레이어 스케일이 4니까 이미지 원래 크기의 4배하면 크기 비율이 맞음
        // 위치 조정

        // y축 위치를 1픽셀 만큼 내려야 함.
        // 지금 맵 크기가 4배 커져있으니 총 4픽셀만큼 내려야된다.

        const seedImgKey = seed + '_01';

        //console.log("seedImgKey : " + seedImgKey);

        // 밭 타일에 씨앗 이미지 추가
        /*         this.add.image(plantX, plantY + 4, seedImgKey)
                .setDepth(3).setScale(layerScale).setOrigin(0.5, 1); */

        // 농작물 게임 오브젝트 추가
        // 컨테이너 객체는 origin이 중앙임
        const crops = new Crops(this, plantTileX + tileSize / 2, plantTileY + tileSize / 2, seedImgKey, seed);

        // 캐릭터와 농작물 간의 overlap 이벤트 설정
        // create() 이후에 overlap 이벤트 설정해도 되나봄.
        this.physics.add.overlap(this.searchArea, crops, () => {
            /*             if(crops.state === 'harvest'){
                            console.log("검색 영역 안에 수확 가능한 농작물이 있음", crops.name);
                        } */
            //console.log(this.playerObject.isHarvesting);

            if (this.playerObject.isHarvesting === true && crops.state === 'harvest') {
                //console.log("캐릭터 수확 성공", crops.name);
                crops.harvest();

                // 인벤토리 배열에 아이템 추가
                // items는 사용안함

                // 인벤토리 수확한 농작물이 있는지 확인하는 변수
                let itemExist = false;

                // 아이템 스택 기능 구현
                // 인벤토리에 수확한 농작물이 있는지 확인한다.
                // forEach()는 break 사용 불가
                inventory.forEach(item => {
                    if(item.name === crops.name){
                        item.amount += 1;
                        itemExist = true;
                    }
                });
                // 인벤토리에 수확한 농작물이 없으면 농작물 아이템 객체를 생성해서 넣음.
                if (itemExist === false){
                // 농작물 아이템 객체 생성 후 인벤토리에 추가
                // 타입, 이름, 이미지 키
                inventory.push(new Item('Crops', crops.name, crops.name, crops.name + '_05'));
                console.log("캐릭터 인벤토리에 " + crops.name + " 추가됨.", inventory);
                }

            }
        });

        // 씨앗을 심었으니 재배 불가능한 타일로 변경한다
        plantTile.properties.plantable = false

    }

    // 마우스 포인터가 위치한 타일의 픽셀 위치를 구하는 함수
    getMousePointerTile() {

        // getTileAt(tileX, tileY, [,nonNull], [, layer])
        // 타일맵에서 주어진 레이어에서 주어진 타일 좌표에 있는 타일을 가져온다.
        // layer 파라미터가 비었으면 현재 레이어가 사용된다.
        this.selectedTile = this.ingameMap.getTileAt(2, 3);

        // 현재 활성화된 포인터(예: 마우스 커서)의 위치를 카메라의 뷰포트 좌표로 변환한다.
        // this.input.activePointer : 게임에서 현재 활성화된 포인터를 나타낸다.
        // positionTocamera(this.camera) : 활성화된 포인터의 위치를 메인 카메라의 뷰포트 좌표로 변환
        // 화면상의 포인터 위치를 게임 세계 내의 실제 위치로 매핑하는데 사용한다.
        const worldPoint = this.input.activePointer.positionToCamera(this.camera);

        // 마우스 커서의 게임 세계 내의 좌표 값 표시
        this.mouseLocationText.setText("WorldPoint X : " + worldPoint.x +
            "\nWorldPoint Y : " + worldPoint.y);

        // 마우스 포인터 위치가 속한 타일의 X,Y 인덱스 반환
        // 마우스 포인터가 어느 타일에 위치하는지 알 수 있다.
        // worldToTileX() : 월드 좌표계에서 X 좌표를 타일 좌표계의 X 좌표로 변환한다.
        // 픽셀 단위의 월드 좌표를 입력받아, 해당 위치가 속한 타일의 X 인덱스를 반환한다.
        const pointerTileX = this.ingameMap.worldToTileX(worldPoint.x);
        const pointerTileY = this.ingameMap.worldToTileY(worldPoint.y);

        // 마우스 포인터가 위치한 타일 인덱스 표시
        this.tileIndexText.setText("TileIndex X : " + pointerTileX +
            "\nTileIndex Y : " + pointerTileY);

        // 월드 공간에서 타일 좌표로 스냅
        // 마우스 포인터가 위치한 해당 타일의 월드 좌표계에서 실제 위치를 알아낸다.
        // tileToWorldX() : 타일 좌표계에서 X 좌표를 월드 좌표계의 X 좌표로 변환한다.
        // 타일의 X 인덱스를 입력받아, 해당 타일의 월드 좌표계에서 X위치(픽셀 단위) 반환
        this.marker.x = this.ingameMap.tileToWorldX(pointerTileX);
        this.marker.y = this.ingameMap.tileToWorldY(pointerTileY);


        // 마우스 왼쪽 버튼을 누르면 새 타일로 칠하기
        if (this.input.manager.activePointer.isDown) {
            //this.ingameMap.putTileAt(this.selectedTile, tileX, TileY);
        }
    }

    // 이미지 속성 설정하는 함수
    configureImage(image, config) {
        if (config.origin !== undefined) {
            image.setOrigin(config.origin);
        }
        if (config.depth !== undefined) {
            image.setDepth(config.depth);
        }
        if (config.scale !== undefined) {
            image.setScale(config.scale);
        }
        if (config.scrollFactor !== undefined) {
            image.setScrollFactor(config.scrollFactor);
        }
        return image;
    }

}

// 스프라이트 시트 로더 클래스 - 로드 부분을 따로 클래스로 분리
class SpriteLoader {

    // 페이저 씬 객체를 생성자에서 받는다.
    constructor(scene) {
        this.scene = scene;
    }

    loadSprite(spriteData) {

        // 선택한 캐릭터가 base(빡빡이)면 경로가 ''로 들어오니
        // 아무것도 안하면 됨.
        if (spriteData.path === '') {
            return;
        }

        // frameWidth, frameHeight 기본 값 설정
        if (spriteData.frameWidth === undefined)
            spriteData.frameWidth = 96;
        if (spriteData.frameHeight === undefined)
            spriteData.frameHeight = 64;

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

// 플레이어가 상호작용할 타일을 표시하거나 선택한 아이템을 표시하는 UI 박스
class SelectBox extends Phaser.GameObjects.Container {

    topLeft;
    topRight;
    bottomLeft;
    bottomRight;

    // scene : 박스 UI가 추가될 씬
    // x, y 박스 위치 시작점
    // width, height 박스의 길이와 높이
    // scale : 박스를 구성하는 UI들의 스케일
    constructor(scene, x, y, width, height, scale, depth) {
        super(scene, x, y);

        scene.add.existing(this);
        // 씬의 물리 시스템에 추가하여 물리적 상호작용을 가능하게 한다.
        // 디버그용
        //scene.physics.add.existing(this);

        this.setDepth(depth);

        // 사각형의 각 꼭짓점에 select box UI 추가
        this.topLeft = scene.add.image(0, 0, 'selectbox_tl');
        this.topLeft.setOrigin(0, 0).setScale(scale);

        this.topRight = scene.add.image(width, 0, 'selectbox_tr');
        this.topRight.setOrigin(1, 0).setScale(scale);

        this.bottomLeft = scene.add.image(0, height, 'selectbox_bl');
        this.bottomLeft.setOrigin(0, 1).setScale(scale);

        this.bottomRight = scene.add.image(width, height, 'selectbox_br');
        this.bottomRight.setOrigin(1, 1).setScale(scale);



        this.add([this.topLeft, this.topRight, this.bottomLeft, this.bottomRight]);

    }

}