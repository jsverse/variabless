export const optionDefinitions = [
  {
    name: 'srcPath',
    alias: 's',
    type: String,
    description: 'The source file path containing the rules definitions.'
  },
  {
    name: 'outputPath',
    alias: 'o',
    type: String,
    description: 'The generated css output file path.'
  },
  {
    name: 'version',
    alias: 'v',
    type: Boolean,
    description: 'The Variabless version'
  },
  { name: 'help', alias: 'h', type: Boolean, description: 'Help me, please!' }
];

export const sections = [
  {
    header: 'Variabless',
    content: 'Transform JS/TS/JSON to css variables 💎'
  },
  {
    header: 'Options',
    optionList: optionDefinitions
  }
];
