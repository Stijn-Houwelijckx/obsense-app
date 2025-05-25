import React from "react";
import {
  Modal,
  Pressable,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { XIcon } from "../icons";
import { COLORS } from "../../styles/theme";
import { globalStyles } from "../../styles/global";

const screenWidth = Dimensions.get("window").width;
const modalWidth = screenWidth - 32;

const ReportModal = ({ visible, onClose, reasons, onSelectReason }) => (
  <Modal
    visible={visible}
    transparent
    animationType="fade"
    onRequestClose={onClose}
  >
    <Pressable style={modalStyles.overlay} onPress={onClose}>
      <Pressable style={modalStyles.reportContent} onPress={() => {}}>
        <View style={modalStyles.header}>
          <Text style={[globalStyles.headingH6SemiBold, modalStyles.title]}>
            Why are you reporting this artwork?
          </Text>
          <TouchableOpacity onPress={onClose}>
            <XIcon size={24} stroke={COLORS.neutral[50]} />
          </TouchableOpacity>
        </View>
        <Text style={[globalStyles.bodyMediumRegular, modalStyles.description]}>
          Your report is anonymous. Please select a reason below:
        </Text>
        {reasons.map((reason) => (
          <TouchableOpacity
            key={reason}
            style={modalStyles.reasonButton}
            onPress={() => onSelectReason(reason)}
          >
            <Text
              style={[globalStyles.bodyMediumRegular, modalStyles.reasonText]}
            >
              {reason}
            </Text>
          </TouchableOpacity>
        ))}
      </Pressable>
    </Pressable>
  </Modal>
);

const modalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  reportContent: {
    backgroundColor: COLORS.primaryNeutral[700],
    borderRadius: 12,
    padding: 24,
    minWidth: 280,
    alignItems: "flex-start",
    elevation: 5,
    maxWidth: modalWidth,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 16,
  },
  title: {
    color: COLORS.neutral[50],
    flex: 1,
    marginRight: 8,
  },
  description: {
    color: COLORS.neutral[300],
    marginBottom: 16,
  },
  reasonButton: {
    paddingVertical: 10,
    width: "100%",
  },
  reasonText: {
    color: COLORS.neutral[50],
  },
});

export default ReportModal;
