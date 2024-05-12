import type { AllEntities } from 'flowease-workflow';

type NodeMap = {
	assistant: 'message' | 'create' | 'deleteAssistant' | 'list' | 'update';
	audio: 'generate' | 'transcribe' | 'translate';
	file: 'upload' | 'deleteFile' | 'list';
	image: 'generate' | 'analyze';
	text: 'message' | 'classify';
};

export type OpenAiType = AllEntities<NodeMap>;
