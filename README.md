# Kensington Konnect™ Electron App E2E Testing

This project uses **Jest** and **Puppeteer** to perform end-to-end (E2E) automated testing for the Kensington Konnect™ Electron application.
It supports cross-platform (macOS/Windows) launching of the Electron App, and automatically manages the test flow, screenshots, and test resources.

---

## Table of Contents
- [Installation](#installation)
- [Environment Variables & Cross-Platform Setup](#environment-variables--cross-platform-setup)
- [Running Tests](#running-tests)

---

## Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

---

## Environment Variables & Cross-Platform Setup

- Copy `.env.mac.example` and `.env.win.example` in the root directory, and rename them to `.env.mac` and `.env.win` respectively.
- **Important:** Make sure to properly define all parameters in the env files according to your environment. These variables are environment-specific and required for the tests to run correctly.

---

## Running Tests

- **macOS:**
  ```bash
  npm run test:mac
  ```

- **Windows:**
  ```bash
  npm run test:win
  ```

- The tests will automatically launch the Electron App, wait for the application to be ready, and connect via Puppeteer for automated operations.

---
