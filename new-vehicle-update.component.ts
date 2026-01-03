import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommonService } from 'src/app/Services/common.service';
import { AssetsInformationService } from 'src/app/Services/Common/assets-information.service';

@Component({
  selector: 'app-new-vehicle-update',
  templateUrl: './new-vehicle-update.component.html',
  styles: []
})
export class NewVehicleUpdateComponent implements OnInit {
  vehicleNoList:any=[];
  // PurchasedCompanyList:any=[];
  //   PurchasedCompanyList = [
  //   { id: 1, name: 'Kapilit' },
  //   { id: 2, name: 'Tata' },
  //   { id: 3, name: 'Mahindra' }
  // ];

vehicleListstatic = [
  { label: 'Sold Out', value: 'sold out' },
  { label: 'Not Working', value: 'not working' },
  { label: 'Office Use', value: 'office use' }
   
];

//   kapilChitsCompanies: string[] = [
 
//   'kapil chits - kapil',
//    'kapil chits - hyd',
//   'kapil chits - kakatiya',
//   'kapil chits - kosta',
//   'kapil chits - telangana'
// ];

kapilChitsCompanies: string[] = [
  'kapil chits - kapil',
  'kapil chits - hyd',
  'kapil chits - kakatiya',
  'kapil chits - kosta',
  'kapil chits - telangana'
];

    PurchasedCompanyList :any= [];
  vehicleTypeList:any=[];
  vehicleMakeList:any=[];
  vehicleVarientList:any=[];
  companiesList:any=[];
  branchesList:any=[];
  employeesList:any=[];
  // showvehicleVarient:boolean=false;
  // showvehicleMake:boolean=false;
  // showvehicleType:boolean=false;
vehicleform:FormGroup
  cmp: any;
  branch: any;
  Vehicletypes: any=[];
  LoginUserid: string;
  constructor(private fb:FormBuilder,private assetservic:AssetsInformationService,private commonservice:CommonService) { }

  ngOnInit(): void {
this.LoginUserid = sessionStorage.getItem("LoginUserid");
 this.vehicleform=this.fb.group({
      
PVehicleNo:[''],
purchasedCompany:[''],
pVehicleType:[''],
vehiclemake:[''],
vehiclevariant:[''],
//vehicleUsedBy:[''],
vchcompanyname:[''],
branchname:[''],
pemployeename:[''],
ptypeofoperation: "CREATE",
created_by: this.commonservice.removeCommasForEntredNumber(this.LoginUserid),
vehiclesnwof:[null]

    });

 this.vehicleform.get('vehiclesnwof')?.valueChanges.subscribe(value => {
    debugger

if (value && ['sold out','not working','office use'].includes(value)) {
  this.vehicleform.get('pemployeename')?.disable();
}
else{
  this.vehicleform.get('pemployeename')?.enable();
}
});




    this.getInvoice()
    this.getvehicletype()
    // this.getvehiclemake()
    // this.getvehiclevarient()
  //  this.onCompanyChange()
  this.ComoanyNames()
  this.getpuchasedcompany()
 // this.vehicleListstatic

  
  }



// disableVehicleFields1(){
  
// }
// enableVehicleFields1(){

// }
  disableVehicleFields() {
    debugger
  this.vehicleform.get('pVehicleType')?.disable();
  this.vehicleform.get('purchasedCompany')?.disable();
//   this.vehicleform.get('vehiclemake')?.disable();
//   this.vehicleform.get('vehiclevariant')?.disable();
 
//  this.vehicleform.get('vchcompanyname')?.disable();
//   this.vehicleform.get('branchname')?.disable();
//   this.vehicleform.get('pemployeename')?.disable();

}

enableVehicleFields() {
  this.vehicleform.get('pVehicleType')?.enable();
  this.vehicleform.get('vehiclemake')?.enable();
  this.vehicleform.get('vehiclevariant')?.enable();
   this.vehicleform.get('purchasedCompany')?.enable();
 this.vehicleform.get('vchcompanyname')?.enable();
  this.vehicleform.get('branchname')?.enable();
  this.vehicleform.get('pemployeename')?.enable();
}

   getInvoice() {
    debugger
    this.assetservic.getInnvoiceno().subscribe(
      res => {

        console.log('API Response:', res)
        this.vehicleNoList = res
        
      }
    )
  }

  
  selectvehicleno(event) {
    debugger;
   let vehicle= event.pinvoiceno
    this.assetservic.getinvoicedetails(vehicle).subscribe(res=>{
      this.Vehicletypes=res;
  this.vehicleform.controls['pVehicleType'].setValue(this.Vehicletypes[0].pVehicleType);
  this.vehicleform.controls['vehiclemake'].setValue(this.Vehicletypes[0].vehiclemake);
  this.vehicleform.controls['purchasedCompany'].setValue(this.Vehicletypes[0].purchasedCompany);
  this.vehicleform.controls['vehiclevariant'].setValue(this.Vehicletypes[0].vehiclevariant);



  this.vehicleform.get('purchasedCompany')?.valueChanges.subscribe(value => {
    
  console.log('Selected Purchased Company:', value);
  if (value && this.kapilChitsCompanies.some(company => company.toLowerCase() === value.toLowerCase())) {
    console.log('Disabling fields for Kapil Chits company');
    this.disableVehicleFields();
  } else {
    console.log('Enabling fields for other companies');
    this.enableVehicleFields();
  }
});


 this.selectvehicleType()

    // 🔥 CHECK AFTER SETTING VALUE
    // if (this.Vehicletypes[0].purchasedCompany?.toLowerCase() === 'kapil chits - hyd') {
    //   this.disableVehicleFields();
    // } else {
    //   this.enableVehicleFields();
    // }
    })
  }
  getpuchasedcompany(){
    debugger
    this.assetservic.purchasedcompany().subscribe(
      res=>{
        this.PurchasedCompanyList=res;
      })
  }
     getvehicletype() {
      debugger
    this.assetservic.getvehicletype().subscribe(
      res => {
        console.log('API Response:', res)
        this.vehicleTypeList = res
      }
    )
  }
  // selectvehicleType(event){
  selectvehicleType(){
    debugger
    this.vehicleform.controls.vehiclemake.setValue('')
    //this.vehicleform.controls.pVehicleType.get
     let x=this.vehicleform.get('pVehicleType').value;
    
    //let vehicleType=event.pVehicleType.trim()
    //console.log('fsdfsdf:',vehicleType);
    
     this.assetservic.getvehiclemake(x).subscribe( res => {
        console.log('API Response:', res)
        this.vehicleMakeList = res

      }
    )
  }
  //    getvehiclemake() {
  //     debugger
  //   this.assetservic.getvehiclemake().subscribe(
  //     res => {
  //       console.log('API Response:', res)
  //       this.vehicleMakeList = res
  //     }
  //   )
  // }

  selectvehicleMake(event){
     debugger
      this.vehicleform.controls.vehiclevariant.setValue('')
    this.assetservic.getvehiclevarinet(event.vehiclemake).subscribe(
      res => {
        console.log('API Response:', res)
        this.vehicleVarientList = res
      }
    )
  }
  //    getvehiclevarient() {
  //   debugger
  //   this.assetservic.getvehiclevarinet().subscribe(
  //     res => {
  //       console.log('API Response:', res)
  //       this.vehicleVarientList = res
  //     }
  //   )
  // }
 ComoanyNames() {
      debugger
    this.assetservic.getcompanyvehicle().subscribe(
      res => {
        console.log('API Response:', res)
        this.companiesList = res
      }
    )
  }
    onCompanyChange(event) {
      debugger
            this.vehicleform.controls.branchname.setValue('')

      this.cmp=event.vchcompanyname;
       this.assetservic.getbranchnames(this.cmp).subscribe(
      res => {
        console.log('API Response:', res)
        this.branchesList = res
      }
    )
  }
 
    onBranchChange(event){
    debugger;
                this.vehicleform.controls.pemployeename.setValue('')

    this.branch=event.branchname;
    this.assetservic.getemployeeDetails(this.branch).subscribe(
        res => {
        console.log('API Response:', res)
        this.employeesList = res;
        this.employeesList=res[0].empList;
        
      }
    )
    
 }
     saveData() {
    debugger;

    const form = this.vehicleform.value;
//     let form1={
//  pinvoice_number: this.assetinfromationformgroup.controls.pinvoice_number.value,
//       passet_name: this.assetinfromationformgroup.controls.passet_name.value,

// PVehicleNo:this.vehicleform,contr

//       PVehicleNo:[''],
// purchasedCompany:[''],
// pVehicleType:[''],
// vehiclemake:[''],
// vehiclevariant:[''],
// //vehicleUsedBy:[''],
// vchcompanyname:[''],
// branchname:[''],
// pemployeename:[''],
// ptypeofoperation: "CREATE",
// created_by: this.commonservice.removeCommasForEntredNumber(this.LoginUserid),
// vehiclesnwof:['']

//     }

    // Format date if needed
    //form.ppurchaseddate = this.datepipe.transform(form.ppurchaseddate, 'yyyy-MM-dd');

    console.log("Sending to API:", form);

    this.assetservic.saveupdatevehiclenew(form).subscribe(response => {
      console.log("API Response:", response);
      this.commonservice.showInfoMessage('Saved successfully');
      this.vehicleform.reset();
      // this.assetForm.reset();
      // this.assetForm.get('laptop_brand')?.reset();
      // // this.assetForm.controls['laptop_brand'].setValue(' Select Brand');
      // this.assetForm.get('serial_no')?.reset();
      // this.assetForm.get('custodyat')?.reset();
      // this.assetForm.get('designation')?.reset();
      // this.showGrid = false;
    });
  }
    
 
 


  // isKapilit(): boolean {
  //   debugger
  //   return this.vehicleform.get('PurchasedCompany')?.value === 'Kapilit';
    
  // }
  // selectvehicleType(event){
  //   debugger
  // }
  // selectvehicleMake(event){
  //   debugger
  // }
  //   selectvehicleVarient(event){
  //   debugger
  // }
  

// onEmployeeChange(event){
//   debugger
//   this.vehicleform.get('pemployeename')
// }
}
// import { Component, OnInit } from '@angular/core';
// import { FormBuilder, FormGroup } from '@angular/forms';
// import { AssetsInformationService } from 'src/app/Services/Common/assets-information.service';

// @Component({
//   selector: 'app-new-vehicle-update',
//   templateUrl: './new-vehicle-update.component.html',
// })
// export class NewVehicleUpdateComponent implements OnInit {

//   vehicleform!: FormGroup;
//   vehicleNoList:any=[];

  
//   // vehicleNoList = [
//   //   { pinvoiceno: 'TN01AB1234' },
//   //   { pinvoiceno: 'KA02CD5678' }
//   // ];

 
//   PurchasedCompanyList = [
//     { id: 1, name: 'Kapilit' },
//     { id: 2, name: 'Tata' },
//     { id: 3, name: 'Mahindra' }
//   ];

 
// vehicleTypeList = [
//   { vehicleType: '2 Wheeler' },
//   { vehicleType: '4 Wheeler' }
// ];


 
//  allVehicleMakeList = [
//   // 2 Wheeler
//   { vehicleType: '2 Wheeler', vehiclemake: 'Honda' },
//   { vehicleType: '2 Wheeler', vehiclemake: 'Yamaha' },
//   { vehicleType: '2 Wheeler', vehiclemake: 'TVS' },

//   // 4 Wheeler
//   { vehicleType: '4 Wheeler', vehiclemake: 'Hyundai' },
//   { vehicleType: '4 Wheeler', vehiclemake: 'Tata' },
//   { vehicleType: '4 Wheeler', vehiclemake: 'Mahindra' }
// ];

// vehicleMakeList: any[] = [];

 


// allVehicleVarientList = [
//   // Honda
//   { vehiclemake: 'Honda', vehiclevarient: 'Shine' },
//   { vehiclemake: 'Honda', vehiclevarient: 'Activa' },

//   // Yamaha
//   { vehiclemake: 'Yamaha', vehiclevarient: 'R15' },
//   { vehiclemake: 'Yamaha', vehiclevarient: 'FZ' },

//   // TVS
//   { vehiclemake: 'TVS', vehiclevarient: 'Apache' },

//   // Hyundai
//   { vehiclemake: 'Hyundai', vehiclevarient: 'i20' },
//   { vehiclemake: 'Hyundai', vehiclevarient: 'Creta' },

//   // Tata
//   { vehiclemake: 'Tata', vehiclevarient: 'Nexon' },

//   // Mahindra
//   { vehiclemake: 'Mahindra', vehiclevarient: 'XUV300' }
// ];

// vehicleVarientList: any[] = [];



 
//   companiesList = [
//     { vchcompanyname: 'ABC Pvt Ltd' },
//     { vchcompanyname: 'XYZ Pvt Ltd' }
//   ];

//   allBranchesList = [
//     { company: 'ABC Pvt Ltd', branchname: 'Chennai' },
//     { company: 'ABC Pvt Ltd', branchname: 'Bangalore' },
//     { company: 'XYZ Pvt Ltd', branchname: 'Hyderabad' }
//   ];
//   branchesList: any[] = [];

//   allEmployeesList = [
//     { branch: 'Chennai', pemployeename: 'Ravi' },
//     { branch: 'Chennai', pemployeename: 'Kumar' },
//     { branch: 'Bangalore', pemployeename: 'Arjun' },
//     { branch: 'Hyderabad', pemployeename: 'Suresh' }
//   ];
//   employeesList: any[] = [];

//   constructor(private fb: FormBuilder,private assetservic:AssetsInformationService) {}

//   ngOnInit(): void {
//     this.vehicleform = this.fb.group({
//       PVehicleNo: [null],
//       PurchasedCompany: [null],
//       vehicleType: [null],
//       vehiclemake: [null],
//       vehiclevarient: [null],
//       vehicleUsedBy: [''],
//       vchcompanyname: [null],
//       branchname: [null],
//       pemployeename: [null]
//     });
//   }

//   // ===== KAPILIT CHECK =====
//   isKapilit(): boolean {
//     return this.vehicleform.get('PurchasedCompany')?.value === 'Kapilit';
//   }



  
//   getInvoice() {

//     this.assetservic.getInnvoiceno().subscribe(
//       res => {

//         console.log('API Response:', res)
//         this.vehicleNoList = res
        
//       }
//     )
//   }
//   // ===== VEHICLE TYPE → MAKE =====
//   selectvehicleType(type: any) {
//     this.vehicleMakeList = this.allVehicleMakeList
//       .filter(x => x.vehicleType === type.vehicleType);

//     this.vehicleform.patchValue({
//       vehiclemake: null,
//       vehiclevarient: null
//     });
//     this.vehicleVarientList = [];
//   }

//   // ===== VEHICLE MAKE → VARIANT =====
//   selectvehicleMake(make: any) {
//     this.vehicleVarientList = this.allVehicleVarientList
//       .filter(x => x.vehiclemake === make.vehiclemake);

//     this.vehicleform.patchValue({ vehiclevarient: null });
//   }

//   // ===== COMPANY → BRANCH =====
//   onCompanyChange(company: any) {
//     this.branchesList = this.allBranchesList
//       .filter(x => x.company === company.vchcompanyname);

//     this.vehicleform.patchValue({
//       branchname: null,
//       pemployeename: null
//     });
//     this.employeesList = [];
//   }

//   // ===== BRANCH → EMPLOYEE =====
//   onBranchChange(branch: any) {
//     this.employeesList = this.allEmployeesList
//       .filter(x => x.branch === branch.branchname);

//     this.vehicleform.patchValue({ pemployeename: null });
//   }

//   onEmployeeChange(emp: any) {
//     console.log('Selected Employee:', emp);
//   }
// }

