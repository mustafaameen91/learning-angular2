import { Injectable } from 'angular2/core';
import { Http, Response } from 'angular2/http';
import { Observable } from 'rxjs/Observable';
import { TaskModel } from '../models/models';

@Injectable()
export default class TaskService {
    tasks: Observable<Array<TaskModel>>;
    public taskStore: Array<TaskModel> = [];
    private tasksObserver: any;

    constructor(public http: Http) {
        this.tasks = new Observable(observer => this.tasksObserver = observer);
        this.loadTasks();
    }

    loadTasks(): void {
        this.http.get('/services/tasks.json')
            .map(response => response.json())
            .map(stream => stream.map(x => new TaskModel(x.name, x.deadline, x.timeRequired)))
            .subscribe(
                taskModels => {
                    this.taskStore = taskModels;
                    this.tasksObserver.next(this.taskStore);
                },
                error => console.log(error)
            );
    }

    addTask(taskModel: TaskModel): void {
        this.taskStore.push(taskModel);
        this.tasksObserver.next(this.taskStore);
    }
}
