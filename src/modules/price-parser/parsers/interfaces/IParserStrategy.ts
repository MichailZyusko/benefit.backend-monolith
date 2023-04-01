export interface IParserStrategy {
  parse: () => Promise<void>;
}
