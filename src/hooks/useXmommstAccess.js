import { useMemo } from 'react';
import { useCardInfo, useUserInfo } from '@ellucian/experience-extension-utils';
import { resolveAccess } from '../domain/access';

/**
 * Read and write access for the current user, from the card configuration
 * (`writeAccessRoles`, `readAccessRoles`). Empty configuration grants nothing.
 * @returns {{ canRead: boolean, canWrite: boolean }}
 */
export default function useXmommstAccess() {
    const userInfo = useUserInfo();
    const { configuration } = useCardInfo() ?? {};
    const roles = userInfo?.roles;
    const { writeAccessRoles, readAccessRoles } = configuration ?? {};

    return useMemo(
        () => resolveAccess(roles, { writeAccessRoles, readAccessRoles }),
        [roles, writeAccessRoles, readAccessRoles]
    );
}
