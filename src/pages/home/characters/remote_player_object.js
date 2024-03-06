import Phaser from 'phaser';
import ChatContentBox from '../ui/chat/chatContentBox';


// 캐릭터 스프라이트 크기 배율
const spriteScale = 4;
// 실제 캐릭터 스프라이트 X,Y 크기
const spriteX = 16;
const spriteY = 16;

// 컨테이너 바디 크기 설정
const bodyX = spriteX * spriteScale;
const bodyY = spriteY * spriteScale;

// GameObjects.Container : 여러 게임 오브젝트(예: 스프라이트, 텍스트, 그래픽 등)를 
// 그룹화하고 하나의 단위로 관리할 수 있게 해주는 컨테이너
export default class RemotePlayer extends Phaser.GameObjects.Container {


    // 캐릭터가 바라보고 있는 방향
    playerDirection;

    // 수확중인지 여부
    isHarvesting = false;
    name

    constructor(scene, x, y, name, style) {
        // 상속받은 부모 클래스의 생성자
        super(scene, x, y);

        this.name = name
        // 씬의 디스플레이 목록에 추가하여 시각적으로 나타내게 한다.
        scene.add.existing(this);
        // 씬의 물리 시스템에 추가하여 물리적 상호작용을 가능하게 한다.
        scene.physics.add.existing(this);

        // 중력 비활성화
        this.body.setGravity(0);
        // Body가 Wolrd 경계와 충돌하는지 여부 설정
        this.body.setCollideWorldBounds(true);
        // body 사이즈 변경하여 충돌 크기 정함.
        this.body.setSize(bodyX, bodyY);
        // 자식 오브젝트들은 부모 컨테이너의 뎁스를 따라감.
        this.setDepth(10);
        this.playerDirection = "right";

    
        if (style === 'long hair') {

        } 
        else if (style === 'curly') {
            console.log("curly in")
            scene.load.spritesheet('player_idle_hair', 'assets/Character/IDLE/curlyhair_idle_strip9.png',{ frameWidth: 96, frameHeight: 64 })
            scene.load.spritesheet('player_idle_hair', 'assets/Character/IDLE/curlyhair_idle_strip9.png',{ frameWidth: 96, frameHeight: 64 })
            scene.load.spritesheet('player_idle_hair', 'assets/Character/IDLE/longhair_idle_strip9.png',{ frameWidth: 96, frameHeight: 64 })
           
        }
        // 로그인 안하고 인 게임 기능 구현할 때 바가지 머리 캐릭터 사용
        else if (style === 'bow' || style === undefined) {
            console.log("bow in")
            scene.load.spritesheet('player_idle_hair', 'assets/Character/IDLE/bowlhair_idle_strip9.png',{ frameWidth: 96, frameHeight: 64 })
            scene.load.spritesheet('walk_hair', 'assets/Character/IDLE/bowlhair_walk_strip8.png',{ frameWidth: 96, frameHeight: 64 })       
        }
        

        // 캐릭터 스프라이트 추가
        // 컨테이너에 스프라이트를 추가할 때, 스프라이트 위치는 컨테이너 내에서 상대적 위치를 나타냄.
        // 컨테이너 내부의 스프라이트가 바디를 넘어가지 않게 상대 위치를 조정해야 한다.
        this.bodySprite = scene.add.sprite(bodyX / 2, bodyY / 2, 'player_idle_body');
        this.bodySprite.setScale(spriteScale);
        this.handSprite = scene.add.sprite(bodyX / 2, bodyY / 2, 'player_idle_hand');
        this.handSprite.setScale(spriteScale);
        // 스프라이트를 컨테이너 자식에 추가하기 
        // body, hair, hand 순으로 추가해야 한다.
        this.add(this.bodySprite);
        // 캐릭터 name이 base인 경우 빡빡이 캐릭터라서 헤어 스프라이트가 필요 없음.
        if (style !== "base") {
            
            this.hairSprite = scene.add.sprite(bodyX / 2, bodyY / 2, 'player_idle_hair_remote');
            this.hairSprite.setScale(spriteScale);
            this.add(this.hairSprite);
        }
        this.add(this.handSprite);


        // 상태 머신 추가하기
        // Scene이 아니라 player_object에 추가한다.
        this.stateMachine = new StateMachine('idle', {
            idle: new IdleState(),
            move: new MoveState(),
        }, [scene, this,style]);
        this.stateMachine.transition('idle')


        //캐릭터 이름표 추가
        this.nameTag = scene.add.text(33, 60, this.name, {
            fontFamily: 'Arial',
            fontSize: '18px',
            color: 'white',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5, 0)
        this.add(this.nameTag)


        //캐릭터 이름표 추가
        this.nameTag = scene.add.text(33, 60, this.name, {
            fontFamily: 'Arial',
            fontSize: '18px',
            color: 'white',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5, 0)
        this.add(this.nameTag)


        //채팅말풍선
        this.chatContentBox = new ChatContentBox(scene)
        this.add(this.chatContentBox)
    }


    update() {
        // 상태 머신 실행
        this.stateMachine.step();
    }

    // 왼쪽으로 이동하면 캐릭터 스프라이트 x축 반전시킴
    flipSprites(isFlipped) {
        this.bodySprite.setFlipX(isFlipped);
        if (this.hairSprite) {
            this.hairSprite.setFlipX(isFlipped);
        }
        this.handSprite.setFlipX(isFlipped);
    }

    // 캐릭터 애니메이션 재생 함수
    // state : 재생할 애니메이션을 나타내는 상태
    // hairSprite : 빡빡이 캐릭터인지 확인한다. 빡빡이면 hairSprite가 없기 때문에
    playAnimation(state, hairSprite,style) {

        if (hairSprite) {
            this.hairSprite.anims.play(state + '_hair_'+style, true);
            
        }
        this.bodySprite.anims.play(state + '_body', true);
        // return 이 있는 이유 특정 애니메이션에 이벤트 리스너 달아야해서
        return this.handSprite.anims.play(state + '_hand', true);
    }



    // 캐릭터 대기 상태로 전환
    // anim : 콜백 함수를 제거할 애니메이션 매니저
    transitionToIdle(anim) {
        this.stateMachine.transition('idle');
        anim.removeAllListeners();
    }

    move(x, y) {
        if (x >= this.x) {

            this.flipSprites(false)
        } else {
            this.flipSprites(true)
        }
        const moveXInterpolation = (x - this.x) / 10
        const moveYInterpolation = (y - this.y) / 10
        for (let i = 0; i < 10; i++) {
            setTimeout(() => {
                this.x += moveXInterpolation
                this.y += moveYInterpolation
            }, 20 * (i + 1))
        }

        this.stateMachine.transition('move');

    }

}

// 상태 머신
// 현재 활성된 상태, 가능한 모든 상태 목록 저장, 현재 상태에서 새로운 상태로 전환을 처리하는 클래스
class StateMachine {
    constructor(initialState, possibleStates, stateArgs = []) {
        this.initialState = initialState;
        this.possibleStates = possibleStates;
        // 상태 인자
        this.stateArgs = stateArgs;
        this.state = null;

        // State instances get access to the state machine via this.stateMachine.
        // 상태 인스턴스는 this.stateMachine으로 상태 머신에 액세스 할 수 있다.
        for (const state of Object.values(this.possibleStates)) {
            state.stateMachine = this;
        }
    }

    step() {
        if (this.state === null) {
            // On the first step, the state is null and we need to initialize the first state.
            // 첫 step에는 state가 null이므로 첫번째 state를 초기화 해야 함.
            this.state = this.initialState;
            this.possibleStates[this.state].enter(...this.stateArgs);
        }

        // Run the current state's execute
        // 현재 state의 execute()를 실행한다.
        this.possibleStates[this.state].execute(...this.stateArgs);
    }

    transition(newState, ...enterArgs) {
        this.state = newState;
        this.possibleStates[this.state].enter(...this.stateArgs, ...enterArgs);
    }

}

// 상태 머신에 사용할 상태 클래스
class State {
    // 새로운 상태로 처음 전환될 때 실행되는 함수
    // 예) 땅파는 상태로 전환될 때 땅파기 애니메이션을 시작하는 것
    enter() {

    }
    // 현재 상태에서 update 호출될 때마다 실행되는 함수
    execute() {

    }
}

// 대기 상태 - 캐릭터의 기본 상태
class IdleState extends State {
    enter(scene, player,style) {
        // player는 컨테이너 클래스이다.

        // 대기 상태면 속도 0
        player.body.setVelocity(0);
        // 대기 애니메이션 재생
        player.playAnimation('idle', player.hairSprite,style);
        console.log("IdleState entered!")
    }

    execute(scene, player) {
        // 키보드 입력 
        const { left, right, up, down, space } = scene.cursorsKeys;
        const { W, A, S, D } = scene.keys;



        // 방향키를 누르면 걷는 상태로 전환
        if (left.isDown || right.isDown || up.isDown || down.isDown ||
            W.isDown || A.isDown || S.isDown || D.isDown) {
            player.stateMachine.transition('move');
            return;
        }

    }

}

// 이동 상태
class MoveState extends State {


    enter() {
        console.log("MoveState entered!")
    }

    execute(scene, player) {
        // 구조 분해로 키 객체 할당

        const runSpeed = 350;
        const walkSpeed = 200;
        let currentSpeed = 0;

        // 현재 속도에 따라 걷기, 달리기 애니메이션 재생
        //const playerVelocity = player.body.velocity;
        player.playAnimation('walk', player.hairSprite);

        //player.playAnimation('walk', player.body);
    }
}

// 행동 상태
// 캐릭터가 현재 장착한 도구에 따라 애니메이션을 재생한다.


// 3초 후 콜백함수 실행해서 대기 상태로 전환
/* scene.time.delayedCall(300, () => {
    this.stateMachine.transition('idle');
}); */

