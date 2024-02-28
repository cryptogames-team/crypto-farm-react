
export default class AssetManager {

    scene;

    hairPath;

    characterSprites;
    treeSprites;
    npcSprites;

    cropsImages;
    uiImages;
    nineSliceBoxImages;
    buildingImages;
    foodImages;

    // 캐릭터 애니메이션 생성에 필요한 정보 담은 객체 배열
    characterAnims;

    // 페이저 씬 객체를 생성자에서 받는다.
    constructor(scene) {
        this.scene = scene;

        // 헤어 애셋 경로 객체
        this.hairPath = {
            idle: "IDLE/",
            walk: "WALKING/",
            run: "RUN/",
            dig: "DIG/",
            axe: "AXE/",
            water: "WATERING/",
            mine: "MINING/",
            do: 'DOING/'
        };

        // base는 빡빡이라서 헤어 스프라이트가 필요 없음
        if (this.scene.characterInfo.name === 'long hair') {
            this.hairPath.idle += 'longhair_idle_strip9.png';
            this.hairPath.walk += 'longhair_walk_strip8.png';
            this.hairPath.run += 'longhair_run_strip8.png';
            this.hairPath.dig += 'longhair_dig_strip13.png';
            this.hairPath.axe += 'longhair_axe_strip10.png';
            this.hairPath.water += 'longhair_watering_strip5.png';
            this.hairPath.mine += 'longhair_mining_strip10.png';
            this.hairPath.do += 'longhair_doing_strip8.png';
        } else if (this.scene.characterInfo.name === 'curly') {
            this.hairPath.idle += 'curlyhair_idle_strip9.png';
            this.hairPath.walk += 'curlyhair_walk_strip8.png';
            this.hairPath.run += 'curlyhair_run_strip8.png';
            this.hairPath.dig += 'curlyhair_dig_strip13.png';
            this.hairPath.axe += 'curlyhair_axe_strip10.png';
            this.hairPath.water += 'curlyhair_watering_strip5.png';
            this.hairPath.mine += 'curlyhair_mining_strip10.png';
            this.hairPath.do += 'curlyhair_doing_strip8.png';
        }
        // 로그인 안하고 인 게임 기능 구현할 때 바가지 머리 캐릭터 사용
        else if (this.scene.characterInfo.name === 'bow' || this.scene.characterInfo.name === undefined) {
            this.hairPath.idle += 'bowlhair_idle_strip9.png';
            this.hairPath.walk += 'bowlhair_walk_strip8.png';
            this.hairPath.run += 'bowlhair_run_strip8.png';
            this.hairPath.dig += 'bowlhair_dig_strip13.png';
            this.hairPath.axe += 'bowlhair_axe_strip10.png';
            this.hairPath.water += 'bowlhair_watering_strip5.png';
            this.hairPath.mine += 'bowlhair_mining_strip10.png';
            this.hairPath.do += 'bowlhair_doing_strip8.png';
        }

        // 스프라이트 시트의 frameWidth 96, frameHeigth 64
        this.characterSprites = [
            // 대기 스프라이트 시트
            { name: 'player_idle_hair', path: this.hairPath.idle },
            { name: 'player_idle_body', path: 'IDLE/base_idle_strip9.png' },
            { name: 'player_idle_hand', path: 'IDLE/tools_idle_strip9.png' },
            // 걷는 스프라이트 시트
            { name: 'player_walk_hair', path: this.hairPath.walk },
            { name: 'player_walk_body', path: 'WALKING/base_walk_strip8.png' },
            { name: 'player_walk_hand', path: 'WALKING/tools_walk_strip8.png' },
            // 달리는 스프라이트 시트
            { name: 'player_run_hair', path: this.hairPath.run },
            { name: 'player_run_body', path: 'RUN/base_run_strip8.png' },
            { name: 'player_run_hand', path: 'RUN/tools_run_strip8.png' },
            // 땅파는 스프라이트 시트
            { name: 'player_dig_hair', path: this.hairPath.dig },
            { name: 'player_dig_body', path: 'DIG/base_dig_strip13.png' },
            { name: 'player_dig_hand', path: 'DIG/tools_dig_strip13.png' },
            // 도끼질 스프라이트 시트
            { name: 'player_axe_hair', path: this.hairPath.axe },
            { name: 'player_axe_body', path: 'AXE/base_axe_strip10.png' },
            { name: 'player_axe_hand', path: 'AXE/tools_axe_strip10.png' },
            // 물주는 스프라이트 시트
            { name: 'player_water_hair', path: this.hairPath.water },
            { name: 'player_water_body', path: 'WATERING/base_watering_strip5.png' },
            { name: 'player_water_hand', path: 'WATERING/tools_watering_strip5.png' },
            // 채굴 스프라이트 시트
            { name: 'player_mine_hair', path: this.hairPath.mine },
            { name: 'player_mine_body', path: 'MINING/base_mining_strip10.png' },
            { name: 'player_mine_hand', path: 'MINING/tools_mining_strip10.png' },
            // 행동 스프라이트 시트
            { name: 'player_do_hair', path: this.hairPath.do },
            { name: 'player_do_body', path: 'DOING/base_doing_strip8.png' },
            { name: 'player_do_hand', path: 'DOING/tools_doing_strip8.png' },

            // NPC에 사용할 캐릭터 스프라이트 시트
            {name: 'shorthair_idle', path: 'IDLE/shorthair_idle_strip9.png' },
        ];

        // NPC 스프라이트 시트
        this.npcSprites = [
            {name: 'cook', path: 'cook_idle.png', frameWidth: 14, frameHeight : 16},
        ];
        // 나무 스프라이트 로드 정보 담은 배열
        this.treeSprites = [
            { name: 'chopped', path: 'chopped_sheet.png', frameWidth: 80, frameHeight: 48 },
            { name: 'tree', path: 'shake_sheet.png', frameWidth: 64, frameHeight: 48 },
        ]

        // 농작물 관련 이미지 로드 정보 담은 배열
        this.cropsImages = [
            // 농작물 씨앗 이미지
            { name: "감자 씨앗", path: 'potato_00.png' },
            { name: "호박 씨앗", path: 'pumpkin_00.png' },
            { name: "당근 씨앗", path: 'carrot_00.png' },
            { name: "양배추 씨앗", path: 'cabbage_00.png' },
            { name: "사탕무 씨앗", path: 'beetroot_00.png' },
            { name: "무 씨앗", path: 'radish_00.png' },
            { name: "케일 씨앗", path: 'kale_00.png' },
            { name: "밀 씨앗", path: 'wheat_00.png' },
            // 농작물 밭에 심었을 때 이미지 로드
            // 감자 potato
            { name: '감자_01', path: "potato_01.png" },
            { name: '감자_02', path: "potato_02.png" },
            { name: '감자_03', path: "potato_03.png" },
            { name: '감자_04', path: "potato_04.png" },
            // 당근 carrot
            { name: '당근_01', path: "carrot_01.png" },
            { name: '당근_02', path: "carrot_02.png" },
            { name: '당근_03', path: "carrot_03.png" },
            { name: '당근_04', path: "carrot_04.png" },
            // 호박 pumpkin
            { name: '호박_01', path: "pumpkin_01.png" },
            { name: '호박_02', path: "pumpkin_02.png" },
            { name: '호박_03', path: "pumpkin_03.png" },
            { name: '호박_04', path: "pumpkin_04.png" },
            // 양배추 cabbage
            { name: '양배추_01', path: "cabbage_01.png" },
            { name: '양배추_02', path: "cabbage_02.png" },
            { name: '양배추_03', path: "cabbage_03.png" },
            { name: '양배추_04', path: "cabbage_04.png" },
            // 사탕무 beetroot
            { name: '사탕무_01', path: "beetroot_01.png" },
            { name: '사탕무_02', path: "beetroot_02.png" },
            { name: '사탕무_03', path: "beetroot_03.png" },
            { name: '사탕무_04', path: "beetroot_04.png" },
            // 무 radish
            { name: '무_01', path: "radish_01.png" },
            { name: '무_02', path: "radish_02.png" },
            { name: '무_03', path: "radish_03.png" },
            { name: '무_04', path: "radish_04.png" },
            // 케일 kale
            { name: '케일_01', path: "kale_01.png" },
            { name: '케일_02', path: "kale_02.png" },
            { name: '케일_03', path: "kale_03.png" },
            { name: '케일_04', path: "kale_04.png" },
            // 밀 wheat
            { name: '밀_01', path: "wheat_01.png" },
            { name: '밀_02', path: "wheat_02.png" },
            { name: '밀_03', path: "wheat_03.png" },
            { name: '밀_04', path: "wheat_04.png" },
            // 농작물 열매 이미지
            { name: "감자", path: 'potato_05.png' },
            { name: "호박", path: 'pumpkin_05.png' },
            { name: "당근", path: 'carrot_05.png' },
            { name: "양배추", path: 'cabbage_05.png' },
            { name: "사탕무", path: 'beetroot_05.png' },
            { name: "무", path: 'radish_05.png' },
            { name: "케일", path: 'kale_05.png' },
            { name: "밀", path: 'wheat_05.png' },
            // 자원 아이콘
            { name: "나무", path: 'wood.png' },
            { name: "바위", path: 'rock.png' },
            { name: "달걀", path: 'egg.png' },
            { name: "우유", path: 'milk.png' },
            { name: "물고기", path: 'fish.png' },
            { name: "Potato Seed", path: 'seeds_generic.png' },
            { name: "Potato", path: 'potato_05.png' },
        ];
        // UI 이미지 로드 정보 배열
        this.scene.load.path = "assets/UI/";
        this.uiImages = [
            { name: "selectbox_bl", path: 'selectbox_bl.png' },
            { name: "selectbox_br", path: 'selectbox_br.png' },
            { name: "selectbox_tl", path: 'selectbox_tl.png' },
            { name: "selectbox_tr", path: 'selectbox_tr.png' },
            //골드 아이콘
            { name: "goldIcon", path: 'goldIcon.svg' },
            { name: "searchBox", path: 'searchBox.png' },
            { name: "indicator", path: 'indicator.png' },
            { name: "next", path: 'arrow_right.png' },
            { name: "before", path: 'arrow_left.png' },
            { name: "timer", path: "stopwatch.png" },
            // 나가기 아이콘 exit_icon
            { name: "exit_icon", path: 'cancel.png' },
            // 인벤토리 아이콘
            { name: 'inven_icon', path: 'basket.png' },
            { name: "auction_exit", path: 'cancel.png' },
            // 성장 진행도 UI 바
            { name: 'greenbar00', path: 'greenbar_00.png' },
            { name: 'greenbar01', path: 'greenbar_01.png' },
            { name: 'greenbar02', path: 'greenbar_02.png' },
            { name: 'greenbar03', path: 'greenbar_03.png' },
            { name: 'greenbar04', path: 'greenbar_04.png' },
            { name: 'greenbar05', path: 'greenbar_05.png' },
            { name: 'greenbar06', path: 'greenbar_06.png' },
            // 빨강색 Ui 바
            { name: 'redbar00', path: 'redbar_00.png' },
            { name: 'redbar01', path: 'redbar_01.png' },
            { name: 'redbar02', path: 'redbar_02.png' },
            { name: 'redbar03', path: 'redbar_03.png' },
            { name: 'redbar04', path: 'redbar_04.png' },
            { name: 'redbar05', path: 'redbar_05.png' },
            { name: 'redbar06', path: 'redbar_06.png' },
            // 푸른색 ui 바
            { name: 'bluebar00', path: 'bluebar_00.png' },
            { name: 'bluebar01', path: 'bluebar_01.png' },
            { name: 'bluebar02', path: 'bluebar_02.png' },
            { name: 'bluebar03', path: 'bluebar_03.png' },
            { name: 'bluebar04', path: 'bluebar_04.png' },
            { name: 'bluebar05', path: 'bluebar_05.png' },
            //{ name :'bluebar06', path : 'bluebar_06.png'},
            // 아이템 디스크
            { name: 'itemdisc01', path: 'itemdisc_01.png' },
            // 도구 아이콘
            { name: "삽", path: 'shovel.png' },
            { name: "곡괭이", path: 'pickaxe.png' },
            { name: "도끼", path: 'axe.png' },

            // 아이콘 로드
            { name: "expIcon", path: 'expIcon.png' },
        ];
        // nine-slice 로드 - 외부 박스
        this.nineSliceBoxImages = [
            // dt frame 용
            { name: "9slice_tl", path: 'dt_box_9slice_tl.png' },
            { name: "9slice_tc", path: 'dt_box_9slice_tc.png' },
            { name: "9slice_tr", path: 'dt_box_9slice_tr.png' },
            { name: "9slice_lc", path: 'dt_box_9slice_lc.png' },
            { name: "9slice_rc", path: 'dt_box_9slice_rc.png' },
            { name: "9slice_c", path: 'dt_box_9slice_c.png' },
            { name: "9slice_bl", path: 'dt_box_9slice_bl.png' },
            { name: "9slice_bc", path: 'dt_box_9slice_bc.png' },
            { name: "9slice_br", path: 'dt_box_9slice_br.png' },
            //lt 탭메뉴 용
            { name: "tab_9slice_bc", path: 'lt_box_9slice_bc.png' },
            { name: "tab_9slice_bl", path: 'lt_box_9slice_bl.png' },
            { name: "tab_9slice_br", path: 'lt_box_9slice_br.png' },
            { name: "tab_9slice_c", path: 'lt_box_9slice_c.png' },
            { name: "tab_9slice_lc", path: 'lt_box_9slice_lc.png' },
            { name: "tab_9slice_rc", path: 'lt_box_9slice_rc.png' },
            { name: "tab_9slice_tc", path: 'lt_box_9slice_tc.png' },
            { name: "tab_9slice_tl", path: 'lt_box_9slice_tl.png' },
            { name: "tab_9slice_tr", path: 'lt_box_9slice_tr.png' },
            // 햐안색 프레임 박스
            { name: "w_9slice_tl", path: 'w_box_9slice_tl.png' },
            { name: "w_9slice_tc", path: 'w_box_9slice_tc.png' },
            { name: "w_9slice_tr", path: 'w_box_9slice_tr.png' },
            { name: "w_9slice_lc", path: 'w_box_9slice_lc.png' },
            { name: "w_9slice_rc", path: 'w_box_9slice_rc.png' },
            { name: "w_9slice_c", path: 'w_box_9slice_c.png' },
            { name: "w_9slice_bl", path: 'w_box_9slice_bl.png' },
            { name: "w_9slice_bc", path: 'w_box_9slice_bc.png' },
            { name: "w_9slice_br", path: 'w_box_9slice_br.png' },
        ];

        // 건물 이미지 로드 
        this.scene.load.path = "assets/Buildings/";
        this.buildingImages = [
            { name: '씨앗상점', path: 'market.png' },
            { name: '화덕', path: 'fire_pit.png'},
        ];

        // 음식 이미지 로드
        this.foodImages = [
            { name : '으깬 감자', path : 'mashed_potato.png'},
            { name : '호박 수프', path : 'pumpkin_soup.png'},
            { name : '브로쓰', path : 'broth.png'},
            { name : '케일 스튜', path : 'kale_stew.png'},
            { name : '야채 구이', path : 'roast_veggies.png'},
            { name : '샐러드', path : 'salad.png'},
            { name : '채식 버거', path : 'veggies_burger.png'},
            { name : '샌드위치', path : 'sandwich.png'},
        ];
    }

    loadSprite(spriteData) {

        // 선택한 캐릭터가 base(빡빡이)면 경로가 ''로 들어오니
        // 아무것도 안하면 됨.
        if (spriteData.path === '')
            return;

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

    loadAllSprites() {
        // 플레이어 캐릭터에 사용할 스프라이트 시트 로드
        this.scene.load.path = 'assets/Character/';
        this.characterSprites.forEach(spriteData => this.loadSprite(spriteData));

        // NPC 스프라이트
        this.scene.load.path = 'assets/NPCs/';
        this.npcSprites.forEach(spriteData => this.loadSprite(spriteData));

        // 나무 스프라이트 시트 로드하기
        this.scene.load.path = 'assets/Elements/Trees/';
        this.treeSprites.forEach(spriteData => this.loadSprite(spriteData));
    }

    loadImage(ImgData) {

        // 구조 분해
        const { name, path } = ImgData;

        this.scene.load.image(name, path);
    }

    loadAllImage() {

        // sunnysideworld 타일셋 PNG 파일 로드
        this.scene.load.path = "assets/maps/";
        this.scene.load.image('sunnysideworld_tiles', 'spr_tileset_sunnysideworld_16px.png');
        this.scene.load.image('cow_tiles', 'spr_deco_cow_strip4.png');

        // 나무 그루터기 이미지
        this.scene.load.path = 'assets/Elements/Trees/';
        this.scene.load.image('stump', 'stump.png');

        // UI 이미지 로드
        // selectbox.png를 로드
        this.scene.load.path = "assets/UI/";
        this.uiImages.forEach(imageData => this.loadImage(imageData));

        // nine-slice 로드 - 외부 박스
        this.scene.load.path = "assets/UI/9slice_box_white/"
        this.nineSliceBoxImages.forEach(imageData => this.loadImage(imageData));

        // 농작물 관련 이미지 로드
        this.scene.load.path = "assets/Elements/Crops/";
        this.cropsImages.forEach(imageData => this.loadImage(imageData));

        // 건물 관련 이미지 로드
        this.scene.load.path = "assets/Buildings/";
        this.buildingImages.forEach(imageData => this.loadImage(imageData));

        // 음식 관련 이미지 로드
        this.scene.load.path = "assets/food/";
        this.foodImages.forEach(imageData => this.loadImage(imageData));
    }

    // 애니메이션 정보 객체 만드는 함수
    // preload 이후에 호출하기
    createAnimData(){
        this.characterAnims = [
            // 대기 애니메이션 9 프레임
            { key: 'idle_hair', frames: this.scene.anims.generateFrameNumbers('player_idle_hair', { start: 0, end: 8 }), frameRate: 9, repeat: -1 },
            { key: 'idle_body', frames: this.scene.anims.generateFrameNumbers('player_idle_body', { start: 0, end: 8 }), frameRate: 9, repeat: -1 },
            { key: 'idle_hand', frames: this.scene.anims.generateFrameNumbers('player_idle_hand', { start: 0, end: 8 }), frameRate: 9, repeat: -1 },
            // 걷는 애니메이션 8 프레임
            { key: 'walk_hair', frames: this.scene.anims.generateFrameNumbers('player_walk_hair', { start: 0, end: 7 }), frameRate: 8, repeat: -1 },
            { key: 'walk_body', frames: this.scene.anims.generateFrameNumbers('player_walk_body', { start: 0, end: 7 }), frameRate: 8, repeat: -1 },
            { key: 'walk_hand', frames: this.scene.anims.generateFrameNumbers('player_walk_hand', { start: 0, end: 7 }), frameRate: 8, repeat: -1 },
            // 달리는 애니메이션 8 프레임
            { key: 'run_hair', frames: this.scene.anims.generateFrameNumbers('player_run_hair', { start: 0, end: 7 }), frameRate: 8, repeat: -1 },
            { key: 'run_body', frames: this.scene.anims.generateFrameNumbers('player_run_body', { start: 0, end: 7 }), frameRate: 8, repeat: -1 },
            { key: 'run_hand', frames: this.scene.anims.generateFrameNumbers('player_run_hand', { start: 0, end: 7 }), frameRate: 8, repeat: -1 },
            // 땅파는 애니메이션 13 프레임
            { key: 'dig_hair', frames: this.scene.anims.generateFrameNumbers('player_dig_hair', { start: 0, end: 12 }), frameRate: 13, repeat: 0 },
            { key: 'dig_body', frames: this.scene.anims.generateFrameNumbers('player_dig_body', { start: 0, end: 12 }), frameRate: 13, repeat: 0 },
            { key: 'dig_hand', frames: this.scene.anims.generateFrameNumbers('player_dig_hand', { start: 0, end: 12 }), frameRate: 13, repeat: 0 },
            // 도끼질 애니메이션 10 프레임
            { key: 'axe_hair', frames: this.scene.anims.generateFrameNumbers('player_axe_hair', { start: 0, end: 9 }), frameRate: 10, repeat: 0 },
            { key: 'axe_body', frames: this.scene.anims.generateFrameNumbers('player_axe_body', { start: 0, end: 9 }), frameRate: 10, repeat: 0 },
            { key: 'axe_hand', frames: this.scene.anims.generateFrameNumbers('player_axe_hand', { start: 0, end: 9 }), frameRate: 10, repeat: 0 },
            // 물주는 애니메이션 5 프레임
            { key: 'water_hair', frames: this.scene.anims.generateFrameNumbers('player_water_hair', { start: 0, end: 4 }), frameRate: 5, repeat: 0 },
            { key: 'water_body', frames: this.scene.anims.generateFrameNumbers('player_water_body', { start: 0, end: 4 }), frameRate: 5, repeat: 0 },
            { key: 'water_hand', frames: this.scene.anims.generateFrameNumbers('player_water_hand', { start: 0, end: 4 }), frameRate: 5, repeat: 0 },
            // 채굴 애니메이션 10 프레임
            { key: 'mine_hair', frames: this.scene.anims.generateFrameNumbers('player_mine_hair', { start: 0, end: 9 }), frameRate: 10, repeat: 0 },
            { key: 'mine_body', frames: this.scene.anims.generateFrameNumbers('player_mine_body', { start: 0, end: 9 }), frameRate: 10, repeat: 0 },
            { key: 'mine_hand', frames: this.scene.anims.generateFrameNumbers('player_mine_hand', { start: 0, end: 9 }), frameRate: 10, repeat: 0 },
            // 행동 애니메이션 8 프레임
            { key: 'do_hair', frames: this.scene.anims.generateFrameNumbers('player_do_hair', { start: 0, end: 7 }), frameRate: 8, repeat: 0 },
            { key: 'do_body', frames: this.scene.anims.generateFrameNumbers('player_do_body', { start: 0, end: 7 }), frameRate: 8, repeat: 0 },
            { key: 'do_hand', frames: this.scene.anims.generateFrameNumbers('player_do_hand', { start: 0, end: 7 }), frameRate: 8, repeat: 0 },

            // NPC 대기 애니메이션 9 프레임
            { key: 'npc_idle_hair', frames: this.scene.anims.generateFrameNumbers('shorthair_idle', { start: 0, end: 8 }), frameRate: 9, repeat: -1 },
            // 화덕 NPC 8 프레임
            { key: 'npc_cook_idle', frames: this.scene.anims.generateFrameNumbers('cook', { start: 0, end: 7 }), frameRate: 8, repeat: -1 },

            // 나무 흔들리는 애니메이션 7 프레임 frameRate <- 초당 프레임 재생 속도
            { key: 'tree_shake', frames: this.scene.anims.generateFrameNumbers('tree', { start: 0, end: 6 }), frameRate: 12, repeat: 0 },
            // 나무 벌목당했을 때 애니메이션 13프레임 1.5배 배속
            { key: 'tree_chop', frames: this.scene.anims.generateFrameNumbers('chopped', { start: 0, end: 12 }), frameRate: 16, repeat: 0 },
        ];
    }

    createAnimation(animData) {
        this.scene.anims.create(animData);
    }

}