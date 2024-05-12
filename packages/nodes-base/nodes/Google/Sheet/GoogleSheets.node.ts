import type { INodeTypeBaseDescription, IVersionedNodeType } from 'flowease-workflow';
import { VersionedNodeType } from 'flowease-workflow';

import { GoogleSheetsV1 } from './v1/GoogleSheetsV1.node';
import { GoogleSheetsV2 } from './v2/GoogleSheetsV2.node';

export class GoogleSheets extends VersionedNodeType {
	constructor() {
		const baseDescription: INodeTypeBaseDescription = {
			displayName: 'Google Sheets',
			name: 'googleSheets',
			icon: 'file:googleSheets.svg',
			group: ['input', 'output'],
			defaultVersion: 4.3,
			subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
			description: 'Read, update and write data to Google Sheets',
		};

		const nodeVersions: IVersionedNodeType['nodeVersions'] = {
			1: new GoogleSheetsV1(baseDescription),
			2: new GoogleSheetsV1(baseDescription),
			3: new GoogleSheetsV2(baseDescription),
			4: new GoogleSheetsV2(baseDescription),
			4.1: new GoogleSheetsV2(baseDescription),
			4.2: new GoogleSheetsV2(baseDescription),
			4.3: new GoogleSheetsV2(baseDescription),
		};

		super(nodeVersions, baseDescription);
	}
}
