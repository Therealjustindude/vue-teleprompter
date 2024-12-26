# Vue-Teleprompter

A feature-rich teleprompter application built with Vue 3, Pinia, and Vite. This project includes customizable text scrolling, dynamic speed control, text resizing, drag-and-drop functionality, and an estimated reading time display.

[Vue-Telepromter site](vue-teleprompter.vercel.app)

---

## Features

- Customizable text scrolling speed
- Real-time text resizing
- Drag-and-drop functionality
- Estimated reading time display
- Supports both mouse and touch inputs

---

## Project Setup

pnpm:

```sh
pnpm install
```

npm:

```sh
npm install
```

### Compile and Hot-Reload for Development

pnpm:

```sh
pnpm dev
```

npm:

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

pnpm:

```sh
pnpm build
```

npm:

```sh
npm  run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

pnpm:

```sh
pnpm test:unit
```

npm:

```sh
npm run test:unit
```

### Run End-to-End Tests with [Playwright](https://playwright.dev)

```sh
# Install browsers for the first run
npx playwright install
```

pnpm:

```sh
# When testing on CI, must build the project first
pnpm build

# Runs the end-to-end tests
pnpm test:e2e
# Runs the tests only on Chromium
pnpm test:e2e --project=chromium
# Runs the tests of a specific file
pnpm test:e2e tests/example.spec.ts
# Runs the tests in debug mode
pnpm test:e2e --debug
```

npm:

```sh
# When testing on CI, must build the project first
npm run build

# Runs the end-to-end tests
npm run test:e2e
# Runs the tests only on Chromium
npm run test:e2e --project=chromium
# Runs the tests of a specific file
npm run test:e2e tests/example.spec.ts
# Runs the tests in debug mode
npm run test:e2e --debug
```

### Lint with [ESLint](https://eslint.org/)

pnpm:

```sh
pnpm lint
```

npm:

```sh
npm run lint
```

---

### Feedback Welcome!

I'd love to hear your thoughts on:

- Should recording stop automatically at the end of the script?
- Is CSS `translateY` better than `scrollTop` for teleprompter scrolling?

Feel free to open an issue or start a discussion!

---

## Challenges and Lessons Learned

While developing the teleprompter component, I encountered several challenges that deepened my understanding of Vue, event handling, performance optimization, and user experience considerations. Below are the key challenges I faced and the lessons I learned from each.

#### 1. Event Listeners Interfering with Resize Behavior

##### Challenge:

I added event listeners for mousedown, mousemove, mouseup, touchstart, touchmove, and touchend to handle drag and movement events. However, these event listeners interfered with the default browser behavior for resizing elements via the resize handle.

##### Solution:

I adjusted event listeners to only handle specific elements instead of capturing events globally on the container. Additionally, I ensured that resize-related events were left untouched.

#### 2. TypeScript Errors When Destructuring Store Refs

##### Challenge:

While working with Pinia stores, I attempted to destructure ref properties from the store directly, like this:

```
const { isPlaying, scrollSpeed } = useTeleprompterStore()
```

This approach caused TypeScript errors because destructuring loses the reactivity of the ref properties.

##### Solution:

I replaced direct destructuring with accessing reactive properties using the store reference itself.

```
const teleprompterStore = useTeleprompterStore()
teleprompterStore.isPlaying
teleprompterStore.scrollSpeed
```

#### 3. Scroll Speed Conflicts with scroll-behavior: smooth

##### Challenge:

I noticed inconsistent scroll speeds when using requestAnimationFrame in combination with the CSS property scroll-behavior: smooth.

scroll-behavior: smooth caused browser-level smooth scrolling animations that conflicted with manual pixel-based updates (scrollTop) performed in requestAnimationFrame.

##### Solution:

I removed scroll-behavior: smooth

#### 4. Ambiguity Around Recording Behavior at Script End

##### Challenge:

When the teleprompter reaches the end of the script, I’m unsure if recording should automatically stop or if the user should have control over this.

##### Current Behavior:

• The recording does not automatically stop when the teleprompter reaches the end.
• I leaned towards giving the user manual control to decide when to stop recording.

##### Open Question:

• Should the recording stop automatically when the script ends, or should the user have to stop it manually?
• If the user wants to add closing remarks after the script ends, an automatic stop might interrupt their flow.

#### 5. Accuracy of Estimated Reading Time – Should I Change the Scrolling Approach?

##### Challenge:

The estimated reading time is currently calculated based on the word count and a speed factor tied to the speed slider. However, the text scrolling itself relies on requestAnimationFrame and updates to scrollTop. This creates inconsistencies, especially at slower speeds, making the reading time less reliable.

##### Open Question:

• Should I switch from scrollTop-based scrolling to translateY (CSS transform) for smoother and more predictable scrolling behavior?
• Would using CSS transforms (translateY) make it easier to sync scrolling with timing and speed control?

##### Current Behavior:

• Scrolling uses requestAnimationFrame to increment scrollTop based on the slider value.
• Lower slider values (<0.8) accumulate fractional increments, which aren’t always reflected visually due to how scrollTop handles sub-pixel values.
• The estimated reading time relies on assumptions about words-per-second speeds, but pixel-based scrolling doesn’t map directly to words.

#### 6. Parsing and Displaying Tokens in the Teleprompter

##### Challenge:

During the development of the teleprompter, I encountered significant challenges in parsing the script, managing tokens, and displaying text accurately while triggering events at the right time.

##### Current approach:

Right now, the script is parsed into:

lines: An array of clean text lines (edit content).
events: A list of token events (image, camera) tied to specific line indexes.
words: An array of individual words from the script.

```
{
  cleanText: "What's in store for the housing market...",
  lines: ["What's in store...", "Lemme break it down..."],
  events: [
    { type: 'image', index: 1, id: '602864342381', url: 'example.jpg' },
    { type: 'camera', index: 2, id: 'mN5FA4XMuR' }
  ]
}
```

##### Problems with This Approach:

Visibility Detection Complexity: Determining when a specific line is visible (rect.top, scrollTop) adds layers of complexity.
Rendering Limitations: Rendering all lines as <p> elements works for visibility detection but doesn’t feel robust for accurately triggering events.
Ambiguity in Token Placement: Some tokens (image, camera) feel disconnected from the scrolling behavior, making event timing imprecise.

---

## Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.

## License

This project is licensed under the MIT License.
