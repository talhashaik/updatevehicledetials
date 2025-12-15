import { Component, OnInit } from '@angular/core';
import { AssetsInformationService } from 'src/app/Services/Common/assets-information.service';
import { ExcelExportData } from '@progress/kendo-angular-excel-export';
import { GroupDescriptor, process } from '@progress/kendo-data-query';
import { Router } from '@angular/router';
@Component({
  selector: 'app-laptop-details-report',
  templateUrl: './laptop-details-report.component.html',
  styles: []
})
export class LaptopDetailsReportComponent implements OnInit {
 public group: GroupDescriptor[] = [];
  LaptopdataList: any = [];
   public headerCells: any = {
    textAlign: 'center'
  };
  

  constructor(private assetService: AssetsInformationService,private router: Router) {
        this.allData = this.allData.bind(this);
  }

  ngOnInit(): void {
    this.loadGrid();
  }

  loadGrid() {
    this.assetService.getLaptopinfo().subscribe(res => {
      this.LaptopdataList = res;
    });
  }


    // public allData(): ExcelExportData {
    
    //   return {
    //     data: process(this.LaptopdataList, {
    //       group: this.group,
    //       sort: [{ field: 'laptop_brand', dir: 'asc' }]
          
    //     }).data,
    //     group: this.group
    //   };
    // }

     public allData(): ExcelExportData {
    const result: ExcelExportData = {
      data: process(this.LaptopdataList, {

      }).data,
    };

    return result;
  }

  add(){
  debugger;
  //this.router.navigate(['/LegalNotice']);     
  this.router.navigate(['/LaptopDetails']);     
}

}
