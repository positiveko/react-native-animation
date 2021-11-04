import React, { useRef } from 'react';
import { Animated, PanResponder } from 'react-native';
import styled from 'styled-components/native';

export default function App() {
  // 참고 https://github.com/facebook/react-native/blob/main/packages/rn-tester/js/examples/PanResponder/PanResponderExample.js
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        console.log('Touch Started');
        // dx, dy가 초기화되지 않도록 이전 위치를 받아와서 offset 설정.
        POSITION.setOffset({
          // Value는 실제로 number가 아니기 때문에 공식문서에서 _value로 접근하길 권장.
          // TODO ... type 정의가 되지 않아서 후에 확인 필요
          x: POSITION.x._value,
          y: POSITION.y._value,
        });
      },
      onPanResponderMove: (_, { dx, dy }) => {
        // ((e: GestureResponderEvent, gestureState: PanResponderGestureState)
        POSITION.setValue({
          x: dx,
          y: dy,
        });
      },
      onPanResponderRelease: () => {
        console.log('Touch Finished');
        // touch가 끝날 때마다 offset을 초기화
        POSITION.flattenOffset();
      },
    })
  ).current;

  const POSITION = useRef(
    new Animated.ValueXY({
      x: 0,
      y: 0,
    })
  ).current;

  const borderRadius = POSITION.y.interpolate({
    inputRange: [-300, 300],
    outputRange: [100, 0],
  });

  const bgColor = POSITION.y.interpolate({
    inputRange: [-300, 300],
    outputRange: ['rgb(255, 99, 71)', 'rgb(71, 166, 255)'],
  });

  return (
    <Container>
      <AnimatedBox
        {...panResponder.panHandlers}
        style={{
          borderRadius,
          backgroundColor: bgColor,
          transform: POSITION.getTranslateTransform(),
        }}
      />
    </Container>
  );
}

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const Box = styled.View`
  background-color: tomato;
  width: 200px;
  height: 200px;
`;

const AnimatedBox = Animated.createAnimatedComponent(Box);
