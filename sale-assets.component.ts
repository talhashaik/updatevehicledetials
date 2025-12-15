import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { AssetsInformationService } from 'src/app/Services/Common/assets-information.service';
import { CommonService } from 'src/app/Services/common.service';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';

declare const $: any;
@Component({
  selector: 'app-sale-assets',
  templateUrl: './sale-assets.component.html',
  styles: []
})
export class SaleAssetsComponent implements OnInit {
  selectedAssetCodeData: any = [];
  SaleofAssetsForm: FormGroup;
  today = new Date
  AssetCodedata: any = [];
  public dpConfig2: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  loginUserBranchName: string;
  LoginUserid: string;
  auctionminutevalidation: any = {};
  getNatureOfAssetsData: any = [];
  getSubClassificationOfAssetsData: any = [];
  getAssetsCodesData: any = [];
  pnatureof_asset: any;
  psubclassificationof_asset: any;
  pDateofSale: any;
  profitOrLossValue: any = '';
  profitOrLossValueForIncomeTax: any = '';
  patternname: string;
  cgstPercentage: number = 0;
  igstPercentage: number = 0;
  sgstPercentage: number = 0;
  psaleid: number = 0;
  psaledetailsid: number = 0;

  constructor(private fb: FormBuilder, private _commonService: CommonService, private AssetsInformationService: AssetsInformationService, private datePipe: DatePipe, private router: Router,) {
    this.dpConfig2.containerClass = 'theme-dark-blue';
    this.dpConfig2.dateInputFormat = 'DD-MM-YYYY';
    this.dpConfig2.maxDate = this.today;
    this.dpConfig2.showWeekNumbers = false;
  }
  ngOnInit(): void {
    this.loginUserBranchName = sessionStorage.getItem("loginUserBranchName");
    this.LoginUserid = sessionStorage.getItem("LoginUserid");

    this.SaleofAssetsForm = this.fb.group({
      psaleid:[0],
      pDateofSale: [this.today],
      pAssetCode: ['', Validators.required],
      pCostOfAsset: ['', Validators.required],
      pSoldTo: ['', Validators.required],
      pGSTIN: ['', Validators.required],
      pPAN: ['', Validators.required],
      pSaleValue: [0, Validators.required],
      pCGST: [0],
      pSGST: [0],
      pIGST: [0],
      pTotalSaleValue: ['', Validators.required],
      pDescriptionClaimedDate: [0, Validators.required],
      pwdvCarryingValue: [0, Validators.required],
      pProfitLoss: [0, Validators.required],
      pcreatedby: [Number(this.LoginUserid)],
      ptypeofoperation: ['CREATE'],
      pMainAssetCode: ['', Validators.required],
pbranchname:[''],
      natureofasset: ['', Validators.required],
      psubclassificationofasset: ['', Validators.required],
      pDescriptionClaimedDateForIncomeTax: [0, Validators.required],
      pwdvCarryingValueForIncomeTax: [0, Validators.required],
      pProfitLossForIncomeTax: [0, Validators.required],
      //assetcode:['',Validators.required]
    });
    this.BlurEventAllControll(this.SaleofAssetsForm);
    this.GetNatureofassets();
    this.patternname = "[A-Z,a-z]{5}[0-9]{4}[A-Z,a-z]{1}$";
    this.SaleofAssetsForm.controls.pPAN.setValidators(Validators.pattern(this.patternname));
  }
  GetNatureofassets() {
    debugger;
    this.AssetsInformationService.GetNatureofassets().subscribe(json => {
      this.getNatureOfAssetsData = json;
    })
  }
  ChangeNatureOfAsset(event) {
    debugger;
    this.SaleofAssetsForm.controls.psubclassificationofasset.setValue('');
    this.SaleofAssetsForm.controls.pCostOfAsset.setValue('');
    this.SaleofAssetsForm.controls.pDescriptionClaimedDate.setValue('');
    this.SaleofAssetsForm.controls.pMainAssetCode.setValue('');
    //this.SaleofAssetsForm.controls.assetcode.setValue('')
    this.SaleofAssetsForm.controls.pAssetCode.setValue('')
    this.pnatureof_asset = event.pnatureof_asset;
    this.AssetsInformationService.GetSubclassificationofassets(event.pnatureof_asset).subscribe(json => {
      this.getSubClassificationOfAssetsData = json;
    })
  }


  ChangegetSubClassificationOfAssets(event) {
    debugger;
    //this.SaleofAssetsForm.controls.assetcode.setValue('')
    this.SaleofAssetsForm.controls.pAssetCode.setValue('');
    this.SaleofAssetsForm.controls.pCostOfAsset.setValue('');
    this.SaleofAssetsForm.controls.pDescriptionClaimedDate.setValue('');
    this.psubclassificationof_asset = event.passetcode;
    this.AssetsInformationService.getAssetsCodesP(event.pnatureof_asset, event.psubclassificationof_asset).subscribe(json => {
      this.getAssetsCodesData = json;
      this.SaleofAssetsForm.controls.pMainAssetCode.setValue(this.getAssetsCodesData[0].passetcode);
      this.changeMainAssetCode(this.getAssetsCodesData[0])
    })
  }
  changeMainAssetCode(event) {
    debugger
    //this.SaleofAssetsForm.controls.pAssetCode.setValue('')
    this.AssetsInformationService.GetAssetsSeries(event.passetcode).subscribe(json => {
      this.AssetCodedata = json;
    })

  }
  changeSaleDate(event) {
    debugger;

    this.SaleofAssetsForm.controls.natureofasset.setValue('');
    this.SaleofAssetsForm.controls.psubclassificationofasset.setValue('');
    this.SaleofAssetsForm.controls.pMainAssetCode.setValue('');
    this.SaleofAssetsForm.controls.pAssetCode.setValue('');
    this.SaleofAssetsForm.controls.pCostOfAsset.setValue('');
    this.SaleofAssetsForm.controls.pDescriptionClaimedDate.setValue('');

    // this.SaleofAssetsForm.controls.pSoldTo.setValue('');
    // this.SaleofAssetsForm.controls.pPAN.setValue('');
    // this.SaleofAssetsForm.controls.pSaleValue.setValue('');
    // this.SaleofAssetsForm.controls.pGSTIN.setValue('');
    // this.SaleofAssetsForm.controls.pCGST.setValue('');
    // this.SaleofAssetsForm.controls.pSGST.setValue('');
    // this.SaleofAssetsForm.controls.pIGST.setValue('');
    // this.SaleofAssetsForm.controls.pTotalSaleValue.setValue('');
    // this.SaleofAssetsForm.controls.pwdvCarryingValue.setValue('');
    // this.SaleofAssetsForm.controls.pProfitLoss.setValue('');

    //   let abc = event
    // this.pDateofSale =  this.SaleofAssetsForm.controls.pDateofSale.setValue(abc);
    // this.pDateofSale = this.datePipe.transform(this.pDateofSale, "yyyy-MM-dd");

  }
  changeAssetCode(event) {
    debugger;
    let pDateofSale = this.SaleofAssetsForm.controls.pDateofSale.value;
    pDateofSale = this.datePipe.transform(pDateofSale, "yyyy-MM-dd");

    this.AssetsInformationService.GetAssetsSeriesAmount(this.psubclassificationof_asset, event.pAssetcode,).subscribe(res => {
      let cost = res;
      this.SaleofAssetsForm.controls.pCostOfAsset.setValue((Number(cost['pAssatamount'])));
      //let Assatamount=Number(cost[0].pAssatamount);
      //var percentage =Number(event.pwdvratecompaniesactpctg);
      //var result = (percentage / 100) * Assatamount;
      //let totolamount = (Assatamount - result).toFixed(2);
      // this.SaleofAssetsForm.controls.pDescriptionClaimedDate.setValue((Math.round(Number(cost[0].pDepreciationClaimedDate))));

      //   let date1 = new Date("01/16/2024");
      // let date2 = new Date("01/26/2024");
      // let Difference_In_Time =date2.getTime() - date1.getTime();
      // let Difference_In_Days =Math.round(Difference_In_Time / (1000 * 3600 * 24));
      // let ProfitLoss = (Assatamount - Number(totolamount)).toFixed(2);
      // this.SaleofAssetsForm.controls.pProfitLoss.setValue(ProfitLoss)

    });

    this.AssetsInformationService.GetAssetsSeriesDepreciationAmount(this.psubclassificationof_asset, event.pAssetcode, pDateofSale).subscribe(res => {
      let depVal = res
      this.SaleofAssetsForm.controls.pDescriptionClaimedDate.setValue((Math.round(Number(depVal[0].pDepreciationClaimedDate))));
      this.wdv()

    })


  }
  wdv() {
    debugger;
    let pwdvCarryingValue = this.SaleofAssetsForm.controls.pCostOfAsset.value - this.SaleofAssetsForm.controls.pDescriptionClaimedDate.value

    this.SaleofAssetsForm.controls.pwdvCarryingValue.setValue(pwdvCarryingValue);
  }
  GetAssetsSeriesDepreciationAmount() {
    debugger;

  }
  // sgstandcgst:boolean=false;
  // igstvalue:boolean=false;

  validatingGST() {
    debugger;
    this.SaleofAssetsForm.controls.pSGST.setValue(this.SaleofAssetsForm.controls.pCGST.value);
    if (this.SaleofAssetsForm.controls.pCGST.value != this.SaleofAssetsForm.controls.pSGST.value) {
      this._commonService.showWarningMessage('CGST And SGST Percentage Should Be Same');
      //this.assetInformationFormSave.controls.sgst.setValue(0);
      return;
    }


    if (this.SaleofAssetsForm.controls.pCGST.value != 0 && this.SaleofAssetsForm.controls.pCGST.value != "" && this.SaleofAssetsForm.controls.pSGST.value != 0 && this.SaleofAssetsForm.controls.pSGST.value != "") {
      $("#pIGST").prop("disabled", true);
    }
    else {
      $("#pIGST").prop("disabled", false);

    }

    if (this.SaleofAssetsForm.controls.pIGST.value != '' && this.SaleofAssetsForm.controls.pIGST.value != '0') {
      $("#pCGST").prop("disabled", true);
      $("#pSGST").prop("disabled", true);
    }
    else {

      $("#pCGST").prop("disabled", false);
      $("#pSGST").prop("disabled", false);
      // this.assetInformationFormSave.controls.cgst.setValue(0);
      // this.assetInformationFormSave.controls.sgst.setValue(0);
    }

    if (this.SaleofAssetsForm.controls.pCGST.value == "") {
      this.SaleofAssetsForm.controls.pCGST.setValue(0);
    }

    if (this.SaleofAssetsForm.controls.pSGST.value == "") {
      this.SaleofAssetsForm.controls.pSGST.setValue(0);
    }

    if (this.SaleofAssetsForm.controls.pIGST.value == "") {
      this.SaleofAssetsForm.controls.pIGST.setValue(0);
    }

    let saleValue = this.SaleofAssetsForm.controls.pSaleValue.value;
    let cgst = this.SaleofAssetsForm.controls.pCGST.value;
    let igst = this.SaleofAssetsForm.controls.pIGST.value;

    let pValue = 0.01;
    this.cgstPercentage = 0;
    this.sgstPercentage = 0;
    this.igstPercentage = 0;
    if (cgst != '') {
      let cgstcalc = cgst * pValue;
      this.cgstPercentage = +(saleValue * cgstcalc).toFixed(2);
    }
    this.sgstPercentage = this.cgstPercentage
    if (igst != '') {
      let igstcalc = igst * pValue;
      this.igstPercentage = +(saleValue * igstcalc).toFixed(2);
    }
    this.SaleofAssetsForm.controls.pTotalSaleValue.setValue(Math.round(Number(this.SaleofAssetsForm.controls.pSaleValue.value) + Number(this.cgstPercentage) + Number(this.sgstPercentage) + Number(this.igstPercentage)));

    // this.SaleofAssetsForm.controls.pTotalSaleValue.setValue(Number(this.SaleofAssetsForm.controls.pSaleValue.value) + Number(this.SaleofAssetsForm.controls.pCGST.value) + Number(this.SaleofAssetsForm.controls.pSGST.value) + Number(this.SaleofAssetsForm.controls.pIGST.value));
    //this.gstCalculation();
    //this.wdv()


    this.profitOrLossCalculation()
  }

  profitOrLossCalculation() {
    debugger;
    if (this.SaleofAssetsForm.controls.pDescriptionClaimedDate.value != 0) {
      let originalCOst = this.SaleofAssetsForm.controls.pCostOfAsset.value;
      let saleValue = this.SaleofAssetsForm.controls.pSaleValue.value;
      let depriciationValue = this.SaleofAssetsForm.controls.pDescriptionClaimedDate.value;
      let profitOrLOssValue: any;
      profitOrLOssValue = originalCOst - saleValue - depriciationValue;
      if (profitOrLOssValue > 0) {
        this.profitOrLossValue = 'LOSS';
        profitOrLOssValue = "-" + profitOrLOssValue;
      }
      else {
        this.profitOrLossValue = 'PROFIT';
        profitOrLOssValue = profitOrLOssValue.toString();
        profitOrLOssValue = profitOrLOssValue.substring(1);
        profitOrLOssValue = +profitOrLOssValue;

      }
      this.SaleofAssetsForm.controls.pProfitLoss.setValue(profitOrLOssValue);
    }

    if (this.SaleofAssetsForm.controls.pDescriptionClaimedDateForIncomeTax.value != 0) {
      let originalCOst = this.SaleofAssetsForm.controls.pCostOfAsset.value;
      let saleValue = this.SaleofAssetsForm.controls.pSaleValue.value;
      let depriciationValue = this.SaleofAssetsForm.controls.pDescriptionClaimedDateForIncomeTax.value;
      let profitOrLOssValueForIncomeTax: any;
      profitOrLOssValueForIncomeTax = originalCOst - saleValue - depriciationValue;
      if (profitOrLOssValueForIncomeTax > 0) {
        this.profitOrLossValueForIncomeTax = 'LOSS';
        profitOrLOssValueForIncomeTax = "-" + profitOrLOssValueForIncomeTax;
      }
      else {
        this.profitOrLossValueForIncomeTax = 'PROFIT';
        profitOrLOssValueForIncomeTax = profitOrLOssValueForIncomeTax.toString();
        profitOrLOssValueForIncomeTax = profitOrLOssValueForIncomeTax.substring(1);
        profitOrLOssValueForIncomeTax = +profitOrLOssValueForIncomeTax;

      }
      this.SaleofAssetsForm.controls.pProfitLossForIncomeTax.setValue(profitOrLOssValueForIncomeTax);
    }

  }

  saveAssets() {
    debugger
    let validate = true;
    if (this.SaleofAssetsForm.controls.pPAN.value != '') {
      if (this.SaleofAssetsForm.controls.pGSTIN.value == '') {
        this.SaleofAssetsForm.controls.pGSTIN.setValue("0");
      }
    }

    if (this.SaleofAssetsForm.controls.pGSTIN.value != '') {
      if (this.SaleofAssetsForm.controls.pPAN.value == '') {
        this.SaleofAssetsForm.controls.pPAN.setValue("ABCTY1234D");
      }
    }
    let pProfitLossForIncomeTax = Number(this.SaleofAssetsForm.controls.pProfitLossForIncomeTax.value).toString();
    this.SaleofAssetsForm.controls.pProfitLossForIncomeTax.setValue(pProfitLossForIncomeTax);

    let pProfitLoss = Number(this.SaleofAssetsForm.controls.pProfitLoss.value).toString();
    this.SaleofAssetsForm.controls.pProfitLoss.setValue(pProfitLoss);

    let pCGST = Number(this.SaleofAssetsForm.controls.pCGST.value);
    this.SaleofAssetsForm.controls.pCGST.setValue(pCGST);

    let pSGST = Number(this.SaleofAssetsForm.controls.pSGST.value);
    this.SaleofAssetsForm.controls.pSGST.setValue(pSGST);

    let pIGST = Number(this.SaleofAssetsForm.controls.pIGST.value);
    this.SaleofAssetsForm.controls.pIGST.setValue(pIGST);

    let pSaleValue = Number(this.SaleofAssetsForm.controls.pSaleValue.value);
    this.SaleofAssetsForm.controls.pSaleValue.setValue(pSaleValue);
 let branch=  sessionStorage.getItem("loginUserBranchName");
 this.SaleofAssetsForm.controls.pbranchname.setValue(branch);
    

    if (this.checkValidations(this.SaleofAssetsForm, validate)) {
      // let data = JSON.stringify(this.SaleofAssetsForm.value);
      let data = this.SaleofAssetsForm.value;
      //       //let selectedAssetCodeData = this.selectedAssetCodeData
      //             this.selectedAssetCodeData.push(data)
      // console.log('selected form values:',this.selectedAssetCodeData);
      let branch=  sessionStorage.getItem("loginUserBranchName");
      //this.SaleofAssetsForm.controls.pbranchname.setValue(branch);
      let object = [
        {
        psaleid: 0,
       psaledetailsid: 0,
        pDateofSale: this.datePipe.transform(this.SaleofAssetsForm.controls.pDateofSale.value, 'dd-MM-yyyy'),
        pMainAssetCode: this.SaleofAssetsForm.controls.pMainAssetCode.value,
        pAssetCode: this.SaleofAssetsForm.controls.pAssetCode.value,
        pCostOfAsset: this.SaleofAssetsForm.controls.pCostOfAsset.value,
        natureofasset: this.SaleofAssetsForm.controls.natureofasset.value,
        psubclassificationofasset: this.SaleofAssetsForm.controls.psubclassificationofasset.value,
       pbranchname:branch,
        pSaleValue: this.SaleofAssetsForm.controls.pSaleValue.value,
        pCGST: this.SaleofAssetsForm.controls.pCGST.value,
        pSGST: this.SaleofAssetsForm.controls.pSGST.value,
        pIGST: this.SaleofAssetsForm.controls.pIGST.value,
        pTotalSaleValue: this.SaleofAssetsForm.controls.pTotalSaleValue.value,
        pDescriptionClaimedDate: this.SaleofAssetsForm.controls.pDescriptionClaimedDate.value,
        pwdvCarryingValue: this.SaleofAssetsForm.controls.pwdvCarryingValue.value,
        pProfitLoss: this.SaleofAssetsForm.controls.pProfitLoss.value,
        pDescriptionClaimedDateForIncomeTax: this.SaleofAssetsForm.controls.pDescriptionClaimedDateForIncomeTax.value,
        pwdvCarryingValueForIncomeTax: this.SaleofAssetsForm.controls.pwdvCarryingValueForIncomeTax.value,
        pProfitLossForIncomeTax: this.SaleofAssetsForm.controls.pProfitLossForIncomeTax.value,
        pcreatedby: this._commonService.pCreatedby,
        // pcreateddate: this.datePipe.transform(this.SaleofAssetsForm.controls.pcreateddate.value, 'dd-MM-yyyy'),
        pcreateddate: this.datePipe.transform(new Date(), 'dd-MM-yyyy'),
        ptypeofoperation: 'create'

      }
    ]
      // let objectData = Object.assign(this.SaleofAssetsForm.value, object);
      // let newdata = JSON.stringify(objectData);

      let newdata = { assetssaleDetailslist: object }
      let json = Object.assign(this.SaleofAssetsForm.value, newdata);

      this.AssetsInformationService.SaveAssetssale(json).subscribe(res => {
        if (res) {
          this._commonService.showInfoMessage('Saved Successfully');
          this.clearDataSave();
          this.ngOnInit();
        } else {
          this._commonService.showWarningMessage('error');
        }

      });
    }

  }
  clearDataSave() {
    debugger
    this.SaleofAssetsForm.reset();
    this.SaleofAssetsForm.controls.pDateofSale.setValue(this.today);
    this.SaleofAssetsForm.controls.pcreatedby.setValue(Number(this.LoginUserid));
    this.SaleofAssetsForm.controls.ptypeofoperation.setValue('CREATE'),
      this.SaleofAssetsForm.controls.pMainAssetCode.setValue('');
    this.SaleofAssetsForm.controls.pGSTIN.setValue(0);
    this.SaleofAssetsForm.controls.pCGST.setValue(0);
    this.SaleofAssetsForm.controls.pSGST.setValue(0);
    this.SaleofAssetsForm.controls.pIGST.setValue(0);
    this.auctionminutevalidation = {};
    this.profitOrLossValue = '';
  }

  add() {
    debugger;
    //this.router.navigate(['/LegalNotice']);     
    this.router.navigate(['/SaleOfAssetsView']);
  }

  //validations code
  BlurEventAllControll(fromgroup: FormGroup) {
    try {
      Object.keys(fromgroup.controls).forEach((key: string) => {
        this.setBlurEvent(fromgroup, key);
      })
    }
    catch (e) {
      this._commonService.showErrorMessage(e);
      return false;
    }
  }
  setBlurEvent(fromgroup: FormGroup, key: string) {
    try {
      let formcontrol;
      formcontrol = fromgroup.get(key);
      if (formcontrol) {
        if (formcontrol instanceof FormGroup) {
          this.BlurEventAllControll(formcontrol)
        }
        else {
          if (formcontrol.validator)
            fromgroup.get(key).valueChanges.subscribe((data) => { this.GetValidationByControl(fromgroup, key, true) })
        }
      }
    }
    catch (e) {
      this._commonService.showErrorMessage(e);
      return false;
    }
  }
  GetValidationByControl(formGroup: FormGroup, key: string, validate: boolean): boolean {
    try {
      let formcontrol;
      formcontrol = formGroup.get(key);
      if (formcontrol) {
        if (formcontrol instanceof FormGroup) {
          this.checkValidations(formcontrol, validate)
        }
        else if (formcontrol.validator) {
          this.auctionminutevalidation[key] = '';
          if (formcontrol.errors || formcontrol.invalid || formcontrol.touched || formcontrol.dirty) {
            let lablename;
            lablename = (document.getElementById(key) as HTMLInputElement).title;
            let errormessage;
            for (const errorkey in formcontrol.errors) {
              if (errorkey) {
                errormessage = this._commonService.getValidationMessage(formcontrol, errorkey, lablename, key, '');
                this.auctionminutevalidation[key] += errormessage + ' ';
                validate = false;
              }
            }

          }
        }
      }
    }
    catch (e) {
      this._commonService.showErrorMessage(e);
      return false;
    }
    return validate;
  }
  checkValidations(group: FormGroup, validate: boolean): boolean {
    try {
      Object.keys(group.controls).forEach((key: string) => {
        validate = this.GetValidationByControl(group, key, validate);
      })
    }
    catch (e) {
      this._commonService.showErrorMessage(e);
      return false;
    }
    return validate;
  }

}
