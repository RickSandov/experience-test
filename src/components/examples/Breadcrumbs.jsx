import {
    Breadcrumbs,
    TextLink
} from '@ellucian/react-design-system/core';

/**
 * Disabled Breadcrumbs items
 */
const BreadcrumbsWithDisabledItems = () => {
    return (
        <>
            <Breadcrumbs>
                <TextLink href="#" key="path" onClick={e => e.preventDefault()}>
                    Home
                </TextLink>
                {/* Just pass `disabled` prop to the `TextLink` component */}
                <TextLink href="#" key="path" onClick={e => e.preventDefault()} disabled>
                    Accessories
                </TextLink>
                <TextLink href="#" key="path" onClick={e => e.preventDefault()}>
                    Catalog
                </TextLink>
            </Breadcrumbs>
        </>
    );
};



export { BreadcrumbsWithDisabledItems };