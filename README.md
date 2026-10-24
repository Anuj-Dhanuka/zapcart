# zapcart

An Amazon-style product listing and detail app built with React, TypeScript and the [DummyJSON products API](https://dummyjson.com/docs/products). It was built as the Front End Developer (ReactJS) take-home assessment for Leegality.

**Live demo:** [zapcart-anuj.netlify.app](https://zapcart-anuj.netlify.app/)

## Features

- **Product listing (`/`)**
  - Product cards showing image, title, price and rating.
  - Filters by **category** (multi-select), **price range** and **brand**. Filters combine with each other and reset to page 1.
  - **Search** in the header, matching title or brand.
  - **Pagination** with 12 products per page, in a sticky bar that shows "Showing 1–12 of 194".
  - Loading, error (with retry) and empty states.
- **Product detail (`/product/:id`)**
  - Image gallery, name, price, rating, availability, brand, category, description and reviews.
  - **Back** returns to the listing with the same filters and scroll position.
- **Cart** (Redux Toolkit)
  - Add to cart from a product card or from the sticky buy bar on the detail page.
  - Quantity stepper on cards and on the detail page. At 1, the minus becomes a remove (trash) button.
  - Slide-in cart drawer.
  - The cart is saved across visits.
- **Light and dark mode**
  - Follows the system setting until you choose, then remembers the choice.
  - No flash of the wrong theme on load.
- **Responsive and accessible**
  - Works on phones and desktops.
  - Keyboard and screen-reader friendly.
  - WCAG AA colour contrast in both themes.

## Beyond the mockup

The assessment's mockup shows the header (☰, search, cart and account icons), a filter sidebar, the product grid with Previous/Next pagination, and a detail page with Back, image, price, rating, brand, category, description and reviews. These were added on top of it:

| Added | Where | Why |
| --- | --- | --- |
| **Working cart**: Add to cart, quantity stepper (trash at 1), count badge, slide-in drawer with subtotal, saved across visits | Cards, detail page, header | The mockup has a cart icon but no way to use it; it also shows Redux state management |
| **Sticky buy bar** with price and Add to cart | Detail page | Keeps the main action one tap away while reading, as production stores do |
| **Image gallery** with thumbnails | Detail page | Most products have several images (up to 6); the mockup shows one |
| **Availability** ("In stock", "Low stock", "Out of stock") | Detail page, cards (disabled button) | Stops shoppers adding products that can't be bought |
| **Clear buttons**: per filter, plus "Clear all" with a count of active filters | Filter sidebar | Undoing several filters one tick at a time is slow |
| **Sticky pagination bar** with "Showing 1–12 of 194" and First/Last buttons | Listing | Keeps paging reachable and shows where you are |
| **Light and dark mode** switch | Header | Comfort and accessibility; follows the system setting by default |
| **Phone layout**: filters in a slide-in panel with "Show N products", search on its own row | Listing, header | The mockup is desktop-only |
| **Empty, error, "not found" and crash pages** with a way out | Everywhere | The spec asks for loading and error handling; these cover every case |
| **Review dates**, best-rated first | Detail page | More useful ordering, with no review hidden |

**Mockup elements deliberately left out:**
- **The account and order icons** in the header: there is no login in this app, so they would lead nowhere.
- **The second search box** in the sidebar: a single search in the header avoids two boxes that do the same thing.
- **Pagination on the detail page**: it has nothing to page through, so it was treated as a leftover in the mockup.

## Setup

**Requirements:** Node.js `^20.19.0` or `>=22.12.0` (required by Vite 8) and npm. No API key or environment variables are needed; the app calls the public DummyJSON API.

```bash
git clone https://github.com/Anuj-Dhanuka/zapcart.git
cd zapcart
npm install
npm run dev          # http://localhost:5173
```

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server with hot reload |
| `npm run build` | Type-check (`tsc -b`) and build to `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm test` | Unit tests in watch mode (`npx vitest run` runs them once) |
| `npm run lint` | ESLint |

**Deploying:** the live demo is on Netlify, set up by `netlify.toml` (build command, `dist` folder, Node 22). Because this is a single-page app, the host must serve `index.html` for every path; `netlify.toml` does that, so refreshing `/product/42` works instead of returning a 404.

## Assumptions made

1. **Several categories can be selected at once.** The mockup shows category checkboxes. The API only filters one category per request, so each selected category is fetched in parallel (`Promise.all`) and the results are merged. If any one request fails, the whole result is an error rather than a partial list. No category selected means all products.
2. **Price applies on "Apply" or Enter, not on every keystroke.** The spec says filters update immediately, but the mockup has an Apply button. Applying explicitly avoids results jumping while you type "1500". Invalid input (letters, or min greater than max) shows an inline error and isn't applied.
3. **Brands come from the loaded products.** There is no brands endpoint, so the brand list is built from the products of the selected categories. It's built from all of them, not just the filtered ones, so the list doesn't shrink as you tick. Products without a brand (92 of 194) are hidden once any brand is selected. A selected brand that isn't in the current categories stays visible, so it can be unticked.
4. **Price, brand, search and pagination are done in the browser.** The API can't filter by price or brand, and its search can't be combined with a category. With 194 products (about 46 KB when only the needed fields are requested) this is instant.
5. **Search works on title or brand.** The mockup shows a search box but the spec doesn't describe it, so it matches product title or brand, case-insensitive.
   - On the listing it updates 300 ms after you stop typing. On other pages it waits for Enter.
   - "Clear all" filters keeps the search text, because search isn't one of the sidebar filters.
6. **Filters live in the URL** (`?category=laptops&min=500&page=2`). This is what makes Back keep the filters, and it also lets you refresh or share a filtered view. Invalid values in the URL are ignored safely. A page number past the end is corrected to the last page.
7. **12 products per page.** 12 divides evenly into the 2, 3 and 4-column layouts.
8. **Prices are in US dollars**, as returned by the API.
9. **All reviews are shown, sorted best first.** Negative reviews are never hidden: suppressing them is prohibited by the US FTC's 2024 consumer-reviews rule and treated as misleading under India's CCPA guidelines, and it damages trust.
10. **The cart is a demo.**
    - The price is stored as it was when the item was added.
    - The quantity is limited to 10 per item.
    - The cart is kept in `localStorage`.
    - Checkout is out of scope, and the drawer says so.
11. **Out-of-stock products can't be added.** The API's `availabilityStatus` is shown as "In stock", "Low stock" or "Out of stock", and out-of-stock products get a disabled button.
12. **The mockup's blue was deepened** from `#3a8ff2` to `#0f73e8`, so white text on it meets WCAG AA (4.53:1 instead of 3.29:1).
13. **Product photos keep a white frame in dark mode**, because they are shot on white backgrounds.

## Architectural decisions

### Stack

| | Choice | Why |
| --- | --- | --- |
| UI | React 19 + TypeScript (strict) | Function components and hooks, as the brief asks |
| Build | Vite 8 | Fast dev server and builds |
| Routing | React Router 8 (data router) | Route-level error boundaries, scroll restoration |
| Global state | Redux Toolkit 2 + React Redux 9 | Used only for the cart (see below) |
| Styling | CSS Modules + design tokens | Scoped styles, no UI library, one source for colours and spacing |
| Tests | Vitest | Fast, Vite-native unit tests |

There are only four runtime dependencies: React, React DOM, React Router and Redux Toolkit/React Redux.

### Folder structure

```
src/
├── main.tsx            # Redux store + router
├── app/                # router, root layout, header, theme toggle
├── pages/              # thin route components: list, detail, not found, error
├── features/
│   ├── products/       # API calls, types, pure filter logic, hooks, product components
│   └── cart/           # Redux slice, localStorage persistence, cart components
├── store/              # store setup and typed hooks
├── components/         # shared UI with no product knowledge (pagination, stepper, spinner…)
├── hooks/              # generic hooks: useAsync, useMediaQuery, useTheme
├── lib/                # http client, formatters, storage, theme helpers
└── styles/             # design tokens and global styles
```

- **Imports flow one way:** shared code → features → pages → app.
- **The two features don't import each other.** A page composes them. For example, the listing page passes the cart's button into the product grid through a `renderAction` prop.
- **There are no barrel files** (`index.ts` re-exports), and nesting stays shallow.

### State: each kind of state lives in one place

- **Filters, search and page live in the URL**, not in React state or Redux.
  - **What that gives:** the browser's Back button, refresh and shareable links all work for free.
  - **History:** filter changes replace the history entry, so Back leaves the listing instead of undoing each tick. Page links add an entry, so Back goes to the previous page.
- **Server data** comes from a small custom hook, `useAsync`.
  - **Loading isn't stored as state; it's worked out** from whether a result exists yet for the current request. That avoids a frame of stale content.
  - Requests are cancelled with `AbortController` when they're no longer needed. There is a retry action.
  - **Product lists are cached for the session (stale-while-revalidate).** Returning from a product shows the list instantly, which is what lets Back restore the scroll position.
- **The cart lives in Redux Toolkit.**
  - It is the one piece of truly global client state: the header badge, the product cards, the detail page and the drawer all read it.
  - **The slice:** reducers enforce the rules (adding again adds 1, quantities stay between 1 and 10, setting 0 removes). Selectors compute the count and total.
  - **Persistence:** about 40 lines instead of `redux-persist`.
    - The saved cart is loaded into `preloadedState`, and every saved item is validated, since anything can be in `localStorage`.
    - The cart is saved only when the items change.
- **UI state stays local** (React state or context): whether a panel is open, which gallery image is selected, the theme.

### Accessibility

- **Semantic HTML** throughout.
  - Real `<button>` and `<a>` elements, labelled `<fieldset>`/`<legend>` filter groups, and landmarks.
  - Product cards use a "stretched link", so the whole card is clickable while the link's accessible name is just the product title.
- **Native `<dialog>`** for the mobile filter panel and the cart drawer, which gives focus trapping, Escape to close and focus return.
- **Focus is managed whenever a control disappears.**
  - Adding to cart moves focus to the stepper or "View cart".
  - Removing an item moves focus back to "Add to cart".
  - Changing page focuses the results heading.
  - Clearing filters focuses the filter title.
- **Screen readers are told what changed:** "12 products found", "Added to cart", and quantity changes.
  - Repeated buttons carry the product name, e.g. "Add to cart: Red Lipstick".
- **Sticky bars never hide the focused element** (WCAG 2.2 "Focus Not Obscured"): `scroll-padding` accounts for the header and the bottom bars.
- **Colour:**
  - Every text colour pair meets WCAG AA (4.5:1) in both themes. This was checked with axe-core in Chrome.
  - Status is shown in words, not just colour.
  - Animations respect "reduce motion".
- **Every page has its own `<title>`.**

### Styling and responsive layout

- **All colours, spacing, type sizes and layout sizes are tokens** in `styles/tokens.css`. No component contains a raw colour value.
- **Dark mode** is built into the tokens with CSS `light-dark()`.
  - **No flash:** a tiny inline script in `index.html` applies the saved theme before the page first paints.
- **The product grid uses container queries,** so it picks 2, 3 or 4 columns from its own width.
  - That's why it adapts correctly when the filter sidebar opens, not just when the window resizes.
- **Phone:** filters open as a slide-in panel.
- **Desktop:** the ☰ button shows and hides an inline sidebar.

### Error handling

- **API errors** show a message with "Try again". A missing product (404) shows "Product not found" without a retry.
  - Invalid ids like `/product/abc` are rejected before any request is made.
- **Rendering crashes** are caught by route error boundaries: a friendly page appears with the header still working, instead of a blank screen. Unknown URLs get a "Page not found" page.

### Performance

- **Smaller list requests:** they ask only for the fields the cards need (`?select=…`), so the full catalogue is about 46 KB instead of 306 KB.
- **Images:**
  - Lazy-loaded.
  - Explicit width and height, so nothing shifts as they load.
- **Fast loads don't flash the spinner:** it only appears after 300 ms.
- **Little JavaScript:** there are few dependencies and no UI library, so the production JavaScript is about 120 KB gzipped.

### Testing

- **71 unit tests** (Vitest) cover the logic:
  - filtering and pagination
  - URL parsing and serialising (including junk values)
  - API calls (with a stubbed `fetch`)
  - the cart reducer and selectors
  - cart and theme persistence (including full or blocked storage)
  - page-number layout, formatting, id validation and review sorting
- **Every feature was also checked in real Chrome during development,** using Puppeteer scripts and axe-core.
  - **Checked:** keyboard flows, focus, URL behaviour, sticky positioning, layout at several widths, contrast, error states (with the API intercepted).
  - Those scripts were throwaway tools and are not part of this repo.

## Improvements if given more time

**Data and performance**
- Request timeouts (`AbortSignal.timeout`) and retry with backoff for server errors.
- Server-side filtering and pagination if the catalogue grew beyond a few hundred products.
- Prefetch a product's details when its card is hovered, so the detail page opens instantly.
- Skeleton cards instead of a spinner, and keep the previous results (dimmed) while a new category loads.
- Route-level code splitting once there are more pages.

**Features**
- **Wishlist:** a heart button on cards and the detail page to save products for later, a wishlist page or drawer reached from the header, and "Move to cart". It would be a second Redux slice saved to `localStorage` the same way as the cart.
- Sorting (price, rating), and product counts next to each brand.
- Search suggestions and highlighting of the matched text.

**Engineering**
- Error reporting (e.g. Sentry) from the error boundaries; today errors are only logged to the console.
- An API base URL from an environment variable once there is more than one environment.
