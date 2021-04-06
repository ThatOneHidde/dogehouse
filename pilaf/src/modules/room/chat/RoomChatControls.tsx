import { Room, RoomUser } from "@dogehouse/kebab";
import React, { useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  TextInput,
  TouchableOpacity,
  Image,
  View,
  StyleSheet,
} from "react-native";
import { colors, radius } from "../../../constants/dogeStyle";
import { useMuteStore } from "../../../global-stores/useMuteStore";
import { createChatMessage } from "../../../lib/createChatMessage";
import { useConn } from "../../../shared-hooks/useConn";
import { EmotePicker } from "./EmotePicker";

import { RoomChatMentions } from "./RoomChatMentions";
import { useRoomChatMentionStore } from "./useRoomChatMentionStore";
import { useRoomChatStore } from "./useRoomChatStore";

interface RoomChatControlsProps {}

export const RoomChatControls: React.FC<RoomChatControlsProps> = ({}) => {
  const { message, setMessage } = useRoomChatStore();
  const { muted, setInternalMute } = useMuteStore();
  const conn = useConn();
  const me = conn.user;
  const [isEmoji, setIsEmoji] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [lastMessageTimestamp, setLastMessageTimestamp] = useState<number>(0);

  let position = 0;

  return (
    <View style={{ backgroundColor: colors.primary800, paddingBottom: 25 }}>
      <View style={styles.toggle} />
      <View style={styles.controlsContainer}>
        <TouchableOpacity
          style={styles.micControl}
          onPress={() => setInternalMute(!muted)}
        >
          <Image
            source={
              muted
                ? require("../../../assets/images/SolidMicrophoneOff.png")
                : require("../../../assets/images/bxs-microphone.png")
            }
            style={{ tintColor: colors.text, height: 16, width: 16 }}
          />
        </TouchableOpacity>
        <View style={{ flexGrow: 1 }} />
        <TouchableOpacity style={styles.soundControl}>
          <Image
            source={require("../../../assets/images/ios-volume-low.png")}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.inviteControl}>
          <Image source={require("../../../assets/images/md-person-add.png")} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  toggle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.primary300,
    alignSelf: "center",
    marginTop: 15,
    marginBottom: 10,
  },
  controlsContainer: {
    flexDirection: "row",
    paddingHorizontal: 25,
  },
  micControl: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary700,
    borderRadius: radius.m,
    height: 50,
    width: 80,
  },
  soundControl: {
    height: 50,
    width: 50,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary700,
    borderRadius: 25,
    marginRight: 15,
  },
  inviteControl: {
    height: 50,
    width: 50,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary700,
    borderRadius: 25,
    paddingRight: 2.5,
  },
});
