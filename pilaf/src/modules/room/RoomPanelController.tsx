import { JoinRoomAndGetInfoResponse } from "@dogehouse/kebab";
import { useNavigation } from "@react-navigation/core";
import React, { useEffect, useRef } from "react";
import {
  Button,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { TitledHeader } from "../../components/header/TitledHeader";
import { colors } from "../../constants/dogeStyle";
import { useCurrentRoomIdStore } from "../../global-stores/useCurrentRoomIdStore";
import { isUuid } from "../../lib/isUuid";
import { useWrappedConn } from "../../shared-hooks/useConn";
import { useTypeSafeMutation } from "../../shared-hooks/useTypeSafeMutation";
import { useTypeSafeQuery } from "../../shared-hooks/useTypeSafeQuery";
import { RoomUsersPanel } from "./RoomUsersPanel";
import { Spinner } from "../../components/Spinner";
import { RoomHeader } from "../../components/header/RoomHeader";
import { setMute, useSetMute } from "../../shared-hooks/useSetMute";
import { useMuteStore } from "../../global-stores/useMuteStore";
import { RoomChat } from "./chat/RoomChat";
import { UserPreviewModal } from "../../components/UserPreview";
import BottomSheet from "reanimated-bottom-sheet";
import { useSafeAreaInsets } from "react-native-safe-area-context";
interface RoomPanelControllerProps {
  roomId?: string | undefined;
}

const placeHolder = (
  <View
    style={{
      flex: 1,
      backgroundColor: colors.primary900,
    }}
  >
    <TitledHeader title={""} showBackButton={true} />
    <Spinner size={"m"} />
  </View>
);

export const RoomPanelController: React.FC<RoomPanelControllerProps> = ({
  roomId,
}) => {
  const conn = useWrappedConn();
  const { mutateAsync: leaveRoom } = useTypeSafeMutation("leaveRoom");
  const navigation = useNavigation();
  const { currentRoomId, setCurrentRoomId } = useCurrentRoomIdStore();
  const isANewRoom = currentRoomId !== roomId;
  const setInternalMute = useSetMute();
  const muted = useMuteStore((s) => s.muted);
  const sheetRef = useRef(null);
  const inset = useSafeAreaInsets();
  const { data, isLoading } = useTypeSafeQuery(
    ["joinRoomAndGetInfo", roomId || ""],
    {
      enabled: isUuid(roomId),
      onSuccess: ((d: JoinRoomAndGetInfoResponse | { error: string }) => {
        if (!("error" in d)) {
          setCurrentRoomId(() => d.room.id);
          if (currentRoomId !== d.room.id) {
            useRoomChatStore.getState().reset();
          }
        }
      }) as any,
    },
    [roomId]
  );

  useEffect(() => {
    if (isLoading) {
      return;
    }
    if (!data) {
      setCurrentRoomId(null);
      navigation.navigate("Home");
      return;
    }
    if ("error" in data) {
      setCurrentRoomId(null);
      //showErrorToast(data.error);
      navigation.navigate("Home");
    }
  }, [data, isLoading, navigation.navigate, setCurrentRoomId]);

  if (isLoading || !currentRoomId) {
    return placeHolder;
  }

  if (!data || "error" in data) {
    return null;
  }

  const roomCreator = data.users.find((x) => x.id === data.room.creatorId);

  const renderChat = () => <RoomChat {...data} style={{ height: "100%" }} />;
  // const renderChat = () => (
  //   <View style={{ backgroundColor: "green", height: "100%" }} />
  // );

  return (
    <>
      <View style={{ flex: 1, backgroundColor: colors.primary900 }}>
        <RoomHeader
          showBackButton={true}
          onLeavePress={() => {
            leaveRoom([]);
            setCurrentRoomId(null);
            navigation.navigate("Home");
          }}
          roomTitle={data.room.name}
          roomSubtitle={data.room.peoplePreviewList
            .filter((u) => u.id === data.room.creatorId)
            .map((u) => u.displayName)
            .join(", ")}
        />
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[styles.avatarsContainer]}
        >
          <RoomUsersPanel {...data} />
        </ScrollView>
      </View>
      <UserPreviewModal {...data} />
      <BottomSheet
        ref={sheetRef}
        snapPoints={["95%", 70 + inset.bottom]}
        borderRadius={20}
        renderContent={renderChat}
      />
    </>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    padding: 20,
    flex: 1,
  },
  avatarsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  avatar: {
    marginRight: 10,
    marginBottom: 10,
  },
});
