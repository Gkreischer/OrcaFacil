import { Injectable } from '@angular/core';
import { HttpClient} from  '@angular/common/http';

@Injectable()
export class CrudService {

  constructor(public http: HttpClient) { }

}
