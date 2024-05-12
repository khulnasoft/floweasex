import type { IRequestOptions } from 'flowease-workflow';
import { prepareRequestBody, setAgentOptions } from '../../GenericFunctions';
import type { BodyParameter, BodyParametersReducer } from '../../GenericFunctions';

describe('HTTP Node Utils, prepareRequestBody', () => {
	it('should call default reducer', async () => {
		const bodyParameters: BodyParameter[] = [
			{
				name: 'foo.bar',
				value: 'baz',
			},
		];
		const defaultReducer: BodyParametersReducer = jest.fn();

		await prepareRequestBody(bodyParameters, 'json', 3, defaultReducer);

		expect(defaultReducer).toBeCalledTimes(1);
		expect(defaultReducer).toBeCalledWith({}, { name: 'foo.bar', value: 'baz' });
	});

	it('should call process dot notations', async () => {
		const bodyParameters: BodyParameter[] = [
			{
				name: 'foo.bar.spam',
				value: 'baz',
			},
		];
		const defaultReducer: BodyParametersReducer = jest.fn();

		const result = await prepareRequestBody(bodyParameters, 'json', 4, defaultReducer);

		expect(defaultReducer).toBeCalledTimes(0);
		expect(result).toBeDefined();
		expect(result).toEqual({ foo: { bar: { spam: 'baz' } } });
	});
});

describe('HTTP Node Utils, setAgentOptions', () => {
	it("should not have agentOptions as it's undefined", async () => {
		const requestOptions: IRequestOptions = {
			method: 'GET',
			uri: 'https://example.com',
		};

		const sslCertificates = undefined;

		setAgentOptions(requestOptions, sslCertificates);

		expect(requestOptions).toEqual({
			method: 'GET',
			uri: 'https://example.com',
		});
	});

	it('should have agentOptions set', async () => {
		const requestOptions: IRequestOptions = {
			method: 'GET',
			uri: 'https://example.com',
		};

		const sslCertificates = {
			ca: 'mock-ca',
		};

		setAgentOptions(requestOptions, sslCertificates);

		expect(requestOptions).toStrictEqual({
			method: 'GET',
			uri: 'https://example.com',
			agentOptions: {
				ca: 'mock-ca',
			},
		});
	});
});
