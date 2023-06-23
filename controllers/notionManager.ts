import { proc } from "react-native-reanimated";

export interface Article {
  articleId: string;
  title: string;
  creationDate: Date;
  cover: string;
  enVedette: boolean;
  categorie: string[];
  auteurId: string;
}

export interface Auteur {
  id: string;
  avatar_url: string;
  name: string;
  email: string;
}

export interface BlockContent {
  type: 'text' | 'image' | 'video' | 'link';
  taille: 'paragraph' | 'heading1' | 'heading2' | 'heading3' | 'video' | 'link';
  content: string;
}

class notionManager {
  private _NOTION_API: string;
  private _NOTION_SECRET: any;
  private _NOTION_DATABASE_ID: any;

  constructor() {
    this._NOTION_API = 'https://api.notion.com/v1/';
    this._NOTION_SECRET = process.env.NOTION_SECRET;
    this._NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID;
  }
  
  public async fetchPage(pageId: string) {
    const response = await fetch(`${this._NOTION_API}/pages/${pageId}`, {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + this._NOTION_SECRET,
            'Notion-Version': '2022-06-28',
        }
    });
    
    if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const page = await response.json();
    return page;
  }
  public async fetchBlockChildren(blockId: string) {
    const response = await fetch(`${this._NOTION_API}blocks/${blockId}/children`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${this._NOTION_SECRET}`,
        'Notion-Version': '2022-06-28',
      },
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();
    return result.results;
  }

  public async fetchDatabaseByID() {

    const filterOptions = {
      property: 'Publié',
      checkbox: {
        equals: true
      }
    };
  
    const reponse = await fetch(`https://api.notion.com/v1/databases/${this._NOTION_DATABASE_ID}/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this._NOTION_SECRET}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        filter: filterOptions
      })
    });

    if (!reponse.ok) {
      throw new Error(`Error ${reponse.status}: ${reponse.statusText}`);
    }

    const result = await reponse.json();
    
    let articles: Article[] = [];
    
    result.results.map((article: any) => {
      const articleId = article.id;
      const titre = article.properties.Name.title[0].plain_text;
      const dateCreate: Date = new Date(article.created_time);
      let cover: string;
      if(article.cover.external != null) {
        cover = article.cover.external.url;
      } else {
        cover = article.cover.file.url;
      }
      const enVedette: boolean = article.properties["En Vedette"].checkbox;
      let categorie: string[] = []; 
      article.properties.Catégorie.multi_select.map((cat: any) => {
        const name = cat.name;
        categorie.push(name);
      });
      let auteurId: string = article.created_by.id;

      articles.push({
        articleId: articleId,
        title: titre,
        creationDate: dateCreate,
        cover: cover,
        enVedette: enVedette,
        categorie: categorie,
        auteurId: auteurId
      });
    });    

    return articles;
  };

  public async fetchUser(userId: string): Promise<Auteur> {
    const response = await fetch(`https://api.notion.com/v1/users/${userId}`, {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + this._NOTION_SECRET,
            'Notion-Version': '2022-06-28',
        }
    });

    if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const user = await response.json();

    const auteur: Auteur = {
      id: user.id,
      avatar_url: user.avatar_url,
      name: user.name,
      email: user.email
    };

    return auteur;
  }

  public async fetchArticlesByAuthor(authorId: string): Promise<Article[]> {
    const allArticles = await this.fetchDatabaseByID();
  
    const articlesByAuthor = allArticles.filter(article => article.auteurId === authorId);
  
    return articlesByAuthor;
  }


  
  public async fetchArticleContent(articleId: string): Promise<BlockContent[]> {
    const blocks = await this.fetchBlockChildren(articleId);
    
    // Créer un tableau pour stocker le contenu
    let contents: BlockContent[] = [];

    blocks.forEach((block: any) => {
      if (!block || !block.type) {
        return;
      }
    
      const type = block.type;
      switch (type) {
        case 'paragraph':
          // console.log("PARAGRAPH")
          contents.push({
            type: 'text',
            taille: 'paragraph',
            content: block[type].rich_text[0]?.plain_text
          });
          break;
        case 'heading_1': 
          // console.log("HEADING 1")
          contents.push({
              type: 'text',
              taille: 'heading1',
              content: block[type].rich_text[0]?.plain_text
          });
          break;
        case 'heading_2': 
          // console.log("HEADING 2")
          contents.push({
            type: 'text',
            taille: 'heading2',
            content: block[type].rich_text[0]?.plain_text
          });
          break;
        case 'heading_3': 
          // console.log("HEADING 3")
          contents.push({
              type: 'text',
              taille: 'heading3',
              content: block[type].rich_text[0]?.plain_text
          });
          break;
        case 'quote': 
          // console.log("QUOTE")
          contents.push({
              type: 'text',
              taille: 'paragraph',
              content: block[type].rich_text[0]?.plain_text
          });
          break;
        case 'embed':
          // console.log("EMBED")
          contents.push({
            type: 'link',
            taille: 'link',
            content: block[type].url
          });
          break;
        case 'video':
          // console.log("VIDEO")
          if (block.type === "external" && block.external && block.external.url) {
            contents.push({
              type: "link",
              taille: "link",
              content: block.external.url
            });
          } else if (block.type === "file" && block.file && block.file.url) {
            contents.push({
              type: "video",
              taille: "video",
              content: block.file.url
            });
          }
          break;
        case 'image':
          // console.log("IMAGE")
          console.log(block[type])
          // contents.push({
          //   type: 'image',
          //   taille: 'paragraph',
          //   content: block[type].file.url
          // });
          break;
        default:
          console.log(type)
          break;
      }
    });
  
    // console.log(contents);
  
    return contents;
  }
  
  public async fetchBlockToHtml(articleId: string) {
    const blocks = await this.fetchBlockChildren(articleId);
    
    let html = '';

    for (const block of blocks) {
      switch (block.type) {
        case 'paragraph':
          html += `<p>${block.paragraph.text.map((text) => text.plain_text).join('')}</p>`;
          break;
        case 'heading_1':
          html += `<h1>${block.heading_1.text.map((text) => text.plain_text).join('')}</h1>`;
          break;
        case 'heading_2':
          html += `<h2>${block.heading_2.text.map((text) => text.plain_text).join('')}</h2>`;
          break;
        case 'heading_3':
          html += `<h3>${block.heading_3.text.map((text) => text.plain_text).join('')}</h3>`;
          break;
        case 'bulleted_list_item':
          html += `<ul><li>${block.bulleted_list_item.text.map((text) => text.plain_text).join('')}</li></ul>`;
          break;
        case 'numbered_list_item':
          html += `<ol><li>${block.numbered_list_item.text.map((text) => text.plain_text).join('')}</li></ol>`;
          break;
        case 'quote':
          html += `<blockquote>${block.quote.text.map((text) => text.plain_text).join('')}</blockquote>`;
          break;
        case 'code':
          html += `<pre><code>${block.code.text.map((text) => text.plain_text).join('')}</code></pre>`;
          break;
        case 'toggle':
          html += `<details><summary>${block.toggle.text.map((text) => text.plain_text).join('')}</summary>`;
          if (block.toggle.children && block.toggle.children.length > 0) {
            html += this.fetchBlockToHtml(block.toggle.children);
          }
          html += `</details>`;
          break;
        case 'image':
          html += `<img src="${block.image.file.url}" alt="${block.image.caption[0]?.plain_text || ''}" />`;
          break;
        case 'video':
          html += `<video src="${block.video.file.url}" controls></video>`;
          break;
        case 'embed':
          html += block.embed.html;
          break;
        default:
          break;
      }
  
      if (block.children && block.children.length > 0) {
        html += this.fetchBlockToHtml(block.children);
      }
    }
  
    return html;
  }


  public async fetchPageHtml(pageId: string) { 

    const response = await fetch(this._NOTION_API + "pages/" + pageId, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${this._NOTION_SECRET}`,
        'Notion-Version': '2022-06-28',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch page');
    }

    const pageData = await response.json();
    console.log(pageData?.properties)
    const htmlContent = pageData?.properties?.html?.[0];

    // console.log(htmlContent);
  };

}

export default new notionManager();