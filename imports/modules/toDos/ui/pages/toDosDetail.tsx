import React from 'react';
import { useTracker, withTracker } from 'meteor/react-meteor-data';
import { toDosApi } from '../../api/toDosApi';
import { userprofileApi } from '/imports/userprofile/api/UserProfileApi';
import SimpleForm from '../../../../ui/components/SimpleForm/SimpleForm';
import Button from '@mui/material/Button';
import FormGroup from '@mui/material/FormGroup';
import TextField from '/imports/ui/components/SimpleFormFields/TextField/TextField';
import { PageLayout } from '/imports/ui/layouts/pageLayout';
import { IToDos } from '../../api/toDosSch';
import {
    IDefaultContainerProps,
    IDefaultDetailProps,
    IMeteorError,
} from '/imports/typings/BoilerplateDefaultTypings';
import { useTheme } from '@mui/material/styles';
import { showLoading } from '/imports/ui/components/Loading/Loading';
import { FormControlLabel, MenuItem, Select, Switch, Typography } from '@mui/material';

interface IToDosDetail extends IDefaultDetailProps {
    toDosDoc: IToDos;
    save: (doc: IToDos, _callback?: any) => void;
}

const ToDosDetail = (props: IToDosDetail) => {
    const { isPrintView, screenState, loading, toDosDoc, save, navigate, isMobile } = props;
    const theme = useTheme();
    let taskUser;

    if (screenState === 'view' && isMobile) {
        const taskAtual = useTracker(() => toDosApi.find({}).fetch());
        const userCreateTask = taskAtual[0].createdby;
        taskUser = useTracker(() => userprofileApi.findOne({ _id: userCreateTask }));
    }

    const handleSubmit = (doc: IToDos) => {
        save(doc);
    };

    return (
        <PageLayout
            key={'ExemplePageLayoutDetailKEY'}
            title={
                screenState === 'view'
                    ? 'Visualizar Tarefa'
                    : screenState === 'edit'
                        ? 'Editar Tarefa'
                        : 'Criar Tarefa'
            }
            onBack={() => navigate('/toDos')}
        >

            <SimpleForm
                key={'ToDosDetail-SimpleFormKEY'}
                mode={screenState}
                schema={toDosApi.getSchema()}
                doc={toDosDoc}
                onSubmit={handleSubmit}
                loading={loading}
            >

                <FormGroup key={'fieldsOne'}>
                    <TextField key={'f1-nomeTarefaKEY'} placeholder="Título Tarefa"
                        name={'title'} />
                    <TextField
                        key={'f1descricaoTarefaKEY'}
                        placeholder="Descrição Tarefa"
                        name={'description'}
                    />
                </FormGroup>

                <FormGroup>
                    <FormControlLabel control={
                        <Switch />}
                        key={'isPersonal-Switch'}
                        label={'Tarefa Pessoal'}
                        name={'isPersonal'} />
                </FormGroup>

                {
                    isMobile && (screenState === 'view') && (
                        <div style={{ color: '#808080' }}>
                            <br />
                            Usuário de Criação:
                            <br /> {taskUser.username}
                        </div>
                    )
                }

                <div
                    key={'Buttons'}
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'left',
                        paddingTop: 20,
                        paddingBottom: 20,
                    }}
                >
                    {!isPrintView ? (
                        <Button
                            key={'b1'}
                            style={{ marginRight: 10 }}
                            onClick={
                                screenState === 'edit'
                                    ? () => navigate(`/toDos/list`)
                                    : () => navigate(`/toDos/list`)
                            }
                            color={'secondary'}
                            variant="contained"
                        >
                            {screenState === 'view' ? 'Voltar' : 'Cancelar'}
                        </Button>
                    ) : null}

                    {!isPrintView && screenState !== 'view' ? (
                        <Button
                            key={'b3'}
                            color={'primary'}
                            variant="contained"
                            {...{ submit: true }}
                        >
                            {'Salvar'}
                        </Button>
                    ) : null}
                </div>
            </SimpleForm>
        </PageLayout>
    );
};

interface IToDosDetailContainer extends IDefaultContainerProps { }

export const ToDosDetailContainer = withTracker((props: IToDosDetailContainer) => {
    const { screenState, id, navigate, showNotification } = props;

    const subHandle = !!id ? toDosApi.subscribe('toDosDetail', { _id: id }) : null;
    let toDosDoc = id && subHandle?.ready() ? toDosApi.findOne({ _id: id }) : {};

    return {
        screenState,
        toDosDoc,
        save: (doc: IToDos, _callback: () => void) => {
            const selectedAction = screenState === 'create' ? 'insert' : 'update';
            if (screenState === 'create') {
                doc.situation = 'cadastrada';
            }
            toDosApi[selectedAction](doc, (e: IMeteorError, r: string) => {
                if (!e) {
                    navigate(`/toDos/view/${screenState === 'create' ? r : doc._id}`);
                    showNotification &&
                        showNotification({
                            type: 'success',
                            title: 'Operação realizada!',
                            description: `A tarefa foi ${doc._id ? 'atualizada' : 'cadastrada'
                                } com sucesso!`,
                        });
                    navigate(`/toDos/`);
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
    };
})(showLoading(ToDosDetail));
