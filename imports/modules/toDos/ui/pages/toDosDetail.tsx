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
import { FormControlLabel, Switch } from '@mui/material';
import { Typography } from '@material-ui/core';
import { toDosStyle } from './style/toDosListStyle';
import { Box } from '@mui/system';

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
            onBack={
                screenState === 'view'
                    ? undefined
                    : () => navigate('/toDos')
            }
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
                    <TextField key={'f1-nomeTarefaKEY'} placeholder="T??tulo Tarefa"
                        name={'title'} />
                    <TextField
                        multiline
                        rows={3}
                        key={'f1descricaoTarefaKEY'}
                        placeholder="Descri????o Tarefa"
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
                            Usu??rio de Cria????o:
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
                        screenState != 'view' ? (
                            <Button
                                key={'b1'}
                                style={{ marginRight: 10 }}
                                onClick={() => navigate(`/toDos/list`)}
                                color={'secondary'}
                                variant="contained"
                            >
                                Cancelar
                            </Button>
                        ) : (
                            <Box sx={toDosStyle.modal}>
                                **Para sair do visualiza????o, clique na ??rea fora dela ou pressione a tecla ESC do seu teclado.
                            </Box>
                        )
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
        </PageLayout >
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
                            title: 'Opera????o realizada!',
                            description: `A tarefa foi ${doc._id ? 'atualizada' : 'cadastrada'
                                } com sucesso!`,
                        });
                    navigate(`/toDos/`);
                } else {
                    console.log('Error:', e);
                    showNotification &&
                        showNotification({
                            type: 'warning',
                            title: 'Opera????o n??o realizada!',
                            description: `Erro ao realizar a opera????o: ${e.reason}`,
                        });
                }
            });
        },
    };
})(showLoading(ToDosDetail));
