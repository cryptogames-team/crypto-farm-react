import Phaser, { Game } from "phaser"
import React, { useEffect, useRef, useState } from 'react'

import PhaserGameComponent from "./phaser_component";
import LoginForm from "./login_form";
import CharacterSelect from "./character_select";

// import CSS
import styles from './play.css';




// 브라우저 창의 크기가 변경될 때
window.addEventListener('resize', event => {

  //console.log("브라우저 창 크기 변경됨!");

}, false);





// 리액트 컴포넌트에서 반드시 return() 포함되어야 함.
// 로그인과 캐릭터 선택 컴포넌트를 담는 부모 컴포넌트
// 컴포넌트 전환이 이루어져야 한다.
function LoginWithCharacter() {


  // useState 미사용하면 변수가 변경되어도 렌더링이 안되거나 적용이 안된다.
  // 계정 이름 관리
  const [accountName, setAccountName] = useState('');


  // 로그인 컴포넌트에서 지갑 로그인이 완료되면 계정 이름을 받고
  // 로그인 컴포넌트 -> 캐릭터 선택 컴포넌트로 교체하는 함수
  const handleLogin = (value) => {
    console.log("로그인 컴포넌트한테 받은 계정 이름 :", value);


    // 로그인 컴포넌트로부터 받은 계정 이름 전달
    setAccountName(value);

    setCurrentComponent("characterSelect");
  }

  // 로그인 컴포넌트로부터 받은 계정 이름 전달
  // props에 함수로 전달하는게 맞나


  const [currentComponent, setCurrentComponent] = useState("login");

  // 렌더링할 컴포넌트 저장
  let componentToRender;
  if (currentComponent === "login") {

    // 초기화 전에 'handleLogin'에 접근 불가능함.
    componentToRender = <LoginForm onLogin={handleLogin} />;
  } else {
    // 데이터 전달이 안되고 있음
    componentToRender = <CharacterSelect accountName={accountName} />;
  }

  // Props 
  // 컴포넌트 교체 함수 따로 빼서 만든다.
  // 부모 컴포넌트의 함수나 변수를 자식 컴포넌트에게 전달 가능하다.

  // 컴포넌트 교체 함수
  function replaceComponent() {
    setCurrentComponent("characterSelect");
  }


  // 컴포넌트 교체 기능
  // 조건부 렌더링
  return (

    <div>
      {/*       <button id="replacement_button"
      onClick={replaceComponent}>컴포넌트 교체</button> */}

      {componentToRender}

    </div>

  );

}

// <GameWithLoginForm></GameWithLoginForm>

//     <CharacterSelect></CharacterSelect>

export default function PlayHome() {
  return (

    <div id="container">
      <PhaserGameComponent />
      <LoginWithCharacter />
    </div>


  );

}


// 페이저 로그인 게임 컴포넌트
const Login = () => {
  const game = useRef(null);

  const phaserConfig = {
    type: Phaser.AUTO,
    // 배경 투명하게 설정(기본 검정색)
    transparent: false,
    // 씬을 관리하는 메소드
    // 게임이 아래의 해상도로 렌더링된다.
    // 모든 좌표, 크기 설정은 이 크기를 기본으로 계산된다.
    width: 480,
    height: 320,
    // 이미지가 선명하게 나옴
    pixelArt: true,

    scene: {
      preload,
      create,
      update,
    },

    // 게임 설정에서 'scale' 속성 구성
    scale: {
      // 게임 div의 id
      // parent가 없거나 설정하지 않은 경우 Phaser가 알아서 <Canvas>를 만든다.
      parent: "gamediv",

      // Phaser.Scale.HEIGHT_CONTROLS_WIDTH : 높이를 꽉 채우고, 비율에 맞게 가로 길이를 조정한다.
      // Phaser.Scale.WIDTH_CONTROLS_HEIGHT : 가로를 꽉 채우고, 비율에 맞게 세로 길이를 조정한다.
      // Phaser.Scale.FIT : 게임을 늘리거나 줄여서 부모 컨테이너에 맞춤. 원래의 종횡비를 유지한다.
      // Phaser.Scale.RESIZE : 게임의 크기를 부모 컨테이너의 크기에 동적으로 맞춘다. 종횡비는 유지하지 않음.
      // Phaser.Scale.ENVELOP : 게임을 부모 컨테이너에 맞추되, 종횡비를 유지하면서 가능한 크게 확장한다.
      // Phaser.Scale.NONE : 스케일링 아무것도 안함.
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


  // Phaser의 생명 주기
  // 게임에서 사용할 애셋(이미지, 오디오 등)을 불러오는 단계이다.
  // 여기서 모든 필요한 애셋들이 로드된다.
  function preload() {
    // 여기서 this는 게임 Scene이라고 한다.

    // sunnysideworld 타일셋 PNG 파일 로드
    this.load.image('sunnysideworld_tiles', 'assets/Maps/spr_tileset_sunnysideworld_16px.png');

    // Cow 타일셋 로드
    this.load.image('cow_tiles', 'assets/Maps/spr_deco_cow_strip4.png');

    // 로그인 배경 png 로드
    //this.load.image('login_background', 'assets/Maps/Crypto_Farm_Login.png');

    // 새 로그인 화면 배경에 사용할 
    // 바닥, 목장, 밭, 나무들, 고지대, 언덕 png 로드
    this.load.image('login_background_ground', 'assets/Maps/New_Crypto_Farm_Login_Ground.png');
    this.load.image('login_background_pasture', 'assets/Maps/Crypto_Farm_Login_Pasture.png');
    this.load.image('login_background_field', 'assets/Maps/Crypto_Farm_Login_Field.png');
    this.load.image('login_background_house', 'assets/Maps/Crypto_Farm_Login_House.png');
    this.load.image('login_background_tree', 'assets/Maps/Crypto_Farm_Login_Trees.png');
    this.load.image('login_background_highground', 'assets/Maps/Crypto_Farm_Login_HighGround.png');
    this.load.image('login_background_hill', 'assets/Maps/Crypto_Farm_Login_Hill.png');

    // 크립토 팜 로고 로드
    //this.load.image('login_logo', 'assets/crypto_farm_logo.png');

    // 타일맵 JSON 파일 로드
    this.load.tilemapTiledJSON('login_tilemap', 'assets/Maps/Crypto_Farm_Login.json');

  }

  // 애셋 로드가 완료되면, 게임 오브젝트를 생성하고 초기화한다.
  // 이 단계는 게임 시작 시 한 번만 실행된다.
  function create() {


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
    const login_background_pasture = this.add.image(screenWidth, screenHeight, 'login_background_pasture');
    login_background_pasture.setScale(2);
    // 이미지 기준점을 오른쪽 아래로 설정한다.
    login_background_pasture.setOrigin(1, 1);

    // 화면 왼쪽 아래에 딱 달라붙게 위치
    const login_background_field = this.add.image(0, screenHeight, 'login_background_field');
    login_background_field.setScale(2);
    // 이미지 기준점을 왼쪽 아래로 설정한다.
    login_background_field.setOrigin(0, 1);

    // 화면 중앙 아래에 딱 붙게 위치 시키기
    const login_background_house = this.add.image(centerX, screenHeight, 'login_background_house');
    login_background_house.setScale(2);
    // 이미지의 기준점을 중앙 아래로 설정한다.
    login_background_house.setOrigin(0.5, 1);

    // 화면 오른쪽 위에 딱 붙게 위치
    const login_background_Tree = this.add.image(screenWidth, 0, 'login_background_tree');
    login_background_Tree.setScale(2);
    // 이미지 기준점 : 오른쪽 위
    login_background_Tree.setOrigin(1, 0);

    // 화면 중앙 위
    const login_background_highground = this.add.image(centerX, 0, 'login_background_highground');
    login_background_highground.setScale(2);
    // 이미지 기준점 : 중앙 위
    login_background_highground.setOrigin(0.5, 0);

    // 화면 왼쪽 위
    const login_background_hill = this.add.image(0, 0, 'login_background_hill');
    login_background_hill.setScale(2);
    login_background_hill.setOrigin(0, 0);




    // 로고 추가
    //const login_logo = this.physics.add.image(centerX, centerY, 'login_logo');
    //login_logo.setScale(0.7);



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
    let FKey = this.input.keyboard.addKey('F');
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
    }, this);

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
      // 화면 오른쪽 아래
      login_background_pasture.setPosition(width, height);
      // 화면 왼쪽 아래
      login_background_field.setPosition(0, height);
      // 화면 중앙 아래
      login_background_house.setPosition(centerX, maxY);
      // 화면 오른쪽 위
      login_background_Tree.setPosition(width, 0);
      // 화면 중앙 위
      login_background_highground.setPosition(centerX, 0);


      //console.log("페이저 이벤트 리스너 : 브라우저 창 크기 변경됨! \n" + "변경된 창 크기 : %d, %d", width, height);
    });

  }

  // 게임의 주요 로직이 처리되는 단계로 가장 중요함.
  // 매 프레임마다 반복적으로 호출되며, 게임의 상태를 업데이트 한다.
  function update() {

    // 추가한 로고 이미지들 회전
    /*     logo1.rotation += 0.01;
        logo2.rotation += 0.02;
        logo3.rotation += 0.03; */


  }

  // Render : 게임의 현재 상태를 화면에 그리는 단계이다. 
  // Update 후 실행되며, 게임의 시각적 요소를 렌더링 한다.

  useEffect(() => {
    // game 레퍼런스에 phaserConfig로 씬 생성하기
    game.current = new Game(phaserConfig);

    // 주의 : 게임이 단 한번만 실행되게 신경써야 한다.
    // useEffect의 dependency array에 []를 넣어 게임이 한 번만 실행되게 한다.
  }, []);

  return (
    // 화면이 출력될 요소
    <div id="gamediv" ref={game}></div>
  )

}
