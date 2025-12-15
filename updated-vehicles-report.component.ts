import { Component, OnInit, Testability } from '@angular/core';
import { ExcelExportData } from '@progress/kendo-angular-excel-export';
import { GroupDescriptor, process } from '@progress/kendo-data-query';
import { CommonService } from 'src/app/Services/common.service';
import { AssetsInformationService } from 'src/app/Services/Common/assets-information.service';
@Component({
  selector: 'app-updated-vehicles-report',
  templateUrl: './updated-vehicles-report.component.html',
  styles: []
})
export class UpdatedVehiclesReportComponent implements OnInit {
  ViewAssetsInvoiceData: any[] = [];
  branchList: any[] = [];
  selectedBranch: any;
isLoading:boolean=false
  public group: GroupDescriptor[] = [];
  loginAllBranchNamesForAdmin: any;
  loginUserBranchName: any = [];

  constructor(private asset_service: AssetsInformationService, private _commonService: CommonService) {
    this.allData = this.allData.bind(this);
  }

  ngOnInit(): void {
    let testArray = [{ pBranchId: 1, pbranchname: "ALL" }]
    this.asset_service.getinvoicedetailsReportsBranch().subscribe(res => {
      let list = res;
      this.branchList = [...testArray, ...list];
    });    

    this.getAllBranches();
  }



  // generate() {
  //   debugger;
  //   if (this.selectedBranch === "ALL" ) {
  //     // Load all data
  //     this.asset_service.getinvoicedetailsReports().subscribe(res => {
  //       this.ViewAssetsInvoiceData = res;
  //       console.log("Loaded ALL branches", res);
  //     });
  //   } 
  //   else {
  //     // Load selected branch data
  //     this.asset_service.getinvoicedetailsReports(this.selectedBranch).subscribe(res => {
  //       this.ViewAssetsInvoiceData = res;
  //       console.log("Loaded branch:", this.selectedBranch, res);
  //     });
  //   }
  // }




  onBranchSelect(event) {
    this.ViewAssetsInvoiceData = [];
    this.selectedBranch = event.pbranchname;  
  }



  generate() {
    debugger;
this.isLoading=true;
    // const branch = (this.selectedBranch || '').toUpperCase();

    // if (branch === "ALL") {
    //   // Load all data
    //   this.asset_service.getinvoicedetailsReports(branch).subscribe(res => {
    //     this.ViewAssetsInvoiceData = res;
    //     console.log("Loaded ALL branches", res);
    //   });
    // } 
    // else {
    // Load selected branch data
    this.asset_service.getinvoicedetailsReports(this.selectedBranch).subscribe(res => {
      this.ViewAssetsInvoiceData = res;
      this.isLoading=false
      console.log("Loaded branch:", res);
    });
    // }
  }

  //   onBranchSelect(event) {
  //   debugger;

  //   let selectBranch = event.pbranchname;

  //   // If All selected → load all data
  // //   if (this.selectedBranch === "ALL") {
  // //     this.asset_service.getinvoicedetailsReports().subscribe(res => {
  // //       this.ViewAssetsInvoiceData = res;
  // //     });

  // //   }
  // // else{
  //   this.asset_service.getinvoicedetailsReports(selectBranch).subscribe(res => {
  //     this.ViewAssetsInvoiceData = res;
  //     console.log('branch',this.ViewAssetsInvoiceData);

  //   });

  // }

  // Excel export data
  public allData(): ExcelExportData {
    return {
      data: process(this.ViewAssetsInvoiceData, {
        group: this.group,
        sort: [{ field: 'pvehicleregno', dir: 'asc' }]
      }).data,
      group: this.group
    };
  }

  // Row Grand Total calculation
  getRowGrandTotal(item: any) {
    const qty = Number(item.pquantity || 0);
    const rate = Number(item.prate || 0);
    const install = Number(item.pinstallationcost || 0);
    const cgst = Number(item.pcgst_percentage || 0);
    const sgst = Number(item.psgst_percentage || 0);
    const igst = Number(item.pigst_percentage || 0);
    const tcs = Number(item.ptcs_percentage || 0);
    const cess = Number(item.pcess_percentage || 0);

    const baseCost = rate + install;
    const cgstAmount = (cgst / 100) * baseCost;
    const sgstAmount = (sgst / 100) * baseCost;
    const igstAmount = (igst / 100) * baseCost;
    const tcsAmount = (tcs / 100) * baseCost;
    const cessAmount = (cess / 100) * baseCost;

    return qty * (baseCost + cgstAmount + sgstAmount + igstAmount + tcsAmount + cessAmount);
  }



  getAllBranches() {
    let stored = sessionStorage.getItem("loginAllBranchNamesForAdmin");
    this.loginAllBranchNamesForAdmin = stored ? JSON.parse(stored) : [];

    // Add All at top
    const allOption = [{ pBranchId: 0, pBranchname: "ALL" }];
    this.loginAllBranchNamesForAdmin = [...allOption, ...this.loginAllBranchNamesForAdmin];

    // Set default selection = All
    this.selectedBranch = "ALL";
  }



}
