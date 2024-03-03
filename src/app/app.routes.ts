import { Routes } from '@angular/router';
import { EditorComponent } from './components/editor/editor.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { GameComponent } from './components/game/game.component';

export const routes: Routes = [
    { path: '', component: WelcomeComponent },
    { path: 'editor', component: EditorComponent},
    { path: 'game', component: GameComponent}
];
