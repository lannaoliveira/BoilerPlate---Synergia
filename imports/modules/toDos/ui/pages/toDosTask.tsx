import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility'
import Box from '@mui/material/Box';
import { Button, Checkbox, ListItem, Menu } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import React from 'react';
import AccessTime from '@material-ui/icons/AccessTime';
import { toDosStyle } from './style/toDosListStyle';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

export const Task = ({ task, userTask, onDeleteClick, onEditTarefa, callView, alterSituation, isMobile }) => {

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <Box>
            {(!isMobile) && (
                <>
                    {task.isPersonal && (
                        userTask._id === task.createdby && (
                            <div>
                                <ListItem sx={toDosStyle.lista}>
                                    <Box sx={toDosStyle.boxTask}>
                                        <Box sx={toDosStyle.boxBotoes}>
                                            {task.situation === 'concluida' && (
                                                <Button sx={toDosStyle.buttonBegin} aria-label={'voltar tarefa para cadastrada'} onClick={() => { alterSituation(task, 'reiniciar') }}>
                                                    Reiniciar
                                                </Button>
                                            )}
                                            {task.situation === 'cadastrada' && (
                                                <Box>
                                                    <Button sx={toDosStyle.buttonBegin} aria-label={'colocar tarefa em andamento'} onClick={() => { alterSituation(task, 'iniciar') }}>
                                                        Iniciar
                                                    </Button>
                                                    <Button sx={toDosStyle.buttonCheck} aria-label={'concluir tarefa'} onClick={() => { alterSituation(task, 'concluir') }}>
                                                        Concluir
                                                    </Button>
                                                </Box>
                                            )}
                                            {task.situation === 'andamento' && (
                                                <Box>
                                                    <Button sx={toDosStyle.buttonBegin} aria-label={'voltar tarefa para cadastrada'} onClick={() => { alterSituation(task, 'reiniciar') }}>
                                                        Reiniciar
                                                    </Button>
                                                    <Button sx={toDosStyle.buttonCheck} aria-label={'concluir tarefa'} onClick={() => { alterSituation(task, 'concluir') }}>
                                                        Concluir
                                                    </Button>
                                                </Box>
                                            )}
                                        </Box>
                                        <Box>
                                            {task.situation === 'cadastrada' && (
                                                <AccessTime style={{ color: '#ff0000' }} />)}
                                            {task.situation === 'andamento' && (
                                                <AccessTime style={{ color: '#ffff00' }} />)}
                                            {task.situation === 'concluida' && (
                                                <CheckCircleOutlineIcon style={{ color: '#32cd32' }} />)}
                                        </Box>
                                        <Box sx={toDosStyle.titulo}>{task.title}</Box>
                                    </Box>
                                    <Box sx={toDosStyle.boxTask}>
                                        <Box sx={toDosStyle.usuario}>Criado por: {task.nomeUsuario}</Box>
                                        <Box sx={toDosStyle.boxBotoesEdicao}>
                                            <IconButton onClick={() => { callView(task) }}><VisibilityIcon aria-label={'botao visualizar tarefa'} /></IconButton>
                                            <IconButton
                                                aria-controls={open ? 'opcoes' : undefined}
                                                aria-haspopup="true"
                                                aria-expanded={open ? 'true' : undefined}
                                                onClick={handleClick}
                                            >
                                                <MoreVertIcon aria-label={'botao ver mais opcoes'} />
                                            </IconButton>
                                            <Menu
                                                sx={{ display: 'inline-block' }}
                                                aria-labelledby="opcoes"
                                                anchorEl={anchorEl}
                                                open={open}
                                                onClose={handleClose}
                                                anchorOrigin={{
                                                    vertical: 'top',
                                                    horizontal: 'left',
                                                }}
                                                transformOrigin={{
                                                    vertical: 'top',
                                                    horizontal: 'left',
                                                }}>
                                                <IconButton aria-label={'botao deletar tarefa'} onClick={() => { onDeleteClick(task) }}><DeleteIcon /></IconButton>
                                                <IconButton aria-label={'botao editar tarefa'} onClick={() => { onEditTarefa(task) }}><EditIcon /></IconButton>
                                            </Menu>
                                        </Box>
                                    </Box>
                                </ListItem>
                            </div>
                        )
                    )}

                    {!task.isPersonal && (
                        <div>
                            <ListItem sx={toDosStyle.lista}>
                                <Box sx={toDosStyle.boxTask}>
                                    <Box sx={toDosStyle.boxBotoes}>
                                        {task.situation === 'concluida' && (
                                            <Button sx={toDosStyle.buttonBegin} onClick={() => { alterSituation(task, 'reiniciar') }}>
                                                Reiniciar
                                            </Button>
                                        )}
                                        {task.situation === 'cadastrada' && (
                                            <Box>
                                                <Button sx={toDosStyle.buttonBegin} onClick={() => { alterSituation(task, 'iniciar') }}>
                                                    Iniciar
                                                </Button>
                                                <Button sx={toDosStyle.buttonCheck} onClick={() => { alterSituation(task, 'concluir') }}>
                                                    Concluir
                                                </Button>
                                            </Box>
                                        )}
                                        {task.situation === 'andamento' && (
                                            <Box>
                                                <Button sx={toDosStyle.buttonBegin} onClick={() => { alterSituation(task, 'reiniciar') }}>
                                                    Reiniciar
                                                </Button>
                                                <Button sx={toDosStyle.buttonCheck} onClick={() => { alterSituation(task, 'concluir') }}>
                                                    Concluir
                                                </Button>
                                            </Box>
                                        )}
                                    </Box>
                                    <Box>
                                        {task.situation === 'cadastrada' && (
                                            <AccessTime style={{ color: '#ff0000' }} />)}
                                        {task.situation === 'andamento' && (
                                            <AccessTime style={{ color: '#ffff00' }} />)}
                                        {task.situation === 'concluida' && (
                                            <CheckCircleOutlineIcon style={{ color: '#32cd32' }} />)}
                                    </Box>
                                    <Box sx={toDosStyle.titulo}>{task.title}</Box>
                                </Box>
                                <Box sx={toDosStyle.boxTask}>
                                    <Box sx={toDosStyle.usuario}>Criado por: {task.nomeUsuario}</Box>
                                    <Box sx={toDosStyle.boxBotoesEdicao}>
                                        <IconButton onClick={() => { callView(task) }}><VisibilityIcon aria-label={'botao visualizar tarefa'} /></IconButton>
                                        <IconButton
                                            aria-controls={open ? 'opcoes' : undefined}
                                            aria-haspopup="true"
                                            aria-expanded={open ? 'true' : undefined}
                                            onClick={handleClick}
                                        >
                                            <MoreVertIcon aria-label={'botao ver mais opcoes'} />
                                        </IconButton>
                                        <Menu
                                            sx={{ display: 'inline-block' }}
                                            aria-labelledby="opcoes"
                                            anchorEl={anchorEl}
                                            open={open}
                                            onClose={handleClose}
                                            anchorOrigin={{
                                                vertical: 'top',
                                                horizontal: 'left',
                                            }}
                                            transformOrigin={{
                                                vertical: 'top',
                                                horizontal: 'left',
                                            }}>
                                            <IconButton onClick={() => { onDeleteClick(task) }}><DeleteIcon aria-label={'botao deletar tarefa'} /></IconButton>
                                            <IconButton onClick={() => { onEditTarefa(task) }}><EditIcon aria-label={'botao editar tarefa'} /></IconButton>
                                        </Menu>
                                    </Box>
                                </Box>
                            </ListItem>
                        </div>
                    )}
                </>
            )}

            {(isMobile) && (
                <>
                    {task.isPersonal && (
                        userTask._id === task.createdby && (
                            <div>
                                <ListItem sx={toDosStyle.lista}>
                                    <Box sx={toDosStyle.boxTasksMobile}>
                                        <Box sx={toDosStyle.boxTask}>
                                            <Box sx={toDosStyle.boxBotoes}>
                                                {task.situation === 'concluida' && (
                                                    <Button sx={toDosStyle.buttonBeginMobile} aria-label={'voltar tarefa para cadastrada'} onClick={() => { alterSituation(task, 'reiniciar') }}>
                                                        Reiniciar
                                                    </Button>
                                                )}
                                                {task.situation === 'cadastrada' && (
                                                    <Box>
                                                        <Button sx={toDosStyle.buttonBeginMobile} aria-label={'colocar tarefa em andamento'} onClick={() => { alterSituation(task, 'iniciar') }}>
                                                            Iniciar
                                                        </Button>
                                                        <Button sx={toDosStyle.buttonCheckMobile} aria-label={'concluir tarefa'} onClick={() => { alterSituation(task, 'concluir') }}>
                                                            Concluir
                                                        </Button>
                                                    </Box>
                                                )}
                                                {task.situation === 'andamento' && (
                                                    <Box>
                                                        <Button sx={toDosStyle.buttonBeginMobile} aria-label={'voltar tarefa para cadastrada'} onClick={() => { alterSituation(task, 'reiniciar') }}>
                                                            Reiniciar
                                                        </Button>
                                                        <Button sx={toDosStyle.buttonCheckMobile} aria-label={'concluir tarefa'} onClick={() => { alterSituation(task, 'concluir') }}>
                                                            Concluir
                                                        </Button>
                                                    </Box>
                                                )}
                                            </Box>
                                            <Box>
                                                {task.situation === 'cadastrada' && (
                                                    <AccessTime style={{ color: '#ff0000' }} />)}
                                                {task.situation === 'andamento' && (
                                                    <AccessTime style={{ color: '#ffff00' }} />)}
                                                {task.situation === 'concluida' && (
                                                    <CheckCircleOutlineIcon style={{ color: '#32cd32' }} />)}
                                            </Box>
                                        </Box>
                                        <Box sx={toDosStyle.titulo}>{task.title}</Box>
                                    </Box>
                                    <Box>
                                        <Box sx={toDosStyle.boxBotoesEdicaoMobile}>
                                            <IconButton onClick={() => { callView(task) }}><VisibilityIcon aria-label={'botao visualizar tarefa'} /></IconButton>
                                            <IconButton
                                                aria-controls={open ? 'opcoes' : undefined}
                                                aria-haspopup="true"
                                                aria-expanded={open ? 'true' : undefined}
                                                onClick={handleClick}
                                            >
                                                <MoreVertIcon aria-label={'botao ver mais opcoes'} />
                                            </IconButton>
                                            <Menu
                                                sx={{ display: 'inline-block' }}
                                                aria-labelledby="opcoes"
                                                anchorEl={anchorEl}
                                                open={open}
                                                onClose={handleClose}
                                                anchorOrigin={{
                                                    vertical: 'top',
                                                    horizontal: 'left',
                                                }}
                                                transformOrigin={{
                                                    vertical: 'top',
                                                    horizontal: 'left',
                                                }}>
                                                <IconButton aria-label={'botao deletar tarefa'} onClick={() => { onDeleteClick(task) }}><DeleteIcon /></IconButton>
                                                <IconButton aria-label={'botao editar tarefa'} onClick={() => { onEditTarefa(task) }}><EditIcon /></IconButton>
                                            </Menu>
                                        </Box>
                                    </Box>
                                </ListItem>
                            </div>
                        )
                    )}

                    {!task.isPersonal && (
                        <div>
                            <ListItem sx={toDosStyle.lista}>
                                <Box sx={toDosStyle.boxTasksMobile}>
                                    <Box sx={toDosStyle.boxTask}>
                                        <Box sx={toDosStyle.boxBotoes}>
                                            {task.situation === 'concluida' && (
                                                <Button sx={toDosStyle.buttonBeginMobile} aria-label={'voltar tarefa para cadastrada'} onClick={() => { alterSituation(task, 'reiniciar') }}>
                                                    Reiniciar
                                                </Button>
                                            )}
                                            {task.situation === 'cadastrada' && (
                                                <Box>
                                                    <Button sx={toDosStyle.buttonBeginMobile} aria-label={'colocar tarefa em andamento'} onClick={() => { alterSituation(task, 'iniciar') }}>
                                                        Iniciar
                                                    </Button>
                                                    <Button sx={toDosStyle.buttonCheckMobile} aria-label={'concluir tarefa'} onClick={() => { alterSituation(task, 'concluir') }}>
                                                        Concluir
                                                    </Button>
                                                </Box>
                                            )}
                                            {task.situation === 'andamento' && (
                                                <Box>
                                                    <Button sx={toDosStyle.buttonBeginMobile} aria-label={'voltar tarefa para cadastrada'} onClick={() => { alterSituation(task, 'reiniciar') }}>
                                                        Reiniciar
                                                    </Button>
                                                    <Button sx={toDosStyle.buttonCheckMobile} aria-label={'concluir tarefa'} onClick={() => { alterSituation(task, 'concluir') }}>
                                                        Concluir
                                                    </Button>
                                                </Box>
                                            )}
                                        </Box>
                                        <Box>
                                            {task.situation === 'cadastrada' && (
                                                <AccessTime style={{ color: '#ff0000' }} />)}
                                            {task.situation === 'andamento' && (
                                                <AccessTime style={{ color: '#ffff00' }} />)}
                                            {task.situation === 'concluida' && (
                                                <CheckCircleOutlineIcon style={{ color: '#32cd32' }} />)}
                                        </Box>
                                    </Box>
                                    <Box sx={toDosStyle.titulo}>{task.title}</Box>
                                </Box>
                                <Box>
                                    <Box sx={toDosStyle.boxBotoesEdicaoMobile}>
                                        <IconButton onClick={() => { callView(task) }}><VisibilityIcon aria-label={'botao visualizar tarefa'} /></IconButton>
                                        <IconButton
                                            aria-controls={open ? 'opcoes' : undefined}
                                            aria-haspopup="true"
                                            aria-expanded={open ? 'true' : undefined}
                                            onClick={handleClick}
                                        >
                                            <MoreVertIcon aria-label={'botao ver mais opcoes'} />
                                        </IconButton>
                                        <Menu
                                            sx={{ display: 'inline-block' }}
                                            aria-labelledby="opcoes"
                                            anchorEl={anchorEl}
                                            open={open}
                                            onClose={handleClose}
                                            anchorOrigin={{
                                                vertical: 'top',
                                                horizontal: 'left',
                                            }}
                                            transformOrigin={{
                                                vertical: 'top',
                                                horizontal: 'left',
                                            }}>
                                            <IconButton aria-label={'botao deletar tarefa'} onClick={() => { onDeleteClick(task) }}><DeleteIcon /></IconButton>
                                            <IconButton aria-label={'botao editar tarefa'} onClick={() => { onEditTarefa(task) }}><EditIcon /></IconButton>
                                        </Menu>
                                    </Box>
                                </Box>
                            </ListItem>
                        </div>
                    )}
                </>
            )}
        </Box >
    );
};