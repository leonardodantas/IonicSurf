import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private fireAuth: AngularFireAuth) { }

  login(user: User){
    return this.fireAuth.auth.signInWithEmailAndPassword(user.email, user.senha);
  }

  register(user: User){
    return this.fireAuth.auth.createUserWithEmailAndPassword(user.email, user.senha);
  }

  logout(){
    return this.fireAuth.auth.signOut();
  }

  getAuth(){
    return this.fireAuth.auth;
  }
}
