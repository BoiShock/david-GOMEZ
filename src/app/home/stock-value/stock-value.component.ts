
import {
  Component,
  Input, OnChanges, OnInit, SimpleChanges, ViewChild
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Stock } from '../../shared/stock.model';
import exportFromJSON from 'export-from-json'

@Component({
  selector: 'app-stock-value',
  templateUrl: './stock-value.component.html',
  styleUrls: ['./stock-value.component.scss'],
})
export class StockValueComponent
  implements OnInit, OnChanges  {
  displayedColumns = ['stock', 'date', 'value'];

  @Input() stock!: any;

  pageSize = 5;
  pageSizeOptions: number[] = [5, 10, 20, 30, 50, 100, 300];
  dataSource: any = new MatTableDataSource<Stock>([]);
  showTable: boolean = false;


  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatTable) table!: MatTable<any>;

  stockValueTitle!: string;

  constructor() { }

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges) {

    if (JSON.stringify(changes.stock?.currentValue) !== '{}' && changes.stock?.currentValue !== undefined) {
      this.dataSource = new MatTableDataSource<Stock>(this.stock);
      this.stockValueTitle = this.stock[0]?.stock;

      this.paginator.initialized.subscribe(() => {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.showTable = true;
      });

    } else {
      this.showTable = false;
    }
  }

  exportJson(){

    const data = this.stock
    const fileName = 'stock'
    const exportType = 'json'

    exportFromJSON({ data, fileName, exportType })
  }
}