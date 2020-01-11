import { Component, OnInit, OnDestroy } from '@angular/core';
import { Product } from 'src/app/interfaces/product';
import { Subscription } from 'rxjs';
import { ProductService } from 'src/app/services/product.service';
import { AuthService } from 'src/app/services/auth.service';
import { LoadingController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {

  public products = new Array<Product>();
  private productsSubscription: Subscription;
  
  private loading: any

  constructor(
    private productsService: ProductService,
    private authService: AuthService,
    private loadingController: LoadingController,
    private toastController: ToastController
  ) { 
    this.productsSubscription = this.productsService.getProducts().subscribe(data=>{
      this.products = data;
    })
  } 

  ngOnInit() {
  }

  ngOnDestroy(){
    this.productsSubscription.unsubscribe();
  }

  async deleteProduct(id: string){
    await this.presentLoading();
    try {
      await this.productsService.deleteProduct(id);
    } catch (error) {
      await this.loading.dismiss();
      await this.presentToast('Erro ao Deletar');
    } finally {
      await this.loading.dismiss();
      await this.presentToast('Deletado com sucesso');
    }
  }

  async logout(){
    await this.presentLoading();
    try {
      await this.authService.logout();
    } catch (error) {
    } finally {
      await this.loading.dismiss();
    }
  }

  async presentLoading() {
    this.loading = await this.loadingController.create({
      message: 'Carregando...'
    });
    await this.loading.present();
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 3000
    });
    toast.present();
  }

}
