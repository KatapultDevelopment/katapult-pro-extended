# Katapult Pro Extended
Extensible web component library for development, built with [Lit](https://lit.dev/docs/) and [Shoelace](https://shoelace.style/).

## Dependencies
- [Node.js](https://nodejs.org/en/download) 
- npm (comes with Node.js)

## Quick Start

**index.html**
```html
<html>
  <head>
    <script type="module">
      import 'katapult-pro-extended/elements/page-element/katapult-page-element.js';
    </script>
    <!-- Your favicon -->
    <style>
      :host {
        --primary-color: #8BC34A;
        --secondary-color: #7CB342;
        --accent-color: #FFB300;
      }
    </style>
  </head>
  <body>
    <katapult-page-element
      supportNum=""
      supportEmail=""
      companyName=""
      logoLink=""
    >
      <!-- Your content and Katapult elements -->
      <katapult-job-dropdown slot="toolbar-center"></katapult-job-dropdown>

    </katapult-page-element>
  </body>
</html>
```

> **Favicon:** Add a favicon to avoid `favicon.ico 404` errors.

> **Color Theme:** Set CSS variables: `--primary-color`, `--secondary-color`, `--accent-color`

## Katapult Elements

### Wrapper Element
#### `<katapult-page-element>`
- Main wrapper for your app; place content and other Katapult elements inside
- Attributes:
  - `supportNum`, `supportEmail`, `companyName`, `logoLink`
- Slots:
  - `slots="toolbar-left-of-logo"`
  - `slots="toolbar-left"`
  - `slots="toolbar-center"`
  - `slots="toolbar-right"`
- Parts: 
  - Styling the grey area under the toolbar
   ``` css
    katapult-page-element::part(content-wrapper) {
      align-content: center;
    }
  ```

```js
import 'katapult-pro-extended/elements/page-element/katapult-page-element.js';
```

### API Element
#### `<katapult-job-dropdown>`
- Dropdown for job selection (This is a v3 API call)
- Has function: `getSelectedJob()` returns the current job data
```js
import 'katapult-pro-extended/elements/katapult-job-dropdown.js';
```

### Non-API Element
#### `<katapult-dropdown>`
- Dropdown component for selecting from a list of items and supports filtering
- Slots: 
  - `slots="label"`
  - `slots="prefix"`
  - `slots="suffix"`
  - `slots="help-text"`
```js
import 'katapult-pro-extended/elements/katapult-dropdown.js';
```

## Katapult Styles
> **Note:** *Katapult styles are written as javascript modules and exported as CSS using Lit*
>
> To use these styles in your own Lit elements, simply import the style module and include using `unsafeCSS()` in your component’s `static styles` array.

### KatapultFlex
- Utility flexbox layout styles for rapid, attribute-based flex layouts.
```js
import { KatapultFlex } from 'katapult-pro-extended/styles/katapult-flex.js';
```
### KatapultScrollbars
- Customizes scrollbar appearance for a consistent look.
```js
import { KatapultScrollbars } from 'katapult-pro-extended/styles/katapult-scrollbars.js';
```
### KatapultShoelace
- Overrides shoelace defaults and extends Shoelace component styles to match Katapult branding, including attribute-based style customizations.
```js
import { KatapultShoelace } from 'katapult-pro-extended/styles/katapult-shoelace.js';
```
### KatapultShoelaceColors
- Defines color variables and palettes for Shoelace and Katapult components.
```js
import lightTheme from 'katapult-pro-extended/styles/katapult-shoelace-colors.js';
```

## API Reference

- **[Katapult Pro API V3 Documentation](https://github.com/KatapultDevelopment/katapult-pro-api-documentation/tree/main/v3)** 
    - API V3 Rate Limit:
        - 50 milliseconds between calls
        - Token limit of **10000**, a `GET` call costs **1** token, `POST` and `DELETE` calls cost **10** tokens: tokens are refilled **every minute**
- **[Katapult Pro API V2 Documentation](https://github.com/KatapultDevelopment/katapult-pro-api-documentation/blob/main/v2/DocumentationV2.MD)**
    - API V2 Rate Limit: 
        - 2 seconds between calls

## Other Resources

- [Lit Documentation](https://lit.dev/docs/)
- [Shoelace Documentation](https://shoelace.style/)
- [Node.js Download](https://nodejs.org/en/download) 