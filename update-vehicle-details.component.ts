import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { DatePipe } from '@angular/common';
import { SelectableSettings } from '@progress/kendo-angular-grid';
import { CommonService } from 'src/app/Services/common.service';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { ColumnMode, SelectionType } from '@swimlane/ngx-datatable';
import { PageCriteria } from 'src/app/Models/pagecriteria';
import { Router } from '@angular/router';
import { AssetsInformationService } from 'src/app/Services/Common/assets-information.service';
declare const $: any;
@Component({
  selector: 'app-update-vehicle-details',
  templateUrl: './update-vehicle-details.component.html',
  styles: []
})
export class UpdateVehicleDetailsComponent implements OnInit {
  loginAllBranchNamesForAdmin: any;
 
  buttonName: any = 'Add';
  invoicelistData: any = [];
  invoicelistCalculation: any = 0;
  invoicelistCalculation1: any = 0;
  warrantyShow: boolean = false;
  amcShow: boolean = false;
  public transactionsData: any = [];
  insuranceShow: boolean = false;
  grandTotalBGri: any = 0;
  grandTotalBGri1: any = 0;
  cgstPercentage: number = 0;
  sgstPercentage: number = 0;
  igstPercentage: number = 0;
  Cesspercentage: number = 0;
  tcsPercentage: number = 0;
  vehicleList: any = [];
  mvdateList: any = [];
  public today: Date = new Date();
  public dpConfig1: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  public dpConfig2: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  public dpConfig3: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  public dpConfig4: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  public dpConfig5: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  public dpConfig6: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  assetinfromationformgroup: FormGroup;
  fuleTypeData: any = [];
  vehicleUploadDocsResponse: any;
  vehicleUploadResponse: any;
  filename: string = '';//hold the file name which we are selecting
  vehicaldata: any;
  updateddatainvoice: any = [];
  // dropdownSettings:IDropdownSettings={};
  selectedItems: any = [];
  EmployeeList: any = []

  selectedassetcode: any = [];

  dropdownSettings = {
    idField: 'precordid',
    textField: 'pinvoiceno',
    allowSearchFilter: true,
    selectAllText: 'Select All',
    unSelectAllText: 'Unselect All',
    // positionElements:'top'
     addToGrid() {
    throw new Error('Method not implemented.');
  }

  };
  calc: any;
  percentCalculationAmount: any;

  today1: any;
  today2: any;
  loginUserBranchName: string;
  LoginUserid: string;
  // Full list of employees
  // EmployeeList = [
  //   { id: 1, name: 'Ravi' },
  //   { id: 2, name: 'Priya' },
  //   { id: 3, name: 'Arun' }
  // ];

  constructor(private fb: FormBuilder, private service: AssetsInformationService, private datepipe: DatePipe, private commonservice: CommonService) {


    this.dpConfig4.containerClass = 'theme-dark-blue';
    this.dpConfig4.dateInputFormat = 'DD-MM-YYYY';
    this.dpConfig4.maxDate = this.today;
    this.dpConfig4.showWeekNumbers = false;



    this.dpConfig6.containerClass = 'theme-dark-blue';
    this.dpConfig6.dateInputFormat = 'DD-MM-YYYY';
    this.dpConfig6.maxDate = this.today;
    this.dpConfig6.showWeekNumbers = false;
  }

  ngOnInit(): void {
    this.today1 = this.datepipe.transform(new Date(), 'dd-MM-yyyy')
    this.today2 = this.datepipe.transform(new Date(), 'dd-MM-yyyy')
    this.assetinfromationformgroup = this.fb.group({
      // vehicleno: [''],
      vehicleno: [''],

      // dateOfMV: [''],
      ptransaction_date: [''],
      pinvoice_date: [''],
      pinvoice_number: [''],
      pvendor_name: [''],

      pcustodyat: [''],
      passet_name: [''],
      passet_brand: [''],
      pquantity: [0],
      prate: [0],
      pfreight: [0],
      pinstallationcost: [0],

      pcgst_percentage: [0],
      psgst_percentage: [0],
      pigst_percentage: [0],
      pcess_percentage: [0],
      ptcs_percentage: [0],
      pvehiclercno: [],
      pvehicleregno: [],
      pchassisno: [],
      pengineno: [],
      pmodelno: [],

      pfueltype: [''],
      pvehicleassignedto: [''],
      pdepartment: [''],
      ploaction: [''],
      pvehicle_type: [''],
      ptypeofoperation: ['UPDATE'],
    createdby: [''],
    pmodifiedby: [''],


      // pmodifiedby: [new Date()],
     // pmodifiedby: [this.commonservice.pCreatedby],
      pnarration: [''],
      Insurance: [''],
      Amc: [''],
      Warranty: [''],
      // pImagepath: ['', Validators.required],
      // pcreatedby: 101,
      // pcreateddate: [new Date()],
      pcreateddate: [this.today1],
      
      pmodifieddate: [this.today2],
      //ptypeofoperation: ['CREATE'],
      pinsuranceFrom: [null],
      pinsuranceTo: [null],
      pamcEndDate: [null],
      pwarrantyFrom: [null],
      pwarrantyTo:[null],
      branchname: [''],
    
     pbranchname:[''],
     pparticulars:[''],
     ptcsvalue:[0],
       psgstvalue: [0],
     pcesstvalue:[0],
     pigstvalue:[0],
     pcgstvalue:[0],
    // createdby:[0]
    


    })
    this.getInvoice();



    this.assetinfromationformgroup.valueChanges.subscribe(() => {
      this.grandTotal();
    });

    // this.getFuelTypesData();

    // this.getdatemv()
    this.loginUserBranchName = sessionStorage.getItem("loginUserBranchName");
    this.LoginUserid = sessionStorage.getItem("LoginUserid");
  }

  // getFuelTypesData() {
  //   this.fuleTypeData = [
  //     { "id": 1, "fuelType": "PETROL" },
  //     { "id": 2, "fuelType": "DIESEL" },
  //     { "id": 3, "fuelType": "EV" }
  //   ]
  // }
  // vechilenumber(event: any) {
  //   debugger;


  // const selectedVehicleNo = event.vehicleno;//vechileno  event.vehicleno
  // const selectedvechile = this.vehicleList.find(v => v.vehicleno === selectedVehicleNo)
  // if (selectedvechile) {
  //   const mvdate = this.mvdateList.find(mv => mv.id === selectedvechile.id)?.dateOfMV;//based on id vechile number getting
  //   if (mvdate)//both id matches form control
  //   {
  //     this.assetinfromationformgroup.patchValue({
  //       dateOfMV: mvdate
  //     });
  //   }
  // }
  // }


  getInvoice() {

    this.service.getInnvoiceno().subscribe(
      res => {

        console.log('API Response:', res)
        this.vehicleList = res
        this.EmployeeList = res
      }
    )
  }



  selectvehicleno(event) {
    debugger;
    event.pinvoiceno
    this.service.getinvoicedetails(event.pinvoiceno).subscribe(

      data => {
        // let mvdate1=this.datepipe.transform(data[0].ptransaction_date,'dd-MM-yyyy')
        // let invoicedate=this.datepipe.transform(data[0].pinvoice_date,'dd-MM-yyyy')
        console.log('values for vehicle no:', data)
        //   this.assetinfromationformgroup.controls.ptransaction_date.setValue(this.datepipe.transform(data[0].ptransaction_date,'dd-MM-yyyy'))
        // this.assetinfromationformgroup.controls.pinvoice_date.setValue(this.datepipe.transform(data[0].pinvoice_date,'dd-MM-yyyy'))
        this.assetinfromationformgroup.controls.pvehicle_type.setValue(data[0].pvehicle_type)
        // this.assetinfromationformgroup.controls.pinvoice_date.setValue(data[0].pinvoice_date)
        this.assetinfromationformgroup.controls.pinvoice_date.setValue(data[0].pinvoice_date,'dd-MM-yyyy')
        this.assetinfromationformgroup.controls.ptransaction_date.setValue(data[0].ptransaction_date)

        this.assetinfromationformgroup.controls.pcustodyat.setValue(data[0].pcustodyat)

        this.assetinfromationformgroup.controls.pinvoice_number.setValue(data[0].pinvoice_number)

        this.assetinfromationformgroup.controls.pvehicleregno.setValue(data[0].pvehicleregno)
        this.assetinfromationformgroup.controls.pvehiclercno.setValue(data[0].pvehiclercno)

        this.assetinfromationformgroup.controls.pvendor_name.setValue(data[0].pvendor_name)
        this.assetinfromationformgroup.controls.passet_name.setValue(data[0].passet_name)
        this.assetinfromationformgroup.controls.passet_brand.setValue(data[0].passet_brand)
        this.assetinfromationformgroup.controls.pquantity.setValue(this.commonservice.currencyFormat(data[0].pquantity))
        this.assetinfromationformgroup.controls.prate.setValue(this.commonservice.currencyFormat(data[0].prate))
        this.assetinfromationformgroup.controls.pinstallationcost.setValue(this.commonservice.currencyFormat(data[0].pinstallationcost))
        this.assetinfromationformgroup.controls.pfreight.setValue(this.commonservice.currencyFormat(data[0].pfreight))
        this.assetinfromationformgroup.controls.pcgst_percentage.setValue(data[0].pcgst_percentage)
        this.assetinfromationformgroup.controls.psgst_percentage.setValue(data[0].psgst_percentage)
        this.assetinfromationformgroup.controls.pigst_percentage.setValue(data[0].pigst_percentage)
        this.assetinfromationformgroup.controls.pcess_percentage.setValue(data[0].pcess_percentage)
        this.assetinfromationformgroup.controls.ptcs_percentage.setValue(data[0].ptcs_percentage)
        this.assetinfromationformgroup.controls.pfueltype.setValue(data[0].pfueltype)
        this.assetinfromationformgroup.controls.pdepartment.setValue(data[0].pdepartment)
        this.assetinfromationformgroup.controls.ploaction.setValue(data[0].ploaction)
        this.assetinfromationformgroup.controls.pmodelno.setValue(data[0].pmodelno)
        this.assetinfromationformgroup.controls.pvehicleassignedto.setValue(data[0].pvehicleassignedto)
        this.assetinfromationformgroup.controls.pengineno.setValue(data[0].pengineno)
        this.assetinfromationformgroup.controls.pchassisno.setValue(data[0].pchassisno)
        this.assetinfromationformgroup.controls.pbranchname.setValue(data[0].pbranchname)
        this.assetinfromationformgroup.controls.pnarration.setValue(data[0].pnarration)

 this.assetinfromationformgroup.controls.pinsuranceFrom.setValue(data[0].pinsurancefrom)
        this.assetinfromationformgroup.controls.pinsuranceTo.setValue(data[0].pinsuranceto)
        this.assetinfromationformgroup.controls.pamcEndDate.setValue(data[0].pamcenddate)
        this.assetinfromationformgroup.controls.pwarrantyFrom.setValue(data[0].pwarrantyfrom)
        this.assetinfromationformgroup.controls.pwarrantyTo.setValue(data[0].pwarrantyto)

        this.assetinfromationformgroup.controls.pmodifiedby.setValue(this.commonservice.removeCommasForEntredNumber(this.LoginUserid));


      }
    )
  }





  // vechilenumber(event: any) {
  //     const selectedVehicleNo = event.vehicleno; // vehicle number selected from dropdown
  //     console.log('Selected Vehicle No:', selectedVehicleNo); // Debug: Check the selected vehicle number

  //     const selectedVehicle = this.vehicleList.find(v => v.vehicleno === selectedVehicleNo); 
  //     if (selectedVehicle) {
  //         console.log('Selected Vehicle:', selectedVehicle); // Debug: Log the selected vehicle details

  //         const mvdate = this.mvdateList.find(mv => mv.id === selectedVehicle.id)?.dateOfMV;
  //         if (mvdate) {
  //             console.log('Found MV Date:', mvdate); // Debug: Check if mvdate is found
  //             this.assetinfromationformgroup.patchValue({
  //                 dateOfMV: mvdate
  //             });
  //         } else {
  //             console.log('MV Date not found for selected vehicle.');
  //         }
  //     } else {
  //         console.log('Selected vehicle not found.');
  //     }
  // }





  onsave() {
  debugger;

  console.log('pmodifiedby value from form:', this.assetinfromationformgroup.controls.pmodifiedby.value);
  console.log('commonservice.pCreatedby:', this.commonservice.pCreatedby);
  // Get branch info
  const branchName = JSON.parse(sessionStorage.getItem("loginAllBranchNamesForAdmin"));

  // Parse numeric values
  const quantity = +this.assetinfromationformgroup.controls.pquantity.value;
  const rate = this.commonservice.removeCommasForEntredNumber(this.assetinfromationformgroup.controls.prate.value);
  const installationCost = this.commonservice.removeCommasForEntredNumber(this.assetinfromationformgroup.controls.pinstallationcost.value);
  const freight = this.commonservice.removeCommasForEntredNumber(this.assetinfromationformgroup.controls.pfreight.value);

  const cgst = +this.assetinfromationformgroup.controls.pcgst_percentage.value;
  const sgst = +this.assetinfromationformgroup.controls.psgst_percentage.value;
  const igst = +this.assetinfromationformgroup.controls.pigst_percentage.value;
  const cess = +this.assetinfromationformgroup.controls.pcess_percentage.value;
  const tcs = +this.assetinfromationformgroup.controls.ptcs_percentage.value;
//  const modifiedBy = this.assetinfromationformgroup.controls.pmodifiedby.value;
const modifiedBy = this.commonservice.pCreatedby;

  // Build invoicelist as array
  const invoicelist = [
    {
      ptypeofoperation: 'update',
      pinvoice_number: this.assetinfromationformgroup.controls.pinvoice_number.value,
      passet_name: this.assetinfromationformgroup.controls.passet_name.value,
      passet_brand: this.assetinfromationformgroup.controls.passet_brand.value,
      pquantity: quantity,
      prate: rate,
      pcgst_percentage: cgst,
      psgst_percentage: sgst,
      pigst_percentage: igst,
      pcess_percentage: cess,
      ptcs_percentage: tcs,
      pfreight: freight,
      pinstallationcost: installationCost,
      pchassisno: this.assetinfromationformgroup.controls.pchassisno.value,
      pengineno: this.assetinfromationformgroup.controls.pengineno.value,
      pfueltype: this.assetinfromationformgroup.controls.pfueltype.value,
      pvehicleregno: this.assetinfromationformgroup.controls.pvehicleregno.value,
      ploaction: this.assetinfromationformgroup.controls.ploaction.value,
      pdepartment: this.assetinfromationformgroup.controls.pdepartment.value,
      pvehiclercno: this.assetinfromationformgroup.controls.pvehiclercno.value,
      pvehicle_type: this.assetinfromationformgroup.controls.pvehicle_type.value,
      pcustodyat: this.assetinfromationformgroup.controls.pcustodyat.value,
      pmodelno: this.assetinfromationformgroup.controls.pmodelno.value,
      createddate: this.assetinfromationformgroup.controls.pcreateddate.value,
    //createdby: this.assetinfromationformgroup.controls.pcreatedby.value,
      // pmodifiedby: this.assetinfromationformgroup.controls.pmodifeidby.value,
       pmodifiedby: this.commonservice.removeCommasForEntredNumber(this.LoginUserid),
      pmodifieddate: this.assetinfromationformgroup.controls.pmodifieddate.value,
      pcgstvalue: (rate * quantity * cgst / 100),
      psgstvalue: (rate * quantity * sgst / 100),
      pigstvalue: (rate * quantity * igst / 100),
      pcesstvalue: (rate * quantity * cess / 100),
      ptcsvalue: (rate * quantity * tcs / 100)
    }
  ];

  // Build assetstransactions as array
  const assetstransactions = [
    {
      pinvoice_number: this.assetinfromationformgroup.controls.pinvoice_number.value,
      pnarration: this.assetinfromationformgroup.controls.pnarration.value,
      pparticulars: 'Vehicle Procurement',
     // ptransaction_amount: rate * quantity + freight + installationCost,
    //  pinvoiceamount: rate * quantity + freight + installationCost,
      pbranchname: branchName[0].pBranchname,
      //pbranchschema: 'HO_SCHEMA',
      createddate: this.assetinfromationformgroup.controls.pcreateddate.value,
     // createdby: this.assetinfromationformgroup.controls.pcreatedby.value,
      // pmodifiedby: this.assetinfromationformgroup.controls.pmodifeidby.value,
      pmodifieddate: this.assetinfromationformgroup.controls.pmodifieddate.value,
       pmodifiedby: this.commonservice.removeCommasForEntredNumber(this.LoginUserid),
      pcustodyat: this.assetinfromationformgroup.controls.pcustodyat.value,
     // ptransaction_date: this.assetinfromationformgroup.controls.ptransaction_date.value
    }
  ];

  // Build final payload
  const payload = {
    pinvoice_number: this.assetinfromationformgroup.controls.pinvoice_number.value,
    pcustodyat: this.assetinfromationformgroup.controls.pcustodyat.value,
    ptypeofoperation: 'update',
    pinvoice_date: this.assetinfromationformgroup.controls.pinvoice_date.value,
    pvendor_name: this.assetinfromationformgroup.controls.pvendor_name.value,
    pfreight: freight,
    pinstallationcost: installationCost,
    pinsurancefrom: this.assetinfromationformgroup.controls.pinsuranceFrom.value,
    pinsuranceto: this.assetinfromationformgroup.controls.pinsuranceTo.value,
    createddate: this.assetinfromationformgroup.controls.pcreateddate.value,
   // createdby: this.assetinfromationformgroup.controls.pcreatedby.value,
    // pmodifiedby: this.assetinfromationformgroup.controls.pmodifeidby.value,
    pmodifiedby: this.commonservice.removeCommasForEntredNumber(this.LoginUserid),
    pmodifieddate: this.assetinfromationformgroup.controls.pmodifieddate.value,
    pgrandtotal: rate * quantity + freight + installationCost + (rate*quantity*cgst/100) + (rate*quantity*sgst/100) + (rate*quantity*igst/100) + (rate*quantity*cess/100) + (rate*quantity*tcs/100),
    pwarrantyfrom: this.assetinfromationformgroup.controls.pwarrantyFrom.value,
    pwarrantyto: this.assetinfromationformgroup.controls.pwarrantyTo.value,
    pamc: this.assetinfromationformgroup.controls.Amc.value,
    pamcenddate: this.assetinfromationformgroup.controls.pamcEndDate.value,
    invoicelist: invoicelist,
    assetstransactions: assetstransactions
  };

  console.log('Sending payload:', payload);

  // Send to backend
  this.service.getInnvoicedetailsupdated(payload).subscribe({
    next: (data) => {
      console.log('Data updated successfully:', data);
      this.commonservice.showInfoMessage('Updated successfully');
      this.assetinfromationformgroup.reset();
      this.insuranceShow = false;
      this.amcShow = false;
      this.warrantyShow = false;
    },
    error: (err) => console.error('Update failed:', err)
  });
}




  totalCalculation() {
    debugger;
    let quantity = this.commonservice.removeCommasForEntredNumber(this.assetinfromationformgroup.controls.pquantity.value);
    let rate = this.commonservice.removeCommasForEntredNumber(this.assetinfromationformgroup.controls.prate.value);
    let Freight = this.commonservice.removeCommasForEntredNumber(this.assetinfromationformgroup.controls.pfreight.value);
    let InstallationCost = this.commonservice.removeCommasForEntredNumber(this.assetinfromationformgroup.controls.pinstallationcost.value);
    this.calc = (quantity * rate + Freight + InstallationCost).toFixed(2);
    this.percentCalculationAmount = (this.calc * 0.09).toFixed(2);

    // let date1 = new Date("01/16/2024");
    // let date2 = new Date("01/26/2024");
    // let Difference_In_Time =date2.getTime() - date1.getTime();
    // let Difference_In_Days =Math.round(Difference_In_Time / (1000 * 3600 * 24));

    // this.validatingGST();

    let pValue = 0.01;
    // let quantity = this._commonService.removeCommasForEntredNumber(this.assetInformationGridForm.controls.quantity.value);
    // let rate = this._commonService.removeCommasForEntredNumber(this.assetInformationGridForm.controls.rate.value);
    // let Freight = this._commonService.removeCommasForEntredNumber(this.assetInformationGridForm.controls.Freight.value);
    // let InstallationCost = this._commonService.removeCommasForEntredNumber(this.assetInformationGridForm.controls.InstallationCost.value);
    let cgst = this.assetinfromationformgroup.controls.pcgst_percentage.value;
    let sgst = this.assetinfromationformgroup.controls.psgst_percentage.value;
    let igst = this.assetinfromationformgroup.controls.pigst_percentage.value;
    let cess = this.assetinfromationformgroup.controls.pcess_percentage.value;
    let tcs = this.assetinfromationformgroup.controls.ptcs_percentage.value;
    let totalCost = quantity * rate + InstallationCost + Freight;

    if (cgst != '') {
      let cgstcalc = cgst * pValue;
      this.cgstPercentage = +(totalCost * cgstcalc).toFixed(2);
      this.cgstPercentage = this.cgstPercentage;
      this.sgstPercentage = this.cgstPercentage;
    }



    if (igst != '') {
      let igstcalc = igst * pValue;
      this.igstPercentage = +(totalCost * igstcalc).toFixed(2);
    }

    if (cess != '') {
      let cesscalc = cess * pValue;
      this.Cesspercentage = +(totalCost * cesscalc).toFixed(2);
    }

    if (tcs != '') {
      let tcscalc = tcs * pValue;
      this.tcsPercentage = +(totalCost * tcscalc).toFixed(2);
    }
    let abc = quantity * rate;



    this.assetinfromationformgroup.controls.psgst_percentage.setValue(this.assetinfromationformgroup.controls.pcgst_percentage.value);

    if (this.assetinfromationformgroup.controls.pcgst_percentage.value != this.assetinfromationformgroup.controls.psgst_percentage.value) {
      this.commonservice.showWarningMessage('CGST And SGST Percentage Should Be Same');

      return;
    }

    if (this.assetinfromationformgroup.controls.pcgst_percentage.value != 0 && this.assetinfromationformgroup.controls.pcgst_percentage.value != "" && this.assetinfromationformgroup.controls.psgst_percentage.value != 0 && this.assetinfromationformgroup.controls.psgst_percentage.value != "") {
      $("#igst").prop("disabled", true);
    }
    else {
      $("#igst").prop("disabled", false);

    }

    if (this.assetinfromationformgroup.controls.pigst_percentage.value != '' && this.assetinfromationformgroup.controls.pigst_percentage.value != '0') {
      $("#cgst").prop("disabled", true);
      $("#sgst").prop("disabled", true);
    }
    else {

      $("#cgst").prop("disabled", false);
      $("#sgst").prop("disabled", false);
      // this.assetInformationFormSave.controls.cgst.setValue(0);
      // this.assetInformationFormSave.controls.sgst.setValue(0);
    }

    if (this.assetinfromationformgroup.controls.pcgst_percentage.value == "") {
      this.assetinfromationformgroup.controls.pcgst_percentage.setValue(0);
    }

    if (this.assetinfromationformgroup.controls.psgst_percentage.value == "") {
      this.assetinfromationformgroup.controls.psgst_percentage.setValue(0);
    }

    if (this.assetinfromationformgroup.controls.pigst_percentage.value == "") {
      this.assetinfromationformgroup.controls.pigst_percentage.setValue(0);
    }
  }

  grandTotalBGrid1() {
    debugger;
    if (this.buttonName == 'Add') {
      let quantity = this.commonservice.removeCommasForEntredNumber(this.assetinfromationformgroup.controls.pquantity.value);
      let rate = this.commonservice.removeCommasForEntredNumber(this.assetinfromationformgroup.controls.prate.value);
      let Freight = this.commonservice.removeCommasForEntredNumber(this.assetinfromationformgroup.controls.pfreight.value);
      let InstallationCost = this.commonservice.removeCommasForEntredNumber(this.assetinfromationformgroup.controls.pinstallationcost.value);
      let cgst = this.assetinfromationformgroup.controls.pcgst_percentage.value;
      let sgst = this.assetinfromationformgroup.controls.psgst_percentage.value;
      let igst = this.assetinfromationformgroup.controls.pigst_percentage.value;
      let cess = this.assetinfromationformgroup.controls.pcess_percentage.value;
      let tcs = this.assetinfromationformgroup.controls.ptcs_percentage.value;
      let abc = quantity * rate
      this.grandTotalBGri = abc + Freight + InstallationCost + this.cgstPercentage + this.cgstPercentage + this.igstPercentage + this.Cesspercentage + this.tcsPercentage;

      //   if (this.addGridData.length != 0) {
      //     let pamount1 = this.addGridData.reduce((sum, item) => sum + Number(item.passetsamount), 0).toFixed(2);
      //     this.grandTotalBGri = Number(this.grandTotalBGri) + Number(pamount1);

      //   }
      //   this.grandTotalBGri = Math.round(this.grandTotalBGri);
      //   this.grandTotalBGri.toFixed(2);
      // else {
      //   if (this.addGridData.length != 0) {
      //     this.grandTotalBGri = this.addGridData.reduce((sum, item) => sum + Number(item.passetsamount), 0).toFixed(2);
      //   }
    }
  }
  // grandTotal() {
  //   debugger;
  //   let Freight = +this.assetinfromationformgroup.controls.pfreight.value;
  //   let InstallationCost = +this.assetinfromationformgroup.controls.pinstallationcost.value;



  //         this.invoicelistCalculation = this.invoicelistData.reduce((sum, item) =>
  //  sum + Number(item.pcgstvalue) + 
  // Number(item.psgstvalue) + Number(item.pigstvalue) 
  // + Number(item.pcesstvalue) + Number(item.ptcsvalue)
  //  + Number(item.pfreight) + Number(item.pinstallationcost)
  //  + Number(item.prate) * Number(item.pquantity), 0).toFixed(2);

  //   this.invoicelistCalculation1 = Math.round(Number(this.invoicelistCalculation));
  // }

  grandTotal() {

    let v = this.assetinfromationformgroup.value;

    const clean = (x: any) => Number(String(x).replace(/,/g, "")) || 0;

    let rate = clean(v.prate);
    let qty = clean(v.pquantity);
    let freight = clean(v.pfreight);
    let install = clean(v.pinstallationcost);

    // Percentages
    let cgst = clean(v.pcgst_percentage);
    let sgst = clean(v.psgst_percentage);
    let igst = clean(v.pigst_percentage);
    let cess = clean(v.pcess_percentage);
    let tcs = clean(v.ptcs_percentage);

    let basic = rate * qty;

    let cgstAmt = basic * cgst / 100;
    let sgstAmt = basic * sgst / 100;
    let igstAmt = basic * igst / 100;
    let cessAmt = basic * cess / 100;
    let tcsAmt = basic * tcs / 100;

    let total = basic + cgstAmt + sgstAmt + igstAmt + cessAmt + tcsAmt + freight + install;

    this.invoicelistCalculation1 = total;
  }





  checkInsurance(event: any) {
    debugger;
    if (event.target.checked == true) {
      this.insuranceShow = true

    }
    else {
      this.insuranceShow = false
    }
  }


  ChequeDateChangeFromDate(event) {
    debugger;
    this.transactionsData = [];


  }
  ChequeDateChangeToDate(event) {
    debugger;
    this.transactionsData = [];
  }


  checkAmc(event) {
    debugger;
    if (event.target.checked == true) {
      this.amcShow = true

    }
    else {
      this.amcShow = false
    }
  }


  warrantyInsurance(event) {
    debugger;
    if (event.target.checked == true) {
      this.warrantyShow = true

    }
    else {
      this.warrantyShow = false
    }
  }


}
