import { Item } from '../items.dl';

export interface ItemsStrategy {
  getItems(params: { limit?: number; offset?: number; cursor?: number; cache?: boolean }): Promise<Item[]>;
}
