export type NameResolver = (params: TokensValueMap) => string;
export interface PropertyConfig {
  prop: string | string[];
  selector: string | NameResolver;
}
export interface Rule {
  value: string | number | object;
  variableName: string | NameResolver;
  properties?: PropertyConfig | PropertyConfig[];
  appendVariablesTo?: string;
}

export interface Config {
  outputPath: string;
  srcPath: string;
}

export interface WebpackConfig extends Config {
  watch?: boolean;
}

export interface VariableDefinition {
  prop: string;
  value: any;
  raws: any;
}

export interface SelectorDefinition extends VariableDefinition {
  selector: string;
}

export const TOKENS = ['valueKey', 'property'] as const;

export type TokensValueMap = Partial<Record<typeof TOKENS[number], any>>;

export type RulesMap = Record<string, Record<string, Rule>>;
