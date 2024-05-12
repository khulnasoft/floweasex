import type { ICredentialType, INodeProperties } from 'flowease-workflow';

export class OpenWeatherMapApi implements ICredentialType {
	name = 'openWeatherMapApi';

	displayName = 'OpenWeatherMap API';

	documentationUrl = 'openWeatherMap';

	properties: INodeProperties[] = [
		{
			displayName: 'Access Token',
			name: 'accessToken',
			type: 'string',
			typeOptions: { password: true },
			default: '',
		},
	];
}
