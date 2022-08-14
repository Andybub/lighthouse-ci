import {
  getSiteWideReviewSummary,
  getReviewRatingsSummary,
  getReviewVisualGallery,
  getProductReviews,
  getReviewCarouselPhotos,
} from './ReviewsAPI';

describe('Reviews API', () => {
  test('getSiteWideReviewSummary', async () => {
    const result = await getSiteWideReviewSummary();
    // console.log(result);
    expect(Array.isArray(result)).toBeTruthy();
    expect(result.length).toBe(1);
    expect(Array.isArray(result[0].data)).toBeTruthy();
    expect(result[0].totalAllWithNPS).toBeGreaterThanOrEqual(141337);
  });

  test('getReviewRatingsSummary', async () => {
    const productId = '8548362002';
    const productSku = 'TAB_120_WHT_POLY';
    const result = await getReviewRatingsSummary({ productId, productSku });
    // console.log(result);
    expect(Array.isArray(result)).toBeTruthy();
    expect(result.length).toBe(1);
    expect(result[0].productId).toBe(productId);
    expect(result[0].productSku).toBe(productSku);
    expect(result[0].rating).toBeGreaterThanOrEqual(4);
    expect(result[0].count).toBeGreaterThanOrEqual(1427);
    expect(result[0].countQuestions).toBeGreaterThanOrEqual(20);
  });

  test('getReviewVisualGallery', async () => {
    const productId = '8550696658';
    const productSKU = 'TAB_90132_WHT_POLY';
    const page = 1;
    const result = await getReviewVisualGallery({ productId, productSKU, page });
    // console.log(result);
    expect(result.page).toBe(page);
    expect(Array.isArray(result.data)).toBeTruthy();
    expect(result.data[0]).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        author: expect.any(String),
        reviewTitle: expect.any(String),
        reviewMessage: expect.any(String),
        reviewRating: expect.any(Number),
        reviewDate: expect.any(String),
        reviewUserPhotos: expect.any(String),
        reviewUserPhotosWatermark: expect.any(String),
        reviewVerifiedType: expect.any(Number),
        reviewReply: expect.any(String),
        productId: expect.any(Number),
        productName: expect.any(String),
        productSKU: expect.any(String),
        productVariantName: expect.any(String),
        shopProductId: expect.any(Number),
        productUrl: expect.any(String),
        productImageUrl: expect.any(String),
        productImageLargeUrl: expect.any(String),
        productImageThumbnailUrl: expect.any(String),
        avatar: expect.any(String),
        location: expect.any(String),
        countryIso: expect.any(String),
        reviewVotesUp: expect.any(Number),
        reviewVotesDown: expect.any(Number),
        dateCreated: expect.any(String),
        reviewType: expect.any(Number),
        widgetType: expect.any(String),
        reviewOptionsList: expect.any(Array),
        featured: expect.any(Boolean),
      }),
    );
  });

  describe('getProductReviews', () => {
    const params = {
      productId: '8550696658',
      page: '1',
      take: '5',
      sortReviews: 'featured',
    };

    test('should return params back and array of reviews', async () => {
      const result = await getProductReviews(params);

      const reviewMatcher = {
        id: expect.any(Number),
        author: expect.any(String),
        reviewTitle: expect.any(String),
        reviewMessage: expect.any(String),
        reviewRating: expect.any(Number),
        reviewDate: expect.any(String),
        reviewVerifiedType: expect.any(Number),
        productId: expect.any(Number),
        productUrl: expect.any(String),
        productImageUrl: expect.any(String),
        productImageLargeUrl: expect.any(String),
        productImageThumbnailUrl: expect.any(String),
        avatar: expect.any(String),
        location: expect.any(String),
        countryIso: expect.any(String),
        reviewVotesUp: expect.any(Number),
        reviewVotesDown: expect.any(Number),
      };
      const topicMatcher = {
        topicId: expect.any(Number),
        title: expect.any(String),
        total: expect.any(Number),
        similiarity: expect.any(Number),
      };

      expect(result.productId).toBe(params.productId);
      expect(result.page).toBe(params.page);
      expect(result.take).toBe(params.take);
      expect(result.sortReviews).toBe(params.sortReviews);
      result.reviews.forEach((review) => {
        expect(review).toEqual(expect.objectContaining(reviewMatcher));
      });
      result.topics.forEach((topic) => {
        expect(topic).toEqual(expect.objectContaining(topicMatcher));
      });
    });
  });

  describe('getReviewCarouselPhotos', () => {
    const params = {
      reviewId: '71010446',
      productId: '8550696658',
      productSKU: 'TAB_90132_WHT_POLY',
      productTitle: '90%22x132%22%20White%20Polyester%20Rectangular%20Tablecloth',
      page: 1,
      skip: '100',
      minRating: '1',
    };

    test('should return array of carousel photos', async () => {
      const result = await getReviewCarouselPhotos(params);

      const dataMatcher = {
        id: expect.any(Number),
        author: expect.any(String),
        reviewTitle: expect.any(String),
        reviewMessage: expect.any(String),
        reviewRating: expect.any(Number),
        reviewDate: expect.any(String),
        // reviewUserPhotos: expect.any(String),
        reviewUserPhotosWatermark: expect.any(String),
        // reviewUserVideos: expect.any(String),
        reviewVerifiedType: expect.any(Number),
        productId: expect.any(Number),
        productName: expect.any(String),
        shopProductId: expect.any(Number),
        productUrl: expect.any(String),
        productImageUrl: expect.any(String),
        productImageLargeUrl: expect.any(String),
        productImageThumbnailUrl: expect.any(String),
        avatar: expect.any(String),
        location: expect.any(String),
        reviewVotesUp: expect.any(Number),
        reviewVotesDown: expect.any(Number),
        dateCreated: expect.any(String),
        reviewType: expect.any(Number),
        widgetType: expect.any(String),
        reviewOptionsList: expect.any(Array),
        featured: expect.any(Boolean),
      };

      result.data.forEach((item) => {
        expect(item).toEqual(expect.objectContaining(dataMatcher));
      });
    });
  });
});
