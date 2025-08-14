import {css} from 'lit';
export const KatapultScrollbars = css`
  ::-webkit-scrollbar {
    width: 8px;
    height:8px;
    background: var(--sl-color-neutral-200);
  }

  ::-webkit-scrollbar-thumb {
    background: var(--sl-color-neutral-400);
  }
`;