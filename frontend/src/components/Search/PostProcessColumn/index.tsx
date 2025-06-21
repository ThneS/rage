import React from 'react';
import { Card, Input, Button } from 'antd';
import ConfigRender from '@/components/Common/ConfigRender';
import type { ConfigParams } from '@/types/commonConfig';
import { useAppSelector } from '@/store';
import type { Document } from '@/types/document';

interface PostProcessColumnProps {
  config: ConfigParams | null;
  formValues: Record<string, string | number | boolean>;
  onValuesChange: (values: Record<string, string | number | boolean>) => void;
  result: string | null;
  onExecute: (content: string) => void;
  onBack: () => void;
  selectedDocument: Document | null;
}

const PostProcessColumn: React.FC<PostProcessColumnProps> = ({ config, formValues, onValuesChange, result, onExecute, onBack, selectedDocument }) => {
  const { loading } = useAppSelector((state) => state.search);

  const handleExecute = () => {
    if (result) {
      onExecute(result);
    }
  };

  if (!selectedDocument) {
      return (
          <Card title="后处理" style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ textAlign: 'center', color: '#999' }}>
              请先选择一个文档
              </div>
          </Card>
      );
  }

  return (
    <Card title="后处理" style={{ height: '100%' }}>
      {config && <ConfigRender config={config} formValues={formValues} onValuesChange={(_, all) => onValuesChange(all)} processing={loading} selectedDocument={selectedDocument} />}
      <Input.TextArea
        rows={4}
        value={result || ''}
        readOnly
        placeholder="后处理结果"
        style={{ marginTop: 16 }}
      />
      <div style={{ marginTop: 16, display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
        <Button onClick={onBack}>
            上一步
        </Button>
        <Button
            type="primary"
            onClick={handleExecute}
            disabled={!result}
        >
            执行
        </Button>
      </div>
    </Card>
  );
};

export default PostProcessColumn;
