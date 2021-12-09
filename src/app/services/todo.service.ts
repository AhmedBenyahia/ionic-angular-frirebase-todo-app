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
        // initialize the collection working on it
        this.todosCollection = db.collection<Todo>('todos');
        // get todos list from firebase data base
        this.todos = this.todosCollection.snapshotChanges().pipe(
            map((actions) => {
                // get all current user todos data
                return actions.filter(todo => todo.payload.doc.data().userId === _authService.currentUserId).map((todo) => {
                    const data = todo.payload.doc.data();
                    const id = todo.payload.doc.id;
                    return {id, ...data};
                });
            })
        );
    }
    // return todos list
    getTodos(): Observable<Todo[]> {
        return this.todos;
    }
    // return a specific data with the giving id
    getTodo(id: string): Observable<Todo> {
        return this.todosCollection.doc<Todo>(id).valueChanges();
    }
    // update specific data with the giving id
    updateTodo(todo: Todo, id: string): Promise<any> {
        return this.todosCollection.doc(id).update(todo);
    }

    // add new data
    async addTodo(todo: Todo): Promise<any> {
        todo.userId = this._authService.currentUserId;
        return this.todosCollection.add(todo);
    }

    // remove specific data with the giving id
    removeTodo(id: string): Promise<any> {
        return this.todosCollection.doc(id).delete();
    }
}
