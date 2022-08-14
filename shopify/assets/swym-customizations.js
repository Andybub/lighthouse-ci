function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

// Copy CSS directly into storefront
// ________________________________________
window.SwymBeforeRender = window.SwymBeforeRender || [];
window.SwymBeforeRender.push(function (UIObj) {
  var liElem;

  function tryParseJSON(jsonString) {
    try {
      var o = JSON.parse(jsonString);

      if (o && _typeof(o) === "object") {
        return o;
      }
    } catch (e) {}

    return false;
  }

  ;
  UIObj.Registry.preloadComponent("addToCartBtn", function (OGComp6) {
    var ModWishlistItem = /*#__PURE__*/function (_UIObj$React$Componen) {
      _inherits(ModWishlistItem, _UIObj$React$Componen);

      var _super = _createSuper(ModWishlistItem);

      function ModWishlistItem(props) {
        var _this;

        _classCallCheck(this, ModWishlistItem);

        _this = _super.call(this, props);
        _this.state = {
          isAvailable: true,
          isPreOrder: false,
          isPersonalized: false
        };
        _this.changeState = _this.changeState.bind(_assertThisInitialized(_this));
        return _this;
      }

      _createClass(ModWishlistItem, [{
        key: "mod",
        value: function mod(epi, empi, du, changeState) {
          window._swat.getProductDetails({
            epi: epi,
            empi: empi,
            du: du
          }, function (productJson) {
            //console.log(productJson, "json");
            var inventoryURL = du + (du.indexOf("?") > -1 ? "&view=inventory" : "?view=inventory"); // product url

            if (!productJson.available) {
              changeState({
                isAvailable: false
              });
            } else if (productJson.type == "Personalized") {
              changeState({
                isPersonalized: true
              });
            } else {
              SwymUtils.ajaxGET(inventoryURL, function (response) {
                if (response && response.status == 200 && response.responseText !== "" && tryParseJSON(response.responseText)) {
                  var responseObj = JSON.parse(response.responseText);
                  responseObj.inventory.forEach(function (inventoryVariant) {
                    if (epi === inventoryVariant.id) {
                      // fetched the  now only add available date to those elements
                      if (inventoryVariant.preorder) {
                        //console.log("Pre-Order Product", inventoryVariant);
                        // add class to customize the tile
                        //liElem.classList.add("swym-preorder-product");
                        changeState({
                          isPreOrder: true
                        });
                      }
                    }
                  });
                }
              }); //changeState({ isPreOrder: true });
              //liElem.classList.add("swym-preorder-product");
            }
          });
        }
      }, {
        key: "changeState",
        value: function changeState(state) {
          this.setState(_objectSpread(_objectSpread({}, this.state), state));
        }
      }, {
        key: "getCartText",
        value: function getCartText(variant) {
          if (!variant) {
            return {
              allowed: false,
              text: window._swat.retailerSettings.Strings.AddAllToCartCTA.Strings.AddToCartCTAUnavailable
            };
          }

          if (!variant.swymAllowAddToCart) {
            return {
              allowed: false,
              text: window._swat.retailerSettings.Strings.AddToCartCTACannotAdd
            };
          }

          if (variant.addingToCart) {
            return {
              allowed: true,
              text: window._swat.retailerSettings.Strings.AddToCartCTAAdding
            };
          }

          if (variant.swymIsAddedToCart) {
            return {
              allowed: true,
              text: window._swat.retailerSettings.Strings.AddToCartCTAAlreadyAdded
            };
          }

          return {
            allowed: true,
            text: "Pre-Order"
          };
        }
      }, {
        key: "componentDidMount",
        value: function componentDidMount() {
          var _this$props$item = this.props.item,
              epi = _this$props$item.epi,
              empi = _this$props$item.empi,
              du = _this$props$item.du;
          this.mod(epi, empi, du, this.changeState);
        }
      }, {
        key: "render",
        value: function render() {
          var _this2 = this;

          liElem = UIObj.Renderer.createElement("div", {
            className: this.props["class"],
            onClick: function onClick(e) {
              _this2.props.onClick(e, _this2.getCartText(_this2.props.variant).allowed, _this2.props.variant);
            }
          }, this.getCartText(this.props.variant).text);
          return this.state.isAvailable && !this.state.isPersonalized && !this.state.isPreOrder ? UIObj.Renderer.createElement(OGComp6, this.props) : this.state.isPersonalized ? UIObj.Renderer.createElement("div", {
            className: this.props["class"],
            onClick: function onClick(e) {
              _this2.props.onClick(e, _this2.getCartText(_this2.props.variant).allowed, _this2.props.variant);
            }
          }, "Customize") : this.state.isPreOrder ? liElem : UIObj.Renderer.createElement("div", {
            className: this.props["class"],
            style: "pointer-events: none; opacity: 0.5;"
          }, "Sold Out");
        }
      }]);

      return ModWishlistItem;
    }(UIObj.React.Component);

    UIObj.Registry.register("WishlistContainer.Detail.Grid.Item.AddToCartBtn", ModWishlistItem);
  });
  UIObj.Registry.preloadComponent("productPrice", function (OGComp8) {
    var listElem;

    var ModWishlistPriceItem = /*#__PURE__*/function (_UIObj$React$Componen2) {
      _inherits(ModWishlistPriceItem, _UIObj$React$Componen2);

      var _super2 = _createSuper(ModWishlistPriceItem);

      function ModWishlistPriceItem(props) {
        var _this3;

        _classCallCheck(this, ModWishlistPriceItem);

        _this3 = _super2.call(this, props);
        _this3.state = {
          isAvailable: true,
          isPreOrder: false
        };
        _this3.changeState = _this3.changeState.bind(_assertThisInitialized(_this3));
        return _this3;
      }

      _createClass(ModWishlistPriceItem, [{
        key: "changeState",
        value: function changeState(state) {
          this.setState(_objectSpread(_objectSpread({}, this.state), state));
        }
      }, {
        key: "injectAvailablityDateOnProductTile",
        value: function injectAvailablityDateOnProductTile(inventoryVariant) {
          if (inventoryVariant) {
            var availablityDate = inventoryVariant.available_date.replace("Preorder: ", "").trim();
            var date_diff = "Available on  " + availablityDate;

            var child = /*#__PURE__*/_react["default"].createElement("span", {
              className: ""
            }, date_diff);

            listElem = /*#__PURE__*/_react["default"].createElement("div", {
              className: "swym-available-info"
            }, child);
          }
        }
      }, {
        key: "mod",
        value: function mod(epi, empi, du, changeState, injectAvailablityDateOnProductTile) {
          window._swat.getProductDetails({
            epi: epi,
            empi: empi,
            du: du
          }, function (productJson) {
            //console.log(productJson, "json");
            var inventoryURL = du + (du.indexOf("?") > -1 ? "&view=inventory" : "?view=inventory"); // product url

            if (productJson.type !== "Personalized") {
              SwymUtils.ajaxGET(inventoryURL, function (response) {
                if (response && response.status == 200 && response.responseText !== "" && tryParseJSON(response.responseText)) {
                  var responseObj = JSON.parse(response.responseText);
                  responseObj.inventory.forEach(function (inventoryVariant) {
                    if (epi === inventoryVariant.id) {
                      // fetched the  now only add available date to those elements
                      if (inventoryVariant.preorder) {
                        //console.log("Pre-Order Product", inventoryVariant);
                        // add class to customize the tile
                        //liElem.classList.add("swym-preorder-product");
                        injectAvailablityDateOnProductTile(inventoryVariant);
                      }
                    }
                  });
                }
              }); //injectAvailablityDateOnProductTile(true);
              //listElem.classList.add("swym-preorder-product");
            }
          });
        }
      }, {
        key: "componentDidMount",
        value: function componentDidMount() {
          var _this4 = this;

          setTimeout(function () {
            var _this4$props$listItem = _this4.props.listItem,
                epi = _this4$props$listItem.epi,
                empi = _this4$props$listItem.empi,
                du = _this4$props$listItem.du;

            _this4.mod(epi, empi, du, _this4.changeState, _this4.injectAvailablityDateOnProductTile);
          }, 0);
        }
      }, {
        key: "render",
        value: function render() {
          return UIObj.Renderer.createElement("div", null, UIObj.Renderer.createElement(OGComp8, this.props), listElem);
        }
      }]);

      return ModWishlistPriceItem;
    }(UIObj.React.Component);

    UIObj.Registry.register("WishlistContainer.Detail.Grid.Item.Price", ModWishlistPriceItem);
  });
});
