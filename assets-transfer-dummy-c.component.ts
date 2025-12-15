import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { AssetsInformationService } from 'src/app/Services/Common/assets-information.service';
import { CommonService } from 'src/app/Services/common.service';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
declare const $: any;
import { IDropdownSettings, } from 'ng-multiselect-dropdown';


@Component({
  selector: 'app-assets-transfer-dummy-c',
  templateUrl: './assets-transfer-dummy-c.component.html',
  styles: []
})
export class AssetsTransferDummyCComponent implements OnInit {
  assetTransferForm: FormGroup;
  loginUserBranchName: string;
  LoginUserid: string;
  today = new Date
  public dpConfig2: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  getNatureOfAssetsData: any= [];
  getSubClassificationOfAssetsData: any = [];
  getAssetsCodesData: any = [];
  psubclassificationof_asset: any;
  AssetCodedata: any = [];
  profitOrLossValueForIncomeTax: any = '';
  profitOrLossValue: any = '';
  pnatureof_asset: any;
  ptransferetailsid: number = 0;
  ptransferid: number = 0;
  pCostOfAsset:any;

  constructor(private fb: FormBuilder, private _commonService: CommonService, private AssetsInformationService: AssetsInformationService, private datePipe: DatePipe, private router: Router) {
    this.dpConfig2.containerClass = 'theme-dark-blue';
    this.dpConfig2.dateInputFormat = 'DD-MM-YYYY';
    this.dpConfig2.maxDate = this.today;
    this.dpConfig2.showWeekNumbers = false;
  }

  ngOnInit(): void {
    this.loginUserBranchName = sessionStorage.getItem("loginUserBranchName");
    this.LoginUserid = sessionStorage.getItem("LoginUserid");
    this.assetTransferForm = this.fb.group({
      ptransferid: [0],
      pdateoftransfer: [this.today],
      pmainassetcode: [''],
      passetcode: ['', Validators.required],
      passetname: ['', Validators.required],
      psubclassificationofasset: [''],
      pexistingholder: ['', Validators.required],
      ptolcation: ['', Validators.required],
      ptodepartment: ['', Validators.required],
      pnewholder: ['', Validators.required],
      ptransferauthorizedby: ['', Validators.required],
      pbranchname: [this.loginUserBranchName],
      pdepreciationclaimedtilldate: Number[0],
      pcompanywdvcarryingvaluetransfer: [0],
      pincomtaxwdvdepreciationclaimedtilldate: [0],
      pincometaxwdvcarryingvaluetransfer: [0],
      pcreatedby: [Number(this.LoginUserid)],
      pcreateddate: [new Date()],
      ptypeofoperation: ['CREATE'],
      // passetcode: [[], Validators.required],
      pCostOfAsset: [''],
       pProfitLoss: [0],
      // pincomtaxwdvdepreciationclaimedtilldate: [0],
      // pincometaxwdvcarryingvaluetransfer: [0],
       pProfitLossForIncomeTax: [0],
      // pcreateddate: [new Date()]
    });
    this.GetNatureofassets()
  }
  GetNatureofassets() {
    debugger;
    this.AssetsInformationService.GetNatureofassets().subscribe(json => {
      this.getNatureOfAssetsData = json;
    })
  }


  add() {
    debugger;
    //this.router.navigate(['/LegalNotice']);     
    this.router.navigate(['/AssetTransferView']);
  }


  changeTransferDate(event) {
    debugger
  }
  ChangeNatureOfAsset(event) {
    debugger
     this.assetTransferForm.controls.pCostOfAsset.setValue('');
      //this.auctionminutevalidation.pCostOfAsset = '';
    this.pnatureof_asset = event.pnatureof_asset;
    this.AssetsInformationService.GetSubclassificationofassets(event.pnatureof_asset).subscribe(json => {
      this.getSubClassificationOfAssetsData = json;
    })
  }

  ChangegetSubClassificationOfAssets(event) {
    debugger;
    this.psubclassificationof_asset = event.passetcode;
    this.AssetsInformationService.getAssetsCodesP(event.pnatureof_asset, event.psubclassificationof_asset).subscribe(json => {
      this.getAssetsCodesData = json;
      this.assetTransferForm.controls.pmainassetcode.setValue(this.getAssetsCodesData[0].passetcode);
      this.changeMainAssetCode(this.getAssetsCodesData[0])
    })
  } 
  changeMainAssetCode(event) {
    debugger

    this.AssetsInformationService.GetAssetsSeries(event.passetcode).subscribe(json => {
      this.AssetCodedata = json;
    })
  }
  changeAssetCode(event) {
    debugger;
    let pDateofTransfer = this.assetTransferForm.controls.pdateoftransfer.value;
    pDateofTransfer = this.datePipe.transform(pDateofTransfer, "yyyy-MM-dd");

    this.AssetsInformationService.GetAssetsSeriesAmount(this.psubclassificationof_asset, event.pAssetcode,).subscribe(res => {
      let cost = res;
      this.assetTransferForm.controls.pCostOfAsset.setValue((Number(cost['pAssatamount'])));

    });

    this.AssetsInformationService.GetAssetsSeriesDepreciationAmount(this.psubclassificationof_asset, event.pAssetcode, pDateofTransfer).subscribe(res => {
      let depVal = res
      this.assetTransferForm.controls.pdepreciationclaimedtilldate.setValue((Math.round(Number(depVal[0].pDepreciationClaimedDate))));
      this.wdv()

    })

  }

  wdv() {
    debugger;
    let pcompanywdvcarryingvaluetransfer = this.assetTransferForm.controls.pCostOfAsset.value - this.assetTransferForm.controls.pdepreciationclaimedtilldate.value
    this.assetTransferForm.controls.pcompanywdvcarryingvaluetransfer.setValue(pcompanywdvcarryingvaluetransfer);
  }


  profitOrLossCalculation() {
    debugger;
    if (this.assetTransferForm.controls.pdepreciationclaimedtilldate.value != 0) {
      let originalCOst = this.assetTransferForm.controls.pCostOfAsset.value;
      let saleValue = this.assetTransferForm.controls.pSaleValue.value;
      let depriciationValue = this.assetTransferForm.controls.pdepreciationclaimedtilldate.value;
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
      this.assetTransferForm.controls.pProfitLoss.setValue(profitOrLOssValue);
    }

    if (this.assetTransferForm.controls.pincomtaxwdvdepreciationclaimedtilldate.value != 0) {
      let originalCOst = this.assetTransferForm.controls.pCostOfAsset.value;
      let saleValue = this.assetTransferForm.controls.pSaleValue.value;
      let depriciationValue = this.assetTransferForm.controls.pincomtaxwdvdepreciationclaimedtilldate.value;
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
      this.assetTransferForm.controls.pProfitLossForIncomeTax.setValue(profitOrLOssValueForIncomeTax);
    }

  }


  saveAssetsTransfer() {
    debugger

    this.loginUserBranchName = sessionStorage.getItem("loginUserBranchName");
    this.assetTransferForm.controls.pbranchname.setValue(this.loginUserBranchName);
    let validate = true;
    let pDateofTransfer = this.datePipe.transform(this.assetTransferForm.controls.pdateoftransfer.value, "yyyy-MM-dd");
    this.assetTransferForm.controls.pdateoftransfer.setValue(pDateofTransfer);
    let branch = sessionStorage.getItem("loginUserBranchName");
    let dd = [{

      ptransferid: 0,
      ptransferetailsid: 0,
      pdateoftransfer: this.assetTransferForm.controls.pdateoftransfer.value,
      pmainassetcode: this.assetTransferForm.controls.pmainassetcode.value,
      passetcode: this.assetTransferForm.controls.passetcode.value,
      passetname: this.assetTransferForm.controls.passetname.value,
      psubclassificationofasset: this.assetTransferForm.controls.psubclassificationofasset.value,
      pbranchname: this.assetTransferForm.controls.pbranchname.setValue(branch),
      pdepreciionclaimedtilldateat: +this.assetTransferForm.controls.pdepreciationclaimedtilldate.value,
      pcompanywdvcarryingvaluetransfer: this.assetTransferForm.controls.pcompanywdvcarryingvaluetransfer.value,
      pincomtaxwdvdepreciationclaimedtilldate: this.assetTransferForm.controls.pincomtaxwdvdepreciationclaimedtilldate.value,
      pincometaxwdvcarryingvaluetransfer: this.assetTransferForm.controls.pincometaxwdvcarryingvaluetransfer.value,
      pcreatedby: +this.LoginUserid,
      ptypeofoperation: 'CREATE',
      pcreateddate: this.assetTransferForm.controls.pcreateddate.value,
    }];


    let newdata = { transferDatsilsList: dd };
    let json = Object.assign(this.assetTransferForm.value, newdata);
    console.log('json data:', json);

    this.AssetsInformationService.saveAssetsTransfer(json).subscribe(res => {
      if (res) {
        this._commonService.showInfoMessage('Saved Successfully');
        this.assetTransferForm.reset();
        this.assetTransferForm.controls.pdateoftransfer.setValue(this.today);
        this.assetTransferForm.controls.pcreatedby.setValue(Number(this.LoginUserid));
        this.assetTransferForm.controls.ptypeofoperation.setValue('CREATE'),
          this.assetTransferForm.controls.pmainassetcode.setValue('');
        this.assetTransferForm.controls.pbranchname.setValue(this.loginUserBranchName);


      } else {
        this._commonService.showWarningMessage('error');
      }

    });
  }

}




