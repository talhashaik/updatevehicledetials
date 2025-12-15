import { Component, OnInit } from '@angular/core';
import { SelectableSettings } from '@progress/kendo-angular-grid';
import { CommonService } from 'src/app/Services/common.service';
import { ColumnMode, SelectionType } from '@swimlane/ngx-datatable';
import { PageCriteria } from 'src/app/Models/pagecriteria';
import { Router } from '@angular/router';
import { AssetsInformationService } from 'src/app/Services/Common/assets-information.service';
import { ExcelExportData } from '@progress/kendo-angular-excel-export';

import { GroupDescriptor, process } from '@progress/kendo-data-query';

@Component({
  selector: 'app-sale-assets-view',
  templateUrl: './sale-assets-view.component.html',
  styles: []
})


export class SaleAssetsViewComponent implements OnInit {
  public group: GroupDescriptor[] = [];
  public today: Date = new Date();
  public selectableSettings: SelectableSettings;
  ColumnMode = ColumnMode;
  SelectionType = SelectionType;
  pageCriteria: PageCriteria;
  loginUserBranchName: any;
  LoginUserid: any;
  assetsInformations:any = [];
  assetsInformationDetails:any = [];
  ViewAssetsInvoiceData:any = [];
  invoiceListData:any = [];
  public groups: GroupDescriptor[] = [{ field: 'ptransactiondate' }];

  constructor( private _commonService:CommonService,private router: Router, private assetsInformationService: AssetsInformationService ) {
        this.allData = this.allData.bind(this);
  }

  ngOnInit(): void {
    debugger;
    this.loginUserBranchName = sessionStorage.getItem("loginUserBranchName");
    this.LoginUserid = sessionStorage.getItem("LoginUserid");        
    this.ViewAssetssale();
  }

    public allData(): ExcelExportData {
    const result: ExcelExportData = {
      data: process(this.ViewAssetsInvoiceData, {

      }).data,
    };

    return result;
  }

  ViewAssetssale(){
    debugger;
    this.assetsInformationService.ViewAssetssale().subscribe(res => {
      this.ViewAssetsInvoiceData = res;
    })
  }

  add(){
    debugger;
    //this.router.navigate(['/LegalNotice']);     
    this.router.navigate(['/Saleofassets']);     
  }

  setPageModel() {
    this.pageCriteria.pageSize = this._commonService.pageSize;
    this.pageCriteria.offset = 0;
    this.pageCriteria.pageNumber = 1;
    // this.pageCriteria.footerPageHeight = 50;
  }

  onFooterPageChange(event): void {
    this.pageCriteria.offset = event.page - 1;
    this.pageCriteria.CurrentPage = event.page;
    if (this.pageCriteria.totalrows < event.page * this.pageCriteria.pageSize) {
      this.pageCriteria.currentPageRows = this.pageCriteria.totalrows % this.pageCriteria.pageSize;
    }
    else {
      this.pageCriteria.currentPageRows = this.pageCriteria.pageSize;
    }
    



      
  }
 
  





  

 

 

  



 












}
