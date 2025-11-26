import { Type } from 'class-transformer';
import { IsBoolean, IsEnum, IsInt, IsOptional, Min } from 'class-validator';

export enum ItemsQueryType {
  OFFSET = 'offset',
  CURSOR = 'cursor',
}
export class GetItemsQueryDto {
  @IsEnum(ItemsQueryType)
  @Type(() => String)
  type: ItemsQueryType = ItemsQueryType.OFFSET;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit: number = 50;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  offset?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  cursor?: number;

  @IsOptional()
  @IsBoolean()
  cache?: boolean = false;
}
