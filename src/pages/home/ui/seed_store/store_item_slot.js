import Phaser from "phaser";
import Item from "../../elements/item";
import Frame_W from "../frame_w";
import SelectBox from "../select_box";
import Frame from "../frame/frame";



export default class StoreItemSlot extends Frame {

    scene;
    tabBody;

    // 아이템 객체
    item;

    itemImg;

    // 수량 관련 변수들
    countBox;
    countTxt;
    count = 0;

    // 자물쇠 아이콘
    lockIcon;

    // 셀렉트 박스
    selectBox;

    index;

    // 0 : open, 1 : lock
    state = 0;

    constructor(scene, x, y, width, height, index , tabBody = null) {

        super(scene, x, y, width, height);
        this.scene = scene;
        this.index = index;
        this.tabBody = tabBody;
        this.setSize(width, height);
        
        // 아이템 이미지 추가
        const itemImgX = this.width / 2;
        const itemImgY = this.height / 2;
        this.itemImg = scene.add.image(itemImgX, itemImgY, '');
        //console.log('아이템 이미지 원본 크기', this.itemImg.width, this.itemImg.height);

        // 아이템 수량 표시 프레임 박스
        this.countBox = new Frame_W(scene, 0, 0, 25, 25, 6);
        // 오른쪽 위에 위치 설정
        this.countBox.x = this.width - this.countBox.width;
        this.countBox.y = 0;

        const txtStyle = {
            fontFamily: 'Arial',
            fontSize: 15,
            color: 'black',
            fontStyle: 'bold',
            align: 'center',
            /* stroke: 'white', // 외곽선
            strokeThickness: 3 // 외곽선 두께   */
        };

        // 아이템 수량 표시 텍스트 추가
        const countTxtX = this.countBox.x + this.countBox.width / 2;
        const countTxtY = this.countBox.y + this.countBox.height / 2;
        this.countTxt = scene.add.text(countTxtX, countTxtY, this.count, txtStyle);
        this.countTxt.setOrigin(0.5, 0.5);

        // 디스플레이 사이즈를 변경하면 이미지 크기를 거기에 맞추기 위해
        // 디스플레이 사이즈 / 원본 사이즈 값으로 스케일 값이 변경됨.
        //console.log('아이템 이미지 스케일', this.itemImg.scaleX, this.itemImg.scaleY );


        // 자물쇠 아이콘 추가
        let lockX = this.width - this.edgeSize;
        let lockY = this.height - this.edgeSize;
        this.lockIcon = scene.add.image(lockX, lockY, 'lockIcon');
        this.lockIcon.setDisplaySize(20, 20).setOrigin(1,1);
        this.lockIcon.setVisible(false);

        // 셀렉트 박스 추가
        this.selectBox = new SelectBox(scene, 0, 0, this.width, this.height);
        this.selectBox.setScale(2.5);
        this.selectBox.setVisible(false);

        this.add([this.itemImg, this.lockIcon, this.selectBox]);
        this.add([this.countBox, this.countTxt]);

        // 상호작용 영역 설정
        const hitArea = new Phaser.Geom.Rectangle(this.width / 2, this.height / 2,
        this.width, this.height);
        const hitCallback = Phaser.Geom.Rectangle.Contains;
        this.setInteractive(hitArea, hitCallback);
        //scene.input.enableDebug(this);

        // 이벤트 리스너 설정
        this.on('pointerover', (pointer) => {
            document.body.style.cursor = 'pointer';
        });
        this.on('pointerout', (pointer) => {
            document.body.style.cursor = 'default';
        });


    }

    // 아이템 이미지 설정
    setItemImg(texture) {
        this.itemImg.setTexture(texture);
        this.itemImg.setScale(4);
        // 텍스처 변경하면 displaySize가 원본 크기대로 변경됨.
        //console.log('텍스처 변경 후 실제 표시 크기', this.itemImg.displayWidth, this.itemImg.displayHeight);
        //console.log('텍스처 변경 후 아이템 이미지 원본 크기', this.itemImg.width, this.itemImg.height);
    }

    setItemCount(count){
        this.count = count;
        this.countTxt.setText(count);
    }

    // 슬롯 잠금 상태 설정
    setSlotLockState(isLocked){

        if(isLocked){
            this.lockIcon.setVisible(true);
            // 알파값 조정
            this.itemImg.setAlpha(0.5);
            this.center.setAlpha(0.5);
            this.state = 1;
        }else{
            this.lockIcon.setVisible(false);
            this.itemImg.setAlpha(1);
            this.center.setAlpha(1);
            this.state = 0;
        }
    }
}