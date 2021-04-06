import React from "react";
import {
  StyleProp,
  StyleSheet,
  ViewStyle,
  Text,
  View,
  ImageSourcePropType,
} from "react-native";
import { colors, paragraph, radius } from "../../constants/dogeStyle";
import { useMuteStore } from "../../global-stores/useMuteStore";
import { BoxedIcon } from "./BoxedIcon";
import { useCurrentRoomIdStore } from "../../global-stores/useCurrentRoomIdStore";
import * as RootNavigation from "../../navigators/RootNavigation";
import { useSetMute } from "../../shared-hooks/useSetMute";
import { useOnRoomPage } from "../../modules/room/useOnRoomPage";
import { MultipleUserAvatar } from "../avatars/MultipleUserAvatar";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useCurrentRoomInfo } from "../../shared-hooks/useCurrentRoomInfo";
import { useTypeSafeQuery } from "../../shared-hooks/useTypeSafeQuery";
import { Room, RoomUser } from "@dogehouse/kebab";

interface MinimizedRoomCardProps {
  style?: StyleProp<ViewStyle>;
  onPress: () => void;
  room: {
    name: string;
    speakerAvatars: ImageSourcePropType[];
    speakers?: string[];
    roomStartedAt: Date;
    myself: {
      isSpeaker?: boolean;
      isMuted: boolean;
      isDeafened?: boolean;
      switchMuted(): void;
      switchDeafened?: () => void;
      leave?: () => void;
    };
  };
}

export const MinimizedRoomCard: React.FC<MinimizedRoomCardProps> = ({
  style,
  room,
  onPress,
}) => {
  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity
        style={styles.roomInfo}
        containerStyle={{ flex: 1 }}
        onPress={onPress}
      >
        {room.speakerAvatars.length > 0 && (
          <MultipleUserAvatar size="xs" srcArray={room.speakerAvatars} />
        )}
        <Text
          style={{ ...paragraph, marginHorizontal: 10, flex: 1 }}
          numberOfLines={1}
        >
          {room.name}
        </Text>
      </TouchableOpacity>
      <BoxedIcon
        image={require("../../assets/images/bxs-microphone.png")}
        imageColor={room.myself.isMuted ? colors.text : colors.accent}
        onPress={() => room.myself.switchMuted()}
        style={{ width: 60 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: colors.primary800,
    borderColor: colors.accent,
    borderRadius: radius.m,
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    shadowColor: colors.accent,
    shadowOpacity: 0.15,
    shadowRadius: 20,
    width: 295,
  },
  roomInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
});
