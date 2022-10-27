import React, { useState } from 'react';
import { Box, Button, List, ListItem } from '@mui/material';
import { PageLayout } from '/imports/ui/layouts/pageLayout';
import { toDosApi } from '../../api/toDosApi';
import _ from 'lodash';
import { withTracker } from 'meteor/react-meteor-data';
import { NavigateFunction } from 'react-router-dom';
import { IToDos } from '../../api/toDosSch';
import { TaskIndex } from './toDoTaskIndex';
import { IDefaultListProps } from '/imports/typings/BoilerplateDefaultTypings';

interface IToDosIndexList extends IDefaultListProps {
    toDoss: IToDos[];
    navigate: NavigateFunction;
}

const ToDosIndexList = ({ toDoss, navigate, user, isMobile }: IToDosIndexList) => {

    toDoss.reverse();

    return (
        <PageLayout key={'ExemplePageLayoutDetailKEY'}
            title={'Atividades Recentes'}>

            <Box>
                <h1 style={{fontSize: '1.5rem'}}>Seja bem vindo(a), {user.username}. </h1>
                <h2 style={{fontSize: '0.8rem'}}>Abaixo as atividades recentes são apresentadas. <br />
                    Para acessar todas as tarefas utilize o botão "Acessar todas as tarefas".</h2>
                <h3 style={{ fontSize: '0.7rem' }}>**Nesta tela não são exibidas tarefas pessoais.</h3>
            </Box>

            <Box>
                {toDoss.length === 0 && (
                    <>
                        <hr />
                        <p style={{ fontSize: '0.8rem' }}>No momento, não há tarefas para serem exibidas.</p>
                    </>
                )}
                {toDoss.length !== 0 && (
                    <List>
                        {toDoss.filter(e => e.isPersonal != true).slice(0, 5).map(tasks => (
                            <TaskIndex
                                key={tasks._id}
                                task={tasks} />
                        ))}
                    </List>
                )}
            </Box>

            <Box sx={{
                marginTop: 1,
                display: 'flex',
                justifyContent: 'right'
            }}>
                <Button
                    sx={{
                        width: !isMobile ? 250 : 120,
                        fontSize: !isMobile ? '1rem' : '0.6rem',
                    }}
                    key={'b3'}
                    color={'primary'}
                    variant="contained"
                    onClick={() => {
                        navigate(`/toDos/list`);
                    }}
                >
                    {'Acessar Todas as Tarefas'}
                </Button>
            </Box>
        </PageLayout >
    );
}

export const ToDosIndex = withTracker(() => {

    const subHandle = toDosApi.subscribe('toDosList', {});
    const toDoss = subHandle?.ready() ? toDosApi.find({}, { sort: { createdAt: -1 } }).fetch() : [];

    return {
        toDoss,
    };

})(ToDosIndexList);
