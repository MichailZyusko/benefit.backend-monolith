import { IParserStrategy } from "./IParserStrategy";
import axios from "axios";
import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv';
import { resolve } from 'path';
dotenv.config({ path: resolve(__dirname, '../../../../../.env.local') });

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SECRET_KEY);

type YandexEdaProduct = {
  name: string;
  description: string;
  picture: {
    url: string;
  };
  decimalPrice: string;
  decimalPromoPrice: string;
};

class YandexEdaParser implements IParserStrategy {
  private CATEGORIES_URL = 'https://eda.yandex.by/api/v2/menu/goods';
  private GOODS_URL = 'https://eda.yandex.by/api/v2/menu/goods/get-categories';

  constructor(
    private readonly STORE_SLUG: string,
    private readonly STORE_ID: string
  ) { }

  private YandexEdaProductMapper(product: YandexEdaProduct) {
    try {
      return {
        id: product.name.trim(),
        description: product.description.trim(),
        image: `${product.picture.url.split('/').slice(0, -1).join('/')}/400x400nocrop`,
        price: +(product.decimalPromoPrice ?? product.decimalPrice),
      };
    } catch (error) {
      console.log(error);
    }
  }

  async parse() {
    try {
      console.time("Time");
      console.log(`START PARSING FOR: ${this.STORE_SLUG}`);

      const { data: { payload: { categories } } } = await axios({
        method: 'POST',
        url: this.CATEGORIES_URL,
        data: {
          slug: this.STORE_SLUG
        }
      });

      const mappedCategories = categories.map((category: any) => ({
        id: category.id,
        min_items_count: 1,
        max_items_count: 1e6,
      }))

      const { data: { categories: products } } = await axios({
        method: "POST",
        url: this.GOODS_URL,
        data: {
          categories: mappedCategories,
          slug: this.STORE_SLUG,
        }
      })

      const mappedProducts = products
        .flatMap((product: object & { items: YandexEdaProduct[] }) => product.items || [])
        .map(this.YandexEdaProductMapper);

      // const productsResponse = await supabase
      //   .from('products')
      //   .upsert(
      //     mappedProducts.map(({ price, ...product }) => product),
      //     { onConflict: 'id' }
      //   );

      // if (productsResponse.error) {
      //   console.log('🚀 ~ file: GippoParser.ts:93 ~ productsResponse:', productsResponse);
      // }

      // const offersResponse = await supabase
      //   .from('offers')
      //   .upsert(
      //     mappedProducts.map(({ id, price }) => ({
      //       store_id: this.STORE_ID,
      //       quantity: 1,
      //       product_id: id,
      //       price,
      //     })),
      //     { onConflict: 'product_id, store_id' }
      //   )

      // if (offersResponse.error) {
      //   console.log('🚀 ~ file: GippoParser.ts:109 ~ offersResponse:', offersResponse);
      // }

      await Promise.allSettled(mappedProducts.map(async ({ price, ...product }) => {
        const productsResponse = await supabase
          .from('products')
          .upsert(product)

        if (productsResponse.error) {
          console.log(`🚀 ~ productsResponse ~ ${this.STORE_SLUG}`, productsResponse);
        }

        const offersResponse = await supabase
          .from('offers')
          .upsert({
            store_id: this.STORE_ID,
            quantity: 1,
            product_id: product.id,
            price,
          }, { onConflict: 'product_id, store_id' })

        if (offersResponse.error) {
          console.log(`🚀 ~ offersResponse ~ ${this.STORE_SLUG}`, offersResponse);
        }
      }))

      console.log(`FINISH PARSING FOR: ${this.STORE_SLUG}`);
      console.timeEnd("Time");
    } catch (error) {
      console.log(error);
    }
  }
}

export default YandexEdaParser;
