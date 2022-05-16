export interface UrlCampaign {
  id: string;
  name: string;
  urls: string[];
  createdAt: Date;
  shortenedUrls: string[];
}

export class UrlCampaign implements UrlCampaign {
  constructor(
    id: string,
    name: string,
    urls: string[],
    createdAt: Date,
    shortenedUrls: string[]
  ) {
    this.id = id;
    this.name = name;
    this.urls = urls;
    this.createdAt = createdAt;
    this.shortenedUrls = shortenedUrls;
  }
}
