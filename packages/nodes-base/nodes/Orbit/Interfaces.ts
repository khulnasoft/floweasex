import type { IDataObject } from 'flowease-workflow';

export interface IData {
	data: [
		{
			id: string;
		},
	];
}

export interface IRelation {
	data: [
		{
			relationships: {
				identities: IData;
				member: IData;
			};
		},
	];
	included: IDataObject[];
}
