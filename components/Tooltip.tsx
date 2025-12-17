import React, { useState, ReactNode } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, GestureResponderEvent, Dimensions } from 'react-native';

interface TooltipProps {
  text?: string | undefined;
  children: ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({ text, children }) => {
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const { width, height } = Dimensions.get('window');

  const handlePress = (event: GestureResponderEvent): void => {
    const { pageX, pageY } = event.nativeEvent;
    // Clamp position within screen bounds
    const safeX = Math.min(Math.max(pageX, 20), width - 120);
    const safeY = Math.min(Math.max(pageY, 60), height - 80);
    setPosition({ x: safeX, y: safeY });
    setVisible(true);
  };

  if (!text) return <>{children}</>;

  return (
    <>
      <TouchableOpacity onPress={handlePress} activeOpacity={0.7}>
        {children}
      </TouchableOpacity>

      <Modal transparent visible={visible} animationType="fade" onRequestClose={() => setVisible(false)}>
        <View style={styles.overlay}>
          <TouchableOpacity style={StyleSheet.absoluteFill} activeOpacity={1} onPress={() => setVisible(false)} />
          <View style={[styles.tooltip, { top: position.y - 110, left: position.x - 90 }]}>
            <Text style={styles.tooltipText}>{text}</Text>
            <View style={styles.arrow} />
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'flex-start',
  },
  tooltip: {
    position: 'absolute',
    backgroundColor: '#333',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    maxWidth: 200,
    zIndex: 9999,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  tooltipText: {
    color: '#fff',
    fontSize: 14,
  },
  arrow: {
    position: 'absolute',
    bottom: -6,
    left: '50%',
    marginLeft: -6,
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 6,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#333',
  },
});

export default Tooltip;
