import { InjectionToken, Injector } from '@angular/core';
import { Resolver } from 'interactr/resolver';
import { UseCase } from 'interactr/usecase';
import { Interactor } from 'interactr/Interactor';
import { Middleware, GlobalMiddleware } from 'interactr/middleware';

export class NgResolver implements Resolver {

  private injectionTokens: Map<string, Object>;

  constructor(private injector: Injector) {
    this.injectionTokens = new Map();
  }

  resolveMiddleware<TUseCase extends UseCase<TOutputPort>, TOutputPort>(usecase: TUseCase): Array<Middleware<TUseCase, TOutputPort>> {
    return this.resolveMultiple<Middleware<TUseCase, TOutputPort>>(this.getUseCaseMiddlewareToken(usecase.constructor.name));
  }

  resolveInteractor<TUseCase extends UseCase<TOutputPort>, TOutputPort>(usecase: TUseCase): Interactor<TUseCase, TOutputPort> {
    return this.injector.get<Interactor<TUseCase, TOutputPort>>(this.getInjectionToken(usecase.constructor.name));
  }

  resolveGlobalMiddleware(): Array<GlobalMiddleware> {
    return this.resolveMultiple<GlobalMiddleware>(this.getGlobalMiddlewareToken());
  }

  registerInjectionToken<TUseCase, TOutputPort>(token: InjectionToken<Interactor<TUseCase, TOutputPort>>, usecaseTypeName: string): void {
    this.injectionTokens.set(usecaseTypeName, token);
  }

  registerMiddlewareInjectionToken<TUseCase, TOutputPort>(token: InjectionToken<Middleware<TUseCase, TOutputPort>>,
    usecaseTypeName: string): void {
    this.injectionTokens.set('middleware' + usecaseTypeName, token);
  }

  registerGlobalMiddlewareInjectionToken(token: InjectionToken<GlobalMiddleware>): void {
    this.injectionTokens.set('global-middleware', token);
  }

  private resolveMultiple<TProvider>(token: any): Array < TProvider > {
    try {
      const middleware =
        this.injector.get<TProvider>(token);

      if (middleware instanceof Array) {
        return <Array<TProvider>><any>middleware;
      }

      const pipeline = new Array<TProvider>();
      pipeline.push(middleware);

      return pipeline;
    } catch (e) {

    }

    return new Array<TProvider>();
  }

  private getInjectionToken<TUseCase, TOutputPort>(name: string): InjectionToken<Interactor<TUseCase, TOutputPort>> {
    return <InjectionToken<Interactor<TUseCase, TOutputPort>>>this.injectionTokens.get(name);
  }

  private getGlobalMiddlewareToken(): InjectionToken<GlobalMiddleware> {
    return <InjectionToken<GlobalMiddleware>>this.injectionTokens.get('global-middleware');
  }

  private getUseCaseMiddlewareToken<TUseCase, TOutputPort>(name: string): InjectionToken<Middleware<TUseCase, TOutputPort>> {
    return <InjectionToken<Middleware<TUseCase, TOutputPort>>>this.injectionTokens.get('middleware' + name);
  }
}
