import React, { ReactNode, useRef, useEffect } from "react";
import {
  View,
  StyleSheet,
  Animated,
  PanResponder,
  Dimensions,
} from "react-native";
import Modal from "react-native-modal";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

interface BottomSheetProps {
  isVisible: boolean;
  onClose: () => void;
  children: ReactNode;
  snapPoints?: number[]; // Snap points as percentages of screen height
  handlePosition?: "left" | "center" | "right"; // Position of the handle
}

export default function BottomSheet({
  isVisible,
  onClose,
  children,
  snapPoints = [0.2, 0.5, 0.8],
  handlePosition = "center",
}: BottomSheetProps) {
  const animatedValue = useRef(
    new Animated.Value(SCREEN_HEIGHT * snapPoints[0]),
  ).current;
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event([null, { dy: animatedValue }], {
        useNativeDriver: false,
        listener: (event, gestureState) => {
          animatedValue.setValue(
            SCREEN_HEIGHT * snapPoints[0] - gestureState.dy,
          );
        },
      }),
      onPanResponderRelease: (evt, gestureState) => {
        const snapTo = snapPoints.reduce((prev, curr) => {
          const currentPos = SCREEN_HEIGHT * curr;
          return Math.abs(currentPos - animatedValue._value) <
            Math.abs(SCREEN_HEIGHT * prev - animatedValue._value)
            ? curr
            : prev;
        }, snapPoints[0]);

        Animated.spring(animatedValue, {
          toValue: SCREEN_HEIGHT * snapTo,
          useNativeDriver: false,
        }).start();
      },
    }),
  ).current;

  const translateY = animatedValue.interpolate({
    inputRange: [0, SCREEN_HEIGHT],
    outputRange: [-SCREEN_HEIGHT, 0],
    extrapolate: "clamp",
  });

  const headerHeight = animatedValue.interpolate({
    inputRange: [-100, 0],
    outputRange: [250, 200],
    extrapolate: "clamp",
  });

  useEffect(() => {
    if (isVisible) {
      Animated.spring(animatedValue, {
        toValue: SCREEN_HEIGHT * snapPoints[1],
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(animatedValue, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start(onClose);
    }
  }, [isVisible]);

  const handleStyle = {
    alignSelf:
      handlePosition === "left"
        ? "flex-start"
        : handlePosition === "right"
        ? "flex-end"
        : "center",
  };

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      style={styles.modal}
      onSwipeComplete={onClose}
      swipeDirection="down"
    >
      <Animated.View
        style={[styles.sheetContainer, { transform: [{ translateY }] }]}
      >
        <Animated.View
          style={[styles.headerImageContainer, { height: headerHeight }]}
        >
          <View style={styles.imagePlaceholder} />
          <View
            style={[styles.handle, handleStyle]}
            {...panResponder.panHandlers}
          >
            <View style={styles.handleBar} />
          </View>
        </Animated.View>
        <View style={styles.content}>{children}</View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: {
    justifyContent: "flex-end",
    margin: 0,
  },
  sheetContainer: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: "hidden",
  },
  headerImageContainer: {
    width: "100%",
    overflow: "hidden",
    backgroundColor: "#ccc",
    position: "relative",
  },
  imagePlaceholder: {
    width: "100%",
    height: "100%",
    backgroundColor: "#ddd",
  },
  handle: {
    position: "absolute",
    top: -10,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  handleBar: {
    width: 40,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: "#ccc",
  },
  content: {
    padding: 16,
  },
});
