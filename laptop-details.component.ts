import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { ExcelExportData } from '@progress/kendo-angular-excel-export';
import { GroupDescriptor, process } from '@progress/kendo-data-query';
import { AssetsInformationService } from 'src/app/Services/Common/assets-information.service';
import { CommonService } from 'src/app/Services/common.service';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
@Component({
  selector: 'app-laptop-details',
  templateUrl: './laptop-details.component.html',
  styles: []
})
export class LaptopDetailsComponent implements OnInit {
  assetForm: FormGroup;
  showGrid: boolean = false;
  buttonText: string = "View";
  public group: GroupDescriptor[] = [];
  LaptopdataList: any = [];
  loginAllBranchNamesForAdmin: any;
  branch_name: any;
  companies: any = [];
  // companies = [
  //   { id: 1, name: 'Company A' },
  //   { id: 2, name: 'Company B' }
  // ];
  // branches = [];
  // employees = [];
  branches: any = [];
  employees: any = [];
  brands: any = [];
  // brands = [
  //   { name: 'hp' },
  //   { name: 'dell' },
  //   { name: 'lenova' },
  //   { name: 'apple' },
  //   { name: 'access' }
  // ];
  public dpConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  loginUserBranchName: string;
  LoginUserid: string;

  constructor(private fb: FormBuilder, private router: Router, private assestsservie: AssetsInformationService, private datepipe: DatePipe, private commonservice: CommonService) {
    this.dpConfig.dateInputFormat = 'DD-MM-YYYY';
    this.dpConfig.containerClass = 'theme-dark-blue';
  }
  ngOnInit(): void {
    debugger
    this.loginUserBranchName = sessionStorage.getItem("loginUserBranchName");
    this.LoginUserid = sessionStorage.getItem("LoginUserid");
    this.assetForm = this.fb.group({

      company_name: [''],
      branch_name: [''],
      custodyat: [null],
      designation: [''],
      // laptop_brand: [''],
      laptop_brand: [null],

      purchaseddate: [new Date()],
      serial_no: [''],
      ptypeofoperation: "CREATE",
      created_by: this.commonservice.removeCommasForEntredNumber(this.LoginUserid),
      //pcreateddate: [new Date()],



    });
    this.getbrands();
    this.getcompany();
  }



  getbrands() {
    debugger;
    this.assestsservie.getLaptopbrand().subscribe(res => {
      this.brands = res;
    });
  }
  getcompany() {

    debugger;
    const storedBranches = sessionStorage.getItem("loginUserBranchName");

    this.assestsservie.getcomapny(storedBranches).subscribe(res => {
      console.log('Companies response:', res);
      this.companies = res;
      this.assetForm.controls.company_name.setValue(storedBranches);
    });
    this.onCompanyChange(storedBranches);
  }





  onCompanyChange(company) {
    debugger;
    const storedBranches = sessionStorage.getItem("loginUserBranchName");
    this.assetForm.patchValue({ branch_name: storedBranches });  // auto fill textbox

    // Auto load employees as soon as branch is set (optional)
    this.onBranchChange(storedBranches);
  }

  onBranchChange(branch_name) {
    debugger;
    this.assestsservie.getemployeeDetails(branch_name).subscribe(res => {
      console.log("Employee API response:", res);
      this.employees = res[0].empList;
    });
  }
  // onBranchChange(pbranch) {

  //   debugger;
  //   this.assestsservie.getemployeeDetails(pbranch).subscribe(res => {
  //     this.employees = res;
  //   });

  // }

  // const branchId = branch?.id;
  // this.assetForm.patchValue({ pemployee: null });
  // this.employees = [
  //   { id: 201, name: 'John Doe', designation: 'Manager', branchId: branchId },
  //   { id: 202, name: 'Jane Smith', designation: 'Supervisor', branchId: branchId }
  // ];
  onEmployeeChange(event) {
    debugger;
    this.assetForm.controls.designation.setValue(event.pdesignation)


  }


  saveData() {
    debugger;

    const form = this.assetForm.value;

    // Format date if needed
    //form.ppurchaseddate = this.datepipe.transform(form.ppurchaseddate, 'yyyy-MM-dd');

    console.log("Sending to API:", form);

    this.assestsservie.saveLaptopinfo(form).subscribe(response => {
      console.log("API Response:", response);
      this.commonservice.showInfoMessage('Saved successfully');
      // this.assetForm.reset();
      this.assetForm.get('laptop_brand')?.reset();
      // this.assetForm.controls['laptop_brand'].setValue(' Select Brand');
      this.assetForm.get('serial_no')?.reset();
      this.assetForm.get('custodyat')?.reset();
      this.assetForm.get('designation')?.reset();
      this.showGrid = false;
    });
  }





  // view() {
  //   if (!this.showGrid) {
  //     // Load data only when showing grid
  //     this.assestsservie.getLaptopinfo().subscribe(res => {
  //       this.LaptopdataList = res;
  //       this.showGrid = true;
  //       this.buttonText = "Hide";
  //     });
  //   } else {
  //     // Hide grid
  //     this.showGrid = false;
  //     this.buttonText = "View";
  //   }
  // }
  view() {
    this.router.navigate(['/ViewLaptopDetails']);
  }


  public allData(): ExcelExportData {
    return {
      data: process(this.LaptopdataList, {
        group: this.group,
        sort: [{ field: 'laptop_brand', dir: 'asc' }]
      }).data,
      group: this.group
    };
  }
}
