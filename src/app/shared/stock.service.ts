
import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { retry, catchError, map } from 'rxjs/operators';
import { Stock, StockValue } from './stock.model';

// API path
const BASE_URL = 'http://localhost:3000';

@Injectable({
  providedIn: 'root',
})
export class StockService {
  constructor(private http: HttpClient) {}

  // Http Options
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  // Handle API errors
  handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(
        `Backend returned code ${error.status}, ` + `body was: ${error.error}`
      );
      console.log(error.error);
    }
    return throwError('Something bad happened; please try again later.');
  }

  // Get single Stock data by ID
  getItem(id: number) {
    return this.http.get(`${BASE_URL}/stock-values`)
    .pipe(
      map((data) => {

        var selectedStockId;
        
        return selectedStockId = (data as any[]).filter(res=> {
        
          if(res.stock_id === id)
          return res;

        });

    
      }),
      catchError(this.handleError)
    );
  }

  searchItem(value: string): Observable<Stock> {
    return this.http
      .get<Stock>(`${BASE_URL}/stock?q=${value}`)
      .pipe(catchError(this.handleError));
  }

  private stocks$: BehaviorSubject<any> = new BehaviorSubject({});

  public getStocks() {
    return this.stocks$.asObservable();
  }

  public updateStock(data: {}) {
    return this.stocks$.next(data);
  }
  // Get Stock data
  getList(): Observable<Stock> {
    return this.http
      .get<Stock>(`${BASE_URL}/stock`)
      .pipe(retry(2), catchError(this.handleError));
  }
}