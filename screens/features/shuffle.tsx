import { View, Text, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { ScreenProps } from "@utils/types";

import { useIsFocused } from '@react-navigation/native';

import styles from "@styles/screens/features/shuffle.scss";

import Nav from "@components/layout/nav";
import Card from "@components/spotify-card";
import ScreenContainer from "@components/screen-container";

import Tag from "@components/tag";
import Group from "@components/group";

import spotifyManager, { ArtistInfo } from "@controllers/spotifyManager";
import Button from "@components/button";
import { faRotateRight } from "@fortawesome/free-solid-svg-icons";

const Shuffle = ({ navigation }: ScreenProps) => {
  const [track, setTrack] = useState<any>(null);
  const [recommendations, setRecommendations] = useState<ArtistInfo[]>([]);

  const isFocused = useIsFocused();

  useEffect(() => {
    const fetchData = async () => {
        const playlistIDs = [
        // LaVision - VisionRap #1
        '1gYzarMc0KHM8ncxqMEUZq', 
        // CultureRap - 232 Celsius
        '1ONYEAEFpkMYPu1PPyRCfA',
        // Rap Club - Le club
        '3g7LUX00FE09Yyd0lLLeal',
        // Mon Club Rap - 1000 auditeurs 
        '5gyQju6JsASNqfjHdb9SH0',
        // Otautune - Rap FR
        '5gyQju6JsASNqfjHdb9SH0',
        // 21% - Playlist du fonda,
        '1lETuHIDKqgcpTmBi2jxHo',
        // La pépite - La Peplyste
        '4UXOUhKrtj888wviYkoEn3',
        // PompList 
        '5hxISygmeo96wiL52TMGPT'
    ];
        // 
        const randomPlaylistID = await spotifyManager.getRandomPlaylistID(playlistIDs);
        const randomTrack = await spotifyManager.getRandomTrackFromPlaylist(randomPlaylistID);
        const recommendations = await spotifyManager.getRecommendations(randomTrack.track.id);

        setTrack(randomTrack);
        setRecommendations(recommendations);
    };

    fetchData();
  }, [isFocused]);

  return (
    <ScreenContainer style={styles.screen}>
        <Nav currentScreen="Shuffle Mood" goBack={navigation.goBack} />
        <ScrollView showsVerticalScrollIndicator={true} persistentScrollbar={true}>
            <Tag name={"ONE SHOT"} nameSection='La recommandation :' />
            <ScrollView horizontal showsHorizontalScrollIndicator={false} >
                <Group>
                {track && (
                    <Card   
                        artist={track.track.name}
                        imgArtist={track.track.album.images[0].url}
                        subArtist={track.track.album.album_type.charAt(0).toUpperCase() + track.track.album.album_type.slice(1) + " - " + track.track.artists[0].name}
                        spotifyUrl={track.track.external_urls.spotify}
                    />
                )}
                </Group>
            </ScrollView>
            <Tag name={"Similaires"} nameSection='Les artistes similaires :' />
            <ScrollView horizontal showsHorizontalScrollIndicator={false} >
                <Group>
                {recommendations.length > 0 && recommendations.map((artist: ArtistInfo, index: number) => (
                    <Card
                        key={index}
                        artist={`${artist.name}`}
                        imgArtist={`${artist.imageUrl}`}
                        subArtist={`${artist.follower} followers`}
                        spotifyUrl={`${artist.externalUrl}`}
                    />
                ))}
                </Group>
            </ScrollView>
            {/* <Button 
                title="Recommencer"
                icon={faRotateRight}
                // @ts-ignore
                onPress={() => navigation.navigate("Shuffle")}
            /> */}
        </ScrollView>
    </ScreenContainer>
  );
};

export default Shuffle;
