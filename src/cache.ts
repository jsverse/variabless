import { CacheEntity } from './types';

const cache: Record<string, CacheEntity> = {};

export function getCache(key: string): CacheEntity {
  return cache[key] || ({} as CacheEntity);
}

export function setCache(key: string, value: CacheEntity) {
  cache[key] = value;
}
