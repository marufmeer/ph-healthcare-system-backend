



import { IQueryConfig, IQueryParams, PrismaCountArgs, PrismaFindManyArgs, PrismaModelDelegate, PrismaStringFilter, PrismaWhereConditions } from "../interfaces/query.interface"
import pick from "./pick"


export class QueryBuilder<
T, 
TWhereInput = Record<string, unknown>,
TInclude = Record<string, unknown>
>{
 private model:PrismaModelDelegate
 private queryParams:IQueryParams
 private config:IQueryConfig
 private query:PrismaFindManyArgs
 private countQuery:PrismaCountArgs
  private selectFields: Record<string, boolean> | undefined;
    private page : number = 1;
    private limit : number = 10;
    private skip : number = 0;
    private sortBy : string = 'createdAt';
    private sortOrder : 'asc' | 'desc' = 'desc';
constructor(model:PrismaModelDelegate,queryParams:IQueryParams,config:IQueryConfig){
    this.model=model 
    this.queryParams=queryParams
    this.config=config
    this.query={
         where : {},
            include : {},
            orderBy : {},
            skip : 0,
            take : 10,
    }
    this.countQuery={
      where:{}
    }
}
search():this{
 const {searchableFields} =this.config
 const {searchTerm} =this.queryParams
if(searchTerm&&searchableFields&&searchableFields.length>0){
  const searchConditions:Record<string,unknown>[]=searchableFields.map((field)=>{
    if(field.includes(".")){
    const parts=field.split(".")
    if(parts.length===2){
        const [relation,nestedField]=parts
      const stringFilter:PrismaStringFilter={
        contains:searchTerm,
        mode:'insensitive'
      }
      return{
        [relation]:{
            [nestedField]:stringFilter
        }
      }
    }
      else  if(parts.length===3){
         const [relation,nestedRelation,nestedField]=parts
      const stringFilter:PrismaStringFilter={
        contains:searchTerm,
        mode:'insensitive'
      }
      return {
        [relation]:{
            some:{
                [nestedRelation]:{
                    [nestedField]:stringFilter
                }
            }
        }
      }
       }
    }

          const stringFilter:PrismaStringFilter={
        contains:searchTerm,
        mode:'insensitive'
      }
        return {
            [field]:stringFilter
        }
    
  })
  if(searchConditions&&searchConditions.length>0){
          const whereConditions = this.query.where as PrismaWhereConditions
      console.log(whereConditions)
        whereConditions.OR = searchConditions;
        const countWhereConditions = this.countQuery.where as PrismaWhereConditions;
        countWhereConditions.OR = searchConditions
 
  }
  }
  return this
}
filter(){
  const {filterableFields}=this.config as IQueryConfig
  console.log("query params",this.queryParams)
  const filterParams=pick(this.queryParams,filterableFields as string[])
  const queryWhere=this.query.where as Record<string,unknown>
  const countQueryWhere=this.query.where as Record<string,unknown>

  Object.keys(filterParams).forEach((key)=>{
 const value=filterParams[key]
 
 if(value===undefined || value===""){
   return ;
 }   
  if(key.includes(".")){
    const parts=key.split(".")
    if(parts.length===2){
      const [relation,nestedField]=parts
      if(!queryWhere[relation]){
       queryWhere[relation]={}
       countQueryWhere[relation]={}
      }
      const queryRelation = queryWhere[relation] as Record<string, unknown>;
                    const countRelation = countQueryWhere[relation] as Record<string, unknown>;

                    queryRelation[nestedField] = this.parseFilterValue(value);
                    countRelation[nestedField] = this.parseFilterValue(value);
                    return;
    }
    else if(parts.length===3){
         const [relation,nestedRelation,nestedField]=parts
      if(!queryWhere[relation]){
       queryWhere[relation]={
        some:{}
       }
       countQueryWhere[relation]={
        some:{}
       }
      }
      const queryRelation=queryWhere[relation]as Record<string, unknown>;
      const countQueryRelation=countQueryWhere[relation]as Record<string, unknown>;
      if(!queryRelation.some){
         queryRelation.some={}
      }
      if(!countQueryRelation.some){
         countQueryRelation.some={}
      }
 const querySome=queryRelation.some as Record<string, unknown>;
 const countSome=countQueryRelation.some as Record<string, unknown>;
     if(!querySome[nestedRelation]){
        querySome[nestedRelation]={} 
     }
     if(!countSome[nestedRelation]){
        countSome[nestedRelation]={} 
     }
     const nestedQueryRelation=querySome[nestedRelation] as Record<string, unknown>;
     const nestedCountRelation=countSome[nestedRelation] as Record<string, unknown>;
     nestedQueryRelation[nestedField]=this.parseFilterValue(value)
     nestedCountRelation[nestedField]=this.parseFilterValue(value)
 return;
    }
  }
  if(typeof value==='object'&&value!==null&&!Array.isArray(value)){
    queryWhere[key]=this.parseRangeFilterValue(value as Record<string,string|number>) 
 countQueryWhere[key]=this.parseRangeFilterValue(value as Record<string,string|number>)
 return;
  }
           queryWhere[key] = this.parseFilterValue(value);
            countQueryWhere[key] = this.parseFilterValue(value);

  })
  return this
}
private parseRangeFilterValue(value:Record<string,string|number>){
const rangeQuery:Record<string,string|number|(string | number)[]>={}
Object.keys(value).forEach((operator)=>{
const operatorValue=value[operator]
const toNumberIfNumeric=(v:string | number)=>{
return typeof v==="string"&&!isNaN(Number(v))?Number(v):v
}
  switch(operator){
           case 'lt':
                case 'lte':
                case 'gt':
                case 'gte':
                case 'equals':
                case 'not':
                case 'contains':
                case 'startsWith':
                case 'endsWith':
              rangeQuery[operator]=toNumberIfNumeric(operatorValue)
              break;
               case "in":
        case "notIn":
       if(Array.isArray(operatorValue)){
        rangeQuery[operator]=operatorValue.map(toNumberIfNumeric)
       }
       else{
        rangeQuery[operator]=[toNumberIfNumeric(operatorValue)]
       }
       break;
       default: 
       break;
  }
  
})
return Object.keys(rangeQuery).length>0?rangeQuery:value
}
private parseFilterValue(value:unknown):unknown{
if( value === 'true'){
   return true
}
  if(value === 'false'){
            return false;
    }
    if(typeof value==="string"&&!isNaN(Number(value))&&value!=""){
      return Number(value)
    }
    if(Array.isArray(value)){
      return {in:value.map((item)=>this.parseFilterValue(item))}
    }
    return value
}
paginate() : this {
        const page = Number(this.queryParams.page) || 1;
        const limit = Number(this.queryParams.limit) || 10;

        this.page = page;
        this.limit = limit;
        this.skip = (page - 1) * limit;

        this.query.skip = this.skip;
        this.query.take = this.limit;

        return this;
    }

    sort () : this {
        const sortBy = this.queryParams.sortBy || 'createdAt';
        const sortOrder = this.queryParams.sortOrder === 'asc' ? 'asc' : 'desc';

        this.sortBy = sortBy;
        this.sortOrder = sortOrder;


        if(sortBy.includes(".")){
            const parts = sortBy.split(".");

            if(parts.length === 2){
                const [relation, nestedField] = parts;

                this.query.orderBy = {
                    [relation] : {
                        [nestedField] : sortOrder
                    }
                }
            }else if(parts.length === 3){
                const [relation, nestedRelation, nestedField] = parts;

                this.query.orderBy = {
                    [relation] : {
                        [nestedRelation] : {
                            [nestedField] : sortOrder
                        }
                    }
                }
            }else{
                this.query.orderBy = {
                    [sortBy] : sortOrder
                }
            }
        }else{
            this.query.orderBy = {
                [sortBy]: sortOrder
            }
        }
        return this;
    }
include(relation:TInclude):this{
 if(this.selectFields){
  return this
 }
 this.query.include={ ...(this.query.include as Record<string, unknown>), ...(relation as Record<string, unknown>) }
 return this
}
dynamicInclude(includeConfig:Record<string,unknown>,defaultInclude?:string[]){
  const includeParam=this.queryParams.includes
 if(this.selectFields){
  return this
 }
 const result:Record<string,unknown>={}
 defaultInclude?.forEach((field)=>{
  if(includeConfig[field]){
     result[field]=includeConfig[field]
  }
 })
     if(includeParam&&typeof includeParam==="string"){
   const requestedRelations=includeParam.split(",")
   requestedRelations.forEach((relation)=>{
       if(includeConfig[relation]){
        result[relation]=includeConfig[relation]
       }
   })   
     }
     this.query.include={...(this.query.include as Record<string, unknown>), ...result };
     return this
}
 fields(){
  const fieldParams=this.queryParams.fields
   if(fieldParams&&typeof fieldParams==="string"){
    const fieldsArray=fieldParams.split(",")
    this.selectFields={}
     fieldsArray.forEach((field)=>{
      if(this.selectFields){
       this.selectFields[field]=true  
      }
     
     })
     this.query.select=this.selectFields as Record<string, boolean | Record<string, unknown>>
      delete this.query.include
   }
   return this
 }
 where(condition:TWhereInput){
 this.query.where=this.deepMerge(this.query.where as Record<string,unknown>,condition as Record<string,unknown>)
 this.countQuery.where=this.deepMerge(this.countQuery.where as Record<string,unknown>,condition as Record<string,unknown>)
 return this
 }
     async count() : Promise<number> {
        return await this.model.count(this.countQuery as Parameters<typeof this.model.count>[0]);
    }

    getQuery() : PrismaFindManyArgs {
        return this.query;
    }
   deepMerge(target:Record<string,unknown>,source:Record<string,unknown>){
 const result={...target}
 for(const key in source){
   if(source[key]&&typeof source[key]==="object"&&!Array.isArray(source[key])){
    if(result[key]&&typeof result[key]==="object"&&!Array.isArray(result[key])){
      result[key]=this.deepMerge(result[key] as Record<string,unknown>,source[key] as Record<string,unknown>)
    }
    else{
      result[key]=source[key]
    }
   }
   else{
    result[key]=source[key]
   }
 }
 return result
   }
async execute(){
  const [total,data]=await Promise.all([
    this.model.count(this.countQuery as Parameters<typeof this.model.count>[0]),
    this.model.findMany(this.query as Parameters<typeof this.model.findMany>[0])
  ])
  const totalPages=Math.ceil(total/this.limit)
  return{
    data,
    meta:{
      page:this.page ,
      limit:this.limit,
      total,
      totalPages
    }
  }
}
}