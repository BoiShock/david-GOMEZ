
import {
  AfterViewInit,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

import { Stock } from '../shared/stock.model';

import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { StockService } from '../shared/stock.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, AfterViewInit {
  displayedColumns = ['stock', 'industry', 'sector', 'currency_code'];

  pageSize = 3;
  pageSizeOptions: number[] = [5, 10, 20, 30, 50, 100, 300];
  totalTicketsCount!: number;
  dataSource: any = new MatTableDataSource<Stock>();

  stock!: {};
  clickedRow = false;
  selectedindex!: string;
  oldValue!: string;
  stockArray: Array<any> = [];
  showTable: boolean = false;
  showNoresults:boolean =false;
  stockList$!: Observable<any>;
  private subjectKeyUp = new Subject<any>();
  size: number = 0;

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild(MatTable) table!: MatTable<any>;

  constructor(
    private stockService: StockService
  ) {}

  ngOnInit(): void {
    this.stockList$ = this.stockService.getStocks();

    this.subjectKeyUp
      .pipe(debounceTime(1000), distinctUntilChanged())
      .subscribe((d) => {
        this.getStock(d);
      });
  }

  ngAfterViewInit() {
    this.stockService.getList().subscribe(
      (val) => {
        this.size = Object.keys(val).length;

        this.dataSource.data = val as any;
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.stockService.updateStock(this.dataSource.data);
        this.showTable = true;
      },
      (error) => {
        console.log(error);
        this.showTable = false;
        return;
      }
    );

    this.dataSource.sort = this.sort;
  }

  onSearch($event: any) {
    const value = $event.target.value;
    this.subjectKeyUp.next(value);
  }

  getStock(value: string) {
    this.stockService.searchItem(value).subscribe(
      (res) => {
        this.size = Object.keys(res).length;

        if (this.size === 0) {
          this.stock = {};
          this.showNoresults = true;
        }
        else{
          this.showNoresults = false;
        }


        this.dataSource.data = res as any;
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;

        this.stockService.updateStock(this.dataSource.data);

        this.showTable = true;
      },
      (error) => {
        console.log(error);
        this.showTable = false;
        return;
      }
    );
  }

  getRowData(row: any, selectedIndex: string) {
    this.selectedindex = selectedIndex;

    if (this.stockArray.includes(row.id)) {
      this.oldValue = this.stockArray.shift();
      this.clickedRow = false;
    } else if (
      !this.stockArray.includes(row.id) &&
      this.stockArray.length == 0
    ) {
      this.stockArray.push(row.id);
      this.clickedRow = true;
    } else if (
      !this.stockArray.includes(row.id) &&
      this.stockArray.length > 0
    ) {
      this.stockArray.push(row.id);
      this.oldValue = this.stockArray.shift();
      this.clickedRow = true;
    }

    if (this.oldValue == row.id) {
      this.oldValue = '';
      this.stock = {};

      return;
    } else if (this.oldValue == row.id && JSON.stringify(this.stock) === '{}')
      this.getStockById(row.id, row.stock);
    else if (!this.oldValue && row.id) this.getStockById(row.id, row.stock);
    else this.getStockById(row.id, row.stock);
  }

  getStockById(Id: any, stock: any) {
    this.stockService.getItem(Id).subscribe(
      (res) => {
        console.log(res);
        this.stock = (res as any).map((obj: any) => {
          return Object.assign(obj, { stock: stock });
        });
      },
      (error) => {
        console.log(error);
      }
    );
  }
}