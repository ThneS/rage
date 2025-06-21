import React from 'react';
import { Card, Steps, Empty, Input, Button } from 'antd';
import PreProcessColumn from '../PreProcessColumn';
import PostProcessColumn from '../PostProcessColumn';
import type { Document } from '@/types/document';
import type { ConfigParams } from '@/types/commonConfig';
import ConfigRender from '@/components/Common/ConfigRender';
import { useAppSelector } from '@/store';

const { Step } = Steps;

interface SearchProcessingProps {
    currentStep: number;
    selectedDocument: Document | null;

    // Configs and results
    vecStoreConfig: ConfigParams | null;
    preConfig: ConfigParams | null;
    postConfig: ConfigParams | null;
    preProcessResult: string | null;
    postProcessResult: string | null;

    // Form values
    vecStoreFormValues: Record<string, string | number | boolean>;
    onVecStoreFormValuesChange: (values: Record<string, string | number | boolean>) => void;
    preProcessFormValues: Record<string, string | number | boolean>;
    onPreProcessFormValuesChange: (values: Record<string, string | number | boolean>) => void;
    postProcessFormValues: Record<string, string | number | boolean>;
    onPostProcessFormValuesChange: (values: Record<string, string | number | boolean>) => void;

    // Input state
    query: string;
    onQueryChange: (query: string) => void;

    // Handlers
    onPreProcess: () => void;
    onPostProcess: (content: string) => void;
    onParse: (content: string) => void;
    onStepChange: (step: number) => void;
}

const SearchProcessing: React.FC<SearchProcessingProps> = ({
    currentStep,
    selectedDocument,
    vecStoreConfig,
    preConfig,
    postConfig,
    preProcessResult,
    postProcessResult,
    vecStoreFormValues,
    onVecStoreFormValuesChange,
    preProcessFormValues,
    onPreProcessFormValuesChange,
    postProcessFormValues,
    onPostProcessFormValuesChange,
    query,
    onQueryChange,
    onPreProcess,
    onPostProcess,
    onParse,
    onStepChange,
}) => {
    if (!selectedDocument) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <Empty description="请先在左侧选择一个文档" />
            </div>
        );
    }

    return (
        <Card>
            <Steps current={currentStep}>
                <Step title="输入" />
                <Step title="预处理" />
                <Step title="后处理" />
            </Steps>
            <div style={{ marginTop: 24 }}>
                {currentStep === 0 && (
                    <InputArea
                        config={vecStoreConfig}
                        formValues={vecStoreFormValues}
                        onValuesChange={onVecStoreFormValuesChange}
                        value={query}
                        onChange={onQueryChange}
                        onExecute={onPreProcess}
                    />
                )}
                {currentStep === 1 && (
                    <PreProcessColumn
                        config={preConfig}
                        formValues={preProcessFormValues}
                        onValuesChange={onPreProcessFormValuesChange}
                        result={preProcessResult}
                        onExecute={onPostProcess}
                        onBack={() => onStepChange(0)}
                        selectedDocument={selectedDocument}
                    />
                )}
                {currentStep === 2 && (
                    <PostProcessColumn
                        config={postConfig}
                        formValues={postProcessFormValues}
                        onValuesChange={onPostProcessFormValuesChange}
                        result={postProcessResult}
                        onExecute={onParse}
                        onBack={() => onStepChange(1)}
                        selectedDocument={selectedDocument}
                    />
                )}
            </div>
        </Card>
    );
};

interface InputAreaProps {
    config: ConfigParams | null;
    formValues: Record<string, string | number | boolean>;
    onValuesChange: (values: Record<string, string | number | boolean>) => void;
    value: string;
    onChange: (value: string) => void;
    onExecute: () => void;
}

const InputArea: React.FC<InputAreaProps> = ({ config, formValues, onValuesChange, value, onChange, onExecute }) => {
    return (
        <>
            {config && <ConfigRender config={config} formValues={formValues} onValuesChange={(_, all) => onValuesChange(all)} processing={false} />}
            <Input.TextArea
                rows={4}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="请输入内容"
            />
            <Button
                type="primary"
                onClick={onExecute}
                disabled={!value}
                style={{ marginTop: 16, float: 'right' }}
            >
                执行
            </Button>
        </>
    );
};

export default SearchProcessing;
