import EventEmitter from 'events';
export const eventSystem = new EventEmitter();

// 전역 이벤트 핸들러
// 브라우저 환경에서는 React의 Context API나 Redux같은 상태 관리 라이브러리를 통해 유사 기능을 구현 가능하다.

/*
# 전역 이벤트 시스템

### EventEmitter class

- Node.js의 ‘events’ 모듈에 포함된 클래스로, 이벤트를 발생시키고 이에 대한 리스너를 등록하는 기능을 제공한다.
- 이 클래스를 사용하면 사용자 정의 이벤트를 만들고, 이벤트에 대한 핸들러를 등록,제거 가능함.

### eventSystem

- EventEmitter의 인스턴스로, 전역 이벤트 시스템으로 사용된다.
- 이 인스턴스를 통해 애플리케이션 전체에서 발생하는 이벤트를 관리 가능하다.
    - 예) 한 컴포넌트에서 발생시킨 이벤트를 다른 컴포넌트가 감지하고 반응할 수 있다.

*/