# AGENTS.md

This file contains guidelines for agentic coding agents working in this Angular + Convex + betterAuth codebase.

## Build & Test Commands

- `ng build` - Production build (outputs to `dist/`)
- `ng serve` or `npm start` - Start development server at http://localhost:4200
- `ng test` or `npm test` - Run all tests with Karma + Jasmine
- `ng test --include='**/filename.spec.ts'` - Run specific test file in watch mode
- `ng test --include='**/filename.spec.ts' --watch=false` - Run single test once

## Code Style & Formatting

- **Quotes**: Single quotes for all TypeScript strings
- **Indentation**: 2 spaces (enforced by .editorconfig)
- **Line width**: 100 characters max (Prettier configured)
- **Trailing whitespace**: Trimmed, files must end with newline
- **Styling**: Use SCSS for component styles (schematics default)
- **HTML parsing**: Use Angular parser for HTML files (Prettier override)

## Import Organization

Order imports from top to bottom:
1. Third-party imports (`@angular/core`, `@convex-dev/better-auth`, `rxjs`, etc.)
2. Internal imports (`../../services/auth.service`, etc.)
3. Type imports use `type` keyword: `import { type AuthClient } from '...'`
4. API types: `import { api } from '../../convex/_generated/api'`
5. Keep imports alphabetically sorted within each group

## Component Patterns

- **Standalone**: Always use standalone components (default in Angular 20+)
- **ChangeDetection**: Use `ChangeDetectionStrategy.OnPush` for all components
- **Imports Array**: Declare all imports (CommonModule, ReactiveFormsModule, RouterModule, etc.)
- **Dependency Injection**: Use `inject()` function instead of constructor injection where possible
- **State Management**: Use `signal()` for reactive state, `computed()` for derived values
- **Templates**: Use `@if` blocks for conditionals, not `*ngIf`
- **Forms**: Use ReactiveFormsModule with `FormBuilder`, type with `FormGroup`
- **Public Signals**: Expose computed signals as public readonly, not private signals
- **Signal Accessors**: Use `.set()` and `.get()` methods for signal operations

Example:
```typescript
export class SigninComponent {
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);
  private fb = inject(FormBuilder);
}
```

## Service Patterns

- **Singleton**: Use `@Injectable({ providedIn: 'root' })` for all services
- **Dependencies**: Declare as private fields using `inject()`
- **State**: Use `signal()` for loading/error states, `computed()` for derived state
- **Convex Integration**: Use `convexLiveResource()` for reactive queries with auth checks
- **Error Handling**: try/catch/finally pattern with user-friendly messages
- **Public API**: Expose readonly computed signals, not private writable signals
- **Async Methods**: Set loading signal to true at start, false in finally block

Example:
```typescript
@Injectable({ providedIn: 'root' })
export class AuthService {
  readonly isLoading = signal(false);
  readonly error = signal<string | null>(null);
  readonly isAuthenticated = computed(() => this.auth.isAuthenticated());
  private authClient = inject(AUTH_CLIENT);
}
```

## Naming Conventions

- **Files**: kebab-case (`signin.component.ts`, `auth.service.ts`)
- **Classes**: PascalCase (`SigninComponent`, `AuthService`)
- **Methods/Functions**: camelCase (`signIn()`, `isLoading`)
- **Variables/Properties**: camelCase (`errorMessage`, `user`)
- **Signals**: Use `signal()` prefix for writable, `computed()` for readonly
- **Constants**: UPPER_SNAKE_CASE for module-level constants (e.g., `MAX_LENGTH = 1000`)
- **HTML Selectors**: kebab-case with `app-` prefix (`app-signin`, `app-root`)
- **Interfaces/Types**: PascalCase (`AuthClient`, `ConvexAngularClient`)

## Error Handling

- **Async Operations**: Always wrap in try/catch/finally blocks
- **Loading State**: Set loading signal to `true` before try block, `false` in finally block
- **Error Signal**: Clear error signal at operation start, set in catch block
- **User Messages**: Use user-friendly messages: `this.error.set(e?.message ?? 'Operation failed')`
- **Service Re-throw**: Re-throw errors in service methods for component-level handling
- **Convex Errors**: Throw descriptive errors with specific validation messages
- **Component Errors**: Display error signal values in templates with conditional rendering

## Testing Guidelines

- **Test Setup**: Use `TestBed.configureTestingModule()` with component in `imports` array
- **Change Detection**: Provide `provideZonelessChangeDetection()` for zoneless Angular
- **Test Structure**: Use `describe('ClassName', () => {})` pattern
- **Test Cases**: Use `it('should do something', () => {})` for individual tests
- **Setup**: Use `beforeEach(async () => {})` for test initialization and `compileComponents()`
- **Coverage**: Test both happy path and error cases
- **Signal Testing**: Verify signal state changes where applicable
- **Auth Testing**: Mock `AuthService` and auth-related dependencies

Example:
```typescript
describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideZonelessChangeDetection()]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
```

## Convex Backend Patterns

- **Schema Definition**: Use `defineSchema()` with `defineTable()` for each table
- **Validation**: Use `v.string()`, `v.number()`, `v.id('tableName')`, `v.union()` for field types
- **Indexes**: Add `.index('by_field', ['field'])` for frequently queried fields
- **Search Indexes**: Use `.searchIndex('name', { searchField: 'content' })` for full-text search
- **Named Exports**: Use named exports from `_generated/server` (`query`, `mutation`)
- **Auth Checks**: Always call `await ctx.auth.getUserIdentity()` first in mutations/queries
- **BetterAuth Integration**: Use `betterAuthComponent.getAuthUserId(ctx)` to get user IDs
- **Return Types**: Explicitly define with `v.array(v.object({...}))` or `v.null()`
- **Data Relations**: Use `Promise.all()` for fetching related data efficiently

Example:
```typescript
export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const userMetadata = await betterAuthComponent.getAuthUser(ctx);
    if (!userMetadata) return null;
    const user = await ctx.db.get(userMetadata.userId as Id<'users'>);
    return { ...user, ...userMetadata };
  },
});
```

## TypeScript Configuration

- **Strict Mode**: Enabled in tsconfig.json
- **Angular Compiler**: Strict templates, injection parameters, input access modifiers enabled
- **Target**: ES2022 with preserve modules
- **Type Safety**: Always type function arguments and return values
- **No Implicit Overrides**: Required for method overrides
- **Decorators**: Enabled for Angular decorators
- **Isolated Modules**: Enabled for better tree-shaking

## Architecture Notes

- **Frontend**: Angular 20.3.2 with standalone components and signals
- **Backend**: Convex for real-time data and authentication
- **Auth**: betterAuth with @razakAlpha/convngx library for simplified integration
- **Routing**: Lazy-loaded components using route config
- **State**: Angular signals for reactive state management
- **Forms**: Reactive forms with FormBuilder and validators
- **API Type Safety**: Use generated Convex API types from `convex/_generated/api`

## Key Libraries

- `@angular/core`, `@angular/common`, `@angular/router` - Angular framework
- `@razakalpha/convngx` - Angular-Convex integration
- `@convex-dev/better-auth` - Authentication with Convex
- `better-auth` - Auth client library
- `convex` - Convex backend client
- `rxjs` - Reactive programming

## Component Generation

Use Angular CLI to generate new components:
```bash
ng generate component component-name
```

This automatically creates the component with SCSS styling and standalone configuration.
