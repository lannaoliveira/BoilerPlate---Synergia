import Box from '@mui/material/Box';
import { ListItem } from '@mui/material';
import React from 'react';
import AccessTime from '@material-ui/icons/AccessTime';
import { toDosStyle } from './style/toDosListStyle';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'

export const TaskIndex = ({ task }) => {
    return (
        <ListItem sx={toDosStyle.listaIndex}>
            <Box sx={{
                display: 'flex',
                alignItems: 'center',
            }}>
                <Box>
                    {task.situation === 'cadastrada' && (
                        <AccessTime style={{ color: '#ff0000' }} />)}
                    {task.situation === 'andamento' && (
                        <AccessTime style={{ color: '#ffff00' }} />)}
                    {task.situation === 'concluida' && (
                        <CheckCircleOutlineIcon style={{ color: '#32cd32' }} />)}
                </Box>
                <Box sx={toDosStyle.tituloIndex}>{task.title}</Box>
            </Box>
            <Box sx={toDosStyle.usuario}>Criado por: <br /> {task.nomeUsuario}</Box>
        </ListItem >
    )
};