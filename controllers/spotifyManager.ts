import base64 from 'base-64';

export interface ArtistInfo {
  name?: string;
  externalUrl?: string;
  follower?: number;
  albumName?: string;
  albumType?: string;
  imageUrl?: string;
}

class SpotifyManager {
  private _token: string;
  private playlistUrl: string;
  private artistUrl: string;
  private recommandationUrl: string;
  private clientId: any
  private clientSecret: any

  constructor() {
    this._token = '';
    this.playlistUrl = 'https://api.spotify.com/v1/playlists/';
    this.recommandationUrl = 'https://api.spotify.com/v1/recommendations';
    this.artistUrl = 'https://api.spotify.com/v1/artists/';
    this.clientId = process.env.SPOTIFY_CLIENT_ID;
    this.clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  }

  private async authenticate() {
    const authString = `${this.clientId}:${this.clientSecret}`;
    const encodedAuthString = base64.encode(authString);
    const tokenEndpoint = 'https://accounts.spotify.com/api/token';

    const response = await fetch(tokenEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${encodedAuthString}`,
      },
      body: 'grant_type=client_credentials',
    });

    const data = await response.json();
    this._token = data.access_token;
  }

  public async getArtistByID(artistId: string): Promise<ArtistInfo> {
    if (!this._token) {
      await this.authenticate();
    }

    const response = await fetch(`${this.artistUrl}${artistId}`, {
      headers: {
        Authorization: `Bearer ${this._token}`,
      },
    });

    const artistInfo = await response.json();

    const name = artistInfo.name;
    const externalUrl = artistInfo.external_urls.spotify;
    const follower = artistInfo.followers.total;
    const imageUrl = artistInfo.images[0].url;

    const artistData: ArtistInfo = {
      name,
      externalUrl,
      follower,
      imageUrl,
    };

    return artistData;
  }

  public async getRandomPlaylistID(playlistIDs: string[]): Promise<string> {
    if (!this._token) {
      await this.authenticate();
    }

    const randomIndex = Math.floor(Math.random() * playlistIDs.length);
    const playlistID = playlistIDs[randomIndex];

    return playlistID;
  }

  public async getRandomTrackFromPlaylist(playlistID: string): Promise<any> {
    if (!this._token) {
      await this.authenticate();
    }

    const response = await fetch(`${this.playlistUrl}${playlistID}/tracks`, {
      headers: {
        Authorization: `Bearer ${this._token}`,
      },
    });

    const playlistData = await response.json();
    const tracks = playlistData.items;

    const randomIndex = Math.floor(Math.random() * tracks.length);
    const randomTrack = tracks[randomIndex];

    return randomTrack;
  }

  public async getRecommendations(trackId: string): Promise<ArtistInfo[]> {
    if (!this._token) {
      await this.authenticate();
    }
  
    const response = await fetch(`${this.recommandationUrl}?seed_tracks=${trackId}&limit=3`, {
      headers: {
        Authorization: `Bearer ${this._token}`,
      },
    });
  
    const recommendationsData = await response.json();
    const tracks = recommendationsData.tracks;
  
    const artistIds = tracks.map((track: any) => track.artists[0].id);
  
    const promises = artistIds.map((artistID: string) => {
      return this.getArtistByID(artistID);
    });
  
    const artistInfoArray = await Promise.all(promises);
  
    return artistInfoArray;
  }
  
  public async getPlaylistByID(playlistID: string, twoRequest: boolean = false) {
    if (!this._token) {
      await this.authenticate();
    }
  
    const response = await fetch(this.playlistUrl + playlistID, {
      headers: {
        Authorization: `Bearer ${this._token}`,
      },
    });
  
    const playlistData = await response.json();
    const tracks = playlistData.tracks.items;

    if(twoRequest) {

      const infoAll: ArtistInfo[] = [];

      const artistIds = tracks.map((track: any) => track.track.artists[0].id);
      
      const promises = artistIds.map((artistID: string) => {
        return this.getArtistByID(artistID);
      });

      const artistInfoArray = await Promise.all(promises);
  
      infoAll.push(...artistInfoArray);

      return infoAll;

    } 

    const infoAll: ArtistInfo[] = tracks.map((track: any) => ({
      artist: track.track.artists[0].name,
      imageUrl: track.track.album.images[0].url,
      albumType: track.track.album.album_type.charAt(0).toUpperCase() + track.track.album.album_type.slice(1),
      name: track.track.album.name,
      externalUrl: track.track.album.external_urls.spotify,
    }));
  
    return infoAll;
  }
}

export default new SpotifyManager();
