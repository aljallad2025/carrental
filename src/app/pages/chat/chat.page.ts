import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonToolbar, IonTitle, IonInput, IonIcon, IonBackButton, IonButtons } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { ChatService } from '../../services/chat.service';
import { AuthService } from '../../services/auth.service';
import { ChatMessage } from '../../models/car.model';
import { addIcons } from 'ionicons';
import { sendOutline, headsetOutline } from 'ionicons/icons';

@Component({
  selector: 'app-chat',
  template: `
<ion-header class="ion-no-border"><ion-toolbar class="speed-toolbar"><ion-buttons slot="start"><ion-back-button text="" defaultHref="/tabs/profile"></ion-back-button></ion-buttons><ion-title>Support</ion-title></ion-toolbar></ion-header>
<ion-content [fullscreen]="true" class="chat-content" #content>
  <div class="messages">
    <div class="welcome-msg">
      <div class="bot-avatar"><ion-icon name="headset-outline"></ion-icon></div>
      <p>Hello! How can I help you today?</p>
    </div>
    <div *ngFor="let msg of messages" class="message" [class.mine]="!msg.is_admin" [class.theirs]="msg.is_admin">
      <div class="bubble">{{ msg.message }}</div>
      <span class="time">{{ msg.created_at | date:'HH:mm' }}</span>
    </div>
  </div>
</ion-content>
<div class="chat-input">
  <ion-input [(ngModel)]="newMessage" placeholder="Type a message..." (keyup.enter)="send()"></ion-input>
  <button (click)="send()" [disabled]="!newMessage.trim()"><ion-icon name="send-outline"></ion-icon></button>
</div>`,
  styles: [`
.speed-toolbar { --background: #0a0a0a; --color: #fff; --border-color: rgba(255,255,255,0.06); }
.chat-content { --background: #0a0a0a; }
.messages { padding: 16px 20px; padding-bottom: 80px; }
.welcome-msg { display: flex; align-items: center; gap: 10px; background: #141414; border: 1px solid rgba(255,255,255,0.05); border-radius: 16px; padding: 14px; margin-bottom: 20px;
  .bot-avatar { width: 38px; height: 38px; border-radius: 50%; background: rgba(220,38,38,0.15); display: flex; align-items: center; justify-content: center; flex-shrink: 0; ion-icon { font-size: 18px; color: #ef4444; } }
  p { color: #a1a1aa; font-size: 13.5px; margin: 0; }
}
.message { display: flex; flex-direction: column; margin-bottom: 12px; max-width: 75%;
  &.mine { align-self: flex-start; align-items: flex-start; .bubble { background: #1c1c1c; color: #f4f4f5; border-radius: 16px 16px 16px 4px; } }
  &.theirs { align-self: flex-end; align-items: flex-end; .bubble { background: linear-gradient(135deg, #dc2626, #991b1b); color: #fff; border-radius: 16px 16px 4px 16px; } }
  .bubble { padding: 10px 14px; font-size: 14px; }
  .time { color: #52525b; font-size: 10.5px; margin-top: 4px; }
}
.chat-input { position: fixed; bottom: 0; left: 0; right: 0; background: #111111; border-top: 1px solid rgba(255,255,255,0.06);
  padding: 12px 16px calc(12px + env(safe-area-inset-bottom)); display: flex; gap: 10px;
  ion-input { flex: 1; background: #1c1c1c; border-radius: 24px; --padding-start: 16px; --color: #f4f4f5; }
  button { background: #dc2626; border: none; width: 44px; height: 44px; border-radius: 50%; display: flex; align-items: center; justify-content: center;
    ion-icon { color: #fff; font-size: 20px; } &:disabled { opacity: 0.4; } }
}
  `],
  standalone: true,
  imports: [IonContent, IonHeader, IonToolbar, IonTitle, IonInput, IonIcon, IonBackButton, IonButtons, FormsModule, CommonModule],
})
export class ChatPage implements OnInit, OnDestroy {
  messages: ChatMessage[] = [];
  newMessage = '';

  constructor(private chatService: ChatService, private auth: AuthService) {
    addIcons({ sendOutline, headsetOutline });
  }

  async ngOnInit() {
    const user = this.auth.currentUser();
    if (!user) return;
    this.messages = await this.chatService.getMessages(user.id);
    this.chatService.subscribeToMessages(user.id, (msg) => this.messages.push(msg));
  }

  async send() {
    if (!this.newMessage.trim()) return;
    const user = this.auth.currentUser();
    if (!user) return;
    await this.chatService.sendMessage(user.id, this.newMessage);
    this.newMessage = '';
  }

  ngOnDestroy() { this.chatService.unsubscribe(); }
}
