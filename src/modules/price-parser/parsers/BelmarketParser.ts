import YandexEdaParser from "./interfaces/YandexEdaParser";

const STORE_SLUG = 'belmarket_itbqf';
const STORE_ID = 'b1701a1e-e1f4-4be4-b0fd-a92bb6267ab8';

class BelmarketParser extends YandexEdaParser {
  constructor() {
    super(
      STORE_SLUG,
      STORE_ID
    )
  }
}

export default BelmarketParser;
