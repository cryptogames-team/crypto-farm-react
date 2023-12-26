import Phaser from 'phaser';



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
export default class PlayerObject extends Phaser.GameObjects.Container {


    // 캐릭터가 바라보고 있는 방향
    playerDirection;


    constructor(scene, x, y) {
        // 상속받은 부모 클래스의 생성자
        super(scene, x, y);

        //console.log(spriteArray);

        // 씬에 캐릭터 추가
        // 씬의 디스플레이 목록에 추가하여 시각적으로 나타내게 한다.
        scene.add.existing(this);
        // 씬의 물리 시스템에 추가하여 물리적 상호작용을 가능하게 한다.
        scene.physics.add.existing(this);

        // 물리
        // 중력 비활성화
        this.body.setGravity(0);
        // 충돌 크기 변경
        // Body가 Wolrd 경계와 충돌하는지 여부 설정
        this.body.setCollideWorldBounds(true);
        //this.body.setBounce(1);
        this.body.setSize(bodyX, bodyY);
        // 자식 오브젝트들은 부모 컨테이너 depth 따라가나봄.
        this.setDepth(10);
        

        // 컨테이너의 오리진은 변경을 못한다는데
        // 컨테이너의 바디에는 애초에 오리진이 없다.

        // 컨테이너의 중앙값 구하기
        // 컨테이너의 현재 위치 값에서 컨테이너의 실제 길이, 높이 값의 절반을 더하면 됨.

        // Container에도 body가 있음
        // 기본 body size는 64,64px

        this.playerDirection = "right";

        // 캐릭터 스프라이트 추가
        // 컨테이너 바디 절반 크기 만큼 이동시키면 컨테이너 바디랑 딱 일치함.
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
        if (scene.characterInfo.name !== 'base') {
            this.hairSprite = scene.add.sprite(bodyX / 2, bodyY / 2, 'player_idle_hair');
            this.hairSprite.setScale(spriteScale);
            this.add(this.hairSprite);
        }
        this.add(this.handSprite);


        // 상태 머신 추가하기
        // Scene이 아니라 player_object에 추가한다.
        this.stateMachine = new StateMachine('idle', {
            idle: new IdleState(),
            move: new MoveState(),
            dig: new DigState(),
        }, [scene, this])


    }


    update(cursorsKeys, keys) {

        // 상태 머신 실행
        this.stateMachine.step();

    }

    // 좌우 이동할 때 스프라이트 반전시킴
    flipSprites(isFlipped) {
        this.bodySprite.setFlipX(isFlipped);
        if(this.hairSprite){
            this.hairSprite.setFlipX(isFlipped);
        }
        this.handSprite.setFlipX(isFlipped);
    }

}

// 상태 머신
// 현재 활성된 상태, 가능한 모든 상태 목록 저장, 현재 상태에서 새로운 상태로 전환을 처리하는 클래스
class StateMachine {
    constructor(initialState, possibleStates, stateArgs = []) {
        this.initialState = initialState;
        this.possibleStates = possibleStates;
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

// 상태 
class State {
    // 새로운 상태로 처음 전활될 때 실행되는 함수
    // 예) 땅파는 상태로 전환될 때 땅파기 애니메이션을 시작하는 것
    enter() {

    }
    // 현재 상태에서 update 호출될 때마다 실행되는 함수
    execute() {

    }
}

// 대기 상태
class IdleState extends State {
    enter(scene, player) {
        // player는 컨테이너 클래스이다.
        player.body.setVelocity(0);
        // 빡빡이 캐릭터는 헤어 스프라이트가 없음
        if (player.hairSprite) {
            player.hairSprite.anims.play('idle_hair', true);
        }
        player.bodySprite.anims.play('idle_body', true);
        player.handSprite.anims.play('idle_hand', true);

    }

    execute(scene, player) {
        // 키보드 입력 
        const { left, right, up, down, space } = scene.cursorsKeys;
        const { W, A, S, D } = scene.keys;

        //console.log("현재 대기 상태");

        // 스페이스 바를 누르면 땅파는 상태로 전환
        if (space.isDown) {
            player.stateMachine.transition('dig');
            return;
        }


        // 방향키를 누르면 걷는 상태로 전환
        // W, A, S, D 입력 무반응
        if (left.isDown || right.isDown || up.isDown || down.isDown ||
            W.isDown || A.isDown || S.isDown || D.isDown) {
            player.stateMachine.transition('move');
            return;
        }

    }

}

// 이동 상태
class MoveState extends State {
    enter(scene, player) {

    }

    execute(scene, player) {
        const { left, right, up, down, space, shift } = scene.cursorsKeys;
        const { W, A, S, D } = scene.keys;


        // 스페이스 바 누르면 땅파기 상태로 전환
        if (space.isDown) {
            player.stateMachine.transition('dig');
            return;
        }
        // 방향키를 누르고 있지 않으면 대기 상태로 전환
        if (!(left.isDown || right.isDown || up.isDown || down.isDown ||
            W.isDown || A.isDown || S.isDown || D.isDown)) {
            player.stateMachine.transition('idle');
            return;
        }


        const runSpeed = 250;
        const walkSpeed = 150;
        let currentSpeed = 0;

        // 달리는지 걷는지 체크
        if (shift.isDown)
            currentSpeed = runSpeed;
        else
            currentSpeed = walkSpeed;


        // 이동 구현
        player.body.setVelocity(0);

        if (left.isDown || A.isDown) { // 왼쪽 이동
            player.body.setVelocityX(-currentSpeed);
            // 스프라이트 왼쪽으로 반전시키기
            player.flipSprites(true);
            player.playerDirection = 'left';
        } else if (right.isDown || D.isDown) { // 오른쪽 이동
            player.body.setVelocityX(currentSpeed);
            player.flipSprites(false);
            player.playerDirection = 'right';
        }
        if (up.isDown || W.isDown) { // 위로 이동
            player.body.setVelocityY(-currentSpeed);
        } else if (down.isDown || S.isDown) { // 아래로 이동
            player.body.setVelocityY(currentSpeed);
        }


        // 현재 속도에 따라 걷기, 달리기 애니메이션 재생
        const playerVelocity = player.body.velocity;

        if (playerVelocity.x === walkSpeed || playerVelocity.x === -walkSpeed ||
            playerVelocity.y === walkSpeed || playerVelocity.y === -walkSpeed) {
            // 걷는 애니메이션 재생

            // 씬에서 애니메이션 생성하면 
            // 키를 플레이어 클래스에게 넘겨주지 않아도 됨.

            // 빡빡이 캐릭터는 헤어 스프라이트가 없음
            if (player.hairSprite) {
                player.hairSprite.anims.play('walk_hair', true);
            }
            player.bodySprite.anims.play('walk_body', true);
            player.handSprite.anims.play('walk_hand', true);
        } else if (playerVelocity.x === runSpeed || playerVelocity.x === -runSpeed ||
            playerVelocity.y === runSpeed || playerVelocity.y === -runSpeed) {
            // 달리는 애니메이션 재생

            // 빡빡이 캐릭터는 헤어 스프라이트가 없음
            if (player.hairSprite) {
                player.hairSprite.anims.play('run_hair', true);
            }

            player.bodySprite.anims.play('run_body', true);
            player.handSprite.anims.play('run_hand', true);
        }


    }
}

// 땅파는 상태
class DigState extends State {
    enter(scene, player) {

        // 캐릭터 이동 강제 정지
        player.body.setVelocity(0);

        // 땅 파는 애니메이션 실행
        // 빡빡이 캐릭터는 헤어 스프라이트가 없음
        if (player.hairSprite) {
            player.hairSprite.anims.play('dig_hair', true);
        }
        player.bodySprite.anims.play('dig_body', true);
        let DigAnim = player.handSprite.anims.play('dig_hand', true);

        // animationupdate 이벤트에 리스너 추가
        // animationupdate 이벤트는 애니메이션의 각 프레임마다 발생한다.
        DigAnim.on('animationupdate', (anim, frame) => {
            if(frame.index === 6) {
                //console.log("땅 파기 애니메이션 프레임 6에 도달함.");
                scene.paintTiles();
            }
        });

        // 애니메이션 전부 정지시켜야하나?

        // 땅 파는 애니메이션이 종료되면 대기 상태로 전환
        player.bodySprite.once('animationcomplete', () => {
            player.stateMachine.transition('idle');


            // 등록된 콜백 함수 전부 해제
            DigAnim.removeAllListeners();
        })


    }

    execute(scene, player) {

    }
}

// 3초 후 콜백함수 실행해서 대기 상태로 전환
/* scene.time.delayedCall(300, () => {
    this.stateMachine.transition('idle');
}); */

// 이거 복붙해서 상태 만드셈
class StateTemplate extends State {
    enter(scene, player) {

    }

    execute(scene, player) {

    }
}