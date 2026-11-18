import { useCallback } from 'react';
import { useCardInfo, useData } from '@ellucian/experience-extension-utils';

export default function useConfiguredEthosFetch() {
	const cardInfo = useCardInfo() || {};
	const {
		serverConfigContext: { cardPrefix } = {},
		cardId
	} = cardInfo;

	const { authenticatedEthosFetch } = useData();

	return useCallback(
		(resource, options = {}) => {
			if (!resource) {
				return authenticatedEthosFetch(resource, options);
			}

			const { skipCardContext, ...fetchOptions } = options;

			if (skipCardContext) {
				return authenticatedEthosFetch(resource, fetchOptions);
			}

			const hashIndex = resource.indexOf('#');
			const beforeHash =
				hashIndex >= 0 ? resource.slice(0, hashIndex) : resource;
			const hash = hashIndex >= 0 ? resource.slice(hashIndex) : '';

			const queryIndex = beforeHash.indexOf('?');
			const path =
				queryIndex >= 0 ? beforeHash.slice(0, queryIndex) : beforeHash;
			const query =
				queryIndex >= 0 ? beforeHash.slice(queryIndex + 1) : '';

			const searchParams = new URLSearchParams(query);

			if (cardId != null) {
				searchParams.set('cardId', String(cardId));
			}

			if (cardPrefix != null && cardPrefix !== '') {
				searchParams.set('cardPrefix', String(cardPrefix));
			}

			const finalQuery = searchParams.toString();
			const finalUrl = `${path}${finalQuery ? `?${finalQuery}` : ''}${hash}`;

			return authenticatedEthosFetch(finalUrl, fetchOptions);
		},
		[authenticatedEthosFetch, cardId, cardPrefix]
	);
}
