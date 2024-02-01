import Phaser from 'phaser'
import PlayerObject from '../characters/player_object'
import ItemSlot from '../ui/item_slot';
import Crops from '../elements/crops';
import Item from '../elements/item';
import Inventory from '../ui/inventory';
import QuickSlot from '../ui/quickslot';
import Auction from '../ui/auction';
import CropsToolTip from '../ui/crops_tooltip';
import ItemDisc from '../ui/itemdisc/itemdisc';
import UIVisibleBtn from '../ui/button/UIVisibleBtn';
import Tree from '../elements/tree';

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



let APIUrl = process.env.REACT_APP_API;


export default class InGameScene extends Phaser.Scene {

    APIurl = 'http://221.148.25.234:1234'
    accessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX25hbWUiOiJ0ZXN0IiwiYXNzZXRfaWQiOiI0NTYzNDU2IiwiaWF0IjoxNzA2NzY1MTA3LCJleHAiOjE3MDY4MDExMDd9.0w0Y5QXub1bPe1nBHnYLZ_RZ0x36W0RHvQiAqiUlw6M"
    auction;
    // 플레이어가 상호작용할 타일의 인덱스
    interactTileIndexTxt;
    // 게임 캐릭터의 정보 - 캐릭터 외형, 레벨, 소지금등을 포함한다.
    characterInfo;
    // 현재 장착중인 도구 슬롯 번호 - 기본값 0
    equipNumber = 0;

    goldText
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

    // 인벤토리 객체
    inventory;
    // I 키 객체
    inventoryKey;

    // E 키 객체
    harvestKey;


    // 현재 마우스가 올려진 슬롯 참조
    hoverSlot = null;
    startSlot;
    endSlot;

    // 드래그 상태 추적
    isDragging = false;

    // 플레이어 소유 아이템 목록
    own_items;

    // 서버에서 전체 아이템 목록을 요청한 다음 그게 배열로 오는데
    // 해쉬 테이블에 저장시킴
    // 모든 아이템 정보 <- 해쉬 테이블
    allItems = new Map();

    // 경작 가능 영역 표시하는 오브젝트 레이어
    plantableLayer;

    // 타일맵 데이터 저장
    objects = [];
    // 농작물 오브젝트 저장
    crops = [];

    // 서버에 저장할 농작물 오브젝트 배열
    // 농작물 옵젝을 그냥 저장하면 불필요한 데이터들이 너무 많음
    // x, y, name, plantTime, growSec <- 저장
    serverCrops = [];

    // 서버에 저장할 맵 데이터 객체
    mapData = {
        objects: this.objects,
        crops: this.serverCrops
    }

    // 농작물 정보 툴팁
    cropsToolTip;

    // UI visible 토글 버튼
    uiVisibleBtn;

    // 생성자가 왜 있지? 씬 등록하는 건가?
    constructor() {
        super('InGameScene');

        //console.log("블록체인 노드 주소", process.env.REACT_APP_NODE);


        // 테스트 계정의 감자 갯수 증가 시키기
        //this.serverAddItem(9, 1, 3);
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
        this.characterInfo = {
            user_id: 1,
            user_name: 'park',
            exp: 1000,
            level: 1,
            cft: 1500000,
            asset_id: 4563456
        }

        this.serverGetUserItem();
        this.serverGetAllItem();

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


        // 나무 스프라이트 시트 로드하기
        this.load.path = 'assets/Elements/Plants/';
        this.load.spritesheet('tree1', 'spr_deco_tree_01_strip4.png', {
            frameWidth : 32,
            frameHeight : 34
        });



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
        //골드 아이콘
        this.load.image("goldIcon", 'goldIcon.svg');
        this.load.image("searchBox", 'searchBox.png');

        this.load.image("indicator", 'indicator.png');
        this.load.image("next", 'arrow_right.png');
        this.load.image("before", 'arrow_left.png');

        this.load.image("timer", "stopwatch.png");

        // 나가기 아이콘 exit_icon
        this.load.image("exit_icon", 'cancel.png');
        // 인벤토리 아이콘
        this.load.image('inven_icon', 'basket.png');
        this.load.image("auction_exit", 'cancel.png');

        // 성장 진행도 UI 바
        this.load.image('greenbar00', 'greenbar_00.png');
        this.load.image('greenbar01', 'greenbar_01.png');
        this.load.image('greenbar02', 'greenbar_02.png');
        this.load.image('greenbar03', 'greenbar_03.png');
        this.load.image('greenbar04', 'greenbar_04.png');
        this.load.image('greenbar05', 'greenbar_05.png');
        this.load.image('greenbar06', 'greenbar_06.png');

        // 빨강색 Ui 바
        this.load.image('redbar00', 'redbar_00.png');
        this.load.image('redbar01', 'redbar_01.png');
        this.load.image('redbar02', 'redbar_02.png');
        this.load.image('redbar03', 'redbar_03.png');
        this.load.image('redbar04', 'redbar_04.png');
        this.load.image('redbar05', 'redbar_05.png');
        this.load.image('redbar06', 'redbar_06.png');

        // 푸른색 ui 바
        this.load.image('bluebar00', 'bluebar_00.png');
        this.load.image('bluebar01', 'bluebar_01.png');
        this.load.image('bluebar02', 'bluebar_02.png');
        this.load.image('bluebar03', 'bluebar_03.png');
        this.load.image('bluebar04', 'bluebar_04.png');
        this.load.image('bluebar05', 'bluebar_05.png');
        //this.load.image('bluebar06', 'bluebar_06.png');

        // 아이템 디스크
        this.load.image('itemdisc01', 'itemdisc_01.png');

        // 도구 아이콘
        this.load.image("삽", 'shovel.png');
        this.load.image("곡괭이", 'pickaxe.png');
        this.load.image("도끼", 'axe.png');

        //농작물 이미지
        this.load.path = "assets/Crops/";
        this.load.image("감자 씨앗", 'potato_00.png');
        this.load.image("호박 씨앗", 'pumpkin_00.png');
        this.load.image("당근 씨앗", 'carrot_00.png');
        this.load.image("양배추 씨앗", 'cabbage_00.png');
        this.load.image("사탕무 씨앗", 'beetroot_00.png')
        this.load.image("무 씨앗", 'radish_00.png');
        this.load.image("케일 씨앗", 'kale_00.png')
        this.load.image("밀 씨앗", 'wheat_00.png')

        this.load.image("감자", 'potato_05.png');
        this.load.image("호박", 'pumpkin_05.png')
        this.load.image("당근", 'carrot_05.png');
        this.load.image("양배추", 'cabbage_05.png')
        this.load.image("사탕무", 'beetroot_05.png')
        this.load.image("무", 'radish_05.png');
        this.load.image("케일", 'kale_05.png')
        this.load.image("밀", 'wheat_05.png')

        this.load.image("나무", 'wood.png');
        this.load.image("바위", 'rock.png')
        this.load.image("달걀", 'egg.png');
        this.load.image("우유", 'milk.png')
        this.load.image("물고기", 'fish.png');
        this.load.image("Potato Seed", 'seeds_generic.png');
        this.load.image("Potato", 'potato_05.png');


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

        //lt 탭메뉴 용
        this.load.image("tab_9slice_bc", 'lt_box_9slice_bc.png');
        this.load.image("tab_9slice_bl", 'lt_box_9slice_bl.png');
        this.load.image("tab_9slice_br", 'lt_box_9slice_br.png');
        this.load.image("tab_9slice_c", 'lt_box_9slice_c.png');
        this.load.image("tab_9slice_lc", 'lt_box_9slice_lc.png');
        this.load.image("tab_9slice_rc", 'lt_box_9slice_rc.png');
        this.load.image("tab_9slice_tc", 'lt_box_9slice_tc.png');
        this.load.image("tab_9slice_tl", 'lt_box_9slice_tl.png');
        this.load.image("tab_9slice_tr", 'lt_box_9slice_tr.png');

        // { key: "water_icon", url: "assets/UI/water.png" }
        this.load.path = "";
        // 로드할 아이콘 이미지 정보를 담은 객체 배열
        // 여기에 아이콘 제목을 넣어서 퀵슬롯에서 아이템 이름이 표시되게 해봄.

        //dt frame 용
        this.load.path = "assets/UI/9slice_box_white/";
        this.load.image("9slice_bc", 'dt_box_9slice_bc.png');
        this.load.image("9slice_bl", 'dt_box_9slice_bl.png');
        this.load.image("9slice_br", 'dt_box_9slice_br.png');
        this.load.image("9slice_c", 'dt_box_9slice_c.png');
        this.load.image("9slice_lc", 'dt_box_9slice_lc.png');
        this.load.image("9slice_rc", 'dt_box_9slice_rc.png');
        this.load.image("9slice_tc", 'dt_box_9slice_tc.png');
        this.load.image("9slice_tl", 'dt_box_9slice_tl.png');
        this.load.image("9slice_tr", 'dt_box_9slice_tr.png');

        //lt 탭메뉴 용
        this.load.image("tab_9slice_bc", 'lt_box_9slice_bc.png');
        this.load.image("tab_9slice_bl", 'lt_box_9slice_bl.png');
        this.load.image("tab_9slice_br", 'lt_box_9slice_br.png');
        this.load.image("tab_9slice_c", 'lt_box_9slice_c.png');
        this.load.image("tab_9slice_lc", 'lt_box_9slice_lc.png');
        this.load.image("tab_9slice_rc", 'lt_box_9slice_rc.png');
        this.load.image("tab_9slice_tc", 'lt_box_9slice_tc.png');
        this.load.image("tab_9slice_tl", 'lt_box_9slice_tl.png');
        this.load.image("tab_9slice_tr", 'lt_box_9slice_tr.png');


        this.load.path = "assets/Elements/Crops/"
        this.load.image("감자 씨앗", 'potato_00.png');
        this.load.image("호박 씨앗", 'pumpkin_00.png');
        this.load.image("당근 씨앗", 'carrot_00.png');
        this.load.image("양배추 씨앗", 'cabbage_00.png');
        this.load.image("사탕무 씨앗", 'beetroot_00.png')
        this.load.image("무 씨앗", 'radish_00.png');
        this.load.image("케일 씨앗", 'kale_00.png');
        this.load.image("밀 씨앗", 'wheat_00.png');

        // 농작물 밭에 심었을 때 이미지 로드
        // 감자 
        this.load.image('감자_01', "potato_01.png");
        this.load.image('감자_02', "potato_02.png");
        this.load.image('감자_03', "potato_03.png");
        this.load.image('감자_04', "potato_04.png");

        // 당근
        this.load.image('당근_01', "carrot_01.png");
        this.load.image('당근_02', "carrot_02.png");
        this.load.image('당근_03', "carrot_03.png");
        this.load.image('당근_04', "carrot_04.png");

        // 호박
        this.load.image('호박_01', "pumpkin_01.png");
        this.load.image('호박_02', "pumpkin_02.png");
        this.load.image('호박_03', "pumpkin_03.png");
        this.load.image('호박_04', "pumpkin_04.png");

        // 양배추
        this.load.image('양배추_01', "cabbage_01.png");
        this.load.image('양배추_02', "cabbage_02.png");
        this.load.image('양배추_03', "cabbage_03.png");
        this.load.image('양배추_04', "cabbage_04.png");

        // 사탕무 beetroot
        this.load.image('사탕무_01', "beetroot_01.png");
        this.load.image('사탕무_02', "beetroot_02.png");
        this.load.image('사탕무_03', "beetroot_03.png");
        this.load.image('사탕무_04', "beetroot_04.png");

        // 무 radish
        this.load.image('무_01', "radish_01.png");
        this.load.image('무_02', "radish_02.png");
        this.load.image('무_03', "radish_03.png");
        this.load.image('무_04', "radish_04.png");

        // 케일 kale
        this.load.image('케일_01', "kale_01.png");
        this.load.image('케일_02', "kale_02.png");
        this.load.image('케일_03', "kale_03.png");
        this.load.image('케일_04', "kale_04.png");

        // 밀 wheat
        this.load.image('밀_01', "wheat_01.png");
        this.load.image('밀_02', "wheat_02.png");
        this.load.image('밀_03', "wheat_03.png");
        this.load.image('밀_04', "wheat_04.png");


        // 농작물 열매 이미지
        this.load.image("감자", 'potato_05.png');
        this.load.image("호박", 'pumpkin_05.png')
        this.load.image("당근", 'carrot_05.png');
        this.load.image("양배추", 'cabbage_05.png')
        this.load.image("사탕무", 'beetroot_05.png')
        this.load.image("무", 'radish_05.png');
        this.load.image("케일", 'kale_05.png')

        this.load.image("나무", 'wood.png');
        this.load.image("바위", 'rock.png')
        this.load.image("달걀", 'egg.png');
        this.load.image("우유", 'milk.png')
        this.load.image("물고기", 'fish.png');


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

        // 플레이어 캐릭터 디버그 표시 해제
        this.playerObject.body.debugShowBody = false;
        this.playerObject.body.debugShowVelocity = false;

        // 플레이어가 상호작용할 타일 안에 있는 농작물을 검색하는 물리 객체
        // 스프라이트 키에 null 넣으면 이미지가 표시되지 않음.
        this.searchArea = this.physics.add.sprite(500, 500, null);
        this.searchArea.setDisplaySize(tileSize, tileSize).setOrigin(0, 0);
        this.searchArea.body.debugShowBody = false;


        /* this.examSprite = this.physics.add.sprite(640, 640 , null);
        this.examSprite.setDisplaySize(tileSize, tileSize).setOrigin(0, 0); */

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


        //옥션 UI 생성
        //크기
        const auctionWidth = 1400;
        const auctionHeight = 800;

        // 옥션의 위치    
        const autionX = this.cameras.main.width / 2 - auctionWidth / 2;
        const autionY = this.cameras.main.height / 2 - auctionHeight / 2;
        this.auction = new Auction(this, autionX, autionY,
            auctionWidth, auctionHeight);

        this.auction.setVisible(false);

        // 퀵슬롯 클래스 객체 생성하고 추가
        this.quickSlotUI = new QuickSlot(this, 0, 0);
        // 화면 중앙 하단에 배치
        this.quickSlotUI.x = this.cameras.main.width / 2 - this.quickSlotUI.width / 2;
        this.quickSlotUI.y = this.cameras.main.height - this.quickSlotUI.height + 1;

        /* console.log("퀵슬롯 컨테이너의 길이와 크기", this.quickSlotUI.width, this.quickSlotUI.height)
        console.log("퀵슬롯 컨테이너의 display 길이와 크기", 
        this.quickSlotUI.displayWidth, this.quickSlotUI.displayHeight); */

        // 그래픽스 객체 추가
        // 현재 장착중인 도구 슬롯 표시하는 사각형 객체
        this.equipMarker = this.add.graphics();
        this.equipQuickSlot(0);

        // 인벤토리 UI 추가

        // 크기
        const invenWidth = 1000;
        const invenHeight = 500;

        // UI 위치 화면 중앙에 배치됨.
        const invenX = this.cameras.main.width / 2 - invenWidth / 2;
        const invenY = this.cameras.main.height / 2 - invenHeight / 2;

        //console.log("invenX, invenY : ", invenX, invenY);

        this.inventory = new Inventory(this, invenX, invenY,
            invenWidth, invenHeight);

        this.inventory.disable();


        // 농작물 정보 툴팁
        this.cropsToolTip = new CropsToolTip(this, 0, 0, 150, 100);
        this.cropsToolTip.setVisible(false);

        const btnWidth = 60;
        const btnHeight = 60;
        const btnPad = 10;
        const btnX = this.cameras.main.width - btnWidth - btnPad;
        const btnY = this.cameras.main.height - btnHeight - btnPad;

        // 특정 UI 보이기 토글 버튼 추가
        this.uiVisibleBtn = new UIVisibleBtn(this, btnX, btnY, btnWidth, btnHeight);


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

        // 서버에서 맵 데이터 가져와서 적용
        this.serverGetMap();

        // 맵 초기화 하고 싶으면 호출
        //this.serverAddMap();

        // 경작 가능오브젝트 레이어 가져오기
        this.plantableLayer = this.ingameMap.getObjectLayer('Plantable Layer').objects;

        // 로드 체크
        //console.log(this.plantableLayer);

        // 오브젝트 레이어 디버그 그래픽 설정
        const objectGraphics = this.add.graphics({
            fillStyle: { color: 0x0000ff }, lineStyle: { color: 0x0000ff }
        }).setDepth(40);

        // 각 오브젝트에 대한 시각적 표현 생성
        this.plantableLayer.forEach((object) => {

            // layerScale만큼 object 위치, 크기 곱해주기
            object.x *= layerScale;
            object.y *= layerScale;
            object.width *= layerScale;
            object.height *= layerScale;

            /* if (object.rectangle) {
                objectGraphics.strokeRect(
                    object.x,
                    object.y,
                    object.width,
                    object.height);
            } */

            //console.log("object layerScale 만큼 크기 늘림", object);
        });


        // 나무 오브젝트 추가
        this.tree = new Tree(this, 64 * 10, 64 * 10);

        // 5 유닛에 위치

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
        this.inventoryKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.I);

        this.harvestKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
        // 상호작용할 타일이 오브젝트 레이어 영역에 포함되는지 확인한다.
        this.tileDebugKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.B);
        // 현재 맵 데이터 로그로 확인
        this.mapDataKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.M);
        //]키 경매장 UI오픈
        this.closeBracketKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.CLOSED_BRACKET);

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
        this.numberKeys.nine.on('down', (event) => this.equipQuickSlot(8));

        // 'C' 키 입력 이벤트 리스너
        toggleDebugKey.on('down', function () {
            // 디버그 그래픽 표시 상태 토글
            debugGraphics.forEach((debugGraphic) => {
                debugGraphic.visible = !debugGraphic.visible;
            });

        });

        // 'B' 키 입력 이벤트 리스너
        this.tileDebugKey.on('down', () => {
            let isInRect = this.isTileInPlantable(this.getInteractTile(), this.plantableLayer);


            // 작동 안함
            // 오브젝트 영역 위치와 크기값 layerScale만큼 곱해야 됨.
            if (isInRect) {
                console.log("상호작용할 타일이 경작가능 구역에 있음");
            }
        });


        // I키 누르면 인벤토리 Visible 토글
        this.inventoryKey.on('down', () => {
            // 삼항 연산자 
            this.inventory.visible ? this.inventory.disable() : this.inventory.enable();

        });
        // M키 눌러 현재 게임 맵 데이터 로그로 확인하기
        this.mapDataKey.on('down', () => {
            console.log("현재 게임 맵 데이터 ", this.mapData);
        });

        // 게임 시작시 디버그 그래픽 숨기기
        debugGraphics.forEach((debugGraphic) => {
            debugGraphic.visible = false;
        });


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
        /* this.interactTileIndexTxt = this.add.text(0, bottomY, 'interact tile index', txtStyle);
        this.interactTileIndexTxt.setScrollFactor(0).setOrigin(0, 1).setDepth(100);
        
        this.interactPropsTxt = this.add.text(centerX, 0, 'interact tile Properties', txtStyle);
        this.interactPropsTxt.setScrollFactor(0).setOrigin(0.5, 0).setDepth(100); */

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


        //console.log(this.crops);
        this.crops.forEach((crops, index) => {
            crops.update(delta);
        });

        this.cropsToolTip.update(delta);

        const interactTile = this.getInteractTile();

        // 구한 타일의 인덱스를 텍스트 표시 
        /*         this.interactTileIndexTxt.setText("InteractTileIndex X : " + interactTileX +
                    "\nInteractTileIndex Y : " + interactTileY); */

        // 맵 바깥에는 타일이 없어서 null들어감.
        /*         if (interactTile)
                    // 상호작용할 타일의 프로퍼티 표시
                    this.interactPropsTxt.setText("Plantable : " + interactTile.properties.plantable); */


        // 타일의 월드좌표로 상호작용 타일의 월드 상의 위치 저장
        // tileToWorldX()랑 Tile.pixelX랑 차이가 있네
        // ingameMap 원래 크기보다 4배 커져있는데
        // Tile.pixel 위치는 원래 크기에서 위치 값을 구해주네
        const frontTileX = interactTile.pixelX * layerScale;
        const frontTileY = interactTile.pixelY * layerScale;


        // 상호작용 할 타일 표시 UI 마커 위치 업데이트
        this.interTileMarker.x = frontTileX;
        this.interTileMarker.y = frontTileY;

        // 검색 영역 위치도 업데이트
        this.searchArea.x = frontTileX;
        this.searchArea.y = frontTileY;

        //]키 눌렀는지 체크 경매장 UI열어줌.
        if (this.closeBracketKey.isDown) {
            this.auction.enable();
        }

    }



    // 현재 장비하고 있는 퀵슬롯을 표시하는 사각형 그리는 함수
    equipQuickSlot(equipNumber) {

        // 사각형 그릴 때 선은 원점에서 감싸지는 형태로 그려지는거 아닌가?
        // 선 두께가 1 초과하면 두께 절반만큼 더하거나 빼야되나?
        // 이걸 어떻게 설명하지

        // 선 굵기가 굵어지면 top-left 기준점에서 어느 방향으로 굵어지는가
        // 밖으로 굵어지나? 아니면 안밖으로 굵어지나


        const lineWidth = 5;

        const x = this.quickSlotUI.x + 100 * equipNumber + lineWidth / 2;
        const y = this.quickSlotUI.y + lineWidth / 2;


        this.equipNumber = equipNumber;
        this.equipMarker.clear();
        this.equipMarker.lineStyle(lineWidth, 0xFF0000, 1);
        this.equipMarker.setDepth(100).setScrollFactor(0);
        this.equipMarker.strokeRect(x, y, 100 - lineWidth, 100 - lineWidth);

    }

    // 캐릭터가 땅을 판 타일의 타일 레이어 1를 밭 타일로 변경한다.
    // 캐릭터 땅파기 애니메이션에 실행될 콜백 함수
    setFieldTile() {

        const interactTileX = this.interactTileX;
        const interactTileY = this.interactTileY;
        const ingameMap = this.ingameMap;

        //console.log("interactTileX, interactTileY : ", interactTileX, interactTileY);

        // mapData에 새 밭 타일 추가 시도
        this.addMapTile(interactTileX, interactTileY);


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

        //console.log("interactTile : ", ingameMap.getTileAt(interactTileX, interactTileY, true, 1));

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

    // 농작물 검색 영역과 농작물 간의 overlap 이벤트 설정해서 
    // 농작물 수확이 가능하게 만든다.
    setCropsOverlap(crops, plantTile) {

        this.physics.add.overlap(this.searchArea, crops, () => {
            /*             if(crops.state === 'harvest'){
                            console.log("검색 영역 안에 수확 가능한 농작물이 있음", crops.name);
                        } */
            //console.log(this.playerObject.isHarvesting);

            if (this.playerObject.isHarvesting === true && crops.state === 'harvest') {
                console.log("캐릭터 수확 성공", crops.name);

                // 수확한 밭 타일을 구멍난 밭 타일로 변경한다.
                const fieldTileX = this.interactTileX;
                const fieldTileY = this.interactTileY;

                // 구멍난 밭 타일 인덱스 1139
                this.ingameMap.putTileAt(1139, fieldTileX, fieldTileY, true, 1);


                // 맵 데이터에서 수확이 완료된 밭 타일의 상태를 변경해야 된다.
                // type : 'field' -> 'perforated field'
                const tileExist = this.mapData.objects.some((object, index) => {

                    if (object.tileX === fieldTileX &&
                        object.tileY === fieldTileY) {
                        console.log("수확이 완료된 타일 찾음 상태 변경");

                        object.type = 'perforated field';

                        return true;
                    }
                    return false;
                });

                //console.log("상태가 변경된 밭 타일이 적용되었는지 확인", this.mapData.objects);

                // 밭 타일 상태 변경 사항 저장
                this.serverAddMap();

                // 새 아이템이 추가되거나 중복 아이템 수량이 증가할 아이템 슬롯 찾기
                let addItemSlot = null;
                addItemSlot = this.findAddItemSlot(crops.name);

                // 추가할 아이템 슬롯이 있으면
                // 아이템 추가 요청할 때 필요한 데이터 모아서 서버에 아이템 추가 요청함.
                if (addItemSlot !== null) {

                    this.sendAddItem(crops.name, addItemSlot);
                }

                //console.log("농작물 제거하기 전 this.crops 내용", this.crops);

                // 씬에서 농작물 객체 제거
                // 주의 : 씬에서 게임 오브젝트를 제거해도 다른 곳(예 : 배열)의 참조는
                // 자동으로 제거되지 않기 때문에, 수동으로 제거 해줘야 한다.
                crops.harvest();

                // 배열에서 참조 제거 filter() 사용
                // 씬에서 제거된 농작물 옵젝을 배열에서도 완전히 제거
                this.crops = this.crops.filter(crop => crop !== crops);
                //console.log("배열에서도 참조 제거한 후 this.crops 내용", this.crops);

                // x,y 값이 둘 다 똑같은 객체는 배열에 존재 하지 않음.
                const compareServerCrops = {
                    x: crops.x,
                    y: crops.y
                }

                console.log("compareServerCrops", compareServerCrops);

                console.log("filter 전 this.serverCrops", this.serverCrops);
                // this.serverCrops에서도 참조 제거
                // x, y 값이 일치하는 요소만 뺀 배열을 반환
                this.serverCrops = this.serverCrops.filter(serverCrop =>
                    !(compareServerCrops.x === serverCrop.x &&
                        compareServerCrops.y === serverCrop.y));

                console.log("filter 후 this.serverCrops", this.serverCrops);


                // mapData 객체 내부의 배열 참조를 바꿀려면
                // 직접 객체의 배열 속성을 수정해야 한다.
                this.mapData.crops = this.serverCrops;
                console.log("current Map Data", this.mapData);

                // 농작물을 수확하여 옵젝이 제거되었으니 변경 사항 저장 요청
                this.serverAddMap();

                // 밭 타일에 농작물이 없어졌다고 알림
                plantTile.properties.crops = false;
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
    // 씬에 농작물 오브젝트 추가
    // seedName : 심을 씨앗의 이름
    // plantTile : 씨앗을 심을 타일
    addSeed(seedName, plantTile) {

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


        // seedName '감자 씨앗'으로 오니까 ' 씨앗' 부분 빼야됨.
        let newSeedName = seedName.replace(' 씨앗', '');

        // 심은 시간 = 현재 시간
        const plantTime = new Date();

        // 아이템 정보 가져와야 함. seed_time
        const seedItem = this.allItems.get(seedName);

        // 농작물 게임 오브젝트 추가
        // 컨테이너 객체는 origin이 중앙임
        const crops = new Crops(this, plantX, plantY, newSeedName, plantTime, seedItem.seed_time);
        this.crops.push(crops);

        // 서버에 저장할 농작물 오브젝트 데이터
        const serverCrops = {
            x: crops.x,
            y: crops.y,
            name: crops.name,
            plantTime: crops.plantTime,
            growTime: crops.growSec
        };
        this.serverCrops.push(serverCrops);


        // 농작물 옵젝 변경 사항 서버에 저장
        this.serverAddMap();
        crops.body.debugShowBody = false;

        // 농작물 검색 영역과 농작물 간의 overlap 이벤트 설정
        // 농작물 수확이 가능하게 만듦.
        this.setCropsOverlap(crops, plantTile)

        // 씨앗을 심었으니 재배 불가능한 타일로 변경한다
        plantTile.properties.plantable = false
        // 타일에 농작물이 있다고 알림
        plantTile.properties.crops = true;

    }

    // mapData에 새 밭 타일 추가를 시도함.
    addMapTile(tileX, tileY) {

        // 땅 판 타일이 맵 데이터에 이미 존재하는 타일과 같은지 확인한다.
        // X,Y 위치가 같은 타일이 중복 추가되는 것을 방지함.
        const tileExist = this.mapData.objects.some((object, index) => {

            if (object.tileX === tileX && object.tileY === tileY) {
                console.log("mapData.Objects에 이미 존재하는 타일");

                // 지금 파는 타일이 구멍난 밭 타일이면
                if (object.type === 'perforated field') {
                    object.type = 'field';

                    // 서버에 맵 데이터 변경 저장 요청
                    this.serverAddMap();
                }
                return true;
            }
            return false;
        });

        // 중복되는 밭 타일이 없으면 맵 데이터에 밭 타일 새로 추가
        if (!tileExist) {

            //console.log("중복되는 밭 타일 없음");
            this.mapData.objects.push({
                tileX: tileX, tileY: tileY,
                type: 'field', tileIndex: 819
            });
            // 서버에 맵 데이터 변경 저장 요청
            this.serverAddMap();
        }

    }

    // 아이템 이름으로 새 아이템이 추가되거나 수량이 증가할 아이템 슬롯 찾음
    findAddItemSlot(itemName) {

        let addItemSlot = null;

        // 중복 아이템 찾기 퀵슬롯 -> 인벤
        // 중복 아이템 없으면 빈 슬롯 찾기 인벤 -> 퀵슬롯
        // 빈 슬롯 없으면 아이템 추가 X

        // 퀵슬롯에 중복 아이템이 있는지 확인하기
        addItemSlot = this.quickSlotUI.findDupSlot(itemName);
        if (addItemSlot === null) {

            // 인벤토리에 중복 아이템이 있는지 확인하기
            addItemSlot = this.inventory.findDupSlot(itemName);


            // 중복 아이템이 없을 경우
            if (addItemSlot === null) {
                // 없으면 인벤에 빈 공간이 있는지 확인하기
                addItemSlot = this.inventory.findEmptySlot();

                // 인벤에 빈 공간이 없으면
                if (addItemSlot === null) {
                    console.log("인벤토리에 빈 공간이 없음.");

                    // 퀵슬롯에서 빈 공간 찾기
                    addItemSlot = this.quickSlotUI.findEmptySlot();

                } else {
                    console.log("인벤토리에 빈 공간이 있음.");
                }
            }
        }

        return addItemSlot;

    }

    // 아이템 이름으로 아이템 추가 요청할 때 필요한 데이터 모아서 
    // 서버에 아이템 추가 요청함.
    sendAddItem(itemName, addItemSlot) {
        // 추가될 아이템 정보 객체
        const addItemInfo = this.allItems.get(itemName);

        // 아이템이 추가되거나 수량이 증가할 슬롯의 인덱스
        // 인벤토리의 시작 인덱스는 9부터
        // 퀵슬롯의 인덱스 범위 0~8

        // 슬롯 타입에 따라 인덱스 조정시키기
        let item_index = null;

        if (addItemSlot.type === 0) {
            item_index = addItemSlot.index + this.quickSlotUI.size;
        } else {
            item_index = addItemSlot.index;
        }

        console.log('추가될 아이템 정보 객체', addItemInfo);

        this.serverAddItem(1, item_index, addItemInfo, addItemSlot);
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

    // 플레이어가 상호작용할 타일을 구한다.
    // 상호작용 할 타일 : 플레이어 캐릭터가 바라보는 방향 바로 앞 타일
    getInteractTile() {

        // 플레이어 현재 위치 : Vector 2
        const playerLoc = {
            x: this.playerObject.x,
            y: this.playerObject.y
        }
        // 플레이어 현재 중앙 위치
        // // 컨테이너의 현재 위치 값에서 컨테이너의 실제 길이, 높이 값의 절반을 더하면 됨
        const playerCenterLoc = {
            x: playerLoc.x + (this.playerObject.body.width / 2),
            y: playerLoc.y + (this.playerObject.body.height / 2)
        }

        // 캐릭터 중앙 위치에서 캐릭터가 바라보는 방향 앞 1타일 크기만큼 떨어진 x축 위치 구하기
        let pointX = playerCenterLoc.x;
        // 캐릭터가 현재 바라보는 방향에 따라 
        if (this.playerObject.playerDirection === 'left') {
            pointX = playerCenterLoc.x - tileSize;
        } else if (this.playerObject.playerDirection === "right") {
            pointX = playerCenterLoc.x + tileSize;
        }

        // 플레이어 중앙 위치의 바로 앞 타일의 위치를 찍는다.
        /*         this.frontTilePoint.clear();
                this.frontTilePoint.fillCircle(pointX, playerCenterY, 2); */

        // 월드 상의 특정 위치(픽셀 단위)를 기반으로 해당 위치에 해당하는 타일맵의 타일 좌표를 계산한다.
        // 캐릭터가 상호작용할 타일의 위치 구하기
        //const interactTileX = this.ingameMap.worldToTileX(pointX);
        //const interactTileY = this.ingameMap.worldToTileY(playerCenterLoc.y);
        this.interactTileX = this.ingameMap.worldToTileX(pointX);
        this.interactTileY = this.ingameMap.worldToTileY(playerCenterLoc.y);

        return this.ingameMap.getTileAt(this.interactTileX, this.interactTileY, true, 1);
    }

    // 사각형 영역안에 특정 위치의 점이 포함되는지 확인
    isPointInRect(point, rect) {
        return point.x >= rect.x && point.x <= rect.x + rect.width &&
            point.y >= rect.y && point.y <= rect.y + rect.height;
    }

    // 타일이 경작가능 영역(오브젝트 레이어) 안에 포함되는지 확인한다

    isTileInPlantable(tile) {
        // 타일의 중심 좌표 layerScale 곱하기
        let tileWorldX = tile.getCenterX();
        let tileWorldY = tile.getCenterY();
        let point = { x: tileWorldX, y: tileWorldY };

        //console.log("point", point);

        for (let i = 0; i < this.plantableLayer.length; i++) {
            let obj = this.plantableLayer[i];
            if (obj.rectangle && this.isPointInRect(point, obj)) {
                return true; // 타일이 사각형 영역 내에 있음
            }
        }
        return false; // 타일이 사각형 영역 내에 없음.

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

    // 서버로부터 로그인한 유저의 아이템 목록 받아오기
    async serverGetUserItem() {


        const requestURL = APIUrl + 'item/own-item/' + this.characterInfo.user_id;

        try {

            // GET 메소드에 바디를 포함할 수 없음
            const response = await fetch(requestURL, {

                // 요청 방식
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'

                },
            });

            // .json() : 받은 응답을 JSON 형식으로 변환한다.
            this.own_items = await response.json();

            // 서버로부터 받은 유저 아이템 정보들
            //console.log('유저 아이템 목록', this.own_items);

        } catch (error) {
            console.error('serverGetUserItem() Error : ', error);
        }

    }

    // 모든 아이템 정보 받아오기 아이템 배열로 받음
    async serverGetAllItem() {

        const requestURL = APIUrl + 'item/item/all';

        try {

            // GET 메소드에 바디를 포함할 수 없음
            const response = await fetch(requestURL, {

                // 요청 방식
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'

                },
            });

            // .json() : 받은 응답을 JSON 형식으로 변환한다.
            const data = await response.json();

            // 서버로부터 받은 전체 아이템 정보들
            console.log('전체 아이템 목록', data);

            // 배열을 해쉬 테이블로 변환한다.

            data.forEach((item, index) => {

                // 구조 분해 할당
                const { item_name } = item;
                // 값 추가
                this.allItems.set(item_name, item);
            });


        } catch (error) {
            console.error('serverGetAllItem() Error : ', error);
        }

    }


    // 서버에 로그인 한 유저에게 새 아이템 추가, 기존 아이템 수량 증가 요청하는 함수
    // 액세스 토큰 필요함
    async serverAddItem(item_count, item_index, addItemInfo, addItemSlot) {

        const { item_id, item_type, item_name,
            item_des, seed_time, use_level, item_price } = addItemInfo;

        const requestURL = APIUrl + 'item/add/';

        const requestBody = {
            'item_id': item_id,
            'item_count': item_count,
            'item_index': item_index
        }

        console.log("서버 아이템 추가 요청에 사용할 바디 ", requestBody);

        try {

            const response = await fetch(requestURL, {

                // 요청 방식
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    //액세스 토큰 값 보내기
                    Authorization: 'Bearer ' + this.accessToken
                },

                // 바디 필요함.
                body: JSON.stringify(requestBody)
            });

            // .text() : 받은 응답을 text 형식으로 변환한다.
            // 성공 시 결과값 'success'로 감
            const data = await response.text();

            //console.log("받은 응답 헤더의 콘텐츠 타입", response.headers.get("content-type"));

            // 요청이 성공하면 새 아이템의 추가나 중복 아이템 수량 증가 시키기
            if (data === 'success') {

                console.log('서버 아이템 추가 성공');
                console.log('아이템이 추가 되거나 수량 증가할 슬롯', addItemSlot);

                // 중복 아이템 수량 증가
                if (addItemSlot.item !== null) {
                    addItemSlot.item.count += 1;
                    addItemSlot.setSlotItem(addItemSlot.item);
                }
                // 새 아이템 추가
                else {
                    addItemSlot.setSlotItem(
                        new Item(addItemInfo, item_count));
                }

            }
            else {
                console.log('서버 아이템 추가 실패');
            }

        } catch (error) {
            console.error('serverAddItem() Error : ', error);
        }

    }

    // 서버에 로그인 한 유저의 아이템 소비 요청함.
    async serverUseItem(item_name, item_count, useItemSlot) {

        const requestURL = APIUrl + 'item/use/';

        const useItemInfo = this.allItems.get(item_name);

        const requestBody = {
            'item_id': useItemInfo.item_id,
            'item_count': item_count,
        }

        //console.log("서버 아이템 사용 요청에 사용할 바디 ", requestBody);

        try {

            const response = await fetch(requestURL, {

                // 요청 방식
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    //액세스 토큰 값 보내기
                    Authorization: 'Bearer ' + this.accessToken
                },

                // 바디 필요함.
                body: JSON.stringify(requestBody)
            });

            const data = await response.text();

            // 요청이 성공하면 클라이언트에서도 아이템 소비와 삭제
            if (data === 'use success') {
                //console.log('아이템이 소비되는 슬롯', useItemSlot);

                useItemSlot.useItem(item_count);
            }
            else {
                console.log('서버 아이템 소비 실패');
            }

        } catch (error) {
            console.error('serverUseItem() Error : ', error);
        }
    }

    // 서버에 아이템 이동 요청
    async serverMoveItem(item_name, item_index) {

        // URL에 포함시켜야함.

        const useItemInfo = this.allItems.get(item_name);

        const requestURL = APIUrl + 'item/move/' + useItemInfo.item_id + '/' + item_index;

        try {
            const response = await fetch(requestURL, {

                // 요청 방식
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    //액세스 토큰 값 보내기
                    Authorization: 'Bearer ' + this.accessToken
                },

            });

            const data = await response.text();

            // 요청이 성공했는지 확인
            if (data === 'success') {
                console.log('서버 아이템 이동 성공');
            }
            else {
                console.log('서버 아이템 이동 실패');
            }

        } catch (error) {
            console.error('serverMoveItem() Error : ', error);
        }
    }

    // 서버에 맵 데이터 추가 및 수정 요청
    async serverAddMap() {
        const requestURL = APIUrl + 'map/';

        console.log("서버에 맵 데이터 추가 및 수정 요청");

        try {

            const response = await fetch(requestURL, {

                // 요청 방식
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + this.accessToken
                },

                body: JSON.stringify(this.mapData)
            });



            //console.log("mapData 객체 JSON화", JSON.stringify(this.mapData) );

            // .json() : 받은 응답을 JSON 형식으로 변환한다.
            const data = await response.json();

            // 서버로부터 받은 유저 아이템 정보들
            //console.log('응답받은 맵 정보', data);

        } catch (error) {
            console.error('serverAddMap() Error : ', error);
        }
    }

    // 로그인 한 유저의 맵 데이터 불러오기
    async serverGetMap() {

        const requestURL = APIUrl + 'map/' + this.characterInfo.asset_id;

        try {

            const response = await fetch(requestURL, {

                // 요청 방식
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },

            });

            //console.log("mapData 객체 JSON화", JSON.stringify(this.mapData) );



            // .json() : 받은 응답을 JSON 형식으로 변환한다.
            const data = await response.json();

            console.log("serverGetMap() response 확인".response);



            // 서버로부터 받은 유저 아이템 정보들
            //console.log('받은 맵 정보', data);

            // data -> mapData에 저장하기
            data.objects.forEach((object, index) => {
                this.mapData.objects.push(object);
            });

            data.crops.forEach((crop, index) => {
                this.mapData.crops.push(crop);
            });

            // 서버에 맵 데이터 보낼 때 
            // objects랑 crops만 포함시켜야됨.

            console.log('받은 맵 정보를 this.mapData에 저장', this.mapData);

            // 받은 맵 데이터를 기반으로 밭 타일 생성
            // 나중에 게임 오브젝트(농작물)도 생성할 예정
            // initGameMap()


            this.mapData.objects.forEach((object, index) => {
                const tileX = object.tileX;
                const tileY = object.tileY;
                const ingameMap = this.ingameMap;

                // 서버에 저장된 타일의 타입에 따라 사용할 타일셋 변경
                let layer0Tile = ingameMap.putTileAt(68, tileX, tileY, true, 0);
                let layer1Tile = null;
                let layer2Tile = ingameMap.putTileAt(-1, tileX, tileY, true, 2);

                // 여기서 object.type에 따라 타일 변경
                switch (object.type) {

                    case 'field':
                        layer1Tile = ingameMap.putTileAt(819, tileX, tileY, true, 1);
                        // 경작 가능한 타일
                        layer1Tile.properties.plantable = true;
                        break;

                    // 농작물 수확해서 구멍난 밭타일
                    case 'perforated field':
                        layer1Tile = ingameMap.putTileAt(1139, tileX, tileY, true, 1);
                        // 경작 불가능한 타일
                        layer1Tile.properties.plantable = false;
                        break;

                }

                // 변경한 레이어의 타일들을 배열에 넣음
                let tiles = [];
                tiles.push(layer0Tile, layer1Tile, layer2Tile);

                // 각 레이어의 타일의 회전 제거
                tiles.forEach((tile) => {

                    if (tile) {
                        tile.rotation = 0;
                        // 타일의 X축, Y축 반전 제거
                        tile.flipX = false;
                        tile.flipY = false;
                    }
                });

            });

            // 서버에서 로드한 농작물 정보 기반으로 농작물 오브젝트 생성
            this.mapData.crops.forEach((crop, index) => {
                const cropX = crop.x;
                const cropY = crop.y;
                const cropName = crop.name;

                // plantTime string -> date로 변경
                crop.plantTime = new Date(crop.plantTime);

                const plantTime = crop.plantTime;
                const growTime = crop.growTime;

                // 인게임에서 농작물 옵젝 생성
                const crops = new Crops(this, cropX, cropY, cropName, plantTime, growTime, true);
                this.crops.push(crops);


                // getTileAt()에 픽셀 위치가 아니라 타일 위치를 넣어야 함.
                // 타일 유닛 위치 구하기
                const plantTileX = this.ingameMap.worldToTileX(crops.x);
                const plantTileY = this.ingameMap.worldToTileY(crops.y);

                // plantTile 구하기
                const plantTile = this.ingameMap.getTileAt(plantTileX, plantTileY, true, 1);
                // 농작물의 x,y 위치 아니까 농작물이 속한 타일 위치도 알 수 있다.
                this.setCropsOverlap(crops, plantTile);

                //console.log('plantTile', plantTile);

                // 씨앗을 심었으니 재배 불가능한 타일로 변경한다
                plantTile.properties.plantable = false
                // 타일에 농작물이 있다고 알림
                plantTile.properties.crops = true;
            });

            //console.log("string -> Date mapDate 확인", this.mapData.crops);
            //console.log("string -> Date serverCrops 확인", this.serverCrops);

        } catch (error) {
            console.error('serverGetMap() Error : ', error);
        }

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