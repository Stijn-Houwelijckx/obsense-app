import React, { useState } from "react";
import {
  Modal,
  Pressable,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Image,
  StyleSheet,
  Dimensions,
} from "react-native";
import FastImage from "react-native-fast-image";

import { XIcon, GridIcon, ListIcon } from "../icons";
import { COLORS } from "../../styles/theme";
import { globalStyles } from "../../styles/global";

const screenWidth = Dimensions.get("window").width;
const modalWidth = screenWidth - 32;

const ObjectSelectModal = ({ visible, onClose, objects, onSelect, style }) => {
  const [viewMode, setViewMode] = useState("grid"); // "list" or "grid"

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable style={modalStyles.overlay} onPress={onClose}>
        <Pressable
          style={[modalStyles.modalContent, { maxWidth: modalWidth }, style]}
          onPress={() => {}}
        >
          <View style={modalStyles.header}>
            <Text style={[globalStyles.headingH6SemiBold, modalStyles.title]}>
              Choose a Model
            </Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <TouchableOpacity
                onPress={() => setViewMode("grid")}
                style={[
                  modalStyles.toggleButton,
                  viewMode === "grid" && modalStyles.toggleButtonActive,
                ]}
              >
                <GridIcon size={24} stroke={COLORS.neutral[50]} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setViewMode("list")}
                style={[
                  modalStyles.toggleButton,
                  viewMode === "list" && modalStyles.toggleButtonActive,
                ]}
              >
                <ListIcon size={24} stroke={COLORS.neutral[50]} />
              </TouchableOpacity>
              <TouchableOpacity onPress={onClose} style={{ marginLeft: 24 }}>
                <XIcon size={24} stroke={COLORS.neutral[50]} />
              </TouchableOpacity>
            </View>
          </View>
          {viewMode === "list" ? (
            <ScrollView style={{ maxHeight: 300, width: "100%" }}>
              {objects.map((obj) => (
                <TouchableOpacity
                  key={obj.id}
                  style={modalStyles.objectItem}
                  onPress={() => onSelect(obj)}
                >
                  <Text
                    style={[
                      globalStyles.bodyMediumRegular,
                      modalStyles.objectName,
                    ]}
                  >
                    {obj.title}
                  </Text>
                </TouchableOpacity>
              ))}

              {objects.length === 0 && (
                <View>
                  <Text
                    style={[
                      globalStyles.bodySmallItalic,
                      { color: COLORS.neutral[300] },
                    ]}
                  >
                    No objects available.
                  </Text>
                </View>
              )}
            </ScrollView>
          ) : (
            <View>
              <FlatList
                data={objects}
                keyExtractor={(item) => item.id}
                numColumns={3}
                style={{ maxHeight: 300, width: "100%" }}
                contentContainerStyle={modalStyles.gridContainer}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={modalStyles.gridItem}
                    onPress={() => onSelect(item)}
                  >
                    <FastImage
                      style={modalStyles.gridImage}
                      source={item.thumbnail}
                      resizeMode="cover"
                    />
                  </TouchableOpacity>
                )}
              />

              {objects.length === 0 && (
                <View>
                  <Text
                    style={[
                      globalStyles.bodySmallItalic,
                      { color: COLORS.neutral[300] },
                    ]}
                  >
                    No objects available.
                  </Text>
                </View>
              )}
            </View>
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const modalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: COLORS.primaryNeutral[700],
    borderTopRightRadius: 32,
    borderTopLeftRadius: 32,
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    color: COLORS.neutral[50],
    flex: 1,
    marginRight: 8,
  },
  toggleButton: {
    padding: 4,
    marginHorizontal: 2,
    borderRadius: 4,
    backgroundColor: "transparent",
  },
  toggleButtonActive: {
    backgroundColor: COLORS.primary[500],
  },
  objectItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.primaryNeutral[600],
    width: "100%",
  },
  objectName: {
    color: COLORS.neutral[50],
  },
  gridContainer: {
    gap: 8,
  },
  gridItem: {
    flex: 1,
    gap: 8,
    alignItems: "center",
  },
  gridImage: {
    width: 100,
    height: 100,
    borderRadius: 16,
    backgroundColor: COLORS.primaryNeutral[600],
  },
});

export default ObjectSelectModal;
