import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, token }) => ({
  widgetContainer: css`
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 8px;
    flex: 1;
    min-height: 32px;
    padding: 4px 8px;
    background: ${token.colorBgContainer};
    border: 1px solid ${token.colorBorder};
    border-radius: ${token.borderRadius}px;
    cursor: text;

    &:focus-within {
      border-color: ${token.colorPrimary};
      box-shadow: 0 0 0 2px ${token.colorPrimaryBg};
    }
  `,

  row: css`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
    padding: 8px 12px;
    cursor: pointer;
    border-radius: ${token.borderRadius}px;

    &:hover {
      background: ${token.colorBgTextHover};
    }
  `,

  header: css`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
    padding: 8px 12px;
    border-bottom: 1px solid ${token.colorBorderSecondary};
    margin-bottom: 4px;
  `,

  filterLabelButton: css`
    padding: 0;
    height: auto;
    text-align: left;

    &:hover {
      background: transparent !important;
    }
  `,

  filterNode: css`
    display: flex;
    align-items: center;
    background: ${token.colorBgTextHover};
    border-radius: ${token.borderRadius}px;
    padding: 0 8px;
    height: 28px;
    gap: 4px;
  `,

  filterNodeLeft: css`
    display: flex;
    align-items: center;
    max-width: 120px;
  `,

  filterNodeCenterWrapper: css`
    display: flex;
    align-items: center;
    gap: 4px;
  `,

  filterNodeCenter: css`
    display: flex;
    align-items: center;
  `,

  filterNodeRight: css`
    display: flex;
    align-items: center;
  `,

  filterCloseBadge: css`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 16px;
    height: 16px;
    background: ${token.colorBgContainer};
    border: 1px solid ${token.colorBorder};
    border-radius: 50%;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      background: ${token.colorErrorBg};
      border-color: ${token.colorError};
      color: ${token.colorError};
    }
  `,

  operatorTag: css`
    margin: 0;
    font-size: 11px;
    line-height: 1;
    padding: 2px 4px;
  `,

  breadcrumbTag: css`
    margin: 0;
  `,

  searchInput: css`
    flex: 1;
    min-width: 120px;

    .ant-input {
      padding: 0;
    }
  `,
}));

export const cardBodyStyle: React.CSSProperties = {
  padding: 8,
  maxHeight: 400,
  overflowY: 'auto',
};
