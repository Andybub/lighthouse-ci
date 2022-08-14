import './TopNav.scss';

let hoverTarget = null;
const delay = 300;
const $topNav = $(".top-nav");
const $list = $topNav.find("li");
const $topNavExpand = $(".top-nav-expand");
const $topNavBlock = $(".top-nav-block");

const showExpand = ($li) => {
  // console.log("showExpand");
  const topNavHeight = $topNav.height();
  // console.log("topNavHeight", topNavHeight);
  $topNavExpand.css("top", topNavHeight);
  const height = $(window).height() - $("header").height();
  // console.log($(window).height(), $("header").height(), $(".announcement-section").height());
  $topNavExpand.css("max-height", height);
  $topNavBlock.css("height", height);
  $topNavExpand.find(".is-active").removeClass("is-active");
  const index = $li.index();
  $topNavExpand.find(".lv-2-list").eq(index).addClass("is-active");
  $topNavExpand.addClass("d-block");
  $topNavBlock.addClass("d-block");
  $list.removeClass("is-expand");
  $li.addClass("is-expand");
}

const hideExpand = () => {
  $topNavExpand.removeClass("d-block");
  $topNavBlock.removeClass("d-block");
  $list.removeClass("is-expand");
}

const initTopNav = () => {
  // TODO detect by width?
  if (window.isMobile.any) { return; }

  $topNavExpand.on("mouseenter", (e) => {
    clearTimeout($topNavExpand.data("timer"));
    hoverTarget = e.currentTarget;
  }).on("mouseleave", (e) => {
    // return;
    clearTimeout($topNavExpand.data("timer"));
    $topNavExpand.data("timer", setTimeout(() => {
      if (hoverTarget === e.currentTarget) {
        hideExpand();
      }
    }, delay));
  });

  $list.each((i, li) => {
    const $li = $(li);
    $li.on("mouseenter", (e) => {
      // console.log("mouseenter");
      clearTimeout($li.data("timer"));
      hoverTarget = e.currentTarget;
      $li.data("timer", setTimeout(() => {
        if (hoverTarget === e.currentTarget) {
          showExpand($li);
        }
      }, delay));
    }).on("mouseleave", (e) => {
      // return;

      clearTimeout($li.data("timer"));
      $li.data("timer", setTimeout(() => {
        if (hoverTarget === e.currentTarget) {
          hideExpand();
        }
      }, delay));
    });
  });
};

export default initTopNav;