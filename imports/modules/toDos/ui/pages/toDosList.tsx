import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { toDosApi } from '../../api/toDosApi';
import _, { stubTrue } from 'lodash';
import Fab from '@mui/material/Fab';
import TablePagination from '@mui/material/TablePagination';
import { ReactiveVar } from 'meteor/reactive-var';
import { initSearch } from '/imports/libs/searchUtils';
import shortid from 'shortid';
import { PageLayout } from '/imports/ui/layouts/pageLayout';
import TextField from '/imports/ui/components/SimpleFormFields/TextField/TextField';
import {
    IDefaultContainerProps,
    IDefaultListProps,
    IMeteorError,
} from '/imports/typings/BoilerplateDefaultTypings';
import { IToDos } from '../../api/toDosSch';
import { IConfigList } from '/imports/typings/IFilterProperties';
import { Recurso } from '../../config/Recursos';
import { RenderComPermissao } from '/imports/seguranca/ui/components/RenderComPermisao';
import { showNotification } from '/imports/ui/AppGeneralComponents';
import { List, Box, IconButton } from '@mui/material';
import { Task } from './toDosTask';
import { Container } from '@material-ui/core';
import { toDosStyle } from './style/toDosListStyle';
import { ToDosDetailContainer } from './toDosDetail';

interface IToDosList extends IDefaultListProps {
    remove: (doc: IToDos) => void;
    save: (doc: IToDos) => void;
    viewComplexTable: boolean;
    setViewComplexTable: (_enable: boolean) => void;
    toDoss: IToDos[];
    setFilter: (newFilter: Object) => void;
    clearFilter: () => void;
}

const ToDosList = (props: IToDosList) => {
    const {
        toDoss,
        navigate,
        remove,
        save,
        showDeleteDialog,
        showConfirmDialog,
        showModal,
        onSearch,
        total,
        clearFilter,
        setPage,
        setPageSize,
        searchBy,
        pageProperties,
        isMobile,
    } = props;

    const idToDos = shortid.generate();
    const permiteUser = props.user._id;
    const [text, setText] = React.useState(searchBy || '');

    const change = (e: React.ChangeEvent<HTMLInputElement>) => {
        clearFilter();
        if (text.length !== 0 && e.target.value.length === 0) {
            onSearch();
        }
        setText(e.target.value);
    };

    const keyPress = (_e: React.SyntheticEvent) => {
        if (text && text.trim().length > 0) {
            onSearch(text.trim());
        } else {
            onSearch();
        }
    };

    const click = (_e: any) => {
        if (text && text.trim().length > 0) {
            onSearch(text.trim());
        } else {
            onSearch();
        }
    };

    const callRemove = (doc: IToDos) => {
        const title = 'Remover tarefa';
        if (doc.createdby === permiteUser) {
            const message = `Deseja remover a tarefa "${doc.title}"?`;
            showDeleteDialog && showDeleteDialog(title, message, doc, remove);
        } else {
            showNotification({
                type: 'warning',
                title: 'Operação não realizada!',
                description: `Você não tem permissão para remover essa tarefa! Apenas ${props.user.username} pode remover.`,
            });
            props.navigate(`/toDos/`);
        }
    };

    const callEdit = (doc: IToDos) => {
        if (doc.situation === 'concluida') {
            showNotification({
                type: 'warning',
                title: 'Operação não realizada!',
                description: `Não é permitido editar tarefas concluidas. Caso necessario, reinicie a tarefa para editar.`,
            });
        } else {
            if (doc.createdby === permiteUser) {
                props.navigate(`/toDos/edit/${doc._id}`);
            } else {
                showNotification({
                    type: 'warning',
                    title: 'Operação não realizada!',
                    description: `Você não tem permissão para editar essa tarefa! Apenas ${props.user.username} pode editar.`,
                });
                props.navigate(`/toDos/`);
            }
        }
    };

    const callView = (doc: IToDos) => {
        showModal && showModal({
            modalOnClose: true,
            component: () => { return <ToDosDetailContainer {...props} screenState={'view'} id={doc._id} /> }
        });
    }

    const callAlterSituation = (doc: IToDos, movimento: string) => {
        if (permiteUser === doc.createdby) {
            if (movimento === 'iniciar') {
                const title = 'Alteração de Status da Tarefa';
                const msg = `Deseja colocar a tarefa '${doc.title}' EM ANDAMENTO?`;
                doc.situation = 'andamento';
                showConfirmDialog && showConfirmDialog(title, msg, doc, save);
            } else if (movimento === 'reiniciar') {
                const title = 'Reinício de Tarefa';
                const msg = `Deseja reiniciar o status da tarefa '${doc.title}'?`;
                doc.situation = 'cadastrada';
                showConfirmDialog && showConfirmDialog(title, msg, doc, save);
            } else {
                const title = 'Conclusão de Tarefa';
                const msg = `Deseja CONCLUIR a tarefa '${doc.title}'?`;
                doc.situation = 'concluida';
                showConfirmDialog && showConfirmDialog(title, msg, doc, save);
            }
        } else {
            showNotification({
                type: 'warning',
                title: 'Operação não realizada!',
                description: `Você não tem permissão para alterar o status dessa tarefa!`,
            });
        }
    };

    return (
        <PageLayout title={'Lista de Tarefas'} onBack={() => navigate('/index')} actions={[]}>
            {(!isMobile) && (
                <>
                    <TextField
                        name={'pesquisar'}
                        label={'Pesquisar'}
                        aria-label={'Campo de Pesquisa'}
                        value={text}
                        onChange={change}
                        onKeyPress={keyPress}
                        placeholder="Digite aqui o que deseja pesquisa..."
                        action={{ icon: 'search', onClick: click }}
                    />

                    <Container>
                        <Box sx={toDosStyle.boxTasks}>
                            <b>Tarefas CADASTRADAS</b>
                            {(toDoss.filter(e => e.situation === 'cadastrada')).length === 0 && (
                                <p style={{ fontSize: '0.8rem' }}>Não há tarefas para serem exibidas</p>
                            )}
                            {(toDoss.filter(e => e.situation === 'cadastrada')).length != null && (
                                <List>
                                    {toDoss.filter(e => e.situation === 'cadastrada').map(task => (
                                        <Task
                                            key={task._id}
                                            task={task}
                                            userTask={props.user}
                                            onDeleteClick={callRemove}
                                            onEditTarefa={callEdit}
                                            callView={callView}
                                            alterSituation={callAlterSituation}
                                            isMobile={isMobile}
                                        />
                                    ))
                                    }
                                </List>
                            )}
                        </Box>
                    </Container>

                    <Container>
                        <Box sx={toDosStyle.boxTasks}>
                            <b>Tarefas EM ANDAMENTO</b>
                            {(toDoss.filter(e => e.situation === 'andamento')).length === 0 && (
                                <p style={{ fontSize: '0.8rem' }}>Não há tarefas para serem exibidas</p>
                            )}
                            {(toDoss.filter(e => e.situation === 'andamento')).length != null && (
                                <List>
                                    {toDoss.filter(e => e.situation === 'andamento').map(task => (
                                        <Task
                                            key={task._id}
                                            task={task}
                                            userTask={props.user}
                                            onDeleteClick={callRemove}
                                            onEditTarefa={callEdit}
                                            callView={callView}
                                            alterSituation={callAlterSituation}
                                            isMobile={isMobile}
                                        />
                                    ))
                                    }
                                </List>
                            )}
                        </Box>
                    </Container>

                    <Container>
                        <Box sx={toDosStyle.boxTasks}>
                            <b>Tarefas CONCLUÍDAS</b>
                            {(toDoss.filter(e => e.situation === 'concluida')).length === 0 && (
                                <p style={{ fontSize: '0.8rem' }}>Não há tarefas para serem exibidas</p>
                            )}
                            {(toDoss.filter(e => e.situation === 'concluida')).length != null && (
                                <List>
                                    {toDoss.filter(e => e.situation === 'concluida').map(task => (
                                        <Task
                                            key={task._id}
                                            task={task}
                                            userTask={props.user}
                                            onDeleteClick={callRemove}
                                            onEditTarefa={callEdit}
                                            callView={callView}
                                            alterSituation={callAlterSituation}
                                            isMobile={isMobile}
                                        />
                                    ))
                                    }
                                </List>
                            )}
                        </Box>
                    </Container>
                </>
            )}

            {(isMobile) && (
                <>
                    <TextField
                        name={'pesquisar'}
                        label={'Pesquisar'}
                        aria-label={'Campo de Pesquisa'}
                        value={text}
                        onChange={change}
                        onKeyPress={keyPress}
                        placeholder="Digite aqui o que deseja pesquisa..."
                        action={{ icon: 'search', onClick: click }}
                    />

                    <Box sx={toDosStyle.boxTasks}>
                        <b style={toDosStyle.tituloSessaoMobile}>Tarefas CADASTRADAS</b>
                        {(toDoss.filter(e => e.situation === 'cadastrada')).length === 0 && (
                            <p style={{ fontSize: '0.8rem' }}>Não há tarefas para serem exibidas</p>
                        )}
                        {(toDoss.filter(e => e.situation === 'cadastrada')).length != null && (
                            <List>
                                {toDoss.filter(e => e.situation === 'cadastrada').map(task => (
                                    <Task
                                        key={task._id}
                                        task={task}
                                        userTask={props.user}
                                        onDeleteClick={callRemove}
                                        onEditTarefa={callEdit}
                                        callView={callView}
                                        alterSituation={callAlterSituation}
                                        isMobile={isMobile}
                                    />
                                ))
                                }
                            </List>
                        )}
                    </Box>

                    <Box sx={toDosStyle.boxTasks}>
                        <b>Tarefas EM ANDAMENTO</b>
                        {(toDoss.filter(e => e.situation === 'andamento')).length === 0 && (
                            <p style={toDosStyle.tituloSessaoMobile}>Não há tarefas para serem exibidas</p>
                        )}
                        {(toDoss.filter(e => e.situation === 'andamento')).length != null && (
                            <List>
                                {toDoss.filter(e => e.situation === 'andamento').map(task => (
                                    <Task
                                        key={task._id}
                                        task={task}
                                        userTask={props.user}
                                        onDeleteClick={callRemove}
                                        onEditTarefa={callEdit}
                                        callView={callView}
                                        alterSituation={callAlterSituation}
                                        isMobile={isMobile}
                                    />
                                ))
                                }
                            </List>
                        )}
                    </Box>

                    <Box sx={toDosStyle.boxTasks}>
                        <b>Tarefas CONCLUÍDAS</b>
                        {(toDoss.filter(e => e.situation === 'concluida')).length === 0 && (
                            <p style={toDosStyle.tituloSessaoMobile}>Não há tarefas para serem exibidas</p>
                        )}
                        {(toDoss.filter(e => e.situation === 'concluida')).length != null && (
                            <List>
                                {toDoss.filter(e => e.situation === 'concluida').map(task => (
                                    <Task
                                        key={task._id}
                                        task={task}
                                        userTask={props.user}
                                        onDeleteClick={callRemove}
                                        onEditTarefa={callEdit}
                                        callView={callView}
                                        alterSituation={callAlterSituation}
                                        isMobile={isMobile}
                                    />
                                ))
                                }
                            </List>
                        )}
                    </Box>
                </>
            )}

            <RenderComPermissao recursos={[Recurso.EXAMPLE_CREATE]}>
                <div
                    style={{
                        position: 'fixed',
                        bottom: isMobile ? 80 : 30,
                        right: 30,
                    }}
                >
                    <Fab
                        id={'add'}
                        aria-label={'Adicionar tarefa'}
                        onClick={() => navigate(`/toDos/create/${idToDos}`)}
                        color={'primary'}
                        sx={{ fontSize: '1.5rem' }}
                    >
                        +
                    </Fab>
                </div>
            </RenderComPermissao >
        </PageLayout >
    );
};

export const subscribeConfig = new ReactiveVar<IConfigList & { viewComplexTable: boolean }>({
    sortProperties: { field: 'createdat', sortAscending: true },
    filter: {},
    searchBy: null,
    viewComplexTable: false,
});

const toDosSearch = initSearch(
    toDosApi, // API
    subscribeConfig, // ReactiveVar subscribe configurations
    ['title', 'description'] // list of fields
);

let onSearchToDosTyping: any;

const viewComplexTable = new ReactiveVar(false);

export const ToDosListContainer = withTracker((props: IDefaultContainerProps) => {
    const { showNotification } = props;

    //Reactive Search/Filter
    const config = subscribeConfig.get();
    const sort = {
        [config.sortProperties.field]: config.sortProperties.sortAscending ? 1 : -1,
    };
    toDosSearch.setActualConfig(config);

    //Subscribe parameters
    const filter = { ...config.filter };

    //Collection Subscribe
    const subHandle = toDosApi.subscribe('toDosList', filter, {
        sort
    });
    const toDoss = subHandle?.ready() ? toDosApi.find(filter, {}).fetch() : [];

    return {
        toDoss,
        loading: !!subHandle && !subHandle.ready(),
        remove: (doc: IToDos) => {
            toDosApi.remove(doc, (e: IMeteorError) => {
                if (!e) {
                    showNotification &&
                        showNotification({
                            type: 'success',
                            title: 'Operação realizada!',
                            message: `A tarefa foi removida com sucesso!`,
                        });
                } else {
                    console.log('Error:', e);
                    showNotification &&
                        showNotification({
                            type: 'warning',
                            title: 'Operação não realizada!',
                            message: `Erro ao realizar a operação: ${e.reason}`,
                        });
                }
            });
        },
        save: (doc: IToDos) => {
            toDosApi['update'](doc, (e: IMeteorError, r: string) => {
                if (!e) {
                    if (doc.situation === 'andamento') (
                        showNotification &&
                        showNotification({
                            type: 'success',
                            title: 'Operação realizada!',
                            description: `A tarefa ${doc.title} foi iniciada.`,
                        }))

                    if (doc.situation === 'cadastrada') (
                        showNotification &&
                        showNotification({
                            type: 'success',
                            title: 'Operação realizada!',
                            description: `A tarefa ${doc.title} voltou para CADASTRADA.`,
                        }))

                    if (doc.situation === 'concluida') (
                        showNotification &&
                        showNotification({
                            type: 'success',
                            title: 'Operação realizada!',
                            description: `A tarefa ${doc.title} foi CONCLUIDA.`,
                        }))
                } else {
                    console.log('Error:', e);
                    showNotification &&
                        showNotification({
                            type: 'warning',
                            title: 'Operação não realizada!',
                            description: `Erro ao realizar a operação: ${e.reason}`,
                        });
                }
            });
        },
        viewComplexTable: viewComplexTable.get(),
        setViewComplexTable: (enableComplexTable: boolean) =>
            viewComplexTable.set(enableComplexTable),
        searchBy: config.searchBy,
        onSearch: (...params: any) => {
            onSearchToDosTyping && clearTimeout(onSearchToDosTyping);
            onSearchToDosTyping = setTimeout(() => {
                subscribeConfig.set(config);
                toDosSearch.onSearch(...params);
            }, 1000);
        },
        total: subHandle ? subHandle.total : toDoss.length,
        filter,
        sort,
        setFilter: (newFilter = {}) => {
            config.filter = { ...filter, ...newFilter };
            Object.keys(config.filter).forEach((key) => {
                if (config.filter[key] === null || config.filter[key] === undefined) {
                    delete config.filter[key];
                }
            });
            subscribeConfig.set(config);
        },
        clearFilter: () => {
            config.filter = {};
            subscribeConfig.set(config);
        },
        setSort: (sort = { field: 'createdat', sortAscending: true }) => {
            config.sortProperties = sort;
            subscribeConfig.set(config);
        },
    };
})(ToDosList);