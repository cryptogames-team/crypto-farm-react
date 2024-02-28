import Phaser from 'phaser'
import { eventSystem } from '../event_system';

export default class LoginScene extends Phaser.Scene {
    constructor() {
        super('LoginScene');

        // 화살표 함수로 현재 컨텍스트 캡처
        eventSystem.on('charSelection', (characterInfo) => this.handleCharSelection(characterInfo));
    }

    // 캐릭터 선택 시 인 게임 씬으로 넘어간다.
    // 부모 컴포넌트로부터 선택한 캐릭터 정보도 받음.
    handleCharSelection(characterInfo) {

        console.log("인 게임 로그인");

        //씬 전환 시 씬의 키를 정확히 지정해야 한다.
        this.scene.start('InGameScene', characterInfo);

        // this의 컨텍스트가 예상과 다르게 바인딩되어 있기 때문에 발생한다.
        // 화살표 함수 사용 : 이벤트 리스너를 등록할 때 화살표 함수를 사용하여 현재 컨텍스트를
        // 캡처 가능하다.

        // 이벤트 리스너 해제
        this.scale.removeAllListeners();
    }

    // 자산 로딩
    preload() {

        // 새 로그인 화면 배경에 사용할 
        // 바닥, 목장, 언덕 png 로드
        this.load.image('login_background_ground', 'assets/maps/New_Crypto_Farm_Login_Ground.png');
        this.load.image('login_background_pasture', 'assets/maps/Crypto_Farm_Login_Pasture.png');
        this.load.image('login_background_hill', 'assets/maps/Crypto_Farm_Login_Hill.png');

    }
    // 게임 객체 및 로직 초기화
    // 게임 시작 시 한번만 실행됨.
    create() {

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


        // 화면 왼쪽 위
        const login_background_hill = this.add.image(0, 0, 'login_background_hill');
        login_background_hill.setScale(2);
        login_background_hill.setOrigin(0, 0);


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
            //console.log("페이저 이벤트 리스너 : 브라우저 창 크기 변경됨! \n" + "변경된 창 크기 : %d, %d", width, height);
        });

    }

    // 게임 상태 업데이트
    update() {

    }


}
