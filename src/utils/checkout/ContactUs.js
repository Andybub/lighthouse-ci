export const initContactUs = () => {
  const stepFooterInfo = $('.step__footer__info');
  stepFooterInfo.empty();
  stepFooterInfo.append('Need help?');
  stepFooterInfo.append(
    `<div class="contact-us">
        <a href="/pages/contact-us">
          <i class="icomoon icomoon-email" aria-hidden="true"></i> Contact Us
        </a>
      </div>`,
  );
  stepFooterInfo.append(
    `<div class="live-chat">
        <a href="javascript: Comm100API.do('livechat.button.click');">
          <i class="icomoon icomoon-nav-chat" aria-hidden="true"></i> Live Chat
        </a>
        <span class="hours-op"> (5am to 9pm | Monday - Friday)</span>
      </div>`,
  );
};
