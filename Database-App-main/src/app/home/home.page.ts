import { AlertController, LoadingController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { OnInit } from '@angular/core';



@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit  {
  databases: any[] = [];
  tables: any[] = [];
  views: any[] = [];
  @ViewChild('btn', { static: false }) btn: ElementRef;
  selectedDatabase: any;
  selectedTable: any;
  selectedSeparator: any;
  selectedFileType: any;
  newDirectory:any;
  qualifier:any;



  downloadUrl;
  isUrlSet: boolean = false;

  isTable: boolean = true;
  isSingle: boolean=false;
  isSeparator: boolean=false;
  isOthers: boolean = false;
  



  constructor(
    private http: HttpClient,
    private alertController: AlertController,
    private router: Router,
    private loadingController: LoadingController
  ) {
    this.getAllDatabases();
  }
  ngOnInit() {
  }
  async presentAlertConfirm(msg: string, head:string, isSuccess: boolean) {
    const alert = await this.alertController.create({
      mode: 'ios',
      header: head,
      message: msg,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Okay',
          handler: () => {
            console.log('Confirm Okay');
            if(isSuccess == true){
              this.router.navigate(['home'])
            }
            if(isSuccess == false){
              console.log("Cancelled");
              
            }
          }
        }
      ]
    });
  
    await alert.present();
  }


  DatabaseSelectEvent(event) {
    console.log(event.detail.value);
    this.selectedDatabase = event.detail.value;
    this.getAllTablesByDatabase();
  }

  tableViewSelectEvent(event) {
    console.log(event.detail.value);
    if (event.detail.value == 'table') {
      this.isTable = true;
      console.log('Table Enabled');
    }
    if (event.detail.value == 'view') {
      this.isTable = false;
      console.log('View Enabled');
    }
  }

  tableSelectEvent(ev) {
    const fileLength = ev.detail.value.length;
    if (fileLength == 1) {

      
      this.selectedTable = ev.detail.value;
      this.isSingle=true;
      console.log(this.selectedTable);
      console.log('Single table value');

      return;
    }
    if (fileLength > 1) {
      let tempTableName = '' ;
      
      
      for(let j = 0; j < fileLength; j ++){
        
        const tableName= ev.detail.value[j];
        tempTableName = tempTableName + tableName + ',';
        
        console.log('----tempTableName----',tempTableName);
     
      }
      tempTableName = tempTableName.replace(/,\s*$/, '');
      this.selectedTable = tempTableName;
      this.isSingle=false;
      console.log('----selectedTable----',this.selectedTable);

      return;
    }
  }

  viewSelectEvent(ev) {
    const fileLength = ev.detail.value.length;
    if (fileLength == 1) {

      
      this.selectedTable = ev.detail.value;
      this.isSingle=true;
      console.log(this.selectedTable);
      console.log('Single view value');

      return;
    }
    if (fileLength > 1) {
      let tempTableName = '' ;
      
      
      for(let j = 0; j < fileLength; j ++){
        
        const tableName= ev.detail.value[j];
        tempTableName = tempTableName + tableName + ',';
        
        console.log('----tempTableName----',tempTableName);
     
      }
      tempTableName = tempTableName.replace(/,\s*$/, '');
      this.selectedTable = tempTableName;
      this.isSingle=false;
      console.log('----selectedView----',this.selectedTable);

      return;
    }
  }

 
  fileTypeEvent(event){
    this.selectedFileType = event.detail.value;
    console.log(this.selectedFileType);
    let value = event.detail.value;
    if(value=='txt'){
      this.isSeparator = true;
      return;
    }
      
  }

  seperatorTypeEvent(event) {
    this.selectedSeparator=event.detail.value;
    console.log(this.selectedSeparator);
    let value= event.detail.value;
    if(value == 'Others'){
      this.isOthers = true;
      return;
    }
    else 
      this.isOthers=false;
    
  }

  otherSeparatorEvent(event){
    this.selectedSeparator=event.detail.value;
    console.log(this.selectedSeparator);
  }

  qualifierEvent(event){
    this.qualifier=event.detail.value;
    console.log(this.qualifier);
  }

  downloadDirectoryEvent(event){
    this.newDirectory=event.detail.value;
    console.log(this.newDirectory);
  }
    
  async onDownload() {
    this.isUrlSet = false;
    {
      let loading = await this.loadingController.create({
        message: 'Downloading',
        mode: 'ios',
        spinner: 'lines',
        duration: 3000,  
      }
      
      );
      await loading.present();

      await loading.dismiss();
      this.presentAlertConfirm("Success!", "Download Completed!", true);

      if (this.isSingle == true) {
        console.log('Sending single ' + this.selectedTable);

        this.http
          .post(environment.API + `/${this.selectedFileType}/`, {
            dbname: this.selectedDatabase,
            tablename: this.selectedTable,
            separator: this.selectedSeparator,
            newDirectory:this.newDirectory,
            fileType:this.selectedFileType,
            qualifier:this.qualifier,
          })
          .subscribe(
            async (file) => {
              console.log(file);


              console.log(file['file'].split('/').splice(1).join('/'));
              let files = file['file'].split('/').splice(1).join('/');
              this.downloadUrl = `http://localhost:3000/static/${files}`;

              let a = document.getElementById('download');
              a.setAttribute('href', this.downloadUrl);
              this.isUrlSet = true;
              this.btn.nativeElement.click();
              
            },           
            (error) => {
              console.log(error);
              this.isUrlSet = false;
            }
          );
          console.log("Downloaded Successfully!")
        return;
      } 
       if (this.isSingle == false) {
        console.log('Sending Multiple ' + this.selectedTable);

        this.http
          .post(environment.API + `/${this.selectedFileType}/multi`, {
            dbname: this.selectedDatabase,
            tablename: this.selectedTable,
            separator: this.selectedSeparator,
            newDirectory:this.newDirectory,
            fileType:this.selectedFileType,
            qualifier:this.qualifier,
          })
          .subscribe(
            async (file) => {              
              console.log(file['filePaths']);

              

              for (let i = 0; i <= file['filePaths'].length - 1; i++) {
                console.log(
                  file['filePaths'][i].split('/').splice(1).join('/')
                );
              

                this.downloadUrl = `http://localhost:3000/static/${file[
                  'filePaths'
                ][i]
                  .split('/')
                  .splice(1)
                  .join('/')}`;
                let a = document.getElementById('download');
                a.setAttribute('href', this.downloadUrl);
                this.isUrlSet = true;
                this.btn.nativeElement.click();
               }
               
             
            },
            (error) => {
              console.log(error);
              this.isUrlSet = false;
            }
          );
          console.log('Downloaded Successfully');
        return;
      }
      
    }
    
    
  }

  async getAllDatabases() {
    this.http.get(environment.API + '/databases').subscribe(
      (dbs) => {
        console.log(dbs);
        this.databases = dbs['result'];
      },
      async (error) => {
        console.log(error);
      }
    );
  }

  async getAllTablesByDatabase() {
    this.http
      .post(environment.API + '/database', { dbname: this.selectedDatabase })
      .subscribe(
        (dbs) => {
          console.log(dbs);
          this.tables = dbs['result'];
        },
        async (error) => {
          console.log(error);
        }
      );
  }
}
function showAlert() {
  throw new Error('Function not implemented.');
}



