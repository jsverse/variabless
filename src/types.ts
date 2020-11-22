export interface Rule {
  value: string | object;
  variableName: string | ((cssProperty: string, valueKey?: string) => string);
  selector?: string | ((cssProperty: string, valueKey?: string) => string);
  property?: string | string[];
  appendVariablesTo: string;
  appendSelectorsTo: string;
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
}

export interface SelectorDefinition extends VariableDefinition {
  selector: string;
}

export const TOKENS = ['valueKey', 'property'] as const;

export type TokensValueMap = Partial<Record<typeof TOKENS[number], any>>;
