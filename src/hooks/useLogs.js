import { useState } from "react";
// import { Alert } from "react-native";
import Clipboard from "@react-native-clipboard/clipboard";

const useLogs = () => {
  const [logs, setLogs] = useState([]);

  const addLog = (message) => {
    setLogs((prevLogs) => [...prevLogs, message]);
  };

  const clearLogs = () => {
    setLogs([]);
  };

  const copyLogsToClipboard = () => {
    const logsText = logs.join("\n");
    Clipboard.setString(logsText);
    // Alert.alert("Logs Copied", "The logs have been copied to your clipboard.");
  };

  return { logs, addLog, clearLogs, copyLogsToClipboard };
};

export default useLogs;
