export interface ISortProperties {
    field: string;
    sortAscending: boolean;
}

export interface IConfigList {
    sortProperties: ISortProperties;
    filter: { [key: string]: object | string };
    searchBy: string | null;
}
