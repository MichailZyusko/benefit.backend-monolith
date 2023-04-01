import YandexEdaParser from "./interfaces/YandexEdaParser";

const STORE_SLUG = 'gippo_cyeiw';
const STORE_ID = '0cddc5bf-6a5f-4782-8154-4f0d20179fce';

class GippoParser extends YandexEdaParser {
  constructor() {
    super(
      STORE_SLUG,
      STORE_ID,
    )
  }
}

export default GippoParser;
