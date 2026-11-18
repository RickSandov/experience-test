import { useState } from 'react';
import {
    TreeView,
    TreeItem,
    Typography,
    Divider,
    Button,
    makeStyles
} from '@ellucian/react-design-system/core';
import { Graduation, PieChart, Dashboard, Analytics, Help } from '@ellucian/ds-icons/lib';


const useStyles = makeStyles()(() => ({
    root: {
        padding: '1rem',
    },
}));

/**
 * With Icons Tree View
 */
const WithIconsExample = () => {
    const { classes } = useStyles();
    const [selectedNode, setSelectedNode] = useState();
    const [toggledNode, setToggledNode] = useState();

    const onNodeSelect = (event, node) => {
        setSelectedNode(node);
    };

    const onNodeToggle = (event, node) => {
        setToggledNode(node);
    };

    const treeView =
        <TreeView
            onItemSelectionToggle={onNodeSelect}
            onExpandedItemsChange={onNodeToggle}
        >
            <TreeItem itemId="1" label="Advancement">
                <TreeItem itemId="2"
                    label="Graduation"
                    slots={{
                        icon: Graduation
                    }}
                />
            </TreeItem>
            <TreeItem itemId="3" label="Finance">
                <TreeItem itemId="4"
                    label="Financial Aid"
                    slots={{
                        icon: PieChart
                    }}
                />
            </TreeItem>
            <TreeItem itemId="5" label="Registration">
                <TreeItem itemId="6"
                    label="Enrollment Dashboard"
                    slots={{
                        icon: Dashboard
                    }}
                />
                <TreeItem itemId="7"
                    label="Analytics"
                    slots={{
                        icon: Analytics
                    }}
                />
                <TreeItem itemId="8" label="Help">
                    <TreeItem itemId="9" label="Pls Help">
                        <TreeItem itemId="10" label="Please? Help">
                            <TreeItem itemId="11" label="Okay stop">
                                <TreeItem itemId="12" label="pls stop">
                                    <TreeItem itemId="17" label="...">
                                        <TreeItem itemId="18" label="this isn't helping">
                                            <TreeItem itemId="19" label="why">
                                                <TreeItem itemId="20" label="fine">
                                                    <TreeItem itemId="13" label="I'm done">
                                                        <TreeItem itemId="14"
                                                            label="Help Finally"
                                                            slots={{
                                                                icon: Help
                                                            }}
                                                        />
                                                    </TreeItem>
                                                </TreeItem>
                                            </TreeItem>
                                        </TreeItem>
                                    </TreeItem>
                                </TreeItem>
                            </TreeItem>
                        </TreeItem>
                    </TreeItem>
                </TreeItem>
            </TreeItem>
        </TreeView>;

    return (
        <div className={classes.root}>
            <div>
                <Typography color="textSecondary">{selectedNode ? `Selected ItemId: ${selectedNode}` : 'Selected Item is undefined'}</Typography>
                <Typography style={{ overflowWrap: 'break-word' }} color="textSecondary">{toggledNode ? `Toggled ItemIds: ${toggledNode}` : 'No Items are expanded'}</Typography>
                <Divider />
            </div>
            {treeView}
        </div>
    );
};


/**
 * Controlled Tree View
 */
const ControlledTreeViewExample = () => {
    const { classes } = useStyles();
    const [selectedNode, setSelectedNode] = useState('');
    const [expanded, setExpanded] = useState(['1', '3', '5']);

    const onNodeSelect = (event, node) => {
        setSelectedNode(node);
    };

    const onNodeToggle = (event, node) => {
        setExpanded(node);
    };

    const handleExpandAll = () => {
        setExpanded((prevExpanded) => prevExpanded.length === 0 ? ['1', '3', '5'] : []);
    };

    const sidebar =
        <>
            <Button onClick={handleExpandAll}>
                {expanded.length === 0 ? 'Expand all' : 'Collapse all'}
            </Button>
            <TreeView
                aria-label="controlled"
                onItemSelectionToggle={onNodeSelect}
                onExpandedItemsChange={onNodeToggle}
                expandedItems={expanded}
                selectedItems={selectedNode}
            >
                <TreeItem itemId="1" label="Advancement">
                    <TreeItem itemId="2"
                        label="Graduation"
                        slots={{
                            icon: Graduation,
                        }}
                    />
                </TreeItem>
                <TreeItem itemId="3" label="Finance">
                    <TreeItem itemId="4"
                        label="Financial Aid"
                        slots={{
                            icon: PieChart,
                        }}
                    />
                </TreeItem>
                <TreeItem itemId="5" label="Registration">
                    <TreeItem itemId="6"
                        label="Enrollment Dashboard"
                        slots={{
                            icon: Dashboard,
                        }}
                    />
                    <TreeItem itemId="7"
                        label="Analytics"
                        slots={{
                            icon: Analytics,
                        }}
                    />
                </TreeItem>
            </TreeView>
        </>;

    return (
        <div className={classes.root}>
            <Typography gutterBottom>
                When using the controlled variant of TreeView, the <code>selected</code> prop must be defined.
            </Typography>
            <div>
                <Typography color="textSecondary">{selectedNode ? `Selected ItemId: ${selectedNode}` : 'Selected Item is undefined'}</Typography>
                <Typography style={{ overflowWrap: 'break-word' }} color="textSecondary">{expanded ? `Toggled ItemIds: ${expanded}` : 'No Items are expanded'}</Typography>
                <Divider />
            </div>
            {sidebar}
        </div>
    );
};


export { WithIconsExample, ControlledTreeViewExample };
