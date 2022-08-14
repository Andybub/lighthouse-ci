# efmt-2022

> Molla v1.7.5 - efavormart.com

### VSCode settings
- settins template `vscode-settings.json`
- extensions
  - [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
  - [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
  - [Stylelint](https://marketplace.visualstudio.com/items?itemName=stylelint.vscode-stylelint)

### naming rules
- liquid files `shopify/**/*.liquid`
  - kebab-case
  - prefix with `tw-` when created
- entry js & scss `src/*.{js,scss}`
  - kebab-case
  - auto prefix with `tw-` after compiled
- most js & scss under src `src/**/*.{js,scss}`
  - PascalCase
  - unless `src/scss/*.scss`
- methods & variables in js & scss
  - camelCase
  - but Class name use PascalCase
- id / class / attribute on html tag
  - kebab-case
  - [Bootstrap Classes](https://bootstrapshuffle.com/classes)
  - block-element rule
    - `.product-item>.item-image`
    - `.product-item>.item-price`
  - modifier rules
    - state naming `.is-hover` `.is-active`
    - color naming `.color-purple`
- TW library in javascript
  - `TW.[kebab-case-name].[PascalCaseName]` from entry
  - `TW.[PascalCaseName]` from liquid
  - ex. `TW.main.EventEmitter` `TW.DiscountBanner`

### resolve alias
- @/* --> /src/*
- @shopify/* --> /shopify/*

### window.TW namespace
- export from entry JS
- Discount
  - startHeader
  - endHeader

package commands
```markdown
$ yarn
$ yarn webpack:watch
$ yarn webpack:build
```

Shopify CLI [Install](https://shopify.dev/themes/tools/cli/installation)
```markdown
// RubyGems
$ gem install [--user-install] shopify-cli

// Homebrew
brew tap shopify/shopify
brew install shopify-cli

$ shopify version
```

Shopify CLI [Upgrade](https://shopify.dev/themes/tools/cli/upgrade-uninstall)
```markdown
// RubyGems
gem update shopify-cli

// Homebrew
brew update
brew upgrade shopify-cli
```

Shopify CLI [core commands](https://shopify.dev/themes/tools/cli/core-commands)
```markdown
$ cd shopify
$ shopify store
$ shopify whoami
$ shopify login --store [store-name]
$ shopify switch --store [store-name]
```

Shopify CLI [theme commands](https://shopify.dev/themes/tools/cli/theme-commands)
```markdown
$ cd shopify
$ shopify theme pull -d / -t [theme-id] / -l
$ shopify theme push -d / -t [theme-id] / -u
$ shopify theme serve
$ shopify theme check
```

### Molla Links
- [Molla Document](https://molla-docs.the4.co/)
- [Molla Support](https://support.the4.co/login)

### Shopify Links
- [Shopify Theme Docs](https://shopify.dev/themes)
  - [Install Shopify CLI](https://shopify.dev/themes/tools/cli/installation)
  - [Getting started with Shopify CLI](https://shopify.dev/themes/tools/cli/getting-started)
  - [Shopify CLI core commands](https://shopify.dev/themes/tools/cli/core-commands)
  - [Theme commands](https://shopify.dev/themes/tools/cli/theme-commands)
  - [Theme Check configuration](https://shopify.dev/themes/tools/theme-check/configuration)
  - [Theme Check commands](https://shopify.dev/themes/tools/theme-check/commands)
- [Shopify Cheat Sheet](https://www.shopify.com/partners/shopify-cheat-sheet)
- [Liquid reference](https://shopify.dev/api/liquid)
- [Ajax API](https://shopify.dev/api/ajax)
