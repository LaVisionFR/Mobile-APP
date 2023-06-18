import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Article, Auteur } from '@controllers/notionManager';
import styles from '@styles/components/notion-card.scss';
import { StyleProp } from 'react-native';

import defaultAvatar from '@assets/images/default-avatar.png';

interface NotionCardProps {
  db?: Article,
  auteurs?: Auteur,
  type: "article" | "auteur" | "imersif",
  style?: StyleProp<any>;
}

const NotionCard = (
  {  
    db,
    auteurs,
    type,
    style
  }: NotionCardProps
) => {

  const getStyles = () => {
    let s = styles.container;
    if (style) s = { ...s, ...style };
    return s;
  }

  const getComponentStyles = (component: string) => {
    let s = styles[component];
    return s;
  }

  const getImageSource = () => {
    const dataUri = getData("uri");
    { /* @ts-ignore */ }
    if (dataUri && dataUri.uri) {
      return dataUri;
    } else {
      return require("@assets/images/default-avatar.png");
    }
  };

  
  const getData = (item: string) => {
    if(type === "auteur" && auteurs) {
      switch (item) {
        case "uri":
          return {uri: auteurs.avatar_url};  
        case "title":
          let name = auteurs.name.split(" ");
          return name[0];
      }
    }

    if(type === "article" || type === "imersif") {
      if(!db) return;
      switch (item) {
        case "uri":
          return {uri: db.cover}; 
        case "title":
          return db.title;
        case "date":
          return db.creationDate.toLocaleDateString();
      }
    }

  }

  const getCoverImageStyles = () => {
    if (type === 'article') {
        return styles.coverImageArticle;
    } else if (type === 'auteur') {
        return styles.coverImageAuteur;
    } else if (type === 'imersif') {
        return styles.coverImageImersif;
    }
  };

  const getTitleStyles = () => {
    if (type === 'article') {
        return styles.titleArticle;
    } else if (type === 'auteur') {
        return styles.titleAuteur;
    } else if (type === 'imersif') {
        return styles.titleImersif;
    }
  };

  return (
    <View style={getStyles()}>
      <Image source={getImageSource()} style={getCoverImageStyles()} />
      <View style={getComponentStyles("cardContainer")}>
        { /* @ts-ignore */ }
        <Text style={getTitleStyles()}>{getData("title")}</Text>
        { /* @ts-ignore */ }
        { type !== 'auteur' && <Text style={getComponentStyles("creationDate")}>Publié le {getData("date")}</Text> }
      </View>
    </View>
  );
};

export default NotionCard;
