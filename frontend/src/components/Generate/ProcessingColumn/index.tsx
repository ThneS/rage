import { useEffect, useState } from 'react';
import { Button, Input, Card, Space, message } from 'antd';
import { useAppDispatch } from '@/store';
import { fetchGenerateConfig } from '@/store/slices/generateSlice';
import { searchService } from '@/services/searchService';
import type { ConfigParams } from '@/types/commonConfig';

interface ProcessingColumnProps {
  documentId: number;
  config: ConfigParams | null;
  onFormValuesChange: (values: Record<string, string | number | boolean>) => void;
}

const ProcessingColumn = ({ documentId, config, onFormValuesChange }: ProcessingColumnProps) => {
  const [inputText, setInputText] = useState('');
  const [preProcessResult, setPreProcessResult] = useState('');
  const [postProcessResult, setPostProcessResult] = useState('');
  const [processing, setProcessing] = useState(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (documentId) {
      console.log('ProcessingColumn: 开始获取配置，documentId:', documentId);
      dispatch(fetchGenerateConfig(documentId));
    }
  }, [dispatch, documentId]);

  useEffect(() => {
    console.log('ProcessingColumn: config 变化:', config);
    if (config) {
      onFormValuesChange(config.default_config);
    }
  }, [config, onFormValuesChange]);

  const handleExecute = async () => {
    if (!inputText.trim()) {
      message.warning('请输入内容');
      return;
    }

    setProcessing(true);
    try {
      // 第一步：预处理
      const preResult = await searchService.preProcess(documentId, inputText, config?.default_config || {});
      setPreProcessResult(preResult.content || '');

      // 第二步：后处理
      const postResult = await searchService.postProcess(documentId, preResult.content || '', config?.default_config || {});
      setPostProcessResult(postResult.content || '');

      message.success('处理完成');
    } catch (error) {
      message.error('处理失败: ' + (error instanceof Error ? error.message : '未知错误'));
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div>
      <Card title="处理流程" size="small">
        <Space direction="vertical" style={{ width: '100%' }} size="middle">
          {/* 输入文本框 */}
          <div>
            <div style={{ marginBottom: '8px', fontWeight: 'bold' }}>输入</div>
            <Input.TextArea
              rows={3}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="请输入要处理的内容..."
            />
          </div>

          {/* 预处理文本框 */}
          <div>
            <div style={{ marginBottom: '8px', fontWeight: 'bold' }}>预处理</div>
            <Input.TextArea
              rows={3}
              value={preProcessResult}
              readOnly
              placeholder="预处理结果将在这里显示..."
              style={{ backgroundColor: '#f5f5f5' }}
            />
          </div>

          {/* 后处理文本框 */}
          <div>
            <div style={{ marginBottom: '8px', fontWeight: 'bold' }}>后处理</div>
            <Input.TextArea
              rows={3}
              value={postProcessResult}
              readOnly
              placeholder="后处理结果将在这里显示..."
              style={{ backgroundColor: '#f5f5f5' }}
            />
          </div>

          {/* 执行按钮 */}
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              type="primary"
              onClick={handleExecute}
              loading={processing}
              disabled={!inputText.trim()}
            >
              执行
            </Button>
          </div>
        </Space>
      </Card>
    </div>
  );
};

export default ProcessingColumn;
