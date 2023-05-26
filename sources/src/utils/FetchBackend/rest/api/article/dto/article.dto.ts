interface ArticleAttachedLinks {
  dp_name: string;
  dp_url: string;
}

export default interface ArticleDto {
  dp_name: string;
  dp_date: string;
  dp_urlSegment: string;
  dp_photoUrl: string;
  dp_text: string;
  dp_seoKeywords: string;
  dp_seoDescription: string;
  dp_articleAttachedLinks: ArticleAttachedLinks[];
}
