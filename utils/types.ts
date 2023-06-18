import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RouteProp } from '@react-navigation/native';
import { Article, Auteur } from '@controllers/notionManager';

type RootStackParamList = {
  Article: { article: Article };
  Auteur: { auteur: Auteur };
};

type ScreenRouteProp<T extends keyof RootStackParamList = never> = RouteProp<RootStackParamList, T>;

export type ScreenProps<T extends keyof RootStackParamList = never> = NativeStackScreenProps<RootStackParamList, T> & {
  route: ScreenRouteProp<T>;
};

export type ArticleScreenProps = ScreenProps<'Article'>;
export type AuteurScreenProps = ScreenProps<'Auteur'>;
