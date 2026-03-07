import { Question } from "../../types"


export const webAllQuestions: Question[] = [
  { id: 'web_1', title: 'Explain the Virtual DOM and Reconciliation', difficulty: 'Concept', link: 'https://legacy.reactjs.org/docs/reconciliation.html' },
  { id: 'web_2', title: 'Event Loop & Microtasks Queue', difficulty: 'Concept', link: 'https://developer.mozilla.org/en-US/docs/Web/API/HTML_DOM_API/Microtask_guide' },
  { id: 'web_3', title: 'Explain Closures with a practical example', difficulty: 'Medium', link: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures' },
  { id: 'web_4', title: 'CSS Grid vs Flexbox', difficulty: 'Easy', link: 'https://css-tricks.com/css-grid-replace-flexbox/' },
  { id: 'web_5', title: 'REST vs GraphQL vs gRPC', difficulty: 'Medium', link: 'https://learn.microsoft.com/en-us/aspnet/core/grpc/comparison' },
  { id: 'web_6', title: 'How does HTTPS (SSL/TLS) work?', difficulty: 'Hard', link: 'https://howhttps.works/' },
  { id: 'web_7', title: 'Implement Debounce and Throttle', difficulty: 'Medium', link: 'https://css-tricks.com/debouncing-throttling-explained-examples/' },
  { id: 'web_8', title: 'Critical Rendering Path Optimization', difficulty: 'Hard', link: 'https://web.dev/articles/critical-rendering-path' },

  { id: 'web_9', title: 'Explain the React Component Lifecycle (Class vs Hooks)', difficulty: 'Concept', link: 'https://react.dev/learn/lifecycle-of-reactive-effects' },
  { id: 'web_10', title: 'What is Hoisting in JavaScript?', difficulty: 'Easy', link: 'https://developer.mozilla.org/en-US/docs/Glossary/Hoisting' },
  { id: 'web_11', title: 'Explain Prototypal Inheritance in JavaScript', difficulty: 'Medium', link: 'https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/Object_prototypes' },
  { id: 'web_12', title: 'What is the difference between var, let, and const?', difficulty: 'Easy', link: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/var' },
  { id: 'web_13', title: 'Explain Event Delegation in JavaScript', difficulty: 'Medium', link: 'https://javascript.info/event-delegation' },
  { id: 'web_14', title: 'What are Pure Functions and Side Effects?', difficulty: 'Concept', link: 'https://developer.mozilla.org/en-US/docs/Glossary/Pure_function' },
  { id: 'web_15', title: 'Explain Immutability and why it matters in React', difficulty: 'Concept', link: 'https://react.dev/learn/updating-objects-in-state' },
  { id: 'web_16', title: 'Explain Memoization and useMemo/useCallback in React', difficulty: 'Medium', link: 'https://react.dev/reference/react/useMemo' },
  { id: 'web_17', title: 'Difference between == and === in JavaScript', difficulty: 'Easy', link: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Equality_comparisons_and_sameness' },
  { id: 'web_18', title: 'Explain the this keyword in JavaScript', difficulty: 'Medium', link: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this' },
  { id: 'web_19', title: 'What are Arrow Functions and how are they different?', difficulty: 'Easy', link: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions' },
  { id: 'web_20', title: 'Explain Promise, async/await with an example', difficulty: 'Medium', link: 'https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous/Promises' },

  { id: 'web_21', title: 'Explain CORS and how to handle it', difficulty: 'Medium', link: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS' },
  { id: 'web_22', title: 'What are HTTP methods and status codes?', difficulty: 'Easy', link: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods' },
  { id: 'web_23', title: 'Explain HTTP vs WebSocket', difficulty: 'Medium', link: 'https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API' },
  { id: 'web_24', title: 'Explain Same-Origin Policy', difficulty: 'Concept', link: 'https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy' },
  { id: 'web_25', title: 'What is XSS and how to prevent it?', difficulty: 'Hard', link: 'https://owasp.org/www-community/attacks/xss/' },
  { id: 'web_26', title: 'What is CSRF and how to prevent it?', difficulty: 'Hard', link: 'https://owasp.org/www-community/attacks/csrf' },
  { id: 'web_27', title: 'Explain Content Security Policy (CSP)', difficulty: 'Hard', link: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP' },
  { id: 'web_28', title: 'Explain JWT (JSON Web Token) Authentication', difficulty: 'Medium', link: 'https://jwt.io/introduction' },
  { id: 'web_29', title: 'What is OAuth 2.0 and where is it used?', difficulty: 'Hard', link: 'https://oauth.net/2/' },
  { id: 'web_30', title: 'Explain SameSite cookies and secure cookies', difficulty: 'Medium', link: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie/SameSite' },

  { id: 'web_31', title: 'Explain the Box Model in CSS', difficulty: 'Easy', link: 'https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/The_box_model' },
  { id: 'web_32', title: 'Explain CSS Specificity and how conflicts are resolved', difficulty: 'Medium', link: 'https://developer.mozilla.org/en-US/docs/Web/CSS/Specificity' },
  { id: 'web_33', title: 'Positioning in CSS: static, relative, absolute, fixed, sticky', difficulty: 'Easy', link: 'https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Positioning' },
  { id: 'web_34', title: 'Responsive Design: Mobile-first vs Desktop-first', difficulty: 'Concept', link: 'https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Responsive_Design' },
  { id: 'web_35', title: 'Explain Media Queries with examples', difficulty: 'Easy', link: 'https://developer.mozilla.org/en-US/docs/Web/CSS/Media_Queries/Using_media_queries' },
  { id: 'web_36', title: 'Explain CSS Preprocessors (Sass/Less) and why they are used', difficulty: 'Medium', link: 'https://sass-lang.com/guide/' },
  { id: 'web_37', title: 'Explain BEM naming convention in CSS', difficulty: 'Easy', link: 'https://getbem.com/introduction/' },
  { id: 'web_38', title: 'Explain CSS Cascade and Inheritance', difficulty: 'Concept', link: 'https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/Cascade_and_inheritance' },
  { id: 'web_39', title: 'What are CSS Transitions and Animations?', difficulty: 'Easy', link: 'https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Transitions/Using_CSS_transitions' },
  { id: 'web_40', title: 'Explain Layout Shifts and Cumulative Layout Shift (CLS)', difficulty: 'Medium', link: 'https://web.dev/articles/cls' },

  { id: 'web_41', title: 'Explain Tree Shaking and Dead Code Elimination', difficulty: 'Medium', link: 'https://webpack.js.org/guides/tree-shaking/' },
  { id: 'web_42', title: 'What is Code Splitting and Lazy Loading in React?', difficulty: 'Medium', link: 'https://react.dev/reference/react/lazy' },
  { id: 'web_43', title: 'Explain Bundlers (Webpack, Vite, Parcel)', difficulty: 'Concept', link: 'https://vitejs.dev/guide/why.html' },
  { id: 'web_44', title: 'Explain ES Modules vs CommonJS', difficulty: 'Medium', link: 'https://nodejs.org/api/modules.html#modules-commonjs-modules' },
  { id: 'web_45', title: 'Explain Browser Caching and Cache-Control headers', difficulty: 'Medium', link: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Caching' },
  { id: 'web_46', title: 'What is Service Worker and how does it enable PWAs?', difficulty: 'Hard', link: 'https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API' },
  { id: 'web_47', title: 'Explain First Contentful Paint (FCP), LCP, TTI', difficulty: 'Hard', link: 'https://web.dev/articles/user-centric-performance-metrics' },
  { id: 'web_48', title: 'Explain HTTP/1.1 vs HTTP/2 vs HTTP/3', difficulty: 'Hard', link: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Evolution_of_HTTP' },
  { id: 'web_49', title: 'Explain Image Optimization strategies on the web', difficulty: 'Medium', link: 'https://web.dev/learn/performance/optimizing-images' },
  { id: 'web_50', title: 'Explain DNS Lookup and how it affects performance', difficulty: 'Concept', link: 'https://developers.google.com/speed/public-dns/docs/using' },

  { id: 'web_51', title: 'What is a Single Page Application (SPA)?', difficulty: 'Concept', link: 'https://developer.mozilla.org/en-US/docs/Glossary/SPA' },
  { id: 'web_52', title: 'SPA vs MPA vs SSR vs SSG', difficulty: 'Hard', link: 'https://nextjs.org/learn/basics/data-fetching/ssr-ssg' },
  { id: 'web_53', title: 'Explain hydration in frameworks like Next.js', difficulty: 'Hard', link: 'https://nextjs.org/docs/app/building-your-application/rendering/client-components' },
  { id: 'web_54', title: 'Explain React Context API with an example', difficulty: 'Medium', link: 'https://react.dev/learn/passing-data-deeply-with-context' },
  { id: 'web_55', title: 'What are Custom Hooks in React and when to use them?', difficulty: 'Medium', link: 'https://react.dev/learn/reusing-logic-with-custom-hooks' },
  { id: 'web_56', title: 'Explain Redux: Actions, Reducers, Store', difficulty: 'Medium', link: 'https://redux.js.org/tutorials/essentials/part-1-overview-concepts' },
  { id: 'web_57', title: 'Explain React Query / Data Fetching patterns', difficulty: 'Medium', link: 'https://tanstack.com/query/latest/docs/react/overview' },
  { id: 'web_58', title: 'Controlled vs Uncontrolled Components in React', difficulty: 'Easy', link: 'https://react.dev/learn/sharing-state-between-components#controlled-and-uncontrolled-components' },
  { id: 'web_59', title: 'Explain Refs and useRef in React', difficulty: 'Medium', link: 'https://react.dev/reference/react/useRef' },
  { id: 'web_60', title: 'Explain Error Boundaries in React', difficulty: 'Medium', link: 'https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary' },

  { id: 'web_61', title: 'Explain SOLID principles in the context of JavaScript/TypeScript', difficulty: 'Hard', link: 'https://www.freecodecamp.org/news/solid-principles-explained-in-plain-english/' },
  { id: 'web_62', title: 'What is Functional Programming and its core concepts?', difficulty: 'Concept', link: 'https://developer.mozilla.org/en-US/docs/Glossary/Functional_programming' },
  { id: 'web_63', title: 'Explain Currying and Partial Application', difficulty: 'Medium', link: 'https://javascript.info/currying-partials' },
  { id: 'web_64', title: 'Explain Composition vs Inheritance', difficulty: 'Concept', link: 'https://react.dev/learn/passing-props-to-a-component#children-are-an-exit-hatch' },
  { id: 'web_65', title: 'Explain Design Patterns commonly used in front-end (Observer, Singleton, etc.)', difficulty: 'Hard', link: 'https://refactoring.guru/design-patterns' },
  { id: 'web_66', title: 'Explain MVC, MVVM, and Flux architecture', difficulty: 'Hard', link: 'https://facebook.github.io/flux/docs/in-depth-overview/' },
  { id: 'web_67', title: 'Explain Inversion of Control and Dependency Injection', difficulty: 'Hard', link: 'https://martinfowler.com/articles/injection.html' },
  { id: 'web_68', title: 'Explain Big O Notation with simple examples relevant to UI', difficulty: 'Medium', link: 'https://www.interviewcake.com/article/python/big-o-notation-time-and-space-complexity' },
  { id: 'web_69', title: 'Explain Debouncing vs Throttling use cases in UI', difficulty: 'Medium', link: 'https://web.dev/articles/rail' },
  { id: 'web_70', title: 'Explain how Virtualization (e.g., react-window) boosts performance', difficulty: 'Medium', link: 'https://react-window.vercel.app/#/examples/list/fixed-size' },

  { id: 'web_71', title: 'What is Accessibility (a11y) and why does it matter?', difficulty: 'Concept', link: 'https://developer.mozilla.org/en-US/docs/Learn/Accessibility/What_is_accessibility' },
  { id: 'web_72', title: 'Explain ARIA roles and attributes', difficulty: 'Medium', link: 'https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles' },
  { id: 'web_73', title: 'Keyboard Navigation and focus management in web apps', difficulty: 'Medium', link: 'https://developer.mozilla.org/en-US/docs/Web/Accessibility/Understanding_WCAG/Keyboard' },
  { id: 'web_74', title: 'Color contrast and accessible design basics', difficulty: 'Easy', link: 'https://web.dev/articles/color-and-contrast-accessibility' },
  { id: 'web_75', title: 'Semantic HTML: why using correct tags matters', difficulty: 'Easy', link: 'https://developer.mozilla.org/en-US/docs/Glossary/Semantics#semantics_in_html' },
  { id: 'web_76', title: 'Explain Lighthouse and how to interpret its scores', difficulty: 'Medium', link: 'https://developer.chrome.com/docs/lighthouse/overview/' },
  { id: 'web_77', title: 'Explain Internationalization (i18n) and Localization (l10n)', difficulty: 'Medium', link: 'https://developer.mozilla.org/en-US/docs/Mozilla/Implementing_a_locale' },
  { id: 'web_78', title: 'Explain Client-side vs Server-side form validation', difficulty: 'Easy', link: 'https://developer.mozilla.org/en-US/docs/Learn/Forms/Form_validation' },
  { id: 'web_79', title: 'Explain Web Storage APIs: localStorage, sessionStorage, cookies', difficulty: 'Easy', link: 'https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API' },
  { id: 'web_80', title: 'Explain IndexedDB and when to use it', difficulty: 'Medium', link: 'https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API' },

  { id: 'web_81', title: 'Explain SSR Caching and Revalidation strategies', difficulty: 'Hard', link: 'https://nextjs.org/docs/app/building-your-application/caching' },
  { id: 'web_82', title: 'Explain API Rate Limiting and strategies to handle it on frontend', difficulty: 'Medium', link: 'https://cloudflare.com/learning/bots/what-is-rate-limiting/' },
  { id: 'web_83', title: 'Explain Backpressure and handling fast producers in the browser', difficulty: 'Hard', link: 'https://developer.mozilla.org/en-US/docs/Web/API/Streams_API/Concepts' },
  { id: 'web_84', title: 'Explain Web Workers and when to use them', difficulty: 'Medium', link: 'https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers' },
  { id: 'web_85', title: 'Explain IntersectionObserver and practical use cases (lazy loading, infinite scroll)', difficulty: 'Medium', link: 'https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API' },
  { id: 'web_86', title: 'Explain Drag and Drop APIs in the browser', difficulty: 'Medium', link: 'https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API' },
  { id: 'web_87', title: 'Explain File uploads: multipart/form-data, progress tracking', difficulty: 'Medium', link: 'https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/Using_XMLHttpRequest#monitoring_progress' },
  { id: 'web_88', title: 'Explain WebSockets vs SSE and polling', difficulty: 'Medium', link: 'https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API' },
  { id: 'web_89', title: 'Explain Optimistic UI updates and error handling', difficulty: 'Medium', link: 'https://tanstack.com/query/latest/docs/react/guides/optimistic-updates' },
  { id: 'web_90', title: 'Explain Infinite Scroll vs Pagination trade-offs', difficulty: 'Concept', link: 'https://web.dev/articles/infinite-scroll-without-jank' },

  { id: 'web_91', title: 'Explain Monorepos and tools like Turborepo/Nx', difficulty: 'Hard', link: 'https://turbo.build/repo/docs' },
  { id: 'web_92', title: 'Explain TypeScript basics: types, interfaces, generics', difficulty: 'Medium', link: 'https://www.typescriptlang.org/docs/handbook/intro.html' },
  { id: 'web_93', title: 'Explain Type Narrowing and Unions in TypeScript', difficulty: 'Medium', link: 'https://www.typescriptlang.org/docs/handbook/2/narrowing.html' },
  { id: 'web_94', title: 'Explain Error Handling strategies in large React apps', difficulty: 'Hard', link: 'https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary' },
  { id: 'web_95', title: 'Explain Logging and Monitoring for frontend (Sentry, etc.)', difficulty: 'Medium', link: 'https://docs.sentry.io/platforms/javascript/' },
  { id: 'web_96', title: 'Explain Feature Flags and A/B testing in frontend', difficulty: 'Medium', link: 'https://docs.launchdarkly.com/home' },
  { id: 'web_97', title: 'Explain Micro Frontends: pros and cons', difficulty: 'Hard', link: 'https://martinfowler.com/articles/micro-frontends.html' },
  { id: 'web_98', title: 'Explain CI/CD basics for frontend projects', difficulty: 'Concept', link: 'https://docs.github.com/en/actions/writing-workflows/about-continuous-integration' },
  { id: 'web_99', title: 'Explain Environment variables and config for different stages (dev/stage/prod)', difficulty: 'Medium', link: 'https://12factor.net/config' },
  { id: 'web_100', title: 'How would you design a scalable front-end architecture for a large app?', difficulty: 'Hard', link: 'https://developer.mozilla.org/en-US/docs/Learn/Tools_and_testing/Client-side_JavaScript_frameworks' },
];

// helper to slice by numeric part of id
const byRange = (from: number, to: number): Question[] =>
  webAllQuestions.filter(q => {
    const n = Number(q.id.split('_')[1]);
    return n >= from && n <= to;
  });

export const webFundamentals = byRange(1, 40);
export const webAdvancedFrontend = byRange(41, 80);
export const webSystemAndArchitecture = byRange(81, 100);

export const webQuestions = webAllQuestions;