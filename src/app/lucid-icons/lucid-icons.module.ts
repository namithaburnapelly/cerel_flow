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
    }),
  ],
  exports: [LucideAngularModule],
})
export class LucidIconsModule {}
