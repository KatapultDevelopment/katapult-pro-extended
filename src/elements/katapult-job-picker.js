// Lit
import { LitElement, html, css, unsafeCSS } from 'lit';
import { when } from 'lit/directives/when.js';

// Shoelace
import '@shoelace-style/shoelace/dist/components/select/select.js';
import '@shoelace-style/shoelace/dist/components/option/option.js';
import '@shoelace-style/shoelace/dist/components/dialog/dialog.js';
import '@shoelace-style/shoelace/dist/components/icon/icon.js';
import '@shoelace-style/shoelace/dist/components/button/button.js';
import '@shoelace-style/shoelace/dist/components/input/input.js';

// Elements
import './katapult-dropdown.js';

// Styles
import { KatapultShoelace } from '../styles/katapult-shoelace.js';
import { KatapultFlex } from '../styles/katapult-flex.js';

export class KatapultJobPicker extends LitElement {
  static properties = {
    _jobData: {type: Array, state: true},
    _jobNames: {type: Array, state: true},
    _refreshAPICheck: {type: Boolean, state: true},
    _apiKey: {type: String},
    _pickerOpened: {type: Boolean, state: true},
    _newJobOpened: {type: Boolean, state: true},
    _currentDb: {type: String},
    _newJobName: {type: String},
    _newJobModel: {type: String},
    _newJobError: {type: Boolean}
  }
  static styles = [
    unsafeCSS(KatapultShoelace),
    unsafeCSS(KatapultFlex),
    css`
      #job-picker::part(panel) {
        --width: fit-content;
      }
      #job-picker::part(body) {
        width: fit-content;
        padding-bottom: 10px;
        padding-top: 24px;
      }
      #job-picker::part(footer) {
        width: 100%;
      }
      #job-picker::part(overlay),
      #new-job-dialog::part(overlay) {
        display: none;
      }
      #job-picker::part(base),
      #new-job-dialog::part(base) {
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
            !this.jobNames || this.jobNames.length == 0,
            () => html`
              <katapult-dropdown
                .disabled=${true}
                .label=${'Select a Job'}
                .placeholder=${'Loading...'}
              ></katapult-dropdown>
            `
          )}
          ${when(
            this.jobNames?.length > 0,
            () => html`
              <katapult-dropdown
                .label=${'Select a Job'}
                .hoist=${true}
                .clearable=${true}
                .autoFilter=${true}
                .items=${this.jobNames}
                .value=${this.jobNames[0].value}
              ></katapult-dropdown>
            `
          )}
          <!-- <sl-icon style="margin-left: 12px; color: var(--sl-color-gray-700);" library="material" name="folder_round"></sl-icon> -->
        </div>
        <div flex space-between slot="footer">
          <sl-button id="job-picker-close" variant="default" @click=${e => this.close(e?.currentTarget?.id)}>Skip</sl-button>
          <sl-button variant="primary" @click=${() => this.openCreateJob()}>Create New Job</sl-button>
        </div>
      </sl-dialog>
      <sl-dialog id="new-job-dialog" filled centered no-actions .open=${this.newJobOpened} label="CREATE NEW JOB">
        <sl-input placeholder="Enter a new job name" label="Job Name" @sl-input=${(e) => (this._newJobName = e.currentTarget.value)}></sl-input>
        <sl-input placeholder="Enter an existing model name" label="Model Name" style="margin-top: 12px;" @sl-input=${(e) => (this._newJobModel = e.currentTarget.value)}></sl-input>
        <div flex column slot="footer">
          <div flex space-between>
            <sl-button id="new-job-close" variant="default" @click=${e => this.close(e?.currentTarget?.id)}>Cancel</sl-button>
            <sl-button variant="primary" @click=${() => this.sendJobCall()}>Create Job</sl-button>
          </div>
          ${when(
            this._newJobError,
            () => html`
              <div style="color: red; font-size: 14px; text-align: center; margin: 24px 16px 8px 16px;">You need to fill in both the job name and model name fields before you can create a new job.</div>
            `
          )}
        </div>
      </sl-dialog>
    `
  }
  constructor() {
    super();

    // Variables
    this.jobData = [];
    this.jobNames = [];
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
  close(elemId) {
    const id = elemId;
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
    if(this.jobData) this.jobNames = this.jobData.map(job => ({value: job.name, label: job.name}));
    this.requestUpdate();
  }
  openCreateJob() {
    this.newJobOpened = true;
    this.requestUpdate();
  }
  async sendJobCall() {
    if(this._newJobModel && this._newJobName) {
      const database = this.currentDb != 'database' ? this.currentDb + '.' : '';
      const body = { name: this._newJobName, model: this._newJobModel, metadata: null };
      await fetch(`https://${database}katapultpro.com/api/v3/jobs?api_key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });
      this._newJobError = false;
      this.close('new-job-close');
    } else {
      this._newJobError = true;
      this.requestUpdate();
    }
  }
}
window.customElements.define('katapult-job-picker', KatapultJobPicker);
