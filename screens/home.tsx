import { ScreenProps } from '@utils/types';
import ScreenContainer from '@components/screen-container';
import Brand from '@components/brand';
import Group from '@components/group';

import SpotifyManager from '@controllers/spotifyManager';

import { ScrollView, View, Text } from 'react-native';

import Tag from '@components/tag';
import Card from '@components/spotify-card';
import SocialNetworks from '@components/social-networks';

import styles from '@styles/screens/home.scss';
import { useState, useEffect } from 'react';

const Home = ({ navigation }: ScreenProps) => {
    const artistSection = "37CtVHnk0CvpjWcKl6NMj3";

    const albumSection = "2IusocliYD1gxuBE0MVlxA";

    const [artistList, setArtistList]: any = useState();
    const [albumList, setAlbumList]: any = useState();
    const [ok, setOk] = useState(false);

    async function fetchHome() {
        const artistListInfo = await SpotifyManager.getPlaylistByID(artistSection, true);
        const albumListInfo = await SpotifyManager.getPlaylistByID(albumSection, false);
        setArtistList(artistListInfo);
        setAlbumList(albumListInfo);
        setOk(true);
    }

    useEffect(() => {
        fetchHome();
    }, []);

    if (!ok) {
        return (
            <ScreenContainer style={styles.screen}>
                <Brand />
                <View style={styles.container}>
                    <Text style={styles.header}>Veuillez patienter, une action est en cours...</Text>
                </View>
            </ScreenContainer>
        );
    }

    // render

    const renderArtists = () => {
        return artistList.map((artist: any, index: number) => (
            <Card
                key={index}
                artist={`${artist.name}`}
                imgArtist={`${artist.imageUrl}`}
                subArtist={`${artist.follower} followers`}
                spotifyUrl={`${artist.externalUrl}`}            
            />
        ));
    };
    
    const renderAlbums = () => {
        let nbKey = 0;
        return albumList.map((album: any, index: number) => (
            <Card
                key={index}
                artist={`${album.name}`}
                imgArtist={`${album.imageUrl}`}
                subArtist={`${album.albumType} - ${album.artist}`}
                spotifyUrl={`${album.externalUrl}`}            
            />
        ));
    };

    return (
        <ScreenContainer style={styles.screen}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <Brand />
                <Tag name={"Artistes"} nameSection='Les perles rares :' />
                <ScrollView horizontal showsHorizontalScrollIndicator={false} >
                    <Group>
                        { renderArtists() }
                    </Group>
                </ScrollView>
                <Tag name={"Albums"} nameSection='Projets qui nous ont séduits :' />
                <ScrollView horizontal showsHorizontalScrollIndicator={false} >
                    <Group>
                        { renderAlbums() }
                    </Group>
                </ScrollView>
                <Tag name={"LaVision"} nameSection='Nos réseaux sociaux :' />
                <Group>
                    <SocialNetworks name={"Twitter"} url='https://twitter.com/LaVisionFR' />
                    <SocialNetworks name={"Instagram"} url='https://instagram.com/LaVisionFR' />
                    <SocialNetworks name={"Spotify"} url='https://open.spotify.com/user/31vtkhgezfmxlx2g6l4t65shqoc4' />
                </Group>
            </ScrollView>
        </ScreenContainer>
    );
}

export default Home;
