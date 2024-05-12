import type { ICredentialType, INodeProperties } from 'flowease-workflow';

export class StackbyApi implements ICredentialType {
	name = 'stackbyApi';

	displayName = 'Stackby API';

	documentationUrl = 'stackby';

	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
		},
	];
}
