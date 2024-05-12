import type { IExecuteFunctions, INodeProperties } from 'flowease-workflow';
import { microsoftApiRequest } from '../../transport';
import { folderRLC } from '../../descriptions';
import { decodeOutlookId } from '../../helpers/utils';
import { updateDisplayOptions } from '@utils/utilities';

export const properties: INodeProperties[] = [folderRLC];

const displayOptions = {
	show: {
		resource: ['folder'],
		operation: ['delete'],
	},
};

export const description = updateDisplayOptions(displayOptions, properties);

export async function execute(this: IExecuteFunctions, index: number) {
	const folderId = decodeOutlookId(
		this.getNodeParameter('folderId', index, undefined, {
			extractValue: true,
		}) as string,
	);

	await microsoftApiRequest.call(this, 'DELETE', `/mailFolders/${folderId}`);

	const executionData = this.helpers.constructExecutionMetaData(
		this.helpers.returnJsonArray({ success: true }),
		{ itemData: { item: index } },
	);

	return executionData;
}
