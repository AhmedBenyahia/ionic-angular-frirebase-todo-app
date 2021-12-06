import {Injectable} from '@angular/core';
import {
    AngularFirestore,
    AngularFirestoreCollection,
} from '@angular/fire/firestore';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

export interface Todo {
    id?: string;
    task: string;
    priority: number;
    createdAt: number;
}

@Injectable({
    providedIn: 'root',
})
export class TodoService {
    private todosCollection: AngularFirestoreCollection<Todo>;

    private todos: Observable<Todo[]>;

    constructor(db: AngularFirestore) {
        this.todosCollection = db.collection<Todo>('todos');

        this.todos = this.todosCollection.snapshotChanges().pipe(
            map((actions) => {
                return actions.map((todo) => {
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

    addTodo(todo: Todo): Promise<any> {
        return this.todosCollection.add(todo);
    }

    removeTodo(id: string): Promise<any> {
        return this.todosCollection.doc(id).delete();
    }
}
