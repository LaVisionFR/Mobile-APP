import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';

import styles from '@styles/screens/magazine/article.scss';

import Nav from '@components/layout/nav';
import ScreenContainer from '@components/screen-container';
import { ArticleScreenProps } from '@utils/types';
import { ScrollView } from 'react-native-gesture-handler';
import Group from '@components/group';
import notionManager, { BlockContent } from '@controllers/notionManager';
import { Linking } from 'react-native';

const ArticleView = ({ route, navigation }: ArticleScreenProps) => {
  const { article } = route.params
  const [articleContent, setArticleContent] = useState<BlockContent[]>([]);

  const fetchArticleContent = async () => {
    try {
      
      const content = await notionManager.fetchArticleContent(article.articleId);
      setArticleContent(content);
    } catch (e) {
      console.log(e);
    }
  };


  const getComponentStyles = (component: string) => {
    let s = styles[component];
    return s;
  }

  useEffect(() => {
    fetchArticleContent(); 
  }, []);

  return (
    <ScreenContainer style={styles.screen}>
      <Nav currentScreen={article.categorie[0]} goBack={navigation.goBack} />
      <ScrollView showsVerticalScrollIndicator={true} persistentScrollbar={false}>
        <Group>
          <Image source={{ uri: article.cover }} style={styles.coverImage} />
          <View style={styles.rightContainer}>
            <Text style={styles.categorie}>{article.categorie[0]}</Text>
            <Text style={styles.title}>{article.title}</Text>
            <Text style={styles.creationDate}>{article.creationDate.toLocaleDateString()}</Text>
          </View>
        </Group>
        <View style={styles.contentContainer}>
          {articleContent.map((block: BlockContent, index: number) => {
            switch (block.type) {
              case 'text':
                return <Text style={getComponentStyles(block.taille)} key={index}>{(block as any).content}</Text>;
                case 'link':
                  return (
                    <TouchableOpacity
                      onPress={() => Linking.openURL((block as any).content)}
                      key={index}
                    >
                      <Text style={getComponentStyles(block.taille)}>{(block as any).content}</Text>
                    </TouchableOpacity>
                  );
              case 'image':
                return <Image source={{ uri: (block as any).content }} style={getComponentStyles(block.taille)} key={index} />;
              default:
                return null;
            }
          })}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
};

export default ArticleView;
