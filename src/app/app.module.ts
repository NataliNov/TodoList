import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { ItemComponent } from './component/item/item.component';
import { TodoListComponent } from './component/todoList/todoList.component'
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { BackendInterceptor } from './intercepter';
import { FocusDirective } from './directive/focus.directive';

@NgModule({
    declarations: [
        AppComponent,
        TodoListComponent,
        ItemComponent,
        FocusDirective
    ],
    imports: [
        BrowserModule,
        ReactiveFormsModule,
        FormsModule,
        HttpClientModule,
    ],
    providers: [{
        provide: HTTP_INTERCEPTORS,
        useClass: BackendInterceptor,
        multi: true,
    }],
    bootstrap: [AppComponent]
})
export class AppModule { }
