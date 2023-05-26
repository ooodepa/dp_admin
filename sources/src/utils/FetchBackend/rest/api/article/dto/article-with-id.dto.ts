import ArticleDto from './article.dto';

interface ArticleAttachedLinks {
  dp_id: number;
  dp_name: string;
  dp_url: string;
  dp_articleId: string;
}

export default interface ArticleWithIdDto extends ArticleDto {
  dp_id: string;
  dp_articleAttachedLinks: ArticleAttachedLinks[];
}
