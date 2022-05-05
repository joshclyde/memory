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
- edit tag name (easy to do in firebase console)
- delete tag name (easy to do in firebase console, except what to do with flashcards?)
- ios app
- make sure flashcard actions/buttons on mobile are nice to use
- allow more than plain text for flashcards (markdown)
- order list of tags (alphabetize)
- while reviewing flashcards, would like an option to either edit or mark as need more work done
- upload svg for a tag

#### 🎨 Style

- pick a color pallete
- dark theme
- styles on mobile
- styles in general
- make a favicon
- once you get a lot of tags, the review page is a long scroll. could def condense this.

#### 🏆 Code Quality

- url utilities

### 🔎 "Smart" flashcards

- i'm gonna get a lot of flashcards, and it'll probs be hours to go through every one, so having some
  way to know how i'm doing would be useful
- tracking if the user is succeeding/failing at each flashcard
- presenting this data in some useful way

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

### Customize the configuration

See [Configuring quasar.config.js](https://v2.quasar.dev/quasar-cli-vite/quasar-config-js).
