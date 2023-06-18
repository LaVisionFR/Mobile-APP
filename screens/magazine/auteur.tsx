import React from 'react';
import { View, Text, Image, FlatList, TouchableOpacity } from 'react-native';
import { useEffect, useState } from 'react';
import styles from '@styles/screens/magazine/auteur.scss';

import Nav from '@components/layout/nav';
import ScreenContainer from '@components/screen-container';
import { AuteurScreenProps } from '@utils/types';
import { ScrollView } from 'react-native-gesture-handler';
import notionManager, { Article } from '@controllers/notionManager';
import NotionCard from '@components/notion-card';
import Tag from '@components/tag';

const AuteurView = ({ route, navigation }: AuteurScreenProps) => {
    const { auteur } = route.params;
    const [DBContent, setDBContent] = useState<Article[]>([]);

    const fetchArticlesByAuthor = async () => {
        try {
            const articlesByAuthor = await notionManager.fetchArticlesByAuthor(auteur.id);
            setDBContent(articlesByAuthor);
        } catch (e) {
            console.log(e);
        }
    };
    
    useEffect(() => {
        fetchArticlesByAuthor(); 
      }, []);

    const navigateToArticle = (article: Article) => {
    // @ts-ignore
    navigation.navigate('Article', { article });
    };

    return (
        <ScreenContainer style={styles.screen}>
            <Nav currentScreen={auteur.name} goBack={navigation.goBack} />
            <View style={styles.container}>
                <Tag name={auteur.name} nameSection={`Écrit par ${auteur.name} :`} />
                <ScrollView showsVerticalScrollIndicator={true} horizontal={false} persistentScrollbar={true}> 
                    <FlatList
                        horizontal={true}
                        showsVerticalScrollIndicator={false}
                        showsHorizontalScrollIndicator={false}
                        style={styles.list}
                        data={DBContent}
                        renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => navigateToArticle(item)}>
                            <NotionCard style={styles.article} db={item} type='imersif'/>
                        </TouchableOpacity>
                        )}
                        // @ts-ignore
                        keyExtractor={(item) => item.articleId}
                    />
                </ScrollView>
            </View>
        </ScreenContainer>
    );
};

export default AuteurView;
