import Phaser from 'phaser'
import PlayerObject from '../characters/player_object'
import Crops from '../elements/crops';
import Inventory from '../ui/inventory';
import QuickSlot from '../ui/quickslot';
import Auction from '../ui/auction';
import ObjectToolTip from '../ui/object_tooltip';
import UIVisibleBtn from '../ui/button/UIVisibleBtn';
import Tree from '../elements/tree';
import AssetManager from './asset_manager';
import SelectBox from '../ui/select_box';
import NetworkManager from './network_manager';
import SeedStoreNPC from '../npc/seed_store_npc';
import SeedStoreUI from '../ui/seed_store/seed_store_ui';
import FirePitNPC from '../npc/fire_pit_npc';
import FirePitUI from '../ui/fire_pit/fire_pit_ui';
import CharacterInfo from '../ui/character_info';

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
    accessToken = "";
    auction;

    // 플레이어가 상호작용할 타일의 인덱스
    interactTileIndexTxt;
    // 게임 캐릭터의 정보 - 캐릭터 외형, 레벨, 소지금등을 포함한다.
    characterInfo;
    // 현재 장착중인 도구 슬롯 번호 - 기본값 0
    equipNumber = 0;

    goldText;
    // 인 게임에 사용할 농장 타일맵 
    ingameMap;

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
    own_items = [];

    // 전체 아이템 정보 해쉬 테이블
    allItemMap = new Map();
    // 전체 아이템 정보 목록
    allItemList = [];

    // 경작 가능 영역 표시하는 오브젝트 레이어
    plantableLayer;

    // 타일맵 데이터 저장
    objects = [];
    // 농작물 오브젝트 저장
    crops = [];
    // 나무 오브젝트들 저장
    trees = [];

    // 서버에 저장할 농작물 오브젝트 배열
    // 농작물 옵젝을 그냥 저장하면 불필요한 데이터들이 너무 많음
    // x, y, name, plantTime, growSec <- 저장
    serverCrops = [];

    // 서버에 저장할 나무 오브젝트 배열
    // x, y, logginTime <- 저장
    serverTrees = [];

    // 서버에 저장할 맵 데이터 객체
    mapData = {
        objects: this.objects,
        crops: this.serverCrops,
        trees: this.serverTrees,
        rocks: [],
        buildings: []
    }

    // 오브젝트 정보 툴팁
    objectToolTip;

    // UI visible 토글 버튼
    uiVisibleBtn;

    assetManager;
    networkManager;

    seedStoreNPC;
    seedStoreUI;
    firePitNPC;

    // 캐릭터 정보창 UI 참조
    charInfoUI;

    // 요리 레시피들
    cookRecipes = [
        { name: '으깬 감자', ingredients: [{ name: '감자', quantity: 2 }] },
        { name: '호박 수프', ingredients: [{ name: '호박', quantity: 2 }] },
        { name: '브로쓰', ingredients: [{ name: '당근', quantity: 1 }, { name: '양배추', quantity: 1 }] },
        { name: '케일 스튜', ingredients: [{ name: '케일', quantity: 2 }] },
        { name: '야채 구이', ingredients: [{ name: '무', quantity: 1 }, { name: '당근', quantity: 1 }] },
        { name: '샐러드', ingredients: [{ name: '사탕무', quantity: 1 }, { name: '양배추', quantity: 1 }] },
        { name: '채식 버거', ingredients: [{ name: '밀', quantity: 1 }, { name: '양배추', quantity: 1 }] },
        { name: '샌드위치', ingredients: [{ name: '케일', quantity: 1 }, { name: '밀', quantity: 1 }] },
    ];

    // 생성자가 왜 있지? 씬 등록하는 건가?
    constructor() {
        super('InGameScene');

        //console.log("블록체인 노드 주소", process.env.REACT_APP_NODE);
    }

    // 씬이 시작될 때 가장 먼저 실행되는 메서드이다.
    // 씬의 초기화를 담당하며, 씬이 시작하기 전에 필요한 설정이나 변수의 초기화등을 수행하는데 사용된다.
    // 씬으로 전달되는 데이터를 받을 수 있는 유일한 곳
    init(characterInfo) {

        // 로그인 씬으로부터 파라미터를 전달 받는다.
        console.log("인게임 씬을 시작하며 전달받은 데이터", characterInfo);

        this.characterInfo = characterInfo;

        if (this.characterInfo.user_id) {
            console.log('로그인 하고 테스트');

            // 액세스 토큰 로컬 스토리지에서 받아오기
            this.accessToken = localStorage.getItem('accessToken');

        } else { // 로그인하지 않고 테스트
            console.log('로그인 안하고 테스트');

            this.characterInfo = {
                user_id: 1,
                user_name: 'park',
                exp: 10,
                level: 1,
                cft: 1000,
                asset_id: 4563456
            }
            // 하드코딩된 액세스 토큰 값 넣어주면 된다.
            this.accessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX25hbWUiOiJ0ZXN0IiwiYXNzZXRfaWQiOiI0NTYzNDU2IiwiaWF0IjoxNzA5MTA5MTQxLCJleHAiOjE3MDkxNDUxNDF9.fkeJnzZaZXAppkj9FZCURE0q4WQv36UOVyTbgi7AxjM';
        }

        this.assetManager = new AssetManager(this);
        this.networkManager = new NetworkManager(this);

        // 모든 아이템 정보 목록 요청
        this.networkManager.serverGetAllItem().then(data => {
            // 받은 아이템 배열을 해쉬 테이블로 변환
            data.forEach((item, index) => {
                // 구조 분해 할당
                const { item_name } = item;
                // 값 추가
                this.allItemMap.set(item_name, item);
            });

            // 받은 배열 저장
            this.allItemList = data;
            //console.log('allItemList 확인',this.allItemList);
        });

    }

    // 애셋 로드
    preload() {
        const assetManager = this.assetManager;

        // 게임에 필요한 스프라이트 전부 로드
        assetManager.loadAllSprites();

        // 타일맵 JSON 파일 로드
        this.load.path = 'assets/maps/'
        this.load.tilemapTiledJSON('ingame_tilemap', 'ingame/Crypto_Farm_InGame.json');

        // 게임에 필요한 이미지 전부 로드
        assetManager.loadAllImage();
    }

    create() {

        // 게임 화면의 가로, 세로 중앙 좌표
        const centerX = this.cameras.main.centerX;
        const centerY = this.cameras.main.centerY;

        // 게임 화면의 가로, 세로 좌표
        const rightX = this.cameras.main.width;
        const bottomY = this.cameras.main.height;

        const assetManager = this.assetManager;

        // 캐릭터 애니메이션 정보 객체 생성
        assetManager.createAnimData();
        // 씬에서 사용할 캐릭터 애니메이션 생성
        assetManager.characterAnims.forEach(animData => assetManager.createAnimation(animData));

        // 플레이어 캐릭터 오브젝트 씬에 생성
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

        // 플레이어 캐릭터의 중앙값 구하기
        // 컨테이너의 현재 위치 값에서 컨테이너의 실제 길이, 높이 값의 절반을 더하면 됨.
        const playerCenterX = this.playerObject.x + (this.playerObject.body.width / 2);
        const playerCenterY = this.playerObject.y + (this.playerObject.body.height / 2);


        //옥션 UI 생성
        //크기
        const auctionWidth = 1400;
        const auctionHeight = 800;

        // 옥션의 위치    
        const autionX = this.cameras.main.width / 2 - auctionWidth / 2;
        const autionY = this.cameras.main.height / 2 - auctionHeight / 2;
        this.auction = new Auction(this, autionX, autionY, auctionWidth, auctionHeight);

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
        this.inventory = new Inventory(this, invenX, invenY, invenWidth, invenHeight);
        this.inventory.disable();

        // 서버에 로그인 한 유저의 아이템 목록 요청
        // async 함수에서 반환하는 값은 항상 'Promise' 객체로 감싸져 있음.
        // Promise 객체에서 원하는 값을 빼올려면 then() 이나 다른 async 함수내에서 await 사용 해야 한다.
        this.networkManager.serverGetUserItem(this.characterInfo.user_id).then(data => {
            this.own_items = data;

            // 퀵슬롯, 인벤 유저 소유 아이템 표시하게 초기화
            this.quickSlotUI.initQuick(this.own_items);
            this.inventory.initInventory(this.own_items);

            // 씨앗 상점 소유 아이템 개수 표시
            // 기본 탭 : 판매
            this.seedStoreUI.tabBody.switchTabs(0);

            /* this.seedStoreUI.state = 'sale'; 판매 탭 버튼 활성화 코드
            this.seedStoreUI.purchaseTab.setImgVisible(false);
            this.seedStoreUI.saleTab.setImgVisible(true);
            this.seedStoreUI.tabBody.switchTabs(1); */
        });

        // 게임 오브젝트들(농작물, 나무) 정보 툴팁
        this.objectToolTip = new ObjectToolTip(this, 0, 0, 150, 100);
        this.objectToolTip.setVisible(false);
        const btnWidth = 60;
        const btnHeight = 60;
        const btnPad = 10;
        const btnX = this.cameras.main.width - btnWidth - btnPad;
        const btnY = this.cameras.main.height - btnHeight - btnPad;
        // 특정 UI 보이기 토글 버튼 추가
        this.uiVisibleBtn = new UIVisibleBtn(this, btnX, btnY, btnWidth, btnHeight);

        const debugGraphics = [];

        // 씨앗 상점 npc 추가 원래 위치 16 x 8
        this.seedStoreNPC = new SeedStoreNPC(this, tileSize * 16, tileSize * 2);

        // 씨앗 상점 UI 생성
        // 크기
        const seedStoreWidth = 650;
        const seedStoreHeight = 500;

        // 위치
        const seedStoreX = this.cameras.main.width / 2 - seedStoreWidth / 2;
        const seedStoreY = this.cameras.main.height / 2 - seedStoreHeight / 2;
        this.seedStoreUI = new SeedStoreUI(this, seedStoreX, seedStoreY, seedStoreWidth, seedStoreHeight);
        this.seedStoreUI.disable();

        // 화덕(요리) NPC 추가
        this.firePitNPC = new FirePitNPC(this, tileSize * 8, tileSize * 3);

        // 화덕 UI 생성
        // 크기
        const firePitWidth = 650;
        const firePitHeight = 500;
        // 위치
        const firePitX = this.cameras.main.width / 2 - firePitWidth / 2;
        const firePitY = this.cameras.main.height / 2 - firePitHeight / 2;
        this.FirePitUI = new FirePitUI(this, firePitX, firePitY, firePitWidth, firePitHeight);
        this.FirePitUI.disable();

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
            // 이 방법을 쓰면 레이어 이름을 일일히 지정할 필요가 없이 레이어 인덱스 값을 넣으면 됨
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
        this.networkManager.serverGetMap(this.characterInfo.asset_id).then(data => {

            // 처음 접속하면 계정이면 data가 null일 거임
            // 그럼 기본맵 사용하게 변경한다.



            // 맵 데이터 초기화
            this.initMapData(data);
            // 맵 데이터 배열 기반으로 게임 맵 초기화
            this.initGameMap();
        });

        // 맵 초기화 하고 싶으면 호출
        //this.networkManager.serverAddMap(this.mapData);;


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


        /* this.trees.push(new Tree(this, tileSize * 15, tileSize * 5, new Date('2024-02-01T12:05:41.652Z')));
        // 2024-02-01T10:47:41.652Z
        // 벌목 시간이 기록된 나무 오브젝트 추가
        this.trees.push(new Tree(this, tileSize * 18, tileSize * 5, new Date('2024-02-01T10:47:41.652Z')));
        this.trees.push(new Tree(this, tileSize * 21, tileSize * 5, new Date('2024-02-01T10:47:41.652Z')));
        // 컨테이너끼리 충돌 효과는 안된다고 한다.
        this.physics.add.collider(this.playerObject, this.trees); */

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

        // 캐릭터가 상호작용할 타일을 표시하는 selectBox 오브젝트 추가
        this.interTileMarker = new SelectBox(this, 550, 550, tileSize, tileSize);


        // 캐릭터 정보창 추가
        this.charInfoUI = new CharacterInfo(this, 10, 10, 250, 100, this.characterInfo);

        // 캐릭터 정보창 프로토타입

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

        this.trees.forEach((tree, index) => {
            tree.update(delta);
        });

        this.objectToolTip.update(delta);

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

                //console.log("compareServerCrops", compareServerCrops);

                //console.log("filter 전 this.serverCrops", this.serverCrops);
                // this.serverCrops에서도 참조 제거
                // x, y 값이 일치하는 요소만 뺀 배열을 반환
                this.serverCrops = this.serverCrops.filter(serverCrop =>
                    !(compareServerCrops.x === serverCrop.x &&
                        compareServerCrops.y === serverCrop.y));

                //console.log("filter 후 this.serverCrops", this.serverCrops);


                // mapData 객체 내부의 배열 참조를 바꿀려면
                // 직접 객체의 배열 속성을 수정해야 한다.
                this.mapData.crops = this.serverCrops;
                //console.log("current Map Data", this.mapData);

                // 농작물을 수확하여 옵젝이 제거되었고
                // 밭 타일에 구멍이 났으니 맵 변경 사항 저장 요청
                this.networkManager.serverAddMap(this.mapData);

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
    addCrops(seedName, plantTile) {

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
        const seedItem = this.allItemMap.get(seedName);

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
        this.networkManager.serverAddMap(this.mapData);;
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
                    this.networkManager.serverAddMap(this.mapData);;
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
            this.networkManager.serverAddMap(this.mapData);;
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
                    //console.log("인벤토리에 빈 공간이 없음.");

                    // 퀵슬롯에서 빈 공간 찾기
                    addItemSlot = this.quickSlotUI.findEmptySlot();

                } else {
                    //console.log("인벤토리에 빈 공간이 있음.");
                }
            }
        }

        return addItemSlot;

    }

    // 아이템 이름으로 아이템 추가 요청할 때 필요한 데이터 모아서 
    // 네트워크 매니저에게 서버에 아이템 추가 요청해달라고 하기.
    sendAddItem(itemName, addItemSlot) {
        // 추가될 아이템 정보 객체
        const addItemInfo = this.allItemMap.get(itemName);

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

        console.log('추가될 아이템 정보 객체와 인덱스', addItemInfo, item_index);

        this.networkManager.serverAddItem(1, item_index, addItemInfo, addItemSlot);
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

    // 서버로부터 받은 맵 데이터를 씬의 mapData 변수로 초기화
    initMapData(data) {

        // data가 null인지 확인하는 로직 필요함
        if (data) {

            // data -> mapData에 저장하기
            data.objects.forEach((object, index) => {
                this.mapData.objects.push(object);
            });
            data.crops.forEach((crop, index) => {
                this.mapData.crops.push(crop);
            });
            data.trees.forEach((tree, index) => {
                this.mapData.trees.push(tree);
            });

        }
        if (this.mapData.trees.length === 0) {
            console.log('맵 데이터의 트리 배열이 비어있어 기본 값 초기화');
            // 나무 오브젝트는 맵에 기본으로 생성되어야 함.
            this.serverTrees.push({ x: tileSize * 15, y: tileSize * 5, loggingTime: null });
            this.serverTrees.push({ x: tileSize * 18, y: tileSize * 5, loggingTime: null });
            this.serverTrees.push({ x: tileSize * 21, y: tileSize * 5, loggingTime: null });
        }
        console.log('받은 맵 정보를 this.mapData에 저장', this.mapData);

    }

    // 서버로 받은 mapData 기반으로 밭 타일, 게임 오브젝트(농작물, 나무) 생성해서
    // 게임 맵 초기화
    initGameMap() {

        // 밭 타일 생성
        this.mapData.objects.forEach((object, index) => {
            const tileX = object.tileX;
            const tileY = object.tileY;
            const ingameMap = this.ingameMap;

            // 서버에 저장된 타일의 타입에 따라 사용할 타일셋 변경
            let layer0Tile = ingameMap.putTileAt(68, tileX, tileY, true, 0);
            let layer1Tile = null;
            let layer2Tile = ingameMap.putTileAt(-1, tileX, tileY, true, 2);

            // 여기서 object.type에 따라 사용할 타일 변경
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

        // 농작물 오브젝트 생성
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

        // 나무 생성하기
        this.mapData.trees.forEach((tree, index) => {

            const treeX = tree.x;
            const treeY = tree.y;
            let loggingTime = tree.loggingTime;
            // loggingTime이 존재하면 string -> Date로 변환환다
            if (loggingTime !== null) {
                loggingTime = new Date(tree.loggingTime);
            }

            this.trees.push(new Tree(this, treeX, treeY, loggingTime, true));
        });

        //console.log("string -> Date mapDate 확인", this.mapData.crops);
        //console.log("string -> Date serverCrops 확인", this.serverCrops);
    }

}