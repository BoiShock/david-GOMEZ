
export interface Stock{
    id:number;
    stock:string;
    industry:string;
    sector:string;
    currency_code:string;
}

export interface StockValue{
    stock_id:number;
    date:string;
    value:string
}