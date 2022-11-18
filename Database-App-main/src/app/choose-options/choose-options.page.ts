import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-choose-options',
  templateUrl: './choose-options.page.html',
  styleUrls: ['./choose-options.page.scss'],
})
export class ChooseOptionsPage implements OnInit {

  constructor(private http: HttpClient, 
    private router: Router,
    private loadingController: LoadingController,
    private alertController: AlertController) { }

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
              this.router.navigate(['choose-options'])
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

  onDownload(){
    this.router.navigate(['home']);
  }

  onUpload(){
    this.router.navigate(['home']);

  }

}
