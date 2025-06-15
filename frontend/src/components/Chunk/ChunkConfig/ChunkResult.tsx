import { Modal, Tree } from 'antd';

const ChunkResultModal = ({ visible, onCancel, result }: any) => {
  if (!result) return null;
  // 假设meta_data.document有页码信息，chunks有分块内容
  const treeData = (result.chunks || []).map((chunk: any) => ({
    title: `分块编号: ${chunk.chunk_id}`,
    key: chunk.chunk_id,
    children: [
      { title: <span style={{ color: '#888' }}>{chunk.content.slice(0, 30)}...</span>, key: `content-${chunk.chunk_id}` }
    ]
  }));
  return (
    <Modal open={visible} onCancel={onCancel} footer={null} width={800} title={`关联文档: ${result.meta_data?.document?.filename || ''}`}>
      <div style={{ display: 'flex', height: 400 }}>
        <div style={{ flex: 1, overflow: 'auto', borderRight: '1px solid #eee', paddingRight: 16 }}>
          <Tree treeData={treeData} defaultExpandAll />
        </div>
        <div style={{ flex: 2, overflow: 'auto', paddingLeft: 16 }}>
          {result.chunks.map((chunk: any) => (
            <div key={chunk.chunk_id} style={{ marginBottom: 16 }}>
              <b>分块编号: {chunk.chunk_id}</b>
              <div style={{ whiteSpace: 'pre-wrap', background: '#fafafa', padding: 8, borderRadius: 4 }}>{chunk.content}</div>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
};

export default ChunkResultModal;