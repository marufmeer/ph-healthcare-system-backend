

export interface PrismaModelDelegate{
 findMany(args?:any):Promise<any[]>
 count(args:any):Promise<number>
}
export interface IQueryParams{
    searchTerm?:string
    page?:string 
    limit?:string
    fields?:string
    includes?:string
    sortBy?:string 
    sortOrder?:'asc'|'desc'
   [key:string]:string | undefined
}
export interface IQueryConfig{
  searchableFields?: string[];
    filterableFields?: string[];
}
export interface PrismaStringFilter{
contains:string 
mode: 'sensitive' | 'insensitive'
}
export interface PrismaFindManyArgs{
    where ?: Record<string, unknown>;
    include ?: Record<string, unknown>;
    select ?: Record<string, boolean | Record<string, unknown> >
    orderBy ?: Record<string, unknown> | Record<string, unknown>[];
    skip ?: number;
    take ?: number;
    cursor ?: Record<string, unknown>;
    distinct ?: string[] | string;
    [key: string] : unknown;
}
 export interface PrismaCountArgs {
    where?: Record<string, unknown>;
    include?: Record<string, unknown>;
    select?: Record<string, boolean | Record<string, unknown>>
    orderBy?: Record<string, unknown> | Record<string, unknown>[];
    skip?: number;
    take?: number;
    cursor?: Record<string, unknown>;
    distinct?: string[] | string;
    [key: string]: unknown;
}
export interface PrismaWhereConditions {
    OR ?: Record<string, unknown>[];
    AND ?: Record<string, unknown>[];
    NOT ?: Record<string, unknown>[];
    [key: string] : unknown;
}