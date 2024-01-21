


export default class Item{

    // 아이템의 종류 : 씨앗, 도구, 농작물 등
    type;
    // 아이템 이름 : 감자 씨앗 코드 상에서 구별할 아이템의 이름
    name;
    // 아이템 제목 : UI상에서 보여질 아이템의 이름 한글로 적기
    title;
    // 아이템 텍스처 키 : 로드한 아이템 이미지 사용할 때 키로 사용함.
    imgKey;
    // 개수
    quantity;
    // 스택제한수 : 인벤토리 아이템 한 칸에 몇개까지 들어 갈 수 있는지
    // 스택이 불가능하 아이템들은 1개까지만 들어가고
    // 스택이 가능한 아이템들은 999개까지 들어간다.
    stackLimit=999;

    // 가격
    price;

    // 클래스 생성자에서 디폴트 매개변수 사용 가능
    // 주의 : 디폴트 매개변수는 해당 매개변수에 'undefined'가 전달되었을 때 사용된다.
    // null, 0, ''과 같은 falsy 값들은 디폴트 매개변수를 대체한다.
    // 근데 이 기능은 ES6에서 도입된 거라서 구형 브라우저에서는 지원되지 않을 수 있음.
    constructor(type, name, title, imgKey,quantity=1){

        this.type = type;
        this.name = name;
        this.title = title;
        this.imgKey = imgKey;
        this.quantity = quantity;
    }


}