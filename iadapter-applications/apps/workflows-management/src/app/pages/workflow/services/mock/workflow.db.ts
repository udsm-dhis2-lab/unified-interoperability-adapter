import { Workflow } from '../../models/workflow.model';

export const workFlowMockData: Workflow = {
    root: {
        id: 's1674421266194',
        type: 'log',
        data: {
            name: 'Workflow Step 1',
            icon: { name: 'log-icon', color: 'blue' },
            config: { message: null, severity: null },
        },
        children: [
            {
                id: 's1674421287973',
                type: 'log',
                data: {
                    name: 'Workflow Step 10',
                    icon: { name: 'log-icon', color: 'blue' },
                    config: { message: null, severity: null },
                },
                children: [
                    {
                        id: 's1674421969732',
                        type: 'log',
                        data: {
                            name: 'Workflow Step 12',
                            icon: { name: 'log-icon', color: 'blue' },
                            config: { message: null, severity: null },
                        },
                        children: [
                            {
                                id: 's1674428969732',
                                type: 'log',
                                data: {
                                    name: 'Workflow Step 13',
                                    icon: { name: 'log-icon', color: 'blue' },
                                    config: { message: null, severity: null },
                                },
                                children: [
                                    {
                                        id: 's1674421239732',
                                        type: 'log',
                                        data: {
                                            name: 'Workflow Step 14',
                                            icon: { name: 'log-icon', color: 'blue' },
                                            config: { message: null, severity: null },
                                        },
                                        children: [
                                            {
                                                id: 's1674423429732',
                                                type: 'log',
                                                data: {
                                                    name: 'Workflow Step 15',
                                                    icon: { name: 'log-icon', color: 'blue' },
                                                    config: { message: null, severity: null },
                                                },
                                                children: [
                                                    {
                                                        id: 's12314421969732',
                                                        type: 'log',
                                                        data: {
                                                            name: 'Workflow Step 16',
                                                            icon: { name: 'log-icon', color: 'blue' },
                                                            config: { message: null, severity: null },
                                                        },
                                                        children: [],
                                                    },
                                                ],
                                            },
                                        ],
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
            {
                id: 's1674421267973',
                type: 'log',
                data: {
                    name: 'Workflow Step 5',
                    icon: { name: 'log-icon', color: 'blue' },
                    config: { message: null, severity: null },
                },
                children: [
                    {
                        id: 's1674421269732',
                        type: 'log',
                        data: {
                            name: 'Workflow Step 6',
                            icon: { name: 'log-icon', color: 'blue' },
                            config: { message: null, severity: null },
                        },
                        children: [],
                    },
                ],
            },
            {
                id: 's1674421267975',
                type: 'log',
                data: {
                    name: 'Workflow Step 2',
                    icon: { name: 'log-icon', color: 'blue' },
                    config: { message: null, severity: null },
                },
                children: [
                    {
                        id: 's1674421269738',
                        type: 'log',
                        data: {
                            name: 'Workflow Step 3',
                            icon: { name: 'log-icon', color: 'blue' },
                            config: { message: null, severity: null },
                        },
                        children: [],
                    },
                ],
            },
            {
                id: 's1674421268826',
                type: 'log',
                data: {
                    name: 'Workflow Step 4',
                    icon: { name: 'log-icon', color: 'blue' },
                    config: { message: null, severity: null },
                },
                children: [],
            },
        ],
    },
    connectors: [{ startStepId: 's1674421269738', endStepId: 's1674421268826' }],
};
