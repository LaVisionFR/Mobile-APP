import { View, Text } from "react-native";
import React, { useContext, useState } from "react";
import { ScreenProps } from "@utils/types";
import Nav from "@components/layout/nav";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import CustomFlatList from "@components/flatlist";
import styles from "@styles/screens/features/ia.scss";
import ScreenContainer from "@components/screen-container";
import * as DocumentPicker from 'expo-document-picker';
import Button from "@components/button";
import { faPlay, faPause, faTrash, faCircle, faCheckCircle, faMicrophone } from "@fortawesome/free-solid-svg-icons";
import Group from "@components/group";
import { Context } from "@utils/context";
import RecordingManager from "@controllers/recordingManager";
import AudioManager from "@controllers/audioManager";
import { Platform } from "react-native";
import { useCallback } from 'react';

const Ia = ({ navigation }: ScreenProps) => {
  const { recording, setRecordingBase64 } = useContext(Context);
  const [isRecording, setRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState<{ [key: number]: boolean }>({});
  const [isSelected, setIsSelected] = useState<{ [key: number]: boolean }>({});

  const startRecording = async () => {
    try {
      RecordingManager.startRecording();
      setRecording(true);
      console.log('Recording started');
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  };

  const stopRecording = async () => {
    console.log('Stopping recording..');
    await RecordingManager.stopRecording();
    setRecording(false);

    const recordingUri = RecordingManager.getRecordingUri();

    if (Platform.OS === 'web') {
      const fileContent = await AudioManager.getFileFrom(recordingUri);
      return handleAudioToggle(fileContent);
    }

    const cacheUri = await AudioManager.copyToTheCache(recordingUri);
    return handleAudioToggle(cacheUri);
  };

  const handleAudioToggle = (lastRecorded: string, name?: string) => {
    const newList = [...recording];
    const id = newList.length + 1;

    newList.push({
      id: id,
      uri: lastRecorded,
      name: name ? name : 'Record ' + id,
      date: new Date(),
      selected: isSelected[id] ? isSelected[id] : false,
    });

    setRecordingBase64(newList);
  };

  const handleFileUpload = async () => {
    const file = await DocumentPicker.getDocumentAsync({
      type: ['*/*'],
      copyToCacheDirectory: true,
    });

    if (file.type === 'success') {
      if (!file.mimeType?.match(/audio/g)) {
        return alert('Le format de votre fichier n\'est pas celui attendu (audio)');
      }

      const fileName = file.name.split('.')[0];

      if (Platform.OS === 'web') {
        const fileContent = await AudioManager.getFileFrom(file.uri);
        return handleAudioToggle(fileContent, fileName);
      }

      return handleAudioToggle(file.uri, fileName);
    }
  };

  const startPlaying = async (id: number) => {
    console.log('Loading Sound');
    try {
      console.log(recording[recording.length - 1]?.uri);
      AudioManager.startPlaying(recording[recording.length - 1]?.uri);
      setIsPlaying(prevState => ({
        ...prevState,
        [id]: true,
      }));
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  };

  const stopPlaying = async (id: number) => {
    console.log('Stopping Sound');
    try {
      await AudioManager.stopPlaying();
      setIsPlaying(prevState => ({
        ...prevState,
        [id]: false,
      }));
    } catch (error) {
      console.error('Error stopping sound:');
      console.error(error);
    }
  };

  const clearAllAudio = async () => {
    if (isPlaying) {
      await AudioManager.stopPlaying();
    }

    setRecordingBase64([]);
  };

  const clearAudio = async (id: number) => {
    if (isPlaying[id]) {
      await AudioManager.stopPlaying();
      setIsPlaying(prevState => ({
        ...prevState,
        [id]: false,
      }));
    }

    const newList = recording.filter(item => item.id !== id);
    setRecordingBase64(newList);
  };

  const selectRecord = useCallback((id: number) => {
    setIsSelected(prevState => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  
    const newList = [...recording];
    const index = newList.findIndex(item => item.id === id);
    newList[index].selected = !newList[index].selected;
    setRecordingBase64(newList);
  }, [recording]);

  const renderItem = ({ item }: any) => (
    <View style={styles.itemContainer}>
      <Group>
        <Button
          style={styles.selectButton}
          icon={item.selected ? faCheckCircle : faCircle}
          onPress={() => selectRecord(item.id)}
        />
        <Text style={styles.itemText}>{item.name}</Text>
        <Button
          style={styles.button}
          icon={isPlaying[item.id] ? faPause : faPlay}
          onPress={() => (isPlaying[item.id] ? stopPlaying(item.id) : startPlaying(item.id))}
        />
        <Button
          style={styles.button}
          icon={faTrash}
          onPress={() => (clearAudio(item.id))}
        />
      </Group>
    </View>
  );

  const choix = recording.filter(item => item.selected === true);

  const doNext = async (screen: string) => {
    if (isPlaying) {
      await AudioManager.stopPlaying();
      setIsPlaying({});
    }

    // @ts-ignore
    navigation.replace(screen);
  };

  return (
    <ScreenContainer style={styles.screen}>
      <Nav
        currentScreen="Voice Changer"
        goBack={navigation.goBack}
      />

      <Button
        icon={faMicrophone}
        style={styles.button}
        title={isRecording ? 'Stop Recording' : 'Start Recording'}
        onPress={isRecording ? stopRecording : startRecording}
      />

      <Text style={styles.title}>Mes audios ({recording ? recording.length : 0}) :</Text>
      <Text style={styles.description} onPress={clearAllAudio}>Clear all audio</Text>

      <Group>
        <GestureHandlerRootView>
          <View style={styles.pagination}>
            <CustomFlatList
              data={recording}
              keyExtractor={(item) => item?.id?.toString()}
              renderItem={renderItem}
            />
          </View>
        </GestureHandlerRootView>
      </Group>
    </ScreenContainer>
  );
};

export default Ia;
