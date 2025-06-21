import React from 'react';
import { Modal, Tooltip } from 'antd';
import type { LangChainDocument } from '@/types/document';

interface LoadResultProps {
  open: boolean;
  onCancel: () => void;
  loadResult?: LangChainDocument[];
}

const LoadResult: React.FC<LoadResultProps> = ({ open, onCancel, loadResult }) => {
  return (
    <Modal
      open={open}
      onCancel={onCancel}
      footer={null}
      width={800}
      title="加载结果"
    >
      {loadResult && loadResult.length > 0 ? (
        <div style={{ maxHeight: 500, overflow: 'auto' }}>
          {loadResult.map((doc, idx) => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { source, producer, page, page_label, ...restMeta } = doc.metadata || {};
            const metaTooltip = Object.keys(restMeta).length > 0 ? (
              <pre style={{ whiteSpace: 'pre-wrap', margin: 0 }}>{JSON.stringify(restMeta, null, 2)}</pre>
            ) : null;
            return (
              <div key={idx} style={{ marginBottom: 16, padding: 8, borderBottom: '1px solid #eee' }}>
                <div>
                  <b>页码:</b> {doc.metadata?.page_label ?? '-'}
                </div>
                <div>
                  <b>内容:</b>{' '}
                  <Tooltip title={metaTooltip} placement="top">
                    <pre style={{ display: 'inline', whiteSpace: 'pre-wrap', margin: 0, cursor: metaTooltip ? 'pointer' : 'default' }}>{doc.page_content}</pre>
                  </Tooltip>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div>暂无结果</div>
      )}
    </Modal>
  );
};

export default LoadResult;
