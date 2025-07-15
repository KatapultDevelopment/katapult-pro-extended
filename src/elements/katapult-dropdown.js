// Lit
import { html, css, LitElement, unsafeCSS } from 'lit';
import { styleMap } from 'lit/directives/style-map.js';
import { when } from 'lit/directives/when.js';
import { createRef, ref } from 'lit/directives/ref.js';
import { LitVirtualizer } from '@lit-labs/virtualizer';

// Shoelace
import SlInput from '@shoelace-style/shoelace/dist/components/input/input.js';
import SlDropdown from '@shoelace-style/shoelace/dist/components/dropdown/dropdown.js';
import '@shoelace-style/shoelace/dist/components/menu/menu.js';
import '@shoelace-style/shoelace/dist/components/menu-item/menu-item.js';
import '@shoelace-style/shoelace/dist/components/icon/icon.js';

// Styles
import lightTheme from '../styles/katapult-shoelace-colors.js';
import { KatapultScrollbars } from '../styles/katapult-scrollbars.js';

/** @import { Ref } from 'lit/directives/ref.js' */

/**
 * @typedef {Object} KatapultDropdownItem
 * @property {string} [label]
 * @property {string} value
 * @property {string} [disabled=false]
 */

export class KatapultDropdown extends LitElement {
  static DEFAULT_RENDER_ITEM = function (item, index, arr) {
    return html` <sl-menu-item value=${item.value} ?disabled=${item?.disabled}>${item.label}</sl-menu-item>`;
  };

  static properties = {
    /** sl-dropdown */
    open: { type: Boolean, reflect: true },
    placement: { type: String },
    stayOpenOnSelect: { type: Boolean, attribute: 'stay-open-on-select', reflect: true },
    containingElement: { type: Object },
    hoist: { type: Boolean },
    /** sl-input */
    autocomplete: { type: String },
    size: { type: String },
    filled: { type: Boolean },
    pill: { type: Boolean },
    label: { type: String },
    helpText: { type: String },
    clearable: { type: Boolean },
    placeholder: { type: String },

    disabled: { type: Boolean },
    items: { type: Array, shouldUpdate: false },
    value: { type: String, shouldUpdate: false },
    renderItem: { type: Function },
    autoFilter: { type: Boolean, attribute: 'auto-filter', reflect: true, shouldUpdate: false },
    lookLikePaperElement: { type: Boolean, attribute: 'look-like-paper-element', reflect: true },

    _filteredItems: { type: Array, state: true },
    _userInput: { type: String, shouldUpdate: false, state: true },
    _valueLabel: { type: String, shouldUpdate: false, state: true },
    _inputValue: { type: String, state: true },
    _virtualizerRange: { type: Object, state: true, shouldUpdate: false },
    _highlightIndex: { type: Number, state: true, shouldUpdate: false },
    _highlightElement: { type: Object, state: true, shouldUpdate: false },
    _selectedElement: { type: Object, state: true, shouldUpdate: false }
  };

  static styles = [
    lightTheme,
    unsafeCSS(KatapultScrollbars),
    css`
      /* Add your component styles here */
      :host {
        display: contents;
      }

      sl-dropdown {
        min-width: 300px;
        height: inherit;
        width: inherit;
      }

      sl-menu {
        min-width: 300px;
      }

      sl-menu-item::part(base) {
        margin: 2px 0;
      }

      lit-virtualizer > * {
        width: -webkit-fill-available;
      }

      /* Sl Menu Item Selected Style */
      lit-virtualizer > sl-menu-item.selected {
        background: var(--sl-color-neutral-50);
        color: var(--sl-color-neutral-800);
        font-weight: var(--sl-font-weight-bold);
      }
      lit-virtualizer > sl-menu-item.selected::part(base) {
        color: inherit;
        font-weight: inherit;
      }

      /* Sl Menu Item Highlight Style */
      lit-virtualizer > sl-menu-item.highlight::part(base) {
        background: var(--primary-color, var(--sl-color-gray-400));
        color: var(--sl-color-neutral-0);
      }

      sl-input::part(clear-button) {
        color: var(--primary-color, var(--sl-color-gray-400))
      }

      .footer {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: var(--sl-spacing-sx-small);
        padding: var(--sl-spacing-2x-small);
        font-size: var(--sl-font-size-small);
        font-weight: var(--sl-font-weight-semibold);
        color: var(--sl-color-neutral-500);
      }
    `
  ];

  render() {
    return html`
      <sl-dropdown
        ${ref(this._dropdownRef)}
        part="dropdown"
        .open=${this.open}
        .placement=${this.placement}
        .hoist=${this.hoist}
        .stayOpenOnSelect=${this.stayOpenOnSelect}
        .containingElement=${this.containingElement}
        sync="width"
        @sl-select=${(e) => this.#selectItem(e.detail.item)}
        @sl-show=${() => {
          this.open = true;
          this.#focusInput();
          window.addEventListener('keydown', this._keydownHandler);
          // Give the virtualizer a chance to update following the dropdown opening and then highlight the selected item.
          setTimeout(() => this.#setHighlightIndex(this._selectedIndex, 'center'));
        }}
        @sl-hide=${() => {
          this.open = false;
          this.blur();
          this.#clearUserInput();
          window.removeEventListener('keydown', this._keydownHandler);
        }}
      >
        <sl-input
          ${ref(this._inputRef)}
          ?look-like-paper-element=${this.lookLikePaperElement}
          slot="trigger"
          part="input"
          .value=${this._inputValue}
          .autocomplete=${this.autocomplete}
          .size=${this.size}
          ?filled=${this.filled}
          ?pill=${this.pill}
          .label=${this.label}
          .helpText=${this.helpText}
          .clearable=${this.clearable}
          .disabled=${this.disabled}
          .placeholder=${this.placeholder}
          @focus=${(e) => e.currentTarget.select()}
          @blur=${(e) => {
            // Ensure the input value is reset on blur
            // (was failing to happen when an item was selected via Enter key).
            e.target.value = this._inputValue;
          }}
          @click=${(e) => {
            e.stopPropagation();
            this.show();
          }}
          @sl-input=${(e) => (this._userInput = e.currentTarget.value)}
          @keydown=${(e) => {
            // Don't allow up and down keys to navigate to the start and end of the input.
            if (['ArrowDown', 'ArrowUp'].includes(e.code)) e.preventDefault();
            // Enter key from the dropdown trigger (this input) seems to be stopped and never reaches the window.
            // Because of this, we need to handle the Enter key here to select the highlighted item.
            if (e.code === 'Enter') {
              e.stopPropagation();
              this.#selectHighlightItem();
            }
            if (e.code == 'Space') {
              // Prevent the dropdown from closing when the space key is pressed.
              e.stopPropagation();
            }
          }}
          @sl-clear=${this.clear.bind(this)}
        >
          <slot name="label" slot="label">${this.label != '' ? this.label : nothing}</slot>
          <slot name="prefix" slot="prefix"></slot>
          <slot name="suffix" slot="suffix"></slot>
          <slot name="help-text" slot="help-text">${this.helpText != '' ? this.helpText : nothing}</slot>
          ${when(
            !this.clearable || !this._inputValue,
            () => html`
              <sl-icon
                library="system"
                name="chevron-down"
                style=${styleMap({
                  color: 'var(--sl-input-icon-color)',
                  transition: 'transform 0.3s',
                  transform: this.open ? 'rotate(-180deg)' : 'rotate(0deg)'
                })}
                part="expand-icon"
                slot="suffix"
              >
              </sl-icon>
            `
          )}
          ${when(
            this.clearable,
            () => html`
              <sl-icon small library="material" slot="clear-icon" name="clear"></sl-icon>
            `
          )}
        </sl-input>
        <sl-menu part="menu">
          <lit-virtualizer
            ${ref(this._virtualizerRef)}
            part="virtualizer"
            .renderItem=${(item, index) => when(item !== undefined, () => this.renderItem(item, index, this._filteredItems))}
            .keyFunction=${(item) => item?.value}
            .items=${this._filteredItems}
            @rangeChanged=${(e) => (this._virtualizerRange = { first: e.first, last: e.last })}
          ></lit-virtualizer>
          ${when(
            this._filteredItems.length === 0,
            () => html`
              <div class="footer">
                <material-icon icon="search_off"></material-icon>
                <span>No Results</span>
              </div>
            `
          )}
        </sl-menu>
      </sl-dropdown>
    `;
  }

  constructor() {
    super();

    // Element References.
    /** @type { Ref<SlInput> } */
    this._inputRef = createRef();
    /** @type { Ref<SlDropdown> } */
    this._dropdownRef = createRef();
    /** @type {Ref<LitVirtualizer>} */
    this._virtualizerRef = createRef();

    // Dropdown Properties.
    /** @type { SlDropdown['open'] } */
    this.open = false;
    /** @type { SlDropdown['placement'] } */
    this.placement = 'bottom';
    /** @type { SlDropdown['disabled'] } */
    this.disabled = false;
    /** @type { SlDropdown['stayOpenOnSelect'] } */
    this.stayOpenOnSelect = false;
    /** @type { SlDropdown['containingElement'] } */
    this.containingElement = undefined;
    /** @type { SlDropdown['hoist'] } */
    this.hoist = false;

    // Input Properties.
    /** @type { SlInput['autocomplete'] } */
    this.autocomplete = 'off';
    /** @type { SlInput['size'] } */
    this.size = 'medium';
    /** @type { SlInput['filled'] } */
    this.filled = false;
    /** @type { SlInput['pill'] } */
    this.pill = false;
    /** @type { SlInput['label'] } */
    this.label = '';
    /** @type { SlInput['helpText'] } */
    this.helpText = '';
    /** @type { SlInput['clearable'] } */
    this.clearable = false;
    /** @type { SlInput['placeholder'] } */
    this.placeholder = '';

    // Public Properties.
    /** @type {KatapultDropdownItem[]} */
    this.items = [];
    /** @type { String } */
    this.value = '';
    /** @type { Function } */
    this.renderItem = KatapultDropdown.DEFAULT_RENDER_ITEM;
    /** @type { Boolean } */
    this.autoFilter = false;
    /** @type { Boolean } */
    this.lookLikePaperElement = false;

    // Private Properties.
    /** @type { KatapultDropdownItem[] } */
    this._filteredItems = [];
    /** @type { ?String } */
    this._userInput = null;
    /** @type { String } */
    this._inputValue = '';
    /** @type { Number } */
    this._selectedIndex = -1;
    /** @type { ?Element } */
    this._selectedElement = null;
    /** @type { Number } */
    this._highlightIndex = 0;
    /** @type { ?Element } */
    this._highlightElement = null;
    /** @type { { first: Number, last: Number } } */
    this._virtualizerRange = { first: -1, last: -1 };

    /** @type { EventListener } */
    this._keydownHandler = (e) => {
      if (e instanceof KeyboardEvent === false) return;
      switch (e.code) {
        case 'ArrowDown': {
          // Prevent default scrolling behavior.
          e.preventDefault();
          const maxIndex = this._filteredItems.length - 1;
          // If the highlight index is at the end, wrap around to the beginning.
          const newHighlightIndex = this._highlightIndex === maxIndex ? 0 : this._highlightIndex + 1;
          this.#setHighlightIndex(newHighlightIndex);
          break;
        }
        case 'ArrowUp': {
          // Prevent default scrolling behavior.
          e.preventDefault();
          const maxIndex = this._filteredItems.length - 1;
          // If the highlight index is at the beginning, wrap around to the end.
          const newHighlightIndex = this._highlightIndex === 0 ? maxIndex : this._highlightIndex - 1;
          this.#setHighlightIndex(newHighlightIndex);
          break;
        }
        case 'Enter':
          this.#selectHighlightItem();
          break;
      }
    };
  }
  disconnectedCallback() {
    window.removeEventListener('keydown', this._keydownHandler);
  }
  shouldUpdate(changedProperties) {
    // Ensure value is always a string.
    if (changedProperties.has('value')) this.value ??= '';

    if (changedProperties.has('disabled') && this.disabled) this.hide();

    // Notify of value property changes.
    if (changedProperties.has('value')) {
      this.dispatchEvent(new CustomEvent('value-changed'));
    }

    // Notify of user input (ignore initial default value).
    if (changedProperties.has('_userInput') && changedProperties.get('_userInput') !== undefined) {
      this.dispatchEvent(new CustomEvent('user-input', { detail: { value: this._userInput ?? '' } }));
    }

    // Possibly auto filter items based on user input.
    if (['items', '_userInput', 'autoFilter'].some((prop) => changedProperties.has(prop))) {
      const items = this.items ?? [];
      const sanitizedUserInput = this._userInput?.trim().toLowerCase() ?? '';
      if (this.autoFilter && sanitizedUserInput !== '') {
        const filteredItems = items.filter((item) => {
          const sanitizedLabel = item.label?.trim().toLowerCase() ?? '';
          return sanitizedLabel.includes(sanitizedUserInput);
        });
        this._filteredItems = filteredItems;
      } else {
        this._filteredItems = items;
      }
    }

    // Update the text to display for the selected value.
    if (['value', 'items'].some((prop) => changedProperties.has(prop))) {
      if (this.value === '') this._valueLabel = '';
      else {
        const valueLabel = this.items.find((item) => item.value === this.value)?.label ?? '';
        if (valueLabel !== '') this._valueLabel = valueLabel;
      }
    }
    // Update the text displayed in the input field.
    if (['_userInput', '_valueLabel'].some((prop) => changedProperties.has(prop))) {
      this._inputValue = this._userInput ?? this._valueLabel ?? '';
    }

    // Update the index of the selected item.
    if (['value', '_filteredItems'].some((prop) => changedProperties.has(prop))) {
      this._selectedIndex = this._filteredItems.findIndex((item) => item.value === this.value);
    }
    // Update selected item.
    if (['_selectedIndex', '_virtualizerRange'].some((prop) => changedProperties.has(prop))) {
      this.#updateSelectedItem();
    }
    // Update the current selected element's class.
    if (changedProperties.has('_selectedElement')) {
      changedProperties.get('_selectedElement')?.classList.remove('selected');
      this._selectedElement?.classList.add('selected');
    }

    // Highlight the first item anytime the items change.
    if (changedProperties.has('_filteredItems')) {
      this.#setHighlightIndex(0, 'start');
    }

    // Ensure current highlight index is within bounds.
    if (['_highlightIndex', '_filteredItems'].some((prop) => changedProperties.has(prop))) {
      this._highlightIndex = this.clamp(this._highlightIndex, 0, this._filteredItems.length - 1);
    }
    // Update highlighted item.
    if (['_highlightIndex', '_virtualizerRange'].some((prop) => changedProperties.has(prop))) {
      this.#updateHighlightedItem();
    }
    // Update the current highlight element's class.
    if (changedProperties.has('_highlightElement')) {
      changedProperties.get('_highlightElement')?.classList.remove('highlight');
      this._highlightElement?.classList.add('highlight');
    }

    const updateCalledManually = changedProperties.size == 0;
    const nonIgnoredPropertiesHaveChanged = Array.from(changedProperties.keys()).some(
        (prop) => this.constructor.properties[prop].shouldUpdate !== false
    );
    return updateCalledManually || nonIgnoredPropertiesHaveChanged;
  }

  /**
   * Shows the dropdown menu.
   * @returns { void }
   */
  show() {
    const dropdown = this._dropdownRef.value;
    if (!dropdown) return;
    if (dropdown.open !== true) dropdown.show();
    this.#focusInput();
  }

  /**
   * Hides the dropdown menu.
   * @returns { void }
   */
  hide() {
    const dropdown = this._dropdownRef.value;
    if (!dropdown) return;
    if (dropdown.open !== false) dropdown.hide();
  }

  /**
   * Clears the current value of the dropdown and clears any user input.
   * @returns { void }
   */
  clear() {
    this.#clearUserInput();
    this.#setValue('');
  }
  clamp(num, min, max) {
    if (max == null) max = Infinity;
    if (min == null) min = -Infinity;
    return num > max ? max : num < min ? min : num;
  }
  #selectItem(item) {
    if (!item) return;

    // Dispatch a select event and give user the option to cancel the selection.
    const selectedEvent = new CustomEvent('select', { cancelable: true, detail: { item } });
    const proceed = this.dispatchEvent(selectedEvent);
    if (!proceed) return;

    // Automatically set the value based on the selected item if it has a value attribute.
    const value = item.getAttribute('value');
    if (value != null) {
      this.#setValue(item.value);
      this.#clearUserInput();
    }

    // Close the dropdown if not set to stay open on select.
    if (!this.stayOpenOnSelect) this.hide();
  }
  #selectHighlightItem() {
    this.#selectItem(this._highlightElement);
  }
  #setValue(value) {
    const newValue = value ?? '';
    // Ignore redundant value changes.
    if (this.value == newValue) return;
    this.value = newValue;
    this.dispatchEvent(new CustomEvent('change'));
  }
  #clearUserInput() {
    this._userInput = null;
  }
  #updateSelectedItem() {
    const virtualizer = this._virtualizerRef.value;
    const firstRenderedIndex = this._virtualizerRange.first;
    if (!virtualizer || firstRenderedIndex === -1) {
      this._selectedElement = null;
      return;
    }
    const relativeIndex = this._selectedIndex - this._virtualizerRange.first;
    const selectedItem = virtualizer.children[relativeIndex] ?? null;
    this._selectedElement = selectedItem;
  }

  /**
   * Sets the highlight index (constraining it to valid indices) and then scrolls to it.
   * @param {number} index
   * @param {'start' | 'center' | 'end' | 'nearest'} scrollPosition
   */
  #setHighlightIndex(index, scrollPosition = 'nearest') {
    this._highlightIndex = this.clamp(index, 0, this._filteredItems.length - 1);
    const virtualizer = this._virtualizerRef.value;
    virtualizer?.scrollToIndex(this._highlightIndex, scrollPosition);
  }
  #updateHighlightedItem() {
    const virtualizer = this._virtualizerRef.value;
    const firstRenderedIndex = this._virtualizerRange.first;
    if (!virtualizer || firstRenderedIndex === -1) {
      this._highlightElement = null;
      return;
    }
    const relativeIndex = this._highlightIndex - this._virtualizerRange.first;
    const highlightedItem = virtualizer.children[relativeIndex] ?? null;
    this._highlightElement = highlightedItem;
  }
  #focusInput() {
    const input = this._inputRef.value;
    if (!input) return;
    input.focus();
  }
}

window.customElements.define('katapult-dropdown', KatapultDropdown);