import { Rule } from '../src/types';

const fontSizes = [10, 12, 14, 16];
export const rulesDefinitions: Record<string, Rule>[] = [
  {
    lightTheme: {
      value: {
        A100: '#00acc1',
        B500: '#e91e63',
        D100: '#BBDEFB',
        E400: '#26a69a'
      },
      variableName: ':valueKey',
      appendVariablesTo: 'body.light-theme'
    },
    darkTheme: {
      value: {
        A100: '#074100',
        B500: '#9b1340',
        D100: '#90abc2',
        E400: '#187269'
      },
      properties: [
        {
          prop: 'color',
          selector: ({ valueKey }) => `.${valueKey}`
        }
      ],
      variableName: ':valueKey',
      appendVariablesTo: 'body.dark-theme'
    },
    fontFamily: {
      value: 'Roboto',
      properties: [
        {
          prop: 'font-family',
          selector: '.font-family'
        }
      ],
      variableName: 'font-family'
    },
    fontWeight: {
      properties: [
        {
          prop: 'font-weight',
          selector: '.font-weight-:valueKey'
        }
      ],
      value: {
        regular: 'normal',
        medium: 500,
        bold: 'bold'
      },
      variableName: 'font-:valueKey'
    },
    fontSize: {
      properties: [
        {
          prop: 'font-size',
          selector: '.text:valueKey'
        }
      ],
      variableName: 'text:valueKey',
      value: fontSizes.reduce((acc, size) => {
        acc[size] = `${size / 16}rem`;

        return acc;
      }, {})
    }
  }
];
