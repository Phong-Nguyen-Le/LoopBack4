import {get} from '@loopback/rest';

export class HelloController {
  @get('/hello')
  hello(): string {
    return 'Hello world!';
  }


  @get('/hello123')
  hello123(): string {
    return 'Hello world 456456456!';
  }
}
