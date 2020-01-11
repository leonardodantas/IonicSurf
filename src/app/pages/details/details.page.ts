import { Component, OnInit, OnDestroy } from '@angular/core';
import { Product } from 'src/app/interfaces/product';
import { LoadingController, ToastController, NavController } from '@ionic/angular';
import { ProductService } from 'src/app/services/product.service';
import { AuthService } from 'src/app/services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
})
export class DetailsPage implements OnInit, OnDestroy {

  public product: Product = {};

  private loading: any;

  private productId: string = null;

  private productSubscription: Subscription;

  constructor(
    private loadingController: LoadingController,
    private toastController: ToastController,
    private productService: ProductService,
    private authService: AuthService,
    private activeRoute: ActivatedRoute,
    private navController:NavController
  ) { 

    this.productId = this.activeRoute.snapshot.params["id"];
    if(this.productId) this.loadProduct();

  }

  ngOnInit() {
  }

  ngOnDestroy(){
    if(this.productSubscription) this.productSubscription.unsubscribe;
  }

  loadProduct() {
    this.productSubscription = this.productService.getProduct(this.productId).subscribe(
      data=>{
        console.log(data)
        this.product = data;
      }
    );
  }

  async salvarProduto(){
    
    await this.presentLoading('Carregando');
    this.product.userId = this.authService.getAuth().currentUser.uid;

    if(this.productId){

      try {
        await this.productService.updateProduct(this.productId ,this.product)
        await this.loading.dismiss(); 

        this.navController.navigateBack('/home');

      } catch (error) {
        this.loading.dismiss(); 
        this.presentLoading('Erro ao Atualizar Produto');
      } 

    } else {
      this.product.createdAt =   new Date().getTime();

      try {
        await this.productService.addProducts(this.product)
        await this.loading.dismiss(); 

        this.navController.navigateBack('/home');

      } catch (error) {
        this.loading.dismiss(); 
        this.presentLoading('Erro ao Salvar Produto');
      } 
    }   
  }

  async presentLoading(message: string) {
    this.loading = await this.loadingController.create({
      message,
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
