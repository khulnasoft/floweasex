import type { IExecuteFunctions, IDataObject, INodeExecutionData } from 'flowease-workflow';

import { apiRequest } from '../../../transport';

export async function getContact(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const id = this.getNodeParameter('contactId', index) as string;

	const qs = {} as IDataObject;
	const requestMethod = 'GET';
	const endpoint = `contacts/${id}`;
	const body = {} as IDataObject;

	const responseData = await apiRequest.call(this, requestMethod, endpoint, body, qs);
	return this.helpers.returnJsonArray(responseData as IDataObject);
}
