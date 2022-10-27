import React from 'react';
import ToDosContainer from '../ui/pages/toDosContainer';
import { ToDosIndex } from '../ui/pages/toDosIndex';
import { Recurso } from './Recursos';
import { IRoute } from '/imports/modules/modulesTypings';

export const toDosRouterList: IRoute[] = [
    {
        path: '/toDos/:screenState/:toDosId',
        component: ToDosContainer,
        isProtected: true,
        resources: [Recurso.EXAMPLE_VIEW],
    },
    {
        path: '/toDos/:screenState',
        component: ToDosContainer,
        isProtected: true,
        resources: [Recurso.EXAMPLE_CREATE],
    },
    {
        path: '/toDos',
        component: ToDosContainer,
        isProtected: true,
        resources: [Recurso.EXAMPLE_VIEW],
    },
    {
        path: '/index',
        component: ToDosIndex,
        isProtected: true,
        resources: [Recurso.EXAMPLE_VIEW],
    },
];
