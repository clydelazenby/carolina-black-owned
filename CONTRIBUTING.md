# Contributing to Carolina Black Owned

Thank you for your interest in contributing to the Carolina Black Owned directory! This document provides guidelines for contributing to the project.

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment. We are committed to providing a welcoming and inspiring community for all.

## Getting Started

### Prerequisites

- Node.js v14 or higher
- npm or yarn
- Git

### Setup

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/carolina-black-owned.git
   cd carolina-black-owned
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm start
   ```

## Development Workflow

### Branch Naming

- `feature/` - New features (e.g., `feature/user-profile`)
- `fix/` - Bug fixes (e.g., `fix/login-validation`)
- `docs/` - Documentation updates (e.g., `docs/api-readme`)
- `refactor/` - Code refactoring (e.g., `refactor/redux-store`)

### Commit Messages

Follow the conventional commits format:

```
type(scope): description

[optional body]

[optional footer]
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Code style (formatting, missing semicolons, etc.)
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

Examples:
```
feat(dashboard): add analytics overview cards
fix(auth): resolve token expiration handling
docs(readme): update installation instructions
```

### Pull Request Process

1. Create a feature branch from `main`
2. Make your changes following the coding standards
3. Write/update tests as needed
4. Update documentation if applicable
5. Submit a pull request with a clear description
6. Wait for code review and address feedback

## Coding Standards

### JavaScript/React

- Use functional components with hooks
- Follow ESLint configuration
- Use meaningful variable and function names
- Add PropTypes or TypeScript types for components
- Keep components small and focused

### CSS/Styling

- Use Tailwind CSS utilities where possible
- Follow BEM naming convention for custom CSS
- Maintain responsive design principles
- Support dark mode where applicable

### Redux

- Keep actions and reducers in separate files
- Use action creators for all dispatches
- Follow the existing state structure
- Document complex state transformations

## Testing

- Write unit tests for utility functions
- Write integration tests for critical user flows
- Test edge cases and error states
- Maintain minimum 80% code coverage

Run tests:
```bash
npm test
```

## Documentation

- Document all public APIs
- Add JSDoc comments to functions
- Update README for new features
- Keep ROADMAP.md current

## Project Structure

```
/src
├── /markup              # UI Components
│   ├── /Layout          # Header, Footer
│   ├── /Pages           # Page components
│   └── /Element         # Reusable components
├── /store               # Redux state
│   ├── /actions         # Action creators
│   ├── /reducers        # State reducers
│   └── /selectors       # State selectors
├── /services            # API calls
├── /hooks               # Custom hooks
└── /css                 # Stylesheets
```

## Feature Requests

To suggest new features:

1. Check existing issues to avoid duplicates
2. Open a new issue with the `feature-request` label
3. Provide clear description and use cases
4. Be open to discussion and feedback

## Bug Reports

To report bugs:

1. Check existing issues to avoid duplicates
2. Open a new issue with the `bug` label
3. Include:
   - Steps to reproduce
   - Expected behavior
   - Actual behavior
   - Browser/device information
   - Screenshots if applicable

## Questions

For questions about the codebase or development:

1. Check existing documentation
2. Search closed issues
3. Open a new issue with the `question` label

## Recognition

Contributors will be recognized in the project's README and release notes.

Thank you for contributing to Carolina Black Owned!
