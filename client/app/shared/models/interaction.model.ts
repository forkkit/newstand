export class Interaction{
    _id?: string;
    user?: {
        username?:string;
        role?:string;
    };
    comment?: string;
    action?:{
        type?:string;
    }
    date?:string;
 }
