import {Component, OnInit} from '@angular/core';
import {Todo, TodoService} from '../services/todo.service';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../services/auth.service';


@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
    todos: Todo[];

    constructor(private todoService: TodoService, private route: ActivatedRoute,
                private _authService: AuthService, private router: Router) {
    }

    ngOnInit(): void {
        // if user not signed in redirect to login page
        if (!this._authService.currentUser) {
            this.router.navigate(['/login']);
        }
        // call getTodos function from todos service for getting all todos data
        this.todoService
            .getTodos()
            .subscribe(res => {
                this.todos = res.filter(c => c.done === this.route.snapshot.data.done);
            });
    }
    // call remove function from todos service
    remove(item: Todo): void {
        this.todoService
            .removeTodo(item.id);
    }

}
