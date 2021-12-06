import {Injectable} from '@angular/core';
import {
    AngularFirestore,
    AngularFirestoreCollection,
} from '@angular/fire/firestore';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {AuthService} from './auth.service';

export interface Todo {
    id?: string;
    task: string;
    priority: number;
    done?: boolean;
    createdAt: number;
    userId?: string;
}

@Injectable({
    providedIn: 'root',
})
export class TodoService {
    private todosCollection: AngularFirestoreCollection<Todo>;

    private todos: Observable<Todo[]>;

    constructor(db: AngularFirestore, private _authService: AuthService) {
        this.todosCollection = db.collection<Todo>('todos');

        this.todos = this.todosCollection.snapshotChanges().pipe(
            map((actions) => {
                return actions.filter(todo => todo.payload.doc.data().userId === _authService.currentUserId).map((todo) => {
                    const data = todo.payload.doc.data();
                    const id = todo.payload.doc.id;
                    return {id, ...data};
                });
            })
        );
    }

    getTodos(): Observable<Todo[]> {
        return this.todos;
    }

    getTodo(id: string): Observable<Todo> {
        return this.todosCollection.doc<Todo>(id).valueChanges();
    }

    updateTodo(todo: Todo, id: string): Promise<any> {
        return this.todosCollection.doc(id).update(todo);
    }

    async addTodo(todo: Todo): Promise<any> {
        todo.userId = this._authService.currentUserId;
        return this.todosCollection.add(todo);
    }

    removeTodo(id: string): Promise<any> {
        return this.todosCollection.doc(id).delete();
    }
}
