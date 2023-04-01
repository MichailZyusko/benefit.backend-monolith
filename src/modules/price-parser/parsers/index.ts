import { IParserStrategy } from "./interfaces/IParserStrategy";
import GippoParser from "./GippoParser";
import BelmarketParser from "./BelmarketParser";
import 'dotenv/config';

class Parsers {
    private static parsers: Array<IParserStrategy> = [
        // GreenParser.getInstance(),
        new GippoParser(),
        new BelmarketParser()
    ];

    static async updatePriceInfo() {
        for (const parser of this.parsers) {
            await parser.parse();
        }
    }
}

export default Parsers;
