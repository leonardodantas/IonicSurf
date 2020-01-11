import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides, LoadingController, ToastController } from '@ionic/angular';
import { User } from 'src/app/interfaces/user';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  @ViewChild(IonSlides, { static: false }) slides: IonSlides;

  public wavesPosition: number = 0;
  public wavesDifferences: number = 80;

  public userLogin: User = {};
  public userRegister: User = {};

  public loading: any;

  constructor(
    private loadingController: LoadingController,
    private toastController: ToastController,
    private authService: AuthService
  ) {

  }

  ngOnInit() {
  }

  segmentChanged(event: any) {
    if (event.detail.value === "login") {
      this.slides.slidePrev();
      this.wavesPosition += this.wavesDifferences;
    } else {
      this.slides.slideNext();
      this.wavesPosition -= this.wavesDifferences;
    }
  }

  async login() {
    await this.presentLoading();
    try {
      await this.authService.login(this.userLogin)
    } catch (error) {
      let message: string;
      switch (error.code) {
        case 'auth/argument-error':
          message = 'E-mail obrigatorio'
          break;
        case 'auth/wrong-password':
          message = 'Senha invalida'
          break;
        case 'auth/user-not-found':
          message = 'E-mail inexistente'
          break;
        default:
          message = 'Erro ao Logar';
          break;
      }
      await this.presentToast(message);
    } finally {
      await this.loading.dismiss();
    }
  }

  async register() {
    await this.presentLoading();
    try {
      await this.authService.register(this.userRegister);
    } catch (error) {
      let message: string;
      switch (error.code) {
        case 'auth/argument-error':
          message = 'Email e senha são obrigatorios';
          break;
        case 'auth/email-already-in-use':
          message = 'Email já cadastrado';
          break;
        default:
          message = 'Erro ao cadastrar';
          break;
      }
      this.presentToast(message);
    }
    finally {
      await this.loading.dismiss();
    }

  }

  async presentLoading() {
    this.loading = await this.loadingController.create({
      message: 'Por Favor Aguarde...',
    });
    return this.loading.present();
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000
    });
    toast.present();
  }

}
