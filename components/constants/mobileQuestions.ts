import { Question } from "../../types";

export const mobileAllQuestions: Question[] = [
  { id: 'mob_1', title: 'Native vs Cross-Platform vs Hybrid', difficulty: 'Concept', link: 'https://www.geeksforgeeks.org/native-vs-hybrid-vs-cross-platform-app-development/' },
  { id: 'mob_2', title: 'Explain the React Native Bridge', difficulty: 'Medium', link: 'https://reactnative.dev/docs/architecture-overview' },
  { id: 'mob_3', title: 'Activity Lifecycle in Android', difficulty: 'Easy', link: 'https://developer.android.com/guide/components/activities/activity-lifecycle' },
  { id: 'mob_4', title: 'State Management in Flutter (Provider/Riverpod)', difficulty: 'Medium', link: 'https://docs.flutter.dev/data-and-backend/state-mgmt/options' },
  { id: 'mob_5', title: 'App Sandboxing & Permissions', difficulty: 'Concept', link: 'https://source.android.com/docs/security/app-sandbox' },

  { id: 'mob_6', title: 'Flutter Widgets: Stateless vs Stateful', difficulty: 'Easy', link: 'https://docs.flutter.dev/ui/widgets-intro' },
  { id: 'mob_7', title: 'Explain Dart Futures, async & await', difficulty: 'Medium', link: 'https://dart.dev/codelabs/async-await' },
  { id: 'mob_8', title: 'Android Architecture Components (ViewModel, LiveData)', difficulty: 'Medium', link: 'https://developer.android.com/topic/libraries/architecture' },
  { id: 'mob_9', title: 'Explain Jetpack Compose basics', difficulty: 'Easy', link: 'https://developer.android.com/jetpack/compose' },
  { id: 'mob_10', title: 'What is APK/AAB and how they differ?', difficulty: 'Concept', link: 'https://developer.android.com/guide/app-bundle' },

  { id: 'mob_11', title: 'Fragment Lifecycle in Android', difficulty: 'Medium', link: 'https://developer.android.com/guide/fragments/lifecycle' },
  { id: 'mob_12', title: 'Explain Navigator 1.0 vs 2.0 in Flutter', difficulty: 'Medium', link: 'https://docs.flutter.dev/ui/navigation' },
  { id: 'mob_13', title: 'What is Hot Reload vs Hot Restart?', difficulty: 'Easy', link: 'https://docs.flutter.dev/development/tools/hot-reload' },
  { id: 'mob_14', title: 'Explain Expo vs Bare React Native', difficulty: 'Medium', link: 'https://docs.expo.dev/introduction/managed-vs-bare/' },
  { id: 'mob_15', title: 'Android Intents & Intent Filters', difficulty: 'Medium', link: 'https://developer.android.com/guide/components/intents-filters' },

  { id: 'mob_16', title: 'iOS App Lifecycle', difficulty: 'Medium', link: 'https://developer.apple.com/documentation/uikit/app_and_scenes' },
  { id: 'mob_17', title: 'Explain MVVM vs MVC in Mobile Apps', difficulty: 'Concept', link: 'https://developer.android.com/topic/architecture' },
  { id: 'mob_18', title: 'What is Gradle in Android?', difficulty: 'Easy', link: 'https://developer.android.com/build' },
  { id: 'mob_19', title: 'React Native Gesture Handling & Reanimated', difficulty: 'Medium', link: 'https://reactnative.dev/docs/handling-touches' },
  { id: 'mob_20', title: 'Flutter Rendering Pipeline', difficulty: 'Hard', link: 'https://docs.flutter.dev/resources/inside-flutter' },

  { id: 'mob_21', title: 'Platform Channels in Flutter', difficulty: 'Hard', link: 'https://docs.flutter.dev/platform-integration/platform-channels' },
  { id: 'mob_22', title: 'Explain Flutter Build Modes: debug, profile, release', difficulty: 'Easy', link: 'https://docs.flutter.dev/testing/build-modes' },
  { id: 'mob_23', title: 'State Management in React Native (Redux/Recoil/MobX)', difficulty: 'Medium', link: 'https://reactnative.dev/docs/state-management' },
  { id: 'mob_24', title: 'APK Signing and Keystore', difficulty: 'Medium', link: 'https://developer.android.com/studio/publish/app-signing' },
  { id: 'mob_25', title: 'Explain Push Notification Workflow', difficulty: 'Medium', link: 'https://firebase.google.com/docs/cloud-messaging' },

  { id: 'mob_26', title: 'SQLite vs Room (Android)', difficulty: 'Medium', link: 'https://developer.android.com/training/data-storage/room' },
  { id: 'mob_27', title: 'Hive vs SharedPreferences in Flutter', difficulty: 'Medium', link: 'https://docs.flutter.dev/data-and-backend/state-mgmt/simple' },
  { id: 'mob_28', title: 'Security: Root/Jailbreak detection', difficulty: 'Hard', link: 'https://source.android.com/docs/security' },
  { id: 'mob_29', title: 'CI/CD for Mobile Apps (Fastlane, App Center)', difficulty: 'Hard', link: 'https://docs.fastlane.tools' },
  { id: 'mob_30', title: 'Explain App Center Crashlytics/Sentry', difficulty: 'Medium', link: 'https://firebase.google.com/docs/crashlytics' },

  { id: 'mob_31', title: 'Localization & Internationalization in Mobile', difficulty: 'Medium', link: 'https://developer.android.com/guide/topics/resources/localization' },
  { id: 'mob_32', title: 'App Launch Time Optimization', difficulty: 'Hard', link: 'https://developer.android.com/topic/performance/vitals/launch-time' },
  { id: 'mob_33', title: 'Flutter Isolates & Multi-threading', difficulty: 'Hard', link: 'https://docs.flutter.dev/perf/memory' },
  { id: 'mob_34', title: 'React Native Performance Optimization', difficulty: 'Hard', link: 'https://reactnative.dev/docs/optimizing-flatlist-configuration' },
  { id: 'mob_35', title: 'Explain WorkManager & Background Tasks', difficulty: 'Medium', link: 'https://developer.android.com/topic/libraries/architecture/workmanager' },

  { id: 'mob_36', title: 'Deep Linking in Android & iOS', difficulty: 'Hard', link: 'https://developer.android.com/training/app-links/deep-linking' },
  { id: 'mob_37', title: 'Universal Links & App Links', difficulty: 'Medium', link: 'https://developer.apple.com/ios/universal-links/' },
  { id: 'mob_38', title: 'Explain App Sandbox and Secure Storage', difficulty: 'Medium', link: 'https://developer.apple.com/documentation/security/app_sandbox' },
  { id: 'mob_39', title: 'Memory Leaks in Android & debugging tools', difficulty: 'Hard', link: 'https://developer.android.com/studio/profile/memory-profiler' },
  { id: 'mob_40', title: 'ANR (App Not Responding) detection and fix', difficulty: 'Hard', link: 'https://developer.android.com/topic/performance/vitals/anr' },

  { id: 'mob_41', title: 'Flutter Rendering vs Layout phases', difficulty: 'Hard', link: 'https://docs.flutter.dev/resources/inside-flutter' },
  { id: 'mob_42', title: 'R8/ProGuard minification', difficulty: 'Hard', link: 'https://developer.android.com/studio/build/shrink-code' },
  { id: 'mob_43', title: 'Jetpack DataStore vs SharedPreferences', difficulty: 'Medium', link: 'https://developer.android.com/topic/libraries/architecture/datastore' },
  { id: 'mob_44', title: 'Kotlin Coroutines & Flow', difficulty: 'Medium', link: 'https://kotlinlang.org/docs/coroutines-overview.html' },
  { id: 'mob_45', title: 'Swift UI Basics', difficulty: 'Medium', link: 'https://developer.apple.com/xcode/swiftui/' },

  { id: 'mob_46', title: 'Native Modules in React Native', difficulty: 'Hard', link: 'https://reactnative.dev/docs/native-modules-intro' },
  { id: 'mob_47', title: 'Flutter CustomPainter & Canvas API', difficulty: 'Hard', link: 'https://api.flutter.dev/flutter/rendering/CustomPainter-class.html' },
  { id: 'mob_48', title: 'Explain ViewBinding vs DataBinding', difficulty: 'Medium', link: 'https://developer.android.com/topic/libraries/view-binding' },
  { id: 'mob_49', title: 'App Permissions Model in iOS vs Android', difficulty: 'Medium', link: 'https://developer.android.com/guide/topics/permissions/overview' },
  { id: 'mob_50', title: 'Battery Optimization for mobile apps', difficulty: 'Hard', link: 'https://developer.android.com/topic/performance/power' },

  { id: 'mob_51', title: 'Device Storage Types: Internal vs External', difficulty: 'Easy', link: 'https://developer.android.com/training/data-storage' },
  { id: 'mob_52', title: 'Handling Foreground & Background services', difficulty: 'Medium', link: 'https://developer.android.com/guide/components/services' },
  { id: 'mob_53', title: 'Offline First Architecture', difficulty: 'Hard', link: 'https://firebase.google.com/docs/firestore/manage-data/enable-offline' },
  { id: 'mob_54', title: 'Testing in Flutter (widget/unit/integration)', difficulty: 'Medium', link: 'https://docs.flutter.dev/testing' },
  { id: 'mob_55', title: 'Testing in React Native (Jest/Detox)', difficulty: 'Medium', link: 'https://reactnative.dev/docs/testing-overview' },

  { id: 'mob_56', title: 'Accessibility (a11y) in Mobile Apps', difficulty: 'Medium', link: 'https://developer.android.com/guide/topics/ui/accessibility' },
  { id: 'mob_57', title: 'Animations in Flutter (Implicit vs Explicit)', difficulty: 'Medium', link: 'https://docs.flutter.dev/ui/animations' },
  { id: 'mob_58', title: 'React Native Animation using Reanimated', difficulty: 'Hard', link: 'https://docs.swmansion.com/react-native-reanimated/' },
  { id: 'mob_59', title: 'Flutter Navigator & Routing Strategies', difficulty: 'Medium', link: 'https://docs.flutter.dev/ui/navigation' },
  { id: 'mob_60', title: 'Explain Live Activities & Widgets on iOS', difficulty: 'Hard', link: 'https://developer.apple.com/live-activities/' },

  { id: 'mob_61', title: 'Firebase Authentication in Mobile', difficulty: 'Easy', link: 'https://firebase.google.com/docs/auth' },
  { id: 'mob_62', title: 'Firestore vs Realtime Database', difficulty: 'Medium', link: 'https://firebase.google.com/docs/database/rtdb-vs-firestore' },
  { id: 'mob_63', title: 'Push Notifications with FCM/APNs', difficulty: 'Hard', link: 'https://firebase.google.com/docs/cloud-messaging' },
  { id: 'mob_64', title: 'Auth Flows: OTP, Email, Social Login', difficulty: 'Medium', link: 'https://firebase.google.com/docs/auth/web/start' },
  { id: 'mob_65', title: 'Secure Token Handling in Mobile Apps', difficulty: 'Hard', link: 'https://auth0.com/docs/secure/tokens' },

  { id: 'mob_66', title: 'Micro-Frontend Architecture in Mobile?', difficulty: 'Hard', link: 'https://martinfowler.com/articles/micro-frontends.html' },
  { id: 'mob_67', title: 'Hybrid Rendering (RN + Native Views)', difficulty: 'Hard', link: 'https://reactnative.dev/docs/embedded-app' },
  { id: 'mob_68', title: 'Flutter Web vs Mobile Differences', difficulty: 'Medium', link: 'https://docs.flutter.dev/platform-integration/web' },
  { id: 'mob_69', title: 'KMM (Kotlin Multiplatform Mobile) Overview', difficulty: 'Medium', link: 'https://kotlinlang.org/lp/mobile/' },
  { id: 'mob_70', title: 'Compose Multiplatform Overview', difficulty: 'Medium', link: 'https://www.jetbrains.com/lp/compose-multiplatform/' },

  { id: 'mob_71', title: 'App Size Optimization Techniques', difficulty: 'Hard', link: 'https://developer.android.com/topic/performance/reduce-apk-size' },
  { id: 'mob_72', title: 'Handling Network Failures gracefully', difficulty: 'Medium', link: 'https://square.github.io/retrofit/' },
  { id: 'mob_73', title: 'Caching Strategies for Mobile Apps', difficulty: 'Hard', link: 'https://developer.android.com/training/volley/requestqueue' },
  { id: 'mob_74', title: 'Lazy Loading & Pagination in Mobile UI', difficulty: 'Easy', link: 'https://developer.android.com/topic/performance/vitals/render' },
  { id: 'mob_75', title: 'Infinite Scroll vs Paginated API calls', difficulty: 'Concept', link: 'https://developer.android.com/topic/performance/vitals' },

  { id: 'mob_76', title: 'Camera & Media Access Permissions', difficulty: 'Easy', link: 'https://developer.android.com/training/camera' },
  { id: 'mob_77', title: 'Handling different screen sizes & DPI', difficulty: 'Medium', link: 'https://developer.android.com/training/multiscreen' },
  { id: 'mob_78', title: 'Flutter Adaptive Layout & ResponsiveBuilder', difficulty: 'Medium', link: 'https://docs.flutter.dev/ui/layout/responsive' },
  { id: 'mob_79', title: 'Android Material Design Guidelines', difficulty: 'Medium', link: 'https://m3.material.io/develop/android' },
  { id: 'mob_80', title: 'Cupertino Widgets in Flutter (iOS Look)', difficulty: 'Medium', link: 'https://docs.flutter.dev/ui/widgets/cupertino' },

  { id: 'mob_81', title: 'Biometric Authentication (FaceID/Fingerprint)', difficulty: 'Hard', link: 'https://developer.android.com/training/sign-in/biometric-auth' },
  { id: 'mob_82', title: 'Secure Encrypted Storage in Mobile', difficulty: 'Hard', link: 'https://developer.android.com/topic/security/data' },
  { id: 'mob_83', title: 'In-App Purchases & Subscriptions', difficulty: 'Hard', link: 'https://developer.android.com/google/play/billing' },
  { id: 'mob_84', title: 'App Store Review Guidelines', difficulty: 'Medium', link: 'https://developer.apple.com/app-store/review/guidelines/' },
  { id: 'mob_85', title: 'Play Console Deployment Flow', difficulty: 'Medium', link: 'https://developer.android.com/distribute/console' },

  { id: 'mob_86', title: 'Explain Kotlin vs Dart differences', difficulty: 'Concept', link: 'https://kotlinlang.org/docs/comparison-to-java.html' },
  { id: 'mob_87', title: 'Memory Optimization in Flutter', difficulty: 'Hard', link: 'https://docs.flutter.dev/perf/memory' },
  { id: 'mob_88', title: 'Hermes Engine in React Native', difficulty: 'Hard', link: 'https://reactnative.dev/docs/hermes' },
  { id: 'mob_89', title: 'Mobile Backend: Firebase vs Supabase', difficulty: 'Medium', link: 'https://firebase.google.com/docs' },
  { id: 'mob_90', title: 'GraphQL in Mobile Apps with Apollo/Hasura', difficulty: 'Medium', link: 'https://www.apollographql.com/docs/' },

  { id: 'mob_91', title: 'Handling Offline Sync & Conflict resolution', difficulty: 'Hard', link: 'https://firebase.google.com/docs/firestore/manage-data/enable-offline' },
  { id: 'mob_92', title: 'Feature Flagging in Mobile Apps', difficulty: 'Medium', link: 'https://docs.launchdarkly.com/home' },
  { id: 'mob_93', title: 'App Telemetry and Analytics (Mixpanel, GA)', difficulty: 'Medium', link: 'https://firebase.google.com/docs/analytics' },
  { id: 'mob_94', title: 'Designing Battery Efficient Location Tracking', difficulty: 'Hard', link: 'https://developer.android.com/training/location' },
  { id: 'mob_95', title: 'React Native New Architecture (Fabric & TurboModules)', difficulty: 'Hard', link: 'https://reactnative.dev/docs/the-new-architecture/landing-page' },

  { id: 'mob_96', title: 'ARCore & ARKit basics', difficulty: 'Hard', link: 'https://developers.google.com/ar' },
  { id: 'mob_97', title: 'Flutter Flame Game Engine Basics', difficulty: 'Medium', link: 'https://docs.flame-engine.org/' },
  { id: 'mob_98', title: 'Foldable & Tablet Screen Adaptation', difficulty: 'Hard', link: 'https://developer.android.com/large-screens/foldables' },
  { id: 'mob_99', title: 'Real-Time Messaging in Mobile Apps (WebSockets)', difficulty: 'Medium', link: 'https://ably.com/topic/websockets' },
  { id: 'mob_100', title: 'Designing Scalable Mobile Architecture', difficulty: 'Hard', link: 'https://developer.android.com/topic/architecture' },
];

// helper to slice by numeric part of id
const byRange = (from: number, to: number): Question[] =>
  mobileAllQuestions.filter(q => {
    const n = Number(q.id.split('_')[1]);
    return n >= from && n <= to;
  });

// 3 tracks similar idea as web
export const mobileFundamentals = byRange(1, 40);           // basics, lifecycle, widgets, navigation
export const mobileAdvanced = byRange(41, 80);              // perf, rendering, testing, a11y, UX
export const mobileSystemAndArchitecture = byRange(81, 100); // security, backend, sync, arch, advanced topics

// keep old name for backwards compatibility
export const mobileQuestions = mobileAllQuestions;