// Lit
import { LitElement, html, css, unsafeCSS } from 'lit';
import { when } from 'lit/directives/when.js';

// Elements
import './katapult-dropdown.js';

// Styles
import { KatapultShoelace } from '../styles/katapult-shoelace.js';
import { KatapultFlex } from '../styles/katapult-flex.js';

export class KatapultJobDropdown extends LitElement {
  static properties = {
    _jobData: {type: Array, state: true},
    _jobNames: {type: Array, state: true},
    _apiKey: {type: String},
    _currentDb: {type: String}
  }
  static styles = [
    unsafeCSS(KatapultShoelace),
    unsafeCSS(KatapultFlex)
  ]
  render() {
    return html`
      <div flex row align-center>
        ${when(
          !this._jobNames || this._jobNames.length == 0,
          () => html`
            <katapult-dropdown
              .disabled=${true}
              .placeholder=${'Loading...'}
              .lookLikePaperElement=${true}
              .noLabel=${true}
              .noHelpText=${true}
            ></katapult-dropdown>
          `
        )}
        ${when(
          this._jobNames?.length > 0,
          () => html`
            <katapult-dropdown
              .hoist=${true}
              .clearable=${true}
              .autoFilter=${true}
              .items=${this._jobNames}
              .lookLikePaperElement=${true}
              .placeholder=${'Select a Job'}
              .noLabel=${true}
              .noHelpText=${true}
              @change=${(e) => this.selectJob(e)}
            ></katapult-dropdown>
          `
        )}
      </div>
    `
  }
  constructor() {
    super();

    // Variables
    this._jobData = [];
    this._jobNames = [];
    this._apiKey = this.getAPI();
    this._currentDb = 'dcs';

    // Events and Functions
    window.addEventListener('apiKeyChange', async (e) => {
      this._apiKey = e.detail;
      if (this._apiKey) await this.getJobData();
      else this.requestUpdate();
    });
    if (this._apiKey) this.getJobData();
  }
  selectJob(e) {
    const selectedJobData = this._jobData.filter(job => job.name === e.currentTarget.value)[0];
    console.log(e.currentTarget.value);
    console.log(selectedJobData);
  }
  getAPI() {
    return localStorage.getItem('apiKey') || '';
  }
  async getJobData() {
    const database = this._currentDb != 'database' ? this._currentDb + '.' : '';
    setTimeout( async () => {
      const fetchData = await fetch(`https://${database}katapultpro.com/api/v3/jobs?api_key=${this._apiKey}`, {
        method: 'GET'
      }).then((res) => res.json());
      this._jobData = fetchData.data;
      if(this._jobData) this._jobNames = this._jobData.map(job => ({value: job.name, label: job.name}));
      this.requestUpdate();
    }, 200);
  }
}
window.customElements.define('katapult-job-dropdown', KatapultJobDropdown);
