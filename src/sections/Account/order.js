/* eslint-disable no-restricted-syntax */

import './order.scss'

const orderDetailDOM = document.getElementById('order-detail');
let orderID = null;
if (orderDetailDOM) {
  orderID = JSON.parse(orderDetailDOM.innerHTML);
}

let images = [];

const headers = {
  Authorization: 'Basic cHVia2V5LTY4dXcwaDZnV2M5RkhvWHJPZnBibDEzM25QNENYZjprZXktWTJ1dTdzRjl6NjJMOTU4NDNSMDlKOVI1OEZyckpa',
};

const toBase64 = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result);
  reader.onerror = (error) => reject(error);
});

function getFormData($form, product) {
  const unindexedArray = $form.serializeArray();
  const formData = new FormData();

  for (const key of Object.keys(product)) {
    formData.append(key, product[key]);
  }

  $.map(unindexedArray, (n) => {
    formData.append(n.name, n.value);
  });

  return formData;
}

function addTag(reviewID) {
  $.ajax({
    url: `https://stamped.io/api/v2/67527/dashboard/reviews/${reviewID}/addTag?tag=order-${orderID}`,
    headers,
    type: 'POST',
    success: () => {},
  });
}
function submitOrderReview(event) {
  const tr = $(event.target).closest('tr').prev();
  const tbody = $(event.target).closest('tbody');
  const product = {
    author: tbody.data('author'),
    email: tbody.data('email'),
    productId: tr.data('product-id'),
    productName: tr.data('product-name'),
    productImageUrl: tr.data('product-image-url'),
    productUrl: tr.data('product-url'),
    productDescription: "",
    location: "",
  }
  const formData = getFormData($(event.target), product);
  for (let i = 0; i < images.length; i++) {
    formData.append(`image${  i}`, images[i]);
  }
  const rating = parseInt($('#reviewRating').val(), 10);
  const fillStar = [];
  const unFillStar = [];
  for (let i = 0; i < 5; i++) {
    if (i < rating) {
      fillStar.push('<a href="javascript:;" class="stamped-fa stamped-fa-star-o fa-star-checked"></a>');
    } else {
      unFillStar.push('<a href="javascript:;" class="stamped-fa stamped-fa-star-o fa-star-o"></a>');
    }
  }
  $.ajax({
    url: 'https://stamped.io/api/reviews3?apiKey=pubkey-68uw0h6gWc9FHoXrOfpbl133nP4CXf&storeUrl=efavormart-new.myshopify.com',
    type: 'POST',
    // eslint-disable-next-line no-underscore-dangle
    data: formData._blob ? formData._blob() : formData,
    cache: !1,
    processData: !1,
    contentType: !1,
    beforeSend: () => {
      $("#button-submit").attr("disabled", "disabled");
    },
    success: (response) => {
      $('#new-review-form').trigger('reset');
      $('.set-rate .stamped-fa-star-o').removeClass('fa-star-checked');
      $('.set-rate .stamped-fa-star-o').addClass('fa-star-o');
      tr.find('td.review').html(fillStar.join('') + unFillStar.join(''));
      $('.order-product-info').after($('#write-stamped-review'));
      $(event.target).closest('tr').remove();
      $('tr.row-submit-review').remove();
      addTag(response.id);
      $('.success-overlay').removeClass('hide');
      $("#button-submit").removeAttr("disabled");
      $('.stamped-file-holder').empty();
      images = [];
    },
    error: () => {
      $("#button-submit").removeAttr("disabled");
    }
  });
}

$(() => {
  $.ajax({
    url: `https://stamped.io/api/v2/67527/dashboard/reviews?tag=order-${orderID}`,
    headers,
    type: 'GET',
    success: (response) => {
      $('td.review').html(`
        <button class="btn btn-primary submit-review">
          Submit<br>
          Review
        </button>
      `);
      if (response.total > 0) {
        for (const review of response.results) {
          const { productId } = review.review;
          $(`tr[data-product-id=${productId}] td.review`).empty();
          const { rating } = review.review;
          const fillStar = [];
          const unFillStar = [];
          for (let i = 0; i < 5; i++) {
            if (i < rating) {
              fillStar.push('<a href="javascript:;" class="stamped-fa stamped-fa-star-o fa-star-checked"></a>');
            } else {
              unFillStar.push('<a href="javascript:;" class="stamped-fa stamped-fa-star-o fa-star-o"></a>');
            }
          }
          $(`tr[data-product-id=${productId}] td.review`).html(fillStar.join('') + unFillStar.join(''));
        }
      }
      $('.submit-review').on('click', (e) => {
        $('tr td.review button + div').remove();
        $(e.target).closest('tr').after('<tr class="row-submit-review"><td colspan="6"></td></tr>');
        const submitReviewForm = $('#write-stamped-review');
        const oldRow = submitReviewForm.closest('tr');
        if (oldRow.length > 0) oldRow.remove();
        submitReviewForm.appendTo($('tr.row-submit-review td'));
        $(e.target).parent().append(`
          <div class="rating-stars">
            <a onclick="StampedFn.setRating(this);return false;" class="stamped-fa stamped-fa-star-o"></a>
            <a href="javascript:;" class="stamped-fa stamped-fa-star-o"></a>
            <a href="javascript:;" class="stamped-fa stamped-fa-star-o"></a>
            <a href="javascript:;" class="stamped-fa stamped-fa-star-o""></a>
            <a href="javascript:;" class="stamped-fa stamped-fa-star-o"></a>
          </div>
        `)
      });
    },
  });

  $('body').on('change', '#stamped-file-uploader-input', (e) => {
    if (e.target.files) {
      for (let i = 0; i < e.target.files.length; i++) {
        images.push(e.target.files[i]);
      }

      const promises = [];
      for (const file of images) {
        promises.push(toBase64(file));
      }
      Promise.all(promises).then((_images) => {
        const htmls = _images.map((image, index) => {
          return `
            <div class="stamped-file-photo" data-index="${index + 1}">
              <img src="${image}" width="70">
              <div class="stamped-file-photo-remove" data-index="${index + 1}">x</div>
            </div>
          `;
        });
        $('.stamped-file-holder').html(htmls.join(''));
        $('.stamped-file-photo-remove').on('click', (event) => {
          images.splice($(event.target).data('index') - 1, 1);
          $(event.target).closest('.stamped-file-photo').remove();
        });
      });
    }
  });

  $('body').on('submit', '#new-review-form', (e) => {
    e.preventDefault();
    submitOrderReview(e);
  });

  $('.success-overlay').on('click', (e) => {
    $(e.target).addClass('hide');
  })
})
