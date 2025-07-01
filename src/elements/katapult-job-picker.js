// Lit
import { LitElement, html, css, unsafeCSS } from 'lit';
import { when } from 'lit/directives/when.js';
import { map } from 'lit/directives/map.js';

// Shoelace
import '@shoelace-style/shoelace/dist/components/select/select.js';
import '@shoelace-style/shoelace/dist/components/option/option.js';
import '@shoelace-style/shoelace/dist/components/dialog/dialog.js';
import '@shoelace-style/shoelace/dist/components/icon/icon.js';
import '@shoelace-style/shoelace/dist/components/button/button.js';
import '@shoelace-style/shoelace/dist/components/input/input.js';

// Styles
import { SlKatapultStyle } from '../styles/sl-katapult-style.js';
import { FlexStyle } from '../styles/flex.js';

export class KatapultJobPicker extends LitElement {
  static properties = {
    _jobData: {type: Array, state: true},
    _refreshAPICheck: {type: Boolean, state: true},
    _apiKey: {type: String},
    _pickerOpened: {type: Boolean, state: true},
    _newJobOpened: {type: Boolean, state: true},
    _currentDb: {type: String}
  }
  static styles = [
    unsafeCSS(SlKatapultStyle),
    unsafeCSS(FlexStyle),
    css`
      .set-width {
        width: 312px;
      }
      #job-picker::part(overlay),
      #new-job-dialog::part(overlay) {
        display: none;
      }
      #job-picker::part(base),
      #new-job-dialog::part(base) {
        max-width: fit-content;
        max-height: fit-content;
        margin: auto;
      }
      #new-job-dialog::part(panel) {
        --width: 400px;
      }
    `
  ]
  render() {
    return html`
      <sl-dialog id="job-picker" filled centered no-actions .open=${this.pickerOpened} label="JOB PICKER">
        <div slot="header-actions"></div>
        <div flex row align-center>
          ${when(
            !this.jobData || this.jobData.length == 0,
            () => html`
              <sl-select class="set-width" disabled placeholder="Loading...">
                <sl-icon library="material" name="arrow_drop_down" slot="expand-icon"></sl-icon>
              </sl-select>
            `
          )}
          ${when(
            this.jobData.length > 0,
            () => html`
              <sl-select class="set-width" hoist placeholder="Select a Job" value="select_a_job">
                <sl-icon library="material" name="arrow_drop_down" slot="expand-icon"></sl-icon>
                ${map(
                  this.jobData,
                  (job) => html`
                    <sl-option>${job.name}</sl-option>
                  `
                )}
              </sl-select>
            `
          )}
          <!-- <sl-icon style="margin-left: 12px; color: var(--sl-color-gray-700);" library="material" name="folder_round"></sl-icon> -->
        </div>
        <div flex space-between slot="footer">
          <sl-button id="job-picker-close" variant="default" @click=${e => this.close(e)}>Skip</sl-button>
          <sl-button variant="primary" @click=${() => this.openCreateJob()}>Create New Job</sl-button>
        </div>
      </sl-dialog>
      <sl-dialog id="new-job-dialog" filled centered no-actions .open=${this.newJobOpened} label="CREATE NEW JOB">
        <!-- <sl-input placeholder="Enter a new Job Name" label="Enter a new Job Name"></sl-input>
        <div>Searchable dropdown goes here</div> -->
        <div flex space-between slot="footer">
          <sl-button id="new-job-close" variant="default" @click=${e => this.close(e)}>Cancel</sl-button>
          <sl-button variant="primary" @click=${() => this.sendJobCall()}>Create Job</sl-button>
        </div>
      </sl-dialog>
    `
  }
  constructor() {
    super();

    // Variables
    this.jobData = [];
    this.refreshAPICheck = false;
    this.apiKey = this.getAPI(this.refreshAPICheck);
    this.pickerOpened = true;
    this.newJobOpened = false;
    this.currentDb = 'dcs';

    // Events and Functions
    window.addEventListener('apiKeyChange', async () => {
      this.refreshAPICheck = !this.refreshAPICheck;
      await this.getJobData();
    });
    if (this.apiKey) this.getJobData();
  }
  close(e) {
    const id = e.currentTarget.id;
    switch (id) {
      case 'job-picker-close':
        this.pickerOpened = false;
        break;
      case 'new-job-close':
        this.newJobOpened = false;
        break;
    }
    this.requestUpdate();
  }
  getAPI(refreshAPICheck) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('api_key') || localStorage.getItem('apiKey') || '';
  }
  async getJobData() {
    const database = this.currentDb != 'database' ? this.currentDb + '.' : '';
    const fetchData = await fetch(`https://${database}katapultpro.com/api/v3/jobs?api_key=${this.apiKey}`, {
      method: 'GET'
    }).then((res) => res.json());
    this.jobData = fetchData.data;
    this.requestUpdate();
  }
  openCreateJob() {
    this.newJobOpened = true;
    this.requestUpdate();
  }
  async sendJobCall() {
    const database = this.currentDb != 'database' ? this.currentDb + '.' : '';
    const body = { name: 'Annika POST Test', model: 'katapult', metadata: null };
    await fetch(`https://${database}katapultpro.com/api/v3/jobs?api_key=${this.apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });
  }
}
window.customElements.define('katapult-job-picker', KatapultJobPicker);
