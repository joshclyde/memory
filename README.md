# Memory (memory)

A memory project

Explain the useState hook and the syntax.

## 📝 Backlog

### 🔥 Important Features

- backups of data
- firebase permissions. (make sure only user can access and edit their data)
- firebase emulators (going to get more important as I use production more)

### 🆕 Features

#### 🤖 Functionality

- delete flashcard
- keyboard shortcuts
- randomize flashcard order?
- delete tag name (easy to do in firebase console, except what to do with flashcards?)
- ios app
- make sure flashcard actions/buttons on mobile are nice to use
- make edit flashcard page easier to use
  - on desktop, have the list view and form view next to each other instead of separate pages
  - on mobile, have a back button. maybe after editing the flashcard go back to list view
  - persist the filters somehow so that when going back to the page the user is at the same spot
- allow more than plain text for flashcards (markdown)
- order list of tags (alphabetize)
- while reviewing flashcards, would like an option to either edit or mark as need more work done
- upload svg for a tag
- firebase authentication UI library (https://github.com/firebase/firebaseui-web)

#### 🎨 Style

- once you get a lot of tags, the review page is a long scroll. could def condense this.
- pick a color pallete
- dark theme
- styles on mobile
- styles in general
- make a favicon
- get rid of header and make design more similar to Bear
- customizable colors/font, similar to Bear

#### 🏆 Code Quality

- url utilities

### 🔎 "Smart" flashcards

I want to save when the user reviews a flashcard as well as whether the user performed good or bad.
Using this data, the user can then be presented with different strategies for studying, such as

- Review all flashcards you haven't reviewed for X time
- Review X amount of flashcards that you aren't perfect at
- Presenting this data in some useful way

### 🎩 Fancier flashcards

Allow more than just plain text for flashcards. Markdown would be a good option since a lot
of the flashcards are going to be code.

### 🐞 Bugs

- the "Home" page in the drawer is always highlighted
- spaces at beginning of sentence not being respected on a flashcard

### ✅ Completed

- home page. (should just move the review page to home)
- add more details to the review cards (how many flashcards)
- separation in the drawer
- conditionally display login/logout
- return characters are being removed from flashcards
- edit flashcard data
- change icons to rounded (to match the Varela Round font)
- edit tag name

## Local Development

### Install the dependencies

```bash
yarn
# or
npm install
```

### Start the app in development mode (hot-code reloading, error reporting, etc.)

```bash
quasar dev
```

### Lint the files

```bash
yarn lint
# or
npm run lint
```

### Build the app for production

```bash
quasar build
```

### Deploy to production

```bash
firebase deploy --only hosting
```

### Customize the configuration

See [Configuring quasar.config.js](https://v2.quasar.dev/quasar-cli-vite/quasar-config-js).
