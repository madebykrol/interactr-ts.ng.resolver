# Interactr.ng.resolver

Interactr Resolver using Angulars Dependency Injection Container.

# Getting started
First thing you need to do is to register the interactor as a provider. 
Then you need to register the use cases and middleware as Injection Tokens.

## Create injection Tokens
```Typescript
export const SEARCH_USECASE
  = new InjectionToken<Interactor<SearchUseCase, SearchOutputPort>>('search');
```

## app.module provider registration
```Typescript

export function resolverFactoryFunction () {

  const resolver = new NgInteractorResolver(ServiceLocator.injector);
  
  resolver.registerInjectionToken(SEARCH_USECASE, SearchtUseCase.name);

  return resolver;
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
  ],
  providers: [
    {
      provide: Hub,
      useClass: InteractorHub
    },
    {
      provide: Resolver,
      useFactory: resolverFactoryFunction,
    },
    {
      provide: SEARCH_USECASE,
      useClass: SearchInteractor
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(private injector: Injector) {
    ServiceLocator.injector = this.injector;
  }
}
```
One thing to note here especially is how we inject the "Injector" into our Resolver.
To make this work we create a ServiceLocator with a static member that holds a reference to the Injector instance.
In our resolverFactoryFunction we then pass that reference as parameter to the resolver.

> There are possibly better ways of doing this. If you have any good ideas please let me know through a PR <3


# Registration in detail
As Angulars DIC uses the concept of 'Injection Tokens' to make a lot of the magic of Dependency Injection work when transpiled to javascript we need to create injection tokens
and then store them in a clever way so we can reference them when we want to resolve interactors and middleware.


## Registrating Use Cases
First we need to create a Injection Token
```Typescript
const SEARCH_USECASE
  = new InjectionToken<Interactor<SearchUseCase, SearchOutputPort>>('search');
```
Then we need to Register the InjectionToken with our Resolver, the last parameter is needed to for the resolver to figure out which injection token to use for the given usecase.
```Typescript
resolver.registerInjectionToken(SEARCH_USECASE, SearchtUseCase.name);
```

And finally, we need to register a provider for our interactor with the Angular Injector.
```Typescript
{
    provide: SEARCH_USECASE,
    useClass: SearchInteractor
},
```

## Registrating Middleware
Token:
```Typescript
const SEARCH_PIPELINE =
  new InjectionToken<Middleware<SearchUseCase, SearchOutputPort>>('searchpipeline');
```
Register
```Typescript
resolver.registerMiddlewareInjectionToken(SEARCH_PIPELINE, SearchUseCase.name);
```

Providers: (Multiple)
```Typescript
{
    provide: SEARCH_PIPELINE,
    useClass: Middleware1,
    multi: true
},
{
    provide: SEARCH_PIPELINE,
    useClass: Middleware2,
    multi: true
},
```

### Global Middleware
The Injection Token for the blobal pipeline for global middlewares are different from interacts and a use case pipeline in that it they won't be resolved by the resolver using a use case as key
For that reason all global middleware are registered to the same token so we only need to register one.

Token:
```Typescript
const GLOBAL_PIPELINE
  = new InjectionToken<GlobalMiddleware>('globalpipeline');
```
Register
```Typescript
 resolver.registerGlobalMiddlewareInjectionToken(GLOBAL_PIPELINE);
```

Providers: (multiple)
```Typescript
{
    provide: GLOBAL_PIPELINE,
    useClass: ExceptionMiddleware,
    multi: true
},
{
    provide: GLOBAL_PIPELINE,
    useClass: LogMiddleware,
    multi: true
}
```