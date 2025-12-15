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
  selector: 'app-asset-transfer-view',
  templateUrl: './asset-transfer-view.component.html',
  styles: []
})
export class AssetTransferViewComponent implements OnInit {  
  public today: Date = new Date();
   public group: GroupDescriptor[] = [];
  public selectableSettings: SelectableSettings;
  ColumnMode = ColumnMode;
  SelectionType = SelectionType;
  pageCriteria: PageCriteria;
  loginUserBranchName: any;
  LoginUserid: any;
  list: any[];
  ViewAssetTransferData:any = [];
  public groups: GroupDescriptor[] = [{ field: 'ptransactiondate' }];

  constructor( private _commonService:CommonService,private router: Router, private assetsInformationService: AssetsInformationService
    ) {
        this.allData = this.allData.bind(this);
  }

  ngOnInit(): void {
    debugger;
    this.loginUserBranchName = sessionStorage.getItem("loginUserBranchName");
    this.LoginUserid = sessionStorage.getItem("LoginUserid");        
    this.viewAssetsTransfer();
  }

   viewAssetsTransfer(){
    debugger;
    this.assetsInformationService.viewAssetsTransfer().subscribe(res => {
      this.ViewAssetTransferData = res;
      console.log('view data:',this.ViewAssetTransferData);
      
    })
  }



getAssetCodes(list: any[]): string {
  if (!list || !Array.isArray(list)) return '';
  return list.map(x => x.passetcode).join(', ');
}


 
  add(){
    debugger;
    //this.router.navigate(['/LegalNotice']);     
    this.router.navigate(['/AssetTransfer']);     
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

   public allData(): ExcelExportData {
    const result: ExcelExportData = {
      data: process(this.ViewAssetTransferData, {

      }).data,
    };

    return result;
  }
}
