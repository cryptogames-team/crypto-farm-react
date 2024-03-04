import Phaser from 'phaser'
import PlayerObject from '../characters/player_object'
import RemotePlayer from '../characters/remote_player_object';
import ItemSlot from '../ui/item_slot';
import Crops from '../elements/crops';
import Item from '../elements/item';
import Inventory from '../ui/inventory';
import Auction from '../ui/auction/auction';
import {io} from 'socket.io-client'
import Chat from '../ui/chat/chatInput';
import Market from '../ui/heptaMarket/market';



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

export default class MarketScene extends Phaser.Scene {


    APIurl = process.env.REACT_APP_API;
    accessToken
    auction;
    socket;
    // 플레이어가 상호작용할 타일의 인덱스
    interactTileIndexTxt;
    // 게임 캐릭터의 정보 - 캐릭터 외형, 레벨, 소지금등을 포함한다.
    characterInfo;
    // 현재 장착중인 도구 슬롯 번호 - 기본값 0
    equipNumber = 0;
    playerObject
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
    market

    // 생성자가 왜 있지? 씬 등록하는 건가?
    constructor() {
        super('MarketScene');

    }

    // 씬이 시작될 때 가장 먼저 실행되는 메서드이다.
    // 씬의 초기화를 담당하며, 씬이 시작하기 전에 필요한 설정이나 변수의 초기화등을 수행하는데 사용된다.
    // 씬으로 전달되는 데이터를 받을 수 있는 유일한 곳
    init(characterInfo) {

        // 로그인 씬으로부터 파라미터를 전달 받는다.
        console.log("마켓 씬을 시작하며 전달받은 데이터", characterInfo)
        this.characterInfo = characterInfo;
        this.accessToken=localStorage.getItem('accessToken')
        // 스프라이트 로더 인스턴스 생성       
        this.spriteLoader = new SpriteLoader(this);


        /*
        this.characterInfo = {
            user_id: 2,
            asset_name: '7',
            user_name: 'y1',
            exp: 1000,
            level: 1,
            cft: 5000000
        }
        */
        const rand_1_6 = Math.floor(Math.random() * 6) + 1;


        //메타버스 테스트를 위한 코드        
        /*
        switch (rand_1_6) {
            case 1:
                this.characterInfo.user_name = 'park'
                this.characterInfo.asset_name = '9763734532'
                break;
            case 2:
                this.characterInfo.user_name = 'test2'
                this.characterInfo.asset_name = '665556'
                break;
            case 3:
                this.characterInfo.user_name = 'test3'
                this.characterInfo.asset_name = '56666'
                break;
            case 4:
                this.characterInfo.user_name = 'test4'
                this.characterInfo.asset_name = '57777'
                break;
            case 5:
                this.characterInfo.user_name = 'test5'
                this.characterInfo.asset_name = '7777'
                break;
            case 6:
                this.characterInfo.user_name = 'test'
                this.characterInfo.asset_name = '4563456'
                break;
        }
        */
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
        this.load.path = "assets/Maps/";
        this.load.image('sunnysideworld_tiles', 'spr_tileset_sunnysideworld_16px.png');
        this.load.image('cow_tiles', 'spr_deco_cow_strip4.png');
    }

    create() {
        this.beforePositionX = 0
        this.beforePositionY = 0
        this.playerObject = new PlayerObject(this, 1250, 1750);
        this.socket = io(process.env.REACT_APP_API + 'metaverse');
        var user_info = {
            user_name: this.characterInfo.user_name,
            asset_name: this.characterInfo.asset_name,
            x: 0,
            y: 0
        }
        // 해시 맵처럼 동작하는 객체 생성
        this.remotePlayers = [];
        // 키-값 쌍 추가

        //캐릭터의 위치가 바뀐다면 0.2초 주기로 서버로 위치값 보냄
        const intervalId = setInterval(() => {
            if ((this.beforePositionX != this.playerObject.x) || (this.beforePositionY != this.playerObject.y)) {
                //console.log("이동함")
                this.beforePositionX = this.playerObject.x
                this.beforePositionY = this.playerObject.y
                user_info.x = this.playerObject.x
                user_info.y = this.playerObject.y
                this.socket.emit('move', user_info);
            } else {
                //console.log("이동안함")
            }
        }, 200);

        this.socket.on('connect', () => {
            this.socket.emit('join', user_info);;
        });
        this.socket.on('disconnect', () => {
            this.socket.emit('exit', user_info);;
        });
        this.socket.on('move', (data) => {
            if (data.user_name != this.characterInfo.user_name) {
                for (let i = 0; i < this.remotePlayers.length; i++) {
                    if (this.remotePlayers[i].name == data.user_name) {
                        console.log(this.remotePlayers[i].name + " moved to x: " + data.x + "y : " + data.y)
                        this.remotePlayers[i].move(data.x, data.y)
                        break;
                    }
                }
            }
        })
        //유저가 들어왔을때
        this.socket.on('joinRoom', (data) => {
            if (data.user_name != this.characterInfo.user_name) {
                let remotePlayer = new RemotePlayer(this, 1230, 1820, data.user_name)
                this.remotePlayers.push(remotePlayer);
            }
        })
        //방처음 들어왔을때 user리스트 받음 
        this.socket.on('getUsers', (data) => {
            if(data==!null)
            {
                for (let i = 0; i < data.length; i++) {
                    let remotePlayer = new RemotePlayer(this, data[i].x, data[i].y, data[i].user_name)
                    this.remotePlayers.push(remotePlayer);
                }
            }
            
        })
        //채팅 기록 불러옴 50개까지
        this.socket.on('getChat', (data) => {
            this.chatUI.getChat(data)
        })
        //유저나갔을때 캐릭터 지워줌
        this.socket.on('exitRoom', (data) => {
            console.log('exitRoom')
            console.log(data)
            if (data != this.characterInfo.user_name) {
                for (let i = 0; i < this.remotePlayers.length; i++) {
                    if (this.remotePlayers[i].name == data) {
                        this.removeCharacter = this.remotePlayers[i]
                        this.remotePlayers.splice(i, 1);
                        this.removeCharacter.destroy()
                        break;
                    }
                }
            }
        })
        //채팅
        this.socket.on('chat', (data) => {
            var resultArray = data.split(':')
            var name = resultArray[0].trim()
            var content = resultArray[1].trim()
 
            //채팅한 유저의 캐릭터를 찾고 머리위에 말풍선 띄워줌
            if (data != this.characterInfo.user_name) {
                for (let i = 0; i < this.remotePlayers.length; i++) {
                    if (this.remotePlayers[i].name == name) {
                        this.remotePlayers[i].chatContentBox.NewChat(content)
                        this.chatUI.NewChat(data)
                        break;
                    }
                }
            }
        })


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





        // 플레이어 캐릭터 오브젝트 씬에 생성
        // 플레이어는 현재 컨테이너 클래스로 이뤄져 있음.
        // 컨테이너 클래스의 오리진은 변경이 불가능하다.


        // 플레이어 캐릭터 디버그 표시 해제
        this.playerObject.body.debugShowBody = false;
        this.playerObject.body.debugShowVelocity = false;

        // 플레이어가 상호작용할 타일 안에 있는 농작물을 검색하는 물리 객체
        // 스프라이트 키에 null 넣으면 이미지가 표시되지 않음.
        this.searchArea = this.physics.add.sprite(500, 500, null);
        this.searchArea.setDisplaySize(tileSize, tileSize).setOrigin(0, 0);
        this.searchArea.body.debugShowBody = false;

        // setSize() 하니까 갑자기 물리 바디 오리진이 0,0에서 0.5, 0.5가 됨.


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
        this.auction = new Auction(this, autionX, autionY,
            auctionWidth, auctionHeight);

        this.auction.setVisible(false);



        //마켓 UI 생성
        //크기
        const marketWidth = 1000;
        const marketHeight = 600;

 
        const marketX = this.cameras.main.width / 2 - marketWidth / 2;
        const marketY = this.cameras.main.height / 2 - marketHeight / 2;
        this.market = new Market(this, marketX, marketY,
            marketWidth, marketHeight);

        this.market.setVisible(false);



        const debugGraphics = [];

        // 타일 맵 생성
        // 타일 맵 정보를 담은 Json 로드할 때 설정한 키값과 맞춰야 한다.
        this.ingameMap = this.make.tilemap({ key: 'Market' });
        // 현재 사용중인 타일셋 이미지를 추가
        // 타일셋 오브젝트를 리턴한다.
        console.log("this.ingameMap : " + this.ingameMap)
        const sunnysideworld_tileset = this.ingameMap.addTilesetImage('spr_tileset_sunnysideworld_16px', 'sunnysideworld_tiles');

        console.log("sunnysideworld_tileset : " + sunnysideworld_tileset)
        // 소 타일셋 이미지
        //const cow_tileset = this.ingameMap.addTilesetImage('spr_deco_cow_strip4', 'cow_tiles');


        // 제일 밑에 있는 레이어를 가장 먼저 생성한다.
        for (let i = 0; i < this.ingameMap.layers.length; i++) {
            // 이 방법을 쓰면 레이어 이름을 일일히 지정할 필요가 없음.
            // 레이어 인덱스 값을 넣어도 됨.
            const layer = this.ingameMap.createLayer(i, sunnysideworld_tileset, 0, 0);
            // 레이어 깊이 설정. 깊이 값은 레이어 간의 시각적 순서를 결정한다.
            // 낮은 깊이를 가진 레이어가 뒤에 배치되고, 높은 깊이를 가진 레이어가 앞에 배치된다.
            layer.setDepth(i*0.1);
            // 레이어 스케일 설정
            layer.scale = layerScale;
            // 현재 맵 크기 설정
            currentMapWidth = layer.displayWidth;
            currentMapHeight = layer.displayHeight;


            this.physics.add.collider(this.playerObject, layer);

        }



        // 오브젝트 레이어 디버그 그래픽 설정
        const objectGraphics = this.add.graphics({
            fillStyle: { color: 0x0000ff }, lineStyle: { color: 0x0000ff }
        }).setDepth(1000);



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


        //]키 경매장 UI오픈
        this.closeBracketKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.CLOSED_BRACKET);

        //[키 메소마켓 UI오픈
        this.openBracketKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.OPEN_BRACKET);

        // 'C' 키 입력 이벤트 리스너
        toggleDebugKey.on('down', function () {
            // 디버그 그래픽 표시 상태 토글
            debugGraphics.forEach((debugGraphic) => {
                debugGraphic.visible = !debugGraphic.visible;
            });

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



        this.chatUI = new Chat(this)
        this.chatUI.setPosition(this.cameras.main.width / 2 + 50, this.cameras.main.height - 50)
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

        //]키 눌렀는지 체크 경매장 UI열어줌.
        if (this.closeBracketKey.isDown) {
            this.auction.enable();
        }


        //[키 눌렀는지 체크 Hep마켓 UI열어줌.
        if (this.openBracketKey.isDown) {
            this.market.enable();
        }

        //원래맵이동
        if (this.playerObject.x > 1150 && this.playerObject.x < 1320 && this.playerObject.y > 1830) {
            this.scene.switch('InGameScene', this.characterInfo);
            this.playerObject.y = 1820
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