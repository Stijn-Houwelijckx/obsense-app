import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
} from "react-native";
import Video from "react-native-video";

import { COLORS } from "../../styles/theme";

import { XIcon } from "../icons";

import IconButton from "./IconButton";
import CustomButton from "./CustomButton";

const { width: screenWidth } = Dimensions.get("window");

const SPEEDS = [1, 2, 3, 4, 5];

const TutorialOverlay = ({
  videos,
  initialIndex = 0,
  autoAdvance = true,
  allowSkip = true,
  loop = false,
  onClose,
}) => {
  const videoPlayerRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [durations, setDurations] = useState(videos.map(() => 0));
  const [progress, setProgress] = useState(videos.map(() => 0));
  const [playbackRate, setPlaybackRate] = useState(1.0);

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  const handleVideoEnd = () => {
    if (autoAdvance && currentIndex < videos.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else if (loop) {
      setCurrentIndex(0);
    }
  };

  const handleProgress = ({ currentTime }) => {
    const newProgress = [...progress];
    newProgress[currentIndex] = currentTime;
    setProgress(newProgress);
  };

  const handleLoad = (meta) => {
    const newDurations = [...durations];
    newDurations[currentIndex] = meta.duration;
    setDurations(newDurations);

    const newProgress = [...progress];
    newProgress[currentIndex] = 0;
    setProgress(newProgress);
  };

  const goToPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      // skip to the start of the video if it's the first one
      videoPlayerRef.current.seek(0);
    }
  };

  const goToNext = () => {
    if (currentIndex < videos.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // skip to the end of the video if it's the last one
      videoPlayerRef.current.seek(durations[currentIndex]);
    }
  };

  const cycleSpeed = () => {
    const currentIndex = SPEEDS.indexOf(playbackRate);
    const nextIndex = (currentIndex + 1) % SPEEDS.length;
    setPlaybackRate(SPEEDS[nextIndex]);
  };

  const closeOverlay = () => {
    if (onClose) {
      setProgress(videos.map(() => 0));
      setDurations(videos.map(() => 0));
      setCurrentIndex(initialIndex);
      setPlaybackRate(1.0);
      onClose();
    }
  };

  if (!videos || videos.length === 0) {
    return (
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Video */}
          <View style={styles.videoContainer}>
            <View style={styles.controlsContainer}>
              {/* Close button */}
              <IconButton
                icon={XIcon}
                onPress={closeOverlay}
                buttonSize={40}
                iconSize={20}
                style={styles.closeButton}
              />
            </View>

            <Text style={styles.title}>No videos available</Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.overlay}>
      <View style={styles.container}>
        {/* Title */}
        <Text style={styles.title}>{videos[currentIndex].title}</Text>
        {/* Video */}
        <View style={styles.controlsContainer}>
          {/* Speed button */}
          <TouchableOpacity onPress={cycleSpeed} style={styles.speedContainer}>
            <Text style={styles.speed}>{playbackRate}x</Text>
          </TouchableOpacity>
          {/* Progress Bars */}
          <View style={styles.progressBarsContainer}>
            {allowSkip ? (
              videos.map((video, index) => {
                let barWidth = "0%";
                let barColor = COLORS.neutral[300];

                if (index < currentIndex) {
                  barWidth = "100%";
                  barColor = COLORS.primary[500];
                } else if (index === currentIndex) {
                  const percent = durations[index]
                    ? (progress[index] / durations[index]) * 100
                    : 0;
                  barWidth = `${percent}%`;
                  barColor = COLORS.primary[500];
                }
                return (
                  <View key={index} style={styles.barContainer}>
                    <View
                      style={[
                        styles.bar,
                        {
                          width: barWidth,
                          backgroundColor: barColor,
                        },
                      ]}
                    />
                  </View>
                );
              })
            ) : (
              <View style={styles.barContainer}>
                <View
                  style={[
                    styles.bar,
                    {
                      width: durations[currentIndex]
                        ? `${
                            (progress[currentIndex] / durations[currentIndex]) *
                            100
                          }%`
                        : "0%",
                      backgroundColor: COLORS.primary[500],
                    },
                  ]}
                />
              </View>
            )}
          </View>
          {/* Close button */}
          <IconButton
            icon={XIcon}
            onPress={closeOverlay}
            buttonSize={40}
            iconSize={20}
            style={styles.closeButton}
          />
        </View>
        <View style={styles.videoContainer}>
          <Video
            key={currentIndex}
            ref={videoPlayerRef}
            source={videos[currentIndex].source}
            style={styles.video}
            resizeMode="cover"
            onEnd={handleVideoEnd}
            onProgress={handleProgress}
            onLoad={handleLoad}
            paused={false}
            progressUpdateInterval={100}
            rate={playbackRate}
          />

          {allowSkip && (
            <>
              {/* Left touch area */}
              <TouchableWithoutFeedback onPress={goToPrev}>
                <View style={styles.touchLeft} />
              </TouchableWithoutFeedback>

              {/* Right touch area */}
              <TouchableWithoutFeedback onPress={goToNext}>
                <View style={styles.touchRight} />
              </TouchableWithoutFeedback>
            </>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    zIndex: 1000,
    position: "absolute",
    top: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.9)",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
  container: {
    backgroundColor: COLORS.primaryNeutral[800],
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    padding: 16,
    paddingBottom: 10,
    width: screenWidth - 32, // Adjusted for padding
    height: "90%", // Fixed height for the overlay
  },
  controlsContainer: {
    zIndex: 10,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 8,
    gap: 8,
    borderRadius: 9999,
    marginBottom: 8,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },

  progressBarsContainer: {
    flex: 1,
    flexDirection: "row",
    gap: 4,
    borderRadius: 9999,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    padding: 4,
    borderRadius: 9999,
    overflow: "hidden",
  },
  barContainer: {
    flex: 1,
    height: 4,
    backgroundColor: COLORS.neutral[300],
    borderRadius: 9999,
  },
  bar: {
    height: "100%",
    borderRadius: 999,
  },

  closeButton: {},
  closeText: {
    color: "white",
    fontSize: 20,
  },
  title: {
    color: "white",
    fontSize: 18,
    marginBottom: 12,
    textAlign: "center",
  },
  videoContainer: {
    // width: screenWidth - 40, // Adjusted for padding
    height: "80%",
    aspectRatio: 196 / 425,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.neutral[600],
  },
  video: {
    width: "100%",
    height: "100%",
  },
  touchLeft: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: "50%",
    // backgroundColor: "red",
  },
  touchRight: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    width: "50%",
    // backgroundColor: "blue",
  },
  skipButton: {
    // marginTop: 20,
  },
  skipText: {
    color: "#000",
    fontWeight: "bold",
  },
  speedContainer: {
    backgroundColor: COLORS.primaryNeutral[800],
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 9999,
  },
  speed: {
    color: COLORS.neutral[300],
    textAlign: "center",
  },
});

export default TutorialOverlay;
