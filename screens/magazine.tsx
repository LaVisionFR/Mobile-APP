import React, { useEffect, useState } from 'react';
import { ScreenProps } from '@utils/types';
import ScreenContainer from '@components/screen-container';
import Brand from '@components/brand';
import styles from '@styles/screens/magazine.scss';
import { View, ScrollView, FlatList, TouchableOpacity, Text} from 'react-native';
import notionManager, { Article, Auteur } from '@controllers/notionManager';
import Card from '@components/notion-card';

import Tag from '@components/tag';

const Magazine = ({ navigation }: ScreenProps) => {
  const [DBContent, setDBContent] = useState<Article[]>([]);
  const [AuteurContent, setAuteurContent] = useState<Auteur[]>([]);
  const [ok, setOk] = useState(false);

  const fetchDatabaseByID = async () => {
    try {
      const page: Article[] = await notionManager.fetchDatabaseByID();
      setDBContent(page);
      fetchUser(page);
    } catch (e) {
      console.log(e);
    }
  };

  const fetchUser = async (page: Article[]) => {
    const promises = page.map((article) => notionManager.fetchUser(article.auteurId));
    
    const results: Auteur[] = await Promise.all(promises);
  
    const uniqueAuthors: Auteur[] = Array.from(new Set(results.map(a => a.name))).map(name => {
        return results.find(a => a.name === name)
    }) as Auteur[];
    
    setAuteurContent(prevState => [...prevState, ...uniqueAuthors]);
    
    setOk(true);
  };  
  
  useEffect(() => {
    fetchDatabaseByID(); 
  }, []);

  const navigateToArticle = (article: Article) => {
    // @ts-ignore
    navigation.navigate('Article', { article });
  };

  const navigateToAuteur = (auteur: Auteur) => {
    // @ts-ignore
    navigation.navigate('Auteur', { auteur });
  };

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

  return (
    <ScreenContainer style={styles.screen}>
      <ScrollView showsVerticalScrollIndicator={true} persistentScrollbar={true}>
        <Brand />
        <View style={styles.container}>
          <Tag name={"Toutes"} nameSection='Récemment publié :' />
          <FlatList
            horizontal={true}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            style={styles.list}
            data={DBContent}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => navigateToArticle(item)}>
                <Card style={styles.article} db={item} type='article'/>
              </TouchableOpacity>
            )}
            // @ts-ignore
            keyExtractor={(item) => item.articleId}
          />
          <Tag name={"Auteur"} nameSection='Par auteur :' />
          <FlatList
            horizontal={true}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            style={styles.list}
            data={AuteurContent}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => navigateToAuteur(item)}>
                <Card style={styles.auteur} auteurs={item} type='auteur' />
              </TouchableOpacity>
            )}
            // @ts-ignore
            keyExtractor={(item) => item.articleId}
          />
        </View>
      </ScrollView>
    </ScreenContainer>
  );
};

export default Magazine;
