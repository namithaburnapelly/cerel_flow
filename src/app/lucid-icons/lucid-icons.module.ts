import { NgModule } from '@angular/core';
import {
  LucideAngularModule,
  File,
  Home,
  Menu,
  UserCheck,
  Eye,
  EyeOff,
  Sun,
  Moon,
  UserRound,
  AtSign,
  LockKeyhole,
  LogOut,
  Settings2,
  Mail,
} from 'lucide-angular';

@NgModule({
  imports: [
    LucideAngularModule.pick({
      File,
      Home,
      Menu,
      UserCheck,
      Eye,
      EyeOff,
      Sun,
      Moon,
      UserRound,
      AtSign,
      LockKeyhole,
      LogOut,
      Settings2,
      Mail,
    }),
  ],
  exports: [LucideAngularModule],
})
export class LucidIconsModule {}
