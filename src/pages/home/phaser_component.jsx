import React, { useEffect } from 'react';
import Phaser from 'phaser';

// 게임에서 사용할 이미지는 public에 넣을 것

function PhaserGameComponent({charInfo}) {

    // useEffect 훅을 사용하여 마운트 및 언마운트 시점 관리한다.
    useEffect(() => {

    // Phaser 게임 설정
    const config = {
        type: Phaser.AUTO,
        width: 800,
        height: 600,
        pixelArt : true,
        // Phaser 게임을 삽입할 DOM 요소의 ID
        parent: 'game-container', 

        // 게임 설정에서 'scene' 속성 구성
        scene: {
          preload: preload,
          create: create,
          update: update
        },

        // 게임 설정에서 'scale' 속성 구성
        scale : {
          mode: Phaser.Scale.RESIZE,
          // 가로 및 세로 중앙에 배치한다.
          autoCenter: Phaser.Scale.CENTER_BOTH,

        },

        // 물리 속성
        physics: {
          default: 'arcade',
          arcade: {
            debug: true
          }
        }
    }
    // Phaser 게임 인스턴스 생성
    const game = new Phaser.Game(config);

    // 언마운트될 때 게임 인스턴스 정리
    return () => {
        game.destroy(true);
    }
    // 주의 : 게임이 단 한번만 실행되게 신경써야 한다.
    // useEffect의 dependency array에 []를 넣어 게임이 한 번만 실행되게 한다.
    }, []);


  // Phaser 생명 주기
  // Phaser 게임의 preload, create, update 함수
  function preload() {
    // 에셋 로드
        // sunnysideworld 타일셋 PNG 파일 로드
        //this.load.image('sunnysideworld_tiles', '../../assets/tilesets/spr_tileset_sunnysideworld_16px.png');
        
        // assets/Ma1ps/
        // Cow 타일셋 로드
        //this.load.image('cow_tiles', '../../assets/tilesets/spr_deco_cow_strip4.png');
    
    
        // 새 로그인 화면 배경에 사용할 
        // 바닥, 목장, 밭, 나무들, 고지대, 언덕
        this.load.image('login_background_ground', 'assets/maps/New_Crypto_Farm_Login_Ground.png');
        this.load.image('login_background_pasture', 'assets/maps/Crypto_Farm_Login_Pasture.png');
        this.load.image('login_background_hill', 'assets/maps/Crypto_Farm_Login_Hill.png');
    
        // 크립토 팜 로고 로드
        //this.load.image('login_logo', 'assets/crypto_farm_logo.png');
    
        // 타일맵 JSON 파일 로드
        // 이거 지금 필요없음.
       // this.load.tilemapTiledJSON('login_tilemap', '../../assets/tilesets/Crypto_Farm_Login.json');

    
  }

  // 애셋 로드가 완료되면, 게임 오브젝트를 생성하고 초기화한다.
  // 이 단계는 게임 시작 시 한 번만 실행된다.
  function create() {
    // 게임 생성 로직

    
    // 게임 캔버스의 현재 길이
    const canvasWidth = this.sys.game.canvas.width;
    // 게임 캔버스의 현재 높이
    const canvasHeight = this.sys.game.canvas.height;
    console.log("초기 Canvas Size : %d, %d", canvasWidth, canvasHeight);



    // 로그인 배경의 바닥 png 추가
    // 초기 화면 크기 기억해놓기
    const login_background_ground = this.add.image(window.innerWidth, window.innerHeight, 'login_background_ground');
    login_background_ground.setDisplaySize(window.innerWidth * 2, window.innerHeight * 2);


    // 화면의 좌표값 구하기
    // 화면의 중앙 가로 좌표
    let centerX = this.cameras.main.centerX;
    // 화면의 중앙 세로 좌표
    let centerY = this.cameras.main.centerY;

    // 화면의 오른쪽 가로 좌표 - 즉, 화면의 길이 값
    let screenWidth = this.cameras.main.width;
    // 화면의 아래쪽 세로 좌표 - 즉, 화면의 높이 값
    let screenHeight = this.cameras.main.height;


    // 화면 오른쪽 아래에 위치 시키기
    // Origin 설정해서 기준점 변경가능
    const login_background_pasture = this.add.image(screenWidth, 0, 'login_background_pasture');
    login_background_pasture.setScale(2);
    // 이미지 기준점을 오른쪽 위로 설정한다.
    login_background_pasture.setOrigin(1, 0);

    // 화면 왼쪽 아래에 딱 달라붙게 위치
  /*   const login_background_field = this.add.image(0, screenHeight, 'login_background_field');
    login_background_field.setScale(2);
    // 이미지 기준점을 왼쪽 아래로 설정한다.
    login_background_field.setOrigin(0, 1); */

    // 화면 중앙 아래에 딱 붙게 위치 시키기
/*     const login_background_house = this.add.image(centerX, screenHeight, 'login_background_house');
    login_background_house.setScale(2);
    // 이미지의 기준점을 중앙 아래로 설정한다.
    login_background_house.setOrigin(0.5, 1); */

    // 화면 오른쪽 아래에 딱 붙게 위치
/*     const login_background_Tree = this.add.image(screenWidth, screenHeight, 'login_background_tree');
    login_background_Tree.setScale(2);
    // 이미지 기준점 : 오른쪽 아래
    login_background_Tree.setOrigin(1, 1); */

    // 화면 중앙 위
/*     const login_background_highground = this.add.image(centerX, 0, 'login_background_highground');
    login_background_highground.setScale(2);
    // 이미지 기준점 : 중앙 위
    login_background_highground.setOrigin(0.5, 0); */

    // 화면 왼쪽 위
    const login_background_hill = this.add.image(0, 0, 'login_background_hill');
    login_background_hill.setScale(2);
    login_background_hill.setOrigin(0, 0);




    /*
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
    */

    // F 키를 전체 화면 토글로 설정
/*     let FKey = this.input.keyboard.addKey('F');
    FKey.on('down', function () {
      if (this.scale.isFullscreen) {
        this.scale.stopFullscreen();
      } else {
        this.scale.startFullscreen();
      }
    }, this);

    // R키 : 현재 화면 크기를 콘솔로 찍기
    let RKey = this.input.keyboard.addKey('R');
    RKey.on('down', function () {
      // 게임 캔버스의 현재 길이
      const canvasWidth = this.sys.game.canvas.width;
      // 게임 캔버스의 현재 높이
      const canvasHeight = this.sys.game.canvas.height;
      console.log("현재 Canvas Size : %d, %d", canvasWidth, canvasHeight);
    }, this); */

    // Phaser 게임 인스턴스에서 스케일 매니저의 'resize' 이벤트에 대한 리스너 설정
    // 이벤트 리스너는 게임 창이나 캔버스 크기가 변경될 때마다 호출됨.
    // gameSize : 변경된 게임의 크기 정보를 담고 있다. 일반적으로 gameSize.width, gameSize.height 속성 사용
    this.scale.on('resize', (gameSize) => {
      const width = gameSize.width;
      const height = gameSize.height;

      // 화면의 중앙 가로 좌표
      let centerX = this.cameras.main.centerX;
      // 화면의 중앙 아래쪽 좌표
      let maxY = this.cameras.main.height;


      // 웹 페이지 크기가 변경되면 화면 비율에 맞게 위치 변경
      // 화면 오른쪽 위
      login_background_pasture.setPosition(width, 0);
      // 화면 왼쪽 아래
      //login_background_field.setPosition(0, height);
      // 화면 중앙 아래
      //login_background_house.setPosition(centerX, maxY);
      // 화면 오른쪽 아래
      //login_background_Tree.setPosition(width, 0);
      // 화면 중앙 위
      //login_background_highground.setPosition(centerX, 0);


      //console.log("페이저 이벤트 리스너 : 브라우저 창 크기 변경됨! \n" + "변경된 창 크기 : %d, %d", width, height);
    });

  }

  function update() {
    // 게임 업데이트 로직
  }

  return (
    <div id = "game-container"></div>
  );

}


export default PhaserGameComponent;