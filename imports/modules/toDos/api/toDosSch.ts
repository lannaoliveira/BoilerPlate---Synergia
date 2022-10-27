import { string } from 'prop-types';
import { IDoc } from '/imports/typings/IDoc';

export const toDosSch = {
    title: {
        type: String,
        label: 'Título da Tarefa',
        defaultValue: '',
        optional: false,
    },
    description: {
        type: String,
        label: 'Descrição da Tarefa',
        defaultValue: '',
        optional: false,
    },
    isPersonal: {
        type: Boolean,
        label: "Tarefa Pessoal",
        optional: true,
    },
    situation: {
        type: String,
        label: "Situação",
        optional: true,
    },
};

export interface IToDos extends IDoc {
    title: string;
    description: string;
    isPersonal: boolean;
    situation: string;   
}
