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

## Registrating Use Cases

## Registrating Middleware
