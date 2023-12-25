import React, { useEffect } from 'react';
import Phaser from 'phaser';
import { eventSystem } from './event_system';

// import Phaser Scene
import LoginScene from './scenes/LoginScene';
import InGameScene from './scenes/InGameScene';

// 게임에서 사용할 이미지는 public에 넣을 것

function PhaserGameComponent() {

    // useEffect 훅을 사용하여 마운트 및 언마운트 시점 관리한다.
    useEffect(() => {

    // Phaser 게임 설정
    const config = {
        type: Phaser.AUTO,
        width: window.innerWidth,
        height: window.innerHeight,
        pixelArt : true,
        // Phaser 게임을 삽입할 DOM 요소의 ID
        parent: 'game-container', 

        // 게임 설정에서 'scene' 속성 구성 : 익명 씬도 사용 가능한가 봄
        // LoginScene 사용
        //scene: [LoginScene, InGameScene],
        // InGameScene 테스트
        scene: [InGameScene, LoginScene],

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
            // 디버그 모드
            debug: true
          }
        }
    }
    // Phaser 게임 인스턴스 생성
    const game = new Phaser.Game(config);


    // 언마운트될 때 게임 인스턴스 정리
    // 전역 이벤트 시스템에 등록된 이벤트 전부 정리
    return () => {
        game.destroy(true);

        eventSystem.removeAllListeners();
    }
    // 주의 : 게임이 단 한번만 실행되게 신경써야 한다.
    // useEffect의 dependency array에 []를 넣어 게임이 한 번만 실행되게 한다.
    }, []);


  return (
    <div id = "game-container"></div>
  );

}


export default PhaserGameComponent;