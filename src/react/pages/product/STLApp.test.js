import { getLooksByProduct } from '@/react/api/stl';

describe('STL App', () => {
  test('getLooksByProduct', async () => {
    const productId = '4355825926190';
    const result = await getLooksByProduct(productId);
    expect(result.product_id).toBe(productId);
    expect(result.shop_looks.length).toBeGreaterThanOrEqual(6);

    const expectLook = {
      id: expect.any(Number),
      title: expect.any(String),
      submitted_by: expect.any(String),
      image_url: expect.any(String),
      default_tag: expect.any(String),
    };

    result.shop_looks.forEach((look, index) => {
      console.log(index, look.id);
      expect(look).toMatchObject(expectLook);
    });
  });
});
