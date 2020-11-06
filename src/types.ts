type Map = Record<string, any>;

export interface VariableOptions {
  selector?: string;
  ruleConfig?: { rulePostfix?: string; cssProp: string }[];
  delimiter?: Delimiter;
}

export type VariableConfig = VariableOptions & {
  [k: string]: Map;
};

export const enum Delimiter {
  Kebab_Case = 'kebab',
  Snake_Case = 'snake',
  None = 'none'
}

export interface Config {
  target: string;
  source: string;
}

export interface CacheEntity {
  variables: { prop: string; value: string }[];
  variablesKeys: string[];
}

type VariablesMap = Record<string, string | VariableConfig>;

export type VariablesMapping = Record<string, VariablesMap>;
